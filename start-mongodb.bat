@echo off
title MongoDB Server - Bakery Management System
echo ===================================================
echo Starting MongoDB Database on port 27017...
echo ===================================================
"C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "C:\Users\user\.gemini\antigravity\scratch\mongodb-data" --port 27017
pause
