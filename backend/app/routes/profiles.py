from fastapi import APIRouter, HTTPException, Body, Depends
from ..models.profile import Profile, ProfileCreate
from ..utils.database import profiles_collection
from ..utils.elo import calculate_elo
from ..utils.auth import get_current_user
from typing import List
import random
from pydantic import BaseModel
from bson import ObjectId
from datetime import datetime

class VoteRequest(BaseModel):
    opponent_id: str
    result: float  # 1 for win, 0 for loss, 0.5 for draw

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
        for profile in profiles:
            profile["_id"] = str(profile["_id"])
        
        return [Profile(**profile) for profile in profiles]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=Profile)
async def create_profile(profile: ProfileCreate, current_user = Depends(get_current_user)):
    """Submit a new profile"""
    try:
        profile_dict = profile.dict()
        
        # Set default values
        profile_dict["elo_rating"] = 1500
        profile_dict["match_count"] = 0
        profile_dict["created_at"] = datetime.utcnow()
        profile_dict["user_id"] = current_user["_id"]
        profile_dict["is_northeastern_verified"] = current_user.get("is_northeastern_verified", False)
        
        result = await profiles_collection.insert_one(profile_dict)
        
        created_profile = await profiles_collection.find_one({"_id": result.inserted_id})
        
        created_profile["_id"] = str(created_profile["_id"])
        
        return created_profile
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create profile: {str(e)}")
    