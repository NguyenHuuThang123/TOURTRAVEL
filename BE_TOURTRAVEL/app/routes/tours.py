from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.schemas.tour import Tour, TourCreate
# from app.models import Tour as TourModel
# from app.database import get_db

router = APIRouter(
    prefix="/api/tours",
    tags=["tours"]
)

# Mock data for now
mock_tours = [
    {
        "id": 1,
        "name": "Paris City Tour",
        "description": "Explore the City of Light",
        "destination": "Paris",
        "price": 1200,
        "duration_days": 5,
        "max_participants": 20,
        "start_date": "2024-04-01T00:00:00",
        "end_date": "2024-04-06T00:00:00"
    },
    {
        "id": 2,
        "name": "Tokyo Adventure",
        "description": "Experience Japanese culture",
        "destination": "Tokyo",
        "price": 1800,
        "duration_days": 7,
        "max_participants": 15,
        "start_date": "2024-05-01T00:00:00",
        "end_date": "2024-05-08T00:00:00"
    }
]

@router.get("/", response_model=List[Tour])
async def get_tours():
    return mock_tours

@router.get("/{tour_id}", response_model=Tour)
async def get_tour(tour_id: int):
    tour = next((t for t in mock_tours if t["id"] == tour_id), None)
    if not tour:
        raise HTTPException(status_code=404, detail="Tour not found")
    return tour

@router.post("/", response_model=Tour)
async def create_tour(tour: TourCreate):
    # In production, save to database
    mock_tour = dict(tour)
    mock_tour["id"] = len(mock_tours) + 1
    mock_tours.append(mock_tour)
    return mock_tour
