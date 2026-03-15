from sqlalchemy.orm import Session
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError


def create_motivo(db: Session, descripcion: str) -> int:
    try:
        result = db.execute(
            text("SELECT nuevoMotivoVisita(:descripcion) AS resultado"),
            {"descripcion": descripcion},
        ).fetchone()
        db.commit()
        res = result[0]
        return 201 if res == 0 else 409
    except Exception:
        return 500


def update_motivo(db: Session, id_motivo: int, descripcion: str) -> int:
    try:
        result = db.execute(
            text("SELECT editarMotivoVisita(:id_motivo, :descripcion) AS resultado"),
            {"id_motivo": id_motivo, "descripcion": descripcion},
        ).fetchone()
        db.commit()
        res = result[0]
        return 404 if res == 1 else 200
    except Exception:
        return 500


def delete_motivo(db: Session, id_motivo: int) -> int:
    try:
        result = db.execute(
            text("SELECT eliminarMotivoVisita(:id_motivo) AS resultado"),
            {"id_motivo": id_motivo},
        ).fetchone()
        db.commit()
        return 200 if result and result[0] > 0 else 404
    except Exception:
        return 500


def filtrar_motivos(db: Session, descripcion: str, pag: int, lim: int) -> dict:
    filtro = f"%{descripcion}%"
    try:
        rows = db.execute(
            text("CALL filtrarMotivoVisita(:filtro, :pag, :lim)"),
            {"filtro": filtro, "pag": pag, "lim": lim},
        ).fetchall()
        data = [dict(r._mapping) for r in rows]
        return {"datos": data, "status": 200 if data else 204}
    except Exception:
        return {"datos": [], "status": 500}
