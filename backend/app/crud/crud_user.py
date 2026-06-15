from typing import Optional, List
from bson import ObjectId
from datetime import datetime

from app.db.mongodb import get_database
from app.models.user import User, UserCreate
from app.core.security import get_password_hash

async def get_user_by_email(email: str) -> Optional[User]:
    db = get_database()
    user = await db.users.find_one({"email": email})
    if user:
        user["_id"] = str(user["_id"])
        return User(**user)
    return None

async def get_user(user_id: str) -> Optional[User]:
    db = get_database()
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if user:
        user["_id"] = str(user["_id"])
        return User(**user)
    return None

async def get_users() -> List[User]:
    db = get_database()
    users = []
    async for user in db.users.find():
        user["_id"] = str(user["_id"])
        users.append(User(**user))
    return users

async def create_user(user_in: UserCreate) -> User:
    db = get_database()
    hashed_password = get_password_hash(user_in.password)
    user_data = user_in.model_dump(exclude={"password"})
    user_data["password_hash"] = hashed_password
    user_data["created_at"] = datetime.utcnow()
    
    result = await db.users.insert_one(user_data)
    created_user = await db.users.find_one({"_id": result.inserted_id})
    created_user["id"] = str(created_user["_id"])
    return User(**created_user)

async def update_user(user_id: str, user_in: dict) -> Optional[User]:
    db = get_database()
    if "password" in user_in and user_in["password"]:
        user_in["password_hash"] = get_password_hash(user_in.pop("password"))
    
    await db.users.update_one({"_id": ObjectId(user_id)}, {"$set": user_in})
    
    updated_user = await get_user(user_id)
    return updated_user

async def delete_user(user_id: str) -> bool:
    db = get_database()
    result = await db.users.delete_one({"_id": ObjectId(user_id)})
    return result.deleted_count > 0
