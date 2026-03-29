from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# MySQL Connection String 
# Format: mysql+pymysql://<username>:<password>@<host>:<port>/<database_name>
# If you are using XAMPP, it usually looks exactly like this:
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:@localhost:3306/healnexus_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get the database session in your routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()