from fastapi import APIRouter, Request, Response
from app.http_client import call_datos

router = APIRouter(prefix="/api/usuario", tags=["usuario"])


def _auth(request: Request) -> dict:
    auth = request.headers.get("Authorization")
    return {"Authorization": auth} if auth else {}


@router.patch("/reset/{identificacion}")
async def reset(identificacion: str, request: Request):
    status, content = await call_datos(f"/usuario/reset/{identificacion}", "PATCH", headers=_auth(request))
    return Response(content=content, status_code=status, media_type="application/json")


@router.patch("/change/{identificacion}")
async def change(identificacion: str, request: Request):
    body = await request.body()
    status, content = await call_datos(f"/usuario/change/{identificacion}", "PATCH", body, _auth(request))
    return Response(content=content, status_code=status, media_type="application/json")


@router.patch("/rol/{identificacion}")
async def rol(identificacion: str, request: Request):
    body = await request.body()
    status, content = await call_datos(f"/usuario/rol/{identificacion}", "PATCH", body, _auth(request))
    return Response(content=content, status_code=status, media_type="application/json")
