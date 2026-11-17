Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Starting UniExpert React Frontend on http://localhost:5173" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
Set-Location -Path "$PSScriptRoot\frontend"
npm run dev
