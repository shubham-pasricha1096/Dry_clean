from typing import List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.crud import crud_order
from app.models.order import Order, OrderCreate, OrderStatusHistory
from app.api.v1.dependencies import get_current_user
from app.models.user import User

router = APIRouter()

class StatusUpdate(BaseModel):
    status: str

class StatusUpdateResponse(BaseModel):
    order: Order
    history: List[OrderStatusHistory]


@router.post("/", response_model=Order)
async def create_order(
    order_in: OrderCreate,
    current_user: User = Depends(get_current_user),
):
    """
    Create a new order.
    """
    return await crud_order.create_order(order=order_in, user_id=str(current_user.id))


@router.get("/", response_model=List[Order])
async def read_orders(
    current_user: User = Depends(get_current_user),
):
    """
    Retrieve all orders.
    """
    return await crud_order.get_orders()


@router.get("/{order_id}", response_model=Order)
async def read_order(
    order_id: str,
    current_user: User = Depends(get_current_user),
):
    """
    Get an order by ID.
    """
    order = await crud_order.get_order_by_id(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.get("/{order_id}/history", response_model=List[OrderStatusHistory])
async def read_order_history(
    order_id: str,
    current_user: User = Depends(get_current_user),
):
    """
    Get the status history for an order.
    """
    history = await crud_order.get_history_for_order(order_id)
    return history


@router.get("/by-qr/{order_number}", response_model=Order)
async def read_order_by_qr(
    order_number: str,
    current_user: User = Depends(get_current_user),
):
    """
    Get an order by order number (for QR code scanning).
    """
    order = await crud_order.get_order_by_order_number(order_number)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.patch("/{order_id}/status", response_model=StatusUpdateResponse)
async def update_order_status(
    order_id: str,
    status_update: StatusUpdate,
    current_user: User = Depends(get_current_user),
):
    """
    Update an order's status, log the change, and return the updated order and its history.
    """
    updated_order = await crud_order.update_order_status(
        order_id=order_id, status=status_update.status, user_id=str(current_user.id)
    )
    if not updated_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    updated_history = await crud_order.get_history_for_order(order_id)
    
    return {"order": updated_order, "history": updated_history}
