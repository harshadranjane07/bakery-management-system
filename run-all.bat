@echo off
title Launcher - Bakery Management System
echo ===================================================
echo Launching Bakery Product Management System (MEAN)
echo ===================================================
echo.
echo 1. Launching MongoDB in new window...
start "Bakery MongoDB" "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "C:\Users\user\.gemini\antigravity\scratch\mongodb-data" --port 27017

timeout /t 3 /nobreak >nul

echo 2. Launching Backend (Node.js/Express) in new window...
start "Bakery Backend" cmd /k "cd /d C:\Users\user\.gemini\antigravity\scratch\bakery-management-system\backend && npm start"

timeout /t 2 /nobreak >nul

echo 3. Launching Frontend (Angular) in new window...
start "Bakery Frontend" cmd /k "cd /d C:\Users\user\.gemini\antigravity\scratch\bakery-management-system\frontend && npm start"

echo.
echo ===================================================
echo All services launched!
echo Frontend will open on: http://localhost:4200
echo Backend API runs on:   http://localhost:5000
echo ===================================================
pause
