from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.session import engine, Base, SessionLocal
from app.api import auth, proposals, matching, chat, audit, meeting, reports
from app.api.matching import get_or_index_faculty
from app.db.seed_data import ensure_seeded

# Auto-create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="UniExpert - AI-Powered Capstone Advisory & Accreditation Platform Backend"
)

# CORS Middleware - allows localhost, Vercel deployments, and custom domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(proposals.router, prefix=settings.API_V1_STR)
app.include_router(matching.router, prefix=settings.API_V1_STR)
app.include_router(chat.router, prefix=settings.API_V1_STR)
app.include_router(meeting.router, prefix=settings.API_V1_STR)
app.include_router(audit.router, prefix=settings.API_V1_STR)
app.include_router(reports.router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def seed_initial_data():
    db = SessionLocal()
    try:
        ensure_seeded(db)
        get_or_index_faculty(db)
    finally:
        db.close()

@app.get("/")
def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "ai_engine": "Zero-Cost Local Hybrid Vector Matcher (MiniLM / Sublinear TF-IDF + Set-Cover)",
        "docs_url": "/docs"
    }
