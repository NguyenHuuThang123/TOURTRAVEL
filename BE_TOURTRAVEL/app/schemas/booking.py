from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field


BookingStatus = Literal["pending", "confirmed", "cancelled"]


class BookingCreate(BaseModel):
    tour_id: str
    user_name: str = Field(..., min_length=3, max_length=120)
    user_email: EmailStr
    user_phone: str = Field(..., min_length=8, max_length=30)
    quantity: int = Field(..., ge=1)


class BookingUpdate(BaseModel):
    user_name: Optional[str] = Field(default=None, min_length=3, max_length=120)
    user_email: Optional[EmailStr] = None
    user_phone: Optional[str] = Field(default=None, min_length=8, max_length=30)
    quantity: Optional[int] = Field(default=None, ge=1)
    status: Optional[BookingStatus] = None


class Booking(BaseModel):
    id: str
    tour_id: str
    tour_name: str
    user_name: str
    user_email: EmailStr
    user_phone: str
    quantity: int
    total_price: float
    status: BookingStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
