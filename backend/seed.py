import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from app.core.security import get_password_hash
import pymongo

services = [
    "Dry Cleaning", "Wash and Fold Laundry", "Ironing and Pressing",
    "Stain Removal", "Shirt Laundry Service", "Alterations and Repairs",
    "Suit and Blazer Cleaning", "Saree and Ethnic Wear Cleaning",
    "Blanket and Comforter Cleaning", "Curtain Cleaning",
    "Carpet and Rug Cleaning", "Leather and Suede Cleaning",
    "Wedding Dress Cleaning", "Pickup and Delivery", "Express or Same-Day Service"
]

async def seed_data():
    print(f"Connecting to MongoDB: {settings.MONGO_DETAILS.split('@')[-1]}") # Mask password
    client = AsyncIOMotorClient(settings.MONGO_DETAILS, serverSelectionTimeoutMS=10000)
    db = client[settings.DATABASE_NAME]

    try:
        # Check connection
        await client.admin.command('ping')
        print("Connected successfully to MongoDB.")

        # Seed Services
        await db.services.delete_many({})
        service_documents = [{"name": name, "is_active": True} for name in services]
        await db.services.insert_many(service_documents)
        print("Services seeded.")

        # Seed a default user
        await db.users.delete_many({"email": "admin@example.com"})
        
        hashed_password = get_password_hash("password")
        
        await db.users.insert_one({
            "name": "Admin User",
            "phone": "1234567890",
            "email": "admin@example.com",
            "password_hash": hashed_password,
            "role": "admin",
        })
        print("Admin user seeded.")
        
        print("Data seeded successfully!")
    except pymongo.errors.ServerSelectionTimeoutError as e:
        print(f"Could not connect to MongoDB: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    # In a typical setup, you would have a virtual environment.
    # For this script to find the 'app' module, we are assuming PYTHONPATH is set or the script is run from the root.
    # A simple way to handle this for a one-off script is to add the project root to the path.
    import sys
    import os
    sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '.')))
    asyncio.run(seed_data())
