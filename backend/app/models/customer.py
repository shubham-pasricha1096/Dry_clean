from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Customer(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    name: str
    phone_number: str
    telegram_chat_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CustomerCreate(BaseModel):
    name: str
    phone_number: str
