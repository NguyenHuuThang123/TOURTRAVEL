from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field


ChatStatus = Literal["open", "replied", "closed"]
SenderType = Literal["customer", "admin"]


class ChatConversationCreate(BaseModel):
    session_key: str | None = Field(default=None, min_length=8, max_length=128)
    guest_name: str | None = Field(default=None, min_length=2, max_length=120)
    guest_email: EmailStr | None = None
    message: str = Field(..., min_length=1, max_length=2000)


class ChatMessageCreate(BaseModel):
    session_key: str | None = Field(default=None, min_length=8, max_length=128)
    content: str = Field(..., min_length=1, max_length=2000)


class ChatMessagePublic(BaseModel):
    id: str
    conversation_id: str
    sender_type: SenderType
    sender_name: str
    content: str
    created_at: datetime


class ChatConversationPublic(BaseModel):
    id: str
    user_id: str | None = None
    user_name: str
    user_email: EmailStr | None = None
    session_key: str | None = None
    status: ChatStatus = "open"
    last_message_preview: str
    last_message_at: datetime
    unread_for_admin: int = 0
    unread_for_customer: int = 0
    created_at: datetime
    updated_at: datetime


class ChatConversationDetail(BaseModel):
    conversation: ChatConversationPublic
    messages: list[ChatMessagePublic]
