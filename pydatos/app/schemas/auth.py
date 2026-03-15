from pydantic import BaseModel


class LoginRequest(BaseModel):
    identificacion: str
    passw: str


class RefreshRequest(BaseModel):
    identificacion: str
    tkRef: str


class TokenResponse(BaseModel):
    token: str
    tkRef: str
