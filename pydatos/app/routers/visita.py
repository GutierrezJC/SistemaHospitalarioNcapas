from fastapi import APIRouter, Depends, Response, Request
from sqlalchemy.orm import Session
from app.dependencies import get_db, get_current_user
from app.schemas.visita import VisitaCreate, VisitaUpdate
from app.services.visita_service import (
    create_visita, update_visita, delete_visita,
    filtrar_visita, filtrar_visita_nuevo, buscar_visita
)
import json
from datetime import datetime, date

def _json_serial(obj):
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")

router = APIRouter(
    prefix="/api/visita",
    tags=["visita"],
    dependencies=[Depends(get_current_user)],
)


# IMPORTANT: static routes before path-param routes
@router.get("/filtrar")
def filtrar_nuevo(request: Request, db: Session = Depends(get_db)):
    params = dict(request.query_params)
    resp = filtrar_visita_nuevo(db, params)
    return Response(
        content=json.dumps(resp["datos"], default=_json_serial),
        status_code=resp["status"],
        media_type="application/json",
    )


@router.get("/filtrar/{pag}/{lim}")
def filtrar(pag: int, lim: int, request: Request, db: Session = Depends(get_db)):
    params = dict(request.query_params)
    resp = filtrar_visita(db, params, pag, lim)
    return Response(
        content=json.dumps(resp["datos"], default=_json_serial),
        status_code=resp["status"],
        media_type="application/json",
    )


@router.get("/buscar/{id}")
def buscar(id: int, db: Session = Depends(get_db)):
    resp = buscar_visita(db, id)
    return Response(
        content=json.dumps(resp["datos"], default=_json_serial),
        status_code=resp["status"],
        media_type="application/json",
    )


@router.post("")
def create(body: VisitaCreate, db: Session = Depends(get_db)):
    status = create_visita(db, body.model_dump())
    return Response(status_code=status)


@router.put("/{id_visita}")
def update(id_visita: int, body: VisitaUpdate, db: Session = Depends(get_db)):
    status = update_visita(db, id_visita, body.model_dump())
    return Response(status_code=status)


@router.delete("/{id_visita}")
def delete(id_visita: int, db: Session = Depends(get_db)):
    status = delete_visita(db, id_visita)
    return Response(status_code=status)
