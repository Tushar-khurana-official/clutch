from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import auth
from app.settings import settings

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Clutch API",
    description="Developer activity dashboard — connecting you to your coding pulse.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])


@app.get("/")
def root():
    return {"message": "Clutch API is live 🚀", "version": "0.1.0"}


@app.get("/health")
def health():
    return {"status": "ok"}