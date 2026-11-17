from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.db.session import get_db
from app.models.models import AuditBlock
from app.services.merkle_tree import MerkleAuditService

router = APIRouter(prefix="/audit", tags=["Cryptographic Audit Ledger"])

@router.get("/blocks")
def get_audit_trail(db: Session = Depends(get_db)):
    blocks = db.query(AuditBlock).order_by(AuditBlock.block_index.asc()).all()
    return blocks

@router.get("/verify")
def verify_audit_ledger(db: Session = Depends(get_db)):
    blocks = db.query(AuditBlock).order_by(AuditBlock.block_index.asc()).all()
    if not blocks:
        return {"valid": True, "message": "Genesis state: ledger is empty."}
    
    serialized = [
        {
            "block_index": b.block_index,
            "prev_hash": b.prev_hash,
            "block_hash": b.block_hash,
            "event_type": b.event_type,
            "actor_id": b.actor_id,
            "payload": b.payload,
            "timestamp": b.timestamp.isoformat()
        }
        for b in blocks
    ]

    is_valid = MerkleAuditService.verify_chain(serialized)
    return {
        "valid": is_valid,
        "total_blocks": len(blocks),
        "latest_block_hash": blocks[-1].block_hash if blocks else None
    }
