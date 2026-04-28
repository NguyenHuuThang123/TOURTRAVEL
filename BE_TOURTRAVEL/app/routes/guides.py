import json
from datetime import datetime
from urllib.parse import parse_qs, urlparse

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from app.database import get_collection, serialize_document
from app.schemas.booking import Booking, GuideBookingCheckInRequest, GuideBookingCheckInResult
from app.schemas.tour import Tour
from app.security import require_guide

router = APIRouter(prefix="/api/guides", tags=["guides"])


def _extract_booking_id_from_qr_content(qr_content: str) -> tuple[str, str]:
    raw_value = qr_content.strip()
    if not raw_value:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No QR content provided")

    if ObjectId.is_valid(raw_value):
        return raw_value, "booking_id"

    try:
        payload = json.loads(raw_value)
    except json.JSONDecodeError:
        payload = None

    if isinstance(payload, dict):
        payload_type = payload.get("type")
        booking_id = payload.get("booking_id")
        if payload_type != "tourtravel_checkin" or not ObjectId.is_valid(booking_id):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="QR code khong hop le")
        return booking_id, "qr_payload"

    parsed_url = urlparse(raw_value)
    if parsed_url.scheme and parsed_url.netloc:
        booking_ids = parse_qs(parsed_url.query).get("booking_id", [])
        booking_id = booking_ids[0] if booking_ids else None
        if ObjectId.is_valid(booking_id):
            return booking_id, "checkin_url"

    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Khong doc duoc booking tu ma QR")


@router.get("/me/tours", response_model=list[Tour])
async def get_my_tours(guide=Depends(require_guide)):
    tours = get_collection("tours").find({"guide_id": guide["id"]}).sort("start_date", 1)
    return [serialize_document(tour) for tour in tours]


@router.get("/me/bookings", response_model=list[Booking])
async def get_my_bookings(guide=Depends(require_guide)):
    bookings = get_collection("bookings").find({"guide_id": guide["id"]}).sort("created_at", -1)
    return [serialize_document(booking) for booking in bookings]


@router.post("/me/check-in", response_model=GuideBookingCheckInResult)
async def check_in_booking(payload: GuideBookingCheckInRequest, guide=Depends(require_guide)):
    booking_id, matched_via = _extract_booking_id_from_qr_content(payload.qr_content)
    bookings_collection = get_collection("bookings")

    booking = bookings_collection.find_one({"_id": ObjectId(booking_id)})
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    if booking.get("guide_id") != guide["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Booking nay khong thuoc tour ban phu trach",
        )
    if booking.get("status") == "cancelled":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Booking da bi huy, khong the check-in",
        )

    checkin_status = "already_checked_in"
    if not booking.get("checked_in_at"):
        checkin_status = "checked_in_now"
        now = datetime.utcnow()
        bookings_collection.update_one(
            {"_id": booking["_id"]},
            {
                "$set": {
                    "checked_in_at": now,
                    "checked_in_by_guide_id": guide["id"],
                    "checked_in_by_guide_name": guide["name"],
                    "updated_at": now,
                }
            },
        )
        booking = bookings_collection.find_one({"_id": booking["_id"]})

    return {
        "booking": serialize_document(booking),
        "checkin_status": checkin_status,
        "matched_via": matched_via,
    }
