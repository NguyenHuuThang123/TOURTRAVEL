from __future__ import annotations

from datetime import datetime

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.database import get_collection, serialize_document
from app.schemas.chat import ChatConversationCreate, ChatConversationDetail, ChatConversationPublic, ChatMessageCreate, ChatMessagePublic
from app.security import get_current_user_optional, require_admin

router = APIRouter(prefix="/api/chat", tags=["chat"])


def _serialize_message(message_doc):
    return ChatMessagePublic(**serialize_document(message_doc))


def _serialize_conversation(conversation_doc):
    return ChatConversationPublic(**serialize_document(conversation_doc))


def _conversation_query(user, session_key: str | None):
    clauses = []
    if user:
      clauses.append({"user_id": user["id"]})
    if session_key:
      clauses.append({"session_key": session_key})
    if not clauses:
      raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing chat identity")
    if len(clauses) == 1:
      return clauses[0]
    return {"$or": clauses}


def _customer_name(user, guest_name: str | None):
    if user:
        return user["name"]
    return guest_name or "Guest customer"


def _customer_email(user, guest_email):
    if user:
        return user["email"]
    return guest_email


def _get_customer_conversation_or_404(conversation_id: str, user, session_key: str | None):
    if not ObjectId.is_valid(conversation_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")

    conversation = get_collection("chat_conversations").find_one(
        {
            "_id": ObjectId(conversation_id),
            **_conversation_query(user, session_key),
        }
    )
    if not conversation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")
    return conversation


def _get_admin_conversation_or_404(conversation_id: str):
    if not ObjectId.is_valid(conversation_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")

    conversation = get_collection("chat_conversations").find_one({"_id": ObjectId(conversation_id)})
    if not conversation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")
    return conversation


def _append_message(conversation_id: ObjectId, sender_type: str, sender_name: str, content: str):
    now = datetime.utcnow()
    message_doc = {
        "conversation_id": str(conversation_id),
        "sender_type": sender_type,
        "sender_name": sender_name,
        "content": content.strip(),
        "created_at": now,
    }
    result = get_collection("chat_messages").insert_one(message_doc)
    return get_collection("chat_messages").find_one({"_id": result.inserted_id}), now


def _trim_preview(content: str):
    normalized = " ".join(content.split())
    return normalized[:117] + "..." if len(normalized) > 120 else normalized


@router.post("/conversations", response_model=ChatConversationDetail, status_code=status.HTTP_201_CREATED)
async def create_conversation(payload: ChatConversationCreate, user=Depends(get_current_user_optional)):
    if not user and not payload.session_key:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Session key is required for guests")

    now = datetime.utcnow()
    conversation_doc = {
        "user_id": user["id"] if user else None,
        "user_name": _customer_name(user, payload.guest_name),
        "user_email": _customer_email(user, payload.guest_email),
        "session_key": None if user else payload.session_key,
        "status": "open",
        "last_message_preview": _trim_preview(payload.message),
        "last_message_at": now,
        "unread_for_admin": 1,
        "unread_for_customer": 0,
        "created_at": now,
        "updated_at": now,
    }

    result = get_collection("chat_conversations").insert_one(conversation_doc)
    message_doc, _ = _append_message(result.inserted_id, "customer", conversation_doc["user_name"], payload.message)
    conversation = get_collection("chat_conversations").find_one({"_id": result.inserted_id})
    return {
        "conversation": _serialize_conversation(conversation),
        "messages": [_serialize_message(message_doc)],
    }


@router.get("/conversations", response_model=list[ChatConversationPublic])
async def get_my_conversations(
    session_key: str | None = Query(default=None),
    user=Depends(get_current_user_optional),
):
    query = _conversation_query(user, session_key)
    conversations = get_collection("chat_conversations").find(query).sort("last_message_at", -1)
    return [_serialize_conversation(item) for item in conversations]


@router.get("/conversations/{conversation_id}", response_model=ChatConversationDetail)
async def get_conversation_detail(
    conversation_id: str,
    session_key: str | None = Query(default=None),
    user=Depends(get_current_user_optional),
):
    conversation = _get_customer_conversation_or_404(conversation_id, user, session_key)
    messages = list(get_collection("chat_messages").find({"conversation_id": conversation_id}).sort("created_at", 1))
    get_collection("chat_conversations").update_one(
        {"_id": conversation["_id"]},
        {"$set": {"unread_for_customer": 0, "updated_at": datetime.utcnow()}},
    )
    conversation = get_collection("chat_conversations").find_one({"_id": conversation["_id"]})
    return {
        "conversation": _serialize_conversation(conversation),
        "messages": [_serialize_message(item) for item in messages],
    }


@router.post("/conversations/{conversation_id}/messages", response_model=ChatConversationDetail)
async def send_customer_message(
    conversation_id: str,
    payload: ChatMessageCreate,
    user=Depends(get_current_user_optional),
):
    conversation = _get_customer_conversation_or_404(conversation_id, user, payload.session_key)
    message_doc, now = _append_message(ObjectId(conversation_id), "customer", conversation["user_name"], payload.content)
    get_collection("chat_conversations").update_one(
        {"_id": conversation["_id"]},
        {
            "$set": {
                "status": "open",
                "last_message_preview": _trim_preview(payload.content),
                "last_message_at": now,
                "updated_at": now,
            },
            "$inc": {"unread_for_admin": 1},
        },
    )
    updated = get_collection("chat_conversations").find_one({"_id": conversation["_id"]})
    messages = list(get_collection("chat_messages").find({"conversation_id": conversation_id}).sort("created_at", 1))
    return {
        "conversation": _serialize_conversation(updated),
        "messages": [_serialize_message(item) for item in messages],
    }


@router.get("/admin/conversations", response_model=list[ChatConversationPublic])
async def get_admin_conversations(_admin=Depends(require_admin)):
    conversations = get_collection("chat_conversations").find().sort("last_message_at", -1)
    return [_serialize_conversation(item) for item in conversations]


@router.get("/admin/conversations/{conversation_id}", response_model=ChatConversationDetail)
async def get_admin_conversation_detail(conversation_id: str, _admin=Depends(require_admin)):
    conversation = _get_admin_conversation_or_404(conversation_id)
    messages = list(get_collection("chat_messages").find({"conversation_id": conversation_id}).sort("created_at", 1))
    get_collection("chat_conversations").update_one(
        {"_id": conversation["_id"]},
        {"$set": {"unread_for_admin": 0, "updated_at": datetime.utcnow()}},
    )
    conversation = get_collection("chat_conversations").find_one({"_id": conversation["_id"]})
    return {
        "conversation": _serialize_conversation(conversation),
        "messages": [_serialize_message(item) for item in messages],
    }


@router.post("/admin/conversations/{conversation_id}/messages", response_model=ChatConversationDetail)
async def send_admin_message(conversation_id: str, payload: ChatMessageCreate, admin=Depends(require_admin)):
    conversation = _get_admin_conversation_or_404(conversation_id)
    message_doc, now = _append_message(ObjectId(conversation_id), "admin", admin["name"], payload.content)
    get_collection("chat_conversations").update_one(
        {"_id": conversation["_id"]},
        {
            "$set": {
                "status": "replied",
                "last_message_preview": _trim_preview(payload.content),
                "last_message_at": now,
                "updated_at": now,
                "unread_for_admin": 0,
            },
            "$inc": {"unread_for_customer": 1},
        },
    )
    updated = get_collection("chat_conversations").find_one({"_id": conversation["_id"]})
    messages = list(get_collection("chat_messages").find({"conversation_id": conversation_id}).sort("created_at", 1))
    return {
        "conversation": _serialize_conversation(updated),
        "messages": [_serialize_message(item) for item in messages],
    }
