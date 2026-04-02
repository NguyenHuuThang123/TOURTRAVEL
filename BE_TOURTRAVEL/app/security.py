from __future__ import annotations

import hashlib
import hmac
import secrets
from datetime import datetime

from bson import ObjectId
from fastapi import Depends, Header, HTTPException, status

from app.database import get_collection, serialize_document


def hash_password(password: str, salt: str | None = None) -> str:
    actual_salt = salt or secrets.token_hex(16)
    hashed = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), actual_salt.encode("utf-8"), 100_000)
    return f"{actual_salt}${hashed.hex()}"


def verify_password(password: str, stored_password: str) -> bool:
    salt, password_hash = stored_password.split("$", 1)
    candidate = hash_password(password, salt).split("$", 1)[1]
    return hmac.compare_digest(candidate, password_hash)


def create_session(user_id: str) -> str:
    token = secrets.token_urlsafe(32)
    get_collection("sessions").insert_one(
        {
            "user_id": user_id,
            "token": token,
            "created_at": datetime.utcnow(),
        }
    )
    return token


def get_current_user(authorization: str = Header(default="")):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing or invalid token")

    token = authorization.replace("Bearer ", "", 1).strip()
    session = get_collection("sessions").find_one({"token": token})
    if not session:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired or invalid")

    user = get_collection("users").find_one({"_id": ObjectId(session["user_id"])})
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return serialize_document(user)


def require_admin(user=Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return user
