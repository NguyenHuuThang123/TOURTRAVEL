from pydantic import BaseModel
from typing import Optional

class Booking(BaseModel):
    id: Optional[int] = None
    tour_id: int
    user_name: str
    user_email: str
    user_phone: str
    quantity: int
    total_price: float
    status: str = "pending"

    class Config:
        from_attributes = True

class BookingCreate(BaseModel):
    tour_id: int
    user_name: str
    user_email: str
    user_phone: str
    quantity: int
