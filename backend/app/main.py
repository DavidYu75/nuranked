from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import profiles
from .routes import auth
from .utils.database import database, profiles_collection

app = FastAPI(title="Northeastern CS Ranked API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(profiles.router, prefix="/api/profiles", tags=["profiles"])

@app.get("/")
async def root():
    return {"message": "Northeastern CS Ranked API"}

@app.get("/api/db-test")
async def test_database():
    """Test database connection"""
    try:
        # Insert a test document
        result = await database.test.insert_one({"test": "connection"})
        # Remove the test document
        await database.test.delete_one({"_id": result.inserted_id})
        return {"status": "Database connection successful", "database": database.name}
    except Exception as e:
        return {"status": "Database connection failed", "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
