from typing import List, Dict, Any, Set
import re

# Comprehensive academic & software engineering taxonomy
ONTOLOGY_DOMAINS = {
    "Embedded AI & Edge Computing": [
        "tinyml", "edge ai", "arm cortex", "cortex-m4", "embedded", "iot", "ble", "bluetooth",
        "mesh", "cmsis", "cmsis-nn", "microcontroller", "freertos", "sensor", "sensor fusion",
        "fpga", "low-power", "mqtt", "zigbee", "nordic", "esp32", "firmware", "c/c++"
    ],
    "Healthcare & Biomedical Computing": [
        "healthcare", "ecg", "arrhythmia", "biomedical", "vital signs", "patient", "clinical",
        "bio-sensing", "health monitoring", "telemedicine", "medical", "eeg", "cardiac", "spo2"
    ],
    "Bioinformatics & Genomics": [
        "bioinformatics", "scrna-seq", "genomics", "single-cell", "crispr", "cas9", "rna",
        "dna", "drug-target", "gnn", "computational biology", "molecular", "nextflow", "docking"
    ],
    "Machine Learning & Deep Learning": [
        "deep learning", "machine learning", "neural network", "cnn", "transformer", "bert",
        "pytorch", "tensorflow", "nas", "neural architecture search", "transfer learning",
        "zero-shot", "reinforcement learning", "cuda", "onnx", "optimization"
    ],
    "Natural Language Processing": [
        "nlp", "natural language", "llm", "large language model", "text classification",
        "named entity", "ner", "sentiment", "tokenization", "embeddings", "semantic search"
    ],
    "Cybersecurity & Cryptography": [
        "security", "cryptography", "aes", "encryption", "hash", "sha-256", "merkle", "zero-trust",
        "penetration testing", "blockchain", "privacy", "differential privacy", "firewall"
    ],
    "Cloud Architecture & DevOps": [
        "cloud", "aws", "gcp", "azure", "kubernetes", "k8s", "docker", "ci/cd", "microservices",
        "devops", "terraform", "prometheus", "gitops", "distributed systems", "kafka"
    ],
    "Software Engineering & Architecture": [
        "software engineering", "agile", "scrum", "requirements", "uml", "sysml", "design patterns",
        "rest api", "fastapi", "react", "next.js", "frontend", "backend", "full-stack", "testing"
    ]
}

SKILL_PATTERNS = {
    "TinyML": r"\b(tinyml|tiny ml|embedded ml)\b",
    "ARM Cortex-M4": r"\b(arm|cortex|cortex-m4|mcu)\b",
    "BLE 5.0": r"\b(ble|bluetooth|ble 5\.0|gatt)\b",
    "CMSIS-NN": r"\b(cmsis|cmsis-nn|cmsis nn)\b",
    "Sensor Fusion": r"\b(sensor fusion|multi-sensor|accelerometer|imu)\b",
    "C/C++ Embedded": r"\b(c/c\+\+|embedded c|firmware|bare metal)\b",
    "FreeRTOS": r"\b(freertos|rtos|real-time operating system)\b",
    "MQTT": r"\b(mqtt|iot protocol|broker)\b",
    "Python": r"\b(python|py|numpy|pandas)\b",
    "PyTorch": r"\b(pytorch|torch)\b",
    "TensorFlow": r"\b(tensorflow|tf|keras)\b",
    "React": r"\b(react|react\.js|reactjs|vite)\b",
    "FastAPI": r"\b(fastapi|rest api|uvicorn)\b",
    "Docker": r"\b(docker|container|dockerfile)\b",
    "Kubernetes": r"\b(kubernetes|k8s)\b",
    "scRNA-seq": r"\b(scrna-seq|single-cell|rna sequencing)\b",
    "GNN": r"\b(gnn|graph neural network)\b",
    "CRISPR Analysis": r"\b(crispr|crispr-cas9|guide rna)\b",
    "Nextflow": r"\b(nextflow|snakemake|bioinformatics pipeline)\b",
    "Bio-Sensing": r"\b(ecg|bio-sensing|vital signs|arrhythmia|ppg)\b",
    "UML / SysML": r"\b(uml|sysml|software architecture|class diagram)\b",
    "Agile / Scrum": r"\b(agile|scrum|sprint|kanban)\b",
    "Cryptography": r"\b(sha-256|aes-128|merkle|cryptography|encryption)\b",
    "Computer Vision": r"\b(computer vision|opencv|yolo|segmentation|mri|image processing)\b",
    "Apache Spark": r"\b(spark|apache spark|pyspark)\b",
    "Kafka": r"\b(kafka|event stream|stream processing)\b",
    "Solidity / Smart Contracts": r"\b(solidity|smart contract|ethereum|web3)\b",
    "Zero-Knowledge Proofs": r"\b(zero-knowledge|zk-snark|zk|zkp)\b",
    "LLM / RAG": r"\b(llm|large language model|rag|langchain|llamaindex|vector database)\b",
    "ROS2 / SLAM": r"\b(ros|ros2|slam|lidar|robotics|path planning)\b",
    "Flutter / Mobile": r"\b(flutter|dart|swift|ios|android|mobile app)\b",
    "Quantum Computing": r"\b(quantum|qiskit|vqe|quantum circuit)\b",
    "Spring Boot": r"\b(spring boot|spring|java|microservice)\b",
    "CI/CD": r"\b(ci/cd|pipeline|github actions|jenkins|devops)\b",
    "Terraform": r"\b(terraform|infrastructure as code|iac)\b"
}

class NLPEntityExtractor:
    @staticmethod
    def extract_entities(title: str, text: str) -> Dict[str, Any]:
        combined_text = f"{title} {text}".lower()
        
        detected_domains = []
        domain_scores = {}
        
        for domain, keywords in ONTOLOGY_DOMAINS.items():
            matches = [kw for kw in keywords if re.search(r"\b" + re.escape(kw) + r"\b", combined_text)]
            if matches:
                domain_scores[domain] = len(matches)
                
        # Sort domains by keyword match count
        sorted_domains = sorted(domain_scores.items(), key=lambda x: x[1], reverse=True)
        detected_domains = [d[0] for d in sorted_domains[:3]]
        
        if not detected_domains:
            detected_domains = ["Software Engineering & Architecture"]
            
        # Extract Prerequisite Technical Skills
        extracted_skills = []
        for skill_name, pattern in SKILL_PATTERNS.items():
            if re.search(pattern, combined_text, re.IGNORECASE):
                extracted_skills.append(skill_name)
                
        # Ensure at least some default core skills if input is very brief
        if not extracted_skills:
            extracted_skills = ["Python", "Software Engineering", "Agile / Scrum"]
            
        # Estimate Project Complexity (BAETE Criterion 4 Assessment)
        complexity_score = min(5, max(1, len(extracted_skills) // 2 + len(detected_domains)))
        complexity_label = "Standard" if complexity_score <= 2 else ("Complex Engineering" if complexity_score >= 4 else "Moderate")
        
        return {
            "primary_domain": detected_domains[0],
            "all_domains": detected_domains,
            "prerequisite_skills": extracted_skills,
            "complexity_level": complexity_score,
            "complexity_label": complexity_label,
            "token_count": len(combined_text.split())
        }
