# healnexus_backend/api/auth_routes.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from core.database import get_db
from core.security import get_password_hash, verify_password, create_access_token
from models.db_models import User

# THE FIX: Import from your specific schemas folder and file!
from schemas.api_schemas import UserCreate, UserLogin, Token, UserRead

router = APIRouter()

@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    
    # 1. Check if email exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email/Phone is already registered."
        )

    # 2. Hash Password
    hashed_pwd = get_password_hash(user_data.password)

    # 3. Create User (Mapping your api_schemas 'full_name' exactly as requested)
 
    new_user = User(
        full_name=user_data.full_name,  # <--- FIXED!
        email=user_data.email,
        phone=user_data.phone,
        hashed_password=hashed_pwd,
        role=user_data.role,
        specialization=user_data.specialization
    )

    # 4. Save to DB
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/login", response_model=Token)
def login_user(user_data: UserLogin, db: Session = Depends(get_db)):
    # 1. Find User
    user = db.query(User).filter(User.email == user_data.email).first()
    
    # 2. Verify
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3. Generate Token (Injecting EMAIL instead of ID)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role} 
    )

    return {"access_token": access_token, "token_type": "bearer", "role": user.role}

    return {"access_token": access_token, "token_type": "bearer", "role": user.role.value if hasattr(user.role, 'value') else user.role}