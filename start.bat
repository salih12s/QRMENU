@echo off
echo QR Menu Management System Baslatiliyor...
echo.

echo Backend baslatiliyor...
cd backend
start cmd /k "npm install && npm start"

echo Frontend baslatiliyor...
cd ../frontend
start cmd /k "npm install && npm start"

echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo Super Admin: superadmin / 12345
echo.
pause