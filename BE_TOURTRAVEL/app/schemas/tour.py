from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Tour(BaseModel):
    id: Optional[int] = None
    name: str
    description: str
    destination: str
    price: float
    duration_days: int
    max_participants: int
    start_date: datetime
    end_date: datetime
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TourCreate(BaseModel):
    name: str
    description: str
    destination: str
    price: float
    duration_days: int
    max_participants: int
    start_date: datetime
    end_date: datetime
