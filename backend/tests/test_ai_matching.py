import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_ai_pipeline():
    # 1. Root check
    res = client.get("/")
    assert res.status_code == 200, res.text
    print("1. Root endpoint: OK", res.json()["ai_engine"])

    # 2. Entity extraction
    title = "Autonomous Edge-AI Healthcare Monitoring via BLE 5.0 Sensor Fusion"
    problem = "We deploy TinyML 1D-CNN real-time ECG arrhythmia classification on ARM Cortex-M4 with CMSIS-NN optimization."
    res = client.post("/api/matching/extract-entities", json={
        "title": title,
        "problem_statement": problem
    })
    assert res.status_code == 200, res.text
    data = res.json()
    print("2. NLP Entity Extractor: OK")
    print(f"   Domain: {data['primary_domain']}")
    print(f"   Prerequisites: {data['prerequisite_skills']}")
    print(f"   Complexity: {data['complexity_label']} (Level {data['complexity_level']})")

    # 3. Advisor discovery
    res = client.post("/api/matching/discover", json={
        "title": title,
        "problem_statement": problem,
        "team_skills": ["TinyML", "React"]
    })
    assert res.status_code == 200, res.text
    experts = res.json()
    print(f"3. AI Advisor Matching: OK ({len(experts)} ranked experts)")
    for exp in experts:
        print(f"   * {exp['name']} ({exp['department']}) -> Score: {exp['match_score']}% [Semantic: {exp['semantic_score']}%, Skills: {exp['skills_score']}%, Pubs: {exp['publication_score']}%]")

    # Verify Md. Shohel Arman is top ranked for Edge AI / TinyML
    assert experts[0]["name"] == "Md. Shohel Arman"

    # 4. Explainable AI (XAI)
    top_id = experts[0]["id"]
    res = client.get(f"/api/matching/xai/{top_id}")
    assert res.status_code == 200, res.text
    xai = res.json()
    print("4. XAI Feature Attribution & Radar: OK")
    print(f"   Justification: {xai['justification']}")
    print(f"   Radar Axes: {[r['subject'] for r in xai['radar']]}")

    # 5. Co-Advisor Optimizer (Set-Cover)
    res = client.post("/api/matching/optimize-coadvisor", json={
        "primary_advisor_id": top_id,
        "required_skills": ["TinyML", "ARM Cortex-M4", "Kubernetes", "Cloud Computing", "CI/CD"],
        "team_skills": ["TinyML"]
    })
    assert res.status_code == 200, res.text
    opt = res.json()
    print("5. Set-Cover Co-Advisor Optimizer: OK")
    print(f"   Covered by Primary + Team: {opt['covered_by_team_and_primary']}")
    print(f"   Unaddressed Gap (Delta K): {opt['unaddressed_gap_delta_k']}")
    top_co = opt["recommended_co_advisors"][0]
    print(f"   Optimal Co-Advisor: {top_co['name']} (Synergy: {top_co['synergy_score']}%, Covers: {top_co['gap_skills_covered']})")

    print("\nALL AI MODEL TESTS PASSED SUCCESSFULLY! (100% Free & Local)")

if __name__ == "__main__":
    test_ai_pipeline()
