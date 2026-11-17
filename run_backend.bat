@echo off
echo ========================================================
echo Starting UniExpert FastAPI Backend API on http://localhost:8000
echo Interactive API Docs: http://localhost:8000/docs
echo ========================================================
cd backend
python -m uvicorn app.main:app --reload --port 8000
