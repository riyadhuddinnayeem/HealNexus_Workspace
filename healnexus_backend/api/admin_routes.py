from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from core.database import get_db
from core.security import get_current_user, get_password_hash
from models.db_models import User, Appointment

router = APIRouter()

# Schema for editing a user
class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    password: Optional[str] = None

@router.get("/dashboard")
def get_admin_dashboard(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied.")
    
    total_patients = db.query(User).filter(User.role == "patient").count()
    total_doctors = db.query(User).filter(User.role == "doctor", User.is_approved == True).count()
    total_appointments = db.query(Appointment).count()
    
    # Fetch pending doctors
    pending_doctors = db.query(User).filter(User.role == "doctor", User.is_approved == False).all()
    
    # Fetch all users for the management tab
    all_users = db.query(User).all()

    return {
        "admin_name": current_user.full_name,
        "stats": {
            "total_patients": total_patients,
            "total_doctors": total_doctors,
            "total_appointments": total_appointments,
            "pending_approvals": len(pending_doctors)
        },
        "pending_doctors": pending_doctors,
        "all_users": all_users
    }

@router.put("/approve-doctor/{user_id}")
def approve_doctor(user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "admin": raise HTTPException(status_code=403)
    
    doctor = db.query(User).filter(User.id == user_id).first()
    if not doctor: raise HTTPException(status_code=404, detail="Doctor not found")
    
    doctor.is_approved = True
    db.commit()
    return {"message": "Doctor approved successfully."}

@router.delete("/reject-doctor/{user_id}")
def reject_doctor(user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "admin": raise HTTPException(status_code=403)
    
    doctor = db.query(User).filter(User.id == user_id).first()
    if not doctor: raise HTTPException(status_code=404)
    
    db.delete(doctor)
    db.commit()
    return {"message": "Doctor application rejected and deleted."}

@router.put("/users/{user_id}")
def update_user(user_id: int, update_data: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "admin": raise HTTPException(status_code=403)
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user: raise HTTPException(status_code=404)
    
    if update_data.full_name: user.full_name = update_data.full_name
    if update_data.phone: user.phone = update_data.phone
    if update_data.password: user.hashed_password = get_password_hash(update_data.password)
    
    db.commit()
    return {"message": "User updated successfully."}