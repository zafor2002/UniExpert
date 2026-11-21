from sqlalchemy import Column, String, Integer, Boolean, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.db.session import Base

def gen_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=gen_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False, default="student")  # student, faculty, mentor, coordinator, admin, auditor
    department = Column(String, default="Software Engineering")
    is_verified = Column(Boolean, default=False)
    totp_secret = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    student_profile = relationship("StudentProfile", back_populates="user", uselist=False)
    faculty_profile = relationship("FacultyProfile", back_populates="user", uselist=False)


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"), unique=True)
    student_id = Column(String, index=True, nullable=False)
    batch = Column(Integer, default=41)
    section = Column(String, default="A")
    degree = Column(String, default="B.Sc. in Software Engineering")
    skills = Column(Text, default="")  # comma separated
    github = Column(String, nullable=True)
    linkedin = Column(String, nullable=True)

    user = relationship("User", back_populates="student_profile")


class FacultyProfile(Base):
    __tablename__ = "faculty_profiles"

    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"), unique=True)
    title = Column(String, default="Assistant Professor")
    tier = Column(Integer, default=1)  # 1, 2, or 3
    slots_used = Column(Integer, default=0)
    slots_total = Column(Integer, default=5)
    quota_status = Column(String, default="available")  # available, nearing, full, blackout
    h_index = Column(Integer, default=0)
    bio = Column(Text, default="")
    office_room = Column(String, default="Room 602")
    is_industry = Column(Boolean, default=False)
    skills = Column(Text, default="")
    research_areas = Column(Text, default="")
    publications_data = Column(Text, default="[]")

    user = relationship("User", back_populates="faculty_profile")


class Proposal(Base):
    __tablename__ = "proposals"

    id = Column(String, primary_key=True, default=gen_uuid)
    title = Column(String, nullable=False)
    problem_statement = Column(Text, nullable=False)
    methodology = Column(Text, nullable=True)
    status = Column(String, default="submitted")  # draft, submitted, under_review, accepted, declined
    student_id = Column(String, ForeignKey("users.id"))
    primary_advisor_id = Column(String, ForeignKey("users.id"))
    co_advisor_id = Column(String, nullable=True)
    sla_deadline = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    milestones = relationship("Milestone", back_populates="proposal")


class Milestone(Base):
    __tablename__ = "milestones"

    id = Column(String, primary_key=True, default=gen_uuid)
    proposal_id = Column(String, ForeignKey("proposals.id"))
    title = Column(String, nullable=False)
    description = Column(Text, default="")
    due_date = Column(String, nullable=False)
    is_completed = Column(Boolean, default=False)

    proposal = relationship("Proposal", back_populates="milestones")


class ConsultationSlot(Base):
    __tablename__ = "consultation_slots"

    id = Column(String, primary_key=True, default=gen_uuid)
    faculty_id = Column(String, ForeignKey("users.id"))
    day = Column(String, nullable=False)
    start_time = Column(String, nullable=False)
    end_time = Column(String, nullable=False)
    is_booked = Column(Boolean, default=False)
    booked_by_id = Column(String, nullable=True)


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String, primary_key=True, default=gen_uuid)
    channel_id = Column(String, index=True, default="ch-general")
    sender_id = Column(String, nullable=False)
    sender_name = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    pinned = Column(Boolean, default=False)


class AuditBlock(Base):
    __tablename__ = "audit_blocks"

    id = Column(String, primary_key=True, default=gen_uuid)
    block_index = Column(Integer, index=True)
    prev_hash = Column(String, nullable=False)
    block_hash = Column(String, nullable=False)
    event_type = Column(String, nullable=False)
    actor_id = Column(String, nullable=False)
    payload = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
