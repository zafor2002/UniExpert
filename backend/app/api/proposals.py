from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
import json

from app.db.session import get_db
from app.models.models import Proposal, Milestone, User, FacultyProfile, AuditBlock
from app.schemas.schemas import ProposalCreate, ProposalResponse
from app.services.merkle_tree import MerkleAuditService

router = APIRouter(prefix="/proposals", tags=["Proposals & FSM"])

def record_audit_event(db: Session, event_type: str, actor_id: str, payload_dict: dict):
    """Appends an immutable SHA-256 Merkle Block to the audit trail."""
    try:
        last_block = db.query(AuditBlock).order_by(AuditBlock.block_index.desc()).first()
        idx = (last_block.block_index + 1) if last_block else 0
        prev_hash = last_block.block_hash if last_block else "0" * 64
        ts = datetime.utcnow()
        payload_str = json.dumps(payload_dict)
        block_hash = MerkleAuditService.calculate_hash(
            index=idx,
            prev_hash=prev_hash,
            event_type=event_type,
            actor_id=actor_id,
            payload=payload_str,
            timestamp=ts.isoformat()
        )
        block = AuditBlock(
            block_index=idx,
            prev_hash=prev_hash,
            block_hash=block_hash,
            event_type=event_type,
            actor_id=actor_id,
            payload=payload_str,
            timestamp=ts
        )
        db.add(block)
        db.commit()
    except Exception as e:
        print(f"Audit log warning: {e}")

@router.get("/", response_model=List[ProposalResponse])
def get_all_proposals(advisor_id: Optional[str] = None, db: Session = Depends(get_db)):
    """Fetches proposals, optionally filtered by advisor ID, ordered by recency."""
    query = db.query(Proposal)
    if advisor_id:
        query = query.filter(Proposal.primary_advisor_id == advisor_id)
    return query.order_by(Proposal.created_at.desc()).all()

@router.get("/{proposal_id}", response_model=ProposalResponse)
def get_proposal_by_id(proposal_id: str, db: Session = Depends(get_db)):
    prop = db.query(Proposal).filter(Proposal.id == proposal_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Proposal not found")
    return prop

@router.post("/", response_model=ProposalResponse)
def submit_proposal(p_in: ProposalCreate, student_id: str = "stu-1", db: Session = Depends(get_db)):
    # Verify primary advisor exists and check quota capacity
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
        student_id=student_id or "stu-1",
        primary_advisor_id=p_in.primary_advisor_id,
        co_advisor_id=p_in.co_advisor_id,
        sla_deadline=sla
    )
    db.add(new_p)
    db.commit()
    db.refresh(new_p)

    # Cryptographic Audit Log
    record_audit_event(
        db,
        event_type="PROPOSAL_SUBMITTED",
        actor_id=student_id or "stu-1",
        payload_dict={
            "proposal_id": new_p.id,
            "title": new_p.title,
            "primary_advisor_id": new_p.primary_advisor_id,
            "sla_deadline": sla.isoformat()
        }
    )

    return new_p

@router.put("/{proposal_id}/status")
def update_proposal_status(proposal_id: str, new_status: str, db: Session = Depends(get_db)):
    valid_statuses = ["draft", "submitted", "under_review", "negotiation", "accepted", "declined"]
    if new_status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid FSM lifecycle state.")
    
    proposal = db.query(Proposal).filter(Proposal.id == proposal_id).first()
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found.")
    
    prev_status = proposal.status
    advisor = db.query(FacultyProfile).filter(FacultyProfile.user_id == proposal.primary_advisor_id).first()

    # If transitioning to accepted, increment slots_used
    if new_status == "accepted" and prev_status != "accepted":
        if advisor:
            advisor.slots_used += 1
            if advisor.slots_used >= advisor.slots_total:
                advisor.quota_status = "full"
            elif advisor.slots_total - advisor.slots_used <= 1:
                advisor.quota_status = "nearing"
            else:
                advisor.quota_status = "available"

    # If transitioning away from accepted, decrement slots_used
    elif prev_status == "accepted" and new_status != "accepted":
        if advisor and advisor.slots_used > 0:
            advisor.slots_used -= 1
            if advisor.slots_total - advisor.slots_used > 1:
                advisor.quota_status = "available"
            elif advisor.slots_total - advisor.slots_used == 1:
                advisor.quota_status = "nearing"

    proposal.status = new_status
    db.commit()

    # Append to SHA-256 Merkle Audit Trail
    record_audit_event(
        db,
        event_type=f"PROPOSAL_{new_status.upper()}",
        actor_id=proposal.primary_advisor_id or "faculty",
        payload_dict={
            "proposal_id": proposal.id,
            "previous_status": prev_status,
            "new_status": new_status,
            "advisor_slots_used": advisor.slots_used if advisor else None,
            "advisor_quota_status": advisor.quota_status if advisor else None
        }
    )

    return {
        "message": f"Proposal status updated to '{new_status}' successfully.",
        "proposal_id": proposal.id,
        "new_status": new_status,
        "slots_used": advisor.slots_used if advisor else None,
        "slots_total": advisor.slots_total if advisor else None,
        "quota_status": advisor.quota_status if advisor else None
    }
