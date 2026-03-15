from fastapi import APIRouter, Request, Response
from app.http_client import call_datos

router = APIRouter(prefix="/api/motivovisita", tags=["motivovisita"])


def _auth(request: Request) -> dict:
    auth = request.headers.get("Authorization")
    return {"Authorization": auth} if auth else {}


@router.get("/filtrar/{pag}/{lim}")
async def filtrar(pag: int, lim: int, request: Request):
    qs = request.url.query
    endpoint = f"/motivovisita/filtrar/{pag}/{lim}" + (f"?{qs}" if qs else "")
    status, content = await call_datos(endpoint, "GET", headers=_auth(request))
    return Response(content=content, status_code=status, media_type="application/json")


@router.post("")
async def create(request: Request):
    body = await request.body()
    status, content = await call_datos("/motivovisita", "POST", body, _auth(request))
    return Response(content=content, status_code=status, media_type="application/json")


@router.put("/{id_motivo}")
async def update(id_motivo: int, request: Request):
    body = await request.body()
    status, content = await call_datos(f"/motivovisita/{id_motivo}", "PUT", body, _auth(request))
    return Response(content=content, status_code=status, media_type="application/json")


@router.delete("/{id_motivo}")
async def delete(id_motivo: int, request: Request):
    status, content = await call_datos(f"/motivovisita/{id_motivo}", "DELETE", headers=_auth(request))
    return Response(content=content, status_code=status, media_type="application/json")
