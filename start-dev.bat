@echo off
echo Starting Cosmocare Development Environment...
echo.

echo [1/4] Starting Backend Server...
cd /d "c:\Users\Aayush Ghimire\OneDrive\Pictures\Desktop\security\security_backend"
start "Backend Server" cmd /k "npm start"

echo [2/4] Waiting for backend to initialize...
timeout /t 3 /nobreak > nul

echo [3/4] Starting Frontend Server...
cd /d "c:\Users\Aayush Ghimire\OneDrive\Pictures\Desktop\security\security_frontend"
start "Frontend Server" cmd /k "npm start"

echo [4/4] Development environment started!
echo.
echo Backend:  https://localhost:5000
echo Frontend: https://localhost:3000
echo.
echo IMPORTANT: Accept the self-signed certificates in both browser tabs.
echo Press any key to exit...
pause > nul
