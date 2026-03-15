from typing import Optional, Literal
from pydantic import BaseModel


class VisitaCreate(BaseModel):
    identificacion_visitante: str
    identificacion_administrador: str
    motivo_visita: Optional[str] = None
    fecha_entrada: str
    fecha_salida: Optional[str] = None
    estado: Literal["en curso", "finalizada"] = "en curso"


class VisitaUpdate(BaseModel):
    identificacion_visitante: str
    identificacion_administrador: str
    motivo_visita: Optional[str] = None
    fecha_entrada: str
    fecha_salida: Optional[str] = None
    estado: Literal["en curso", "finalizada"]
