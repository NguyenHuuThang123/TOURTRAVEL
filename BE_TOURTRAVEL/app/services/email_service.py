from __future__ import annotations

import io
import json
import logging
import smtplib
import ssl
from datetime import datetime
from email.message import EmailMessage
from urllib.parse import urlencode

from bson import ObjectId

from app.config.settings import get_settings
from app.database import get_collection, serialize_document

logger = logging.getLogger(__name__)


def _format_currency(value: float | int | None) -> str:
    amount = int(round(float(value or 0), 0))
    return f"{amount:,}".replace(",", ".") + " VND"


def _format_datetime(value: datetime | None) -> str:
    if not value:
        return "Dang cap nhat"
    return value.strftime("%d/%m/%Y %H:%M")


def is_email_enabled() -> bool:
    settings = get_settings()
    return bool(
        settings.smtp_host
        and settings.smtp_port
        and settings.smtp_username
        and settings.smtp_password
        and settings.smtp_from_email
    )


def _has_value(value) -> bool:
    return value not in (None, "", [], {})


def _build_checkin_url(booking: dict) -> str:
    settings = get_settings()
    query = urlencode({"booking_id": booking.get("id", "")})
    return f"{settings.checkin_base_url}?{query}"


def _build_checkin_qr_payload(booking: dict) -> dict:
    return {
        "type": "tourtravel_checkin",
        "version": 1,
        "booking_id": booking.get("id"),
        "tour_id": booking.get("tour_id"),
        "checkin_url": _build_checkin_url(booking),
        "issued_at": datetime.utcnow().isoformat(timespec="seconds") + "Z",
    }


def _generate_checkin_qr_png(booking: dict) -> bytes | None:
    try:
        import qrcode
        from qrcode.image.pure import PyPNGImage
        from qrcode.constants import ERROR_CORRECT_M
    except ImportError:
        logger.warning("QR code generation skipped because qrcode dependency is not installed.")
        return None

    qr = qrcode.QRCode(
        version=None,
        error_correction=ERROR_CORRECT_M,
        box_size=8,
        border=2,
    )
    qr.add_data(json.dumps(_build_checkin_qr_payload(booking), ensure_ascii=True, separators=(",", ":")))
    qr.make(fit=True)

    image = qr.make_image(image_factory=PyPNGImage)
    buffer = io.BytesIO()
    image.save(buffer)
    return buffer.getvalue()


def _get_latest_booking_snapshot(booking: dict) -> dict:
    booking_snapshot = dict(booking)
    booking_id = booking_snapshot.get("id")

    if booking_id and ObjectId.is_valid(booking_id):
        latest_booking = get_collection("bookings").find_one({"_id": ObjectId(booking_id)})
        if latest_booking:
            booking_snapshot = serialize_document(latest_booking)

    tour_id = booking_snapshot.get("tour_id")
    if tour_id and ObjectId.is_valid(tour_id):
        tour = serialize_document(get_collection("tours").find_one({"_id": ObjectId(tour_id)}))
        if tour:
            fallback_fields = {
                "tour_name": tour.get("name"),
                "tour_destination": tour.get("destination"),
                "tour_image": tour.get("image"),
                "guide_id": tour.get("guide_id"),
                "guide_name": tour.get("guide_name"),
                "start_date": tour.get("start_date"),
                "end_date": tour.get("end_date"),
            }
            for key, value in fallback_fields.items():
                if not _has_value(booking_snapshot.get(key)) and _has_value(value):
                    booking_snapshot[key] = value

    guide_id = booking_snapshot.get("guide_id")
    if guide_id and ObjectId.is_valid(guide_id) and not _has_value(booking_snapshot.get("guide_name")):
        guide = get_collection("users").find_one({"_id": ObjectId(guide_id), "role": "guide"})
        if guide:
            booking_snapshot["guide_name"] = guide.get("name")

    return booking_snapshot


def send_booking_confirmation_email(booking: dict) -> tuple[bool, str | None]:
    booking = _get_latest_booking_snapshot(booking)
    settings = get_settings()
    recipient = booking.get("user_email")
    if not recipient:
        logger.warning("Skip booking confirmation email because recipient email is missing.")
        return False, "missing_recipient"

    if not is_email_enabled():
        logger.warning("Skip booking confirmation email because SMTP is not configured.")
        return False, "smtp_not_configured"

    subject = f"Xac nhan dat tour thanh cong - {booking.get('tour_name', 'TourTravel')}"
    plain_body = f"""
Xin chao {booking.get("user_name", "Quy khach")},

Cam on ban da dat tour thanh cong tai TourTravel.

Thong tin booking:
- Ma booking: {booking.get("id", "Dang cap nhat")}
- Tour: {booking.get("tour_name", "Dang cap nhat")}
- Diem den: {booking.get("tour_destination", "Dang cap nhat")}
- Ngay khoi hanh: {_format_datetime(booking.get("start_date"))}
- Ngay ket thuc: {_format_datetime(booking.get("end_date"))}
- So luong khach: {booking.get("quantity", 0)}
- Phuong thuc thanh toan: {booking.get("payment_method", "Dang cap nhat")}
- Tong thanh toan: {_format_currency(booking.get("total_price"))}
- Huong dan vien: {booking.get("guide_name") or "Se cap nhat sau"}
- Link check-in: {_build_checkin_url(booking)}

Chung toi da ghi nhan don cua ban va se ho tro neu ban can them thong tin.
Neu Gmail khong hien ma QR ngay trong noi dung, ban co the mo file QR dinh kem trong email.

TourTravel
""".strip()

    qr_image = _generate_checkin_qr_png(booking)
    qr_cid = "tourtravel-checkin-qr"
    qr_section = ""
    if qr_image:
        qr_section = f"""
    <div style="margin-top: 20px; padding: 16px; max-width: 640px; border: 1px solid #e2e8f0; border-radius: 12px; text-align: center;">
      <p style="margin: 0 0 8px; font-size: 14px; color: #475569;">Ma QR check-in</p>
      <img src="cid:{qr_cid}" alt="QR code check-in cho booking {booking.get("id", "")}" style="width: 180px; height: 180px; display: block; margin: 0 auto 12px;" />
      <p style="margin: 0; font-size: 13px; color: #64748b;">Luu ma nay de su dung khi tinh nang check-in duoc kich hoat.</p>
    </div>
""".rstrip()

    html_body = f"""
<html>
  <body style="font-family: Arial, sans-serif; color: #0f172a;">
    <h2 style="margin-bottom: 8px;">Xac nhan dat tour thanh cong</h2>
    <p>Xin chao <strong>{booking.get("user_name", "Quy khach")}</strong>,</p>
    <p>Cam on ban da dat tour thanh cong tai TourTravel.</p>
    <table style="border-collapse: collapse; width: 100%; max-width: 640px;">
      <tr><td style="padding: 8px; border: 1px solid #e2e8f0;"><strong>Ma booking</strong></td><td style="padding: 8px; border: 1px solid #e2e8f0;">{booking.get("id", "Dang cap nhat")}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #e2e8f0;"><strong>Tour</strong></td><td style="padding: 8px; border: 1px solid #e2e8f0;">{booking.get("tour_name", "Dang cap nhat")}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #e2e8f0;"><strong>Diem den</strong></td><td style="padding: 8px; border: 1px solid #e2e8f0;">{booking.get("tour_destination", "Dang cap nhat")}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #e2e8f0;"><strong>Ngay khoi hanh</strong></td><td style="padding: 8px; border: 1px solid #e2e8f0;">{_format_datetime(booking.get("start_date"))}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #e2e8f0;"><strong>Ngay ket thuc</strong></td><td style="padding: 8px; border: 1px solid #e2e8f0;">{_format_datetime(booking.get("end_date"))}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #e2e8f0;"><strong>So luong khach</strong></td><td style="padding: 8px; border: 1px solid #e2e8f0;">{booking.get("quantity", 0)}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #e2e8f0;"><strong>Phuong thuc thanh toan</strong></td><td style="padding: 8px; border: 1px solid #e2e8f0;">{booking.get("payment_method", "Dang cap nhat")}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #e2e8f0;"><strong>Tong thanh toan</strong></td><td style="padding: 8px; border: 1px solid #e2e8f0;">{_format_currency(booking.get("total_price"))}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #e2e8f0;"><strong>Huong dan vien</strong></td><td style="padding: 8px; border: 1px solid #e2e8f0;">{booking.get("guide_name") or "Se cap nhat sau"}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #e2e8f0;"><strong>Link check-in</strong></td><td style="padding: 8px; border: 1px solid #e2e8f0;"><a href="{_build_checkin_url(booking)}">{_build_checkin_url(booking)}</a></td></tr>
    </table>
    {qr_section}
    <p style="margin-top: 16px;">Chung toi da ghi nhan don cua ban va se ho tro neu ban can them thong tin.</p>
    <p style="margin-top: 8px; color: #64748b; font-size: 13px;">Neu Gmail chua hien ma QR ngay trong noi dung, vui long mo file QR dinh kem trong email.</p>
    <p>TourTravel</p>
  </body>
</html>
""".strip()

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = settings.smtp_from_email
    message["To"] = recipient
    if settings.smtp_reply_to:
        message["Reply-To"] = settings.smtp_reply_to
    message.set_content(plain_body)
    message.add_alternative(html_body, subtype="html")
    if qr_image:
        message.get_payload()[-1].add_related(
            qr_image,
            maintype="image",
            subtype="png",
            cid=f"<{qr_cid}>",
            filename=f"tourtravel-checkin-{booking.get('id', 'booking')}.png",
            disposition="inline",
        )
        message.add_attachment(
            qr_image,
            maintype="image",
            subtype="png",
            filename=f"tourtravel-checkin-{booking.get('id', 'booking')}.png",
        )

    try:
        if settings.smtp_use_ssl:
            with smtplib.SMTP_SSL(
                settings.smtp_host,
                settings.smtp_port,
                context=ssl.create_default_context(),
                timeout=15,
            ) as server:
                server.login(settings.smtp_username, settings.smtp_password)
                server.send_message(message)
        else:
            with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=15) as server:
                server.ehlo()
                if settings.smtp_use_tls:
                    server.starttls(context=ssl.create_default_context())
                    server.ehlo()
                server.login(settings.smtp_username, settings.smtp_password)
                server.send_message(message)
        return True, None
    except Exception as exc:
        logger.exception("Failed to send booking confirmation email to %s", recipient)
        return False, str(exc)
