@echo off
title G Workspace - Full Stack Launcher
echo.
echo ========================================
echo   G Workspace - Starting All Servers
echo ========================================
echo.

:: Start Backend (Port 5000)
echo [1/3] Starting Backend API on port 5000...
start "G-Backend" cmd /k "cd /d %~dp0backend && node server.js"
timeout /t 3 /nobreak > nul

:: Start E-commerce Website (Port 5173)
echo [2/3] Starting E-commerce Website on port 5173...
start "G-Ecommerce" cmd /k "cd /d %~dp0ecommerce-website && npm run dev"
timeout /t 3 /nobreak > nul

:: Start Dashboard (Port 3000)
echo [3/3] Starting Dashboard on port 3000...
start "G-Dashboard" cmd /k "cd /d %~dp0dashboard && npm start"
timeout /t 5 /nobreak > nul

echo.
echo ========================================
echo   All servers started!
echo ========================================
echo.
echo   E-commerce:  http://localhost:5173
echo   Dashboard:   http://localhost:3000
echo   Backend API: http://localhost:5000/api
echo.
echo   Press any key to open in browser...
pause > nul

start http://localhost:5173
start http://localhost:3000
