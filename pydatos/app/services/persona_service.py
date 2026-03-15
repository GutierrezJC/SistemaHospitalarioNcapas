"""
Generic CRUD service using stored procedures — mirrors Persona.php
"""
from sqlalchemy.orm import Session
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
from app.auth.password import hash_password


def _build_filtro(params: dict) -> str:
    """Replicates PHP: $filtro = '%'; foreach(...) $filtro .= "$value%&%"; substr(-1)"""
    filtro = "%"
    for value in params.values():
        filtro += f"{value}%&%"
    if len(filtro) > 0:
        filtro = filtro[:-1]
    return filtro


def create_persona(db: Session, recurso: str, rol: int, datos: dict) -> int:
    """
    Calls SELECT nuevo{recurso}(...) then SELECT nuevoUsuario(...).
    Returns HTTP status code: 201, 409, or 500.
    """
    params_list = ", ".join(f":{k}" for k in datos)
    sql = f"SELECT nuevo{recurso}({params_list})"

    identificacion = datos.get("identificacion")

    try:
        with db.begin():
            result = db.execute(text(sql), datos).fetchone()
            res = result[0]
            if res == 1:
                raise IntegrityError(None, None, None)  # triggers rollback

            passw = hash_password(identificacion)
            db.execute(
                text("SELECT nuevoUsuario(:identificacion, :correo, :rol, :passw)"),
                {
                    "identificacion": identificacion,
                    "correo": datos.get("correo", ""),
                    "rol": str(rol),
                    "passw": passw,
                },
            )
        return 201
    except IntegrityError:
        return 409
    except Exception:
        return 500


def update_persona(db: Session, recurso: str, datos: dict, identificacion: str) -> int:
    """
    Calls SELECT editar{recurso}(:identificacion, ...).
    Returns 200, 404, 409, or 500.
    """
    params_list = ", ".join(f":{k}" for k in datos)
    sql = f"SELECT editar{recurso}(:identificacion, {params_list})"
    bound = {"identificacion": identificacion, **datos}

    try:
        with db.begin():
            result = db.execute(text(sql), bound).fetchone()
            res = result[0]
        return 404 if res == 1 else 200
    except IntegrityError:
        return 409
    except Exception:
        return 500


def delete_persona(db: Session, recurso: str, identificacion: str) -> int:
    """
    Calls SELECT eliminar{recurso}(:identificacion).
    Returns 200 or 404.
    """
    sql = f"SELECT eliminar{recurso}(:identificacion)"
    result = db.execute(text(sql), {"identificacion": identificacion}).fetchone()
    db.commit()
    return 200 if result and result[0] > 0 else 404


def filtrar_persona(db: Session, recurso: str, params: dict, pag: int, lim: int) -> dict:
    """
    Calls CALL filtrar{recurso}(:filtro, :pag, :lim).
    Returns {"datos": [...], "status": 200|204}
    """
    filtro = _build_filtro(params)
    sql = f"CALL filtrar{recurso}(:filtro, :pag, :lim)"
    rows = db.execute(text(sql), {"filtro": filtro, "pag": pag, "lim": lim}).fetchall()
    data = [dict(r._mapping) for r in rows]
    status = 200 if data else 204
    return {"datos": data, "status": status}


def buscar_persona(db: Session, recurso: str, id: int) -> dict:
    """
    Calls CALL buscar{recurso}(:id, '').
    Returns {"datos": {...}|None, "status": 200|204}
    """
    sql = f"CALL buscar{recurso}(:id, :extra)"
    row = db.execute(text(sql), {"id": id, "extra": ""}).fetchone()
    data = dict(row._mapping) if row else None
    status = 200 if data else 204
    return {"datos": data, "status": status}
