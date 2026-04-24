from datetime import datetime, timedelta, timezone
from uuid import uuid4
from urllib.parse import quote_plus, urlencode

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import RedirectResponse

from app.config.settings import get_settings
from app.database import get_collection, serialize_document
from app.routes.bookings import _build_booking_payload, _get_tour_or_400
from app.schemas.payment import VnpayPaymentCreate, VnpayPaymentResponse
from app.services.email_service import send_booking_confirmation_email
from app.security import get_current_user_optional

router = APIRouter(prefix="/api/payments", tags=["payments"])

GMT_PLUS_7 = timezone(timedelta(hours=7))


def _ensure_vnpay_config():
    settings = get_settings()
    if not settings.vnpay_tmn_code or not settings.vnpay_hash_secret:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="VNPAY chua duoc cau hinh. Vui long cap nhat VNPAY_TMN_CODE va VNPAY_HASH_SECRET.",
        )
    return settings


def _get_client_ip(request: Request):
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
      return forwarded_for.split(",")[0].strip()
    return request.client.host if request.client else "127.0.0.1"


def _normalize_vnpay_value(value):
    return quote_plus(str(value), safe="")


def _build_vnpay_hash_data(params: dict):
    return "&".join(
        f"{_normalize_vnpay_value(key)}={_normalize_vnpay_value(params[key])}"
        for key in sorted(params)
    )


def _build_vnpay_secure_hash(params: dict, hash_secret: str):
    import hmac
    import hashlib

    hash_data = _build_vnpay_hash_data(params)
    return hmac.new(hash_secret.encode("utf-8"), hash_data.encode("utf-8"), hashlib.sha512).hexdigest()


def _redirect_frontend(status_value: str, message: str, booking_id: str | None = None):
    settings = get_settings()
    query = {"status": status_value, "message": message}
    if booking_id:
        query["booking_id"] = booking_id
    target = f"{settings.frontend_base_url}/payment/vnpay-return?{urlencode(query)}"
    return RedirectResponse(target, status_code=status.HTTP_302_FOUND)


@router.post("/vnpay/create", response_model=VnpayPaymentResponse)
async def create_vnpay_payment(
    payload: VnpayPaymentCreate,
    request: Request,
    user=Depends(get_current_user_optional),
):
    settings = _ensure_vnpay_config()
    if payload.payment_method != "vnpay":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Phuong thuc thanh toan khong hop le")

    tour = _get_tour_or_400(payload.tour_id)
    if payload.quantity > tour["available_slots"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not enough available slots")
    if user and user.get("role") == "guide":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Guide khong the dat tour")

    now_utc = datetime.utcnow()
    booking_payload = _build_booking_payload(payload.dict(), tour, user, now_utc)
    txn_ref = uuid4().hex[:24]

    get_collection("payment_sessions").insert_one(
        {
            "txn_ref": txn_ref,
            "status": "pending",
            "tour_id": payload.tour_id,
            "booking_payload": booking_payload,
            "amount": booking_payload["total_price"],
            "user_id": user["id"] if user else None,
            "created_at": now_utc,
            "updated_at": now_utc,
        }
    )

    create_date = datetime.now(GMT_PLUS_7).strftime("%Y%m%d%H%M%S")
    expire_date = (datetime.now(GMT_PLUS_7) + timedelta(minutes=15)).strftime("%Y%m%d%H%M%S")
    return_url = f"{settings.backend_base_url}{settings.vnpay_return_path}"

    vnp_params = {
        "vnp_Version": "2.1.0",
        "vnp_Command": "pay",
        "vnp_TmnCode": settings.vnpay_tmn_code,
        "vnp_Amount": int(round(float(booking_payload["total_price"]) * 100)),
        "vnp_CurrCode": "VND",
        "vnp_TxnRef": txn_ref,
        "vnp_OrderInfo": f"Thanh toan TourTravel {txn_ref}",
        "vnp_OrderType": "other",
        "vnp_Locale": "vn",
        "vnp_ReturnUrl": return_url,
        "vnp_IpAddr": _get_client_ip(request),
        "vnp_CreateDate": create_date,
        "vnp_ExpireDate": expire_date,
    }

    secure_hash = _build_vnpay_secure_hash(vnp_params, settings.vnpay_hash_secret)
    query = urlencode(sorted(vnp_params.items()), quote_via=quote_plus)
    payment_url = f"{settings.vnpay_payment_url}?{query}&vnp_SecureHash={secure_hash}"

    return {"payment_url": payment_url, "txn_ref": txn_ref}


@router.get("/vnpay/return")
async def vnpay_return(request: Request):
    settings = _ensure_vnpay_config()
    query_params = dict(request.query_params)
    secure_hash = query_params.pop("vnp_SecureHash", "")
    query_params.pop("vnp_SecureHashType", None)
    txn_ref = query_params.get("vnp_TxnRef")

    if not txn_ref:
        return _redirect_frontend("failed", "Khong tim thay ma giao dich VNPAY.")

    session = get_collection("payment_sessions").find_one({"txn_ref": txn_ref})
    if not session:
        return _redirect_frontend("failed", "Phien thanh toan khong ton tai hoac da het han.")

    expected_hash = _build_vnpay_secure_hash(query_params, settings.vnpay_hash_secret)
    if secure_hash != expected_hash:
        get_collection("payment_sessions").update_one(
            {"_id": session["_id"]},
            {"$set": {"status": "invalid_signature", "updated_at": datetime.utcnow()}},
        )
        return _redirect_frontend("failed", "Chu ky VNPAY khong hop le.")

    if session.get("status") == "completed" and session.get("booking_id"):
        return _redirect_frontend("success", "Giao dich da duoc xac nhan truoc do.", session["booking_id"])

    response_code = query_params.get("vnp_ResponseCode")
    transaction_status = query_params.get("vnp_TransactionStatus")
    paid_amount = int(query_params.get("vnp_Amount", "0")) / 100

    if response_code != "00" or transaction_status not in (None, "", "00"):
        get_collection("payment_sessions").update_one(
            {"_id": session["_id"]},
            {
                "$set": {
                    "status": "failed",
                    "response_code": response_code,
                    "transaction_status": transaction_status,
                    "updated_at": datetime.utcnow(),
                }
            },
        )
        return _redirect_frontend("failed", "Giao dich VNPAY khong thanh cong.")

    if round(float(paid_amount), 0) != round(float(session["amount"]), 0):
        get_collection("payment_sessions").update_one(
            {"_id": session["_id"]},
            {"$set": {"status": "amount_mismatch", "updated_at": datetime.utcnow()}},
        )
        return _redirect_frontend("failed", "So tien VNPAY tra ve khong khop voi don hang.")

    booking_payload = dict(session["booking_payload"])
    tour = _get_tour_or_400(session["tour_id"])
    if booking_payload["quantity"] > tour["available_slots"]:
        get_collection("payment_sessions").update_one(
            {"_id": session["_id"]},
            {"$set": {"status": "sold_out", "updated_at": datetime.utcnow()}},
        )
        return _redirect_frontend("failed", "Tour khong con du cho trong de xac nhan giao dich.")

    booking_payload["email_notification_status"] = "pending"
    booking_payload["email_notification_error"] = None
    booking_payload["email_notification_sent_at"] = None
    result = get_collection("bookings").insert_one(booking_payload)
    get_collection("tours").update_one(
        {"_id": tour["_id"]},
        {"$inc": {"available_slots": -booking_payload["quantity"]}, "$set": {"updated_at": datetime.utcnow()}},
    )
    get_collection("payment_sessions").update_one(
        {"_id": session["_id"]},
        {
            "$set": {
                "status": "completed",
                "booking_id": str(result.inserted_id),
                "response_code": response_code,
                "transaction_status": transaction_status,
                "vnp_transaction_no": query_params.get("vnp_TransactionNo"),
                "bank_code": query_params.get("vnp_BankCode"),
                "pay_date": query_params.get("vnp_PayDate"),
                "updated_at": datetime.utcnow(),
            }
        },
    )

    created_booking = get_collection("bookings").find_one({"_id": result.inserted_id})
    serialized_booking = serialize_document(created_booking)
    email_sent, email_error = send_booking_confirmation_email(serialized_booking)
    get_collection("bookings").update_one(
        {"_id": result.inserted_id},
        {
            "$set": {
                "email_notification_status": "sent" if email_sent else "failed",
                "email_notification_error": email_error,
                "email_notification_sent_at": datetime.utcnow() if email_sent else None,
                "updated_at": datetime.utcnow(),
            }
        },
    )
    serialized_booking = serialize_document(get_collection("bookings").find_one({"_id": result.inserted_id}))
    return _redirect_frontend("success", "Thanh toan VNPAY thanh cong.", serialized_booking["id"])
