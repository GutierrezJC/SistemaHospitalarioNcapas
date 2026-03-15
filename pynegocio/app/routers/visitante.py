from fastapi import APIRouter, Request, Response
from app.http_client import call_datos

router = APIRouter(prefix="/api/visitante", tags=["visitante"])


def _auth(request: Request) -> dict:
    auth = request.headers.get("Authorization")
    return {"Authorization": auth} if auth else {}


@router.get("/filtrar/{pag}/{lim}")
async def filtrar(pag: int, lim: int, request: Request):
    qs = request.url.query
    endpoint = f"/visitante/filtrar/{pag}/{lim}" + (f"?{qs}" if qs else "")
    status, content = await call_datos(endpoint, "GET", headers=_auth(request))
    return Response(content=content, status_code=status, media_type="application/json")


@router.get("/{id}")
async def buscar(id: int, request: Request):
    status, content = await call_datos(f"/visitante/{id}", "GET", headers=_auth(request))
    return Response(content=content, status_code=status, media_type="application/json")


@router.post("")
async def create(request: Request):
    body = await request.body()
    status, content = await call_datos("/visitante", "POST", body, _auth(request))
    return Response(content=content, status_code=status, media_type="application/json")


@router.put("/{identificacion}")
async def update(identificacion: str, request: Request):
    body = await request.body()
    status, content = await call_datos(f"/visitante/{identificacion}", "PUT", body, _auth(request))
    return Response(content=content, status_code=status, media_type="application/json")


@router.delete("/{identificacion}")
async def delete(identificacion: str, request: Request):
    status, content = await call_datos(f"/visitante/{identificacion}", "DELETE", headers=_auth(request))
    return Response(content=content, status_code=status, media_type="application/json")
