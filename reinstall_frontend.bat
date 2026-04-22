@echo off
echo Reinstalling dependencies...
cd frontend
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo Installing dependencies...
call cmd /c npm install

echo Starting Frontend...
call cmd /c npm run dev
pause
