from datetime import datetime

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from app.database import get_collection, serialize_document
from app.schemas.booking import Booking, BookingCreate, BookingUpdate
from app.security import require_admin

router = APIRouter(prefix="/api/bookings", tags=["bookings"])


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


@router.get("/", response_model=list[Booking])
async def get_bookings(_admin=Depends(require_admin)):
    bookings = get_collection("bookings").find().sort("created_at", -1)
    return [serialize_document(booking) for booking in bookings]


@router.get("/{booking_id}", response_model=Booking)
async def get_booking(booking_id: str, _admin=Depends(require_admin)):
    return serialize_document(_get_booking_or_404(booking_id))


@router.post("/", response_model=Booking, status_code=status.HTTP_201_CREATED)
async def create_booking(booking: BookingCreate):
    tours_collection = get_collection("tours")
    bookings_collection = get_collection("bookings")

    tour = _get_tour_or_400(booking.tour_id)
    if booking.quantity > tour["available_slots"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not enough available slots")

    now = datetime.utcnow()
    payload = booking.dict()
    payload["tour_name"] = tour["name"]
    payload["total_price"] = booking.quantity * float(tour["price"])
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

    updates["total_price"] = new_quantity * float(tour["price"])
    updates["tour_name"] = tour["name"]
    updates["updated_at"] = datetime.utcnow()

    bookings_collection.update_one({"_id": current["_id"]}, {"$set": updates})
    if slot_delta != 0:
        tours_collection.update_one(
            {"_id": tour["_id"]},
            {"$inc": {"available_slots": slot_delta}, "$set": {"updated_at": updates["updated_at"]}},
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
