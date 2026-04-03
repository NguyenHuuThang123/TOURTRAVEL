# TourTravel - Tour Booking Platform

Full-stack tour booking application built with **React** (Frontend) + **FastAPI** (Backend).

## 📁 Project Structure

```
TOURTRAVEL/
├── FE_TOURTRAVEL/          # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components (Home, TourDetail, Cart)
│   │   ├── api/            # API service (tourService.js)
│   │   ├── styles/         # CSS files
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .gitignore
│
└── BE_TOURTRAVEL/          # FastAPI Backend (Python)
    ├── app/
    │   ├── routes/         # API endpoints (tours.py, bookings.py)
    │   ├── models/         # Database models
    │   ├── schemas/        # Pydantic schemas
    │   ├── config/         # Configuration
    │   └── __init__.py
    ├── main.py             # FastAPI app entry point
    ├── requirements.txt    # Python dependencies
    ├── .env.example        # Environment variables template
    └── .gitignore
```

## 🚀 Quick Start

### Run With Docker

1. **Open terminal at project root:**
   ```bash
   cd TOURTRAVEL
   ```

2. **Build and start all services:**
   ```bash
   docker compose up --build
   ```

3. **Access the app:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Swagger Docs: http://localhost:8000/docs

4. **Stop containers:**
   ```bash
   docker compose down
   ```

5. **Stop and remove volume data:**
   ```bash
   docker compose down -v
   ```

### Backend (FastAPI)

1. **Navigate to backend folder:**
   ```bash
   cd BE_TOURTRAVEL
   ```

2. **Create virtual environment (optional but recommended):**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # or: source venv/bin/activate  # Mac/Linux
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Copy environment file:**
   ```bash
   copy .env.example .env
   ```

5. **Run server:**
   ```bash
   python main.py
   ```
   Server runs at: **http://localhost:8000**
   
   - API Docs (Swagger): http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

### Frontend (React + Vite)

1. **Open new terminal, navigate to frontend folder:**
   ```bash
   cd FE_TOURTRAVEL
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```
   App runs at: **http://localhost:5173** (or 3000 if using port 3000)

## 📡 API Endpoints

### Tours
- `GET /api/tours` - Get all tours
- `GET /api/tours/{id}` - Get tour details
- `POST /api/tours` - Create new tour

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/{id}` - Get booking details

## 🔧 Tech Stack

**Frontend:**
- React 18
- Vite (build tool)
- React Router (navigation)
- Axios (HTTP client)

**Backend:**
- FastAPI (Python web framework)
- Uvicorn (ASGI server)
- Pydantic (data validation)
- SQLAlchemy (ORM - optional for database)

## 📝 Next Steps

1. **Database Setup:**
   - Replace mock data with SQLite/PostgreSQL/MongoDB
   - Uncomment SQLAlchemy models in `app/models/__init__.py`

2. **Authentication:**
   - Add JWT authentication
   - Implement user login/signup endpoints

3. **Payment Integration:**
   - Add Stripe/PayPal integration for bookings

4. **Frontend Enhancement:**
   - Add UI components (Tailwind CSS, Material-UI, etc.)
   - Implement proper state management (Redux/Zustand)
   - Add form validation with Formik/React Hook Form

5. **Database:**
   - Set up PostgreSQL or MongoDB
   - Create migrations
   - Add database connection to FastAPI

## 🤝 Contributing

Feel free to modify and extend this project!

## 📄 License

MIT License
