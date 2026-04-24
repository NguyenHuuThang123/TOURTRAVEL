from __future__ import annotations

import logging
import smtplib
import ssl
from datetime import datetime
from email.message import EmailMessage

from app.config.settings import get_settings

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


def send_booking_confirmation_email(booking: dict) -> tuple[bool, str | None]:
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

Chung toi da ghi nhan don cua ban va se ho tro neu ban can them thong tin.

TourTravel
""".strip()

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
    </table>
    <p style="margin-top: 16px;">Chung toi da ghi nhan don cua ban va se ho tro neu ban can them thong tin.</p>
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
