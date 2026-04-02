from datetime import datetime

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.database import get_collection, serialize_document
from app.schemas.tour import Tour, TourCreate, TourUpdate
from app.security import require_admin

router = APIRouter(prefix="/api/tours", tags=["tours"])


def _get_tour_or_404(tour_id: str):
    if not ObjectId.is_valid(tour_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tour not found")

    tour = get_collection("tours").find_one({"_id": ObjectId(tour_id)})
    if not tour:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tour not found")
    return tour


@router.get("/", response_model=list[Tour])
async def get_tours(search: str | None = None, destination: str | None = None):
    filters = {}
    if search:
        filters["name"] = {"$regex": search, "$options": "i"}
    if destination:
        filters["destination"] = {"$regex": destination, "$options": "i"}

    tours = get_collection("tours").find(filters).sort("start_date", 1)
    return [serialize_document(tour) for tour in tours]


@router.get("/{tour_id}", response_model=Tour)
async def get_tour(tour_id: str):
    return serialize_document(_get_tour_or_404(tour_id))


@router.post("/", response_model=Tour, status_code=status.HTTP_201_CREATED)
async def create_tour(tour: TourCreate, _admin=Depends(require_admin)):
    if tour.end_date <= tour.start_date:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="End date must be after start date")
    if tour.available_slots > tour.max_participants:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Available slots cannot exceed max participants")

    now = datetime.utcnow()
    payload = tour.dict()
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

    updates["updated_at"] = datetime.utcnow()
    get_collection("tours").update_one({"_id": current["_id"]}, {"$set": updates})
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
    get_collection("tours").delete_one({"_id": current["_id"]})
    return None
