import type {
  Expert, Student, Publication, OfficeHourSlot,
  AdvisoryProposal, AuditEntry, SystemHealth, ProjectWorkspace, Notification
} from '../types';

export const mockPublications: Publication[] = [
  {
    id: 'pub-1',
    title: 'TinyML-Based Real-Time ECG Anomaly Detection on ARM Cortex-M4 Microcontrollers',
    venue: 'IEEE Transactions on Biomedical Engineering',
    year: 2024,
    citations: 34,
    abstract: 'We demonstrate a convolutional neural network optimized for 8-bit integer inference achieving 94.2% sensitivity on the MIT-BIH arrhythmia dataset running at 48MHz with 92KB RAM.'
  },
  {
    id: 'pub-2',
    title: 'BLE Mesh Sensor Fusion for Low-Power Healthcare Monitoring Systems',
    venue: 'IEEE Internet of Things Journal',
    year: 2023,
    citations: 21,
    abstract: 'A BLE 5.0 mesh protocol with AES-128 transport security enabling multi-sensor fusion for ECG, SpO₂, and accelerometer streams at under 180μA average current.'
  },
  {
    id: 'pub-3',
    title: 'Federated Learning Privacy Preservation on Edge Healthcare Devices',
    venue: 'ACM MobiSys 2024',
    year: 2024,
    citations: 18,
    abstract: 'Differential privacy with ε=0.5 combined with MQTT-over-TLS for distributed model aggregation in hospital edge networks, achieving HIPAA-compliant federated training.'
  },
  {
    id: 'pub-4',
    title: 'Single-Cell RNA Sequencing Pipeline Optimization for Large-Scale Genomic Datasets',
    venue: 'Bioinformatics Journal',
    year: 2024,
    citations: 29,
    abstract: 'A scalable scRNA-seq pipeline using Apache Spark achieving 10x speedup on datasets with >100k cells, with automated quality control and dimensionality reduction.'
  },
  {
    id: 'pub-5',
    title: 'Graph Neural Networks for Drug-Target Interaction Prediction',
    venue: 'Nature Computational Science',
    year: 2023,
    citations: 67,
    abstract: 'GNN-based approach for predicting drug-target binding affinity using molecular graphs, outperforming DeepDTA by 12% on the Davis kinase dataset.'
  },
  {
    id: 'pub-6',
    title: 'CRISPR-Cas9 Off-Target Effect Prediction using Transformer Models',
    venue: 'Cell Systems',
    year: 2024,
    citations: 41,
    abstract: 'Fine-tuned BERT encoder achieves 97.3% specificity in predicting off-target edits from guide RNA sequences, reducing experimental validation cost by 60%.'
  },
  {
    id: 'pub-7',
    title: 'Neural Architecture Search for FPGA Edge Inference',
    venue: 'ICLR 2024',
    year: 2024,
    citations: 55,
    abstract: 'Automated NAS achieving Pareto-optimal accuracy/latency tradeoffs for resource-constrained inference engines on Xilinx Zynq platforms.'
  },
  {
    id: 'pub-8',
    title: 'Zero-Shot Domain Adaptation for Low-Resource Academic NLP',
    venue: 'EMNLP 2023',
    year: 2023,
    citations: 44,
    abstract: 'Cross-lingual zero-shot transfer for academic entity extraction using multilingual transformers, with 89.1% F1 on the SciERC benchmark without fine-tuning.'
  },
];

export const officeHoursTemplate: OfficeHourSlot[] = [
  { id: 'oh-1', day: 'Tuesday', startTime: '14:00', endTime: '14:30', isBooked: false },
  { id: 'oh-2', day: 'Tuesday', startTime: '14:30', endTime: '15:00', isBooked: true, bookedBy: 'Team Alpha' },
  { id: 'oh-3', day: 'Tuesday', startTime: '15:00', endTime: '15:30', isBooked: false },
  { id: 'oh-4', day: 'Tuesday', startTime: '15:30', endTime: '16:00', isBooked: false },
  { id: 'oh-5', day: 'Thursday', startTime: '10:00', endTime: '10:30', isBooked: false },
  { id: 'oh-6', day: 'Thursday', startTime: '10:30', endTime: '11:00', isBooked: true, bookedBy: 'Team Beta' },
  { id: 'oh-7', day: 'Thursday', startTime: '11:00', endTime: '11:30', isBooked: false },
  { id: 'oh-8', day: 'Sunday', startTime: '15:00', endTime: '15:30', isBooked: false },
  { id: 'oh-9', day: 'Sunday', startTime: '15:30', endTime: '16:00', isBooked: false },
];

export const mockExperts: Expert[] = [
  {
    id: 'exp-1',
    name: "Md. Shohel Arman",
    email: 'shohel.arman@diu.edu.bd',
    role: 'faculty',
    department: "Software Engineering",
    title: "Assistant Professor",
    tier: 1,
    slotsUsed: 2,
    slotsTotal: 5,
    quotaStatus: 'available',
    researchAreas: ["Embedded AI", "Edge Computing", "IoT Security", "TinyML", "BLE Networks"],
    skills: ["TinyML", "ARM Cortex-M4", "C/C++ Embedded", "BLE 5.0", "CNN", "AES-GCM", "MQTT", "FreeRTOS", "FPGA", "Python"],
    hIndex: 14,
    publications: [
      {
        id: 'pub-exp-1-0',
        title: "TinyML-Based Real-Time ECG Anomaly Detection on ARM Cortex-M4 Microcontrollers",
        venue: "IEEE Transactions on Biomedical Engineering",
        year: 2024,
        citations: 34,
        abstract: "We demonstrate a convolutional neural network optimized for 8-bit integer inference achieving 94.2% sensitivity on the MIT-BIH arrhythmia dataset running at 48MHz with 92KB RAM."
      },
      {
        id: 'pub-exp-1-1',
        title: "BLE Mesh Sensor Fusion for Low-Power Healthcare Monitoring Systems",
        venue: "IEEE Internet of Things Journal",
        year: 2023,
        citations: 21,
        abstract: "A BLE 5.0 mesh protocol with AES-128 transport security enabling multi-sensor fusion for ECG, SpO2, and accelerometer streams at under 180uA average current."
      },
      {
        id: 'pub-exp-1-2',
        title: "Federated Learning Privacy Preservation on Edge Healthcare Devices",
        venue: "ACM MobiSys",
        year: 2024,
        citations: 18,
        abstract: "Differential privacy combined with MQTT-over-TLS for distributed model aggregation in hospital edge networks, achieving HIPAA-compliant federated training."
      }
    ],
    rating: 4.9,
    officeHours: officeHoursTemplate,
    bio: "Md. Shohel Arman specializes in deploying deep neural networks on resource-constrained edge devices for healthcare applications. His research covers TinyML inference optimization, BLE mesh networking, and patient telemetry.",
    isIndustry: false
  },
  {
    id: 'exp-2',
    name: "Dr. Tanvir Ahmed",
    email: 'tanvir.ahmed@diu.edu.bd',
    role: 'faculty',
    department: "Bioinformatics",
    title: "Bioinformatics Researcher",
    tier: 2,
    slotsUsed: 1,
    slotsTotal: 4,
    quotaStatus: 'available',
    researchAreas: ["Bioinformatics", "Computational Biology", "Genomics", "Drug Discovery", "Single-Cell Analysis"],
    skills: ["scRNA-seq", "Genomic Annotation", "Bioinformatics Pipelines", "Python", "R", "Nextflow", "GNN", "CRISPR Analysis", "Drug-Target Interaction"],
    hIndex: 11,
    publications: [
      {
        id: 'pub-exp-2-0',
        title: "Single-Cell RNA Sequencing Pipeline Optimization for Large-Scale Genomic Datasets",
        venue: "Bioinformatics Journal",
        year: 2024,
        citations: 29,
        abstract: "A scalable scRNA-seq pipeline using Apache Spark achieving 10x speedup on datasets with over 100k cells, with automated quality control and dimensionality reduction."
      },
      {
        id: 'pub-exp-2-1',
        title: "Graph Neural Networks for Drug-Target Interaction Prediction",
        venue: "Nature Computational Science",
        year: 2023,
        citations: 67,
        abstract: "GNN-based approach for predicting drug-target binding affinity using molecular graphs, outperforming DeepDTA by 12% on the Davis kinase benchmark."
      },
      {
        id: 'pub-exp-2-2',
        title: "CRISPR-Cas9 Off-Target Effect Prediction using Transformer Models",
        venue: "Cell Systems",
        year: 2024,
        citations: 41,
        abstract: "Fine-tuned BERT encoder achieves 97.3% specificity in predicting off-target edits from guide RNA sequences, reducing experimental validation costs."
      }
    ],
    rating: 4.6,
    officeHours: officeHoursTemplate,
    bio: "Dr. Ahmed focuses on computational approaches to drug discovery, scRNA-seq pipeline optimization, and GNN-based molecular interaction prediction.",
    isIndustry: false
  },
  {
    id: 'exp-3',
    name: "Prof. Md. Rafiqul Islam",
    email: 'rafiqul.islam@diu.edu.bd',
    role: 'faculty',
    department: "Computer Science",
    title: "Professor",
    tier: 3,
    slotsUsed: 5,
    slotsTotal: 5,
    quotaStatus: 'full',
    researchAreas: ["Machine Learning", "Natural Language Processing", "Neural Architecture Search", "Transformers"],
    skills: ["PyTorch", "TensorFlow", "NLP", "Neural Architecture Search", "Zero-Shot Learning", "BERT", "Python", "CUDA", "Transformers"],
    hIndex: 18,
    publications: [
      {
        id: 'pub-exp-3-0',
        title: "Neural Architecture Search for Low-Power Edge Device NLP Transformers",
        venue: "ICLR",
        year: 2024,
        citations: 55,
        abstract: "Differentiable architecture search reduces parameter counts by 42% while retaining 98% accuracy on GLUE benchmarks."
      },
      {
        id: 'pub-exp-3-1',
        title: "Zero-Shot Cross-Lingual Transfer for Low-Resource Sentiment Analysis",
        venue: "ACL",
        year: 2023,
        citations: 88,
        abstract: "Novel multi-task adaptation objective enables zero-shot classification across 12 South Asian languages with minimal fine-tuning."
      }
    ],
    rating: 4.8,
    officeHours: officeHoursTemplate,
    bio: "Prof. Islam is a leading ML researcher with expertise in neural architecture search and zero-shot transfer learning. Currently at full supervisory quota for Fall 2026.",
    isIndustry: false
  },
  {
    id: 'exp-4',
    name: "Engr. Sakib Al Hasan",
    email: 'sakib@techbridge.io',
    role: 'mentor',
    department: "Industry",
    title: "Principal Cloud Architect",
    tier: 1,
    slotsUsed: 1,
    slotsTotal: 3,
    quotaStatus: 'available',
    researchAreas: ["Cloud Computing", "DevOps", "Microservices", "Kubernetes", "Infrastructure as Code", "CI/CD"],
    skills: ["AWS", "GCP", "Kubernetes", "Docker", "Terraform", "CI/CD", "Microservices", "Go", "Python", "Prometheus", "Helm", "Ansible"],
    hIndex: 6,
    publications: [
      {
        id: 'pub-exp-4-0',
        title: "Architecting Zero-Downtime Multi-Region Kubernetes Failover on AWS",
        venue: "IEEE Cloud",
        year: 2023,
        citations: 14,
        abstract: "Demonstrates automated cross-region pod evacuation using Cilium mesh and Terraform state locks under simulated region partition."
      },
      {
        id: 'pub-exp-4-1',
        title: "GitOps-Driven Infrastructure as Code Security Scanning in Enterprise CI/CD",
        venue: "ACM Computing Surveys",
        year: 2024,
        citations: 9,
        abstract: "Policy-as-code enforcement using Open Policy Agent in GitLab CI pipelines, mitigating 94% of misconfigured cloud assets before merge."
      }
    ],
    rating: 4.6,
    officeHours: officeHoursTemplate,
    bio: "Principal Cloud Architect at TechBridge Ltd. with 12+ years building enterprise-scale distributed systems. Specializes in Kubernetes orchestration, GitOps, and cloud resilience.",
    isIndustry: true
  },
  {
    id: 'exp-5',
    name: "Dr. Imran Mahmud",
    email: 'imran.swe@diu.edu.bd',
    role: 'faculty',
    department: "Software Engineering",
    title: "Associate Professor",
    tier: 1,
    slotsUsed: 3,
    slotsTotal: 5,
    quotaStatus: 'nearing',
    researchAreas: ["Software Engineering", "Agile Methods", "Requirements Engineering", "Microservices Architecture"],
    skills: ["UML", "SysML", "Agile", "SCRUM", "Requirements Engineering", "Java", "Spring Boot", "Microservices", "Design Patterns"],
    hIndex: 8,
    publications: [
      {
        id: 'pub-exp-5-0',
        title: "Automated Traceability Matrix Generation in Agile Software Sprints via LLMs",
        venue: "ACM SIGSOFT FSE",
        year: 2024,
        citations: 19,
        abstract: "Leverages fine-tuned LLMs to link user stories to Git commit diffs with 89% precision, ensuring audit-compliant traceability."
      },
      {
        id: 'pub-exp-5-1',
        title: "Refactoring Monolithic Enterprise Systems into Event-Driven Microservices",
        venue: "IEEE Software",
        year: 2023,
        citations: 27,
        abstract: "A step-by-step domain-driven design methodology evaluated on 5 production banking platforms in Bangladesh."
      }
    ],
    rating: 4.8,
    officeHours: officeHoursTemplate,
    bio: "Dr. Imran Mahmud researches empirical software engineering, agile requirements traceability, and decomposition strategies for migrating monoliths to microservices.",
    isIndustry: false
  },
  {
    id: 'exp-6',
    name: "Engr. Naila Hossain",
    email: 'naila.hossain@cybersec.io',
    role: 'mentor',
    department: "Cybersecurity",
    title: "Lead Blockchain Security Engineer",
    tier: 2,
    slotsUsed: 0,
    slotsTotal: 3,
    quotaStatus: 'available',
    researchAreas: ["Cybersecurity", "Blockchain", "Smart Contracts", "Cryptography", "Zero-Knowledge Proofs"],
    skills: ["Solidity", "Ethereum", "Cryptography", "Smart Contracts", "Zero-Knowledge Proofs", "Merkle Trees", "Rust", "Hardhat", "Web3.js"],
    hIndex: 7,
    publications: [
      {
        id: 'pub-exp-6-0',
        title: "Formal Verification of Reentrancy and Flash Loan Vulnerabilities in Solidity Contracts",
        venue: "IEEE S&P Workshops",
        year: 2024,
        citations: 31,
        abstract: "Combines symbolic execution with SMT solvers to prove absence of reentrancy bugs in DeFi automated market maker pools."
      },
      {
        id: 'pub-exp-6-1',
        title: "Zero-Knowledge Succinct Non-Interactive Proofs for Healthcare Data Verification",
        venue: "Cryptology ePrint",
        year: 2023,
        citations: 24,
        abstract: "A zk-SNARK scheme allowing patients to verify immunization records without disclosing personally identifiable medical history."
      }
    ],
    rating: 4.7,
    officeHours: officeHoursTemplate,
    bio: "Lead Security Auditor specializing in EVM smart contract vulnerabilities, zk-SNARK rollup protocols, and cryptographic verification of decentralized identities.",
    isIndustry: true
  },
  {
    id: 'exp-7',
    name: "Dr. Mahfuzur Rahman",
    email: 'mahfuzur.cs@diu.edu.bd',
    role: 'faculty',
    department: "Computer Science",
    title: "Professor",
    tier: 1,
    slotsUsed: 3,
    slotsTotal: 5,
    quotaStatus: 'available',
    researchAreas: ["Computer Vision", "Medical Image Analysis", "Semantic Segmentation", "Object Detection", "YOLO"],
    skills: ["Computer Vision", "YOLOv9", "PyTorch", "OpenCV", "Semantic Segmentation", "Medical Imaging", "MRI Analysis", "ResNet", "Vision Transformers"],
    hIndex: 22,
    publications: [
      {
        id: 'pub-exp-7-0',
        title: "Self-Supervised Vision Transformers for Brain Tumor Segmentation on Multi-Modal MRI",
        venue: "IEEE TMI",
        year: 2024,
        citations: 78,
        abstract: "Achieves 91.4% Dice score on the BraTS2023 challenge using cross-attention masking across T1, T2, and FLAIR modalities."
      },
      {
        id: 'pub-exp-7-1',
        title: "Real-Time Polyp Detection in Colonoscopy Videos via Lightweight YOLO Architectures",
        venue: "MICCAI",
        year: 2023,
        citations: 49,
        abstract: "Attains 60 FPS inference on Jetson AGX Xavier while maintaining 95.8% recall on minute gastrointestinal lesions."
      }
    ],
    rating: 4.7,
    officeHours: officeHoursTemplate,
    bio: "Dr. Rahman is an authority on medical computer vision, with over 15 years developing deep learning algorithms for radiological tumor segmentation, ultrasound diagnostic AI, and automated surgical tool tracking.",
    isIndustry: false
  },
  {
    id: 'exp-8',
    name: "Dr. Nusrat Jahan",
    email: 'nusrat.ds@diu.edu.bd',
    role: 'faculty',
    department: "Data Science",
    title: "Associate Professor",
    tier: 2,
    slotsUsed: 2,
    slotsTotal: 4,
    quotaStatus: 'available',
    researchAreas: ["Big Data Engineering", "Distributed Analytics", "Stream Processing", "Apache Spark", "Kafka"],
    skills: ["Apache Spark", "Kafka", "Hadoop", "PySpark", "Distributed Systems", "Data Warehousing", "Scala", "ClickHouse", "Apache Flink"],
    hIndex: 13,
    publications: [
      {
        id: 'pub-exp-8-0',
        title: "Fault-Tolerant Complex Event Processing over Disordered IoT Streams using Apache Flink",
        venue: "ACM DEBS",
        year: 2023,
        citations: 23,
        abstract: "Proposes a speculative event buffering algorithm that reduces stream latency by 35% in high-frequency smart grid networks."
      },
      {
        id: 'pub-exp-8-1',
        title: "Benchmarking Distributed Columnar Storage Engines for Petabyte Telemetry Datasets",
        venue: "IEEE BigData",
        year: 2024,
        citations: 17,
        abstract: "Evaluates ClickHouse, Apache Iceberg, and Delta Lake across diverse analytical query profiles under concurrent loads."
      }
    ],
    rating: 4.8,
    officeHours: officeHoursTemplate,
    bio: "Dr. Jahan leads the Big Data Systems lab. Her research centers on high-throughput event streaming architectures, real-time sensor stream anomaly detection, and distributed query optimization.",
    isIndustry: false
  },
  {
    id: 'exp-9',
    name: "Engr. Kazi Tariqul Islam",
    email: 'tariqul.islam@fintechlabs.sg',
    role: 'mentor',
    department: "Industry",
    title: "VP of Quantitative Engineering",
    tier: 1,
    slotsUsed: 1,
    slotsTotal: 3,
    quotaStatus: 'available',
    researchAreas: ["FinTech", "Algorithmic Trading", "Fraud Detection", "Quantitative Finance", "Graph Neural Networks"],
    skills: ["Python", "C++", "Quantitative Analysis", "Algorithmic Trading", "Fraud Detection", "Graph Neural Networks", "Pandas", "Time Series", "Risk Modeling"],
    hIndex: 9,
    publications: [
      {
        id: 'pub-exp-9-0',
        title: "Temporal Graph Neural Networks for Real-Time Anti-Money Laundering in SWIFT Networks",
        venue: "ACM KDD",
        year: 2024,
        citations: 42,
        abstract: "Detects synthetic identity cycles and high-velocity mule accounts with a false alarm rate under 0.05% across 2M daily transactions."
      },
      {
        id: 'pub-exp-9-1',
        title: "Reinforcement Learning for Execution Algorithmic Slippage Reduction",
        venue: "Journal of Financial Data Science",
        year: 2023,
        citations: 19,
        abstract: "Deep Q-learning agent minimizes market impact during institutional block trades across simulated order books."
      }
    ],
    rating: 4.9,
    officeHours: officeHoursTemplate,
    bio: "VP of Quantitative Engineering at FinTechLabs Singapore. Experienced in ultra-low-latency market microstructure modeling, credit risk graph algorithms, and anti-money laundering analytics.",
    isIndustry: true
  },
  {
    id: 'exp-10',
    name: "Dr. Anisur Rahman",
    email: 'anisur.nlp@diu.edu.bd',
    role: 'faculty',
    department: "Computer Science",
    title: "Associate Professor",
    tier: 2,
    slotsUsed: 3,
    slotsTotal: 4,
    quotaStatus: 'nearing',
    researchAreas: ["Natural Language Processing", "Large Language Models", "RAG", "Prompt Engineering", "Bengali NLP"],
    skills: ["LLM", "RAG", "LangChain", "LlamaIndex", "Vector Databases", "ChromaDB", "Fine-Tuning", "LoRA", "HuggingFace", "Python"],
    hIndex: 16,
    publications: [
      {
        id: 'pub-exp-10-0',
        title: "Dense Passage Retrieval Calibration for Low-Resource Bengali RAG Systems",
        venue: "EMNLP",
        year: 2024,
        citations: 38,
        abstract: "Improves factual precision of open-domain QA by 24% using hybrid BM25 and ColBERT dense vector re-ranking."
      },
      {
        id: 'pub-exp-10-1',
        title: "Detecting Hallucinations in LLM Legal Summarization via Attribution Graphs",
        venue: "COLING",
        year: 2024,
        citations: 25,
        abstract: "Constructs citation dependency graphs to audit court case summaries generated by LLaMA-3 models."
      }
    ],
    rating: 4.6,
    officeHours: officeHoursTemplate,
    bio: "Dr. Rahman investigates retrieval-augmented generation (RAG) architectures, hallucination detection, parameter-efficient fine-tuning (LoRA), and multilingual Bengali language representation.",
    isIndustry: false
  },
  {
    id: 'exp-11',
    name: "Dr. Sabrina Karim",
    email: 'sabrina.hci@diu.edu.bd',
    role: 'faculty',
    department: "Software Engineering",
    title: "Assistant Professor",
    tier: 2,
    slotsUsed: 2,
    slotsTotal: 4,
    quotaStatus: 'available',
    researchAreas: ["Human-Computer Interaction", "Digital Accessibility", "UX Engineering", "Assistive Technologies"],
    skills: ["HCI", "UX Research", "Accessibility", "WCAG 2.2", "Usability Testing", "Eye Tracking", "Figma", "React", "Prototyping"],
    hIndex: 10,
    publications: [
      {
        id: 'pub-exp-11-0',
        title: "Automated WCAG 2.2 Accessibility Auditing via Multi-Modal Vision-Language Agents",
        venue: "ACM CHI",
        year: 2024,
        citations: 16,
        abstract: "Evaluates screen reader compatibility and visual contrast across 5,000 public portals, identifying 92% of non-compliant DOM trees."
      },
      {
        id: 'pub-exp-11-1',
        title: "Haptic Feedback Navigation for Visually Impaired Commuters in Urban Transit",
        venue: "ACM ASSETS",
        year: 2023,
        citations: 14,
        abstract: "Wearable belt interface providing tactile spatial guidance achieves 94% destination arrival accuracy in dense metro stations."
      }
    ],
    rating: 4.5,
    officeHours: officeHoursTemplate,
    bio: "Dr. Karim researches assistive interfaces for visually impaired users, multimodal mobile interactions, and automated WCAG 2.2 accessibility verification tools for web applications.",
    isIndustry: false
  },
  {
    id: 'exp-12',
    name: "Prof. Dr. Syed Akhter Hossain",
    email: 'akhter.cs@diu.edu.bd',
    role: 'faculty',
    department: "Computer Science",
    title: "Dean & Professor",
    tier: 1,
    slotsUsed: 4,
    slotsTotal: 5,
    quotaStatus: 'nearing',
    researchAreas: ["Speech Recognition", "Acoustic Modeling", "Digital Signal Processing", "AI in Education"],
    skills: ["Speech Recognition", "Whisper", "Kaldi", "PyTorch", "Acoustic Modeling", "Signal Processing", "Bengali ASR", "NLP"],
    hIndex: 28,
    publications: [
      {
        id: 'pub-exp-12-0',
        title: "End-to-End Conformer-Based Automatic Speech Recognition for Accented Bengali Dialects",
        venue: "IEEE Access",
        year: 2023,
        citations: 84,
        abstract: "Trained on 10,000 hours of multi-dialect audio, achieving word error rates below 8.2% across 6 regional divisions."
      },
      {
        id: 'pub-exp-12-1',
        title: "Voice Biomarkers for Early Detection of Parkinsonian Dysarthria",
        venue: "Interspeech",
        year: 2024,
        citations: 39,
        abstract: "Acoustic feature analysis of sustained phonation and read speech detects subtle motor speech degradations with 91% accuracy."
      }
    ],
    rating: 4.8,
    officeHours: officeHoursTemplate,
    bio: "Prof. Hossain is a distinguished academic leader with over two decades of seminal research in Bengali automated speech recognition, acoustic phonetics, and AI-enabled educational governance.",
    isIndustry: false
  },
  {
    id: 'exp-13',
    name: "Dr. Mohammad Shamim Kaiser",
    email: 'shamim.robotics@diu.edu.bd',
    role: 'faculty',
    department: "Robotics & Automation",
    title: "Associate Professor",
    tier: 1,
    slotsUsed: 2,
    slotsTotal: 4,
    quotaStatus: 'available',
    researchAreas: ["Autonomous Mobile Robots", "SLAM", "ROS2", "LiDAR Perception", "Path Planning"],
    skills: ["ROS2", "SLAM", "LiDAR", "C++", "Python", "Path Planning", "A*", "MoveIt", "Gazebo", "Kalman Filter", "Robot Kinematics"],
    hIndex: 17,
    publications: [
      {
        id: 'pub-exp-13-0',
        title: "Robust Visual-Inertial LiDAR SLAM in GPS-Denied Agricultural Canopies",
        venue: "IEEE Robotics and Automation Letters",
        year: 2024,
        citations: 33,
        abstract: "Fuses LiDAR odometry with dual IMU readings to maintain localization drift under 0.8% over a 5km autonomous tractor trajectory."
      },
      {
        id: 'pub-exp-13-1',
        title: "Dynamic Obstacle Avoidance for Warehouse AGVs using Deep Reinforcement Learning",
        venue: "IEEE IROS",
        year: 2023,
        citations: 28,
        abstract: "Trained in Gazebo with domain randomization, achieving collision-free transit across 10,000 simulated warehouse hours."
      }
    ],
    rating: 4.7,
    officeHours: officeHoursTemplate,
    bio: "Dr. Kaiser conducts research in autonomous mobile robotics, 3D LiDAR point cloud processing, visual-inertial odometry, and navigation algorithms for unstructured agricultural and disaster environments.",
    isIndustry: false
  },
  {
    id: 'exp-14',
    name: "Engr. Fahim Shahriar",
    email: 'fahim.shahriar@meta.com',
    role: 'mentor',
    department: "Industry",
    title: "Staff Software Engineer",
    tier: 1,
    slotsUsed: 1,
    slotsTotal: 3,
    quotaStatus: 'available',
    researchAreas: ["Full-Stack Distributed Systems", "High-Concurrency Web Architecture", "GraphQL", "Next.js"],
    skills: ["TypeScript", "React", "Next.js", "Node.js", "GraphQL", "Redis", "PostgreSQL", "Distributed Caching", "System Design", "Microfrontends"],
    hIndex: 5,
    publications: [
      {
        id: 'pub-exp-14-0',
        title: "Sub-Millisecond GraphQL Schema Federation Across 100+ Microservices",
        venue: "ACM Queue",
        year: 2023,
        citations: 12,
        abstract: "Details query planning heuristics and query batching optimizations reducing gateway CPU overhead by 40%."
      }
    ],
    rating: 4.5,
    officeHours: officeHoursTemplate,
    bio: "Staff Software Engineer with 10+ years architecting web applications serving millions of queries per second. Expert in edge caching, server-driven UI, and relational database scaling.",
    isIndustry: true
  },
  {
    id: 'exp-15',
    name: "Dr. Sadia Sultana",
    email: 'sadia.sec@diu.edu.bd',
    role: 'faculty',
    department: "Cybersecurity",
    title: "Assistant Professor",
    tier: 2,
    slotsUsed: 2,
    slotsTotal: 4,
    quotaStatus: 'available',
    researchAreas: ["Network Intrusion Detection", "Malware Analysis", "Zero Trust Architecture", "Adversarial ML"],
    skills: ["Network Security", "Wireshark", "Snort", "Suricata", "Malware Analysis", "Ghidra", "Python", "Machine Learning", "SIEM", "Splunk"],
    hIndex: 12,
    publications: [
      {
        id: 'pub-exp-15-0',
        title: "Adversarial Robustness Evaluation of Machine Learning-Based Network Intrusion Detection",
        venue: "IEEE Transactions on Information Forensics and Security",
        year: 2024,
        citations: 36,
        abstract: "Demonstrates feature space perturbation attacks against Random Forest and LSTM detectors, proposing adversarial training defenses."
      },
      {
        id: 'pub-exp-15-1',
        title: "Automated Ransomware Early Detection via Behavioral API Call Graph Embeddings",
        venue: "Computers & Security",
        year: 2023,
        citations: 29,
        abstract: "Monitors Windows kernel API sequences in a sandbox, identifying ransomware encryption activity within 400ms of execution."
      }
    ],
    rating: 4.7,
    officeHours: officeHoursTemplate,
    bio: "Dr. Sultana investigates deep learning techniques for detecting evasive polymorphic malware, industrial control system anomalies, and adversarial robustness in network intrusion detectors.",
    isIndustry: false
  },
  {
    id: 'exp-16',
    name: "Dr. Imran Mahmud",
    email: 'imran.it@diu.edu.bd',
    role: 'faculty',
    department: "Information Technology",
    title: "Associate Professor",
    tier: 2,
    slotsUsed: 1,
    slotsTotal: 4,
    quotaStatus: 'available',
    researchAreas: ["IT Governance", "Cloud Migration Strategy", "Technology Adoption Models", "Enterprise Systems"],
    skills: ["IT Strategy", "Cloud Migration", "Enterprise Architecture", "TOGAF", "COBIT", "Change Management", "Data Privacy", "GDPR"],
    hIndex: 15,
    publications: [
      {
        id: 'pub-exp-16-0',
        title: "Determinants of Multi-Cloud Adoption in Financial Institutions: A Hybrid SEM-ANN Approach",
        venue: "Journal of Systems and Information Technology",
        year: 2023,
        citations: 22,
        abstract: "Analyzes regulatory compliance, vendor lock-in risk, and latency factors across 80 banking enterprises in South Asia."
      }
    ],
    rating: 4.5,
    officeHours: officeHoursTemplate,
    bio: "Dr. Mahmud explores structural equation modeling of technology adoption, enterprise resource planning (ERP) success factors, and organizational cybersecurity posture in developing economies.",
    isIndustry: false
  },
  {
    id: 'exp-17',
    name: "Dr. Rashedul Hasan",
    email: 'rashedul.qc@diu.edu.bd',
    role: 'faculty',
    department: "Computer Science",
    title: "Assistant Professor",
    tier: 1,
    slotsUsed: 1,
    slotsTotal: 3,
    quotaStatus: 'available',
    researchAreas: ["Quantum Computing", "Quantum Algorithms", "Quantum Machine Learning", "Qiskit"],
    skills: ["Quantum Computing", "Qiskit", "Python", "Quantum Circuits", "VQE", "QAOA", "Linear Algebra", "Quantum Cryptography"],
    hIndex: 9,
    publications: [
      {
        id: 'pub-exp-17-0',
        title: "Variational Quantum Algorithms for Molecular Ground State Energy Estimation on IBM Quantum Hardware",
        venue: "Quantum Science and Technology",
        year: 2024,
        citations: 18,
        abstract: "Mitigates readout and gate errors using zero-noise extrapolation, calculating LiH molecule bond energy within 1.2 mHa chemical accuracy."
      }
    ],
    rating: 4.9,
    officeHours: officeHoursTemplate,
    bio: "Dr. Hasan focuses on NISQ-era quantum computing, variational quantum eigensolvers (VQE), and hybrid quantum-classical algorithms for combinatorial optimization problems.",
    isIndustry: false
  },
  {
    id: 'exp-18',
    name: "Engr. Zeeshan Haque",
    email: 'zeeshan.h@grab.com',
    role: 'mentor',
    department: "Industry",
    title: "Lead Mobile Architect",
    tier: 2,
    slotsUsed: 0,
    slotsTotal: 3,
    quotaStatus: 'available',
    researchAreas: ["Mobile App Architecture", "Cross-Platform Development", "Flutter", "Swift", "Offline-First Sync"],
    skills: ["Flutter", "Dart", "Swift", "iOS", "Android", "Kotlin", "SQLite", "Offline Sync", "Mobile Security", "CI/CD Mobile"],
    hIndex: 4,
    publications: [
      {
        id: 'pub-exp-18-0',
        title: "Conflict-Free Replicated Data Types (CRDTs) for Low-Bandwidth Mobile Sync",
        venue: "IEEE Mobile Cloud",
        year: 2023,
        citations: 11,
        abstract: "Evaluates delta-state CRDTs over intermittent 2G cellular networks, achieving zero-data-loss synchronization for gig-economy drivers."
      }
    ],
    rating: 4.9,
    officeHours: officeHoursTemplate,
    bio: "Lead Mobile Architect at Grab with deep expertise in offline-first database synchronization, battery optimization, and modular cross-platform Flutter architecture.",
    isIndustry: true
  },
  {
    id: 'exp-19',
    name: "Dr. Tasnim Fatima",
    email: 'tasnim.bio@diu.edu.bd',
    role: 'faculty',
    department: "Bioinformatics",
    title: "Assistant Professor",
    tier: 2,
    slotsUsed: 1,
    slotsTotal: 4,
    quotaStatus: 'available',
    researchAreas: ["Metagenomics", "Environmental Microbiome", "Phylogenetic Analysis", "Antimicrobial Resistance"],
    skills: ["Metagenomics", "QIIME2", "Kraken2", "R", "Python", "BLAST", "Phylogenetic Trees", "Sequence Assembly", "Microbiome"],
    hIndex: 8,
    publications: [
      {
        id: 'pub-exp-19-0',
        title: "Metagenomic Profiling of Antimicrobial Resistance Genes in Urban Hospital Wastewater",
        venue: "Frontiers in Microbiology",
        year: 2024,
        citations: 21,
        abstract: "Assembles resistome profiles identifying 48 novel beta-lactamase gene variants using short and long-read hybrid sequencing."
      }
    ],
    rating: 4.8,
    officeHours: officeHoursTemplate,
    bio: "Dr. Fatima specializes in computational metagenomics, tracking antimicrobial resistance genes in hospital wastewater, and high-throughput taxonomic profiling using QIIME2.",
    isIndustry: false
  },
  {
    id: 'exp-20',
    name: "Dr. Asif Iqbal",
    email: 'asif.swe@diu.edu.bd',
    role: 'faculty',
    department: "Software Engineering",
    title: "Associate Professor",
    tier: 1,
    slotsUsed: 3,
    slotsTotal: 5,
    quotaStatus: 'available',
    researchAreas: ["Automated Software Testing", "Fault Localization", "Concurrency Bug Detection", "Symbolic Execution"],
    skills: ["Software Testing", "JUnit", "Selenium", "Mutation Testing", "Symbolic Execution", "Static Analysis", "Java", "C++", "Git"],
    hIndex: 14,
    publications: [
      {
        id: 'pub-exp-20-0',
        title: "Automated Unit Test Suite Generation for Java Microservices via Search-Based Testing",
        venue: "IEEE Transactions on Software Engineering",
        year: 2023,
        citations: 45,
        abstract: "Integrates genetic algorithms with dynamic symbolic execution, achieving 88% branch coverage on real-world Spring Boot APIs."
      }
    ],
    rating: 4.9,
    officeHours: officeHoursTemplate,
    bio: "Dr. Iqbal researches automated unit test generation, mutation testing benchmarks, and static analyzers that pinpoint race conditions and deadlocks in multi-threaded software.",
    isIndustry: false
  },
  {
    id: 'exp-21',
    name: "Dr. Nazmul Huda",
    email: 'nazmul.vlsi@diu.edu.bd',
    role: 'faculty',
    department: "Computer Science",
    title: "Associate Professor",
    tier: 1,
    slotsUsed: 2,
    slotsTotal: 4,
    quotaStatus: 'available',
    researchAreas: ["VLSI Design", "FPGA Synthesis", "Hardware Accelerators", "RISC-V Architecture"],
    skills: ["Verilog", "VHDL", "FPGA", "RISC-V", "Vivado", "Hardware Accelerators", "Digital Logic", "ASIC Design", "C++"],
    hIndex: 13,
    publications: [
      {
        id: 'pub-exp-21-0',
        title: "FPGA-Accelerated Integer-Quantized CNN Inference for High-Throughput Satellite Imaging",
        venue: "IEEE Transactions on VLSI Systems",
        year: 2024,
        citations: 28,
        abstract: "Custom pipelined systolic array on Xilinx Zynq UltraScale+ achieves 1.2 TOPS/W efficiency with 12ms latency per frame."
      }
    ],
    rating: 4.8,
    officeHours: officeHoursTemplate,
    bio: "Dr. Huda designs custom hardware accelerators on Xilinx and Intel FPGAs for convolutional neural networks, RISC-V custom instruction extensions, and low-power digital signal coprocessors.",
    isIndustry: false
  },
  {
    id: 'exp-22',
    name: "Engr. Mahmudur Rahman",
    email: 'mahmudur.data@uber.com',
    role: 'mentor',
    department: "Industry",
    title: "Senior Data Platform Engineer",
    tier: 1,
    slotsUsed: 1,
    slotsTotal: 3,
    quotaStatus: 'available',
    researchAreas: ["Data Platform Engineering", "Modern Data Stack", "dbt", "Snowflake", "Airflow", "Data Quality"],
    skills: ["Snowflake", "dbt", "Apache Airflow", "Python", "SQL", "Data Modeling", "Star Schema", "BigQuery", "Kafka", "Great Expectations"],
    hIndex: 6,
    publications: [
      {
        id: 'pub-exp-22-0',
        title: "Eliminating Data Downtime in Lakehouse Architectures via Automated Contract Testing",
        venue: "VLDB Industry Track",
        year: 2023,
        citations: 15,
        abstract: "Demonstrates schema contract enforcement at data ingestion points, catching 98% of upstream breaking schema changes."
      }
    ],
    rating: 4.6,
    officeHours: officeHoursTemplate,
    bio: "Senior Data Platform Engineer at Uber. Specializes in designing petabyte-scale lakehouse architectures, automated data testing, and zero-maintenance ELT workflows.",
    isIndustry: true
  },
  {
    id: 'exp-23',
    name: "Dr. Sharmin Akter",
    email: 'sharmin.ds@diu.edu.bd',
    role: 'faculty',
    department: "Data Science",
    title: "Assistant Professor",
    tier: 2,
    slotsUsed: 2,
    slotsTotal: 4,
    quotaStatus: 'available',
    researchAreas: ["Recommender Systems", "Graph Neural Networks", "E-Commerce Analytics", "Collaborative Filtering"],
    skills: ["Recommender Systems", "PyTorch Geometric", "GNN", "Matrix Factorization", "Python", "Scikit-Learn", "LightGBM", "Pandas"],
    hIndex: 11,
    publications: [
      {
        id: 'pub-exp-23-0',
        title: "Multi-Behavior Graph Convolutional Networks for Session-Based Recommendation in E-Commerce",
        venue: "ACM RecSys",
        year: 2024,
        citations: 32,
        abstract: "Models view, cart-add, and purchase interactions as heterogeneous edge types, lifting hit rate @10 by 14% over baseline SASRec."
      }
    ],
    rating: 4.6,
    officeHours: officeHoursTemplate,
    bio: "Dr. Akter investigates session-based recommender systems, user churn prediction models, and graph representation learning for discovering cross-category purchasing affinities.",
    isIndustry: false
  },
  {
    id: 'exp-24',
    name: "Dr. Kamrul Hasan",
    email: 'kamrul.ai@diu.edu.bd',
    role: 'faculty',
    department: "Computer Science",
    title: "Professor",
    tier: 1,
    slotsUsed: 4,
    slotsTotal: 5,
    quotaStatus: 'nearing',
    researchAreas: ["Reinforcement Learning", "Multi-Agent Systems", "Game Theory", "Autonomous Decision Making"],
    skills: ["Reinforcement Learning", "PPO", "DDPG", "Multi-Agent RL", "PyTorch", "OpenAI Gym", "Game Theory", "Python", "Simulation"],
    hIndex: 21,
    publications: [
      {
        id: 'pub-exp-24-0',
        title: "Multi-Agent Proximal Policy Optimization for Adaptive Urban Traffic Grid Control",
        venue: "IEEE Transactions on Intelligent Transportation Systems",
        year: 2023,
        citations: 52,
        abstract: "Coordinated decentralized RL agents reduce average vehicle wait times by 28% compared to actuated traffic controllers."
      }
    ],
    rating: 4.6,
    officeHours: officeHoursTemplate,
    bio: "Dr. Hasan specializes in deep reinforcement learning for traffic signal coordination, multi-agent cooperation, and automated portfolio balancing in volatile simulated environments.",
    isIndustry: false
  },
  {
    id: 'exp-25',
    name: "Dr. Salma Khatun",
    email: 'salma.pharm@diu.edu.bd',
    role: 'faculty',
    department: "Pharmacy",
    title: "Associate Professor",
    tier: 2,
    slotsUsed: 1,
    slotsTotal: 4,
    quotaStatus: 'available',
    researchAreas: ["Cheminformatics", "Molecular Docking", "QSAR Modeling", "Computer-Aided Drug Design (CADD)"],
    skills: ["AutoDock Vina", "PyMOL", "QSAR", "Cheminformatics", "RDKit", "Python", "Molecular Dynamics", "GROMACS", "Lead Optimization"],
    hIndex: 12,
    publications: [
      {
        id: 'pub-exp-25-0',
        title: "In Silico Identification of Dual EGFR/HER2 Inhibitors from South Asian Medicinal Flora",
        venue: "Journal of Biomolecular Structure and Dynamics",
        year: 2024,
        citations: 27,
        abstract: "High-throughput virtual screening of 1,200 phytochemicals reveals three lead chalcone derivatives with sub-nanomolar binding affinities."
      }
    ],
    rating: 4.7,
    officeHours: officeHoursTemplate,
    bio: "Dr. Khatun combines computational chemistry and pharmacoinformatics to screen natural compound libraries against oncological kinases and viral proteases.",
    isIndustry: false
  },
  {
    id: 'exp-26',
    name: "Engr. Arefin Shuvo",
    email: 'arefin.sre@shopify.com',
    role: 'mentor',
    department: "Industry",
    title: "Principal SRE & Chaos Engineer",
    tier: 1,
    slotsUsed: 1,
    slotsTotal: 3,
    quotaStatus: 'available',
    researchAreas: ["Site Reliability Engineering", "Chaos Engineering", "Distributed Tracing", "Incident Automation"],
    skills: ["Prometheus", "Grafana", "OpenTelemetry", "Chaos Mesh", "Kubernetes", "Go", "Linux Internals", "eBPF", "Incident Management"],
    hIndex: 5,
    publications: [
      {
        id: 'pub-exp-26-0',
        title: "Continuous Resilience Verification via Autonomous Chaos Engineering in Production",
        venue: "USENIX SREcon",
        year: 2023,
        citations: 14,
        abstract: "Injects network latencies and pod termination events to validate circuit-breaker failovers without impacting customer SLAs."
      }
    ],
    rating: 4.5,
    officeHours: officeHoursTemplate,
    bio: "Principal SRE with 11+ years leading global resilience drills, eBPF-based kernel observability, and zero-touch incident remediation for Black Friday traffic spikes.",
    isIndustry: true
  },
  {
    id: 'exp-27',
    name: "Dr. Tariq Adnan",
    email: 'tariq.swe@diu.edu.bd',
    role: 'faculty',
    department: "Software Engineering",
    title: "Associate Professor",
    tier: 1,
    slotsUsed: 3,
    slotsTotal: 4,
    quotaStatus: 'available',
    researchAreas: ["Microservices Resiliency", "Service Mesh", "Domain-Driven Design", "Cloud-Native Architecture"],
    skills: ["Istio", "Envoy", "Service Mesh", "Docker", "Kubernetes", "Domain-Driven Design", "Java", "Spring Cloud", "Distributed Systems"],
    hIndex: 13,
    publications: [
      {
        id: 'pub-exp-27-0',
        title: "Service Mesh-Based Adaptive Traffic Throttling for Mitigating Microservices Cascading Failures",
        venue: "IEEE Cloud Computing",
        year: 2024,
        citations: 23,
        abstract: "An adaptive token-bucket rate limiter implemented in Envoy proxy prevents cascading brownouts during downstream database outages."
      }
    ],
    rating: 4.8,
    officeHours: officeHoursTemplate,
    bio: "Dr. Adnan researches microservices traffic management, automated mutual TLS enforcement, circuit breaker tuning, and bounded context modeling in healthcare informatics.",
    isIndustry: false
  },
  {
    id: 'exp-28',
    name: "Dr. Faria Tabassum",
    email: 'faria.xai@diu.edu.bd',
    role: 'faculty',
    department: "Computer Science",
    title: "Assistant Professor",
    tier: 2,
    slotsUsed: 1,
    slotsTotal: 4,
    quotaStatus: 'available',
    researchAreas: ["Explainable AI (XAI)", "Algorithmic Fairness", "Model Interpretability", "SHAP", "LIME"],
    skills: ["XAI", "SHAP", "LIME", "Integrated Gradients", "Fairness", "Bias Mitigation", "Python", "PyTorch", "Scikit-Learn"],
    hIndex: 10,
    publications: [
      {
        id: 'pub-exp-28-0',
        title: "Evaluating the Fidelity of Post-Hoc Local Explanation Methods in Tabular Healthcare Predictors",
        venue: "ACM FAccT",
        year: 2024,
        citations: 34,
        abstract: "Demonstrates that KernelSHAP explanations can be manipulated by adversarial perturbation, proposing a robust counterfactual auditing protocol."
      }
    ],
    rating: 4.5,
    officeHours: officeHoursTemplate,
    bio: "Dr. Tabassum focuses on model interpretability, feature attribution fidelity in black-box credit scoring models, and bias auditing frameworks for clinical diagnostic algorithms.",
    isIndustry: false
  },
  {
    id: 'exp-29',
    name: "Engr. Mehedi Hasan",
    email: 'mehedi.xr@epicgames.com',
    role: 'mentor',
    department: "Industry",
    title: "Lead XR & Graphics Engineer",
    tier: 2,
    slotsUsed: 0,
    slotsTotal: 3,
    quotaStatus: 'available',
    researchAreas: ["Virtual Reality", "Augmented Reality", "Real-Time Graphics", "Unity", "Unreal Engine 5", "WebXR"],
    skills: ["Unity", "Unreal Engine", "C#", "C++", "WebXR", "Shader Programming", "HLSL", "Spatial Audio", "3D Mathematics", "Blender"],
    hIndex: 4,
    publications: [
      {
        id: 'pub-exp-29-0',
        title: "Real-Time Volumetric Video Streaming for Collaborative Surgical VR Simulation",
        venue: "IEEE VR",
        year: 2023,
        citations: 16,
        abstract: "Custom point cloud compression pipeline delivers 90 FPS stereoscopic playback over standard 5G connections."
      }
    ],
    rating: 4.9,
    officeHours: officeHoursTemplate,
    bio: "Lead Graphics Engineer with 8+ years developing immersive VR medical training simulations, real-time HLSL shaders, and WebXR architectural walkthroughs.",
    isIndustry: true
  },
  {
    id: 'exp-30',
    name: "Dr. Zahidul Islam",
    email: 'zahid.crypto@diu.edu.bd',
    role: 'faculty',
    department: "Cybersecurity",
    title: "Professor",
    tier: 1,
    slotsUsed: 3,
    slotsTotal: 5,
    quotaStatus: 'available',
    researchAreas: ["Post-Quantum Cryptography", "Lattice-Based Cryptography", "Homomorphic Encryption", "Key Exchange"],
    skills: ["Cryptography", "Post-Quantum", "Kyber", "Dilithium", "Lattice Cryptography", "Homomorphic Encryption", "C", "Python", "OpenSSL"],
    hIndex: 20,
    publications: [
      {
        id: 'pub-exp-30-0',
        title: "Constant-Time Implementation of CRYSTALS-Kyber on ARM Cortex-M4 Microcontrollers",
        venue: "CHES",
        year: 2024,
        citations: 41,
        abstract: "Hardened against first-order power side-channel analysis with under 8% clock cycle performance overhead."
      }
    ],
    rating: 4.5,
    officeHours: officeHoursTemplate,
    bio: "Dr. Islam researches NIST-standardized post-quantum key encapsulation mechanisms (CRYSTALS-Kyber), lattice-based signature schemes, and privacy-preserving homomorphic computation.",
    isIndustry: false
  },
  {
    id: 'exp-31',
    name: "Dr. Farzana Yasmin",
    email: 'farzana.iot@diu.edu.bd',
    role: 'faculty',
    department: "Data Science",
    title: "Associate Professor",
    tier: 2,
    slotsUsed: 2,
    slotsTotal: 4,
    quotaStatus: 'available',
    researchAreas: ["Time Series Forecasting", "Predictive Maintenance", "Industrial Telemetry", "Sensor Fusion"],
    skills: ["Time Series", "LSTM", "Prophet", "Transformers", "Predictive Maintenance", "Python", "Scikit-Learn", "InfluxDB", "Signal Processing"],
    hIndex: 12,
    publications: [
      {
        id: 'pub-exp-31-0',
        title: "Remaining Useful Life Estimation of Industrial Turbines via Temporal Convolutional Networks",
        venue: "IEEE Transactions on Industrial Informatics",
        year: 2023,
        citations: 37,
        abstract: "Achieves state-of-the-art prognostic accuracy on the NASA C-MAPSS dataset, cutting unplanned maintenance downtime by 22%."
      }
    ],
    rating: 4.7,
    officeHours: officeHoursTemplate,
    bio: "Dr. Yasmin applies temporal deep learning models to predict mechanical equipment failure in industrial turbines, power transformers, and manufacturing conveyor assemblies.",
    isIndustry: false
  },
  {
    id: 'exp-32',
    name: "Dr. Golam Mostafa",
    email: 'mostafa.drones@diu.edu.bd',
    role: 'faculty',
    department: "Robotics & Automation",
    title: "Assistant Professor",
    tier: 2,
    slotsUsed: 1,
    slotsTotal: 3,
    quotaStatus: 'available',
    researchAreas: ["UAV Autonomy", "Drone Navigation", "Aerial Object Tracking", "Edge Vision for Drones"],
    skills: ["PX4", "ArduPilot", "Drone Navigation", "OpenCV", "Computer Vision", "ROS", "Python", "C++", "Embedded Systems"],
    hIndex: 9,
    publications: [
      {
        id: 'pub-exp-32-0',
        title: "Autonomous Precision Landing of Quadrotors on Moving Marine Vessels via AprilTag Tracking",
        venue: "Journal of Field Robotics",
        year: 2024,
        citations: 25,
        abstract: "Kalman-filtered visual pose estimation achieves centimeter-level touchdown accuracy in sea state 3 wave turbulence."
      }
    ],
    rating: 4.9,
    officeHours: officeHoursTemplate,
    bio: "Dr. Mostafa researches vision-based autonomous drone landing on moving maritime vessels, GPS-denied cave exploration, and low-latency aerial crop disease mapping.",
    isIndustry: false
  },
  {
    id: 'exp-33',
    name: "Engr. Rezwanul Huq",
    email: 'rezwan.automotive@bosch.com',
    role: 'mentor',
    department: "Industry",
    title: "Staff Automotive Firmware Architect",
    tier: 1,
    slotsUsed: 0,
    slotsTotal: 3,
    quotaStatus: 'available',
    researchAreas: ["Automotive Systems", "Embedded Linux", "Yocto", "CAN-Bus Networks", "Functional Safety ISO 26262"],
    skills: ["Embedded Linux", "C", "C++", "Yocto", "CAN-Bus", "AUTOSAR", "ISO 26262", "QNX", "Device Drivers", "Microcontrollers"],
    hIndex: 6,
    publications: [
      {
        id: 'pub-exp-33-0',
        title: "Intrusion Detection for Automotive CAN-FD Networks using Payload Entropy Fingerprinting",
        venue: "IEEE Transactions on Vehicular Technology",
        year: 2023,
        citations: 29,
        abstract: "Blocks spoofed brake and steering message injection with zero false positives under heavy bus loads."
      }
    ],
    rating: 4.6,
    officeHours: officeHoursTemplate,
    bio: "Staff Automotive Firmware Architect with 13+ years designing ASIL-D compliant electronic control units (ECUs), gateway controllers, and secure in-vehicle CAN-FD networks.",
    isIndustry: true
  },
  {
    id: 'exp-34',
    name: "Dr. Tania Sultana",
    email: 'tania.swe@diu.edu.bd',
    role: 'faculty',
    department: "Software Engineering",
    title: "Associate Professor",
    tier: 2,
    slotsUsed: 2,
    slotsTotal: 4,
    quotaStatus: 'available',
    researchAreas: ["Empirical Software Engineering", "Technical Debt", "Automated Code Refactoring", "Mining Software Repositories"],
    skills: ["Mining Software Repositories", "Git", "Python", "SonarQube", "Code Smells", "Technical Debt", "Software Metrics", "Java"],
    hIndex: 11,
    publications: [
      {
        id: 'pub-exp-34-0',
        title: "Quantifying the Financial Impact of Architectural Technical Debt across 200 Enterprise Projects",
        venue: "ACM Transactions on Software Engineering and Methodology",
        year: 2024,
        citations: 19,
        abstract: "Correlates architectural code smells with maintenance ticket resolution delays, demonstrating a 3.4x cost multiplier."
      }
    ],
    rating: 4.6,
    officeHours: officeHoursTemplate,
    bio: "Dr. Sultana mines open-source GitHub ecosystems to uncover developer productivity trends, architectural decay patterns, and cost-benefit trade-offs of refactoring technical debt.",
    isIndustry: false
  },
  {
    id: 'exp-35',
    name: "Dr. Mominul Haque",
    email: 'mominul.edge@diu.edu.bd',
    role: 'faculty',
    department: "Computer Science",
    title: "Assistant Professor",
    tier: 1,
    slotsUsed: 2,
    slotsTotal: 4,
    quotaStatus: 'available',
    researchAreas: ["Deep Learning Optimization", "TensorRT", "Neural Network Pruning", "Quantization-Aware Training"],
    skills: ["TensorRT", "ONNX", "Quantization", "Pruning", "PyTorch", "CUDA", "Edge AI", "Jetson Nano", "Model Compression"],
    hIndex: 12,
    publications: [
      {
        id: 'pub-exp-35-0',
        title: "Structured Channel Pruning and 4-Bit Weight Quantization for Real-Time Edge Vision",
        venue: "IEEE CVPR Workshops",
        year: 2024,
        citations: 38,
        abstract: "Compresses ResNet-50 and MobileNetV3 models by 76% with less than 0.7% top-1 accuracy degradation."
      }
    ],
    rating: 4.7,
    officeHours: officeHoursTemplate,
    bio: "Dr. Haque specializes in post-training quantization (PTQ), structural channel pruning, and ONNX runtime optimizations that enable 10x faster edge AI inference on NVIDIA Jetson hardware.",
    isIndustry: false
  },
  {
    id: 'exp-36',
    name: "Dr. Shahriar Hossain",
    email: 'shahriar.its@diu.edu.bd',
    role: 'faculty',
    department: "Information Technology",
    title: "Assistant Professor",
    tier: 2,
    slotsUsed: 1,
    slotsTotal: 3,
    quotaStatus: 'available',
    researchAreas: ["Smart Cities", "Intelligent Transportation Systems", "V2X Communication", "Urban Mobility"],
    skills: ["SUMO Simulation", "V2X", "DSRC", "Python", "GIS", "Traffic Modeling", "Cellular V2X", "Data Analytics"],
    hIndex: 10,
    publications: [
      {
        id: 'pub-exp-36-0',
        title: "Emergency Vehicle Preemption Protocols over Cellular V2X in Dense Urban Corridors",
        venue: "IEEE Transactions on Intelligent Vehicles",
        year: 2024,
        citations: 21,
        abstract: "Demonstrates 42% travel time reduction for ambulances during peak congestion hours in Dhaka city simulations."
      }
    ],
    rating: 4.5,
    officeHours: officeHoursTemplate,
    bio: "Dr. Hossain models connected vehicle traffic simulations (SUMO), emergency vehicle green wave priority protocols, and infrastructure-to-vehicle (I2V) safety advisory broadcasts.",
    isIndustry: false
  },
  {
    id: 'exp-37',
    name: "Engr. Nazia Parveen",
    email: 'nazia.design@atlassian.com',
    role: 'mentor',
    department: "Industry",
    title: "Lead Design Systems Engineer",
    tier: 2,
    slotsUsed: 0,
    slotsTotal: 3,
    quotaStatus: 'available',
    researchAreas: ["Design Systems", "Frontend Architecture", "Design Tokens", "Microfrontends", "Performance"],
    skills: ["Design Systems", "Figma", "CSS Architecture", "Storybook", "React", "Web Components", "Accessibility", "Tailwind CSS"],
    hIndex: 3,
    publications: [
      {
        id: 'pub-exp-37-0',
        title: "Automating Multi-Brand Design Token Distribution across Web and Native Mobile",
        venue: "Design Systems Review",
        year: 2023,
        citations: 8,
        abstract: "Establishes automated CI/CD pipelines translating Figma token variables into Tailwind, CSS custom properties, and Swift styling."
      }
    ],
    rating: 4.8,
    officeHours: officeHoursTemplate,
    bio: "Lead Design Systems Engineer at Atlassian. Expert in multi-brand design tokens, accessible component registries, and web performance optimization for enterprise collaboration suites.",
    isIndustry: true
  },
  {
    id: 'exp-38',
    name: "Dr. Ashraful Alam",
    email: 'ashraf.audio@diu.edu.bd',
    role: 'faculty',
    department: "Computer Science",
    title: "Associate Professor",
    tier: 1,
    slotsUsed: 2,
    slotsTotal: 4,
    quotaStatus: 'available',
    researchAreas: ["Audio Processing", "Sound Event Detection", "Audio Deepfake Detection", "Speech Synthesis"],
    skills: ["Audio Processing", "Librosa", "PyTorch", "Sound Event Detection", "Deepfake Audio", "Mel-Spectrogram", "Voiceprint", "Python"],
    hIndex: 15,
    publications: [
      {
        id: 'pub-exp-38-0',
        title: "Detecting Diffusion-Generated Deepfake Voices via Bispectral Phase Coherence Analysis",
        venue: "IEEE/ACM Transactions on Audio, Speech, and Language Processing",
        year: 2024,
        citations: 35,
        abstract: "Uncovers phase incoherence artifacts in diffusion audio vocoders, yielding 96.7% detection accuracy on the ASVspoof5 benchmark."
      }
    ],
    rating: 4.5,
    officeHours: officeHoursTemplate,
    bio: "Dr. Alam works on acoustic deep learning, synthetic voice anti-spoofing, urban environmental sound classification, and neural vocoder audio reconstruction.",
    isIndustry: false
  },
  {
    id: 'exp-39',
    name: "Dr. Rumana Chowdhury",
    email: 'rumana.struct@diu.edu.bd',
    role: 'faculty',
    department: "Bioinformatics",
    title: "Assistant Professor",
    tier: 1,
    slotsUsed: 1,
    slotsTotal: 4,
    quotaStatus: 'available',
    researchAreas: ["Protein Structure Prediction", "AlphaFold Analysis", "Molecular Dynamics", "Cryo-EM Modeling"],
    skills: ["AlphaFold", "PyMOL", "Molecular Dynamics", "GROMACS", "ChimeraX", "Protein Design", "Structural Biology", "Python"],
    hIndex: 10,
    publications: [
      {
        id: 'pub-exp-39-0',
        title: "Conformational Flexibility Analysis of Oncogenic KRAS G12D Mutants via Microsecond Molecular Dynamics",
        venue: "Structure",
        year: 2024,
        citations: 26,
        abstract: "Identifies transient allosteric binding pockets suitable for small molecule inhibition in pancreatic ductal adenocarcinoma."
      }
    ],
    rating: 4.5,
    officeHours: officeHoursTemplate,
    bio: "Dr. Chowdhury studies 3D protein conformation dynamics, structural impact of missense mutations, and computational de novo enzyme design using AlphaFold and ESMFold models.",
    isIndustry: false
  },
  {
    id: 'exp-40',
    name: "Engr. Saiful Islam",
    email: 'saiful.sec@paloaltonetworks.com',
    role: 'mentor',
    department: "Industry",
    title: "Principal Cloud Security Architect",
    tier: 1,
    slotsUsed: 1,
    slotsTotal: 3,
    quotaStatus: 'available',
    researchAreas: ["Cloud Security Posture Management", "DevSecOps", "Container Security", "AWS IAM Hardening"],
    skills: ["AWS Security", "CSPM", "Kubernetes Security", "Falco", "Trivy", "IAM", "DevSecOps", "Terraform", "CIS Benchmarks"],
    hIndex: 7,
    publications: [
      {
        id: 'pub-exp-40-0',
        title: "Automated Remediation of Toxic Cloud IAM Privilege Escalation Paths",
        venue: "IEEE Cloud Security Summit",
        year: 2023,
        citations: 17,
        abstract: "Employs graph reachability algorithms to identify and sever cross-account permission escalation chains in AWS organizations."
      }
    ],
    rating: 4.7,
    officeHours: officeHoursTemplate,
    bio: "Principal Cloud Security Architect with 12+ years hardening multi-tenant cloud environments, automated runtime container threat defense with Falco, and least-privilege IAM auditing.",
    isIndustry: true
  },
  {
    id: 'exp-41',
    name: "Dr. Nahid Sultana",
    email: 'nahid.sna@diu.edu.bd',
    role: 'faculty',
    department: "Data Science",
    title: "Associate Professor",
    tier: 2,
    slotsUsed: 2,
    slotsTotal: 4,
    quotaStatus: 'available',
    researchAreas: ["Social Network Analysis", "Disinformation Tracking", "Community Detection", "Graph Mining"],
    skills: ["NetworkX", "Gephi", "Social Network Analysis", "Graph Mining", "Python", "Scikit-Learn", "NLP", "Twitter/X API"],
    hIndex: 13,
    publications: [
      {
        id: 'pub-exp-41-0',
        title: "Tracking Coordinated Inauthentic Behavior During National Elections via Temporal Graph Embeddings",
        venue: "ACM Web Conference (WWW)",
        year: 2024,
        citations: 39,
        abstract: "Clusters synchronized bot activity patterns with 93% precision, identifying narrative amplification networks across 10M posts."
      }
    ],
    rating: 4.8,
    officeHours: officeHoursTemplate,
    bio: "Dr. Sultana studies the diffusion of synthetic rumors on social networks, coordinated inauthentic behavior detection, and scalable community detection in dynamic bipartite graphs.",
    isIndustry: false
  },
  {
    id: 'exp-42',
    name: "Dr. Biplob Kumar",
    email: 'biplob.devops@diu.edu.bd',
    role: 'faculty',
    department: "Software Engineering",
    title: "Assistant Professor",
    tier: 2,
    slotsUsed: 1,
    slotsTotal: 4,
    quotaStatus: 'available',
    researchAreas: ["Continuous Deployment", "Infrastructure as Code", "GitOps Reliability", "Chaos Automation"],
    skills: ["GitOps", "ArgoCD", "Terraform", "Kubernetes", "Jenkins", "Docker", "CI/CD", "Python", "Shell Scripting", "Ansible"],
    hIndex: 9,
    publications: [
      {
        id: 'pub-exp-42-0',
        title: "Automated Canary Deployment Risk Scoring in GitOps Environments via Real-Time Telemetry",
        venue: "IEEE Access",
        year: 2024,
        citations: 14,
        abstract: "Fuses error budgets, HTTP error rates, and p99 latency metrics into a Bayesian risk classifier for automated rollbacks."
      }
    ],
    rating: 4.9,
    officeHours: officeHoursTemplate,
    bio: "Dr. Kumar focuses on formal verification of infrastructure-as-code manifests, drift detection in GitOps pipelines, and automated canary deployment rollback strategies.",
    isIndustry: false
  },
  {
    id: 'exp-43',
    name: "Dr. Shamima Nasrin",
    email: 'shamima.gan@diu.edu.bd',
    role: 'faculty',
    department: "Computer Science",
    title: "Associate Professor",
    tier: 1,
    slotsUsed: 3,
    slotsTotal: 4,
    quotaStatus: 'available',
    researchAreas: ["Generative AI", "Diffusion Models", "GANs", "Image-to-Image Translation", "Synthetic Data"],
    skills: ["Diffusion Models", "Stable Diffusion", "GANs", "PyTorch", "CUDA", "Computer Vision", "Synthetic Data", "LoRA"],
    hIndex: 16,
    publications: [
      {
        id: 'pub-exp-43-0',
        title: "Conditional Latent Diffusion for Synthetic Dermatological Lesion Synthesis with Demographic Balance",
        venue: "IEEE Transactions on Medical Imaging",
        year: 2024,
        citations: 47,
        abstract: "Synthesizes Fitzpatrick skin phototype balanced dermoscopy images, improving skin cancer classifier equity across diverse populations."
      }
    ],
    rating: 4.6,
    officeHours: officeHoursTemplate,
    bio: "Dr. Nasrin researches latent diffusion models, controlled medical synthetic dataset generation, and conditional GANs for restoring degraded historical manuscripts.",
    isIndustry: false
  },
  {
    id: 'exp-44',
    name: "Engr. Touhidur Rahman",
    email: 'touhid.hft@citadel.com',
    role: 'mentor',
    department: "Industry",
    title: "Senior Low-Latency C++ Systems Engineer",
    tier: 1,
    slotsUsed: 0,
    slotsTotal: 3,
    quotaStatus: 'available',
    researchAreas: ["High-Frequency Trading Architecture", "Kernel Bypass Networking", "Low-Latency C++", "Memory Alignment"],
    skills: ["C++20", "DPDK", "Solarflare OpenOnload", "Low-Latency", "Lock-Free Data Structures", "Linux Kernel", "Performance Tuning", "Assembly"],
    hIndex: 5,
    publications: [
      {
        id: 'pub-exp-44-0',
        title: "Sub-Microsecond Order Book Matching via Cache-Oblivious B-Trees on Modern x86 CPUs",
        venue: "ACM Computing Frontiers",
        year: 2023,
        citations: 18,
        abstract: "Achieves 420ns p99 execution latency on tick-by-tick financial market feeds using DPDK kernel bypass."
      }
    ],
    rating: 4.5,
    officeHours: officeHoursTemplate,
    bio: "Senior Systems Engineer with 10+ years optimizing sub-microsecond algorithmic order matching engines, lock-free ring buffers, and cache-line aligned memory layouts.",
    isIndustry: true
  },
  {
    id: 'exp-45',
    name: "Dr. Moniruzzaman",
    email: 'monir.iot@diu.edu.bd',
    role: 'faculty',
    department: "Computer Science",
    title: "Associate Professor",
    tier: 1,
    slotsUsed: 2,
    slotsTotal: 5,
    quotaStatus: 'available',
    researchAreas: ["Wireless Sensor Networks", "LoRaWAN", "5G Network Slicing", "Smart Agriculture"],
    skills: ["LoRaWAN", "Zigbee", "Wireless Networks", "5G Slicing", "NS-3 Simulation", "IoT", "Arduino", "Python", "Embedded C"],
    hIndex: 15,
    publications: [
      {
        id: 'pub-exp-45-0',
        title: "Long-Range Low-Power Soil Salinity Monitoring across Coastal Delta Zones using LoRaWAN",
        venue: "IEEE Internet of Things Journal",
        year: 2024,
        citations: 31,
        abstract: "Deploys a solar-harvesting 40-node mesh network across 15km of coastal terrain with 99.4% packet delivery ratio over 18 months."
      }
    ],
    rating: 4.5,
    officeHours: officeHoursTemplate,
    bio: "Dr. Moniruzzaman specializes in long-range low-power sensor networks (LoRaWAN), energy-harvesting agricultural nodes, and dynamic QoS slice allocation in private 5G campus networks.",
    isIndustry: false
  },
  {
    id: 'exp-46',
    name: "Dr. Jannatul Ferdous",
    email: 'jannat.swe@diu.edu.bd',
    role: 'faculty',
    department: "Software Engineering",
    title: "Assistant Professor",
    tier: 2,
    slotsUsed: 1,
    slotsTotal: 4,
    quotaStatus: 'available',
    researchAreas: ["Software Product Line Engineering", "Component Reuse", "Architecture Evaluation", "Design Patterns"],
    skills: ["Software Architecture", "Feature Modeling", "Design Patterns", "UML", "Java", "Software Quality", "Clean Code"],
    hIndex: 8,
    publications: [
      {
        id: 'pub-exp-46-0',
        title: "Automated Feature Interaction Detection in Software Product Lines via SAT Solvers",
        venue: "SPLC",
        year: 2023,
        citations: 15,
        abstract: "Identifies conflicting functional requirements across 500 product configurations in an industrial automotive product line."
      }
    ],
    rating: 4.8,
    officeHours: officeHoursTemplate,
    bio: "Dr. Ferdous investigates variability modeling in software product lines, automated feature interaction verification, and architectural fitness functions in continuous delivery.",
    isIndustry: false
  },
  {
    id: 'exp-47',
    name: "Dr. Arifur Rahman",
    email: 'arif.cps@diu.edu.bd',
    role: 'faculty',
    department: "Computer Science",
    title: "Associate Professor",
    tier: 1,
    slotsUsed: 3,
    slotsTotal: 4,
    quotaStatus: 'available',
    researchAreas: ["Cyber-Physical Systems", "Industrial IoT", "SCADA Security", "Critical Infrastructure Defense"],
    skills: ["SCADA", "Modbus", "Industrial IoT", "Cyber-Physical Systems", "PLC Programming", "Network Security", "Python"],
    hIndex: 14,
    publications: [
      {
        id: 'pub-exp-47-0',
        title: "Physics-Informed Deep Learning for Detecting Stealthy False Data Injection in Water Distribution SCADA",
        venue: "IEEE Transactions on Control Systems Technology",
        year: 2024,
        citations: 29,
        abstract: "Fuses hydraulic flow conservation laws with LSTM predictors, catching 99.1% of actuator manipulation attacks."
      }
    ],
    rating: 4.9,
    officeHours: officeHoursTemplate,
    bio: "Dr. Rahman investigates attack injection methodologies on Modbus/TCP industrial control systems, water treatment testbeds, and physics-based anomaly detection algorithms.",
    isIndustry: false
  },
  {
    id: 'exp-48',
    name: "Engr. Shahadat Hossain",
    email: 'shahadat.db@cockroachlabs.com',
    role: 'mentor',
    department: "Industry",
    title: "Principal Distributed Database Engineer",
    tier: 1,
    slotsUsed: 0,
    slotsTotal: 3,
    quotaStatus: 'available',
    researchAreas: ["Distributed Databases", "NewSQL", "Raft Consensus", "Query Optimization", "PostgreSQL"],
    skills: ["PostgreSQL", "Distributed SQL", "Raft", "Go", "C++", "Query Planner", "LSM Trees", "RocksDB", "Sharding"],
    hIndex: 6,
    publications: [
      {
        id: 'pub-exp-48-0',
        title: "Serializable Multi-Region Transactions with Sub-10ms Cross-Continental Commit Latency",
        venue: "VLDB",
        year: 2023,
        citations: 24,
        abstract: "Novel pipelined two-phase consensus protocol minimizing WAN roundtrips across geo-distributed NewSQL clusters."
      }
    ],
    rating: 4.6,
    officeHours: officeHoursTemplate,
    bio: "Principal Distributed Database Engineer with 12+ years optimizing distributed transactions, multi-Raft range rebalancing, and cost-based query execution engines.",
    isIndustry: true
  },
  {
    id: 'exp-49',
    name: "Dr. Dilruba Parvin",
    email: 'dilruba.cancer@diu.edu.bd',
    role: 'faculty',
    department: "Bioinformatics",
    title: "Associate Professor",
    tier: 1,
    slotsUsed: 2,
    slotsTotal: 4,
    quotaStatus: 'available',
    researchAreas: ["Cancer Genomics", "Biomarker Discovery", "Variant Effect Prediction", "Survival Analysis"],
    skills: ["Cancer Genomics", "TCGA Analysis", "Survival Analysis", "R", "Bioconductor", "VEP", "Python", "Machine Learning"],
    hIndex: 13,
    publications: [
      {
        id: 'pub-exp-49-0',
        title: "Multi-Omics Prognostic Biomarker Discovery in Triple-Negative Breast Cancer via Deep Cox Models",
        venue: "Bioinformatics",
        year: 2024,
        citations: 33,
        abstract: "Integrates copy number alterations, DNA methylation, and RNA-seq to stratify high-risk patient survival with 86% concordance."
      }
    ],
    rating: 4.8,
    officeHours: officeHoursTemplate,
    bio: "Dr. Parvin analyzes multi-omics data from The Cancer Genome Atlas (TCGA) to discover prognostic gene expression signatures and predict patient response to immunotherapy.",
    isIndustry: false
  },
  {
    id: 'exp-50',
    name: "Prof. Dr. Touhid Bhuiyan",
    email: 'touhid.cyber@diu.edu.bd',
    role: 'faculty',
    department: "Cybersecurity",
    title: "Head & Professor of Cyber Security",
    tier: 1,
    slotsUsed: 4,
    slotsTotal: 5,
    quotaStatus: 'nearing',
    researchAreas: ["Cyber Threat Intelligence", "Cyber Warfare", "Trust Management", "OSINT Security Analytics"],
    skills: ["Threat Intelligence", "MITRE ATT&CK", "OSINT", "Cyber Defense", "Python", "STIX/TAXII", "Network Forensics", "Security Policy"],
    hIndex: 24,
    publications: [
      {
        id: 'pub-exp-50-0',
        title: "Automated Cyber Threat Intelligence Graph Construction from Dark Web Forums via LLMs",
        venue: "IEEE Transactions on Dependable and Secure Computing",
        year: 2024,
        citations: 58,
        abstract: "Extracts attack tactics and Indicators of Compromise (IoCs) mapped to the MITRE ATT&CK matrix with 91.5% precision."
      },
      {
        id: 'pub-exp-50-1',
        title: "A Computational Trust Model for Multi-Agent E-Commerce Security",
        venue: "ACM Computing Surveys",
        year: 2023,
        citations: 92,
        abstract: "Bayesian network formulation mitigating collusion and ballot-stuffing attacks in decentralized peer evaluation systems."
      }
    ],
    rating: 4.9,
    officeHours: officeHoursTemplate,
    bio: "Prof. Bhuiyan is the Head of Cyber Security at DIU, with extensive international research in automated cyber threat intelligence sharing, social engineering defense, and critical national infrastructure protection.",
    isIndustry: false
  }
];

export const mockStudents: Student[] = [
  {
    id: 'stu-1',
    name: 'Abu Zafor',
    email: 'abu.zafor@diu.edu.bd',
    role: 'student',
    department: 'Software Engineering',
    studentId: '232-35-331',
    batch: 41,
    section: 'A',
    degree: 'B.Sc. in Software Engineering',
    skills: ['Python', 'React', 'C/C++', 'BLE', 'MQTT', 'Machine Learning Basics'],
    github: 'zafor2002',
    linkedin: 'abu-zafor',
    profileCompletion: 78,
    avatar: undefined,
  },
  {
    id: 'stu-2',
    name: 'Anamul Haque',
    email: 'anamul.haque@diu.edu.bd',
    role: 'student',
    department: 'Software Engineering',
    studentId: '232-35-285',
    batch: 41,
    section: 'A',
    degree: 'B.Sc. in Software Engineering',
    skills: ['Python', 'React', 'SQL', 'Docker', 'Java'],
    github: 'anamul-dev',
    linkedin: 'anamul-haque',
    profileCompletion: 65,
    avatar: undefined,
  },
];

export const mockProposals: AdvisoryProposal[] = [
  {
    id: 'prop-1',
    studentId: 'stu-1',
    expertId: 'exp-1',
    projectTitle: 'EdgeShield: BLE-Based ECG Monitoring with TinyML Anomaly Detection',
    synopsis: 'We propose EdgeShield — a resource-constrained ECG monitoring system deploying CNN-based arrhythmia detection on ARM Cortex-M4 microcontrollers. Data is transmitted via BLE 5.0 with AES-GCM encryption and published to a healthcare cloud via MQTT-over-TLS. The system targets HIPAA compliance under 3mW average power budget.',
    milestones: [
      { id: 'm1', title: 'Hardware prototype & BLE stack setup', dueDate: '2026-10-30', description: 'nRF52840 DK + ECG sensor integration' },
      { id: 'm2', title: 'TinyML model training & quantization', dueDate: '2026-11-20', description: 'CNN on PTB-XL dataset, 8-bit INT quantization, CMSIS-NN deployment' },
      { id: 'm3', title: 'AES-GCM security layer & MQTT integration', dueDate: '2026-12-05', description: 'mbedTLS AES-128-GCM + MQTT broker setup' },
      { id: 'm4', title: 'End-to-end testing & final defense', dueDate: '2026-12-20', description: 'System integration test + performance benchmarking' },
    ],
    weeklyCommitment: 12,
    meetingFrequency: 'Weekly (every Tuesday)',
    motivation: 'Dr. Rahman\'s TinyML-on-Cortex-M4 research directly aligns with our hardware target. Her BLE mesh security expertise is critical for our MQTT transport layer.',
    scope: 'primary',
    state: 'negotiation',
    aiAlignmentScore: 94,
    createdAt: '2026-11-01T08:30:00Z',
    updatedAt: '2026-11-08T14:22:00Z',
    timeline: [
      { id: 'ev-1', state: 'draft', timestamp: '2026-11-01T08:30:00Z', actor: 'Abu Zafor', note: 'Proposal created' },
      { id: 'ev-2', state: 'submitted', timestamp: '2026-11-01T10:00:00Z', actor: 'Abu Zafor', note: 'Proposal submitted' },
      { id: 'ev-3', state: 'under_review', timestamp: '2026-11-03T09:15:00Z', actor: 'Md. Shohel Arman', note: 'Proposal opened for review' },
      { id: 'ev-4', state: 'negotiation', timestamp: '2026-11-08T14:22:00Z', actor: 'Md. Shohel Arman', note: 'Scope needs to benchmark TinyML on ARM Cortex-M4 hardware with CMSIS-NN vs TensorFlow Lite comparison. Please add a hardware benchmarking milestone.' },
    ],
    negotiationNote: 'Scope needs to benchmark TinyML on ARM Cortex-M4 hardware with CMSIS-NN vs TensorFlow Lite comparison. Please add a hardware benchmarking milestone.',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'fsm_transition',
    title: 'Proposal Under Negotiation',
    message: 'Md. Shohel Arman has requested scope clarification on your EdgeShield proposal.',
    timestamp: '2026-11-08T14:22:00Z',
    read: false,
    link: '/student/requests',
  },
  {
    id: 'notif-2',
    type: 'consultation',
    title: 'Consultation Confirmed',
    message: 'Your Tuesday 14:00 slot with Dr. Rahman is confirmed.',
    timestamp: '2026-11-07T11:00:00Z',
    read: true,
    link: '/student/scheduler',
  },
  {
    id: 'notif-3',
    type: 'quota_change',
    title: 'Quota Update',
    message: 'Prof. Rafiqul Islam has reached full supervisory quota (5/5).',
    timestamp: '2026-11-06T09:30:00Z',
    read: true,
  },
];

export const mockAuditEntries: AuditEntry[] = [
  {
    id: 'audit-1',
    timestamp: '2026-11-08T14:22:11Z',
    userId: 'exp-1',
    userRole: 'faculty',
    ip: '10.0.1.42',
    eventType: 'FSM_STATE_TRANSITION',
    payload: { proposalId: 'prop-1', from: 'under_review', to: 'negotiation', reason: 'Scope clarification required' },
    hash: 'a7f3b2c1d9e4f5a6b7c8d9e0f1a2b3c4',
    previousHash: 'f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6',
    valid: true,
  },
  {
    id: 'audit-2',
    timestamp: '2026-11-03T09:15:33Z',
    userId: 'exp-1',
    userRole: 'faculty',
    ip: '10.0.1.42',
    eventType: 'FSM_STATE_TRANSITION',
    payload: { proposalId: 'prop-1', from: 'submitted', to: 'under_review' },
    hash: 'f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6',
    previousHash: 'c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9',
    valid: true,
  },
  {
    id: 'audit-3',
    timestamp: '2026-11-01T10:00:05Z',
    userId: 'stu-1',
    userRole: 'student',
    ip: '192.168.1.105',
    eventType: 'FSM_STATE_TRANSITION',
    payload: { proposalId: 'prop-1', from: 'draft', to: 'submitted' },
    hash: 'c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9',
    previousHash: 'b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8',
    valid: true,
  },
  {
    id: 'audit-4',
    timestamp: '2026-11-01T08:30:21Z',
    userId: 'stu-1',
    userRole: 'student',
    ip: '192.168.1.105',
    eventType: 'PROPOSAL_CREATED',
    payload: { proposalId: 'prop-1', expertId: 'exp-1' },
    hash: 'b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8',
    previousHash: '0000000000000000000000000000000000',
    valid: true,
  },
  {
    id: 'audit-5',
    timestamp: '2026-10-30T16:44:01Z',
    userId: 'coord-1',
    userRole: 'coordinator',
    ip: '10.0.0.5',
    eventType: 'FACULTY_TIER_UPDATED',
    payload: { facultyId: 'exp-5', from: null, to: 1, justification: 'Reviewed 18 publications on Scholar, h-index 7 confirmed' },
    hash: 'e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4',
    previousHash: 'b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8',
    valid: true,
  },
];

export const mockSystemHealth: SystemHealth = {
  uptime: 99.5,
  qdrantLatency: 38,
  queueDepth: 7,
  lastBackup: '2026-11-11T03:00:00Z',
  nlpFallbackEvents: 2,
  vectorSearchOnline: true,
};

export const mockWorkspace: ProjectWorkspace = {
  id: 'ws-1',
  projectTitle: 'EdgeShield: BLE-Based ECG Monitoring with TinyML Anomaly Detection',
  studentIds: ['stu-1', 'stu-2'],
  advisorId: 'exp-1',
  stage: 'active_supervision',
  milestones: [
    { id: 'm1', title: 'Hardware prototype & BLE stack setup', dueDate: '2026-10-30', description: 'nRF52840 DK + ECG sensor integration' },
    { id: 'm2', title: 'TinyML model training & quantization', dueDate: '2026-11-20', description: 'CNN on PTB-XL dataset, 8-bit INT quantization, CMSIS-NN deployment' },
    { id: 'm3', title: 'AES-GCM security layer & MQTT integration', dueDate: '2026-12-05', description: 'mbedTLS AES-128-GCM + MQTT broker setup' },
    { id: 'm4', title: 'End-to-end testing & final defense', dueDate: '2026-12-20', description: 'System integration test + performance benchmarking' },
  ],
  messages: [
    {
      id: 'msg-1',
      senderId: 'exp-1',
      senderName: 'Md. Shohel Arman',
      content: 'Please share the preliminary CNN architecture diagram before Tuesday\'s meeting.',
      timestamp: '2026-11-10T09:30:00Z',
      read: false,
    },
    {
      id: 'msg-2',
      senderId: 'stu-1',
      senderName: 'Abu Zafor',
      content: 'Working on the CMSIS-NN integration. Will share the benchmark results tonight.',
      timestamp: '2026-11-10T11:15:00Z',
      read: true,
    },
    {
      id: 'msg-3',
      senderId: 'stu-2',
      senderName: 'Anamul Haque',
      content: 'BLE pairing is now stable. AES-GCM latency overhead is 2.3ms per packet — well within budget.',
      timestamp: '2026-11-10T14:00:00Z',
      read: true,
    },
  ],
  files: [
    { id: 'f1', name: 'EdgeShield_Architecture_v2.pdf', size: 1240000, type: 'pdf', uploadedBy: 'Abu Zafor', uploadedAt: '2026-11-09T18:00:00Z', url: '#' },
    { id: 'f2', name: 'CNN_Benchmark_PTB-XL.xlsx', size: 450000, type: 'xlsx', uploadedBy: 'Anamul Haque', uploadedAt: '2026-11-10T16:30:00Z', url: '#' },
  ],
};

export const mockECGProblemStatement = `We are developing EdgeShield — a wearable ECG monitoring system for remote cardiac patients in rural Bangladesh. The device must run a real-time arrhythmia detection algorithm (CNN-based classifier) entirely on-chip using a low-power ARM Cortex-M4 microcontroller (nRF52840) under a 3mW power budget.

Sensor data (single-lead ECG at 500Hz) is preprocessed with a bandpass filter, fed to a quantized 8-bit integer neural network compiled with CMSIS-NN, and anomaly predictions are streamed to a companion Android app via BLE 5.0 (AES-128-GCM encrypted advertising packets).

The app forwards critical alerts to a hospital dashboard via MQTT over TLS 1.3. We need expertise in: embedded C/C++ for nRF5 SDK, TinyML model optimization and INT8 quantization, BLE GATT profile design, and secure MQTT transport with AES-GCM. The project must meet IEC 62304 safety class B requirements for medical software.`;

export const mockBioinformaticsProblemStatement = `BioShield AI: A multi-omics analysis pipeline for predicting patient-specific drug resistance in acute leukemia. We integrate single-cell RNA sequencing (scRNA-seq) data with genomic variant annotations to identify transcriptomic signatures correlating with resistance mechanisms.

The computational pipeline processes raw FASTQ files through quality control (FastQC, Trimmomatic), alignment (STAR 2-pass), and cell clustering (Seurat v5). Downstream analysis requires: differential expression (DESeq2), pathway enrichment (GSEA), and genomic annotation (ANNOVAR, VEP). We also need GNN-based drug-target interaction modeling using the ChEMBL 33 dataset.

Required expertise: scRNA-seq analysis, genomic annotation pipelines, bioinformatics tool integration (Nextflow), Python/R bioinformatics ecosystems, and computational drug discovery.`;

