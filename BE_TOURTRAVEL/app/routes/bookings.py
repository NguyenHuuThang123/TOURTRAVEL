from datetime import datetime

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from app.database import get_collection, serialize_document
from app.schemas.booking import Booking, BookingCreate, BookingUpdate
from app.security import get_current_user, get_current_user_optional, require_admin

router = APIRouter(prefix="/api/bookings", tags=["bookings"])
INSURANCE_FEE_VND = 45000


def _get_booking_or_404(booking_id: str):
    if not ObjectId.is_valid(booking_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

    booking = get_collection("bookings").find_one({"_id": ObjectId(booking_id)})
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    return booking


def _get_tour_or_400(tour_id: str):
    if not ObjectId.is_valid(tour_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid tour id")

    tour = get_collection("tours").find_one({"_id": ObjectId(tour_id)})
    if not tour:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tour not found")
    return tour


def _serialize_bookings(cursor):
    return [serialize_document(booking) for booking in cursor]


def _assert_booking_owner(booking: dict, user: dict):
    if booking.get("user_id") == user["id"] or booking.get("user_email") == user["email"]:
        return
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Khong co quyen truy cap booking nay")


@router.get("/", response_model=list[Booking])
async def get_bookings(_admin=Depends(require_admin)):
    bookings = get_collection("bookings").find().sort("created_at", -1)
    return _serialize_bookings(bookings)


@router.get("/my", response_model=list[Booking])
async def get_my_bookings(user=Depends(get_current_user)):
    bookings = get_collection("bookings").find(
        {
            "$or": [
                {"user_id": user["id"]},
                {"user_email": user["email"]},
            ]
        }
    ).sort("created_at", -1)
    return _serialize_bookings(bookings)


@router.get("/{booking_id}", response_model=Booking)
async def get_booking(booking_id: str, _admin=Depends(require_admin)):
    return serialize_document(_get_booking_or_404(booking_id))


@router.post("/", response_model=Booking, status_code=status.HTTP_201_CREATED)
async def create_booking(booking: BookingCreate, user=Depends(get_current_user_optional)):
    tours_collection = get_collection("tours")
    bookings_collection = get_collection("bookings")

    if user and user.get("role") == "guide":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Guide khong the dat tour")

    tour = _get_tour_or_400(booking.tour_id)
    if booking.quantity > tour["available_slots"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not enough available slots")

    now = datetime.utcnow()
    payload = booking.dict()
    payload["user_id"] = user["id"] if user else None
    payload["tour_name"] = tour["name"]
    payload["tour_destination"] = tour.get("destination")
    payload["tour_image"] = tour.get("image")
    payload["guide_id"] = tour.get("guide_id")
    payload["guide_name"] = tour.get("guide_name")
    payload["start_date"] = tour.get("start_date")
    payload["end_date"] = tour.get("end_date")
    payload["tour_unit_price"] = float(tour["price"])
    payload["insurance_selected"] = booking.insurance_selected
    payload["insurance_fee"] = INSURANCE_FEE_VND if booking.insurance_selected else 0
    payload["payment_method"] = booking.payment_method
    payload["total_price"] = booking.quantity * float(tour["price"]) + payload["insurance_fee"]
    payload["status"] = "confirmed"
    payload["created_at"] = now
    payload["updated_at"] = now

    result = bookings_collection.insert_one(payload)
    tours_collection.update_one(
        {"_id": tour["_id"]},
        {"$inc": {"available_slots": -booking.quantity}, "$set": {"updated_at": now}},
    )
    created = bookings_collection.find_one({"_id": result.inserted_id})
    return serialize_document(created)


@router.put("/{booking_id}", response_model=Booking)
async def update_booking(booking_id: str, booking: BookingUpdate, _admin=Depends(require_admin)):
    tours_collection = get_collection("tours")
    bookings_collection = get_collection("bookings")

    current = _get_booking_or_404(booking_id)
    updates = booking.dict(exclude_none=True)
    if not updates:
        return serialize_document(current)

    tour = _get_tour_or_400(current["tour_id"])
    previous_quantity = current["quantity"]
    previous_status = current["status"]
    new_quantity = updates.get("quantity", previous_quantity)
    new_status = updates.get("status", previous_status)

    slot_delta = 0
    if previous_status != "cancelled" and new_status == "cancelled":
        slot_delta = previous_quantity
    elif previous_status == "cancelled" and new_status != "cancelled":
        slot_delta = -new_quantity
    elif previous_status != "cancelled" and new_status != "cancelled":
        slot_delta = previous_quantity - new_quantity

    if slot_delta < 0 and abs(slot_delta) > tour["available_slots"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not enough available slots")

    insurance_fee = float(current.get("insurance_fee") or 0)
    updates["tour_unit_price"] = float(tour["price"])
    updates["insurance_selected"] = bool(current.get("insurance_selected"))
    updates["insurance_fee"] = insurance_fee
    updates["payment_method"] = current.get("payment_method", "card")
    updates["total_price"] = new_quantity * float(tour["price"]) + insurance_fee
    updates["tour_name"] = tour["name"]
    updates["tour_destination"] = tour.get("destination")
    updates["tour_image"] = tour.get("image")
    updates["guide_id"] = tour.get("guide_id")
    updates["guide_name"] = tour.get("guide_name")
    updates["start_date"] = tour.get("start_date")
    updates["end_date"] = tour.get("end_date")
    updates["updated_at"] = datetime.utcnow()

    bookings_collection.update_one({"_id": current["_id"]}, {"$set": updates})
    if slot_delta != 0:
        tours_collection.update_one(
            {"_id": tour["_id"]},
            {"$inc": {"available_slots": slot_delta}, "$set": {"updated_at": updates["updated_at"]}},
        )

    updated = bookings_collection.find_one({"_id": current["_id"]})
    return serialize_document(updated)


@router.put("/my/{booking_id}/cancel", response_model=Booking)
async def cancel_my_booking(booking_id: str, user=Depends(get_current_user)):
    tours_collection = get_collection("tours")
    bookings_collection = get_collection("bookings")

    current = _get_booking_or_404(booking_id)
    _assert_booking_owner(current, user)

    if current["status"] == "cancelled":
        return serialize_document(current)

    tour = _get_tour_or_400(current["tour_id"])
    updated_at = datetime.utcnow()

    bookings_collection.update_one(
        {"_id": current["_id"]},
        {"$set": {"status": "cancelled", "updated_at": updated_at}},
    )
    tours_collection.update_one(
        {"_id": tour["_id"]},
        {"$inc": {"available_slots": current["quantity"]}, "$set": {"updated_at": updated_at}},
    )

    updated = bookings_collection.find_one({"_id": current["_id"]})
    return serialize_document(updated)


@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_booking(booking_id: str, _admin=Depends(require_admin)):
    booking = _get_booking_or_404(booking_id)
    if booking["status"] != "cancelled":
        get_collection("tours").update_one(
            {"_id": ObjectId(booking["tour_id"])},
            {"$inc": {"available_slots": booking["quantity"]}, "$set": {"updated_at": datetime.utcnow()}},
        )

    get_collection("bookings").delete_one({"_id": booking["_id"]})
    return None
