import os
import shutil
import json
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
from core.database import get_db
from core.security import get_current_user
from models.db_models import User, Appointment, MedicalRecord, Prescription
from schemas.api_schemas import AppointmentCreate

router = APIRouter()

UPLOAD_DIR = "uploads/medical_records"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# --- 1. GET DASHBOARD DATA ---
@router.get("/dashboard")
def get_patient_dashboard(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "patient":
        raise HTTPException(status_code=403, detail="Access denied. Patient role required.")
    
    # Fetch Appointments and resolve Doctor names
    appointments = db.query(Appointment).filter(Appointment.patient_id == current_user.id).all()
    formatted_apts = []
    for apt in appointments:
        doc = db.query(User).filter(User.id == apt.doctor_id).first()
        formatted_apts.append({
            "id": apt.id,
            "doctor_name": doc.full_name if doc else "Unknown Doctor",
            "date_time": apt.date_time,
            "reason": apt.reason,
            "status": apt.status
        })

    # Fetch Medical Vault Records
    records = db.query(MedicalRecord).filter(MedicalRecord.patient_id == current_user.id).all()
    
    # Fetch Prescriptions and resolve Doctor names & JSON medicines
    prescriptions = db.query(Prescription).filter(Prescription.patient_id == current_user.id).order_by(Prescription.created_at.desc()).all()
    formatted_rx = []
    for rx in prescriptions:
        doc = db.query(User).filter(User.id == rx.doctor_id).first()
        formatted_rx.append({
            "id": rx.id,
            "doctor_name": doc.full_name if doc else "Unknown Doctor",
            "date": rx.created_at,
            "notes": rx.notes,
            "medicines": json.loads(rx.medicines_json) if rx.medicines_json else []
        })

    # Fetch available Doctors for the Booking Dropdown
    doctors = db.query(User).filter(User.role == "doctor", User.is_approved == True).all()
    available_doctors = [{"id": d.id, "name": d.full_name, "specialty": d.specialization} for d in doctors]
    
    return {
        "patient_name": current_user.full_name,
        "email": current_user.email,
        "appointments": formatted_apts,
        "medical_records": records,
        "prescriptions": formatted_rx,
        "available_doctors": available_doctors
    }

# --- 2. BOOK AN APPOINTMENT WITH OPTIONAL DOCUMENT ---
@router.post("/appointments", status_code=status.HTTP_201_CREATED)
def book_appointment(
    doctor_id: int = Form(...),
    date_time: str = Form(...),
    reason: str = Form(...),
    file: Optional[UploadFile] = File(None), # Optional file attachment
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    if current_user.role != "patient":
        raise HTTPException(status_code=403, detail="Only patients can book appointments.")

    doctor = db.query(User).filter(User.id == doctor_id, User.role == "doctor").first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found.")

    # Handle the optional file upload
    file_path_for_db = None
    if file:
        safe_filename = f"apt_{current_user.id}_{file.filename}"
        physical_path = os.path.join(UPLOAD_DIR, safe_filename)
        
        with open(physical_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        file_path_for_db = f"{UPLOAD_DIR}/{safe_filename}" # Web-safe path

    # Create the appointment
    new_appointment = Appointment(
        patient_id=current_user.id,
        doctor_id=doctor_id,
        date_time=date_time,
        reason=reason,
        status="Scheduled",
        document_path=file_path_for_db # Save the path if it exists
    )
    
    db.add(new_appointment)
    db.commit()
    return {"message": "Appointment booked successfully!"}


# --- 3. UPLOAD MEDICAL RECORD ---
@router.post("/records", status_code=status.HTTP_201_CREATED)
def upload_medical_record(
    record_type: str = Form(...),
    description: str = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    if current_user.role != "patient":
        raise HTTPException(status_code=403, detail="Only patients can upload records.")

    # 1. Generate a safe file name
    safe_filename = f"patient_{current_user.id}_{file.filename}"
    
    # 2. Force a Web-Safe Forward Slash (/) instead of os.path.join
    file_path = f"{UPLOAD_DIR}/{safe_filename}"
    
    # 3. Create the physical path for Windows to save the file
    physical_path = os.path.join(UPLOAD_DIR, safe_filename)

    # 4. Save the physical file to the server folder
    with open(physical_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 5. Save the WEB-SAFE path to the database
    new_record = MedicalRecord(
        patient_id=current_user.id,
        record_type=record_type,
        description=description,
        file_path=file_path 
    )
    
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    
    return {"message": "Record uploaded successfully!", "record_id": new_record.id}