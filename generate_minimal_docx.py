import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn
import os

def set_cell_background(cell, fill_hex):
    tcPr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def create_minimal_docx(output_path="UniExpert_SRS_Minimal.docx"):
    doc = docx.Document()

    # Page Setup: Letter/A4 with 0.75in margins
    for section in doc.sections:
        section.top_margin = Inches(0.75)
        section.bottom_margin = Inches(0.75)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)
        section.header.is_linked_to_previous = False
        
        # Header (Clean - No running header mark)
        hp = section.header.paragraphs[0]
        hp.text = ""

        # Footer
        fp = section.footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.LEFT
        frun = fp.add_run("Department of Software Engineering, Daffodil International University | SE 331 Capstone")
        frun.font.name = "Calibri"
        frun.font.size = Pt(8.5)
        frun.font.color.rgb = RGBColor(100, 116, 139)

    PRIMARY_COLOR = RGBColor(30, 58, 138)    # #1E3A8A
    ACCENT_COLOR = RGBColor(59, 117, 222)   # #3B75DE
    DARK_TEXT = RGBColor(30, 41, 59)        # #1E293B
    MUTED_TEXT = RGBColor(71, 85, 105)      # #475569

    # -------------------------------------------------------------
    # TITLE PAGE
    # -------------------------------------------------------------
    p_logo = doc.add_paragraph()
    p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
    if os.path.exists("diu_logo_0.png"):
        p_logo.add_run().add_picture("diu_logo_0.png", width=Inches(1.8))
    
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p_inst.add_run("DAFFODIL INTERNATIONAL UNIVERSITY\n")
    r.font.name = "Calibri"
    r.font.size = Pt(17)
    r.font.bold = True
    r.font.color.rgb = PRIMARY_COLOR

    r = p_inst.add_run("Faculty of Science & Information Technology\nDepartment of Software Engineering")
    r.font.name = "Calibri"
    r.font.size = Pt(12)
    r.font.color.rgb = DARK_TEXT

    p_divider = doc.add_paragraph()
    p_divider.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p_divider.add_run("―" * 45)
    r.font.color.rgb = ACCENT_COLOR

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p_title.add_run("SOFTWARE REQUIREMENTS SPECIFICATION\n")
    r.font.name = "Calibri"
    r.font.size = Pt(20)
    r.font.bold = True
    r.font.color.rgb = PRIMARY_COLOR

    r = p_title.add_run("Baseline Engineering Specification (Standard Edition)\n")
    r.font.name = "Calibri"
    r.font.size = Pt(13)
    r.font.bold = True
    r.font.color.rgb = DARK_TEXT

    r = p_title.add_run("Conforming to IEEE Std 830-1998, ISO/IEC/IEEE 29148:2018 & BAETE Criteria 4–5")
    r.font.name = "Calibri"
    r.font.size = Pt(10)
    r.font.italic = True
    r.font.color.rgb = MUTED_TEXT

    p_proj = doc.add_paragraph()
    p_proj.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p_proj.add_run("\nUniExpert\n")
    r.font.name = "Calibri"
    r.font.size = Pt(18)
    r.font.bold = True
    r.font.color.rgb = PRIMARY_COLOR

    r = p_proj.add_run("Automated Capstone Advisor Matching & Academic Collaboration Platform\n\n")
    r.font.name = "Calibri"
    r.font.size = Pt(11)
    r.font.italic = True
    r.font.color.rgb = DARK_TEXT

    r = p_proj.add_run("Course Title: Software Engineering Design Capstone Project (SE 331)\nAcademic Term: Fall 2026 · Final Capstone Milestone\n")
    r.font.name = "Calibri"
    r.font.size = Pt(10.5)
    r.font.bold = True
    r.font.color.rgb = DARK_TEXT

    # Sign-off / Credit Box
    t_meta = doc.add_table(rows=2, cols=2)
    t_meta.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_meta.autofit = False
    for row in t_meta.rows:
        row.cells[0].width = Inches(3.4)
        row.cells[1].width = Inches(3.4)

    c00 = t_meta.cell(0, 0)
    p = c00.paragraphs[0]
    r = p.add_run("SUBMITTED BY:\n")
    r.font.bold = True
    r.font.size = Pt(10)
    r.font.color.rgb = PRIMARY_COLOR
    r = p.add_run("Abu Zafor\nStudent ID: 221-35-748\nDept. of Software Engineering\nDaffodil International University\n\n")
    r.font.size = Pt(9.5)
    r = p.add_run("Anamul Haque\nStudent ID: 221-35-961\nDept. of Software Engineering\nDaffodil International University")
    r.font.size = Pt(9.5)

    c01 = t_meta.cell(0, 1)
    p = c01.paragraphs[0]
    r = p.add_run("SUPERVISED BY:\n")
    r.font.bold = True
    r.font.size = Pt(10)
    r.font.color.rgb = PRIMARY_COLOR
    r = p.add_run("Md. Shohel Arman\nAssistant Professor\nDept. of Software Engineering\nDaffodil International University\n\n")
    r.font.size = Pt(9.5)
    r = p.add_run("ACADEMIC COORDINATOR:\n")
    r.font.bold = True
    r.font.size = Pt(10)
    r.font.color.rgb = PRIMARY_COLOR
    r = p.add_run("Prof. Dr. Syed Akhter Hossain\nProfessor & Head, Dept. of Software Engineering\nDaffodil International University")
    r.font.size = Pt(9.5)

    c10 = t_meta.cell(1, 0)
    c11 = t_meta.cell(1, 1)
    c10.paragraphs[0].add_run("Date: November 24, 2026").font.size = Pt(9)
    c11.paragraphs[0].add_run("Location: Dhaka, Bangladesh").font.size = Pt(9)

    doc.add_page_break()

    # Helper functions for structured sections
    def add_sec_heading(text, level=1):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(text)
        r.font.name = "Calibri"
        r.font.bold = True
        if level == 1:
            r.font.size = Pt(14)
            r.font.color.rgb = PRIMARY_COLOR
        elif level == 2:
            r.font.size = Pt(12)
            r.font.color.rgb = DARK_TEXT
        else:
            r.font.size = Pt(10.5)
            r.font.color.rgb = ACCENT_COLOR
        return p

    def add_body_p(text, bold_prefix=None, italic=False):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.font.name = "Calibri"
            r_pre.font.size = Pt(10)
            r_pre.font.bold = True
            r_pre.font.color.rgb = DARK_TEXT
        r = p.add_run(text)
        r.font.name = "Calibri"
        r.font.size = Pt(10)
        r.font.italic = italic
        r.font.color.rgb = DARK_TEXT
        return p

    def add_image_with_caption(img_path, caption_text, width=Inches(5.8)):
        if os.path.exists(img_path):
            p_img = doc.add_paragraph()
            p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_img.paragraph_format.space_before = Pt(6)
            p_img.paragraph_format.space_after = Pt(2)
            p_img.add_run().add_picture(img_path, width=width)
            
            p_cap = doc.add_paragraph()
            p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_cap.paragraph_format.space_before = Pt(2)
            p_cap.paragraph_format.space_after = Pt(8)
            r = p_cap.add_run(caption_text)
            r.font.name = "Calibri"
            r.font.size = Pt(9)
            r.font.bold = True
            r.font.color.rgb = MUTED_TEXT

    def format_table_headers(table, headers, col_widths, bg_hex="F1F5F9"):
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        table.autofit = False
        hdr_row = table.rows[0]
        for idx, title in enumerate(headers):
            cell = hdr_row.cells[idx]
            cell.width = Inches(col_widths[idx])
            set_cell_background(cell, bg_hex)
            set_cell_margins(cell, top=80, bottom=80, left=120, right=120)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            r = p.add_run(title)
            r.font.name = "Calibri"
            r.font.size = Pt(9.5)
            r.font.bold = True
            r.font.color.rgb = DARK_TEXT

    def add_table_data(table, data, col_widths):
        for row_data in data:
            row = table.add_row()
            for idx, val in enumerate(row_data):
                cell = row.cells[idx]
                cell.width = Inches(col_widths[idx])
                set_cell_margins(cell, top=60, bottom=60, left=120, right=120)
                p = cell.paragraphs[0]
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                r = p.add_run(str(val))
                r.font.name = "Calibri"
                r.font.size = Pt(9)
                r.font.color.rgb = DARK_TEXT

    # -------------------------------------------------------------
    # DOCUMENT CONTROL & EXECUTIVE SUMMARY
    # -------------------------------------------------------------
    add_sec_heading("Document Control & Specification Baseline", level=1)
    t_rev = doc.add_table(rows=1, cols=4)
    format_table_headers(t_rev, ["Ver.", "Release Date", "Author(s) / Contributors", "Scope / Revision Description"], [0.6, 1.1, 1.8, 3.5])
    add_table_data(t_rev, [
        ["1.0", "2026-11-10", "Abu Zafor, Anamul Haque", "Initial IEEE 830 SRS Draft & Scope Specification"],
        ["1.5", "2026-11-18", "Abu Zafor, Anamul Haque", "Added Qdrant Vector Engine & XAI Radar Formulation"],
        ["2.0", "2026-11-24", "Abu Zafor, Anamul Haque", "Final Baseline: Architecture, Use Case, ERD & Sequence Diagrams"]
    ], [0.6, 1.1, 1.8, 3.5])

    add_sec_heading("Executive Summary", level=2)
    add_body_p(
        "In contemporary computing curricula, capstone advisor allocation has traditionally suffered from manual faculty lookups, informal outreach, and spreadsheet tracking. This process introduces severe structural deficiencies: thesis-domain misalignment, faculty burnout from unchecked advisory loads, and lack of verifiable audit trails for academic accreditation bodies such as the Board of Accreditation for Engineering and Technical Education (BAETE).\n\n"
        "UniExpert resolves these challenges through a problem-first semantic matchmaking and lifecycle governance platform. Students submit natural language problem statements, which are decomposed into prerequisite skill vectors using zero-shot transformer NLP. The system queries dense faculty publication embeddings indexed in Qdrant HNSW vector spaces. An Explainable AI (XAI) ranking engine synthesizes semantic alignment, skill overlap, faculty seniority tier, and dynamic capacity quotas into an objective score S(u,e). UniExpert enforces a formal Finite State Machine (FSM) for proposals, coordinates WebRTC consultations with persistent chat history, and anchors all state transitions into an immutable SHA-256 Merkle tree ledger to support automated BAETE Criterion 4 and 5 accreditation dossier generation."
    )

    add_sec_heading("Table of Contents Overview", level=2)
    add_body_p(
        "1. Introduction (Purpose, Scope, Definitions, References)\n"
        "2. Overall Description & Architecture Model (Decoupled Architecture Diagram, 6 User Classes, Technical Boundaries)\n"
        "3. System Architecture & Modeling (Proposal FSM Lifecycle, ERD Diagram, Consolidated Data Dictionary, Core Use Cases UC-01 to UC-05, Sequence Flow)\n"
        "4. Functional Requirements Specification (FR01 to FR20 across Modules 1 to 7)\n"
        "5. Non-Functional Requirements Specification (Performance, Security, Reliability, Usability Standards)\n"
        "6. Requirements Traceability Matrix (RTM Table covering FR01 to FR20)\n"
        "7. BAETE Accreditation Outcomes & Compliance (Criterion 4 & Criterion 5 Modern Tools, Academic Sign-Off Protocol)"
    )

    doc.add_page_break()

    # -------------------------------------------------------------
    # SECTION 1: INTRODUCTION
    # -------------------------------------------------------------
    add_sec_heading("1. Introduction", level=1)
    add_sec_heading("1.1 Purpose", level=2)
    add_body_p("This Software Requirements Specification (SRS) defines the binding functional and non-functional requirements for UniExpert. Conforming to IEEE Std 830-1998 and ISO/IEC/IEEE 29148:2018, this specification serves as the formal architectural contract for students, faculty supervisors, coordinators, administrators, and BAETE evaluators during the SE 331 Software Engineering Capstone Project.")

    add_sec_heading("1.2 Project Scope", level=2)
    add_body_p("UniExpert governs the capstone lifecycle within the Department of Software Engineering at Daffodil International University across five fundamental capability pillars:")
    add_body_p("• Autonomous Entity Extraction: Decomposing natural language problem narratives into research domains, prerequisite technical competencies, and task complexity scores.")
    add_body_p("• Dense Vector Semantic Retrieval: Matching student project needs against faculty publication corpora using pre-trained sentence transformer embeddings indexed in Qdrant vector spaces.")
    add_body_p("• Multi-Criteria XAI Ranking: Calculating transparent advisor compatibility based on semantic proximity, skill containment, supervisory credentials, and anti-burnout slot quotas.")
    add_body_p("• Proposal Governance & Workflow FSM: Enforcing a deterministic state machine for advisory requests with 7-day SLA escalation, quota locking, and department dispute resolution.")
    add_body_p("• Synchronous Collaboration & Cryptographic Audit: Delivering WebRTC media consultations, WebSocket messaging with client deduplication, and an immutable SHA-256 Merkle audit trail.")

    add_sec_heading("1.3 Definitions, Acronyms, and Abbreviations", level=2)
    t_def = doc.add_table(rows=1, cols=2)
    format_table_headers(t_def, ["Term / Acronym", "Normative Definition"], [1.8, 5.2])
    add_table_data(t_def, [
        ["SRS", "Software Requirements Specification; standardized engineering specification."],
        ["BAETE", "Board of Accreditation for Engineering and Technical Education (Institution of Engineers, Bangladesh)."],
        ["RBAC", "Role-Based Access Control; security mechanism enforcing least-privilege authorization by role."],
        ["XAI", "Explainable Artificial Intelligence; algorithms providing human-interpretable rationale for match scores."],
        ["HNSW", "Hierarchical Navigable Small World; graph-based approximate nearest neighbor vector search algorithm."],
        ["FSM", "Finite State Machine; mathematical model of computation consisting of discrete states and transitions."],
        ["SLA", "Service Level Agreement; institutional policy enforcing time bounds on proposal reviews (e.g., 7 days)."],
        ["TOTP", "Time-Based One-Time Password; RFC 6238 two-factor authentication for administrative accounts."],
        ["Merkle Tree", "Cryptographic binary hash tree where every parent node contains the hash of its children."],
        ["WebRTC", "Web Real-Time Communication; protocol facilitating browser-to-browser audio/video streams."]
    ], [1.8, 5.2])

    add_sec_heading("1.4 References", level=2)
    add_body_p("• IEEE Std 830-1998: IEEE Recommended Practice for Software Requirements Specifications.")
    add_body_p("• ISO/IEC/IEEE 29148:2018: Systems and software engineering — Requirements engineering.")
    add_body_p("• BAETE Manual for Accreditation of Undergraduate Engineering Programmes, Version 2.1, 2021.")
    add_body_p("• RFC 6455: The WebSocket Protocol, Internet Engineering Task Force (IETF), 2011.")
    add_body_p("• RFC 7519: JSON Web Token (JWT), Internet Engineering Task Force (IETF), 2015.")

    doc.add_page_break()

    # -------------------------------------------------------------
    # SECTION 2: OVERALL DESCRIPTION & ARCHITECTURE
    # -------------------------------------------------------------
    add_sec_heading("2. Overall Description", level=1)
    add_sec_heading("2.1 Product Perspective & Decoupled Architecture", level=2)
    add_body_p("UniExpert operates as a cloud-native, decoupled distributed application designed for institutional scale across five modular tiers:")
    add_body_p("1. Presentation Tier (Vercel Edge CDN): Single Page Application built with React 19, TypeScript, Vite, and Tailwind CSS. Employs client-side ProtectedRoute guards, React Context session persistence, and responsive layouts.")
    add_body_p("2. Application & API Tier (Render Cloud): REST and WebSocket services powered by FastAPI (Python 3.12+), Pydantic v2 schemas, and Uvicorn ASGI workers. Exposes endpoints for auth, entity extraction, proposals, and meetings.")
    add_body_p("3. Inference & Semantic Matching Tier: FastEmbed local CPU ONNX runtime deploying BAAI/bge-small-en-v1.5 (384-dimensional dense vectors) integrated with a Qdrant vector database supporting HNSW cosine similarity search.")
    add_body_p("4. Persistence & Cryptographic Storage Tier: Dual-mode relational persistence featuring PostgreSQL in production with automatic fallback to local SQLite (uniexpert.db) for zero-cost operation, plus SHA-256 Merkle audit tree.")
    add_body_p("5. Signaling & Real-Time Media Tier: WebSocket channels for bidirectional messaging and WebRTC media stream brokering via standard browser MediaDevices APIs.")

    add_image_with_caption("docs_assets/fig_architecture.png", "Figure 1: UniExpert Decoupled Multi-Tier System Architecture", width=Inches(5.5))

    add_sec_heading("2.2 User Classes and Role Characteristics", level=2)
    t_roles = doc.add_table(rows=1, cols=3)
    format_table_headers(t_roles, ["Role Identifier", "Target Persona", "Privileges, Responsibilities & Core Workflows"], [1.3, 1.5, 4.2])
    add_table_data(t_roles, [
        ["Student Lead", "Capstone Student", "Submit problem narratives, review extracted skills, explore advisor fit radar, manage milestones, chat with team, join video meetings."],
        ["Faculty Advisor", "Academic Supervisor", "Ingest publications/ORCID, review incoming proposals, adjust supervision capacity quotas, conduct consultations, evaluate milestones."],
        ["Industry Mentor", "External Practitioner", "Connect GitHub/LinkedIn credentials, co-advise real-world tech stacks, participate in code reviews and joint consultations."],
        ["Coordinator", "Capstone Committee", "Monitor supervisor load heatmaps, approve faculty tiers, resolve allocation disputes, override capacity limits during deadline crunches."],
        ["Administrator", "IT / System Admin", "Manage taxonomy domain trees, supervise RBAC account states, monitor server health metrics, enforce security policies."],
        ["Auditor", "QA / BAETE Evaluator", "Inspect immutable SHA-256 Merkle audit logs, verify hash chain integrity, export signed BAETE Criterion 4 and 5 accreditation dossiers."]
    ], [1.3, 1.5, 4.2])

    add_sec_heading("2.3 Operating Environment & Technical Constraints", level=2)
    add_body_p("• Frontend Runtime: Modern evergreen browsers (Chrome >= 115, Firefox >= 115, Safari >= 16, Edge >= 115) supporting ES2022, WebRTC getUserMedia, Web Audio API, and WebSockets.")
    add_body_p("• Backend Constraints: Python 3.12+ execution environment running on Linux x86_64 container instances within 512MB RAM constraints on Render free-tier architecture with zero recurring cloud licensing cost.")
    add_body_p("• Client Authorization: The application strictly enforces role-based route protection without exposing any floating demo role switcher widgets in production environments.")
    add_body_p("• Cryptographic Determinism: The Merkle audit tree guarantees SHA-256 hash reproducibility across cross-platform environments using standardized byte serialization.")

    doc.add_page_break()

    # -------------------------------------------------------------
    # SECTION 3: SYSTEM ARCHITECTURE & MODELING
    # -------------------------------------------------------------
    add_sec_heading("3. System Architecture & Modeling", level=1)
    add_sec_heading("3.1 Finite State Machine (FSM) Lifecycle for Proposals", level=2)
    add_body_p("The advisory allocation workflow is formally modeled as a deterministic Finite State Machine to eliminate ambiguous administrative states and guarantee operational SLA adherence:")

    t_fsm = doc.add_table(rows=1, cols=4)
    format_table_headers(t_fsm, ["Current State", "Trigger Event", "Next State", "Operational Logic & Side Effects"], [1.3, 1.5, 1.3, 2.9])
    add_table_data(t_fsm, [
        ["DRAFT", "Student saves proposal", "DRAFT", "Stored in SQLite/PostgreSQL; unallocated; editable."],
        ["DRAFT", "Student clicks Submit", "SUBMITTED", "Validates slot availability; sets 7-day SLA timer; notifies faculty."],
        ["SUBMITTED", "Advisor opens details", "UNDER_REVIEW", "Locks student edits; records timestamp in audit ledger."],
        ["UNDER_REVIEW", "Advisor clicks Accept", "ACCEPTED", "Decrements advisor capacity by 1; spawns Workspace & Team Chat."],
        ["UNDER_REVIEW", "Advisor clicks Reject", "REJECTED", "Releases reservation; prompts student to select alternate match."],
        ["UNDER_REVIEW", "Advisor asks changes", "REVISION_REQ", "Re-enables student editing; retains supervisor reservation."],
        ["SUBMITTED", "7-day timer expires", "ESCALATED", "Coordinator alert dispatched; automatic re-allocation queue."]
    ], [1.3, 1.5, 1.3, 2.9])

    add_sec_heading("3.2 Database Schema & Entity-Relationship Modeling", level=2)
    add_image_with_caption("docs_assets/fig_erd.png", "Figure 2: UniExpert Relational Entity-Relationship Diagram (ERD)", width=Inches(5.0))

    t_dd = doc.add_table(rows=1, cols=3)
    format_table_headers(t_dd, ["Table Name", "Primary Key / Foreign Keys", "Core Columns & Constraints"], [1.5, 2.0, 3.5])
    add_table_data(t_dd, [
        ["users", "id (UUID)", "email (UNIQUE, DIU domain), password_hash, role, name, is_verified."],
        ["faculty_profiles", "id -> users.id", "department, title, tier (1-3), slots_used, slots_total, h_index, bio."],
        ["proposals", "id (UUID), student_id, advisor_id", "title, problem_statement, status (FSM state), fit_score, created_at."],
        ["milestones", "id (UUID), proposal_id", "title, due_date, status (Pending/Completed), submission_url."],
        ["chat_messages", "id (UUID), proposal_id, sender_id", "content, timestamp (UTC), client_msg_id (deduplication key)."],
        ["meeting_rooms", "id (UUID), proposal_id", "room_code, scheduled_time, is_active, chat_history_json."],
        ["audit_ledger", "id (INTEGER), actor_id", "action_type, entity_id, timestamp, prev_hash, merkle_root."]
    ], [1.5, 2.0, 3.5])

    doc.add_page_break()

    # -------------------------------------------------------------
    # SECTION 3 CONT.: USE CASE MODEL & SPECIFICATIONS
    # -------------------------------------------------------------
    add_sec_heading("3.3 Use Case Model & Core Specifications", level=2)
    add_image_with_caption("docs_assets/fig_use_case.png", "Figure 3: UniExpert Role-Based Use Case Model", width=Inches(5.0))

    use_cases = [
        ("UC-01", "Problem Formulation & NLP Zero-Shot Entity Extraction", "Student Project Lead",
         "Student is authenticated with DIU credentials and navigates to New Proposal view.",
         "1. Student enters capstone project title and unstructured problem description (>= 50 words).\n"
         "2. Student clicks 'Analyze with AI'.\n"
         "3. Backend service processes input through zero-shot NLP transformer extractor.\n"
         "4. Extracted technical domains, prerequisite skills, and complexity metrics return in < 350ms.\n"
         "5. UI displays interactive Entity Review card allowing student to verify or adjust taxonomy tags.",
         "Project entities and skill requirements are persisted in user session state."),

        ("UC-02", "Semantic Advisor Retrieval & Explainable AI (XAI) Fit Breakdown", "Student Project Lead",
         "Project entities extracted and confirmed; Qdrant vector index populated.",
         "1. Student executes advisor discovery query.\n"
         "2. FastEmbed generates 384-dimensional dense vector from project problem statement.\n"
         "3. Qdrant performs cosine similarity search across 50+ faculty publication corpora (P95 < 45ms).\n"
         "4. Hybrid ranking algorithm evaluates semantic fit S_sem, skill overlap S_skill, seniority tier S_tier, and remaining capacity S_quota.\n"
         "5. System displays ranked advisor cards featuring transparent 4-axis XAI radar visualization.",
         "Student views ranked list of qualified advisors with explainable fit scores."),

        ("UC-03", "Proposal Submission, FSM Negotiation & Quota Decrement", "Student Project Lead, Faculty Advisor",
         "Selected faculty advisor has at least 1 supervisory slot remaining (slots_used < slots_total).",
         "1. Student finalizes milestones, weekly commitment hours, and submits proposal.\n"
         "2. Proposal transitions to SUBMITTED; 7-day SLA countdown timer is initialized.\n"
         "3. Faculty advisor reviews proposal via Incoming Proposals dashboard.\n"
         "4. Advisor accepts proposal; FSM transitions to ACCEPTED.\n"
         "5. System decrements faculty available slots by 1 and provisions Project Workspace and Team Chat.",
         "Supervisory agreement recorded; workspace initialized; audit event hash-chained.")
    ]

    for ucid, title, actor, pre, flow, post in use_cases:
        t_uc = doc.add_table(rows=6, cols=2)
        t_uc.alignment = WD_TABLE_ALIGNMENT.CENTER
        t_uc.autofit = False
        format_table_headers(t_uc, [f"Use Case ID: {ucid}", title], [1.8, 5.2], bg_hex="E2E8F0")
        labels = [("Primary Actor", actor), ("Preconditions", pre), ("Main Flow", flow), ("Postconditions", post)]
        for r_idx, (lab, val) in enumerate(labels, start=1):
            row = t_uc.rows[r_idx]
            row.cells[0].width = Inches(1.8)
            row.cells[1].width = Inches(5.2)
            set_cell_margins(row.cells[0], top=40, bottom=40, left=100, right=100)
            set_cell_margins(row.cells[1], top=40, bottom=40, left=100, right=100)
            p0 = row.cells[0].paragraphs[0]
            r0 = p0.add_run(lab)
            r0.font.bold = True
            r0.font.size = Pt(8.5)
            p1 = row.cells[1].paragraphs[0]
            r1 = p1.add_run(val)
            r1.font.size = Pt(8.5)
        doc.add_paragraph().paragraph_format.space_after = Pt(2)

    doc.add_page_break()

    # -------------------------------------------------------------
    # SECTION 3 CONT.: SEQUENCE FLOW & USE CASES UC-04, UC-05
    # -------------------------------------------------------------
    add_sec_heading("3.4 Sequence Flow & Collaboration Use Cases", level=2)
    add_image_with_caption("docs_assets/fig_sequence_matching.png", "Figure 4: Sequence Diagram for AI Entity Extraction, Vector Retrieval & XAI Formulation", width=Inches(5.0))

    use_cases_part2 = [
        ("UC-04", "Live WebRTC Consultation & Persistent Text History", "Student Team Lead, Faculty Advisor",
         "Scheduled consultation session reached; browser media permissions granted.",
         "1. Participant clicks 'Launch Consultation Room'.\n"
         "2. Browser acquires real local camera/mic stream via navigator.mediaDevices.getUserMedia.\n"
         "3. System establishes WebSocket signaling channel and synthesizes arrival chime via Web Audio API.\n"
         "4. Persistent in-meeting text chat history is synchronized from backend server.\n"
         "5. Attendees exchange real-time messages, toggle audio/video tracks, and conduct screen sharing.",
         "Media streams released cleanly upon session termination; meeting notes saved."),

        ("UC-05", "Cryptographic Merkle Audit Verification & BAETE Export", "Department Coordinator, BAETE Evaluator, Auditor",
         "Capstone milestones and advisory transitions recorded in audit database.",
         "1. Auditor navigates to Cryptographic Verification console.\n"
         "2. System loads entire chronological audit transaction chain.\n"
         "3. Verifier recalculates SHA-256 hash tree and validates Merkle root against published ledger.\n"
         "4. Auditor verifies tamper-free status and filters records by BAETE Criteria 4 and 5.\n"
         "5. System exports digitally certified, immutable accreditation dossier in PDF/CSV.",
         "Tamper verification confirmation displayed; official accreditation dossier exported.")
    ]

    for ucid, title, actor, pre, flow, post in use_cases_part2:
        t_uc = doc.add_table(rows=6, cols=2)
        t_uc.alignment = WD_TABLE_ALIGNMENT.CENTER
        t_uc.autofit = False
        format_table_headers(t_uc, [f"Use Case ID: {ucid}", title], [1.8, 5.2], bg_hex="E2E8F0")
        labels = [("Primary Actor", actor), ("Preconditions", pre), ("Main Flow", flow), ("Postconditions", post)]
        for r_idx, (lab, val) in enumerate(labels, start=1):
            row = t_uc.rows[r_idx]
            row.cells[0].width = Inches(1.8)
            row.cells[1].width = Inches(5.2)
            set_cell_margins(row.cells[0], top=40, bottom=40, left=100, right=100)
            set_cell_margins(row.cells[1], top=40, bottom=40, left=100, right=100)
            p0 = row.cells[0].paragraphs[0]
            r0 = p0.add_run(lab)
            r0.font.bold = True
            r0.font.size = Pt(8.5)
            p1 = row.cells[1].paragraphs[0]
            r1 = p1.add_run(val)
            r1.font.size = Pt(8.5)
        doc.add_paragraph().paragraph_format.space_after = Pt(2)

    doc.add_page_break()

    # -------------------------------------------------------------
    # SECTION 4: FUNCTIONAL REQUIREMENTS
    # -------------------------------------------------------------
    add_sec_heading("4. Functional Requirements Specification", level=1)
    add_body_p("The functional requirements (FRs) define the precise behavioral specifications and normative operational rules of UniExpert across its seven architectural modules.")

    add_sec_heading("4.1 Part 1: Identity, NLP Extraction & Semantic Matchmaking (FR01–FR09)", level=2)
    t_fr1 = doc.add_table(rows=1, cols=4)
    format_table_headers(t_fr1, ["Req ID", "Requirement Title", "Pri.", "Normative Functional Specification"], [0.8, 1.8, 0.7, 3.7])
    add_table_data(t_fr1, [
        ["FR01", "Institutional Registration", "MUST", "The system SHALL allow users to register with name, DIU email (.edu.bd), password, and institutional role. Non-institutional domains SHALL be rejected with validation errors."],
        ["FR02", "Multi-Factor Auth (TOTP)", "MUST", "The system SHALL enforce RFC 6238 TOTP two-factor authentication for Coordinator and Administrator roles, generating a 6-digit challenge code."],
        ["FR03", "Strict RBAC Route Guards", "MUST", "The system SHALL guard all frontend routes by role using ProtectedRoute. Unauthorized route attempts SHALL redirect to the user's home dashboard without exposing role switchers."],
        ["FR04", "Narrative Ingestion", "MUST", "The system SHALL ingest unstructured natural language project problem statements up to 1,000 words without requiring manual keyword configuration."],
        ["FR05", "Zero-Shot Entity Extraction", "MUST", "The system SHALL extract technical domains, prerequisite skills, and complexity scores from problem narratives using transformer NLP pipeline in < 400ms."],
        ["FR06", "Student Entity Validation", "SHOULD", "The system SHALL provide an interactive Entity Review interface allowing students to add, edit, or remove extracted domains and skill tags prior to discovery execution."],
        ["FR07", "Qdrant HNSW Vector Search", "MUST", "The system SHALL encode project statements into 384-dimensional dense vectors and execute cosine similarity retrieval against faculty publication indices in < 50ms."],
        ["FR08", "Mathematical XAI Formulation", "MUST", "The system SHALL compute composite match scores using the calibrated multi-criteria formulation: S(u,e) = 0.40*S_sem + 0.30*S_skill + 0.15*S_tier + 0.15*S_quota, where sum(w_i) = 1.0."],
        ["FR09", "4-Axis Radar Visualization", "SHOULD", "The system SHALL render an interactive radar chart displaying individual sub-scores (S_sem, S_skill, S_tier, S_quota) alongside side-by-side comparison for up to 3 faculty candidates."]
    ], [0.8, 1.8, 0.7, 3.7])

    add_sec_heading("4.2 Part 2: Governance, Collaboration & Cryptographic Audit (FR10–FR20)", level=2)
    t_fr2 = doc.add_table(rows=1, cols=4)
    format_table_headers(t_fr2, ["Req ID", "Requirement Title", "Pri.", "Normative Functional Specification"], [0.8, 1.8, 0.7, 3.7])
    add_table_data(t_fr2, [
        ["FR10", "Deterministic FSM Engine", "MUST", "The system SHALL enforce proposal lifecycle transitions: DRAFT -> SUBMITTED -> UNDER_REVIEW -> ACCEPTED / REJECTED / REVISION_REQ."],
        ["FR11", "Anti-Burnout Capacity Quotas", "MUST", "The system SHALL enforce hard supervisory capacity limits (1-10 groups). Faculty reaching capacity (S_quota = 0) SHALL be visually designated 'FULL' and locked from new submissions."],
        ["FR12", "7-Day Auto-Escalation SLA", "SHOULD", "The system SHALL maintain 7-day review SLAs on submitted proposals. Unreviewed proposals SHALL automatically escalate to the Coordinator queue for administrative intervention."],
        ["FR13", "Skill Gap Matrix (ΔK)", "SHOULD", "The system SHALL evaluate student team skills against project requirements, computing missing competency set ΔK = K_project \\ union(K_student_i)."],
        ["FR14", "Set-Cover Co-Advisor Engine", "COULD", "The system SHALL execute a set-cover optimization algorithm to identify secondary advisors or mentors who maximally cover ΔK within available quota constraints."],
        ["FR15", "Persistent WebSocket Chat", "MUST", "The system SHALL provide real-time group chat via RFC 6455 WebSockets with client-side deduplication (client_msg_id) and server-side SQLite message history storage."],
        ["FR16", "Hardware Media Acquisition", "MUST", "The system SHALL capture live local camera and microphone streams via navigator.mediaDevices.getUserMedia with responsive mute/unmute and screen sharing controls."],
        ["FR17", "Web Audio Arrival Chime", "SHOULD", "The system SHALL synthesize two-tone chime alerts (587Hz -> 880Hz) via the browser Web Audio API and present visual banner notifications when attendees join meeting rooms."],
        ["FR18", "Merkle Hash-Chaining", "MUST", "The system SHALL record all state transitions, quota updates, and milestone evaluations in an append-only ledger hash-chained using SHA-256 cryptographic hashes."],
        ["FR19", "Tamper Verification Engine", "MUST", "The system SHALL provide an automated integrity checker recalculating the Merkle root hash across all recorded transactions, immediately flagging any ledger alterations."],
        ["FR20", "One-Click BAETE Dossier", "MUST", "The system SHALL export digitally signed accreditation dossiers in PDF/CSV formats mapping student outcomes directly to BAETE Criteria 4 and 5 benchmarks."]
    ], [0.8, 1.8, 0.7, 3.7])

    doc.add_page_break()

    # -------------------------------------------------------------
    # SECTION 5: NON-FUNCTIONAL REQUIREMENTS
    # -------------------------------------------------------------
    add_sec_heading("5. Non-Functional Requirements Specification", level=1)
    add_sec_heading("5.1 Performance & Latency Benchmarks", level=2)
    t_nfr_p = doc.add_table(rows=1, cols=4)
    format_table_headers(t_nfr_p, ["NFR ID", "Performance Metric", "Technical Specification & Benchmark Target", "Measurement"], [0.9, 1.6, 3.0, 1.5])
    add_table_data(t_nfr_p, [
        ["NFR-P1", "Semantic Search Latency", "P95 retrieval latency SHALL be < 150ms for vector queries across 1,000+ indexed publication abstracts.", "Automated API load test"],
        ["NFR-P2", "NLP Embedding Inference", "Local CPU embedding generation SHALL complete in < 300ms per 250-word problem statement.", "Server profiling timer"],
        ["NFR-P3", "WebSocket Delivery", "WebSocket message broadcast latency SHALL be < 50ms across all connected project room clients.", "Network packet log"],
        ["NFR-P4", "WebRTC Media Startup", "Initial camera/microphone track acquisition and rendering SHALL complete in < 1.2s upon permission grant.", "Browser performance API"]
    ], [0.9, 1.6, 3.0, 1.5])

    add_sec_heading("5.2 Security, Integrity & Access Protection", level=2)
    t_nfr_s = doc.add_table(rows=1, cols=3)
    format_table_headers(t_nfr_s, ["NFR ID", "Security Domain", "Normative Security Specification & Defense Implementation"], [0.9, 1.6, 4.5])
    add_table_data(t_nfr_s, [
        ["NFR-S1", "Password Storage", "Passwords SHALL be salted and hashed using bcrypt with a minimum cost factor of 12. Plaintext passwords SHALL never be logged or persisted."],
        ["NFR-S2", "Token Lifecycle", "Session tokens SHALL utilize JSON Web Tokens (JWT) with HMAC-SHA256 signatures, short-lived 15-minute access tokens, and 7-day refresh tokens."],
        ["NFR-S3", "Brute-Force Lockout", "Account login attempts SHALL be rate-limited; 5 consecutive failed attempts SHALL lock the account for 15 minutes with administrative reset capabilities."],
        ["NFR-S4", "Transport Security", "All client-to-server and inter-service communications SHALL be encrypted using Transport Layer Security (TLS 1.3 / HTTPS / WSS)."],
        ["NFR-S5", "Client Zero-Trust", "Production builds SHALL completely purge floating demo role switchers; authorization SHALL be strictly verified against cryptographically signed JWT payloads."]
    ], [0.9, 1.6, 4.5])

    add_sec_heading("5.3 Reliability & Usability Standards", level=2)
    add_body_p("• NFR-R1 (Database Fallback): If cloud PostgreSQL is unreachable, the system SHALL fail over to local SQLite (uniexpert.db) without crashing or dropping user sessions.")
    add_body_p("• NFR-R2 (WebSocket Auto-Reconnect): Frontend WebSocket clients SHALL implement exponential backoff reconnection (1s -> 2s -> 4s ... <= 30s) to survive network drops.")
    add_body_p("• NFR-R3 (Deduplication): Chat messages SHALL carry client UUIDs (client_msg_id) to guarantee exactly-once presentation despite network retries.")
    add_body_p("• NFR-U1 (Visual Ergonomics): The UI SHALL conform to an eye-friendly academic design system featuring soft pastel canvas tones (#F4F8FF), dark typography (#1E293B), and WCAG 2.1 AA compliant contrast ratios (>= 4.5:1).")
    add_body_p("• NFR-U2 (Responsive Adaptability): The interface SHALL provide full responsive usability across desktop workstations (>= 1280px), tablets (768-1024px), and mobile viewports (<= 640px) with collapsible navigation drawers.")

    doc.add_page_break()

    # -------------------------------------------------------------
    # SECTION 6: REQUIREMENTS TRACEABILITY MATRIX
    # -------------------------------------------------------------
    add_sec_heading("6. Requirements Traceability Matrix (RTM)", level=1)
    add_body_p("The Requirements Traceability Matrix maps each normative functional requirement to its target architectural subsystem, IEEE 830 verification method (T: Test, D: Demonstration, A: Analysis, I: Inspection), priority, and implementation status:")

    t_rtm = doc.add_table(rows=1, cols=6)
    format_table_headers(t_rtm, ["Req ID", "Requirement Summary", "Subsystem / Layer", "Method", "Pri.", "Status"], [0.8, 2.0, 1.8, 0.7, 0.7, 1.0])
    add_table_data(t_rtm, [
        ["FR01", "Institutional Registration", "Auth / Identity", "T, D", "MUST", "Completed"],
        ["FR02", "Multi-Factor Auth (TOTP)", "Security Middleware", "T, D", "MUST", "Completed"],
        ["FR03", "Strict RBAC Route Guards", "Frontend Router / Context", "T, I", "MUST", "Completed"],
        ["FR04", "Narrative Problem Ingestion", "NLP Ingestion Service", "T, D", "MUST", "Completed"],
        ["FR05", "Zero-Shot Entity Extraction", "Transformer Pipeline", "T, A", "MUST", "Completed"],
        ["FR06", "Student Entity Validation", "Entity Review UI", "D, I", "SHOULD", "Completed"],
        ["FR07", "Qdrant HNSW Vector Search", "Vector Engine / FastEmbed", "T, A", "MUST", "Completed"],
        ["FR08", "Mathematical XAI Formulation", "Matching Engine", "T, A", "MUST", "Completed"],
        ["FR09", "4-Axis Radar Visualization", "XAI Component", "D, I", "SHOULD", "Completed"],
        ["FR10", "Deterministic FSM Engine", "Proposal FSM Controller", "T, A", "MUST", "Completed"],
        ["FR11", "Anti-Burnout Quota Limits", "Capacity Controller", "T, D", "MUST", "Completed"],
        ["FR12", "7-Day Auto-Escalation SLA", "Background Worker", "T, A", "SHOULD", "Completed"],
        ["FR13", "Skill Gap Matrix (ΔK)", "Team Optimizer", "T, A", "SHOULD", "Completed"],
        ["FR14", "Set-Cover Co-Advisor Engine", "Optimization Solver", "T, A", "COULD", "Completed"],
        ["FR15", "Persistent WebSocket Chat", "Messaging / WebSocket", "T, D", "MUST", "Completed"],
        ["FR16", "Hardware Media Acquisition", "WebRTC / MediaStream", "T, D", "MUST", "Completed"],
        ["FR17", "Web Audio Arrival Chime", "Web Audio API", "D, I", "SHOULD", "Completed"],
        ["FR18", "Merkle Hash-Chaining", "Cryptographic Ledger", "T, A", "MUST", "Completed"],
        ["FR19", "Tamper Verification Engine", "Audit Verifier", "T, A", "MUST", "Completed"],
        ["FR20", "One-Click BAETE Dossier", "Accreditation Engine", "T, D", "MUST", "Completed"]
    ], [0.8, 2.0, 1.8, 0.7, 0.7, 1.0])

    doc.add_page_break()

    # -------------------------------------------------------------
    # SECTION 7: BAETE OUTCOMES & SIGN-OFF
    # -------------------------------------------------------------
    add_sec_heading("7. BAETE Accreditation Outcomes & Compliance", level=1)
    add_body_p("UniExpert is architected in rigorous alignment with the accreditation criteria established by the Board of Accreditation for Engineering and Technical Education (BAETE) under the Institution of Engineers, Bangladesh (IEB).")

    add_sec_heading("7.1 Criterion 4: Complex Engineering Problem Solving", level=2)
    add_body_p("UniExpert satisfies the core dimensions of BAETE Criterion 4 through mathematical, algorithmic, and operational formalizations:")
    add_body_p("1. In-Depth Engineering Knowledge (P1): Implements mathematical vector similarity formulations, multi-criteria optimization functions, and cryptographic Merkle tree data structures.")
    add_body_p("2. Conflicting Requirements Optimization (P2): Balances competing objectives between student thesis preferences, faculty specialization depth, anti-burnout supervisory quotas, and departmental committee allocation policies.")
    add_body_p("3. Depth of Analysis Required (P3): Resolves natural language semantic ambiguity through zero-shot transformer decomposition into prerequisite domain and skill entities.")
    add_body_p("4. Formal Synthesis of Solution (P4): Implements a formally proven 7-state Finite State Machine guaranteeing deterministic transitions and mathematical termination.")
    add_body_p("5. Institutional Governance & Consequences (P5): Provides transparent explainability for academic allocations, preventing arbitrary assignments and mitigating institutional dispute escalations.")

    add_sec_heading("7.2 Criterion 5: Modern Engineering Tool Usage", level=2)
    t_tools = doc.add_table(rows=1, cols=3)
    format_table_headers(t_tools, ["Engineering Tool / Standard", "Architecture Role", "Technical Implementation & Academic Value"], [1.8, 1.5, 3.7])
    add_table_data(t_tools, [
        ["Qdrant Vector Database", "Vector Search Engine", "HNSW index executing high-dimensional vector search across 50+ faculty publication corpora in < 50ms."],
        ["FastEmbed ONNX Runtime", "NLP Embedding Engine", "Serverless CPU-based vector inference deploying BAAI/bge-small-en-v1.5 embeddings without GPU dependencies."],
        ["FastAPI & Pydantic v2", "REST API Backend", "High-performance asynchronous microservices with automated OpenAPI documentation and schema validation."],
        ["React 19 & Vite", "Frontend SPA Framework", "Modern reactive component architecture with client-side ProtectedRoute RBAC guards and responsive styling."],
        ["WebRTC MediaStream", "Real-Time Audio/Video", "Browser-native peer consultation without third-party teleconferencing dependencies or external licensing fees."],
        ["Web Audio API", "Acoustic Feedback", "Real-time synthesized acoustic chimes (587Hz -> 880Hz) for peer join notifications without audio asset downloads."],
        ["RFC 6455 WebSockets", "Synchronous Messaging", "Full-duplex persistent communication channel featuring client deduplication keys and broadcast distribution."],
        ["SHA-256 Merkle Ledger", "Cryptographic Integrity", "Verifiable cryptographic hash tree linking all state transitions for tamper-evident accreditation dossiers."]
    ], [1.8, 1.5, 3.7])

    add_sec_heading("7.3 Academic Verification & Sign-Off Protocol", level=2)
    add_body_p("This Software Requirements Specification baseline represents the agreed-upon technical contract for the UniExpert capstone project. All functional and non-functional requirements have been validated through automated test suites, end-to-end integration runs, and faculty review.")

    p_sig = doc.add_paragraph()
    p_sig.paragraph_format.space_before = Pt(14)

    t_sig = doc.add_table(rows=2, cols=2)
    t_sig.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_sig.autofit = False
    for row in t_sig.rows:
        row.cells[0].width = Inches(3.4)
        row.cells[1].width = Inches(3.4)

    s00 = t_sig.cell(0, 0)
    p = s00.paragraphs[0]
    p.add_run("―" * 32 + "\n")
    r = p.add_run("Abu Zafor\n")
    r.font.bold = True
    p.add_run("Student Project Lead (ID: 221-35-748)\nDept. of Software Engineering, DIU\n\n")

    s01 = t_sig.cell(0, 1)
    p = s01.paragraphs[0]
    p.add_run("―" * 32 + "\n")
    r = p.add_run("Md. Shohel Arman\n")
    r.font.bold = True
    p.add_run("Project Supervisor, Assistant Professor\nDept. of Software Engineering, DIU\n\n")

    s10 = t_sig.cell(1, 0)
    p = s10.paragraphs[0]
    p.add_run("―" * 32 + "\n")
    r = p.add_run("Anamul Haque\n")
    r.font.bold = True
    p.add_run("Student Co-Lead (ID: 221-35-961)\nDept. of Software Engineering, DIU")

    s11 = t_sig.cell(1, 1)
    p = s11.paragraphs[0]
    p.add_run("―" * 32 + "\n")
    r = p.add_run("Prof. Dr. Syed Akhter Hossain\n")
    r.font.bold = True
    p.add_run("Department Capstone Coordinator\nHead, Dept. of Software Engineering, DIU")

    doc.save(output_path)
    print(f"Successfully generated {output_path}")

if __name__ == "__main__":
    create_minimal_docx()
