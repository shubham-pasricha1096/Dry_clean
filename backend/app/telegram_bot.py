import telegram
from app.core.config import settings

bot = telegram.Bot(token=settings.TELEGRAM_BOT_TOKEN)

async def send_telegram_message(chat_id: str, message: str):
    try:
        await bot.send_message(chat_id=chat_id, text=message)
    except Exception as e:
        print(f"Failed to send telegram message: {e}")
