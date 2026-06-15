from typing import List
from fastapi import APIRouter, Depends, HTTPException

from app.crud import crud_service
from app.models.service import Service, ServiceCreate, ServiceUpdate
from app.api.v1.dependencies import get_current_user, get_current_admin_user
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[Service])
async def read_active_services(
    current_user: User = Depends(get_current_user),
):
    """
    Retrieve all active services.
    """
    return await crud_service.get_active_services()

@router.get("/all", response_model=List[Service])
async def read_all_services(
    admin: User = Depends(get_current_admin_user),
):
    """
    Retrieve all services, including inactive ones. (Admin only)
    """
    return await crud_service.get_all_services()

@router.post("/", response_model=Service)
async def create_service(
    service_in: ServiceCreate,
    admin: User = Depends(get_current_admin_user),
):
    """
    Create a new service. (Admin only)
    """
    return await crud_service.create_service(service_in=service_in)

@router.patch("/{service_id}", response_model=Service)
async def update_service(
    service_id: str,
    service_in: ServiceUpdate,
    admin: User = Depends(get_current_admin_user),
):
    """
    Update a service (e.g., name, is_active). (Admin only)
    """
    service = await crud_service.get_service(service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    updated_service = await crud_service.update_service(service_id=service_id, service_in=service_in)
    return updated_service

@router.delete("/{service_id}", response_model=Service)
async def delete_service(
    service_id: str,
    admin: User = Depends(get_current_admin_user),
):
    """
    Delete a service. (Admin only)
    """
    service = await crud_service.get_service(service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    await crud_service.delete_service(service_id=service_id)
    return service
