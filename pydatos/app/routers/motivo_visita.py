from fastapi import APIRouter, Depends, Response, Request
from sqlalchemy.orm import Session
from app.dependencies import get_db, get_current_user
from app.schemas.motivo_visita import MotivoVisitaCreate, MotivoVisitaUpdate
from app.services.motivo_visita_service import (
    create_motivo, update_motivo, delete_motivo, filtrar_motivos
)
import json

router = APIRouter(
    prefix="/api/motivovisita",
    tags=["motivovisita"],
    dependencies=[Depends(get_current_user)],
)


@router.get("/filtrar/{pag}/{lim}")
def filtrar(pag: int, lim: int, request: Request, db: Session = Depends(get_db)):
    descripcion = request.query_params.get("descripcion", "")
    resp = filtrar_motivos(db, descripcion, pag, lim)
    return Response(
        content=json.dumps(resp["datos"]),
        status_code=resp["status"],
        media_type="application/json",
    )


@router.post("")
def create(body: MotivoVisitaCreate, db: Session = Depends(get_db)):
    status = create_motivo(db, body.descripcion)
    return Response(status_code=status)


@router.put("/{id_motivo}")
def update(id_motivo: int, body: MotivoVisitaUpdate, db: Session = Depends(get_db)):
    status = update_motivo(db, id_motivo, body.descripcion)
    return Response(status_code=status)


@router.delete("/{id_motivo}")
def delete(id_motivo: int, db: Session = Depends(get_db)):
    status = delete_motivo(db, id_motivo)
    return Response(status_code=status)
