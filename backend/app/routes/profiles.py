from fastapi import APIRouter, HTTPException
from ..models.profile import Profile
from ..utils.database import profiles_collection
from ..utils.elo import calculate_elo

router = APIRouter()

@router.get("/random")
async def get_random_profiles():
    """Fetch two random profiles for comparison"""
    # Placeholder - will be implemented later
    return {"message": "Random profiles endpoint"}

@router.put("/{profile_id}/vote")
async def vote_profile(profile_id: str):
    """Update ELO rating after vote"""
    # Placeholder - will be implemented later
    return {"message": f"Vote recorded for profile {profile_id}"}

@router.get("/leaderboard")
async def get_leaderboard():
    """Fetch top-ranked profiles"""
    # Placeholder - will be implemented later
    return {"message": "Leaderboard endpoint"}

@router.post("/")
async def create_profile():
    """Submit a new profile"""
    # Placeholder - will be implemented later
    return {"message": "Profile created"}
