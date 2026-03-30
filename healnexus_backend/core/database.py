import os
import certifi
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Fetch the secret URL from the environment (Render's secure vault)
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "mysql+pymysql://root:@localhost/healnexus"
)

# 2. Automatically apply SSL security ONLY if connecting to the Cloud (TiDB)
if "tidbcloud" in SQLALCHEMY_DATABASE_URL:
    ssl_args = {
        "ssl_verify_cert": True,
        "ssl_verify_identity": True,
        "ssl_ca": certifi.where()
    }
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, 
        connect_args=ssl_args,
        pool_pre_ping=True,   # <--- THE FIX: Ping the DB to ensure it's awake
        pool_recycle=300      # <--- THE FIX: Refresh connections every 5 minutes
    )
else:
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=300
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
