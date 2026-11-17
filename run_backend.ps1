Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Starting UniExpert FastAPI Backend API on http://localhost:8000" -ForegroundColor Green
Write-Host "Interactive API Docs: http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
Set-Location -Path "$PSScriptRoot\backend"
python -m uvicorn app.main:app --reload --port 8000
