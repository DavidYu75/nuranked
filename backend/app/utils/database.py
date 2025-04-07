import motor.motor_asyncio
import os
from dotenv import load_dotenv

# Load environment variables
env = os.environ.get("APP_ENV", "development")
load_dotenv(f".env.{env}")

MONGODB_URI = os.environ.get("MONGODB_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.environ.get("DATABASE_NAME", f"northeastern_ranked_{env}")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URI)
database = client[DATABASE_NAME]

profiles_collection = database.profiles
