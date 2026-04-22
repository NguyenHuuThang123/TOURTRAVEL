from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field


UserRole = Literal["user", "guide", "admin"]


class UserRegister(BaseModel):
    name: str = Field(..., min_length=3, max_length=120)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)
    phone: str | None = Field(default=None, min_length=8, max_length=30)


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)


class GoogleAuthRequest(BaseModel):
    credential: str = Field(..., min_length=10)


class UserPublic(BaseModel):
    id: str
    name: str
    email: EmailStr
    phone: str | None = None
    role: UserRole
    guide_title: str | None = None
    guide_bio: str | None = None
    guide_avatar: str | None = None
    guide_experience_years: int | None = None
    is_blocked: bool = False
    created_at: datetime
    updated_at: datetime | None = None


class UserUpdate(BaseModel):
    name: str = Field(..., min_length=3, max_length=120)
    email: EmailStr
    phone: str | None = Field(default=None, min_length=8, max_length=30)


class UserAdminCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=120)
    email: EmailStr
    phone: str | None = Field(default=None, min_length=8, max_length=30)
    password: str = Field(..., min_length=6, max_length=128)
    role: UserRole = "user"
    guide_title: str | None = Field(default=None, max_length=120)
    guide_bio: str | None = Field(default=None, max_length=500)
    guide_avatar: str | None = Field(default=None, max_length=300)
    guide_experience_years: int | None = Field(default=None, ge=0, le=60)
    is_blocked: bool = False


class UserAdminUpdate(BaseModel):
    name: str = Field(..., min_length=3, max_length=120)
    email: EmailStr
    phone: str | None = Field(default=None, min_length=8, max_length=30)
    role: UserRole = "user"
    guide_title: str | None = Field(default=None, max_length=120)
    guide_bio: str | None = Field(default=None, max_length=500)
    guide_avatar: str | None = Field(default=None, max_length=300)
    guide_experience_years: int | None = Field(default=None, ge=0, le=60)
    is_blocked: bool = False
    password: str | None = Field(default=None, min_length=6, max_length=128)


class UserBlockUpdate(BaseModel):
    is_blocked: bool


class AuthResponse(BaseModel):
    token: str
    user: UserPublic
