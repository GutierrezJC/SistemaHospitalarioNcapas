from fastapi import APIRouter, Request, Response
from app.http_client import call_datos

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.patch("")
async def iniciar(request: Request):
    body = await request.body()
    status, content = await call_datos("/auth", "PATCH", body)
    return Response(content=content, status_code=status, media_type="application/json")


@router.patch("/refrescar")
async def refrescar(request: Request):
    body = await request.body()
    status, content = await call_datos("/auth/refrescar", "PATCH", body)
    return Response(content=content, status_code=status, media_type="application/json")


@router.delete("/{identificacion}")
async def cerrar(identificacion: str, request: Request):
    auth = request.headers.get("Authorization")
    headers = {"Authorization": auth} if auth else {}
    status, content = await call_datos(f"/auth/{identificacion}", "DELETE", headers=headers)
    return Response(content=content, status_code=status, media_type="application/json")
