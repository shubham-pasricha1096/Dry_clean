from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime

class User(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    name: str
    phone: str
    email: EmailStr
    password_hash: str
    role: str  # "admin" or "staff"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(BaseModel):
    name: str
    phone: str
    email: EmailStr
    password: str
    role: str

class UserInDB(User):
    pass

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    role: Optional[str] = None
