from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any

from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.database import Database

from app.config.settings import get_settings

_client: MongoClient | None = None
LEGACY_VND_RATE = 26000


def get_client() -> MongoClient:
    global _client
    if _client is None:
        settings = get_settings()
        _client = MongoClient(settings.mongodb_url, serverSelectionTimeoutMS=5000)
    return _client


def get_database() -> Database:
    settings = get_settings()
    return get_client()[settings.mongodb_db_name]


def get_collection(name: str) -> Collection:
    return get_database()[name]


def ping_database() -> None:
    get_client().admin.command("ping")


def ensure_indexes() -> None:
    get_collection("tours").create_index("name")
    get_collection("tours").create_index("destination")
    get_collection("tours").create_index("guide_id")
    get_collection("bookings").create_index("tour_id")
    get_collection("bookings").create_index("guide_id")
    get_collection("bookings").create_index("status")
    get_collection("users").create_index("email", unique=True)
    get_collection("sessions").create_index("token", unique=True)
    get_collection("chat_conversations").create_index("user_id")
    get_collection("chat_conversations").create_index("session_key")
    get_collection("chat_conversations").create_index("last_message_at")
    get_collection("chat_messages").create_index("conversation_id")
    get_collection("chat_messages").create_index("created_at")


def normalize_legacy_prices_to_vnd() -> None:
    tours = get_collection("tours")
    bookings = get_collection("bookings")
    now = datetime.utcnow()

    low_price_tours = list(tours.find({"price": {"$gt": 0, "$lt": 10000}}, {"price": 1}))
    for item in low_price_tours:
        tours.update_one(
            {"_id": item["_id"]},
            {"$set": {"price": round(float(item["price"]) * LEGACY_VND_RATE, 0), "updated_at": now}},
        )

    low_price_bookings = list(bookings.find({"total_price": {"$gt": 0, "$lt": 10000}}, {"total_price": 1}))
    for item in low_price_bookings:
        bookings.update_one(
            {"_id": item["_id"]},
            {"$set": {"total_price": round(float(item["total_price"]) * LEGACY_VND_RATE, 0), "updated_at": now}},
        )


def seed_data() -> None:
    tours = get_collection("tours")
    now = datetime.utcnow()
    if tours.count_documents({}) == 0:
        tours.insert_many(
            [
                {
                    "name": "Da Nang Beach Escape",
                    "description": "Nghi duong ven bien, tham quan Ba Na Hills va am thuc dia phuong.",
                    "destination": "Da Nang, Viet Nam",
                    "price": 7514000.0,
                    "duration_days": 4,
                    "max_participants": 24,
                    "available_slots": 18,
                    "start_date": now + timedelta(days=15),
                    "end_date": now + timedelta(days=19),
                    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
                    "travel_style": "Beach",
                    "created_at": now,
                    "updated_at": now,
                },
                {
                    "name": "Ha Long Luxury Cruise",
                    "description": "Du thuyen 5 sao, tham hang dong va cheo kayak tai Vinh Ha Long.",
                    "destination": "Ha Long, Viet Nam",
                    "price": 10374000.0,
                    "duration_days": 3,
                    "max_participants": 20,
                    "available_slots": 10,
                    "start_date": now + timedelta(days=25),
                    "end_date": now + timedelta(days=28),
                    "image": "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200",
                    "travel_style": "Luxury",
                    "created_at": now,
                    "updated_at": now,
                },
                {
                    "name": "Tokyo Culture Discovery",
                    "description": "Kham pha Tokyo hien dai, den chua co kinh va khu am thuc dem.",
                    "destination": "Tokyo, Japan",
                    "price": 33774000.0,
                    "duration_days": 6,
                    "max_participants": 16,
                    "available_slots": 9,
                    "start_date": now + timedelta(days=40),
                    "end_date": now + timedelta(days=46),
                    "image": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200",
                    "travel_style": "Cultural",
                    "created_at": now,
                    "updated_at": now,
                },
            ]
        )

    users = get_collection("users")
    if users.count_documents({"email": "admin@tourtravel.com"}) == 0:
        from app.security import hash_password

        users.insert_one(
            {
                "name": "TourTravel Admin",
                "email": "admin@tourtravel.com",
                "phone": None,
                "password": hash_password("Admin123"),
                "role": "admin",
                "is_blocked": False,
                "created_at": now,
                "updated_at": now,
            }
        )

    if users.count_documents({"email": "guide@tourtravel.com"}) == 0:
        from app.security import hash_password

        users.insert_one(
            {
                "name": "Erik Hoffmann",
                "email": "guide@tourtravel.com",
                "phone": "+84 912 345 678",
                "password": hash_password("Guide123"),
                "role": "guide",
                "guide_title": "Lead Expeditionist",
                "guide_bio": "Specializes in small-group journeys and on-trip guest support.",
                "guide_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120",
                "guide_experience_years": 12,
                "is_blocked": False,
                "created_at": now,
                "updated_at": now,
            }
        )


def initialize_database() -> None:
    ping_database()
    ensure_indexes()
    seed_data()
    normalize_legacy_prices_to_vnd()


def close_database() -> None:
    global _client
    if _client is not None:
        _client.close()
        _client = None


def serialize_document(document: dict[str, Any] | None) -> dict[str, Any] | None:
    if document is None:
        return None

    serialized = dict(document)
    serialized["id"] = str(serialized.pop("_id"))
    return serialized
