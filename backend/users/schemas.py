from ninja import Schema
from pydantic import EmailStr

class RegisterIn(Schema):
    email: EmailStr
    username: str
    password: str
    name: str

class UserOut(Schema):
    id: int
    username: str
    email: str
    name: str
    role: str

class LoginIn(Schema):
    email: str
    password: str

class TokenOut(Schema):
    access_token: str
    token_type: str = "bearer"