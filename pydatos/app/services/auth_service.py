from sqlalchemy.orm import Session
from sqlalchemy import text
from app.auth.password import verify_password


def authenticate(db: Session, identificacion: str, passw: str, cambio_passw: bool = False):
    """
    Verifica credenciales. Retorna {"rol": ..., "nombre": ...} si es exitoso,
    True si cambio_passw=True, o None si falla.
    """
    row = db.execute(
        text("SELECT * FROM usuario WHERE identificacion = :id OR correo = :id"),
        {"id": identificacion},
    ).fetchone()

    if row is None or not verify_password(passw, row.passw):
        return None

    if cambio_passw:
        return True

    rol = str(row.rol)
    recurso = "administrador" if int(rol) == 1 else "visitante"

    nombre_row = db.execute(
        text(f"SELECT nombre FROM {recurso} WHERE identificacion = :id OR correo = :id"),
        {"id": row.identificacion},
    ).fetchone()

    nombre = nombre_row.nombre if nombre_row else ""
    return {"rol": rol, "nombre": nombre}


def modify_token(db: Session, identificacion: str, tk_ref: str = "") -> None:
    """Actualiza (o borra) el tkRef en la tabla usuario."""
    db.execute(
        text("SELECT modificarToken(:identificacion, :tkRef)"),
        {"identificacion": identificacion, "tkRef": tk_ref},
    )
    db.commit()


def verify_refresh_token(db: Session, identificacion: str, tk_ref: str) -> str | None:
    """
    Verifica que el tkRef exista en la BD.
    Retorna el rol si es válido, None si no.
    """
    result = db.execute(
        text("CALL verificarTokenR(:identificacion, :tkRef)"),
        {"identificacion": identificacion, "tkRef": tk_ref},
    ).fetchone()

    if result:
        return result[0]
    return None
