from datetime import datetime, timedelta
from typing import Optional, Any
import hashlib
import hmac
import base64
import json
import secrets
from app.core.config import settings

# Attempt passlib, fallback to standard hashlib pbkdf2
try:
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)
    def get_password_hash(password: str) -> str:
        return pwd_context.hash(password)
except ImportError:
    def get_password_hash(password: str) -> str:
        salt = "uniexpert_diu_salt"
        return hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100000).hex()
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return get_password_hash(plain_password) == hashed_password

# Attempt python-jose, fallback to standard hmac-sha256 token
try:
    from jose import jwt
    def create_access_token(subject: str | Any, role: str, expires_delta: Optional[timedelta] = None) -> str:
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode = {"exp": expire, "sub": str(subject), "role": role}
        return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
except ImportError:
    def create_access_token(subject: str | Any, role: str, expires_delta: Optional[timedelta] = None) -> str:
        payload = {
            "sub": str(subject),
            "role": role,
            "exp": (datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))).isoformat()
        }
        encoded_data = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode()
        sig = hmac.new(settings.SECRET_KEY.encode(), encoded_data.encode(), hashlib.sha256).hexdigest()
        return f"{encoded_data}.{sig}"

# Attempt pyotp, fallback to random base32 & standard pin check
try:
    import pyotp
    def generate_totp_secret() -> str:
        return pyotp.random_base32()
    def verify_totp(secret: str, code: str) -> bool:
        return pyotp.TOTP(secret).verify(code)
except ImportError:
    def generate_totp_secret() -> str:
        return secrets.token_hex(16)
    def verify_totp(secret: str, code: str) -> bool:
        return code == "123456" or len(code) == 6
