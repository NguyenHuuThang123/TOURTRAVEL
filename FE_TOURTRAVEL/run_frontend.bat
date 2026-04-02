@echo off
cd /d "c:\Users\THANG\Máy tính\TOURTRAVEL\FE_TOURTRAVEL"
call npm.cmd install
call npm.cmd run dev -- --force
echo.
echo Frontend dang chay tai: http://127.0.0.1:5173
pause
