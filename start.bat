@echo off
echo 🚀 Starting Vocal Splitter (offline)...
cd backend\dist
start main.exe
cd ..\..
timeout /t 2 > nul
start "" "frontend\index.html"
echo ✅ Done! Your browser should open.
pause
