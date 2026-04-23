from datetime import datetime

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.database import get_collection, serialize_document
from app.schemas.review import ReviewCreate, ReviewPublic
from app.schemas.tour import Tour, TourCreate, TourUpdate
from app.security import get_current_user, require_admin

router = APIRouter(prefix="/api/tours", tags=["tours"])


def _get_tour_or_404(tour_id: str):
    if not ObjectId.is_valid(tour_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tour not found")

    tour = get_collection("tours").find_one({"_id": ObjectId(tour_id)})
    if not tour:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tour not found")
    return tour


def _resolve_guide_payload(guide_id: str | None):
    if not guide_id:
        return {
            "guide_id": None,
            "guide_name": None,
            "guide_title": None,
            "guide_avatar": None,
            "guide_bio": None,
            "guide_experience_years": None,
        }

    if not ObjectId.is_valid(guide_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid guide id")

    guide = get_collection("users").find_one({"_id": ObjectId(guide_id), "role": "guide"})
    if not guide:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Guide not found")

    return {
        "guide_id": str(guide["_id"]),
        "guide_name": guide["name"],
        "guide_title": guide.get("guide_title"),
        "guide_avatar": guide.get("guide_avatar"),
        "guide_bio": guide.get("guide_bio"),
        "guide_experience_years": guide.get("guide_experience_years"),
    }


def _attach_review_summary(tour: dict):
    reviews_collection = get_collection("reviews")
    review_count = reviews_collection.count_documents({"tour_id": str(tour["id"])})
    rating_average = 0.0

    if review_count:
        aggregation = list(
            reviews_collection.aggregate(
                [
                    {"$match": {"tour_id": str(tour["id"])}},
                    {"$group": {"_id": None, "average_rating": {"$avg": "$rating"}}},
                ]
            )
        )
        if aggregation:
            rating_average = round(float(aggregation[0]["average_rating"]), 1)

    tour["review_count"] = review_count
    tour["rating_average"] = rating_average
    return tour


def _ensure_review_eligible(tour_id: str, user: dict):
    if user.get("role") != "user":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Chi tai khoan khach hang moi co the danh gia tour",
        )

    has_booking = get_collection("bookings").count_documents(
        {
            "tour_id": tour_id,
            "status": "confirmed",
            "$or": [
                {"user_id": user["id"]},
                {"user_email": user["email"]},
            ],
        }
    )
    if not has_booking:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Ban can co booking hop le truoc khi danh gia tour nay",
        )


@router.get("/", response_model=list[Tour])
async def get_tours(search: str | None = None, destination: str | None = None):
    filters = {}
    if search:
        filters["name"] = {"$regex": search, "$options": "i"}
    if destination:
        filters["destination"] = {"$regex": destination, "$options": "i"}

    tours = get_collection("tours").find(filters).sort("start_date", 1)
    return [_attach_review_summary(serialize_document(tour)) for tour in tours]


@router.get("/{tour_id}", response_model=Tour)
async def get_tour(tour_id: str):
    return _attach_review_summary(serialize_document(_get_tour_or_404(tour_id)))


@router.get("/{tour_id}/reviews", response_model=list[ReviewPublic])
async def get_tour_reviews(tour_id: str):
    _get_tour_or_404(tour_id)
    reviews = get_collection("reviews").find({"tour_id": tour_id}).sort("updated_at", -1)
    return [serialize_document(review) for review in reviews]


@router.get("/{tour_id}/reviews/my", response_model=ReviewPublic | None)
async def get_my_tour_review(tour_id: str, user=Depends(get_current_user)):
    _get_tour_or_404(tour_id)
    review = get_collection("reviews").find_one({"tour_id": tour_id, "user_id": user["id"]})
    return serialize_document(review) if review else None


@router.put("/{tour_id}/reviews/my", response_model=ReviewPublic)
async def upsert_my_tour_review(tour_id: str, payload: ReviewCreate, user=Depends(get_current_user)):
    _get_tour_or_404(tour_id)
    _ensure_review_eligible(tour_id, user)

    reviews_collection = get_collection("reviews")
    now = datetime.utcnow()
    existing = reviews_collection.find_one({"tour_id": tour_id, "user_id": user["id"]})

    document = {
        "tour_id": tour_id,
        "user_id": user["id"],
        "user_name": user["name"],
        "user_email": user["email"],
        "rating": payload.rating,
        "comment": payload.comment.strip(),
        "updated_at": now,
    }

    if existing:
        reviews_collection.update_one({"_id": existing["_id"]}, {"$set": document})
        saved = reviews_collection.find_one({"_id": existing["_id"]})
    else:
        document["created_at"] = now
        result = reviews_collection.insert_one(document)
        saved = reviews_collection.find_one({"_id": result.inserted_id})

    return serialize_document(saved)


@router.post("/", response_model=Tour, status_code=status.HTTP_201_CREATED)
async def create_tour(tour: TourCreate, _admin=Depends(require_admin)):
    if tour.end_date <= tour.start_date:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="End date must be after start date")
    if tour.available_slots > tour.max_participants:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Available slots cannot exceed max participants")

    now = datetime.utcnow()
    payload = tour.dict()
    payload.update(_resolve_guide_payload(payload.get("guide_id")))
    payload["created_at"] = now
    payload["updated_at"] = now

    result = get_collection("tours").insert_one(payload)
    created = get_collection("tours").find_one({"_id": result.inserted_id})
    return serialize_document(created)


@router.put("/{tour_id}", response_model=Tour)
async def update_tour(tour_id: str, tour: TourUpdate, _admin=Depends(require_admin)):
    current = _get_tour_or_404(tour_id)
    updates = tour.dict(exclude_none=True)
    if not updates:
        return serialize_document(current)

    merged = {**current, **updates}
    if merged["end_date"] <= merged["start_date"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="End date must be after start date")
    if merged["available_slots"] > merged["max_participants"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Available slots cannot exceed max participants")

    if "guide_id" in updates:
        updates.update(_resolve_guide_payload(updates.get("guide_id")))

    updates["updated_at"] = datetime.utcnow()
    get_collection("tours").update_one({"_id": current["_id"]}, {"$set": updates})
    if "guide_id" in updates:
        get_collection("bookings").update_many(
            {"tour_id": tour_id},
            {
                "$set": {
                    "guide_id": updates.get("guide_id"),
                    "guide_name": updates.get("guide_name"),
                    "updated_at": updates["updated_at"],
                }
            },
        )
    updated = get_collection("tours").find_one({"_id": current["_id"]})
    return serialize_document(updated)


@router.delete("/{tour_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_tour(tour_id: str, force: bool = Query(default=False), _admin=Depends(require_admin)):
    current = _get_tour_or_404(tour_id)
    bookings_collection = get_collection("bookings")
    active_bookings = bookings_collection.count_documents(
        {"tour_id": tour_id, "status": {"$in": ["pending", "confirmed"]}}
    )
    if active_bookings and not force:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tour has active bookings. Pass force=true to delete it together with its bookings.",
        )

    if force:
        bookings_collection.delete_many({"tour_id": tour_id})
    get_collection("reviews").delete_many({"tour_id": tour_id})
    get_collection("tours").delete_one({"_id": current["_id"]})
    return None
