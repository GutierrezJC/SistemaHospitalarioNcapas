from sqlalchemy.orm import Session
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError


def _build_filtro(params: dict) -> str:
    filtro = "%"
    for value in params.values():
        filtro += f"{value}%&%"
    if len(filtro) > 0:
        filtro = filtro[:-1]
    return filtro


def create_visita(db: Session, datos: dict) -> int:
    sql = ("SELECT nuevaVisita(:identificacion_visitante, :identificacion_administrador, "
           ":motivo_visita, :fecha_entrada, :fecha_salida, :estado) AS resultado")
    try:
        with db.begin():
            result = db.execute(text(sql), datos).fetchone()
            res = result[0]
            if res == 1:
                raise IntegrityError(None, None, None)
        return 201
    except IntegrityError:
        return 409
    except Exception:
        return 500


def update_visita(db: Session, id_visita: int, datos: dict) -> int:
    sql = ("SELECT editarVisita(:id_visita, :identificacion_visitante, :identificacion_administrador, "
           ":motivo_visita, :fecha_entrada, :fecha_salida, :estado) AS resultado")
    bound = {"id_visita": id_visita, **datos}
    try:
        with db.begin():
            result = db.execute(text(sql), bound).fetchone()
            res = result[0]
        return 404 if res == 1 else 200
    except Exception:
        return 500


def delete_visita(db: Session, id_visita: int) -> int:
    sql = "SELECT eliminarVisita(:id_visita) AS resultado"
    result = db.execute(text(sql), {"id_visita": id_visita}).fetchone()
    db.commit()
    return 200 if result and result[0] > 0 else 404


def filtrar_visita(db: Session, params: dict, pag: int, lim: int) -> dict:
    filtro = _build_filtro(params)
    rows = db.execute(
        text("CALL filtrarVisita(:filtro, :pag, :lim)"),
        {"filtro": filtro, "pag": pag, "lim": lim},
    ).fetchall()
    data = [dict(r._mapping) for r in rows]
    return {"datos": data, "status": 200 if data else 204}


def filtrar_visita_nuevo(db: Session, params: dict) -> dict:
    """Uses filtrarfVisita with fixed pag=0, lim=10 — mirrors filtrarNuevo()"""
    filtro = _build_filtro(params)
    rows = db.execute(
        text("CALL filtrarfVisita(:filtro, :pag, :lim)"),
        {"filtro": filtro, "pag": 0, "lim": 10},
    ).fetchall()
    data = [dict(r._mapping) for r in rows]
    return {"datos": data, "status": 200 if data else 204}


def buscar_visita(db: Session, id: int) -> dict:
    row = db.execute(
        text("CALL buscarVisita(:id)"),
        {"id": id},
    ).fetchone()
    data = dict(row._mapping) if row else None
    # PHP wraps result in array: json_encode([ $res ])
    return {"datos": [data] if data else [], "status": 200 if data else 204}
