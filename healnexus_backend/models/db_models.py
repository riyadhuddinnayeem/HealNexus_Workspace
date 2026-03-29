from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from core.database import Base
from datetime import datetime
from sqlalchemy.sql import func

class User(Base):
    __tablename__ = "hn_users"
    
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100))
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)  # 'patient', 'doctor', 'admin'
    
    # Optional fields based on role
    phone = Column(String(20), nullable=True)
    age = Column(Integer, nullable=True)
    gender = Column(String(20), nullable=True)
    specialization = Column(String(100), nullable=True)
    license_no = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_approved = Column(Boolean, default=True)

class Appointment(Base):
    __tablename__ = "hn_appointments"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey('hn_users.id', ondelete="CASCADE"))
    doctor_id = Column(Integer, ForeignKey('hn_users.id', ondelete="CASCADE"))
    date_time = Column(DateTime, default=datetime.utcnow)
    reason = Column(String(255))
    status = Column(String(50), default="Scheduled")
    document_path = Column(String(255), nullable=True) # <-- ADD THIS LINE

class MedicalRecord(Base):
    __tablename__ = "hn_medical_records"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey('hn_users.id', ondelete="CASCADE"))
    record_type = Column(String(50))
    description = Column(Text)
    file_path = Column(String(255), nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

class Prescription(Base):
    __tablename__ = "hn_prescriptions"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("hn_users.id", ondelete="CASCADE"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("hn_users.id", ondelete="CASCADE"), nullable=False)
    medicines_json = Column(Text, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())