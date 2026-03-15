from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.schemas.auth import LoginRequest, RefreshRequest, TokenResponse
from app.services.auth_service import authenticate, modify_token, verify_refresh_token
from app.auth.jwt_handler import create_token, create_refresh_token, decode_token_no_verify

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.patch("", response_model=TokenResponse)
def iniciar(body: LoginRequest, db: Session = Depends(get_db)):
    datos = authenticate(db, body.identificacion, body.passw)
    if not datos:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    token = create_token(body.identificacion, datos["rol"], datos["nombre"])
    tk_ref = create_refresh_token(datos["rol"], datos["nombre"])
    modify_token(db, body.identificacion, tk_ref)

    return {"token": token, "tkRef": tk_ref}


@router.patch("/refrescar", response_model=TokenResponse)
def refrescar(body: RefreshRequest, db: Session = Depends(get_db)):
    rol = verify_refresh_token(db, body.identificacion, body.tkRef)
    if not rol:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    payload = decode_token_no_verify(body.tkRef)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    token = create_token(body.identificacion, payload["rol"], payload["nom"])
    tk_ref = create_refresh_token(payload["rol"], payload["nom"])
    modify_token(db, body.identificacion, tk_ref)

    return {"token": token, "tkRef": tk_ref}


@router.delete("/{identificacion}")
def cerrar(identificacion: str, db: Session = Depends(get_db)):
    modify_token(db, identificacion)
    return {}
