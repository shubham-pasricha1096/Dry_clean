from typing import List, Optional
from bson import ObjectId
from datetime import datetime

from app.db.mongodb import get_database
from app.models.service import Service, ServiceCreate, ServiceUpdate

async def get_active_services() -> List[Service]:
    db = get_database()
    services = []
    async for service in db.services.find({"is_active": True}):
        service["_id"] = str(service["_id"])
        services.append(Service(**service))
    return services

async def get_all_services() -> List[Service]:
    db = get_database()
    services = []
    async for service in db.services.find():
        service["_id"] = str(service["_id"])
        services.append(Service(**service))
    return services

async def create_service(service_in: ServiceCreate) -> Service:
    db = get_database()
    service_data = service_in.model_dump()
    service_data["created_at"] = datetime.utcnow()
    service_data["is_active"] = True
    
    result = await db.services.insert_one(service_data)
    created_service = await db.services.find_one({"_id": result.inserted_id})
    created_service["id"] = str(created_service["_id"])
    return Service(**created_service)

async def get_service(service_id: str) -> Optional[Service]:
    db = get_database()
    service = await db.services.find_one({"_id": ObjectId(service_id)})
    if service:
        service["id"] = str(service["_id"])
        return Service(**service)
    return None

async def update_service(service_id: str, service_in: ServiceUpdate) -> Optional[Service]:
    db = get_database()
    update_data = service_in.model_dump(exclude_unset=True)
    
    await db.services.update_one(
        {"_id": ObjectId(service_id)},
        {"$set": update_data}
    )
    return await get_service(service_id)

async def delete_service(service_id: str) -> bool:
    db = get_database()
    result = await db.services.delete_one({"_id": ObjectId(service_id)})
    return result.deleted_count > 0
