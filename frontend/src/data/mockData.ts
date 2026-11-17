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
    name: 'Dr. Farhana Rahman',
    email: 'farhana.rahman@diu.edu.bd',
    role: 'faculty',
    department: 'Software Engineering',
    title: 'Associate Professor',
    tier: 2,
    slotsUsed: 2,
    slotsTotal: 5,
    quotaStatus: 'available',
    researchAreas: ['Embedded AI', 'Edge Computing', 'IoT Security', 'TinyML', 'BLE Networks'],
    skills: ['TinyML', 'ARM Cortex-M4', 'C/C++ Embedded', 'BLE 5.0', 'CNN', 'AES-GCM', 'MQTT', 'FreeRTOS', 'FPGA', 'Python'],
    hIndex: 9,
    publications: [mockPublications[0], mockPublications[1], mockPublications[2]],
    rating: 4.8,
    officeHours: officeHoursTemplate,
    bio: 'Dr. Rahman specializes in deploying deep neural networks on resource-constrained edge devices for healthcare applications. Her work focuses on the intersection of IoT security, TinyML inference optimization, and BLE mesh networking for clinical monitoring systems.',
    orcid: '0000-0002-1234-5678',
    googleScholar: 'farhana_rahman_diu',
    avatar: undefined,
  },
  {
    id: 'exp-2',
    name: 'Dr. Tanvir Ahmed',
    email: 'tanvir.ahmed@diu.edu.bd',
    role: 'faculty',
    department: 'Pharmacy',
    title: 'Bioinformatics Researcher',
    tier: 2,
    slotsUsed: 1,
    slotsTotal: 4,
    quotaStatus: 'available',
    researchAreas: ['Bioinformatics', 'Computational Biology', 'Genomics', 'Drug Discovery', 'Single-Cell Analysis'],
    skills: ['scRNA-seq', 'Genomic Annotation', 'Bioinformatics Pipelines', 'Python', 'R', 'Nextflow', 'GNN', 'CRISPR Analysis', 'Drug-Target Interaction'],
    hIndex: 11,
    publications: [mockPublications[3], mockPublications[4], mockPublications[5]],
    rating: 4.6,
    officeHours: [
      { id: 'oh-t1', day: 'Monday', startTime: '11:00', endTime: '11:30', isBooked: false },
      { id: 'oh-t2', day: 'Monday', startTime: '11:30', endTime: '12:00', isBooked: false },
      { id: 'oh-t3', day: 'Wednesday', startTime: '14:00', endTime: '14:30', isBooked: true, bookedBy: 'BioTeam Alpha' },
      { id: 'oh-t4', day: 'Wednesday', startTime: '14:30', endTime: '15:00', isBooked: false },
    ],
    bio: 'Dr. Ahmed focuses on computational approaches to drug discovery and genomics. He leads the Bioinformatics & Computational Biology lab, working on scRNA-seq pipeline optimization and GNN-based drug-target interaction prediction.',
    orcid: '0000-0003-9876-5432',
    googleScholar: 'tanvir_ahmed_bio',
    avatar: undefined,
  },
  {
    id: 'exp-3',
    name: 'Prof. Md. Rafiqul Islam',
    email: 'rafiqul.islam@diu.edu.bd',
    role: 'faculty',
    department: 'Computer Science',
    title: 'Professor',
    tier: 3,
    slotsUsed: 5,
    slotsTotal: 5,
    quotaStatus: 'full',
    researchAreas: ['Machine Learning', 'Natural Language Processing', 'Neural Architecture Search'],
    skills: ['PyTorch', 'TensorFlow', 'NLP', 'Neural Architecture Search', 'Zero-Shot Learning', 'BERT', 'Python', 'CUDA'],
    hIndex: 15,
    publications: [mockPublications[6], mockPublications[7]],
    rating: 4.9,
    officeHours: [],
    bio: 'Prof. Islam is a leading ML researcher with expertise in neural architecture search and zero-shot transfer learning. Currently at full supervisory quota for Fall 2026.',
    orcid: '0000-0001-7654-3210',
    googleScholar: 'rafiqul_islam_ml',
    avatar: undefined,
  },
  {
    id: 'exp-4',
    name: 'Engr. Sakib Al Hasan',
    email: 'sakib@techbridge.io',
    role: 'mentor',
    department: 'Industry',
    title: 'Principal Cloud Architect',
    tier: 1,
    slotsUsed: 1,
    slotsTotal: 3,
    quotaStatus: 'available',
    researchAreas: ['Cloud Computing', 'DevOps', 'Microservices', 'Kubernetes', 'CI/CD'],
    skills: ['AWS', 'GCP', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'Microservices', 'Go', 'Python', 'Prometheus'],
    hIndex: 0,
    publications: [],
    rating: 4.7,
    officeHours: [
      { id: 'oh-s1', day: 'Saturday', startTime: '20:00', endTime: '20:30', isBooked: false },
      { id: 'oh-s2', day: 'Saturday', startTime: '20:30', endTime: '21:00', isBooked: false },
      { id: 'oh-s3', day: 'Friday', startTime: '19:00', endTime: '19:30', isBooked: false },
    ],
    bio: 'Principal Cloud Architect at TechBridge Ltd. with 12+ years building enterprise-scale distributed systems. Specializes in Kubernetes orchestration, GitOps, and FinOps optimization.',
    linkedin: 'sakib-al-hasan',
    github: 'sakib-dev',
    isIndustry: true,
    avatar: undefined,
  },
  {
    id: 'exp-5',
    name: 'Dr. Shohel Arman',
    email: 'shohel.arman@diu.edu.bd',
    role: 'faculty',
    department: 'Software Engineering',
    title: 'Assistant Professor',
    tier: 1,
    slotsUsed: 3,
    slotsTotal: 5,
    quotaStatus: 'nearing',
    researchAreas: ['Software Engineering', 'Agile Methods', 'Requirements Engineering'],
    skills: ['UML', 'SysML', 'Agile', 'SCRUM', 'Requirements Engineering', 'Java', 'Spring Boot'],
    hIndex: 7,
    publications: mockPublications.slice(0, 2),
    rating: 4.5,
    officeHours: [
      { id: 'oh-a1', day: 'Sunday', startTime: '10:00', endTime: '10:30', isBooked: false },
      { id: 'oh-a2', day: 'Sunday', startTime: '10:30', endTime: '11:00', isBooked: false },
    ],
    bio: 'Mr. Arman focuses on software process improvement and agile methodologies. He supervises capstone teams in Requirements Engineering, software architecture, and system design.',
    orcid: '0000-0004-1234-0000',
    avatar: undefined,
  },
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
      { id: 'ev-3', state: 'under_review', timestamp: '2026-11-03T09:15:00Z', actor: 'Dr. Farhana Rahman', note: 'Proposal opened for review' },
      { id: 'ev-4', state: 'negotiation', timestamp: '2026-11-08T14:22:00Z', actor: 'Dr. Farhana Rahman', note: 'Scope needs to benchmark TinyML on ARM Cortex-M4 hardware with CMSIS-NN vs TensorFlow Lite comparison. Please add a hardware benchmarking milestone.' },
    ],
    negotiationNote: 'Scope needs to benchmark TinyML on ARM Cortex-M4 hardware with CMSIS-NN vs TensorFlow Lite comparison. Please add a hardware benchmarking milestone.',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'fsm_transition',
    title: 'Proposal Under Negotiation',
    message: 'Dr. Farhana Rahman has requested scope clarification on your EdgeShield proposal.',
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
      senderName: 'Dr. Farhana Rahman',
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

