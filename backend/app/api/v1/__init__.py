from fastapi import APIRouter
from .endpoints import login, orders, services, telegram, users

api_router = APIRouter()
api_router.include_router(login.router, prefix="/login", tags=["login"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(services.router, prefix="/services", tags=["services"])
api_router.include_router(telegram.router, prefix="/telegram", tags=["telegram"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
