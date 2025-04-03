import asyncio
import os
import sys
import random
from dotenv import load_dotenv

# Add the parent directory to the path so we can import our app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

# Set environment to development before loading any other modules
os.environ["APP_ENV"] = "development"

# Load environment variables
load_dotenv()

from app.utils.database import MONGODB_URI, DATABASE_NAME
from motor.motor_asyncio import AsyncIOMotorClient

async def generate_profiles(num_profiles=20):
    """Generate test profiles locally"""
    print("Generating profiles locally...")
    
    first_names = ["Alex", "Jordan", "Morgan", "Taylor", "Casey", "Riley", "Dylan", "Avery", 
                  "Jamie", "Quinn", "Blake", "Charlie", "Skyler", "Sam", "Reese", "Finley"]
    
    last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
                 "Rodriguez", "Martinez", "Chen", "Kim", "Nguyen", "Singh", "Patel", "Wilson"]
    
    companies = ["Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix", "Uber", "Airbnb",
                "Northeastern University", "MIT", "Harvard", "IBM", "Intel", "Salesforce"]
    
    job_titles = ["Software Engineer Intern", "Research Assistant", "Teaching Assistant",
                 "Machine Learning Engineer", "Full Stack Developer", "Data Scientist",
                 "DevOps Engineer", "Product Manager Intern", "Mobile Developer"]
    
    job_descriptions = [
        "Developed new features for the company's main product",
        "Conducted research in the field of artificial intelligence",
        "Assisted professor with course materials and grading",
        "Built and deployed machine learning models",
        "Created responsive web applications using React",
        "Analyzed large datasets to derive business insights",
        "Maintained and improved cloud infrastructure",
        "Conducted user research and product planning"
    ]
    
    majors = ["Computer Science", "Computer Engineering", "Data Science", 
             "Artificial Intelligence", "Cybersecurity", "Software Engineering",
             "Information Systems", "Computer Science and Business Administration"]
    
    degrees = ["BS", "MS", "PhD"]
    
    profiles = []
    
    for _ in range(num_profiles):
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        full_name = f"{first_name} {last_name}"
        
        # Create username from name
        username = f"{first_name.lower()}{last_name.lower()}{random.randint(1, 99)}"
        
        # Random photo
        gender = random.choice(["men", "women"])
        photo_number = random.randint(1, 99)
        
        # Random experiences (2-3)
        num_experiences = random.randint(2, 3)
        experiences = []
        
        for _ in range(num_experiences):
            company = random.choice(companies)
            title = random.choice(job_titles)
            description = random.choice(job_descriptions)
            
            experiences.append({
                "title": title,
                "company": company,
                "description": description
            })
        
        # Random education
        degree = random.choice(degrees)
        major = random.choice(majors)
        grad_year = random.randint(2022, 2025)
        
        profile = {
            "name": full_name,
            "photo_url": f"https://randomuser.me/api/portraits/{gender}/{photo_number}.jpg",
            "experiences": experiences,
            "education": {
                "degree": degree,
                "major": major,
                "graduation_year": grad_year
            },
            "elo_rating": 1500,
            "match_count": 0,
            "linkedin_url": f"https://linkedin.com/in/{username}",
            "github_url": f"https://github.com/{username}"
        }
        
        profiles.append(profile)
    
    return profiles

async def seed_database():
    """Seed the database with generated test profiles"""
    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[DATABASE_NAME]
    
    print(f"Connected to database: {DATABASE_NAME}")
    
    # Clear existing profiles
    await db.profiles.delete_many({})
    print("Cleared existing profiles")
    
    # Generate profiles
    profiles = await generate_profiles(num_profiles=20)
    
    if not profiles:
        print("Failed to generate profiles")
        return
    
    print(f"Successfully generated {len(profiles)} profiles")
    
    # Insert profiles
    result = await db.profiles.insert_many(profiles)
    
    print(f"Added {len(result.inserted_ids)} generated profiles to the database")
    for i, profile_id in enumerate(result.inserted_ids):
        name = profiles[i].get("name", f"Profile {i+1}")
        print(f"{i+1}. {name} (ID: {profile_id})")

if __name__ == "__main__":
    asyncio.run(seed_database())
    