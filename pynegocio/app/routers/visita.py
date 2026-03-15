from fastapi import APIRouter, Request, Response
from app.http_client import call_datos

router = APIRouter(prefix="/api/visita", tags=["visita"])


def _auth(request: Request) -> dict:
    auth = request.headers.get("Authorization")
    return {"Authorization": auth} if auth else {}


@router.get("/filtrar")
async def filtrar_nuevo(request: Request):
    qs = request.url.query
    endpoint = "/visita/filtrar" + (f"?{qs}" if qs else "")
    status, content = await call_datos(endpoint, "GET", headers=_auth(request))
    return Response(content=content, status_code=status, media_type="application/json")


@router.get("/filtrar/{pag}/{lim}")
async def filtrar(pag: int, lim: int, request: Request):
    qs = request.url.query
    endpoint = f"/visita/filtrar/{pag}/{lim}" + (f"?{qs}" if qs else "")
    status, content = await call_datos(endpoint, "GET", headers=_auth(request))
    return Response(content=content, status_code=status, media_type="application/json")


@router.get("/buscar/{id}")
async def buscar(id: int, request: Request):
    status, content = await call_datos(f"/visita/buscar/{id}", "GET", headers=_auth(request))
    return Response(content=content, status_code=status, media_type="application/json")


@router.post("")
async def create(request: Request):
    body = await request.body()
    status, content = await call_datos("/visita", "POST", body, _auth(request))
    return Response(content=content, status_code=status, media_type="application/json")


@router.put("/{id_visita}")
async def update(id_visita: int, request: Request):
    body = await request.body()
    status, content = await call_datos(f"/visita/{id_visita}", "PUT", body, _auth(request))
    return Response(content=content, status_code=status, media_type="application/json")


@router.delete("/{id_visita}")
async def delete(id_visita: int, request: Request):
    status, content = await call_datos(f"/visita/{id_visita}", "DELETE", headers=_auth(request))
    return Response(content=content, status_code=status, media_type="application/json")
