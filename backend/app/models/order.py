from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date

class Order(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    order_number: str
    customer_id: str
    customer_name: str
    customer_phone: str
    selected_services: List[str]
    item_description: str
    status: str
    notes: Optional[str] = None
    expected_delivery_date: date
    qr_code_value: str
    qr_code_image_url: Optional[str] = None
    created_by: str  # user id
    updated_by: str  # user id
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    item_description: str
    selected_services: List[str]
    expected_delivery_date: date
    notes: Optional[str] = None

class OrderStatusHistory(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    order_id: str
    old_status: Optional[str] = None
    new_status: str
    changed_by: str
    changed_at: datetime
