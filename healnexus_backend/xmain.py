# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from core.database import engine
from models import db_models

# Import ALL our routers
from api import auth_routes
from api import patient_routes
from api import doctor_routes  # <--- NEW
from api import admin_routes   # <--- NEW
from api import doctor_routes

db_models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION
)

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
app.include_router(doctor_routes.router, prefix="/doctor", tags=["Doctor Dashboard"]) # <--- NEW
app.include_router(admin_routes.router, prefix="/admin", tags=["Admin Dashboard"])    # <--- NEW


@app.get("/", tags=["Health"])
def read_root():
    return {
        "status": "online",
        "system": settings.PROJECT_NAME,
        "message": "HealNexus API is running perfectly."
    }