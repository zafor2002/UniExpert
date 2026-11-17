from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.session import engine, Base, SessionLocal
from app.api import auth, proposals, matching, chat, audit
from app.models.models import User, FacultyProfile, StudentProfile
from app.core.security import get_password_hash

# Auto-create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="UniExpert - AI-Powered Capstone Advisory & Accreditation Platform Backend"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(proposals.router, prefix=settings.API_V1_STR)
app.include_router(matching.router, prefix=settings.API_V1_STR)
app.include_router(chat.router, prefix=settings.API_V1_STR)
app.include_router(audit.router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def seed_initial_data():
    db = SessionLocal()
    try:
        # Check if already seeded
        if not db.query(User).filter(User.email == "farhana.swe@diu.edu.bd").first():
            # Seed Faculty: Dr. Farhana Rahman
            fac_user = User(
                id="exp-1",
                email="farhana.swe@diu.edu.bd",
                hashed_password=get_password_hash("password123"),
                name="Dr. Farhana Rahman",
                role="faculty",
                department="Software Engineering",
                is_verified=True
            )
            db.add(fac_user)
            db.commit()

            fac_profile = FacultyProfile(
                user_id=fac_user.id,
                title="Associate Professor",
                tier=1,
                slots_used=3,
                slots_total=5,
                quota_status="available",
                h_index=14,
                bio="Edge Computing, TinyML, CMSIS-NN, Embedded AI Architectures.",
                office_room="Room 602"
            )
            db.add(fac_profile)

            # Seed Student: Abu Zafor
            stu_user = User(
                id="stu-1",
                email="abu.zafor@diu.edu.bd",
                hashed_password=get_password_hash("password123"),
                name="Abu Zafor",
                role="student",
                department="Software Engineering",
                is_verified=True
            )
            db.add(stu_user)
            db.commit()

            stu_profile = StudentProfile(
                user_id=stu_user.id,
                student_id="232-35-331",
                batch=41,
                section="A",
                skills="TinyML, CMSIS-NN, React, BLE, Python"
            )
            db.add(stu_profile)
            db.commit()
    finally:
        db.close()

@app.get("/")
def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs"
    }
