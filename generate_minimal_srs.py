import os
import subprocess
import sys
import shutil

TEX_CONTENT = r'''\documentclass[10.5pt,a4paper]{article}

\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage{newtxtext,newtxmath}
\usepackage[a4paper, top=0.7in, bottom=0.7in, left=0.75in, right=0.75in]{geometry}
\usepackage{graphicx}
\usepackage{xcolor}
\usepackage{tabularx}
\usepackage{booktabs}
\usepackage{colortbl}
\usepackage{hyperref}
\usepackage{fancyhdr}
\usepackage{enumitem}
\usepackage{amsmath}
\usepackage{titlesec}
\usepackage{caption}

% Palette
\definecolor{primaryblue}{RGB}{30, 58, 138}
\definecolor{accentblue}{RGB}{59, 117, 222}
\definecolor{darkslate}{RGB}{30, 41, 59}
\definecolor{lightbg}{RGB}{244, 248, 255}
\definecolor{bordergray}{RGB}{226, 232, 240}
\definecolor{headergray}{RGB}{241, 245, 249}

\hypersetup{
    colorlinks=true,
    linkcolor=primaryblue,
    urlcolor=accentblue,
    citecolor=primaryblue
}

% Section styling
\titleformat{\section}{\color{primaryblue}\normalfont\large\bfseries}{\thesection}{0.8em}{}[\color{accentblue}\titlerule]
\titleformat{\subsection}{\color{darkslate}\normalfont\normalsize\bfseries}{\thesubsection}{0.8em}{}
\titleformat{\subsubsection}{\color{accentblue}\normalfont\small\bfseries}{\thesubsubsection}{0.6em}{}
\titlespacing*{\section}{0pt}{8pt}{3pt}
\titlespacing*{\subsection}{0pt}{6pt}{2pt}
\titlespacing*{\subsubsection}{0pt}{4pt}{2pt}

% Captions
\captionsetup{font=small,labelfont=bf,skip=4pt}

% Headers & Footers (Clean - No running header mark)
\pagestyle{fancy}
\fancyhf{}
\fancyfoot[L]{\footnotesize\textcolor{darkslate}{Department of Software Engineering, Daffodil International University}}
\fancyfoot[R]{\thepage}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0.5pt}

\setlist{itemsep=1.5pt, topsep=2pt, parsep=0pt, partopsep=0pt}
\setcounter{tocdepth}{2}
\renewcommand{\arraystretch}{1.12}

\begin{document}

% ==============================================================================
% TITLE PAGE (PAGE 1)
% ==============================================================================
\begin{titlepage}
\centering
\vspace*{0.2cm}

\ifx\diulogo\undefined
  \IfFileExists{diu_logo_0.png}{\includegraphics[width=1.9in]{diu_logo_0.png}\\[0.35cm]}{}
\fi

{\LARGE \textbf{DAFFODIL INTERNATIONAL UNIVERSITY}}\\[0.15cm]
{\large Faculty of Science \& Information Technology}\\[0.1cm]
{\large Department of Software Engineering}\\[0.4cm]

\rule{\linewidth}{1.2pt}\\[0.35cm]
{\huge \textbf{\color{primaryblue}SOFTWARE REQUIREMENTS SPECIFICATION}}\\[0.2cm]
{\Large \textbf{Baseline Engineering Specification (Standard Edition)}}\\[0.2cm]
{\normalsize Conforming to IEEE Std 830-1998, ISO/IEC/IEEE 29148:2018 \& BAETE Criteria 4--5}\\[0.3cm]
\rule{\linewidth}{1.2pt}\\[0.5cm]

{\LARGE \textbf{UniExpert}}\\[0.15cm]
{\large \textit{Automated Capstone Advisor Matching \& Academic Collaboration Platform}}\\[0.55cm]

\textbf{Course Title:} Software Engineering Design Capstone Project (SE 331)\\[0.12cm]
\textbf{Academic Term:} Fall 2026 $\cdot$ Final Capstone Milestone\\[0.65cm]

\begin{tabularx}{0.95\linewidth}{X X}
\textbf{\large Submitted By:} & \textbf{\large Supervised By:}\\[0.2cm]
\textbf{Abu Zafor} & \textbf{Md. Shohel Arman}\\
Student ID: 232-35-331 & Assistant Professor\\
Department of Software Engineering & Department of Software Engineering\\
Daffodil International University & Daffodil International University\\[0.35cm]
\textbf{Anamul Haque} & \\
Student ID: 232-35-285 & \\
Department of Software Engineering & \\
Daffodil International University & \\
\end{tabularx}

\vfill
{\small \textbf{Submission Date:} November 24, 2026 $\cdot$ Dhaka, Bangladesh}
\end{titlepage}

\clearpage

% ==============================================================================
% DOCUMENT CONTROL & EXECUTIVE SUMMARY & TOC (PAGE 2)
% ==============================================================================
\section*{Document Control \& Baseline Information}

\begin{table}[h]
\centering
\small
\begin{tabularx}{\linewidth}{|l|l|X|l|}
\hline
\rowcolor{headergray} \textbf{Ver.} & \textbf{Release Date} & \textbf{Author(s) / Contributors} & \textbf{Scope / Revision Description} \\ \hline
1.0 & 2026-11-10 & Abu Zafor, Anamul Haque & Initial IEEE 830 SRS Draft \& Scope Specification \\ \hline
1.5 & 2026-11-18 & Abu Zafor, Anamul Haque & Added Qdrant Vector Engine \& XAI Radar Formulation \\ \hline
2.0 & 2026-11-24 & Abu Zafor, Anamul Haque & Final Baseline: Architecture, Use Case, ERD \& Sequence Diagrams \\ \hline
\end{tabularx}
\caption{Document Control and Specification Baseline}
\end{table}

\subsection*{Executive Summary}
In contemporary computing curricula, capstone advisor allocation has traditionally suffered from manual faculty lookups, informal outreach, and spreadsheet tracking. This process introduces severe structural deficiencies: thesis-domain misalignment, faculty burnout from unchecked advisory loads, and lack of verifiable audit trails for academic accreditation bodies such as the \textbf{Board of Accreditation for Engineering and Technical Education (BAETE)}.

\textbf{UniExpert} resolves these challenges through a problem-first semantic matchmaking and lifecycle governance platform. Students submit natural language problem statements, which are decomposed into prerequisite skill vectors using zero-shot transformer NLP. The system queries dense faculty publication embeddings indexed in Qdrant HNSW vector spaces. An Explainable AI (XAI) ranking engine synthesizes semantic alignment, skill overlap, faculty seniority tier, and dynamic capacity quotas into an objective score $S(u,e)$. UniExpert enforces a formal Finite State Machine (FSM) for proposals, coordinates WebRTC consultations with persistent chat history, and anchors all state transitions into an immutable SHA-256 Merkle tree ledger to support automated BAETE Criterion 4 and 5 accreditation dossier generation.

\vspace{0.25cm}
\tableofcontents

\clearpage

% ==============================================================================
% SECTION 1: INTRODUCTION (PAGE 3)
% ==============================================================================
\section{Introduction}

\subsection{Purpose}
This Software Requirements Specification (SRS) defines the binding functional and non-functional requirements for \textbf{UniExpert}. Conforming to IEEE Std 830-1998 and ISO/IEC/IEEE 29148:2018, this specification serves as the formal architectural contract for students, faculty supervisors, coordinators, administrators, and BAETE evaluators during the SE 331 Software Engineering Capstone Project.

\subsection{Project Scope}
UniExpert governs the capstone lifecycle within the Department of Software Engineering at Daffodil International University across five fundamental capability pillars:
\begin{enumerate}[leftmargin=*]
    \item \textbf{Autonomous Entity Extraction:} Decomposing natural language problem narratives into research domains, prerequisite technical competencies, and task complexity scores.
    \item \textbf{Dense Vector Semantic Retrieval:} Matching student project needs against faculty publication corpora using pre-trained sentence transformer embeddings indexed in Qdrant vector spaces.
    \item \textbf{Multi-Criteria XAI Ranking:} Calculating transparent advisor compatibility based on semantic proximity, skill containment, supervisory credentials, and anti-burnout slot quotas.
    \item \textbf{Proposal Governance \& Workflow FSM:} Enforcing a deterministic state machine for advisory requests with 7-day SLA escalation, quota locking, and department dispute resolution.
    \item \textbf{Synchronous Collaboration \& Cryptographic Audit:} Delivering WebRTC media consultations, WebSocket messaging with client deduplication, and an immutable SHA-256 Merkle audit trail.
\end{enumerate}

\subsection{Definitions, Acronyms, and Abbreviations}

\begin{table}[h]
\centering
\small
\begin{tabularx}{\linewidth}{|l|X|}
\hline
\rowcolor{headergray} \textbf{Term / Acronym} & \textbf{Normative Definition} \\ \hline
\textbf{SRS} & Software Requirements Specification; standardized engineering specification. \\ \hline
\textbf{BAETE} & Board of Accreditation for Engineering and Technical Education (Institution of Engineers, Bangladesh). \\ \hline
\textbf{RBAC} & Role-Based Access Control; security mechanism enforcing least-privilege authorization by role. \\ \hline
\textbf{XAI} & Explainable Artificial Intelligence; algorithms providing human-interpretable rationale for match scores. \\ \hline
\textbf{HNSW} & Hierarchical Navigable Small World; graph-based approximate nearest neighbor vector search algorithm. \\ \hline
\textbf{FSM} & Finite State Machine; mathematical model of computation consisting of discrete states and transitions. \\ \hline
\textbf{SLA} & Service Level Agreement; institutional policy enforcing time bounds on proposal reviews (e.g., 7 days). \\ \hline
\textbf{TOTP} & Time-Based One-Time Password; RFC 6238 two-factor authentication for administrative accounts. \\ \hline
\textbf{Merkle Tree} & Cryptographic binary hash tree where every parent node contains the hash of its children. \\ \hline
\textbf{WebRTC} & Web Real-Time Communication; protocol facilitating browser-to-browser audio/video streams. \\ \hline
\end{tabularx}
\caption{Definitions, Acronyms, and Abbreviations}
\end{table}

\subsection{References}
\begin{itemize}[leftmargin=*]
    \item IEEE Std 830-1998: \textit{IEEE Recommended Practice for Software Requirements Specifications}.
    \item ISO/IEC/IEEE 29148:2018: \textit{Systems and software engineering --- Requirements engineering}.
    \item BAETE Manual for Accreditation of Undergraduate Engineering Programmes, Version 2.1, 2021.
    \item RFC 6455: \textit{The WebSocket Protocol}, Internet Engineering Task Force (IETF), 2011.
    \item RFC 7519: \textit{JSON Web Token (JWT)}, Internet Engineering Task Force (IETF), 2015.
\end{itemize}

\clearpage

% ==============================================================================
% SECTION 2: OVERALL DESCRIPTION & ARCHITECTURE DIAGRAM (PAGE 4)
% ==============================================================================
\section{Overall Description}

\subsection{Product Perspective \& Decoupled System Architecture}
UniExpert operates as a cloud-native, decoupled distributed application designed for institutional scale across five modular tiers:
\begin{enumerate}[leftmargin=*]
    \item \textbf{Presentation Tier (Vercel Edge CDN):} Single Page Application (SPA) built with React 19, TypeScript, Vite, and Tailwind CSS. Employs client-side ProtectedRoute guards, React Context session persistence, and responsive layouts across mobile, tablet, and desktop viewports.
    \item \textbf{Application \& API Tier (Render Cloud):} REST and WebSocket services powered by FastAPI (Python 3.12+), Pydantic v2 schemas, and Uvicorn ASGI workers. Exposes endpoints for authentication, entity extraction, proposals, consultation scheduling, and audit queries.
    \item \textbf{Inference \& Semantic Matching Tier:} FastEmbed local CPU ONNX runtime deploying \texttt{BAAI/bge-small-en-v1.5} (384-dimensional dense vectors) integrated with a Qdrant vector database supporting HNSW cosine similarity search.
    \item \textbf{Persistence \& Cryptographic Storage Tier:} Dual-mode relational persistence featuring PostgreSQL in production with automatic fallback to local SQLite (\texttt{uniexpert.db}) for zero-cost operation. Includes an append-only SHA-256 Merkle audit tree.
    \item \textbf{Signaling \& Real-Time Media Tier:} WebSocket channels for bidirectional messaging and WebRTC media stream brokering via standard browser \texttt{MediaDevices} APIs.
\end{enumerate}

\begin{figure}[h]
\centering
\IfFileExists{docs_assets/fig_architecture.png}{
    \includegraphics[width=0.88\linewidth]{docs_assets/fig_architecture.png}
    \caption{UniExpert Decoupled Multi-Tier System Architecture}
    \label{fig:architecture}
}{}
\end{figure}

\clearpage

% ==============================================================================
% SECTION 2 CONT.: USERS, ENVIRONMENT & CONSTRAINTS (PAGE 5)
% ==============================================================================
\subsection{User Classes and Role Characteristics}
UniExpert defines six institutional user roles operating under strict Role-Based Access Control:

\begin{table}[h]
\centering
\small
\begin{tabularx}{\linewidth}{|l|l|X|}
\hline
\rowcolor{headergray} \textbf{Role Identifier} & \textbf{Target Persona} & \textbf{Privileges, Responsibilities \& Core Workflows} \\ \hline
\textbf{Student Lead} & Capstone Student & Submit problem narratives, review extracted skills, explore advisor fit radar, manage milestones, chat with team, join video meetings. \\ \hline
\textbf{Faculty Advisor} & Academic Supervisor & Ingest publications/ORCID, review incoming proposals, adjust supervision capacity quotas, conduct consultations, evaluate milestones. \\ \hline
\textbf{Industry Mentor} & External Practitioner & Connect GitHub/LinkedIn credentials, co-advise real-world tech stacks, participate in code reviews and joint consultations. \\ \hline
\textbf{Coordinator} & Capstone Committee & Monitor supervisor load heatmaps, approve faculty tiers, resolve allocation disputes, override capacity limits during deadline crunches. \\ \hline
\textbf{Administrator} & IT / System Admin & Manage taxonomy domain trees, supervise RBAC account states, monitor server health metrics, enforce security policies. \\ \hline
\textbf{Auditor} & QA / BAETE Evaluator & Inspect immutable SHA-256 Merkle audit logs, verify hash chain integrity, export signed BAETE Criterion 4 and 5 accreditation dossiers. \\ \hline
\end{tabularx}
\caption{User Classes and Privilege Hierarchy}
\end{table}

\subsection{Operating Environment \& Technical Constraints}
\begin{itemize}[leftmargin=*]
    \item \textbf{Frontend Runtime:} Modern browsers (Chrome $\ge 115$, Firefox $\ge 115$, Safari $\ge 16$, Edge $\ge 115$) supporting ES2022, WebRTC \texttt{getUserMedia}, Web Audio API, and WebSockets.
    \item \textbf{Backend Constraints:} Python 3.12+ execution environment running on Linux x86\_64 containers within 512MB RAM constraints on Render free-tier architecture with zero cloud licensing cost.
    \item \textbf{Client Authorization:} The application strictly enforces role-based route protection without exposing any floating demo role switcher widgets in production environments.
    \item \textbf{Cryptographic Determinism:} The Merkle audit tree guarantees SHA-256 hash reproducibility across cross-platform environments using standardized byte serialization.
\end{itemize}

\subsection{Design and Implementation Assumptions}
\begin{itemize}[leftmargin=*]
    \item \textbf{Network Connectivity:} Students and faculty maintain active Internet connectivity ($\ge 512$ kbps) during WebRTC consultation sessions.
    \item \textbf{Identity Federation:} User registrations require active university-issued institutional email accounts within the \texttt{.edu.bd} domain namespace.
\end{itemize}

\clearpage

% ==============================================================================
% SECTION 3: SYSTEM MODELING & ERD (PAGE 6)
% ==============================================================================
\section{System Architecture \& Modeling}

\subsection{Finite State Machine (FSM) Lifecycle for Proposals}
The advisory allocation workflow is formally modeled as a deterministic Finite State Machine to eliminate ambiguous administrative states and guarantee operational SLA adherence:

\begin{table}[h]
\centering
\small
\begin{tabularx}{\linewidth}{|l|l|l|X|}
\hline
\rowcolor{headergray} \textbf{Current State} & \textbf{Trigger Event} & \textbf{Next State} & \textbf{Operational Logic \& Side Effects} \\ \hline
\texttt{DRAFT} & Student saves proposal & \texttt{DRAFT} & Stored in SQLite/PostgreSQL; unallocated; editable. \\ \hline
\texttt{DRAFT} & Student clicks Submit & \texttt{SUBMITTED} & Validates slot availability; sets 7-day SLA timer; notifies faculty. \\ \hline
\texttt{SUBMITTED} & Advisor opens details & \texttt{UNDER\_REVIEW} & Locks student edits; records timestamp in audit ledger. \\ \hline
\texttt{UNDER\_REVIEW} & Advisor clicks Accept & \texttt{ACCEPTED} & Decrements advisor capacity by 1; spawns Workspace \& Team Chat. \\ \hline
\texttt{UNDER\_REVIEW} & Advisor clicks Reject & \texttt{REJECTED} & Releases reservation; prompts student to select alternate match. \\ \hline
\texttt{UNDER\_REVIEW} & Advisor asks changes & \texttt{REVISION\_REQ} & Re-enables student editing; retains supervisor reservation. \\ \hline
\texttt{SUBMITTED} & 7-day timer expires & \texttt{ESCALATED} & Coordinator alert dispatched; automatic re-allocation queue. \\ \hline
\end{tabularx}
\caption{Proposal Finite State Machine Transition Matrix}
\end{table}

\subsection{Database Schema \& Entity-Relationship Modeling}

\begin{figure}[h]
\centering
\IfFileExists{docs_assets/fig_erd.png}{
    \includegraphics[width=0.76\linewidth]{docs_assets/fig_erd.png}
    \caption{UniExpert Relational Entity-Relationship Diagram (ERD)}
    \label{fig:erd}
}{}
\end{figure}

\begin{table}[h]
\centering
\footnotesize
\begin{tabularx}{\linewidth}{|l|l|X|}
\hline
\rowcolor{headergray} \textbf{Table Name} & \textbf{Primary Key / Foreign Keys} & \textbf{Core Columns \& Constraints} \\ \hline
\texttt{users} & \texttt{id} (UUID) & \texttt{email} (UNIQUE, DIU domain), \texttt{password\_hash}, \texttt{role}, \texttt{name}, \texttt{is\_verified}. \\ \hline
\texttt{faculty\_profiles} & \texttt{id} $\rightarrow$ \texttt{users.id} & \texttt{department}, \texttt{title}, \texttt{tier} (1--3), \texttt{slots\_used}, \texttt{slots\_total}, \texttt{h\_index}, \texttt{bio}. \\ \hline
\texttt{proposals} & \texttt{id} (UUID), \texttt{student\_id}, \texttt{advisor\_id} & \texttt{title}, \texttt{problem\_statement}, \texttt{status} (FSM state), \texttt{fit\_score}, \texttt{created\_at}. \\ \hline
\texttt{milestones} & \texttt{id} (UUID), \texttt{proposal\_id} & \texttt{title}, \texttt{due\_date}, \texttt{status} (Pending/Completed), \texttt{submission\_url}. \\ \hline
\texttt{chat\_messages} & \texttt{id} (UUID), \texttt{proposal\_id}, \texttt{sender\_id} & \texttt{content}, \texttt{timestamp} (UTC), \texttt{client\_msg\_id} (deduplication key). \\ \hline
\texttt{meeting\_rooms} & \texttt{id} (UUID), \texttt{proposal\_id} & \texttt{room\_code}, \texttt{scheduled\_time}, \texttt{is\_active}, \texttt{chat\_history\_json}. \\ \hline
\texttt{audit\_ledger} & \texttt{id} (INTEGER), \texttt{actor\_id} & \texttt{action\_type}, \texttt{entity\_id}, \texttt{timestamp}, \texttt{prev\_hash}, \texttt{merkle\_root}. \\ \hline
\end{tabularx}
\caption{Consolidated Relational Data Dictionary}
\end{table}

\clearpage

% ==============================================================================
% SECTION 3 CONT.: USE CASE MODEL & SPECIFICATIONS (PAGE 7)
% ==============================================================================
\subsection{Use Case Model \& Actor Interactions}

\begin{figure}[h]
\centering
\IfFileExists{docs_assets/fig_use_case.png}{
    \includegraphics[width=0.74\linewidth]{docs_assets/fig_use_case.png}
    \caption{UniExpert Role-Based Use Case Model}
    \label{fig:use_case}
}{}
\end{figure}

\begin{table}[h]
\centering
\footnotesize
\begin{tabularx}{\linewidth}{|l|X|}
\hline
\rowcolor{headergray} \textbf{Use Case ID: UC-01} & \textbf{Problem Formulation \& NLP Zero-Shot Entity Extraction} \\ \hline
\textbf{Primary Actor} & Student Project Lead \\ \hline
\textbf{Preconditions} & Student is authenticated with DIU credentials and navigates to New Proposal view. \\ \hline
\textbf{Main Flow} & 
1. Student enters capstone project title and unstructured problem description ($\ge 50$ words).\newline
2. Student clicks ``Analyze with AI''.\newline
3. Backend service processes input through zero-shot NLP transformer extractor.\newline
4. Extracted technical domains, prerequisite skills, and complexity metrics return in $< 350$ms.\newline
5. UI displays interactive Entity Review card allowing student to verify or adjust taxonomy tags. \\ \hline
\textbf{Postconditions} & Project entities and skill requirements are persisted in user session state. \\ \hline
\end{tabularx}
\caption{Use Case UC-01: Entity Extraction}
\end{table}

\clearpage

% ==============================================================================
% SECTION 3 CONT.: USE CASES UC-02, UC-03 & SEQUENCE DIAGRAM (PAGE 8)
% ==============================================================================
\subsection{Core Use Case Specifications (Part 2) \& Sequence Flow}

\begin{table}[h]
\centering
\footnotesize
\begin{tabularx}{\linewidth}{|l|X|}
\hline
\rowcolor{headergray} \textbf{Use Case ID: UC-02} & \textbf{Semantic Advisor Retrieval \& Explainable AI (XAI) Fit Breakdown} \\ \hline
\textbf{Primary Actor} & Student Project Lead \\ \hline
\textbf{Preconditions} & Project entities extracted and confirmed; Qdrant vector index populated. \\ \hline
\textbf{Main Flow} & 
1. Student executes advisor discovery query.\newline
2. FastEmbed generates 384-dimensional dense vector from project problem statement.\newline
3. Qdrant performs cosine similarity search across 50+ faculty publication corpora ($P95 < 45$ms).\newline
4. Hybrid ranking algorithm evaluates semantic fit ($S_{\text{sem}}$), skill overlap ($S_{\text{skill}}$), seniority tier ($S_{\text{tier}}$), and remaining capacity ($S_{\text{quota}}$).\newline
5. System displays ranked advisor cards featuring transparent 4-axis XAI radar visualization. \\ \hline
\textbf{Postconditions} & Student views ranked list of qualified advisors with explainable fit scores. \\ \hline
\end{tabularx}
\caption{Use Case UC-02: Semantic Matchmaking}
\end{table}

\begin{table}[h]
\centering
\footnotesize
\begin{tabularx}{\linewidth}{|l|X|}
\hline
\rowcolor{headergray} \textbf{Use Case ID: UC-03} & \textbf{Proposal Submission, FSM Negotiation \& Quota Decrement} \\ \hline
\textbf{Primary Actor} & Student Project Lead, Faculty Advisor \\ \hline
\textbf{Preconditions} & Selected faculty advisor has at least 1 supervisory slot remaining (\texttt{slots\_used < slots\_total}). \\ \hline
\textbf{Main Flow} & 
1. Student finalizes milestones, weekly commitment hours, and submits proposal.\newline
2. Proposal transitions to \texttt{SUBMITTED}; 7-day SLA countdown timer is initialized.\newline
3. Faculty advisor reviews proposal via Incoming Proposals dashboard.\newline
4. Advisor accepts proposal; FSM transitions to \texttt{ACCEPTED}.\newline
5. System decrements faculty available slots by 1 and provisions Project Workspace and Team Chat. \\ \hline
\textbf{Postconditions} & Supervisory agreement recorded; workspace initialized; audit event hash-chained. \\ \hline
\end{tabularx}
\caption{Use Case UC-03: Proposal Negotiation}
\end{table}

\begin{figure}[h]
\centering
\IfFileExists{docs_assets/fig_sequence_matching.png}{
    \includegraphics[width=0.74\linewidth]{docs_assets/fig_sequence_matching.png}
    \caption{Sequence Diagram for AI Entity Extraction, Qdrant Retrieval \& XAI Formulation}
    \label{fig:sequence_matching}
}{}
\end{figure}

\clearpage

% ==============================================================================
% SECTION 3 CONT.: USE CASES UC-04, UC-05 & SUBSYSTEMS (PAGE 9)
% ==============================================================================
\subsection{Core Use Case Specifications (Part 3)}

\begin{table}[h]
\centering
\small
\begin{tabularx}{\linewidth}{|l|X|}
\hline
\rowcolor{headergray} \textbf{Use Case ID: UC-04} & \textbf{Live WebRTC Consultation \& Persistent Text History} \\ \hline
\textbf{Primary Actor} & Student Team Lead, Faculty Advisor \\ \hline
\textbf{Preconditions} & Scheduled consultation session reached; browser media permissions granted. \\ \hline
\textbf{Main Flow} & 
1. Participant clicks ``Launch Consultation Room''.\newline
2. Browser acquires real local camera/mic stream via \texttt{navigator.mediaDevices.getUserMedia}.\newline
3. System establishes WebSocket signaling channel and synthesizes arrival chime via Web Audio API.\newline
4. Persistent in-meeting text chat history is synchronized from backend server.\newline
5. Attendees exchange real-time messages, toggle audio/video tracks, and conduct screen sharing. \\ \hline
\textbf{Postconditions} & Media streams released cleanly upon session termination; meeting notes saved. \\ \hline
\end{tabularx}
\caption{Use Case UC-04: WebRTC Consultation}
\end{table}

\begin{table}[h]
\centering
\small
\begin{tabularx}{\linewidth}{|l|X|}
\hline
\rowcolor{headergray} \textbf{Use Case ID: UC-05} & \textbf{Cryptographic Merkle Audit Verification \& BAETE Export} \\ \hline
\textbf{Primary Actor} & Department Coordinator, BAETE Evaluator, System Auditor \\ \hline
\textbf{Preconditions} & Capstone milestones and advisory transitions recorded in audit database. \\ \hline
\textbf{Main Flow} & 
1. Auditor navigates to Cryptographic Verification console.\newline
2. System loads entire chronological audit transaction chain.\newline
3. Verifier recalculates SHA-256 hash tree and validates Merkle root against published ledger.\newline
4. Auditor verifies tamper-free status and filters records by BAETE Criteria 4 and 5.\newline
5. System exports digitally certified, immutable accreditation dossier in PDF/CSV. \\ \hline
\textbf{Postconditions} & Tamper verification confirmation displayed; official accreditation dossier exported. \\ \hline
\end{tabularx}
\caption{Use Case UC-05: Merkle Audit Verification}
\end{table}

\subsection{Architectural Synthesis \& Subsystem Interfacing}
The UniExpert architectural components communicate through well-defined, decoupled programmatic interfaces:
\begin{itemize}[leftmargin=*]
    \item \textbf{Client-Server Communication:} Asynchronous JSON-RPC / REST endpoints adhering to OpenAPI specifications, secured via Bearer JWT authorization headers.
    \item \textbf{Signaling \& Real-Time Transport:} WebSocket endpoints handling bidirectional text chat, room presence notifications, and WebRTC SDP offer/answer exchange with ICE candidates.
    \item \textbf{Inference Pipeline:} In-process FastEmbed ONNX vector generator interacting directly with Qdrant vector database via gRPC/REST APIs, guaranteeing low-latency response times ($< 50$ms).
\end{itemize}

\clearpage

% ==============================================================================
% SECTION 4: FUNCTIONAL REQUIREMENTS - PART 1 (PAGE 10)
% ==============================================================================
\section{Functional Requirements Specification}

The functional requirements (FRs) define the precise behavioral specifications and normative operational rules of UniExpert across its seven architectural modules.

\subsection{Part 1: Identity, NLP Extraction \& Semantic Matchmaking (FR01--FR09)}

\begin{table}[h]
\centering
\small
\begin{tabularx}{\linewidth}{|l|l|c|X|}
\hline
\rowcolor{headergray} \textbf{Req ID} & \textbf{Requirement Title} & \textbf{Pri.} & \textbf{Normative Functional Specification} \\ \hline
\textbf{FR01} & Institutional Registration & MUST & The system SHALL allow users to register with name, DIU email (\texttt{.edu.bd}), password, and institutional role. Non-institutional domains SHALL be rejected with validation errors. \\ \hline
\textbf{FR02} & Multi-Factor Auth (TOTP) & MUST & The system SHALL enforce RFC 6238 TOTP two-factor authentication for Coordinator and Administrator roles, generating a 6-digit challenge code. \\ \hline
\textbf{FR03} & Strict RBAC Route Guards & MUST & The system SHALL guard all frontend routes by role using \texttt{ProtectedRoute}. Unauthorized route attempts SHALL redirect to the user's home dashboard without exposing role switchers. \\ \hline
\textbf{FR04} & Narrative Ingestion & MUST & The system SHALL ingest unstructured natural language project problem statements up to 1,000 words without requiring manual keyword configuration. \\ \hline
\textbf{FR05} & Zero-Shot Entity Extraction & MUST & The system SHALL extract technical domains, prerequisite skills, and complexity scores from problem narratives using transformer NLP pipeline in $< 400$ms. \\ \hline
\textbf{FR06} & Student Entity Validation & SHOULD & The system SHALL provide an interactive Entity Review interface allowing students to add, edit, or remove extracted domains and skill tags prior to discovery execution. \\ \hline
\textbf{FR07} & Qdrant HNSW Vector Search & MUST & The system SHALL encode project statements into 384-dimensional dense vectors and execute cosine similarity retrieval against faculty publication indices in $< 50$ms. \\ \hline
\textbf{FR08} & Mathematical XAI Formulation & MUST & The system SHALL compute composite match scores using the calibrated multi-criteria formulation defined in Equation \ref{eq:match}:
\begin{equation}
S(u, e) = w_1 \cdot S_{\text{sem}}(u, e) + w_2 \cdot S_{\text{skill}}(u, e) + w_3 \cdot S_{\text{tier}}(e) + w_4 \cdot S_{\text{quota}}(e)
\label{eq:match}
\end{equation}
where weights $w = [0.40, 0.30, 0.15, 0.15]$ and $\sum w_i = 1.0$. \\ \hline
\textbf{FR09} & 4-Axis Radar Visualization & SHOULD & The system SHALL render an interactive radar chart displaying individual sub-scores ($S_{\text{sem}}, S_{\text{skill}}, S_{\text{tier}}, S_{\text{quota}}$) alongside side-by-side comparison for up to 3 faculty candidates. \\ \hline
\end{tabularx}
\caption{Functional Requirements: Identity, NLP Extraction \& Matching}
\label{tab:fr_part1}
\end{table}

\clearpage

% ==============================================================================
% SECTION 4 CONT.: FUNCTIONAL REQUIREMENTS - PART 2 (PAGE 11)
% ==============================================================================
\subsection{Part 2: Governance, Collaboration \& Cryptographic Audit (FR10--FR20)}

\begin{table}[h]
\centering
\small
\begin{tabularx}{\linewidth}{|l|l|c|X|}
\hline
\rowcolor{headergray} \textbf{Req ID} & \textbf{Requirement Title} & \textbf{Pri.} & \textbf{Normative Functional Specification} \\ \hline
\textbf{FR10} & Deterministic FSM Engine & MUST & The system SHALL enforce proposal lifecycle transitions: \texttt{DRAFT} $\rightarrow$ \texttt{SUBMITTED} $\rightarrow$ \texttt{UNDER\_REVIEW} $\rightarrow$ \texttt{ACCEPTED} / \texttt{REJECTED} / \texttt{REVISION\_REQ}. \\ \hline
\textbf{FR11} & Anti-Burnout Capacity Quotas & MUST & The system SHALL enforce hard supervisory capacity limits (1--10 groups). Faculty reaching capacity ($S_{\text{quota}} = 0$) SHALL be visually designated ``FULL'' and locked from new submissions. \\ \hline
\textbf{FR12} & 7-Day Auto-Escalation SLA & SHOULD & The system SHALL maintain 7-day review SLAs on submitted proposals. Unreviewed proposals SHALL automatically escalate to the Coordinator queue for administrative intervention. \\ \hline
\textbf{FR13} & Skill Gap Matrix ($\Delta K$) & SHOULD & The system SHALL evaluate student team skills against project requirements, computing missing competency set $\Delta K = K_{\text{project}} \setminus \bigcup_{i} K_{\text{student}_i}$. \\ \hline
\textbf{FR14} & Set-Cover Co-Advisor Engine & COULD & The system SHALL execute a set-cover optimization algorithm to identify secondary advisors or mentors who maximally cover $\Delta K$ within available quota constraints. \\ \hline
\textbf{FR15} & Persistent WebSocket Chat & MUST & The system SHALL provide real-time group chat via RFC 6455 WebSockets with client-side deduplication ($client\_msg\_id$) and server-side SQLite message history storage. \\ \hline
\textbf{FR16} & Hardware Media Acquisition & MUST & The system SHALL capture live local camera and microphone streams via \texttt{navigator.mediaDevices.getUserMedia} with responsive mute/unmute and screen sharing controls. \\ \hline
\textbf{FR17} & Web Audio Arrival Chime & SHOULD & The system SHALL synthesize two-tone chime alerts (587Hz $\rightarrow$ 880Hz) via the browser Web Audio API and present visual banner notifications when attendees join meeting rooms. \\ \hline
\textbf{FR18} & Merkle Hash-Chaining & MUST & The system SHALL record all state transitions, quota updates, and milestone evaluations in an append-only ledger hash-chained using SHA-256 cryptographic hashes: $H_i = \text{SHA256}(H_{i-1} \parallel \text{Payload}_i)$. \\ \hline
\textbf{FR19} & Tamper Verification Engine & MUST & The system SHALL provide an automated integrity checker recalculating the Merkle root hash across all recorded transactions, immediately flagging any ledger alterations. \\ \hline
\textbf{FR20} & One-Click BAETE Dossier & MUST & The system SHALL export digitally signed accreditation dossiers in PDF/CSV formats mapping student outcomes directly to BAETE Criteria 4 and 5 benchmarks. \\ \hline
\end{tabularx}
\caption{Functional Requirements: Governance, Collaboration \& Audit}
\label{tab:fr_part2}
\end{table}

\clearpage

% ==============================================================================
% SECTION 5: NON-FUNCTIONAL REQUIREMENTS (PAGE 12)
% ==============================================================================
\section{Non-Functional Requirements Specification}

\subsection{Performance \& Latency Benchmarks}

\begin{table}[h]
\centering
\small
\begin{tabularx}{\linewidth}{|l|l|X|l|}
\hline
\rowcolor{headergray} \textbf{NFR ID} & \textbf{Performance Metric} & \textbf{Technical Specification \& Benchmark Target} & \textbf{Measurement} \\ \hline
\textbf{NFR-P1} & Semantic Search Latency & P95 retrieval latency SHALL be $< 150$ms for vector queries across 1,000+ indexed publication abstracts. & Automated API load test \\ \hline
\textbf{NFR-P2} & NLP Embedding Inference & Local CPU embedding generation SHALL complete in $< 300$ms per 250-word problem statement. & Server profiling timer \\ \hline
\textbf{NFR-P3} & WebSocket Delivery & WebSocket message broadcast latency SHALL be $< 50$ms across all connected project room clients. & Network packet log \\ \hline
\textbf{NFR-P4} & WebRTC Media Startup & Initial camera/microphone track acquisition and rendering SHALL complete in $< 1.2$s upon permission grant. & Browser performance API \\ \hline
\end{tabularx}
\caption{Non-Functional Requirements: Performance Metrics}
\end{table}

\subsection{Security, Integrity \& Access Protection}

\begin{table}[h]
\centering
\small
\begin{tabularx}{\linewidth}{|l|l|X|}
\hline
\rowcolor{headergray} \textbf{NFR ID} & \textbf{Security Domain} & \textbf{Normative Security Specification \& Defense Implementation} \\ \hline
\textbf{NFR-S1} & Password Storage & Passwords SHALL be salted and hashed using \texttt{bcrypt} with a minimum cost factor of 12. Plaintext passwords SHALL never be logged or persisted. \\ \hline
\textbf{NFR-S2} & Token Lifecycle & Session tokens SHALL utilize JSON Web Tokens (JWT) with HMAC-SHA256 signatures, short-lived 15-minute access tokens, and 7-day refresh tokens. \\ \hline
\textbf{NFR-S3} & Brute-Force Lockout & Account login attempts SHALL be rate-limited; 5 consecutive failed attempts SHALL lock the account for 15 minutes with administrative reset capabilities. \\ \hline
\textbf{NFR-S4} & Transport Security & All client-to-server and inter-service communications SHALL be encrypted using Transport Layer Security (TLS 1.3 / HTTPS / WSS). \\ \hline
\textbf{NFR-S5} & Client Zero-Trust & Production builds SHALL completely purge floating demo role switchers; authorization SHALL be strictly verified against cryptographically signed JWT payloads. \\ \hline
\end{tabularx}
\caption{Non-Functional Requirements: Security Specifications}
\end{table}

\subsection{Reliability \& Usability Standards}
\begin{itemize}[leftmargin=*]
    \item \textbf{NFR-R1 (Database Fallback):} If cloud PostgreSQL is unreachable, the system SHALL fail over to local SQLite (\texttt{uniexpert.db}) without crashing or dropping user sessions.
    \item \textbf{NFR-R2 (WebSocket Auto-Reconnect):} Frontend WebSocket clients SHALL implement exponential backoff reconnection (1s $\rightarrow$ 2s $\rightarrow$ 4s $\dots \le 30$s) to survive network drops.
    \item \textbf{NFR-R3 (Deduplication):} Chat messages SHALL carry client UUIDs ($client\_msg\_id$) to guarantee exactly-once presentation despite network retries.
    \item \textbf{NFR-U1 (Visual Ergonomics):} The UI SHALL conform to an eye-friendly academic design system featuring soft pastel canvas tones (\texttt{\#F4F8FF}), dark typography (\texttt{\#1E293B}), and WCAG 2.1 AA compliant contrast ratios ($\ge 4.5:1$).
    \item \textbf{NFR-U2 (Responsive Adaptability):} The interface SHALL provide full responsive usability across desktop workstations ($\ge 1280$px), tablets ($768$--$1024$px), and mobile viewports ($\le 640$px) with collapsible navigation drawers.
\end{itemize}

\clearpage

% ==============================================================================
% SECTION 6: REQUIREMENTS TRACEABILITY MATRIX (PAGE 13)
% ==============================================================================
\section{Requirements Traceability Matrix (RTM)}

The Requirements Traceability Matrix (Table \ref{tab:rtm}) maps each normative functional requirement to its target architectural subsystem, IEEE 830 verification method (\textbf{T}: Test, \textbf{D}: Demonstration, \textbf{A}: Analysis, \textbf{I}: Inspection), priority, and implementation status:

\begin{table}[h]
\centering
\small
\begin{tabularx}{\linewidth}{|l|l|l|c|c|l|}
\hline
\rowcolor{headergray} \textbf{Req ID} & \textbf{Requirement Summary} & \textbf{Subsystem / Layer} & \textbf{Method} & \textbf{Pri.} & \textbf{Status} \\ \hline
\textbf{FR01} & Institutional Registration & Auth / Identity & T, D & MUST & Completed \\ \hline
\textbf{FR02} & Multi-Factor Auth (TOTP) & Security Middleware & T, D & MUST & Completed \\ \hline
\textbf{FR03} & Strict RBAC Route Guards & Frontend Router / Context & T, I & MUST & Completed \\ \hline
\textbf{FR04} & Narrative Problem Ingestion & NLP Ingestion Service & T, D & MUST & Completed \\ \hline
\textbf{FR05} & Zero-Shot Entity Extraction & Transformer Pipeline & T, A & MUST & Completed \\ \hline
\textbf{FR06} & Student Entity Validation & Entity Review UI & D, I & SHOULD & Completed \\ \hline
\textbf{FR07} & Qdrant HNSW Vector Search & Vector Engine / FastEmbed & T, A & MUST & Completed \\ \hline
\textbf{FR08} & Mathematical XAI Formulation & Matching Engine & T, A & MUST & Completed \\ \hline
\textbf{FR09} & 4-Axis Radar Visualization & XAI Component & D, I & SHOULD & Completed \\ \hline
\textbf{FR10} & Deterministic FSM Engine & Proposal FSM Controller & T, A & MUST & Completed \\ \hline
\textbf{FR11} & Anti-Burnout Quota Limits & Capacity Controller & T, D & MUST & Completed \\ \hline
\textbf{FR12} & 7-Day Auto-Escalation SLA & Background Worker & T, A & SHOULD & Completed \\ \hline
\textbf{FR13} & Skill Gap Matrix ($\Delta K$) & Team Optimizer & T, A & SHOULD & Completed \\ \hline
\textbf{FR14} & Set-Cover Co-Advisor Engine & Optimization Solver & T, A & COULD & Completed \\ \hline
\textbf{FR15} & Persistent WebSocket Chat & Messaging / WebSocket & T, D & MUST & Completed \\ \hline
\textbf{FR16} & Hardware Media Acquisition & WebRTC / MediaStream & T, D & MUST & Completed \\ \hline
\textbf{FR17} & Web Audio Arrival Chime & Web Audio API & D, I & SHOULD & Completed \\ \hline
\textbf{FR18} & Merkle Hash-Chaining & Cryptographic Ledger & T, A & MUST & Completed \\ \hline
\textbf{FR19} & Tamper Verification Engine & Audit Verifier & T, A & MUST & Completed \\ \hline
\textbf{FR20} & One-Click BAETE Dossier & Accreditation Engine & T, D & MUST & Completed \\ \hline
\end{tabularx}
\caption{Consolidated Requirements Traceability Matrix (RTM)}
\label{tab:rtm}
\end{table}

\clearpage

% ==============================================================================
% SECTION 7: BAETE OUTCOMES & SIGN-OFF (PAGE 14)
% ==============================================================================
\section{BAETE Accreditation Outcomes \& Verification Protocol}

UniExpert is architected in rigorous alignment with the accreditation criteria established by the \textbf{Board of Accreditation for Engineering and Technical Education (BAETE)} under the Institution of Engineers, Bangladesh (IEB).

\subsection{Criterion 4: Complex Engineering Problem Solving}
UniExpert satisfies the core dimensions of BAETE Criterion 4 through mathematical, algorithmic, and operational formalizations:
\begin{enumerate}[leftmargin=*]
    \item \textbf{In-Depth Engineering Knowledge (P1):} Implements mathematical vector similarity formulations, multi-criteria optimization functions, and cryptographic Merkle tree data structures.
    \item \textbf{Conflicting Requirements Optimization (P2):} Balances competing objectives between student thesis preferences, faculty specialization depth, anti-burnout supervisory quotas, and departmental committee allocation policies.
    \item \textbf{Depth of Analysis Required (P3):} Resolves natural language semantic ambiguity through zero-shot transformer decomposition into prerequisite domain and skill entities.
    \item \textbf{Formal Synthesis of Solution (P4):} Implements a formally proven 7-state Finite State Machine guaranteeing deterministic transitions and mathematical termination.
    \item \textbf{Institutional Governance \& Stakeholder Consequences (P5):} Provides transparent explainability for academic allocations, preventing arbitrary assignments and mitigating institutional dispute escalations.
\end{enumerate}

\subsection{Criterion 5: Modern Engineering Tool Usage}

\begin{table}[h]
\centering
\small
\begin{tabularx}{\linewidth}{|l|l|X|}
\hline
\rowcolor{headergray} \textbf{Engineering Tool / Standard} & \textbf{Architecture Role} & \textbf{Technical Implementation \& Academic Value} \\ \hline
\textbf{Qdrant Vector Database} & Vector Search Engine & HNSW index executing high-dimensional vector search across 50+ faculty publication corpora in $< 50$ms. \\ \hline
\textbf{FastEmbed ONNX Runtime} & NLP Embedding Engine & Serverless CPU-based vector inference deploying \texttt{BAAI/bge-small-en-v1.5} embeddings without GPU dependencies. \\ \hline
\textbf{FastAPI \& Pydantic v2} & REST API Backend & High-performance asynchronous microservices with automated OpenAPI documentation and schema validation. \\ \hline
\textbf{React 19 \& Vite} & Frontend SPA Framework & Modern reactive component architecture with client-side ProtectedRoute RBAC guards and responsive styling. \\ \hline
\textbf{WebRTC MediaStream} & Real-Time Audio/Video & Browser-native peer consultation without third-party teleconferencing dependencies or external licensing fees. \\ \hline
\textbf{Web Audio API} & Acoustic Feedback & Real-time synthesized acoustic chimes (587Hz $\rightarrow$ 880Hz) for peer join notifications without audio asset downloads. \\ \hline
\textbf{RFC 6455 WebSockets} & Synchronous Messaging & Full-duplex persistent communication channel featuring client deduplication keys and broadcast distribution. \\ \hline
\textbf{SHA-256 Merkle Ledger} & Cryptographic Integrity & Verifiable cryptographic hash tree linking all state transitions for tamper-evident accreditation dossiers. \\ \hline
\end{tabularx}
\caption{Modern Engineering Tools Mapping (BAETE Criterion 5)}
\end{table}

\subsection{Academic Verification \& Sign-Off Protocol}
This Software Requirements Specification baseline represents the agreed-upon technical contract for the UniExpert capstone project. All functional and non-functional requirements have been validated through automated test suites, end-to-end integration runs, and faculty review.

\vspace{0.6cm}
\noindent
\begin{tabularx}{\linewidth}{X X}
\rule{2.7in}{0.5pt} & \rule{2.7in}{0.5pt}\\
\textbf{Abu Zafor} & \textbf{Md. Shohel Arman}\\
Student Project Lead (ID: 232-35-331) & Project Supervisor, Assistant Professor\\
Dept. of Software Engineering, DIU & Dept. of Software Engineering, DIU\\[0.6cm]
\rule{2.7in}{0.5pt} & \\
\textbf{Anamul Haque} & \\
Student Co-Lead (ID: 232-35-285) & \\
Dept. of Software Engineering, DIU & \\
\end{tabularx}

\end{document}
'''

def main():
    print("Writing uniexpert_srs_minimal.tex...")
    with open('uniexpert_srs_minimal.tex', 'w', encoding='utf-8') as f:
        f.write(TEX_CONTENT)

    print("Compiling uniexpert_srs_minimal.tex with pdflatex (Pass 1)...")
    res1 = subprocess.run(['pdflatex', '-interaction=nonstopmode', 'uniexpert_srs_minimal.tex'], capture_output=True, text=True)
    
    print("Compiling uniexpert_srs_minimal.tex with pdflatex (Pass 2 for TOC/Cross-references)...")
    res2 = subprocess.run(['pdflatex', '-interaction=nonstopmode', 'uniexpert_srs_minimal.tex'], capture_output=True, text=True)

    if res2.returncode != 0:
        print("LaTeX Compilation Error:")
        print(res2.stdout[-1500:])
        sys.exit(1)

    import pypdf
    reader = pypdf.PdfReader('uniexpert_srs_minimal.pdf')
    page_count = len(reader.pages)
    print(f"\n==========================================")
    print(f"SUCCESS: Generated uniexpert_srs_minimal.pdf")
    print(f"TOTAL PAGE COUNT: {page_count} pages")
    print(f"TARGET CONSTRAINT (10-15 pages): {'PASSED' if 10 <= page_count <= 15 else 'FAILED'}")
    print(f"==========================================\n")

if __name__ == '__main__':
    main()
