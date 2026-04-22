from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class TourBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=120)
    description: str = Field(..., min_length=10)
    destination: str = Field(..., min_length=2, max_length=120)
    price: float = Field(..., gt=0)
    duration_days: int = Field(..., ge=1)
    max_participants: int = Field(..., ge=1)
    available_slots: int = Field(..., ge=0)
    start_date: datetime
    end_date: datetime
    image: Optional[str] = None
    travel_style: Optional[str] = None
    guide_id: Optional[str] = None
    guide_name: Optional[str] = None
    guide_title: Optional[str] = None
    guide_avatar: Optional[str] = None
    guide_bio: Optional[str] = None
    guide_experience_years: Optional[int] = Field(default=None, ge=0, le=60)


class TourCreate(TourBase):
    pass


class TourUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=3, max_length=120)
    description: Optional[str] = Field(default=None, min_length=10)
    destination: Optional[str] = Field(default=None, min_length=2, max_length=120)
    price: Optional[float] = Field(default=None, gt=0)
    duration_days: Optional[int] = Field(default=None, ge=1)
    max_participants: Optional[int] = Field(default=None, ge=1)
    available_slots: Optional[int] = Field(default=None, ge=0)
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    image: Optional[str] = None
    travel_style: Optional[str] = None
    guide_id: Optional[str] = None
    guide_name: Optional[str] = None
    guide_title: Optional[str] = None
    guide_avatar: Optional[str] = None
    guide_bio: Optional[str] = None
    guide_experience_years: Optional[int] = Field(default=None, ge=0, le=60)


class Tour(TourBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
