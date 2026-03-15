from pydantic import BaseModel


class ChangePasswRequest(BaseModel):
    passw: str    # contraseña actual
    passwN: str   # contraseña nueva


class ChangeRolRequest(BaseModel):
    rol: int
