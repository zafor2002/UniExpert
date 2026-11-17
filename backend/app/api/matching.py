from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.models import User, FacultyProfile
from app.schemas.schemas import MatchRequest, ExpertMatchResult
from app.services.ai_matcher import AIMatchingService

router = APIRouter(prefix="/matching", tags=["AI Advisor Discovery & Matching"])

@router.post("/discover", response_model=List[ExpertMatchResult])
def discover_advisors(req: MatchRequest, db: Session = Depends(get_db)):
    faculty_list = db.query(FacultyProfile, User).join(User, FacultyProfile.user_id == User.id).all()
    
    results = []
    # Simulated semantic cosine similarity score distribution
    mock_sims = [0.94, 0.88, 0.82, 0.75, 0.71, 0.65]

    for idx, (fac, usr) in enumerate(faculty_list):
        sim = mock_sims[idx % len(mock_sims)]
        citations = fac.h_index * 45 + 120
        scores = AIMatchingService.calculate_hybrid_score(
            semantic_sim=sim,
            citations=citations,
            slots_used=fac.slots_used,
            slots_total=fac.slots_total,
            tier=fac.tier
        )

        results.append(ExpertMatchResult(
            id=usr.id,
            name=usr.name,
            title=fac.title,
            department=usr.department,
            tier=fac.tier,
            match_score=scores["final"],
            semantic_score=scores["semantic"],
            publication_score=scores["publication"],
            workload_score=scores["workload"],
            co_advisory_score=scores["coadv"],
            slots_used=fac.slots_used,
            slots_total=fac.slots_total,
            status=fac.quota_status
        ))

    # Sort descending by match score
    results.sort(key=lambda x: x.match_score, reverse=True)
    return results

@router.get("/xai/{expert_id}")
def get_xai_breakdown(expert_id: str):
    """Returns Explainable AI radar metrics comparing student needs to faculty competencies."""
    return {
        "expert_id": expert_id,
        "radar": [
            {"subject": "Embedded AI", "required": 95, "expert": 92},
            {"subject": "BLE & IoT", "required": 85, "expert": 90},
            {"subject": "TinyML/CMSIS", "required": 90, "expert": 95},
            {"subject": "Hardware Dev", "required": 75, "expert": 88},
            {"subject": "Cloud & MQTT", "required": 70, "expert": 75},
            {"subject": "Bio-Sensing", "required": 80, "expert": 65},
        ],
        "weights": {
            "semantic": 0.45,
            "publication": 0.30,
            "workload": 0.15,
            "co_advisory": 0.10
        }
    }
