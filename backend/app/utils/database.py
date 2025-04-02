import motor.motor_asyncio
from os import environ
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = environ.get("MONGODB_URI", "mongodb://localhost:27017")
DATABASE_NAME = environ.get("DATABASE_NAME", "northeastern_ranked")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URI)
database = client[DATABASE_NAME]

profiles_collection = database.profiles
