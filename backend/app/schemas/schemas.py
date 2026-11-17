from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# --- Auth Schemas ---
class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    role: str = "student"
    department: str = "Software Engineering"
    student_id: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: str
    name: str

class MfaVerify(BaseModel):
    user_id: str
    totp_code: str

# --- Proposal Schemas ---
class ProposalCreate(BaseModel):
    title: str
    problem_statement: str
    methodology: Optional[str] = None
    primary_advisor_id: str
    co_advisor_id: Optional[str] = None

class ProposalResponse(BaseModel):
    id: str
    title: str
    problem_statement: str
    status: str
    student_id: str
    primary_advisor_id: str
    co_advisor_id: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

# --- AI Match Schemas ---
class MatchRequest(BaseModel):
    problem_statement: str
    department_filter: Optional[str] = None
    min_tier: Optional[int] = None

class ExpertMatchResult(BaseModel):
    id: str
    name: str
    title: str
    department: str
    tier: int
    match_score: int
    semantic_score: int
    publication_score: int
    workload_score: int
    co_advisory_score: int
    slots_used: int
    slots_total: int
    status: str

# --- Chat Schemas ---
class ChatMessageCreate(BaseModel):
    channel_id: str
    content: str

class ChatMessageResponse(BaseModel):
    id: str
    channel_id: str
    sender_id: str
    sender_name: str
    content: str
    timestamp: datetime
    pinned: bool

    class Config:
        from_attributes = True

# --- Consultation Schemas ---
class ConsultationBooking(BaseModel):
    slot_id: str
    agenda: Optional[str] = None
