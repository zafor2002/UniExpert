"""
End-to-End Test for the UniExpert Proposal Lifecycle Loop:
Student Submission -> Faculty Inbound Review -> Scope Negotiation -> Resubmission -> Acceptance & Quota Decrement -> Merkle Audit Chain Verification
"""
import sys
import os
import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

def run_e2e_test():
    print("=" * 70)
    print("STARTING FULL END-TO-END MULTI-ROLE PROPOSAL LIFECYCLE TEST")
    print("=" * 70)

    # 1. Fetch initial faculty quota for Md. Shohel Arman (user_id: 'exp-1')
    from app.db.session import SessionLocal
    from app.models.models import FacultyProfile, AuditBlock, Proposal
    db = SessionLocal()
    advisor = db.query(FacultyProfile).filter(FacultyProfile.user_id == 'exp-1').first()
    if not advisor:
        print("[FAIL] Advisor exp-1 not found in database!")
        return False
    initial_slots = advisor.slots_used
    print(f"[STEP 1] Initial Supervisory Slots for Md. Shohel Arman: {initial_slots} / {advisor.slots_total}")

    # 2. Submit a new Student Proposal via REST API
    payload = {
        "title": "Autonomous Edge-AI Healthcare Monitoring via BLE 5.0 Sensor Fusion",
        "problem_statement": "Real-time wearable ECG & PPG continuous monitoring using CMSIS-NN quantized models on ARM Cortex-M4 with low-latency BLE 5.0 transmission.",
        "methodology": "Quantized CNN on PTB-XL ECG dataset running on nRF52840 SoC under 3mW power envelope.",
        "primary_advisor_id": "exp-1"
    }
    
    print("\n[STEP 2] Submitting Proposal via POST /api/proposals/ ...")
    resp = requests.post(f"{BASE_URL}/proposals/?student_id=stu-1", json=payload)
    if resp.status_code != 200:
        print(f"[FAIL] Proposal submission failed with HTTP {resp.status_code}: {resp.text}")
        return False
    prop_data = resp.json()
    proposal_id = prop_data["id"]
    print(f"[SUCCESS] Proposal submitted! ID: {proposal_id}, Status: {prop_data['status']}")

    # Verify PROPOSAL_SUBMITTED audit block exists
    db.expire_all()
    sub_block = db.query(AuditBlock).filter(
        AuditBlock.event_type == "PROPOSAL_SUBMITTED",
        AuditBlock.payload.like(f"%{proposal_id}%")
    ).first()
    assert sub_block is not None, "AuditBlock for PROPOSAL_SUBMITTED not created!"
    print(f"[VERIFIED] SHA-256 Merkle Block created for PROPOSAL_SUBMITTED (Block #{sub_block.block_index}, Hash: {sub_block.block_hash[:16]}...)")

    # 3. Transition to 'under_review' as Faculty Advisor opens the proposal
    print("\n[STEP 3] Transitioning to 'under_review' via PUT /api/proposals/{id}/status ...")
    resp = requests.put(f"{BASE_URL}/proposals/{proposal_id}/status?new_status=under_review")
    assert resp.status_code == 200, f"Failed under_review transition: {resp.text}"
    print(f"[SUCCESS] Status updated to 'under_review'.")

    # 4. Faculty requests Scope Negotiation
    print("\n[STEP 4] Faculty requesting Scope Negotiation via PUT /api/proposals/{id}/status ...")
    resp = requests.put(f"{BASE_URL}/proposals/{proposal_id}/status?new_status=negotiation")
    assert resp.status_code == 200, f"Failed negotiation transition: {resp.text}"
    print(f"[SUCCESS] Status updated to 'negotiation'.")

    # 5. Student submits revised proposal
    print("\n[STEP 5] Student resubmitting revised roadmap via PUT /api/proposals/{id}/status ...")
    resp = requests.put(f"{BASE_URL}/proposals/{proposal_id}/status?new_status=submitted")
    assert resp.status_code == 200, f"Failed revision submission: {resp.text}"
    print(f"[SUCCESS] Revised roadmap resubmitted. Status reset to 'submitted'.")

    # 6. Faculty Formally Accepts Proposal -> Supervisory Quota Decrements!
    print("\n[STEP 6] Faculty Formally Accepts Proposal via PUT /api/proposals/{id}/status?new_status=accepted ...")
    resp = requests.put(f"{BASE_URL}/proposals/{proposal_id}/status?new_status=accepted")
    assert resp.status_code == 200, f"Failed acceptance: {resp.text}"
    accept_data = resp.json()
    print(f"[SUCCESS] Proposal accepted! Message: {accept_data['message']}")
    print(f"          Advisor Slots Used: {accept_data['slots_used']} / {accept_data['slots_total']}")

    # Verify that SQLite database has updated slots_used
    db.expire_all()
    updated_advisor = db.query(FacultyProfile).filter(FacultyProfile.user_id == 'exp-1').first()
    assert updated_advisor.slots_used == initial_slots + 1, f"Expected {initial_slots + 1} slots used, found {updated_advisor.slots_used}"
    print(f"[VERIFIED] SQLite FacultyProfile.slots_used correctly incremented from {initial_slots} -> {updated_advisor.slots_used}!")

    # Verify PROPOSAL_ACCEPTED audit block exists
    accept_block = db.query(AuditBlock).filter(
        AuditBlock.event_type == "PROPOSAL_ACCEPTED",
        AuditBlock.payload.like(f"%{proposal_id}%")
    ).first()
    assert accept_block is not None, "AuditBlock for PROPOSAL_ACCEPTED not found!"
    print(f"[VERIFIED] SHA-256 Merkle Block created for PROPOSAL_ACCEPTED (Block #{accept_block.block_index}, Hash: {accept_block.block_hash[:16]}...)")

    # 7. Auditor SHA-256 Cryptographic Chain Verification
    print("\n[STEP 7] Verifying entire Cryptographic Merkle Ledger via GET /api/audit/verify ...")
    resp = requests.get(f"{BASE_URL}/audit/verify")
    assert resp.status_code == 200, f"Failed audit verification: {resp.text}"
    audit_data = resp.json()
    print(f"[AUDIT VERIFICATION RESULT]: {json.dumps(audit_data, indent=2)}")
    assert audit_data["valid"] is True, "Audit chain integrity failed!"
    print(f"[VERIFIED] Cryptographic hash chain is 100% mathematically valid across all {audit_data['total_blocks']} Merkle blocks!")

    print("\n" + "=" * 70)
    print("ALL 7 LIFECYCLE STAGES PASSED WITH 100% INTEGRITY AND VERIFICATION!")
    print("=" * 70)
    return True

if __name__ == "__main__":
    success = run_e2e_test()
    if not success:
        sys.exit(1)
