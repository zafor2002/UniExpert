from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import json

from app.db.session import get_db
from app.models.models import User, FacultyProfile
from app.schemas.schemas import (
    MatchRequest, ExpertMatchResult,
    EntityExtractRequest, EntityExtractResponse,
    CoAdvisorOptimizeRequest, CoAdvisorOptimizeResponse
)
from app.services.nlp_extractor import NLPEntityExtractor
from app.services.ai_matcher import AIMatchingService
from app.services.set_cover_optimizer import SetCoverCoAdvisorOptimizer
from app.db.seed_data import ensure_seeded

router = APIRouter(prefix="/matching", tags=["AI Advisor Discovery & Matching"])

def get_or_index_faculty(db: Session) -> List[dict]:
    """Retrieves all faculty and industry mentors from the DB, formatted for the AI matcher."""
    query = db.query(FacultyProfile, User).join(User, FacultyProfile.user_id == User.id)
    records = query.all()

    if not records:
        ensure_seeded(db)
        records = db.query(FacultyProfile, User).join(User, FacultyProfile.user_id == User.id).all()

    faculty_data = []
    for fac, usr in records:
        # Parse comma-separated skills and research areas
        skills_list = [s.strip() for s in fac.skills.split(",") if s.strip()] if fac.skills else []
        areas_list = [a.strip() for a in fac.research_areas.split(",") if a.strip()] if fac.research_areas else []
        
        try:
            pubs = json.loads(fac.publications_data) if fac.publications_data else []
        except Exception:
            pubs = []

        faculty_data.append({
            "id": usr.id,
            "name": usr.name,
            "title": fac.title,
            "department": usr.department,
            "tier": fac.tier,
            "slots_used": fac.slots_used,
            "slots_total": fac.slots_total,
            "quota_status": fac.quota_status,
            "h_index": fac.h_index,
            "bio": fac.bio,
            "is_industry": fac.is_industry,
            "skills": skills_list,
            "research_areas": areas_list,
            "publications": pubs
        })

    # Index into the vector matcher
    AIMatchingService.index_faculty_profiles(faculty_data)
    return faculty_data


@router.get("/faculty")
def list_faculty_profiles(db: Session = Depends(get_db)):
    """
    Returns all 50 faculty and industry mentor profiles with their live supervisory quota.
    """
    return get_or_index_faculty(db)


@router.post("/extract-entities", response_model=EntityExtractResponse)
def extract_project_entities(req: EntityExtractRequest):
    """
    NLP Entity & Skill Extractor (Zero-Shot / Rule-Based Taxonomy)
    Extracts domain tags, prerequisite technical skills, and BAETE complexity level.
    """
    result = NLPEntityExtractor.extract_entities(title=req.title, text=req.problem_statement)
    return EntityExtractResponse(**result)


@router.post("/discover", response_model=List[ExpertMatchResult])
def discover_advisors(req: MatchRequest, db: Session = Depends(get_db)):
    """
    Multi-Criteria Hybrid Matchmaking Engine
    Combines:
    - 40% Semantic Vector Similarity (Cosine Similarity over TF-IDF n-grams)
    - 25% Verified Skill & Prerequisite Overlap Ratio
    - 15% Publication Recency & Citation Log Index
    - 10% Workload Quota Availability
    - 10% Institutional Credential Tier
    """
    faculty_list = get_or_index_faculty(db)
    if not faculty_list:
        return []

    # 1. NLP Entity Extraction
    combined_text = f"{req.title or ''} {req.problem_statement}".strip()
    extracted = NLPEntityExtractor.extract_entities(title=req.title or "", text=req.problem_statement)
    prereq_skills = set(s.lower() for s in extracted["prerequisite_skills"])

    # 2. Dense Semantic Vector Cosine Similarity
    matcher = AIMatchingService.get_matcher()
    sim_scores = matcher.calculate_similarities(combined_text)

    results = []

    for fac in faculty_list:
        # Optional Department Filter
        if req.department_filter and req.department_filter != "all" and req.department_filter.lower() not in fac["department"].lower():
            continue

        # Optional Min Tier Filter
        if req.min_tier and fac["tier"] < req.min_tier:
            continue

        # Semantic cosine similarity (0.0 to 1.0)
        sem_sim = sim_scores.get(fac["id"], 0.0)

        # Skill overlap ratio
        fac_skills_set = set(s.lower() for s in fac["skills"])
        if prereq_skills:
            overlap = prereq_skills.intersection(fac_skills_set)
            skill_ratio = len(overlap) / len(prereq_skills)
            matched_skills_display = [s.title() for s in overlap]
        else:
            skill_ratio = 0.5
            matched_skills_display = fac["skills"][:3]

        # Raw citation approximation from h-index
        citations = fac["h_index"] * 45 + 100

        # Multi-Criteria Hybrid Scoring
        scores = AIMatchingService.calculate_hybrid_score(
            semantic_sim=sem_sim,
            skill_overlap_ratio=skill_ratio,
            citations=citations,
            slots_used=fac["slots_used"],
            slots_total=fac["slots_total"],
            tier=fac["tier"]
        )

        results.append(ExpertMatchResult(
            id=fac["id"],
            name=fac["name"],
            title=fac["title"],
            department=fac["department"],
            tier=fac["tier"],
            match_score=scores["final"],
            semantic_score=scores["semantic"],
            skills_score=scores["skills"],
            publication_score=scores["publication"],
            workload_score=scores["workload"],
            co_advisory_score=scores["tier"],
            slots_used=fac["slots_used"],
            slots_total=fac["slots_total"],
            status=fac["quota_status"],
            skills=fac["skills"],
            research_areas=fac["research_areas"],
            matched_skills=matched_skills_display,
            bio=fac["bio"]
        ))

    # Sort descending by composite match score
    results.sort(key=lambda x: x.match_score, reverse=True)
    return results


@router.get("/xai/{expert_id}")
def get_xai_breakdown(
    expert_id: str,
    title: Optional[str] = Query("Autonomous Edge-AI Healthcare Monitoring via BLE 5.0"),
    problem_statement: Optional[str] = Query("TinyML real-time ECG anomaly detection on ARM Cortex-M4"),
    db: Session = Depends(get_db)
):
    """
    Explainable AI (XAI) Attribution Breakdown
    Returns multi-axis radar chart competencies and feature contribution weights.
    """
    faculty_list = get_or_index_faculty(db)
    target_expert = next((f for f in faculty_list if f["id"] == expert_id), None)

    if not target_expert:
        raise HTTPException(status_code=404, detail="Expert profile not found")

    extracted = NLPEntityExtractor.extract_entities(title=title or "", text=problem_statement or "")
    
    return AIMatchingService.generate_xai_explanation(
        expert=target_expert,
        project_title=title,
        problem_statement=problem_statement,
        required_skills=extracted["prerequisite_skills"]
    )


@router.post("/optimize-coadvisor", response_model=CoAdvisorOptimizeResponse)
def optimize_coadvisor(req: CoAdvisorOptimizeRequest, db: Session = Depends(get_db)):
    r"""
    Set-Cover Co-Advisor Optimization Engine
    Computes ΔK = K_req \ (K_team ∪ K_primary) and returns optimal complementary mentors.
    """
    candidates = get_or_index_faculty(db)
    
    result = SetCoverCoAdvisorOptimizer.optimize(
        primary_advisor_id=req.primary_advisor_id,
        required_skills=req.required_skills,
        team_skills=req.team_skills or [],
        candidates=candidates
    )
    
    return CoAdvisorOptimizeResponse(**result)
