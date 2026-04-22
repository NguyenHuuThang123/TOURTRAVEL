from fastapi import APIRouter, Depends

from app.database import get_collection, serialize_document
from app.schemas.booking import Booking
from app.schemas.tour import Tour
from app.security import require_guide

router = APIRouter(prefix="/api/guides", tags=["guides"])


@router.get("/me/tours", response_model=list[Tour])
async def get_my_tours(guide=Depends(require_guide)):
    tours = get_collection("tours").find({"guide_id": guide["id"]}).sort("start_date", 1)
    return [serialize_document(tour) for tour in tours]


@router.get("/me/bookings", response_model=list[Booking])
async def get_my_bookings(guide=Depends(require_guide)):
    bookings = get_collection("bookings").find({"guide_id": guide["id"]}).sort("created_at", -1)
    return [serialize_document(booking) for booking in bookings]
