from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException

from app.crud import crud_user
from app.models.user import User, UserCreate, UserUpdate
from app.api.v1.dependencies import get_current_admin_user

router = APIRouter()

@router.get("/", response_model=List[User])
async def read_users(
    admin: User = Depends(get_current_admin_user)
):
    """
    Retrieve all users. (Admin only)
    """
    return await crud_user.get_users()

@router.post("/", response_model=User)
async def create_user(
    user_in: UserCreate,
    admin: User = Depends(get_current_admin_user)
):
    """
    Create a new user. (Admin only)
    """
    user = await crud_user.get_user_by_email(email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="A user with this email already exists.",
        )
    return await crud_user.create_user(user_in=user_in)

@router.get("/{user_id}", response_model=User)
async def read_user(
    user_id: str,
    admin: User = Depends(get_current_admin_user)
):
    """
    Get a specific user by ID. (Admin only)
    """
    user = await crud_user.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.patch("/{user_id}", response_model=User)
async def update_user(
    user_id: str,
    user_in: UserUpdate,
    admin: User = Depends(get_current_admin_user)
):
    """
    Update a user. (Admin only)
    """
    user = await crud_user.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = user_in.model_dump(exclude_unset=True)
    updated_user = await crud_user.update_user(user_id=user_id, user_in=update_data)
    return updated_user

@router.delete("/{user_id}", response_model=User)
async def delete_user(
    user_id: str,
    admin: User = Depends(get_current_admin_user)
):
    """
    Delete a user. (Admin only)
    """
    user = await crud_user.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    await crud_user.delete_user(user_id=user_id)
    return user
