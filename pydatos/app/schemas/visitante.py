from typing import Optional
from pydantic import BaseModel


class VisitanteCreate(BaseModel):
    identificacion: str
    nombre: str
    apellido1: str
    apellido2: Optional[str] = None
    telefono: Optional[str] = None
    correo: Optional[str] = None
    sector_laboral: Optional[str] = None


class VisitanteUpdate(BaseModel):
    identificacion: str
    nombre: str
    apellido1: str
    apellido2: Optional[str] = None
    telefono: Optional[str] = None
    correo: Optional[str] = None
    sector_laboral: Optional[str] = None


class VisitanteFiltrar(BaseModel):
    identificacion: Optional[str] = ""
    nombre: Optional[str] = ""
    apellido1: Optional[str] = ""
    apellido2: Optional[str] = ""
    correo: Optional[str] = ""
    sector_laboral: Optional[str] = ""
