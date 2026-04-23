from pydantic import BaseModel, EmailStr, Field

from app.schemas.booking import PaymentMethod


class VnpayPaymentCreate(BaseModel):
    tour_id: str
    user_name: str = Field(..., min_length=3, max_length=120)
    user_email: EmailStr
    user_phone: str = Field(..., min_length=8, max_length=30)
    quantity: int = Field(..., ge=1)
    insurance_selected: bool = False
    payment_method: PaymentMethod = "vnpay"


class VnpayPaymentResponse(BaseModel):
    payment_url: str
    txn_ref: str
