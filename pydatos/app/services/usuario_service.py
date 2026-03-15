from sqlalchemy.orm import Session
from sqlalchemy import text
from app.auth.password import hash_password
from app.services.auth_service import authenticate


def reset_passw(db: Session, identificacion: str) -> int:
    """Reset password to identificacion (hashed). Returns 200 or 404."""
    passw = hash_password(identificacion)
    result = db.execute(
        text("CALL passwUsuario(:idUsuario, :passw)"),
        {"idUsuario": identificacion, "passw": passw},
    )
    db.commit()
    return 200 if result.rowcount > 0 else 404


def change_passw(db: Session, identificacion: str, passw_actual: str, passw_nueva: str) -> int:
    """Verifies current password then sets new one. Returns 200 or 401."""
    if not authenticate(db, identificacion, passw_actual, cambio_passw=True):
        return 401
    passw_hash = hash_password(passw_nueva)
    db.execute(
        text("CALL passwUsuario(:idUsuario, :passw)"),
        {"idUsuario": identificacion, "passw": passw_hash},
    )
    db.commit()
    return 200


def change_rol(db: Session, identificacion: str, rol: int) -> int:
    """Changes user role. Returns 200 or 404."""
    result = db.execute(
        text("CALL rolUsuario(:idUsuario, :rol)"),
        {"idUsuario": identificacion, "rol": rol},
    )
    db.commit()
    return 200 if result.rowcount > 0 else 404
