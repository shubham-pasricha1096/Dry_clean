from typing import Optional
from bson import ObjectId

from app.db.mongodb import get_database
from app.models.customer import Customer, CustomerCreate

async def get_or_create_customer(customer: CustomerCreate) -> Customer:
    db = get_database()
    existing_customer = await db.customers.find_one({"phone_number": customer.phone_number})
    if existing_customer:
        existing_customer["id"] = str(existing_customer["_id"])
        return Customer(**existing_customer)
    
    new_customer_data = customer.model_dump()
    result = await db.customers.insert_one(new_customer_data)
    created_customer = await db.customers.find_one({"_id": result.inserted_id})
    created_customer["id"] = str(created_customer["_id"])
    return Customer(**created_customer)

async def get_customer_by_id(customer_id: str) -> Optional[Customer]:
    db = get_database()
    customer = await db.customers.find_one({"_id": ObjectId(customer_id)})
    if customer:
        customer["id"] = str(customer["_id"])
        return Customer(**customer)
    return None

async def get_customer_by_phone(phone_number: str) -> Optional[Customer]:
    db = get_database()
    customer = await db.customers.find_one({"phone_number": phone_number})
    if customer:
        customer["id"] = str(customer["_id"])
        return Customer(**customer)
    return None

async def update_customer_telegram_chat_id(customer_id: str, chat_id: str):
    db = get_database()
    await db.customers.update_one(
        {"_id": ObjectId(customer_id)},
        {"$set": {"telegram_chat_id": chat_id}}
    )
