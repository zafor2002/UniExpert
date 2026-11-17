from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
from app.db.session import get_db
from app.models.models import Proposal, Milestone, User, FacultyProfile
from app.schemas.schemas import ProposalCreate, ProposalResponse

router = APIRouter(prefix="/proposals", tags=["Proposals & FSM"])

@router.get("/", response_model=List[ProposalResponse])
def get_all_proposals(db: Session = Depends(get_db)):
    return db.query(Proposal).all()

@router.post("/", response_model=ProposalResponse)
def submit_proposal(p_in: ProposalCreate, student_id: str = "mock-student-id", db: Session = Depends(get_db)):
    # Verify primary advisor exists and has remaining quota
    advisor = db.query(FacultyProfile).filter(FacultyProfile.user_id == p_in.primary_advisor_id).first()
    if advisor and advisor.slots_used >= advisor.slots_total:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Selected Faculty Advisor has reached their anti-burnout supervisory quota limit."
        )

    # 7-day SLA window
    sla = datetime.utcnow() + timedelta(days=7)

    new_p = Proposal(
        title=p_in.title,
        problem_statement=p_in.problem_statement,
        methodology=p_in.methodology,
        status="submitted",
        student_id=student_id,
        primary_advisor_id=p_in.primary_advisor_id,
        co_advisor_id=p_in.co_advisor_id,
        sla_deadline=sla
    )
    db.add(new_p)
    db.commit()
    db.refresh(new_p)
    return new_p

@router.put("/{proposal_id}/status")
def update_proposal_status(proposal_id: str, new_status: str, db: Session = Depends(get_db)):
    valid_statuses = ["draft", "submitted", "under_review", "accepted", "declined"]
    if new_status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid FSM lifecycle state.")
    
    proposal = db.query(Proposal).filter(Proposal.id == proposal_id).first()
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found.")
    
    # If accepted, increment advisor slots_used
    if new_status == "accepted" and proposal.status != "accepted":
        advisor = db.query(FacultyProfile).filter(FacultyProfile.user_id == proposal.primary_advisor_id).first()
        if advisor:
            advisor.slots_used += 1
            if advisor.slots_used >= advisor.slots_total:
                advisor.quota_status = "full"
            elif advisor.slots_total - advisor.slots_used == 1:
                advisor.quota_status = "nearing"
    
    proposal.status = new_status
    db.commit()
    return {"message": f"Proposal status updated to '{new_status}' successfully."}
