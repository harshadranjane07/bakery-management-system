@echo off
title Unified Server (Single Port 5000) - Bakery Management System
echo ===================================================
echo Launching Bakery Unified Server on http://localhost:5000
echo ===================================================
echo.
echo 1. Launching MongoDB in new window...
start "Bakery MongoDB" "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "C:\Users\user\.gemini\antigravity\scratch\mongodb-data" --port 27017

timeout /t 3 /nobreak >nul

echo 2. Launching Unified Full-Stack Server on port 5000...
cd /d "C:\Users\user\.gemini\antigravity\scratch\bakery-management-system\backend"
node server.js
pause
