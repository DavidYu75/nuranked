from fastapi import APIRouter, HTTPException, Body, Depends
from ..models.profile import Profile, ProfileCreate
from ..utils.database import profiles_collection
from ..utils.elo import calculate_elo
from ..utils.auth import get_current_user, generate_verification_code
from typing import List
import random
from pydantic import BaseModel
from bson import ObjectId
from datetime import datetime

class VoteRequest(BaseModel):
    opponent_id: str
    result: float  # 1 for win, 0 for loss, 0.5 for draw

class VerificationRequest(BaseModel):
    verification_code: str

router = APIRouter()

@router.get("/random", response_model=List[Profile])
async def get_random_profiles():
    """Fetch two random profiles for comparison"""
    try:
        all_profiles = await profiles_collection.find().to_list(length=None)
        
        if len(all_profiles) < 2:
            raise HTTPException(status_code=404, detail="Not enough profiles in the database")
            
        selected_profiles = random.sample(all_profiles, 2)
        
        # Convert ObjectId to string for each profile
        for profile in selected_profiles:
            profile["_id"] = str(profile["_id"])
        
        return [Profile(**profile) for profile in selected_profiles]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{profile_id}/vote")
async def vote_profile(profile_id: str, vote_request: VoteRequest):
    """Update ELO rating after vote"""
    try:
        try:
            profile_oid = ObjectId(profile_id)
            opponent_oid = ObjectId(vote_request.opponent_id)
        except:
            raise HTTPException(status_code=400, detail="Invalid profile ID format")

        profile = await profiles_collection.find_one({"_id": profile_oid})
        opponent = await profiles_collection.find_one({"_id": opponent_oid})
        
        if not profile:
            raise HTTPException(status_code=404, detail=f"Profile with ID {profile_id} not found")
        if not opponent:
            raise HTTPException(status_code=404, detail=f"Opponent profile with ID {vote_request.opponent_id} not found")
            
        # Calculate new ELO ratings
        new_profile_rating = await calculate_elo(
            profile["elo_rating"],
            opponent["elo_rating"],
            vote_request.result
        )
        
        new_opponent_rating = await calculate_elo(
            opponent["elo_rating"],
            profile["elo_rating"],
            1 - vote_request.result
        )
        
        await profiles_collection.update_one(
            {"_id": profile_oid},
            {
                "$set": {"elo_rating": new_profile_rating},
                "$inc": {"match_count": 1}
            }
        )
        
        await profiles_collection.update_one(
            {"_id": opponent_oid},
            {
                "$set": {"elo_rating": new_opponent_rating},
                "$inc": {"match_count": 1}
            }
        )
        
        return {
            "message": "Vote recorded successfully",
            "new_ratings": {
                "profile": new_profile_rating,
                "opponent": new_opponent_rating
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/leaderboard")
async def get_leaderboard():
    """Fetch top-ranked profiles"""
    try:
        profiles = await profiles_collection.find().sort("elo_rating", -1).to_list(length=None)
        
        # Convert ObjectId to string for each profile
        result = []
        for profile in profiles:
            # Convert ObjectId to string
            profile_id = str(profile["_id"])
            
            # Create a Profile object
            profile_obj = Profile(**profile)
            
            # Convert to dict and add the _id field explicitly
            profile_dict = profile_obj.dict()
            profile_dict["_id"] = profile_id
            
            result.append(profile_dict)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=Profile)
async def create_profile(profile: ProfileCreate):
    """Submit a new profile - redirected to auth/register"""
    # This could just redirect to the register endpoint
    raise HTTPException(status_code=307, headers={"Location": "/api/auth/register"})

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
    
    # Update profile with verification code
    await profiles_collection.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {"$set": {"verification_code": verification_code}}
    )
    
    # Print to console for development
    print(f"VERIFICATION CODE for {current_user['email']}: {verification_code}")
    
    return {"message": "Verification code generated - check console for code"}

@router.post("/verify-email")
async def verify_email(verification_data: VerificationRequest, current_user = Depends(get_current_user)):
    """Verify email with code"""
    # Get fresh user data from database
    print(f"Looking for user with ID: {current_user['_id']}")
    user = await profiles_collection.find_one({"_id": ObjectId(current_user["_id"])})
    if not user:
        # Try without ObjectId conversion as fallback
        user = await profiles_collection.find_one({"_id": current_user["_id"]})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
    stored_code = user.get("verification_code")
    
    print(f"Received code: {verification_data.verification_code}")
    print(f"Stored code: {stored_code}")
    
    # Check verification code
    if not stored_code or stored_code != verification_data.verification_code:
        raise HTTPException(status_code=400, detail="Invalid verification code")
    
    # Mark user as verified
    update_result = await profiles_collection.update_one(
        {"_id": ObjectId(user["_id"])},
        {
            "$set": {"is_northeastern_verified": True},
            "$unset": {"verification_code": ""}
        }
    )
    
    if update_result.modified_count == 0:
        raise HTTPException(status_code=500, detail="Failed to update verification status")
    
    return {"message": "Email verified successfully"}

@router.get("/{profile_id}", response_model=Profile)
async def get_profile(profile_id: str):
    """Get a specific profile"""
    try:
        print(f"Attempting to fetch profile with ID: {profile_id}")
        
        try:
            profile_oid = ObjectId(profile_id)
        except Exception as e:
            print(f"Error converting to ObjectId: {str(e)}")
            raise HTTPException(status_code=400, detail=f"Invalid profile ID format: {str(e)}")

        profile = await profiles_collection.find_one({"_id": profile_oid})
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        # Convert ObjectId to string
        profile["_id"] = str(profile["_id"])
        
        # Ensure all required fields exist with defaults
        if "clubs" not in profile or profile["clubs"] is None:
            profile["clubs"] = []
            
        if "experiences" not in profile or profile["experiences"] is None:
            profile["experiences"] = []
            
        if "education" not in profile:
            profile["education"] = {"degree": "", "major": "", "graduation_year": 2025}
        elif "graduation_year" not in profile["education"]:
            profile["education"]["graduation_year"] = 2025
        
        default_fields = {
            "elo_rating": 1500,
            "match_count": 0,
            "linkedin_url": None,
            "github_url": None,
            "is_northeastern_verified": False,
            "photo_url": profile.get("photo_url", "https://randomuser.me/api/portraits/lego/1.jpg")
        }
        
        # Apply defaults if fields are missing
        for field, default in default_fields.items():
            if field not in profile or profile[field] is None:
                profile[field] = default
        
        print(f"Profile being returned: {profile}")
        return Profile(**profile)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error in get_profile: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{profile_id}", response_model=Profile)
async def update_profile(
    profile_id: str,
    profile_update: dict = Body(...),
    current_user = Depends(get_current_user)
):
    """Update a profile"""
    try:
        # Verify user is updating their own profile
        if str(current_user["_id"]) != profile_id:
            raise HTTPException(status_code=403, detail="Not authorized to update this profile")

        # Remove fields that shouldn't be updated
        protected_fields = ["_id", "email", "hashed_password", "is_northeastern_verified", "elo_rating", "match_count"]
        update_data = {k: v for k, v in profile_update.items() if k not in protected_fields}
        
        # Validate LinkedIn URL
        if "linkedin_url" in update_data and update_data["linkedin_url"]:
            if not update_data["linkedin_url"].startswith("https://linkedin"):
                raise HTTPException(status_code=400, detail="LinkedIn URL must start with 'https://linkedin'")
        
        # Validate GitHub URL
        if "github_url" in update_data and update_data["github_url"]:
            if not update_data["github_url"].startswith("https://github"):
                raise HTTPException(status_code=400, detail="GitHub URL must start with 'https://github'")
        
        # Handle base64 image (limit file size)
        if "photo_url" in update_data and update_data["photo_url"].startswith("data:image"):
            # Very basic check for reasonable size (roughly 10MB limit)
            if len(update_data["photo_url"]) > 10 * 1024 * 1024:
                raise HTTPException(status_code=400, detail="Image file too large (max 10MB)")
            
            print("Updated profile picture with base64 image")
            
        # Apply updates
        result = await profiles_collection.update_one(
            {"_id": ObjectId(profile_id)},
            {"$set": update_data}
        )
        
        if result.modified_count == 0 and len(update_data) > 0:
            print("Warning: No fields were updated")
            
        # Get updated profile
        updated_profile = await profiles_collection.find_one({"_id": ObjectId(profile_id)})
        if not updated_profile:
            raise HTTPException(status_code=404, detail="Profile not found")
            
        updated_profile["_id"] = str(updated_profile["_id"])
        
        # Ensure all required fields exist with defaults
        if "clubs" not in updated_profile or updated_profile["clubs"] is None:
            updated_profile["clubs"] = []
            
        if "experiences" not in updated_profile or updated_profile["experiences"] is None:
            updated_profile["experiences"] = []
            
        if "education" not in updated_profile:
            updated_profile["education"] = {"degree": "", "major": "", "graduation_year": 2025}
        elif "graduation_year" not in updated_profile["education"]:
            updated_profile["education"]["graduation_year"] = 2025
        
        default_fields = {
            "elo_rating": 1500,
            "match_count": 0,
            "linkedin_url": None,
            "github_url": None,
            "is_northeastern_verified": False,
            "photo_url": updated_profile.get("photo_url", "https://randomuser.me/api/portraits/lego/1.jpg")
        }
        
        # Apply defaults if fields are missing
        for field, default in default_fields.items():
            if field not in updated_profile or updated_profile[field] is None:
                updated_profile[field] = default
        
        return Profile(**updated_profile)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error in update_profile: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))