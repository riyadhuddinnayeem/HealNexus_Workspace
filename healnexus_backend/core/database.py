import os
import certifi
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# --- TiDB CLOUD SETTINGS ---
DB_USER = "4HAR75CZ48vTzF5.root"
DB_PASS = "ket2UJy6Z2YGt6Wu" # <--- PASTE YOUR PASSWORD HERE
DB_HOST = "gateway01.ap-southeast-1.prod.aws.tidbcloud.com"
DB_PORT = "4000"
DB_NAME = "test"

# This line handles the SSL certificate for TiDB Cloud
ssl_args = {
    "ssl_verify_cert": True,
    "ssl_verify_identity": True,
    "ssl_ca": certifi.where()
}

SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Create engine with SSL arguments
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args=ssl_args
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()