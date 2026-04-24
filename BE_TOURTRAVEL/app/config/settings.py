import os
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv


load_dotenv(Path(__file__).resolve().parents[2] / ".env")


class Settings:
    def __init__(self) -> None:
        self.mongodb_url = os.getenv("MONGODB_URL", "mongodb://127.0.0.1:27017")
        self.mongodb_db_name = os.getenv("MONGODB_DB_NAME", "tourtravel")
        self.google_client_id = os.getenv("GOOGLE_CLIENT_ID", "")
        self.backend_base_url = os.getenv("BACKEND_BASE_URL", "http://localhost:8000")
        self.frontend_base_url = os.getenv("FRONTEND_BASE_URL", "http://localhost:5173")
        self.checkin_base_url = os.getenv("CHECKIN_BASE_URL", f"{self.frontend_base_url}/check-in")
        self.vnpay_tmn_code = os.getenv("VNPAY_TMN_CODE", "")
        self.vnpay_hash_secret = os.getenv("VNPAY_HASH_SECRET", "")
        self.vnpay_payment_url = os.getenv("VNPAY_PAYMENT_URL", "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html")
        self.vnpay_return_path = os.getenv("VNPAY_RETURN_PATH", "/api/payments/vnpay/return")
        self.smtp_host = os.getenv("SMTP_HOST", "")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_username = os.getenv("SMTP_USERNAME", "")
        self.smtp_password = os.getenv("SMTP_PASSWORD", "")
        self.smtp_from_email = os.getenv("SMTP_FROM_EMAIL", "")
        self.smtp_reply_to = os.getenv("SMTP_REPLY_TO", "")
        self.smtp_use_tls = os.getenv("SMTP_USE_TLS", "true").lower() == "true"
        self.smtp_use_ssl = os.getenv("SMTP_USE_SSL", "false").lower() == "true"
        self.debug = os.getenv("DEBUG", "true").lower() == "true"


@lru_cache
def get_settings() -> Settings:
    return Settings()
