from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import profiles

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
app.include_router(profiles.router, prefix="/api/profiles", tags=["profiles"])

@app.get("/")
async def root():
    return {"message": "Northeastern CS Ranked API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
