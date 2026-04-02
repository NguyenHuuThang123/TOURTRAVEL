from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status

from app.database import get_collection, serialize_document
from app.schemas.user import AuthResponse, UserLogin, UserPublic, UserRegister, UserUpdate
from app.security import create_session, get_current_user, hash_password, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _to_public_user(user_doc):
    user = serialize_document(user_doc)
    user.pop("password", None)
    return user


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: UserRegister):
    users = get_collection("users")
    existing_user = users.find_one({"email": payload.email.lower()})
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email da ton tai")

    document = {
        "name": payload.name,
        "email": payload.email.lower(),
        "phone": payload.phone,
        "password": hash_password(payload.password),
        "role": "user",
        "is_blocked": False,
        "created_at": datetime.utcnow(),
    }
    result = users.insert_one(document)
    created = users.find_one({"_id": result.inserted_id})
    token = create_session(str(created["_id"]))
    return {"token": token, "user": _to_public_user(created)}


@router.post("/login", response_model=AuthResponse)
async def login(payload: UserLogin):
    user = get_collection("users").find_one({"email": payload.email.lower()})
    if not user or not verify_password(payload.password, user["password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email hoac mat khau khong dung")
    if user.get("is_blocked"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Tai khoan da bi khoa")

    token = create_session(str(user["_id"]))
    return {"token": token, "user": _to_public_user(user)}


@router.get("/me", response_model=UserPublic)
async def me(user=Depends(get_current_user)):
    return user


@router.put("/me", response_model=UserPublic)
async def update_me(payload: UserUpdate, user=Depends(get_current_user)):
    users = get_collection("users")
    bookings = get_collection("bookings")
    existing = users.find_one({"email": payload.email.lower()})
    if existing and str(existing["_id"]) != user["id"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email da ton tai")

    updates = {
        "name": payload.name,
        "email": payload.email.lower(),
        "phone": payload.phone,
        "updated_at": datetime.utcnow(),
    }

    users.update_one({"email": user["email"]}, {"$set": updates})
    bookings.update_many(
        {
            "$or": [
                {"user_id": user["id"]},
                {"user_email": user["email"]},
            ]
        },
        {
            "$set": {
                "user_id": user["id"],
                "user_name": payload.name,
                "user_email": payload.email.lower(),
                "updated_at": updates["updated_at"],
            }
        },
    )
    updated = users.find_one({"email": payload.email.lower()})
    return _to_public_user(updated)
