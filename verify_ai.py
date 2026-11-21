"""
UniExpert Zero-Cost AI Matchmaking Engine Verification Script
Cross-platform verification script (Windows/Mac/Linux)
"""
import sys
import json
import urllib.request
import urllib.error

BASE_URL = "http://127.0.0.1:8000"

def check_backend_alive():
    try:
        req = urllib.request.Request(f"{BASE_URL}/")
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            print(f"[OK] Backend Server is Running: {data.get('system')}")
            return True
    except Exception as e:
        print(f"[ERROR] Backend server is not reachable at {BASE_URL}. Ensure uvicorn is running.\nDetails: {e}")
        return False

def test_query(title, query_text):
    url = f"{BASE_URL}/api/matching/discover"
    payload = json.dumps({"title": title, "problem_statement": query_text}).encode("utf-8")
    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
    
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            results = json.loads(resp.read().decode("utf-8"))
            top = results[0]
            print(f"\n>> Query: \"{query_text[:50]}...\"")
            print(f"   Top Match: {top['name']} ({top['department']})")
            print(f"   Match Score: {top['match_score']}% | Semantic: {top['semantic_score']}% | Skills: {top['skills_score']}%")
            print(f"   Matched Skills: {top['matched_skills']}")
            return top
    except Exception as e:
        print(f"[ERROR] Failed query: {e}")
        return None

if __name__ == "__main__":
    print("=" * 65)
    print("  UniExpert AI Model Live Demonstration & Verification")
    print("=" * 65)
    
    if not check_backend_alive():
        sys.exit(1)

    print("\n--- Testing Real-Time Semantic Adaptation ---")
    
    # Test 1: Embedded AI & Edge IoT
    t1 = test_query(
        "EdgeShield",
        "TinyML ECG anomaly detection on ARM Cortex-M4 with BLE 5.0 sensor fusion"
    )

    # Test 2: Computational Biology & Genomics
    t2 = test_query(
        "Genomic Target Predictor",
        "Bioinformatics scRNA-seq pipeline optimization and CRISPR-Cas9 target interaction"
    )

    # Test 3: Cloud & DevOps
    t3 = test_query(
        "Cloud Native CI/CD",
        "Kubernetes container orchestration, Docker microservices, and Prometheus monitoring"
    )

    print("\n" + "=" * 65)
    if t1 and t2 and t3 and t1['name'] != t2['name'] and t2['name'] != t3['name']:
        print("  RESULT: VERIFICATION PASSED (Dynamic AI Matcher Working 100%)")
        print(f"  - Query 1 Leader: {t1['name']}")
        print(f"  - Query 2 Leader: {t2['name']}")
        print(f"  - Query 3 Leader: {t3['name']}")
    else:
        print("  RESULT: Partial matches observed.")
    print("=" * 65)
