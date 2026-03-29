from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
import json
from core.database import get_db
from core.security import get_current_user
from models.db_models import User, Appointment, Prescription
from schemas.api_schemas import PrescriptionCreate

router = APIRouter()

@router.get("/dashboard")
def get_doctor_dashboard(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "doctor":
        raise HTTPException(status_code=403, detail="Access denied. Doctor role required.")
    
    # 1. Fetch Today's Appointments (Including the attached document path)
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    todays_apts = db.query(Appointment).filter(
        Appointment.doctor_id == current_user.id,
        Appointment.date_time >= today_start
    ).all()
    
    formatted_apts = []
    for apt in todays_apts:
        pat = db.query(User).filter(User.id == apt.patient_id).first()
        formatted_apts.append({
            "id": apt.id,
            "patient_id": apt.patient_id,
            "patient_name": pat.full_name if pat else "Unknown",
            "time": apt.date_time.strftime("%I:%M %p"),
            "date": apt.date_time.strftime("%Y-%m-%d"),
            "reason": apt.reason,
            "document_path": apt.document_path # <--- Send the path to the frontend
        })

    # 2. Fetch Unique Patients (For the Patient Database Tab)
    # Get all distinct patient IDs this doctor has seen
    all_apts = db.query(Appointment).filter(Appointment.doctor_id == current_user.id).all()
    unique_patient_ids = {apt.patient_id for apt in all_apts}
    
    formatted_patients = []
    for p_id in unique_patient_ids:
        pat = db.query(User).filter(User.id == p_id).first()
        if pat:
            # Find their last visit date
            last_visit = db.query(Appointment).filter(
                Appointment.doctor_id == current_user.id,
                Appointment.patient_id == p_id
            ).order_by(Appointment.date_time.desc()).first()
            
            formatted_patients.append({
                "id": pat.id,
                "name": pat.full_name,
                "age": pat.age or "N/A",
                "gender": pat.gender or "N/A",
                "last_visit": last_visit.date_time.strftime("%Y-%m-%d") if last_visit else "Unknown"
            })

    return {
        "doctor_name": current_user.full_name,
        "specialty": current_user.specialization,
        "todays_appointments": formatted_apts,
        "patients": formatted_patients
    }

@router.post("/prescriptions", status_code=status.HTTP_201_CREATED)
def write_prescription(prescription_data: PrescriptionCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "doctor":
        raise HTTPException(status_code=403, detail="Only doctors can write prescriptions.")

    # Convert the list of medicine dictionaries into a JSON string for storage
    medicines_json_str = json.dumps([med.dict() for med in prescription_data.medicines])

    new_prescription = Prescription(
        patient_id=prescription_data.patient_id,
        doctor_id=current_user.id,
        medicines_json=medicines_json_str,
        notes=prescription_data.notes
    )
    
    db.add(new_prescription)
    db.commit()
    return {"message": "Prescription securely sent to patient's vault."}