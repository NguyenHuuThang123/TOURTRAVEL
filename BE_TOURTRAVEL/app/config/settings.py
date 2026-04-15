import os
from functools import lru_cache


class Settings:
    def __init__(self) -> None:
        self.mongodb_url = os.getenv("MONGODB_URL", "mongodb://127.0.0.1:27017")
        self.mongodb_db_name = os.getenv("MONGODB_DB_NAME", "tourtravel")
        self.google_client_id = os.getenv("GOOGLE_CLIENT_ID", "")
        self.debug = os.getenv("DEBUG", "true").lower() == "true"


@lru_cache
def get_settings() -> Settings:
    return Settings()
