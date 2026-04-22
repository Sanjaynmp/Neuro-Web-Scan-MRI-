@echo off
echo Starting NeuroScan Backend...
cd backend
python -m pip install -r requirements.txt
python main.py
pause
