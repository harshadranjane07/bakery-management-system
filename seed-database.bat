@echo off
title Seed Database - Bakery Management System
echo ===================================================
echo Seeding Bakery Database with Admin, Categories and Products...
echo ===================================================
cd /d "C:\Users\user\.gemini\antigravity\scratch\bakery-management-system\backend"
npm run seed
pause
