from pydantic import BaseModel
from typing import List, Optional

class Experience(BaseModel):
    title: str
    company: str
    description: str

class Education(BaseModel):
    degree: str
    major: str
    graduation_year: int

class Profile(BaseModel):
    name: str
    photo_url: str
    experiences: List[Experience]
    education: Education
    elo_rating: int = 1500
    match_count: int = 0
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
