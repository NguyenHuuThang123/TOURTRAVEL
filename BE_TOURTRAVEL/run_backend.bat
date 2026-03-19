@echo off
cd /d "c:\Users\THANG\Máy tính\TOURTRAVEL\BE_TOURTRAVEL"
"C:\Users\THANG\AppData\Local\Programs\Python\Python313\python.exe" -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
pause
