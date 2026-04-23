from datetime import datetime

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from app.database import get_collection, serialize_document
from app.schemas.user import UserAdminCreate, UserAdminUpdate, UserBlockUpdate, UserPublic
from app.security import hash_password, require_admin

router = APIRouter(prefix="/api/users", tags=["users"])


def _get_user_or_404(user_id: str):
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user = get_collection("users").find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


def _to_public_user(user_doc):
    user = serialize_document(user_doc)
    user.pop("password", None)
    return user


def _ensure_unique_email(email: str, current_user_id: str | None = None):
    existing = get_collection("users").find_one({"email": email.lower()})
    if existing and str(existing["_id"]) != current_user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email da ton tai")


def _revoke_user_sessions(user_id: str):
    get_collection("sessions").delete_many({"user_id": user_id})


@router.get("/", response_model=list[UserPublic])
async def get_users(_admin=Depends(require_admin)):
    users = get_collection("users").find().sort("created_at", -1)
    return [_to_public_user(user) for user in users]


@router.post("/", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
async def create_user(payload: UserAdminCreate, admin=Depends(require_admin)):
    _ensure_unique_email(payload.email)

    now = datetime.utcnow()
    document = {
        "name": payload.name,
        "email": payload.email.lower(),
        "phone": payload.phone,
        "password": hash_password(payload.password),
        "role": payload.role,
        "guide_title": payload.guide_title,
        "guide_bio": payload.guide_bio,
        "guide_avatar": payload.guide_avatar,
        "guide_experience_years": payload.guide_experience_years,
        "is_blocked": payload.is_blocked,
        "created_at": now,
        "updated_at": now,
    }
    result = get_collection("users").insert_one(document)
    created = get_collection("users").find_one({"_id": result.inserted_id})
    if payload.is_blocked:
        _revoke_user_sessions(str(result.inserted_id))
    return _to_public_user(created)


@router.put("/{user_id}", response_model=UserPublic)
async def update_user(user_id: str, payload: UserAdminUpdate, admin=Depends(require_admin)):
    user = _get_user_or_404(user_id)
    _ensure_unique_email(payload.email, user_id)

    if str(user["_id"]) == admin["id"] and payload.role != "admin":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Khong the ha quyen chinh tai khoan admin")
    if str(user["_id"]) == admin["id"] and payload.is_blocked:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Khong the khoa chinh tai khoan admin")

    updates = {
        "name": payload.name,
        "email": payload.email.lower(),
        "phone": payload.phone,
        "role": payload.role,
        "guide_title": payload.guide_title,
        "guide_bio": payload.guide_bio,
        "guide_avatar": payload.guide_avatar,
        "guide_experience_years": payload.guide_experience_years,
        "is_blocked": payload.is_blocked,
        "updated_at": datetime.utcnow(),
    }
    if payload.password:
        updates["password"] = hash_password(payload.password)

    get_collection("users").update_one({"_id": user["_id"]}, {"$set": updates})
    get_collection("bookings").update_many(
        {
            "$or": [
                {"user_id": user_id},
                {"user_email": user["email"]},
            ]
        },
        {
            "$set": {
                "user_id": user_id,
                "user_name": payload.name,
                "user_email": payload.email.lower(),
                "updated_at": updates["updated_at"],
            }
        },
    )
    get_collection("reviews").update_many(
        {"user_id": user_id},
        {
            "$set": {
                "user_name": payload.name,
                "user_email": payload.email.lower(),
            }
        },
    )
    if payload.is_blocked:
        _revoke_user_sessions(user_id)

    updated = get_collection("users").find_one({"_id": user["_id"]})
    return _to_public_user(updated)


@router.patch("/{user_id}/block", response_model=UserPublic)
async def block_user(user_id: str, payload: UserBlockUpdate, admin=Depends(require_admin)):
    user = _get_user_or_404(user_id)
    if str(user["_id"]) == admin["id"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Khong the khoa chinh tai khoan admin")

    updated_at = datetime.utcnow()
    get_collection("users").update_one(
        {"_id": user["_id"]},
        {"$set": {"is_blocked": payload.is_blocked, "updated_at": updated_at}},
    )
    if payload.is_blocked:
        _revoke_user_sessions(user_id)

    updated = get_collection("users").find_one({"_id": user["_id"]})
    return _to_public_user(updated)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: str, admin=Depends(require_admin)):
    user = _get_user_or_404(user_id)
    if str(user["_id"]) == admin["id"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Khong the xoa chinh tai khoan admin")

    get_collection("users").delete_one({"_id": user["_id"]})
    _revoke_user_sessions(user_id)
    return None
