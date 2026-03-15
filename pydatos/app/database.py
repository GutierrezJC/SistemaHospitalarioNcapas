import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

load_dotenv()

DB_HOST = os.getenv("DB_HOST", "db")
DB_NAME = os.getenv("DB_NAME", "hospital")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSW = os.getenv("DB_PASSW", "")

DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSW}@{DB_HOST}:3306/{DB_NAME}?charset=utf8mb4"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
