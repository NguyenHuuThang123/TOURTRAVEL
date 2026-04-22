from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.database import close_database, initialize_database
from app.routes import auth, bookings, chat, guides, tours, users

load_dotenv(Path(__file__).resolve().with_name(".env"))

app = FastAPI(title="TourTravel API", version="1.0.0")

# CORS configuration
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(tours.router)
app.include_router(bookings.router)
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(chat.router)
app.include_router(guides.router)


@app.on_event("startup")
async def startup_event():
    initialize_database()


@app.on_event("shutdown")
async def shutdown_event():
    close_database()

@app.get("/")
async def root():
    return {"message": "Welcome to TourTravel API"}

@app.get("/api/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
