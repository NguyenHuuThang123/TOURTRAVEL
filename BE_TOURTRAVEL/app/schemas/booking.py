from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field


BookingStatus = Literal["pending", "confirmed", "cancelled"]
PaymentMethod = Literal["card", "bank_transfer", "vnpay"]


class BookingCreate(BaseModel):
    tour_id: str
    user_name: str = Field(..., min_length=3, max_length=120)
    user_email: EmailStr
    user_phone: str = Field(..., min_length=8, max_length=30)
    quantity: int = Field(..., ge=1)
    insurance_selected: bool = False
    payment_method: PaymentMethod = "card"


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
    user_id: str | None = None
    user_name: str
    user_email: EmailStr
    user_phone: str
    tour_destination: str | None = None
    tour_image: str | None = None
    guide_id: str | None = None
    guide_name: str | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None
    quantity: int
    tour_unit_price: float | None = None
    processing_fee: float = 0
    discount_amount: float = 0
    insurance_selected: bool = False
    insurance_fee: float = 0
    payment_method: PaymentMethod = "card"
    total_price: float
    status: BookingStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
