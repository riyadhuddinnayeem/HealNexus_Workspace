from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from core.security import get_current_user
from models.db_models import User, Appointment, MedicalRecord

router = APIRouter()

@router.get("/dashboard")
def get_doctor_dashboard(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role.value != "doctor":
        raise HTTPException(status_code=403, detail="Access denied. Doctor role required.")
    
    # 1. Fetch all appointments assigned to this specific doctor
    appointments = db.query(Appointment).filter(Appointment.doctor_id == current_user.id).all()
    
    # 2. Format the appointment data so the React frontend can read it easily
    formatted_appointments = []
    for apt in appointments:
        # Fetch the patient's name from the User table
        patient = db.query(User).filter(User.id == apt.patient_id).first()
        
        # Split datetime into date and time strings for the UI
        apt_date = apt.date_time.strftime("%Y-%m-%d")
        apt_time = apt.date_time.strftime("%I:%M %p")
        
        formatted_appointments.append({
            "id": apt.id,
            "patient_name": patient.full_name if patient else "Unknown",
            "patient_id": apt.patient_id,
            "date": apt_date,
            "time": apt_time,
            "reason": apt.reason,
            "status": apt.status
        })

    return {
        "doctor_name": current_user.full_name,
        "specialty": current_user.specialization,
        "todays_appointments": formatted_appointments # In a real app, you'd filter by today's date
    }