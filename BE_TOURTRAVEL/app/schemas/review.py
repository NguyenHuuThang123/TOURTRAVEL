from datetime import datetime

from pydantic import BaseModel, Field


class ReviewCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: str = Field(..., min_length=3, max_length=1000)


class ReviewPublic(BaseModel):
    id: str
    tour_id: str
    user_name: str
    rating: int
    comment: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
