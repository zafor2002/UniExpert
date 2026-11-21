import urllib.request
import json

samples = [
    (
        "Edge-AI Healthcare",
        "EdgeShield: BLE-Based ECG Monitoring with TinyML",
        "Designing a wearable patch for real-time ECG arrhythmia detection on an ARM Cortex-M4 microcontroller running 8-bit quantized CNN models under 92KB RAM with BLE 5.0 AES-GCM streaming."
    ),
    (
        "Bioinformatics & CRISPR",
        "Scalable Single-Cell RNA Sequencing Analysis",
        "Automated computational genomics pipeline using Nextflow and Spark to process single-cell RNA sequencing scRNA-seq data, with graph neural networks predicting CRISPR off-target interactions."
    ),
    (
        "Cloud & DevOps",
        "Multi-Region Kubernetes Container Orchestration",
        "Enterprise cloud infrastructure automated via Terraform and Helm on AWS, implementing zero-downtime cross-region Kubernetes pod failover and Prometheus monitoring with Docker microservices."
    ),
    (
        "Blockchain & Web3",
        "Formal Verification of Ethereum Smart Contracts",
        "Auditing Solidity smart contracts for reentrancy and flash loan exploits using formal SMT verification, combined with zk-SNARK rollup proofs and Merkle tree state commitments on Ethereum."
    )
]

print("=" * 85)
print("  Entity Review AI Extractor Live Test (/api/matching/extract-entities)")
print("=" * 85)

for label, title, text in samples:
    req = urllib.request.Request(
        "http://127.0.0.1:8000/api/matching/extract-entities",
        data=json.dumps({"title": title, "problem_statement": text}).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        print(f"\n>> Sample: {label}")
        print(f"   Project Title:      {title}")
        print(f"   Primary Domain:     {data['primary_domain']}")
        print(f"   Detected Domains:   {data['all_domains']}")
        print(f"   Extracted Skills:   {data['prerequisite_skills']}")
        print(f"   BAETE Complexity:   Level {data['complexity_level']} / 5 ({data['complexity_label']})")
        print(f"   Token Count:        {data['token_count']}")

print("=" * 85)
