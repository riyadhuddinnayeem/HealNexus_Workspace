import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from core.database import get_db
from core.security import get_current_user
from models.db_models import User, Appointment, MedicalRecord, Prescription
from schemas.api_schemas import PrescriptionCreate

router = APIRouter()

@router.get("/dashboard")
def get_doctor_dashboard(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "doctor":
        raise HTTPException(status_code=403, detail="Access denied. Doctor role required.")
    
    appointments = db.query(Appointment).filter(Appointment.doctor_id == current_user.id).all()
    
    formatted_appointments = []
    unique_patients = {} # Dictionary to store unique patients

    for apt in appointments:
        patient = db.query(User).filter(User.id == apt.patient_id).first()
        
        # 1. Format the Appointment
        apt_date = apt.date_time.strftime("%Y-%m-%d")
        apt_time = apt.date_time.strftime("%I:%M %p")
        
        if patient:
            formatted_appointments.append({
                "id": apt.id,
                "patient_name": patient.full_name,
                "patient_id": apt.patient_id,
                "date": apt_date,
                "time": apt_time,
                "reason": apt.reason,
                "status": apt.status
            })

            # 2. Build the unique Patient Database for the doctor
            if patient.id not in unique_patients:
                unique_patients[patient.id] = {
                    "id": patient.id,
                    "name": patient.full_name,
                    "email": patient.email,
                    "age": patient.age or "N/A",
                    "gender": patient.gender or "N/A",
                    "last_visit": apt_date
                }

    return {
        "doctor_name": current_user.full_name,
        "specialty": current_user.specialization,
        "todays_appointments": formatted_appointments,
        "patients": list(unique_patients.values()) # Convert dict to a list for React
    }

@router.post("/prescriptions", status_code=status.HTTP_201_CREATED)
def create_prescription(rx_data: PrescriptionCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "doctor":
        raise HTTPException(status_code=403, detail="Only doctors can write prescriptions.")

    # 1. Convert the medicines array to a JSON string
    meds_dict = [med.dict() for med in rx_data.medicines]
    meds_json_str = json.dumps(meds_dict)

    # 2. Save the official Prescription
    new_rx = Prescription(
        patient_id=rx_data.patient_id,
        doctor_id=current_user.id,
        medicines_json=meds_json_str,
        notes=rx_data.notes
    )
    db.add(new_rx)

    # 3. THE MAGIC TRICK: Auto-create a Medical Record for the Patient's Vault!
    med_names = ", ".join([m.name for m in rx_data.medicines])
    vault_desc = f"Dr. {current_user.full_name} prescribed: {med_names}. Notes: {rx_data.notes}"

    new_record = MedicalRecord(
        patient_id=rx_data.patient_id,
        record_type="e-Prescription",
        description=vault_desc,
        file_path="Digital Record (No physical file)"
    )
    db.add(new_record)
    
    db.commit()
    return {"message": "Prescription successfully sent to Patient Vault!"}