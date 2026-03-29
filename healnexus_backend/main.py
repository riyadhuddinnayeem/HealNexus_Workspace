# main.py
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles  # <--- NEW: Required for serving files
from core.config import settings
from core.database import engine
from models import db_models

# Import ALL our routers
from api import auth_routes
from api import patient_routes
from api import doctor_routes
from api import admin_routes

db_models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION
)

# --- THE FIX: Serve the uploads folder for the Document Viewer ---
# 1. Ensure the folder exists so FastAPI doesn't crash on startup
os.makedirs("uploads/medical_records", exist_ok=True)

# 2. Tell FastAPI to act as a file server for the /uploads path
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
# -----------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect ALL the routers
app.include_router(auth_routes.router, prefix="/auth", tags=["Authentication"])
app.include_router(patient_routes.router, prefix="/patient", tags=["Patient Dashboard"])
app.include_router(doctor_routes.router, prefix="/doctor", tags=["Doctor Dashboard"])
app.include_router(admin_routes.router, prefix="/admin", tags=["Admin Dashboard"]) 


@app.get("/", tags=["Health"])
def read_root():
    return {
        "status": "online",
        "system": settings.PROJECT_NAME,
        "message": "HealNexus API is running perfectly."
    }