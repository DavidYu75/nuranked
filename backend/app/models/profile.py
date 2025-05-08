from pydantic import BaseModel, Field
from typing import List, Optional

class Experience(BaseModel):
    title: str = ""
    company: str = ""

class Education(BaseModel):
    degree: str = ""
    major: str = ""
    graduation_year: int = 2025

class Club(BaseModel):
    id: str
    name: str

class ProfileCreate(BaseModel):
    name: str
    email: str
    password: str
    photo_url: str = "https://randomuser.me/api/portraits/lego/1.jpg"
    experiences: List[Experience] = Field(default_factory=list)
    clubs: List[Club] = Field(default_factory=list)
    education: Education = Field(default_factory=Education)
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None

class Profile(BaseModel):
    name: str
    email: str
    photo_url: str = "https://randomuser.me/api/portraits/lego/1.jpg"
    experiences: List[Experience] = Field(default_factory=list)
    clubs: List[Club] = Field(default_factory=list)
    education: Education = Field(default_factory=Education)
    elo_rating: int = 1500
    match_count: int = 0
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    user_id: Optional[str] = None
    is_northeastern_verified: bool = False
