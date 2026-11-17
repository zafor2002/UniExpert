try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseSettings

from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "UniExpert Backend API"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api"
    
    # Security
    SECRET_KEY: str = "uniexpert-super-secret-jwt-key-2026-diu-swe"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173"
    ]
    
    # Database (Defaults to SQLite for instant zero-config local run)
    DATABASE_URL: str = "sqlite:///./uniexpert.db"
    
    # Qdrant Vector Store
    QDRANT_HOST: str = "localhost"
    QDRANT_PORT: int = 6333
    QDRANT_COLLECTION: str = "faculty_publications"
    VECTOR_DIMENSION: int = 384
    
    # Academic Whitelist
    ALLOWED_EMAIL_DOMAIN: str = "diu.edu.bd"

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
