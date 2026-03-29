# healnexus_backend/schemas/api_schemas.py
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# --- TOKEN SCHEMAS ---
class Token(BaseModel):
    access_token: str
    token_type: str
    role: Optional[str] = None

class TokenData(BaseModel):
    email: Optional[str] = None
    id: Optional[int] = None
    role: Optional[str] = None

# --- USER SCHEMAS ---
class UserBase(BaseModel):
    full_name: str
    email: EmailStr
    role: str
    phone: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    specialization: Optional[str] = None
    license_no: Optional[str] = None

class UserCreate(UserBase):
    password: str

# ---> THE MISSING LOGIN SCHEMA <---
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserRead(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True  # Allows Pydantic to read SQLAlchemy database objects

# --- APPOINTMENT SCHEMAS ---
class AppointmentCreate(BaseModel):
    doctor_id: int
    date_time: datetime
    reason: str

class AppointmentRead(AppointmentCreate):
    id: int
    patient_id: int
    status: str

    class Config:
        from_attributes = True

# --- PRESCRIPTION SCHEMAS ---
class MedicineItem(BaseModel):
    name: str
    dosage: str
    frequency: str
    duration: str

class PrescriptionCreate(BaseModel):
    patient_id: int
    medicines: List[MedicineItem]
    notes: Optional[str] = None

class PrescriptionRead(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    medicines_json: str
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True