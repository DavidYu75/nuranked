from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from ..models.user import UserCreate, User
from ..utils.auth import verify_password, get_password_hash, create_access_token
from ..utils.database import users_collection

router = APIRouter()

@router.post("/register")
async def register_user(user_create: UserCreate):
    # Check if user exists
    existing_user = await users_collection.find_one({"email": user_create.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = get_password_hash(user_create.password)
    user_dict = user_create.dict()
    user_dict.pop("password")
    user_dict["hashed_password"] = hashed_password
    
    result = await users_collection.insert_one(user_dict)
    
    return {"id": str(result.inserted_id), "email": user_create.email}

@router.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await users_collection.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}
