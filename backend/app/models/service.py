from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Service(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    name: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ServiceCreate(BaseModel):
    name: str

class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    is_active: Optional[bool] = None
