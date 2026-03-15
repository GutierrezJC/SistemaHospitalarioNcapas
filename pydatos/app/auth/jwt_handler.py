import os
import time
from dotenv import load_dotenv
from jose import jwt, JWTError

load_dotenv()

SECRET_KEY = os.getenv("KEY", "")
ALGORITHM = "HS256"
TOKEN_EXPIRE_SECONDS = 3600


def create_token(identificacion: str, rol: str, nombre: str) -> str:
    now = int(time.time())
    payload = {
        "iss": "localhost",
        "iat": now,
        "exp": now + TOKEN_EXPIRE_SECONDS,
        "sub": identificacion,
        "rol": rol,
        "nom": nombre,
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(rol: str, nombre: str) -> str:
    now = int(time.time())
    payload = {
        "iss": "localhost",
        "iat": now,
        "rol": rol,
        "nom": nombre,
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None


def decode_token_no_verify(token: str) -> dict | None:
    """Decode without expiry verification — used for refresh tokens (no exp claim)."""
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], options={"verify_exp": False})
    except JWTError:
        return None
