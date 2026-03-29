# api/admin_routes.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from core.database import get_db
from core.security import get_current_user
from models.db_models import User, Appointment
from schemas.api_schemas import UserRead, AppointmentRead

router = APIRouter()

def verify_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized as an admin")
    return current_user

@router.get("/users", response_model=List[UserRead])
def get_all_users(
    role: str = None, 
    db: Session = Depends(get_db),
    current_user: User = Depends(verify_admin)
):
    # If a role is provided (e.g., ?role=doctor), filter by it. Otherwise return everyone.
    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    return query.all()

@router.get("/appointments", response_model=List[AppointmentRead])
def get_all_appointments(
    db: Session = Depends(get_db),
    current_user: User = Depends(verify_admin)
):
    # Admins see everything
    return db.query(Appointment).all()