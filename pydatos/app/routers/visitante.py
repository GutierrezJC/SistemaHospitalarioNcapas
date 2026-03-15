from fastapi import APIRouter, Depends, Response, Request
from sqlalchemy.orm import Session
from app.dependencies import get_db, get_current_user
from app.schemas.visitante import VisitanteCreate, VisitanteUpdate
from app.services.persona_service import (
    create_persona, update_persona, delete_persona,
    filtrar_persona, buscar_persona
)
import json

RECURSO = "Visitante"
ROL = 2

router = APIRouter(
    prefix="/api/visitante",
    tags=["visitante"],
    dependencies=[Depends(get_current_user)],
)


@router.get("/filtrar/{pag}/{lim}")
def filtrar(pag: int, lim: int, request: Request, db: Session = Depends(get_db)):
    params = dict(request.query_params)
    resp = filtrar_persona(db, RECURSO, params, pag, lim)
    return Response(
        content=json.dumps(resp["datos"]),
        status_code=resp["status"],
        media_type="application/json",
    )


@router.get("/{id}")
def buscar(id: int, db: Session = Depends(get_db)):
    resp = buscar_persona(db, RECURSO, id)
    return Response(
        content=json.dumps(resp["datos"]),
        status_code=resp["status"],
        media_type="application/json",
    )


@router.post("")
def create(body: VisitanteCreate, db: Session = Depends(get_db)):
    status = create_persona(db, RECURSO, ROL, body.model_dump())
    return Response(status_code=status)


@router.put("/{identificacion}")
def update(identificacion: str, body: VisitanteUpdate, db: Session = Depends(get_db)):
    status = update_persona(db, RECURSO, body.model_dump(exclude_none=True), identificacion)
    return Response(status_code=status)


@router.delete("/{identificacion}")
def delete(identificacion: str, db: Session = Depends(get_db)):
    status = delete_persona(db, RECURSO, identificacion)
    return Response(status_code=status)
