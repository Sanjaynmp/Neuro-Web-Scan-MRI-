from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from typing import List
from datetime import timedelta
import os
from dotenv import load_dotenv

load_dotenv()

from database import create_db_and_tables, get_session
from models import User, Patient, Scan
from auth import (
    create_access_token, 
    get_current_user, 
    get_password_hash,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    Token
)

# Note: You need to implement 'authenticate_user' in auth.py or here. 
# For brevity, I'll add the missing parts to auth.py conceptually or inline here if needed.
# But since I already wrote auth.py, I should update it or import correctly.
# Wait, I didn't verify if I wrote 'authenticate_user' in auth.py. 
# I checked my previous tool call, I did NOT write 'authenticate_user'.
# I will implement it here for now or update auth.py. 
# Let's put it here for simplicity of interaction.

from auth import verify_password

app = FastAPI(title="Neuro MRI Scan API")

# CORS
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# --- Auth Endpoints ---

@app.post("/auth/token", response_model=dict)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    statement = select(User).where(User.username == form_data.username)
    user = session.exec(statement).first()
    
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/register", response_model=User)
def register_user(user: User, session: Session = Depends(get_session)):
    # Check if user exists
    statement = select(User).where(User.username == user.username)
    existing_user = session.exec(statement).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    user.password_hash = get_password_hash(user.password_hash)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@app.get("/auth/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

# --- Patient Endpoints ---

@app.get("/patients", response_model=List[Patient])
def read_patients(skip: int = 0, limit: int = 100, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    patients = session.exec(select(Patient).offset(skip).limit(limit)).all()
    return patients

@app.post("/patients", response_model=Patient)
def create_patient(patient: Patient, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    session.add(patient)
    session.commit()
    session.refresh(patient)
    return patient

# --- Scan & AI Endpoints ---

from predictor import predictor

@app.post("/scans/predict")
async def predict_scan(
    patient_id: int, 
    file: UploadFile = File(...), 
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # 1. Read Image
    contents = await file.read()
    
    # 2. AI Inference
    try:
        result = predictor.predict(contents)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Inference failed: {str(e)}")
    
    # 3. Save Record
    # In a real app, save image to disk/S3 and store path. 
    # Here we just mock the path or save it if we had a static dirt.
    # For now, we'll just store a dummy path.
    os.makedirs("uploads", exist_ok=True)
    file_path = f"uploads/{file.filename}"
    with open(file_path, "wb") as f:
        f.write(contents)
        
    scan = Scan(
        patient_id=patient_id,
        image_path=file_path,
        diagnosis=result["label"],
        confidence=result["confidence"]
    )
    session.add(scan)
    session.commit()
    session.refresh(scan)
    
    return scan

@app.get("/scans/{patient_id}", response_model=List[Scan])
def read_scans(patient_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    statement = select(Scan).where(Scan.patient_id == patient_id)
    scans = session.exec(statement).all()
    return scans

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
