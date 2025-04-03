import asyncio
import os
import sys

# Add the parent directory to the path so we can import our app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from app.models.profile import Profile, Experience, Education
from motor.motor_asyncio import AsyncIOMotorClient
from app.utils.database import MONGODB_URI, DATABASE_NAME

async def seed_database():
    """Seed the database with initial test profiles"""
    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[DATABASE_NAME]
    
    # Clear existing profiles
    await db.profiles.delete_many({})
    
    # Create test profiles
    test_profiles = [
        {
            "name": "Alice Smith",
            "photo_url": "https://randomuser.me/api/portraits/women/1.jpg",
            "experiences": [
                {
                    "title": "Software Engineer Intern",
                    "company": "Google",
                    "description": "Worked on search algorithms"
                },
                {
                    "title": "Research Assistant",
                    "company": "Northeastern University",
                    "description": "Machine learning research"
                }
            ],
            "education": {
                "degree": "BS",
                "major": "Computer Science",
                "graduation_year": 2023
            },
            "elo_rating": 1500,
            "match_count": 0,
            "linkedin_url": "https://linkedin.com/in/alice-smith",
            "github_url": "https://github.com/alicesmith"
        },
        {
            "name": "Bob Johnson",
            "photo_url": "https://randomuser.me/api/portraits/men/1.jpg",
            "experiences": [
                {
                    "title": "Software Developer",
                    "company": "Amazon",
                    "description": "Worked on AWS services"
                },
                {
                    "title": "Teaching Assistant",
                    "company": "Northeastern University",
                    "description": "Algorithms and data structures"
                }
            ],
            "education": {
                "degree": "MS",
                "major": "Computer Science",
                "graduation_year": 2022
            },
            "elo_rating": 1500,
            "match_count": 0,
            "linkedin_url": "https://linkedin.com/in/bob-johnson",
            "github_url": "https://github.com/bobjohnson"
        },
        {
            "name": "Charlie Davis",
            "photo_url": "https://randomuser.me/api/portraits/men/2.jpg",
            "experiences": [
                {
                    "title": "Machine Learning Engineer",
                    "company": "Meta",
                    "description": "Worked on recommendation systems"
                },
                {
                    "title": "Research Intern",
                    "company": "MIT",
                    "description": "Natural language processing"
                }
            ],
            "education": {
                "degree": "PhD",
                "major": "Artificial Intelligence",
                "graduation_year": 2024
            },
            "elo_rating": 1500,
            "match_count": 0,
            "linkedin_url": "https://linkedin.com/in/charlie-davis",
            "github_url": "https://github.com/charliedavis"
        },
        {
            "name": "Diana Wilson",
            "photo_url": "https://randomuser.me/api/portraits/women/2.jpg",
            "experiences": [
                {
                    "title": "Full Stack Developer",
                    "company": "Microsoft",
                    "description": "Worked on Azure platform"
                },
                {
                    "title": "Software Engineer Intern",
                    "company": "Northeastern University",
                    "description": "Campus IT systems"
                }
            ],
            "education": {
                "degree": "BS",
                "major": "Computer Engineering",
                "graduation_year": 2023
            },
            "elo_rating": 1500,
            "match_count": 0,
            "linkedin_url": "https://linkedin.com/in/diana-wilson",
            "github_url": "https://github.com/dianawilson"
        }
    ]
    
    # Insert profiles
    result = await db.profiles.insert_many(test_profiles)
    
    print(f"Added {len(result.inserted_ids)} test profiles to the database.")
    print(f"Profile IDs: {result.inserted_ids}")

if __name__ == "__main__":
    asyncio.run(seed_database())
    