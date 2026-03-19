# 🚀 TOURTRAVEL - Setup & Run Guide

## ✅ Completed Setup

✓ Backend (FastAPI + Python)
✓ Frontend (React + Vite)  
✓ Dependencies configured
✓ Startup scripts ready

---

## 🎯 Python Path (sử dụng cho dự án này)

```
C:\Users\THANG\AppData\Local\Programs\Python\Python313\python.exe
```

---

## 🔥 Quick Start (2 Terminals)

### Terminal 1 - Backend (FastAPI)

```bash
cd "c:\Users\THANG\Máy tính\TOURTRAVEL\BE_TOURTRAVEL"
"C:\Users\THANG\AppData\Local\Programs\Python\Python313\python.exe" -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Or run script:**
```bash
cd "c:\Users\THANG\Máy tính\TOURTRAVEL\BE_TOURTRAVEL"
.\run_backend.bat
```

✅ Server starts at: **http://localhost:8000**
- API Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

### Terminal 2 - Frontend (React)

```bash
cd "c:\Users\THANG\Máy tính\TOURTRAVEL\FE_TOURTRAVEL"
npm install
npm run dev
```

**Or run script:**
```bash
cd "c:\Users\THANG\Máy tính\TOURTRAVEL\FE_TOURTRAVEL"
.\run_frontend.bat
```

✅ App starts at: **http://localhost:5173**

---

## 📡 API Endpoints (đã sẵn sàng)

### Tours
- `GET /api/tours` - Danh sách tour
- `GET /api/tours/{id}` - Chi tiết tour
- `POST /api/tours` - Tạo tour

### Bookings  
- `GET /api/bookings` - Danh sách đặt vé
- `POST /api/bookings` - Đặt vé mới
- `GET /api/bookings/{id}` - Chi tiết đặt vé

---

## 📋 Project Structure

```
TOURTRAVEL/
├── FE_TOURTRAVEL/
│   ├── src/
│   │   ├── pages/ (Home, TourDetail, Cart)
│   │   ├── api/ (tourService.js)
│   │   ├── components/
│   │   ├── styles/
│   │   └── App.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── run_frontend.bat
│   └── index.html
│
└── BE_TOURTRAVEL/
    ├── app/
    │   ├── routes/ (tours.py, bookings.py)
    │   ├── schemas/ (tour.py, booking.py)
    │   ├── models/ (database models)
    │   └── config/ (settings)
    ├── main.py (FastAPI app)
    ├── requirements.txt (dependencies)
    ├── run_backend.bat
    └── .env.example
```

---

## 🐍 Dependencies Installed

**Backend (Python):**
- ✅ FastAPI 0.121.1
- ✅ Uvicorn 0.38.0
- ✅ Pydantic 2.12.4
- ✅ SQLAlchemy 2.0.48
- ✅ python-dotenv 1.2.2

**Frontend (Node.js):**
- React 18
- React Router
- Axios
- Vite

---

## 🛠️ Troubleshooting

**If `npm` not found:**
- Install Node.js from https://nodejs.org/

**If Python not found:**
- Use full path: `"C:\Users\THANG\AppData\Local\Programs\Python\Python313\python.exe"`

**If port 8000 is busy:**
- Change port in command: `--port 8001`

**If port 5173 is busy:**
- Vite will use next available port (5174, 5175, etc.)

---

## 💾 Recommended Next Steps

1. **Try the API:**
   - Open http://localhost:8000/docs in browser
   - Test endpoints there

2. **Test Frontend:**
   - Open http://localhost:5173 in browser
   - Check if tours load from API

3. **Add Database:**
   - Uncomment SQLAlchemy models in `app/models/__init__.py`
   - Create migrations

4. **Add Authentication:**
   - JWT token system
   - User login/register endpoints

---

### ✨ Everything is Ready! Start the servers now. 🚀
