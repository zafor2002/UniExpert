import urllib.request
import json

queries = [
    ("TinyML & IoT", "TinyML real-time ECG anomaly detection on ARM Cortex-M4 with BLE 5.0 sensor fusion"),
    ("Bioinformatics & Genomics", "Single-cell RNA sequencing scRNA-seq pipeline with GNN drug-target interaction and CRISPR off-target analysis"),
    ("Cloud & DevOps", "Kubernetes container orchestration with Terraform infrastructure as code, CI/CD pipelines, and Prometheus monitoring"),
    ("Deep Learning & NLP", "Neural architecture search for BERT transformer models and zero-shot NLP transfer learning with PyTorch CUDA"),
    ("Cybersecurity & Web3", "Decentralized smart contracts on Ethereum with zero-knowledge proofs and Merkle tree cryptography"),
    ("Software Architecture", "Agile requirements engineering, UML modeling, and enterprise microservices design with Spring Boot and Java")
]

for title, text in queries:
    req = urllib.request.Request(
        "http://127.0.0.1:8000/api/matching/discover",
        data=json.dumps({"title": title, "problem_statement": text}).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as res:
        data = json.loads(res.read().decode("utf-8"))
        top = data[0]
        print(f"{title:25} -> {top['name']:25} | Score: {top['match_score']}% | Sem: {top['semantic_score']}% | Skills: {top['matched_skills']}")
