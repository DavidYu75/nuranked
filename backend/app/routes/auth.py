from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from ..models.profile import ProfileCreate, Profile
from ..utils.auth import verify_password, get_password_hash, create_access_token, generate_verification_code, get_current_user
from ..utils.database import profiles_collection
from datetime import datetime
from bson import ObjectId

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/register")
async def register_profile(profile_create: ProfileCreate):
    """Register a new profile with authentication"""
    # Check if profile exists
    existing_profile = await profiles_collection.find_one({"email": profile_create.email})
    if existing_profile:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new profile with authentication
    profile_dict = profile_create.dict()
    password = profile_dict.pop("password")
    profile_dict["hashed_password"] = get_password_hash(password)
    profile_dict["is_northeastern_verified"] = False
    profile_dict["elo_rating"] = 1500
    profile_dict["match_count"] = 0
    profile_dict["created_at"] = datetime.utcnow()
    
    result = await profiles_collection.insert_one(profile_dict)
    
    # Fetch the created document to ensure proper serialization
    created_profile = await profiles_collection.find_one({"_id": result.inserted_id})
    if not created_profile:
        raise HTTPException(status_code=500, detail="Failed to retrieve created profile")
    
    # Manually create response dictionary with string ID
    response = {
        "id": str(created_profile["_id"]),
        "email": created_profile["email"],
        "name": created_profile["name"],
        "photo_url": created_profile.get("photo_url", ""),
        "experiences": created_profile.get("experiences", []),
        "education": created_profile.get("education", {}),
        "elo_rating": created_profile.get("elo_rating", 1500),
        "match_count": created_profile.get("match_count", 0),
        "linkedin_url": created_profile.get("linkedin_url", None),
        "github_url": created_profile.get("github_url", None),
        "is_northeastern_verified": created_profile.get("is_northeastern_verified", False)
    }
    
    return response

@router.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login and get access token"""
    profile = await profiles_collection.find_one({"email": form_data.username})
    if not profile or not verify_password(form_data.password, profile["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": profile["email"]})
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "is_northeastern_verified": profile.get("is_northeastern_verified", False),
        "profile_id": str(profile["_id"]),
        "name": profile.get("name", "")
    }
    