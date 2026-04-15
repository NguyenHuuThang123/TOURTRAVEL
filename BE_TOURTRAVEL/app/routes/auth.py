import json
from urllib import parse, request
from urllib.error import HTTPError, URLError
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status

from app.database import get_collection, serialize_document
from app.config.settings import get_settings
from app.schemas.user import AuthResponse, GoogleAuthRequest, UserLogin, UserPublic, UserRegister, UserUpdate
from app.security import create_session, get_current_user, hash_password, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _to_public_user(user_doc):
    user = serialize_document(user_doc)
    user.pop("password", None)
    return user


def _ensure_not_blocked(user_doc):
    if user_doc.get("is_blocked"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Tai khoan da bi khoa")
    return user_doc


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
    _ensure_not_blocked(user)

    token = create_session(str(user["_id"]))
    return {"token": token, "user": _to_public_user(user)}


@router.post("/google", response_model=AuthResponse)
async def google_login(payload: GoogleAuthRequest):
    settings = get_settings()
    if not settings.google_client_id:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Google login chua duoc cau hinh")

    try:
        with request.urlopen(
            f"https://oauth2.googleapis.com/tokeninfo?id_token={parse.quote(payload.credential)}",
            timeout=10,
        ) as response:
            google_user = json.loads(response.read().decode("utf-8"))
    except (HTTPError, URLError, TimeoutError, json.JSONDecodeError) as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Google credential khong hop le") from exc

    email = (google_user.get("email") or "").lower()
    if google_user.get("aud") != settings.google_client_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Google client id khong khop")

    if not email or str(google_user.get("email_verified")).lower() != "true":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Tai khoan Google chua xac minh email")

    users = get_collection("users")
    user = users.find_one({"email": email})
    if user:
        _ensure_not_blocked(user)
        users.update_one(
            {"_id": user["_id"]},
            {"$set": {"name": google_user.get("name") or user["name"], "updated_at": datetime.utcnow()}},
        )
        user = users.find_one({"_id": user["_id"]})
    else:
        now = datetime.utcnow()
        document = {
            "name": google_user.get("name") or email.split("@")[0],
            "email": email,
            "phone": None,
            "password": hash_password(f"google::{google_user.get('sub', email)}"),
            "role": "user",
            "is_blocked": False,
            "created_at": now,
            "updated_at": now,
            "auth_provider": "google",
        }
        result = users.insert_one(document)
        user = users.find_one({"_id": result.inserted_id})

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
