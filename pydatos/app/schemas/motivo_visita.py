from pydantic import BaseModel


class MotivoVisitaCreate(BaseModel):
    descripcion: str


class MotivoVisitaUpdate(BaseModel):
    descripcion: str
