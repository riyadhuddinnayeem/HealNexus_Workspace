from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from core.security import get_current_user
from models.db_models import User, Appointment

router = APIRouter()

@router.get("/dashboard")
def get_admin_dashboard(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # 1. The Bouncer: STRICTLY Admins Only
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied. Administrator clearance required.")
    
    # 2. Calculate System Statistics
    total_patients = db.query(User).filter(User.role == "patient").count()
    total_doctors = db.query(User).filter(User.role == "doctor").count()
    total_appointments = db.query(Appointment).count()
    
    # 3. Fetch the 5 most recent appointments for the activity feed
    recent_apts = db.query(Appointment).order_by(Appointment.id.desc()).limit(5).all()
    
    formatted_recent = []
    for apt in recent_apts:
        formatted_recent.append({
            "id": apt.id,
            "patient_id": apt.patient_id,
            "doctor_id": apt.doctor_id,
            "status": apt.status,
            "date": apt.date_time.strftime("%Y-%m-%d")
        })

    return {
        "admin_name": current_user.full_name,
        "stats": {
            "total_patients": total_patients,
            "total_doctors": total_doctors,
            "total_appointments": total_appointments
        },
        "recent_activity": formatted_recent
    }