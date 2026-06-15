from typing import List, Optional
from bson import ObjectId
import qrcode
import os

from app.db.mongodb import get_database
from app.models.order import Order, OrderCreate
from app.models.customer import CustomerCreate
from app.crud import crud_customer
from datetime import datetime

async def create_order(order: OrderCreate, user_id: str) -> Order:
    db = get_database()
    
    # Get or create customer
    customer_in = CustomerCreate(name=order.customer_name, phone_number=order.customer_phone)
    customer = await crud_customer.get_or_create_customer(customer_in)
    
    # A simple way to generate an order number
    last_order_cursor = db.orders.find().sort([("created_at", -1)]).limit(1)
    last_order = await last_order_cursor.to_list(length=1)
    
    if last_order:
        last_order_number_str = last_order[0]['order_number'].split('-')[1]
        new_order_num = int(last_order_number_str) + 1
    else:
        new_order_num = 1
        
    order_number = f"ORD-{new_order_num:04d}"

    qr_code_value = order_number
    
    qr_code_path = f"backend/static/qrcodes/{order_number}.png"
    qr_code_image_url = f"http://localhost:8000/static/qrcodes/{order_number}.png"
    
    img = qrcode.make(qr_code_value)
    img.save(qr_code_path)

    order_data = order.model_dump()
    order_data.update({
        "order_number": order_number,
        "customer_id": str(customer.id),
        "status": "Received",
        "qr_code_value": qr_code_value,
        "qr_code_image_url": qr_code_image_url,
        "created_by": user_id,
        "updated_by": user_id,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    })

    result = await db.orders.insert_one(order_data)
    created_order = await db.orders.find_one({"_id": result.inserted_id})
    created_order["id"] = str(created_order["_id"])
    
    return Order(**created_order)

async def get_order_by_id(order_id: str) -> Optional[Order]:
    db = get_database()
    order = await db.orders.find_one({"_id": ObjectId(order_id)})
    if order:
        order["id"] = str(order["_id"])
        return Order(**order)
    return None
    
async def get_order_by_order_number(order_number: str) -> Optional[Order]:
    db = get_database()
    order = await db.orders.find_one({"order_number": order_number})
    if order:
        order["id"] = str(order["_id"])
        return Order(**order)
    return None

async def get_orders() -> List[Order]:
    db = get_database()
    orders = []
    async for order in db.orders.find():
        order["id"] = str(order["_id"])
        orders.append(Order(**order))
    return orders

async def update_order_status(order_id: str, status: str, user_id: str) -> Optional[Order]:
    db = get_database()
    
    old_order = await db.orders.find_one({"_id": ObjectId(order_id)})
    if not old_order:
        return None

    await db.orders.update_one(
        {"_id": ObjectId(order_id)},
        {"$set": {"status": status, "updated_by": user_id, "updated_at": datetime.utcnow()}}
    )
    
    await db.order_status_history.insert_one({
        "order_id": ObjectId(order_id),
        "old_status": old_order.get("status"),
        "new_status": status,
        "changed_by": user_id,
        "changed_at": datetime.utcnow()
    })

    updated_order = await db.orders.find_one({"_id": ObjectId(order_id)})
    updated_order["id"] = str(updated_order["_id"])

    customer = await db.customers.find_one({"_id": ObjectId(old_order["customer_id"])})
    if customer and customer.get("telegram_chat_id"):
        from app.telegram_bot import send_telegram_message
        message = f"Hello {customer['name']},\nYour order {updated_order['order_number']} is now: {status}."
        await send_telegram_message(customer["telegram_chat_id"], message)

    return Order(**updated_order)

async def get_history_for_order(order_id: str) -> List:
    db = get_database()
    history_cursor = db.order_status_history.find({"order_id": ObjectId(order_id)})
    history = []
    async for item in history_cursor:
        item["id"] = str(item["_id"])
        # This is a placeholder until we have a proper user name lookup
        item["changed_by"] = "Staff" 
        history.append(item)
    return history
