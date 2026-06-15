from fastapi import APIRouter, Request
from telegram import Update
import asyncio

from app.telegram_bot import bot
from app.crud import crud_customer

router = APIRouter()

async def handle_update(update: Update):
    if update.message and update.message.text == "/start":
        chat_id = update.message.chat_id
        
        if update.message.contact:
            phone_number = update.message.contact.phone_number
            # In some cases, the phone number might have a '+' prefix.
            if not phone_number.startswith('+'):
                # This is a simplification. A real app should handle country codes.
                pass
            
            customer = await crud_customer.get_customer_by_phone(phone_number)
            if customer:
                await crud_customer.update_customer_telegram_chat_id(customer.id, str(chat_id))
                await bot.send_message(chat_id=chat_id, text="Your Telegram account is now linked to your CleanTrack orders.")
            else:
                await bot.send_message(chat_id=chat_id, text="Could not find a customer with your phone number.")
        else:
             await bot.send_message(chat_id=chat_id, text="Welcome to CleanTrack! Please share your contact to link your account.")
    
@router.post("/webhook")
async def telegram_webhook(request: Request):
    data = await request.json()
    update = Update.de_json(data, bot)
    asyncio.create_task(handle_update(update))
    return {"status": "ok"}
