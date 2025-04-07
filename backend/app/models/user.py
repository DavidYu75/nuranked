from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class User(BaseModel):
    id: str
    email: EmailStr
    name: str
    hashed_password: str
    is_active: bool = True
