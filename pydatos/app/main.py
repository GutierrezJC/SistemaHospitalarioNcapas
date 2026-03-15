from fastapi import FastAPI
from app.auth.router import router as auth_router
from app.routers.administrador import router as administrador_router
from app.routers.visitante import router as visitante_router
from app.routers.visita import router as visita_router
from app.routers.motivo_visita import router as motivo_visita_router
from app.routers.usuario import router as usuario_router

app = FastAPI(title="Sistema Hospitalario - Datos API")

# Auth router does NOT require JWT (login endpoint)
app.include_router(auth_router)

# All other routers require JWT (enforced inside each router via dependencies)
app.include_router(administrador_router)
app.include_router(visitante_router)
app.include_router(visita_router)
app.include_router(motivo_visita_router)
app.include_router(usuario_router)
