from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    password_hash: str
    role: str = Field(default="doctor")  # doctor, admin

class Patient(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    full_name: str
    age: int
    gender: str
    history: Optional[str] = None
    scans: List["Scan"] = Relationship(back_populates="patient")

class Scan(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: Optional[int] = Field(default=None, foreign_key="patient.id")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    image_path: str
    diagnosis: str
    confidence: float
    patient: Optional[Patient] = Relationship(back_populates="scans")
