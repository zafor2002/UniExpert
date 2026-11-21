from pydantic import BaseModel
from typing import Optional, List, Dict, Any
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

# --- AI Match & NLP Schemas ---
class EntityExtractRequest(BaseModel):
    title: str
    problem_statement: str

class EntityExtractResponse(BaseModel):
    primary_domain: str
    all_domains: List[str]
    prerequisite_skills: List[str]
    complexity_level: int
    complexity_label: str
    token_count: int

class MatchRequest(BaseModel):
    title: Optional[str] = ""
    problem_statement: str
    team_skills: Optional[List[str]] = []
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
    skills_score: int = 0
    publication_score: int
    workload_score: int
    co_advisory_score: int
    slots_used: int
    slots_total: int
    status: str
    skills: List[str] = []
    research_areas: List[str] = []
    matched_skills: List[str] = []
    bio: Optional[str] = ""

class CoAdvisorOptimizeRequest(BaseModel):
    primary_advisor_id: str
    required_skills: List[str]
    team_skills: Optional[List[str]] = []

class CoAdvisorCandidate(BaseModel):
    id: str
    name: str
    title: str
    department: str
    is_industry: bool
    synergy_score: int
    gap_skills_covered: List[str]
    all_matching_skills: List[str]
    slots_available: int
    quota_status: str

class CoAdvisorOptimizeResponse(BaseModel):
    required_skills: List[str]
    covered_by_team_and_primary: List[str]
    unaddressed_gap_delta_k: List[str]
    recommended_co_advisors: List[CoAdvisorCandidate]

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
