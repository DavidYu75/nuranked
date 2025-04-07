from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm
from ..models.user import UserCreate, User
from ..utils.auth import (
    verify_password, get_password_hash, create_access_token, 
    generate_verification_code, get_current_user
)
from ..utils.database import users_collection
from bson import ObjectId
from datetime import datetime

router = APIRouter()

@router.post("/register")
async def register_user(user_create: UserCreate):
    """Register a new user"""
    # Check if user exists
    existing_user = await users_collection.find_one({"email": user_create.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = get_password_hash(user_create.password)
    user_dict = user_create.dict()
    user_dict.pop("password")
    user_dict["hashed_password"] = hashed_password
    user_dict["is_northeastern_verified"] = False
    user_dict["created_at"] = datetime.utcnow()
    
    result = await users_collection.insert_one(user_dict)
    
    return {"id": str(result.inserted_id), "email": user_create.email, "name": user_create.name}

@router.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login and get access token"""
    user = await users_collection.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user["email"]})
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "is_northeastern_verified": user.get("is_northeastern_verified", False),
        "user_id": str(user["_id"]),
        "name": user.get("name", "")
    }

@router.post("/request-verification")
async def request_verification(current_user = Depends(get_current_user)):
    """Request email verification"""
    # Check if email is northeastern.edu
    if not current_user["email"].endswith("@northeastern.edu"):
        raise HTTPException(
            status_code=400, 
            detail="Verification requires a valid Northeastern University email address"
        )
    
    # Generate verification code
    verification_code = generate_verification_code()
    
    # Update user with verification code
    await users_collection.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {"$set": {"verification_code": verification_code}}
    )
    
    # For development, just print the code to console
    print(f"VERIFICATION CODE for {current_user['email']}: {verification_code}")
    
    return {"message": "Verification code generated - check console for code"}

@router.post("/verify-email")
async def verify_email(verification_code: str, current_user = Depends(get_current_user)):
    """Verify email with code"""
    # Check verification code
    if current_user.get("verification_code") != verification_code:
        raise HTTPException(status_code=400, detail="Invalid verification code")
    
    # Mark user as verified
    await users_collection.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {
            "$set": {"is_northeastern_verified": True},
            "$unset": {"verification_code": ""}
        }
    )
    
    return {"message": "Email verified successfully"}
