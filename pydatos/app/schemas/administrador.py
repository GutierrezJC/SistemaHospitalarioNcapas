from typing import Optional
from pydantic import BaseModel


class AdministradorCreate(BaseModel):
    identificacion: str
    nombre: str
    apellido1: str
    apellido2: str
    telefono: str
    celular: Optional[str] = None
    direccion: Optional[str] = None
    correo: str


class AdministradorUpdate(BaseModel):
    identificacion: str
    nombre: str
    apellido1: str
    apellido2: str
    telefono: str
    celular: Optional[str] = None
    direccion: Optional[str] = None
    correo: str


class AdministradorFiltrar(BaseModel):
    identificacion: Optional[str] = ""
    nombre: Optional[str] = ""
    apellido1: Optional[str] = ""
    apellido2: Optional[str] = ""
    correo: Optional[str] = ""
