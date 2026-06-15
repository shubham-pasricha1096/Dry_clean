from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.v1 import api_router
from app.core.config import settings
from app.db.mongodb import connect_to_mongo, close_mongo_connection
from app.telegram_bot import bot
import os

app = FastAPI(title="CleanTrack API")

# Create static directory if it doesn't exist
os.makedirs("backend/static/qrcodes", exist_ok=True)

app.mount("/static", StaticFiles(directory="backend/static"), name="static")


# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # In production, you would add your frontend's domain here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()
    # This should be set to your public domain. Using a placeholder for now.
    # You will need a tool like ngrok to test this locally.
    webhook_url = "https://your-domain-comes-here.com/api/v1/telegram/webhook"
    try:
        await bot.set_webhook(url=webhook_url)
        print(f"Telegram webhook set to {webhook_url}")
    except Exception as e:
        print(f"Could not set Telegram webhook: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {"message": "Welcome to CleanTrack API"}
