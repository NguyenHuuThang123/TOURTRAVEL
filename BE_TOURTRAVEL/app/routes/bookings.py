from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.booking import Booking, BookingCreate

router = APIRouter(
    prefix="/api/bookings",
    tags=["bookings"]
)

# Mock bookings
mock_bookings = []

@router.get("/", response_model=List[Booking])
async def get_bookings():
    return mock_bookings

@router.post("/", response_model=Booking)
async def create_booking(booking: BookingCreate):
    new_booking = {
        "id": len(mock_bookings) + 1,
        "tour_id": booking.tour_id,
        "user_name": booking.user_name,
        "user_email": booking.user_email,
        "user_phone": booking.user_phone,
        "quantity": booking.quantity,
        "total_price": booking.quantity * 100,  # Mock calculation
        "status": "pending"
    }
    mock_bookings.append(new_booking)
    return new_booking

@router.get("/{booking_id}", response_model=Booking)
async def get_booking(booking_id: int):
    booking = next((b for b in mock_bookings if b["id"] == booking_id), None)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking
