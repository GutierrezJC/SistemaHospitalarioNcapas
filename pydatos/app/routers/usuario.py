from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from app.dependencies import get_db, get_current_user
from app.schemas.usuario import ChangePasswRequest, ChangeRolRequest
from app.services.usuario_service import reset_passw, change_passw, change_rol

router = APIRouter(
    prefix="/api/usuario",
    tags=["usuario"],
    dependencies=[Depends(get_current_user)],
)


@router.patch("/reset/{identificacion}")
def reset(identificacion: str, db: Session = Depends(get_db)):
    status = reset_passw(db, identificacion)
    return Response(status_code=status)


@router.patch("/change/{identificacion}")
def change(identificacion: str, body: ChangePasswRequest, db: Session = Depends(get_db)):
    status = change_passw(db, identificacion, body.passw, body.passwN)
    return Response(status_code=status)


@router.patch("/rol/{identificacion}")
def rol(identificacion: str, body: ChangeRolRequest, db: Session = Depends(get_db)):
    status = change_rol(db, identificacion, body.rol)
    return Response(status_code=status)
