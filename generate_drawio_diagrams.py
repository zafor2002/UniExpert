import os
import xml.etree.ElementTree as ET

os.makedirs('docs_assets', exist_ok=True)

def build_architecture_xml():
    return '''<mxGraphModel dx="1400" dy="900" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1200" pageHeight="850" math="0" shadow="0">
  <root>
    <mxCell id="0" />
    <mxCell id="1" parent="0" />
    
    <!-- Title -->
    <mxCell id="title" value="UniExpert: Decoupled Multi-Tier System Architecture" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=18;fontStyle=1;fontColor=#0F172A;" vertex="1" parent="1">
      <mxGeometry x="370" y="20" width="460" height="40" as="geometry" />
    </mxCell>

    <!-- LAYER 1: Presentation Tier -->
    <mxCell id="layer1" value="Presentation Tier (React 19 / TypeScript / Vite / Tailwind CSS - Vercel Edge)" style="swimlane;whiteSpace=wrap;html=1;fillColor=#F0F9FF;strokeColor=#0284C7;strokeWidth=2;fontSize=12;fontStyle=1;fontColor=#0369A1;startSize=30;rounded=1;arcSize=4;" vertex="1" parent="1">
      <mxGeometry x="60" y="80" width="1080" height="170" as="geometry" />
    </mxCell>
    
    <mxCell id="c1" value="Student Workspace&#xa;• Narrative Problem Ingestion&#xa;• 4-Axis XAI Match Radar&#xa;• WebRTC Meeting Room&#xa;• Persistent WebSocket Chat" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#38BDF8;strokeWidth=1.5;fontSize=11;fontColor=#1E293B;align=left;spacingLeft=10;" vertex="1" parent="layer1">
      <mxGeometry x="30" y="45" width="230" height="100" as="geometry" />
    </mxCell>
    
    <mxCell id="c2" value="Faculty Advisor Portal&#xa;• Supervisory Quota Gauges&#xa;• Proposal FSM Review (7-Day SLA)&#xa;• Milestone Evaluation&#xa;• Live Video Consultation" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#38BDF8;strokeWidth=1.5;fontSize=11;fontColor=#1E293B;align=left;spacingLeft=10;" vertex="1" parent="layer1">
      <mxGeometry x="290" y="45" width="230" height="100" as="geometry" />
    </mxCell>

    <mxCell id="c3" value="Coordinator Dashboard&#xa;• Department Allocation Heatmaps&#xa;• Tier &amp; Slot Quota Overrides&#xa;• SLA Dispute Resolution&#xa;• Batch Thesis Group Assign" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#38BDF8;strokeWidth=1.5;fontSize=11;fontColor=#1E293B;align=left;spacingLeft=10;" vertex="1" parent="layer1">
      <mxGeometry x="550" y="45" width="230" height="100" as="geometry" />
    </mxCell>

    <mxCell id="c4" value="Auditor &amp; BAETE Console&#xa;• Cryptographic Merkle Verifier&#xa;• Hash Chain Integrity Inspector&#xa;• BAETE Criteria 4 &amp; 5 Dossier&#xa;• PDF &amp; CSV Evidence Export" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#38BDF8;strokeWidth=1.5;fontSize=11;fontColor=#1E293B;align=left;spacingLeft=10;" vertex="1" parent="layer1">
      <mxGeometry x="810" y="45" width="240" height="100" as="geometry" />
    </mxCell>

    <!-- Communication Arrow 1 -->
    <mxCell id="arr1" value="HTTPS (REST OpenAPI) &amp; Secure Full-Duplex WebSockets (WSS)" style="endArrow=classic;startArrow=classic;html=1;strokeColor=#0284C7;strokeWidth=2;fontSize=11;fontColor=#0369A1;fontStyle=1;labelBackgroundColor=#FFFFFF;" edge="1" parent="1" source="layer1" target="layer2">
      <mxGeometry relative="1" as="geometry" />
    </mxCell>

    <!-- LAYER 2: Application Tier -->
    <mxCell id="layer2" value="Application &amp; Inference Tier (FastAPI Framework / Python 3.12+ / FastEmbed ONNX - Render Cloud)" style="swimlane;whiteSpace=wrap;html=1;fillColor=#F8FAFC;strokeColor=#475569;strokeWidth=2;fontSize=12;fontStyle=1;fontColor=#1E293B;startSize=30;rounded=1;arcSize=4;" vertex="1" parent="1">
      <mxGeometry x="60" y="310" width="1080" height="240" as="geometry" />
    </mxCell>

    <mxCell id="a1" value="Identity &amp; Access Control&#xa;• RFC 7519 JWT Bearer Tokens&#xa;• Passwords Salted (bcrypt-12)&#xa;• Strict RBAC Route Guards" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#64748B;strokeWidth=1.5;fontSize=11;fontColor=#1E293B;align=left;spacingLeft=8;" vertex="1" parent="layer2">
      <mxGeometry x="30" y="45" width="230" height="80" as="geometry" />
    </mxCell>

    <mxCell id="a2" value="NLP Transformer Inference&#xa;• Zero-Shot Domain &amp; Skill Extraction&#xa;• BAAI/bge-small-en-v1.5 (384-dim)&#xa;• Local ONNX Serverless Inference" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#64748B;strokeWidth=1.5;fontSize=11;fontColor=#1E293B;align=left;spacingLeft=8;" vertex="1" parent="layer2">
      <mxGeometry x="290" y="45" width="230" height="80" as="geometry" />
    </mxCell>

    <mxCell id="a3" value="Multi-Criteria XAI Ranker&#xa;• S(u,e) Composite Match Formulation&#xa;• Seniority &amp; Anti-Burnout Weights&#xa;• 4-Axis Radar Normalization" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#64748B;strokeWidth=1.5;fontSize=11;fontColor=#1E293B;align=left;spacingLeft=8;" vertex="1" parent="layer2">
      <mxGeometry x="550" y="45" width="230" height="80" as="geometry" />
    </mxCell>

    <mxCell id="a4" value="Proposal Lifecycle FSM&#xa;• 7 Deterministic FSM States&#xa;• 7-Day Auto-Escalation SLAs&#xa;• Hard Supervision Quota Decrement" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#64748B;strokeWidth=1.5;fontSize=11;fontColor=#1E293B;align=left;spacingLeft=8;" vertex="1" parent="layer2">
      <mxGeometry x="810" y="45" width="240" height="80" as="geometry" />
    </mxCell>

    <mxCell id="a5" value="Real-Time Messaging Hub&#xa;• RFC 6455 Persistent WebSockets&#xa;• UUID Client-Side Deduplication&#xa;• SQLite Thread History Caching" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#64748B;strokeWidth=1.5;fontSize=11;fontColor=#1E293B;align=left;spacingLeft=8;" vertex="1" parent="layer2">
      <mxGeometry x="30" y="145" width="230" height="80" as="geometry" />
    </mxCell>

    <mxCell id="a6" value="WebRTC Signaling Server&#xa;• SDP Offer/Answer Exchange&#xa;• ICE Candidate Discovery Relay&#xa;• Web Audio Synthesized Chimes" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#64748B;strokeWidth=1.5;fontSize=11;fontColor=#1E293B;align=left;spacingLeft=8;" vertex="1" parent="layer2">
      <mxGeometry x="290" y="145" width="230" height="80" as="geometry" />
    </mxCell>

    <mxCell id="a7" value="Team Synergy Optimizer&#xa;• Missing Competencies ΔK Matrix&#xa;• Set-Cover Co-Advisor Engine&#xa;• Industry Mentor Alignment" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#64748B;strokeWidth=1.5;fontSize=11;fontColor=#1E293B;align=left;spacingLeft=8;" vertex="1" parent="layer2">
      <mxGeometry x="550" y="145" width="230" height="80" as="geometry" />
    </mxCell>

    <mxCell id="a8" value="Cryptographic Audit Engine&#xa;• SHA-256 Merkle Block Hash-Chain&#xa;• Sequential Tamper Verifier&#xa;• BAETE Criterion 4 &amp; 5 Dossier Gen" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#64748B;strokeWidth=1.5;fontSize=11;fontColor=#1E293B;align=left;spacingLeft=8;" vertex="1" parent="layer2">
      <mxGeometry x="810" y="145" width="240" height="80" as="geometry" />
    </mxCell>

    <!-- Communication Arrow 2 -->
    <mxCell id="arr2" value="SQLAlchemy 2.0 ORM / Qdrant gRPC / SHA-256 Cryptographic Digest" style="endArrow=classic;startArrow=classic;html=1;strokeColor=#475569;strokeWidth=2;fontSize=11;fontColor=#1E293B;fontStyle=1;labelBackgroundColor=#FFFFFF;" edge="1" parent="1" source="layer2" target="layer3">
      <mxGeometry relative="1" as="geometry" />
    </mxCell>

    <!-- LAYER 3: Persistence Tier -->
    <mxCell id="layer3" value="Persistence, Vector &amp; Cryptographic Storage Tier" style="swimlane;whiteSpace=wrap;html=1;fillColor=#FDF4FF;strokeColor=#C026D3;strokeWidth=2;fontSize=12;fontStyle=1;fontColor=#86198F;startSize=30;rounded=1;arcSize=4;" vertex="1" parent="1">
      <mxGeometry x="60" y="610" width="1080" height="170" as="geometry" />
    </mxCell>

    <mxCell id="p1" value="Qdrant Vector Database&#xa;• 384-Dimensional Dense Vectors&#xa;• HNSW Graph Cosine Index&#xa;• 50+ Faculty Publication Corpora&#xa;• Retrieval Latency &lt; 50ms" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#D946EF;strokeWidth=1.5;fontSize=11;fontColor=#1E293B;align=left;spacingLeft=10;" vertex="1" parent="layer3">
      <mxGeometry x="30" y="45" width="310" height="100" as="geometry" />
    </mxCell>

    <mxCell id="p2" value="Relational Persistence (Dual-Mode)&#xa;• PostgreSQL in Production / Cloud&#xa;• Local SQLite Fallback (uniexpert.db)&#xa;• Zero-Data Loss Automatic Failover&#xa;• ACID Transactional Consistency" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#D946EF;strokeWidth=1.5;fontSize=11;fontColor=#1E293B;align=left;spacingLeft=10;" vertex="1" parent="layer3">
      <mxGeometry x="385" y="45" width="310" height="100" as="geometry" />
    </mxCell>

    <mxCell id="p3" value="Append-Only Merkle Audit Ledger&#xa;• Hi = SHA256(Hi-1 || Payload_i)&#xa;• Immutable State Transition Ledger&#xa;• Cryptographic Root Verification&#xa;• BAETE Accreditation Archives" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#D946EF;strokeWidth=1.5;fontSize=11;fontColor=#1E293B;align=left;spacingLeft=10;" vertex="1" parent="layer3">
      <mxGeometry x="740" y="45" width="310" height="100" as="geometry" />
    </mxCell>

  </root>
</mxGraphModel>'''

def build_use_case_xml():
    return '''<mxGraphModel dx="1400" dy="900" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1200" pageHeight="850" math="0" shadow="0">
  <root>
    <mxCell id="0" />
    <mxCell id="1" parent="0" />

    <mxCell id="title" value="UniExpert: Role-Based Actor Use Case Model" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=18;fontStyle=1;fontColor=#0F172A;" vertex="1" parent="1">
      <mxGeometry x="400" y="20" width="400" height="40" as="geometry" />
    </mxCell>

    <!-- System Boundary -->
    <mxCell id="boundary" value="UniExpert Capstone Platform Boundary" style="shape=rect;rounded=1;arcSize=3;whiteSpace=wrap;html=1;fillColor=#F8FAFC;strokeColor=#0284C7;strokeWidth=2;fontSize=13;fontStyle=1;fontColor=#0369A1;align=center;verticalAlign=top;spacingTop=10;" vertex="1" parent="1">
      <mxGeometry x="240" y="80" width="720" height="740" as="geometry" />
    </mxCell>

    <!-- ACTORS (Left) -->
    <mxCell id="act_student" value="Student Project Lead" style="shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;outlineConnect=0;fillColor=#E0F2FE;strokeColor=#0284C7;strokeWidth=2;fontSize=11;fontStyle=1;fontColor=#0369A1;" vertex="1" parent="1">
      <mxGeometry x="60" y="160" width="50" height="80" as="geometry" />
    </mxCell>

    <mxCell id="act_faculty" value="Faculty Advisor" style="shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;outlineConnect=0;fillColor=#E0F2FE;strokeColor=#0284C7;strokeWidth=2;fontSize=11;fontStyle=1;fontColor=#0369A1;" vertex="1" parent="1">
      <mxGeometry x="60" y="380" width="50" height="80" as="geometry" />
    </mxCell>

    <mxCell id="act_mentor" value="Industry Mentor" style="shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;outlineConnect=0;fillColor=#E0F2FE;strokeColor=#0284C7;strokeWidth=2;fontSize=11;fontStyle=1;fontColor=#0369A1;" vertex="1" parent="1">
      <mxGeometry x="60" y="580" width="50" height="80" as="geometry" />
    </mxCell>

    <!-- ACTORS (Right) -->
    <mxCell id="act_coord" value="Department Coordinator" style="shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;outlineConnect=0;fillColor=#FDF4FF;strokeColor=#C026D3;strokeWidth=2;fontSize=11;fontStyle=1;fontColor=#86198F;" vertex="1" parent="1">
      <mxGeometry x="1070" y="180" width="50" height="80" as="geometry" />
    </mxCell>

    <mxCell id="act_admin" value="System Administrator" style="shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;outlineConnect=0;fillColor=#FDF4FF;strokeColor=#C026D3;strokeWidth=2;fontSize=11;fontStyle=1;fontColor=#86198F;" vertex="1" parent="1">
      <mxGeometry x="1070" y="380" width="50" height="80" as="geometry" />
    </mxCell>

    <mxCell id="act_auditor" value="BAETE Evaluator / Auditor" style="shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;outlineConnect=0;fillColor=#FDF4FF;strokeColor=#C026D3;strokeWidth=2;fontSize=11;fontStyle=1;fontColor=#86198F;" vertex="1" parent="1">
      <mxGeometry x="1070" y="580" width="50" height="80" as="geometry" />
    </mxCell>

    <!-- USE CASES -->
    <mxCell id="uc1" value="UC-01: Ingest Problem Narrative &amp;&#xa;NLP Zero-Shot Entity Extraction" style="ellipse;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#0284C7;strokeWidth=1.5;fontSize=11;fontColor=#1E293B;fontStyle=1;" vertex="1" parent="boundary">
      <mxGeometry x="40" y="45" width="260" height="60" as="geometry" />
    </mxCell>

    <mxCell id="uc2" value="UC-02: Qdrant Vector Retrieval &amp;&#xa;Explainable AI (XAI) Fit Breakdown" style="ellipse;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#0284C7;strokeWidth=1.5;fontSize=11;fontColor=#1E293B;fontStyle=1;" vertex="1" parent="boundary">
      <mxGeometry x="40" y="125" width="260" height="60" as="geometry" />
    </mxCell>

    <mxCell id="uc3" value="UC-03: Proposal Submission, FSM&#xa;Negotiation &amp; Quota Decrement" style="ellipse;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#0284C7;strokeWidth=1.5;fontSize=11;fontColor=#1E293B;fontStyle=1;" vertex="1" parent="boundary">
      <mxGeometry x="40" y="205" width="260" height="60" as="geometry" />
    </mxCell>

    <mxCell id="uc4" value="UC-04: Launch WebRTC Video Consultation&#xa;&amp; Persistent WebSocket Chat" style="ellipse;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#0284C7;strokeWidth=1.5;fontSize=11;fontColor=#1E293B;fontStyle=1;" vertex="1" parent="boundary">
      <mxGeometry x="40" y="285" width="260" height="60" as="geometry" />
    </mxCell>

    <mxCell id="uc5" value="UC-05: Verify Merkle Hash-Chain &amp;&#xa;Export Certified BAETE Dossier" style="ellipse;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#0284C7;strokeWidth=1.5;fontSize=11;fontColor=#1E293B;fontStyle=1;" vertex="1" parent="boundary">
      <mxGeometry x="420" y="585" width="260" height="60" as="geometry" />
    </mxCell>

    <mxCell id="uc6" value="Manage Supervision Quota &amp;&#xa;Prevent Advisor Burnout" style="ellipse;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#0284C7;strokeWidth=1.5;fontSize=11;fontColor=#1E293B;fontStyle=1;" vertex="1" parent="boundary">
      <mxGeometry x="40" y="375" width="260" height="60" as="geometry" />
    </mxCell>

    <mxCell id="uc7" value="Evaluate Capstone Milestones &amp;&#xa;Award Verification Points" style="ellipse;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#0284C7;strokeWidth=1.5;fontSize=11;fontColor=#1E293B;fontStyle=1;" vertex="1" parent="boundary">
      <mxGeometry x="40" y="465" width="260" height="60" as="geometry" />
    </mxCell>

    <mxCell id="uc8" value="Dispute Resolution &amp;&#xa;SLA 7-Day Auto-Escalation" style="ellipse;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#C026D3;strokeWidth=1.5;fontSize=11;fontColor=#1E293B;fontStyle=1;" vertex="1" parent="boundary">
      <mxGeometry x="420" y="105" width="260" height="60" as="geometry" />
    </mxCell>

    <mxCell id="uc9" value="Supervise Institutional RBAC &amp;&#xa;Enforce Multi-Factor TOTP" style="ellipse;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#C026D3;strokeWidth=1.5;fontSize=11;fontColor=#1E293B;fontStyle=1;" vertex="1" parent="boundary">
      <mxGeometry x="420" y="305" width="260" height="60" as="geometry" />
    </mxCell>

    <mxCell id="uc10" value="Co-Advise Tech Stack &amp;&#xa;Conduct Industry Review" style="ellipse;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#0284C7;strokeWidth=1.5;fontSize=11;fontColor=#1E293B;fontStyle=1;" vertex="1" parent="boundary">
      <mxGeometry x="40" y="565" width="260" height="60" as="geometry" />
    </mxCell>

    <!-- Connectors -->
    <mxCell id="e1" style="endArrow=none;html=1;strokeColor=#0284C7;strokeWidth=1.5;" edge="1" parent="1" source="act_student" target="uc1" />
    <mxCell id="e2" style="endArrow=none;html=1;strokeColor=#0284C7;strokeWidth=1.5;" edge="1" parent="1" source="act_student" target="uc2" />
    <mxCell id="e3" style="endArrow=none;html=1;strokeColor=#0284C7;strokeWidth=1.5;" edge="1" parent="1" source="act_student" target="uc3" />
    <mxCell id="e4" style="endArrow=none;html=1;strokeColor=#0284C7;strokeWidth=1.5;" edge="1" parent="1" source="act_student" target="uc4" />

    <mxCell id="e5" style="endArrow=none;html=1;strokeColor=#0284C7;strokeWidth=1.5;" edge="1" parent="1" source="act_faculty" target="uc3" />
    <mxCell id="e6" style="endArrow=none;html=1;strokeColor=#0284C7;strokeWidth=1.5;" edge="1" parent="1" source="act_faculty" target="uc4" />
    <mxCell id="e7" style="endArrow=none;html=1;strokeColor=#0284C7;strokeWidth=1.5;" edge="1" parent="1" source="act_faculty" target="uc6" />
    <mxCell id="e8" style="endArrow=none;html=1;strokeColor=#0284C7;strokeWidth=1.5;" edge="1" parent="1" source="act_faculty" target="uc7" />

    <mxCell id="e9" style="endArrow=none;html=1;strokeColor=#0284C7;strokeWidth=1.5;" edge="1" parent="1" source="act_mentor" target="uc10" />
    <mxCell id="e10" style="endArrow=none;html=1;strokeColor=#0284C7;strokeWidth=1.5;" edge="1" parent="1" source="act_mentor" target="uc4" />

    <mxCell id="e11" style="endArrow=none;html=1;strokeColor=#C026D3;strokeWidth=1.5;" edge="1" parent="1" source="act_coord" target="uc8" />
    <mxCell id="e12" style="endArrow=none;html=1;strokeColor=#C026D3;strokeWidth=1.5;" edge="1" parent="1" source="act_coord" target="uc5" />

    <mxCell id="e13" style="endArrow=none;html=1;strokeColor=#C026D3;strokeWidth=1.5;" edge="1" parent="1" source="act_admin" target="uc9" />

    <mxCell id="e14" style="endArrow=none;html=1;strokeColor=#C026D3;strokeWidth=1.5;" edge="1" parent="1" source="act_auditor" target="uc5" />

  </root>
</mxGraphModel>'''

def build_erd_xml():
    return '''<mxGraphModel dx="1400" dy="900" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1200" pageHeight="850" math="0" shadow="0">
  <root>
    <mxCell id="0" />
    <mxCell id="1" parent="0" />

    <mxCell id="title" value="UniExpert: Relational Database Schema &amp; Entity-Relationship Diagram (ERD)" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=18;fontStyle=1;fontColor=#0F172A;" vertex="1" parent="1">
      <mxGeometry x="300" y="20" width="600" height="40" as="geometry" />
    </mxCell>

    <!-- Table 1: users -->
    <mxCell id="t_users" value="users&#xa;-----------------------------------------&#xa;+ id : UUID [PK]&#xa;+ email : VARCHAR(255) [UNIQUE]&#xa;+ password_hash : VARCHAR(255)&#xa;+ role : ENUM (student, faculty, coord, ...)&#xa;+ name : VARCHAR(100)&#xa;+ is_verified : BOOLEAN&#xa;+ created_at : TIMESTAMP" style="shape=table;html=1;whiteSpace=wrap;startSize=25;container=1;collapsible=0;childLayout=tableLayout;strokeColor=#0284C7;strokeWidth=2;fillColor=#F0F9FF;fontSize=11;fontStyle=1;align=left;spacingLeft=8;fontColor=#0369A1;" vertex="1" parent="1">
      <mxGeometry x="80" y="100" width="280" height="150" as="geometry" />
    </mxCell>

    <!-- Table 2: faculty_profiles -->
    <mxCell id="t_faculty" value="faculty_profiles&#xa;-----------------------------------------&#xa;+ id : UUID [PK, FK -&gt; users.id]&#xa;+ department : VARCHAR(100)&#xa;+ title : VARCHAR(50)&#xa;+ tier : INTEGER (1..3)&#xa;+ slots_used : INTEGER&#xa;+ slots_total : INTEGER&#xa;+ h_index : INTEGER&#xa;+ bio : TEXT" style="shape=table;html=1;whiteSpace=wrap;startSize=25;container=1;collapsible=0;childLayout=tableLayout;strokeColor=#0284C7;strokeWidth=2;fillColor=#F0F9FF;fontSize=11;fontStyle=1;align=left;spacingLeft=8;fontColor=#0369A1;" vertex="1" parent="1">
      <mxGeometry x="460" y="100" width="280" height="170" as="geometry" />
    </mxCell>

    <!-- Table 3: proposals -->
    <mxCell id="t_proposals" value="proposals&#xa;-----------------------------------------&#xa;+ id : UUID [PK]&#xa;+ student_id : UUID [FK -&gt; users.id]&#xa;+ advisor_id : UUID [FK -&gt; users.id]&#xa;+ title : VARCHAR(255)&#xa;+ problem_statement : TEXT&#xa;+ status : ENUM (DRAFT, SUBMITTED, ...)&#xa;+ fit_score : FLOAT&#xa;+ created_at : TIMESTAMP" style="shape=table;html=1;whiteSpace=wrap;startSize=25;container=1;collapsible=0;childLayout=tableLayout;strokeColor=#475569;strokeWidth=2;fillColor=#F8FAFC;fontSize=11;fontStyle=1;align=left;spacingLeft=8;fontColor=#1E293B;" vertex="1" parent="1">
      <mxGeometry x="840" y="100" width="280" height="170" as="geometry" />
    </mxCell>

    <!-- Table 4: milestones -->
    <mxCell id="t_milestones" value="milestones&#xa;-----------------------------------------&#xa;+ id : UUID [PK]&#xa;+ proposal_id : UUID [FK -&gt; proposals.id]&#xa;+ title : VARCHAR(150)&#xa;+ due_date : DATE&#xa;+ status : ENUM (Pending, Completed)&#xa;+ submission_url : VARCHAR(500)" style="shape=table;html=1;whiteSpace=wrap;startSize=25;container=1;collapsible=0;childLayout=tableLayout;strokeColor=#475569;strokeWidth=2;fillColor=#F8FAFC;fontSize=11;fontStyle=1;align=left;spacingLeft=8;fontColor=#1E293B;" vertex="1" parent="1">
      <mxGeometry x="840" y="360" width="280" height="140" as="geometry" />
    </mxCell>

    <!-- Table 5: chat_messages -->
    <mxCell id="t_chat" value="chat_messages&#xa;-----------------------------------------&#xa;+ id : UUID [PK]&#xa;+ proposal_id : UUID [FK -&gt; proposals.id]&#xa;+ sender_id : UUID [FK -&gt; users.id]&#xa;+ content : TEXT&#xa;+ timestamp : TIMESTAMP (UTC)&#xa;+ client_msg_id : UUID [Deduplication]" style="shape=table;html=1;whiteSpace=wrap;startSize=25;container=1;collapsible=0;childLayout=tableLayout;strokeColor=#0284C7;strokeWidth=2;fillColor=#F0F9FF;fontSize=11;fontStyle=1;align=left;spacingLeft=8;fontColor=#0369A1;" vertex="1" parent="1">
      <mxGeometry x="460" y="360" width="280" height="140" as="geometry" />
    </mxCell>

    <!-- Table 6: meeting_rooms -->
    <mxCell id="t_meetings" value="meeting_rooms&#xa;-----------------------------------------&#xa;+ id : UUID [PK]&#xa;+ proposal_id : UUID [FK -&gt; proposals.id]&#xa;+ room_code : VARCHAR(50) [UNIQUE]&#xa;+ scheduled_time : TIMESTAMP&#xa;+ is_active : BOOLEAN&#xa;+ chat_history_json : JSONB" style="shape=table;html=1;whiteSpace=wrap;startSize=25;container=1;collapsible=0;childLayout=tableLayout;strokeColor=#0284C7;strokeWidth=2;fillColor=#F0F9FF;fontSize=11;fontStyle=1;align=left;spacingLeft=8;fontColor=#0369A1;" vertex="1" parent="1">
      <mxGeometry x="80" y="360" width="280" height="140" as="geometry" />
    </mxCell>

    <!-- Table 7: audit_ledger -->
    <mxCell id="t_audit" value="audit_ledger (Merkle Hash Chain)&#xa;-----------------------------------------&#xa;+ id : BIGINT [PK]&#xa;+ actor_id : UUID [FK -&gt; users.id]&#xa;+ action_type : VARCHAR(100)&#xa;+ entity_id : UUID&#xa;+ timestamp : TIMESTAMP (UTC)&#xa;+ prev_hash : CHAR(64) [SHA-256]&#xa;+ merkle_root : CHAR(64) [SHA-256]" style="shape=table;html=1;whiteSpace=wrap;startSize=25;container=1;collapsible=0;childLayout=tableLayout;strokeColor=#C026D3;strokeWidth=2;fillColor=#FDF4FF;fontSize=11;fontStyle=1;align=left;spacingLeft=8;fontColor=#86198F;" vertex="1" parent="1">
      <mxGeometry x="460" y="580" width="280" height="160" as="geometry" />
    </mxCell>

    <!-- Relations -->
    <mxCell id="r1" value="1 : 1" style="endArrow=block;html=1;strokeColor=#0284C7;strokeWidth=2;fontSize=10;fontColor=#0369A1;fontStyle=1;" edge="1" parent="1" source="t_users" target="t_faculty" />
    <mxCell id="r2" value="1 : N" style="endArrow=block;html=1;strokeColor=#475569;strokeWidth=2;fontSize=10;fontColor=#1E293B;fontStyle=1;" edge="1" parent="1" source="t_users" target="t_proposals" />
    <mxCell id="r3" value="1 : N" style="endArrow=block;html=1;strokeColor=#475569;strokeWidth=2;fontSize=10;fontColor=#1E293B;fontStyle=1;" edge="1" parent="1" source="t_proposals" target="t_milestones" />
    <mxCell id="r4" value="1 : N" style="endArrow=block;html=1;strokeColor=#0284C7;strokeWidth=2;fontSize=10;fontColor=#0369A1;fontStyle=1;" edge="1" parent="1" source="t_proposals" target="t_chat" />
    <mxCell id="r5" value="1 : N" style="endArrow=block;html=1;strokeColor=#0284C7;strokeWidth=2;fontSize=10;fontColor=#0369A1;fontStyle=1;" edge="1" parent="1" source="t_proposals" target="t_meetings" />
    <mxCell id="r6" value="1 : N" style="endArrow=block;html=1;strokeColor=#C026D3;strokeWidth=2;fontSize=10;fontColor=#86198F;fontStyle=1;" edge="1" parent="1" source="t_users" target="t_audit" />

  </root>
</mxGraphModel>'''

def build_sequence_xml():
    return '''<mxGraphModel dx="1400" dy="900" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1200" pageHeight="850" math="0" shadow="0">
  <root>
    <mxCell id="0" />
    <mxCell id="1" parent="0" />

    <mxCell id="title" value="UniExpert: Semantic NLP Extraction, Qdrant Retrieval &amp; XAI Formulation Sequence" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=17;fontStyle=1;fontColor=#0F172A;" vertex="1" parent="1">
      <mxGeometry x="270" y="20" width="660" height="40" as="geometry" />
    </mxCell>

    <!-- Lifelines -->
    <mxCell id="ll_student" value="Student Lead&#xa;(Client SPA)" style="shape=umlLifeline;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;outlineConnect=0;fillColor=#E0F2FE;strokeColor=#0284C7;strokeWidth=1.5;fontSize=11;fontStyle=1;fontColor=#0369A1;" vertex="1" parent="1">
      <mxGeometry x="80" y="80" width="130" height="680" as="geometry" />
    </mxCell>

    <mxCell id="ll_api" value="FastAPI Gateway&#xa;(REST &amp; WSS)" style="shape=umlLifeline;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;outlineConnect=0;fillColor=#F8FAFC;strokeColor=#475569;strokeWidth=1.5;fontSize=11;fontStyle=1;fontColor=#1E293B;" vertex="1" parent="1">
      <mxGeometry x="290" y="80" width="130" height="680" as="geometry" />
    </mxCell>

    <mxCell id="ll_nlp" value="FastEmbed ONNX&#xa;(Zero-Shot NLP)" style="shape=umlLifeline;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;outlineConnect=0;fillColor=#F8FAFC;strokeColor=#475569;strokeWidth=1.5;fontSize=11;fontStyle=1;fontColor=#1E293B;" vertex="1" parent="1">
      <mxGeometry x="500" y="80" width="130" height="680" as="geometry" />
    </mxCell>

    <mxCell id="ll_qdrant" value="Qdrant Vector DB&#xa;(HNSW Cosine)" style="shape=umlLifeline;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;outlineConnect=0;fillColor=#FDF4FF;strokeColor=#C026D3;strokeWidth=1.5;fontSize=11;fontStyle=1;fontColor=#86198F;" vertex="1" parent="1">
      <mxGeometry x="710" y="80" width="130" height="680" as="geometry" />
    </mxCell>

    <mxCell id="ll_xai" value="XAI Radar Engine&#xa;(Multi-Criteria)" style="shape=umlLifeline;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;outlineConnect=0;fillColor=#FDF4FF;strokeColor=#C026D3;strokeWidth=1.5;fontSize=11;fontStyle=1;fontColor=#86198F;" vertex="1" parent="1">
      <mxGeometry x="920" y="80" width="130" height="680" as="geometry" />
    </mxCell>

    <!-- Sequence Steps -->
    <mxCell id="m1" value="1: POST /api/proposals/extract (Narrative &gt;= 50 words)" style="endArrow=classic;html=1;strokeColor=#0284C7;strokeWidth=1.5;fontSize=10;fontColor=#0369A1;fontStyle=1;" edge="1" parent="1">
      <mxGeometry relative="1" as="geometry">
        <mxPoint x="145" y="160" as="sourcePoint" />
        <mxPoint x="355" y="160" as="targetPoint" />
      </mxGeometry>
    </mxCell>

    <mxCell id="m2" value="2: Ingest narrative, perform zero-shot entity extraction" style="endArrow=classic;html=1;strokeColor=#475569;strokeWidth=1.5;fontSize=10;fontColor=#1E293B;" edge="1" parent="1">
      <mxGeometry relative="1" as="geometry">
        <mxPoint x="355" y="200" as="sourcePoint" />
        <mxPoint x="565" y="200" as="targetPoint" />
      </mxGeometry>
    </mxCell>

    <mxCell id="m3" value="3: Return domains, prerequisite skills &amp; complexity (&lt; 350ms)" style="endArrow=dashed;html=1;strokeColor=#475569;strokeWidth=1.5;fontSize=10;fontColor=#1E293B;" edge="1" parent="1">
      <mxGeometry relative="1" as="geometry">
        <mxPoint x="565" y="240" as="sourcePoint" />
        <mxPoint x="355" y="240" as="targetPoint" />
      </mxGeometry>
    </mxCell>

    <mxCell id="m4" value="4: Render Entity Review Card (Student validates tags)" style="endArrow=dashed;html=1;strokeColor=#0284C7;strokeWidth=1.5;fontSize=10;fontColor=#0369A1;" edge="1" parent="1">
      <mxGeometry relative="1" as="geometry">
        <mxPoint x="355" y="280" as="sourcePoint" />
        <mxPoint x="145" y="280" as="targetPoint" />
      </mxGeometry>
    </mxCell>

    <mxCell id="m5" value="5: POST /api/advisors/match (Confirmed tags &amp; vector query)" style="endArrow=classic;html=1;strokeColor=#0284C7;strokeWidth=1.5;fontSize=10;fontColor=#0369A1;fontStyle=1;" edge="1" parent="1">
      <mxGeometry relative="1" as="geometry">
        <mxPoint x="145" y="340" as="sourcePoint" />
        <mxPoint x="355" y="340" as="targetPoint" />
      </mxGeometry>
    </mxCell>

    <mxCell id="m6" value="6: Encode problem statement into 384-dim dense vector" style="endArrow=classic;html=1;strokeColor=#475569;strokeWidth=1.5;fontSize=10;fontColor=#1E293B;" edge="1" parent="1">
      <mxGeometry relative="1" as="geometry">
        <mxPoint x="355" y="380" as="sourcePoint" />
        <mxPoint x="565" y="380" as="targetPoint" />
      </mxGeometry>
    </mxCell>

    <mxCell id="m7" value="7: Return dense embedding vector" style="endArrow=dashed;html=1;strokeColor=#475569;strokeWidth=1.5;fontSize=10;fontColor=#1E293B;" edge="1" parent="1">
      <mxGeometry relative="1" as="geometry">
        <mxPoint x="565" y="420" as="sourcePoint" />
        <mxPoint x="355" y="420" as="targetPoint" />
      </mxGeometry>
    </mxCell>

    <mxCell id="m8" value="8: Search faculty publication index via HNSW cosine (P95 &lt; 45ms)" style="endArrow=classic;html=1;strokeColor=#C026D3;strokeWidth=1.5;fontSize=10;fontColor=#86198F;fontStyle=1;" edge="1" parent="1">
      <mxGeometry relative="1" as="geometry">
        <mxPoint x="355" y="460" as="sourcePoint" />
        <mxPoint x="775" y="460" as="targetPoint" />
      </mxGeometry>
    </mxCell>

    <mxCell id="m9" value="9: Top-K faculty candidates with cosine similarity scores" style="endArrow=dashed;html=1;strokeColor=#C026D3;strokeWidth=1.5;fontSize=10;fontColor=#86198F;" edge="1" parent="1">
      <mxGeometry relative="1" as="geometry">
        <mxPoint x="775" y="500" as="sourcePoint" />
        <mxPoint x="355" y="500" as="targetPoint" />
      </mxGeometry>
    </mxCell>

    <mxCell id="m10" value="10: Calculate S(u,e) = w1*S_sem + w2*S_skill + w3*S_tier + w4*S_quota" style="endArrow=classic;html=1;strokeColor=#C026D3;strokeWidth=1.5;fontSize=10;fontColor=#86198F;fontStyle=1;" edge="1" parent="1">
      <mxGeometry relative="1" as="geometry">
        <mxPoint x="355" y="540" as="sourcePoint" />
        <mxPoint x="985" y="540" as="targetPoint" />
      </mxGeometry>
    </mxCell>

    <mxCell id="m11" value="11: Return 4-axis radar scores &amp; ranked candidates" style="endArrow=dashed;html=1;strokeColor=#C026D3;strokeWidth=1.5;fontSize=10;fontColor=#86198F;" edge="1" parent="1">
      <mxGeometry relative="1" as="geometry">
        <mxPoint x="985" y="580" as="sourcePoint" />
        <mxPoint x="355" y="580" as="targetPoint" />
      </mxGeometry>
    </mxCell>

    <mxCell id="m12" value="12: Display interactive Advisor Fit Cards with XAI radar visualization" style="endArrow=dashed;html=1;strokeColor=#0284C7;strokeWidth=1.5;fontSize=10;fontColor=#0369A1;fontStyle=1;" edge="1" parent="1">
      <mxGeometry relative="1" as="geometry">
        <mxPoint x="355" y="640" as="sourcePoint" />
        <mxPoint x="145" y="640" as="targetPoint" />
      </mxGeometry>
    </mxCell>

  </root>
</mxGraphModel>'''

def build_fsm_xml():
    return '''<mxGraphModel dx="1400" dy="900" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1200" pageHeight="850" math="0" shadow="0">
  <root>
    <mxCell id="0" />
    <mxCell id="1" parent="0" />

    <mxCell id="title" value="UniExpert: Proposal Governance Finite State Machine (FSM) Lifecycle" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=18;fontStyle=1;fontColor=#0F172A;" vertex="1" parent="1">
      <mxGeometry x="320" y="30" width="560" height="40" as="geometry" />
    </mxCell>

    <!-- Start state -->
    <mxCell id="s_start" value="" style="ellipse;fillColor=#0F172A;strokeColor=none;" vertex="1" parent="1">
      <mxGeometry x="80" y="200" width="30" height="30" as="geometry" />
    </mxCell>

    <!-- State: DRAFT -->
    <mxCell id="st_draft" value="DRAFT&#xa;• Proposal unallocated&#xa;• Student can edit narrative" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#F8FAFC;strokeColor=#475569;strokeWidth=2;fontSize=12;fontStyle=1;fontColor=#1E293B;" vertex="1" parent="1">
      <mxGeometry x="170" y="180" width="180" height="70" as="geometry" />
    </mxCell>

    <!-- State: SUBMITTED -->
    <mxCell id="st_sub" value="SUBMITTED&#xa;• Slot reserved tentatively&#xa;• 7-Day review SLA timer active" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#F0F9FF;strokeColor=#0284C7;strokeWidth=2;fontSize=12;fontStyle=1;fontColor=#0369A1;" vertex="1" parent="1">
      <mxGeometry x="430" y="180" width="200" height="70" as="geometry" />
    </mxCell>

    <!-- State: UNDER_REVIEW -->
    <mxCell id="st_review" value="UNDER_REVIEW&#xa;• Student edits locked&#xa;• Advisor inspecting dossier" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FEF9C3;strokeColor=#CA8A04;strokeWidth=2;fontSize=12;fontStyle=1;fontColor=#854D0E;" vertex="1" parent="1">
      <mxGeometry x="710" y="180" width="190" height="70" as="geometry" />
    </mxCell>

    <!-- State: ACCEPTED -->
    <mxCell id="st_acc" value="ACCEPTED&#xa;• Advisor capacity -1 (Locked)&#xa;• Workspace &amp; Chat spawned" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#DCFCE7;strokeColor=#16A34A;strokeWidth=2;fontSize=12;fontStyle=1;fontColor=#166534;" vertex="1" parent="1">
      <mxGeometry x="970" y="180" width="190" height="70" as="geometry" />
    </mxCell>

    <!-- State: REVISION_REQ -->
    <mxCell id="st_rev_req" value="REVISION_REQ&#xa;• Re-enables student editing&#xa;• Slot reservation retained" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFF7ED;strokeColor=#EA580C;strokeWidth=2;fontSize=12;fontStyle=1;fontColor=#9A3412;" vertex="1" parent="1">
      <mxGeometry x="710" y="340" width="190" height="70" as="geometry" />
    </mxCell>

    <!-- State: REJECTED -->
    <mxCell id="st_rej" value="REJECTED&#xa;• Reservation released&#xa;• Student selects next match" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FEE2E2;strokeColor=#DC2626;strokeWidth=2;fontSize=12;fontStyle=1;fontColor=#991B1B;" vertex="1" parent="1">
      <mxGeometry x="710" y="470" width="190" height="70" as="geometry" />
    </mxCell>

    <!-- State: ESCALATED -->
    <mxCell id="st_esc" value="ESCALATED&#xa;• 7-Day SLA expired unreviewed&#xa;• Coordinator intervention queue" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FDF4FF;strokeColor=#C026D3;strokeWidth=2;fontSize=12;fontStyle=1;fontColor=#86198F;" vertex="1" parent="1">
      <mxGeometry x="430" y="340" width="200" height="70" as="geometry" />
    </mxCell>

    <!-- End state -->
    <mxCell id="s_end" value="" style="ellipse;shape=doubleEllipse;fillColor=#0F172A;strokeColor=#16A34A;strokeWidth=3;" vertex="1" parent="1">
      <mxGeometry x="1050" y="350" width="30" height="30" as="geometry" />
    </mxCell>

    <!-- Transitions -->
    <mxCell id="t0" style="endArrow=classic;html=1;strokeColor=#475569;strokeWidth=1.5;" edge="1" parent="1" source="s_start" target="st_draft" />
    <mxCell id="t1" value="Submit Proposal" style="endArrow=classic;html=1;strokeColor=#0284C7;strokeWidth=1.5;fontSize=10;fontColor=#0369A1;fontStyle=1;" edge="1" parent="1" source="st_draft" target="st_sub" />
    <mxCell id="t2" value="Advisor Opens" style="endArrow=classic;html=1;strokeColor=#CA8A04;strokeWidth=1.5;fontSize=10;fontColor=#854D0E;fontStyle=1;" edge="1" parent="1" source="st_sub" target="st_review" />
    <mxCell id="t3" value="Advisor Accepts" style="endArrow=classic;html=1;strokeColor=#16A34A;strokeWidth=2;fontSize=10;fontColor=#166534;fontStyle=1;" edge="1" parent="1" source="st_review" target="st_acc" />
    <mxCell id="t4" value="Request Changes" style="endArrow=classic;html=1;strokeColor=#EA580C;strokeWidth=1.5;fontSize=10;fontColor=#9A3412;fontStyle=1;" edge="1" parent="1" source="st_review" target="st_rev_req" />
    <mxCell id="t5" value="Resubmit" style="endArrow=classic;html=1;strokeColor=#0284C7;strokeWidth=1.5;fontSize=10;fontColor=#0369A1;" edge="1" parent="1" source="st_rev_req" target="st_sub" />
    <mxCell id="t6" value="Advisor Rejects" style="endArrow=classic;html=1;strokeColor=#DC2626;strokeWidth=1.5;fontSize=10;fontColor=#991B1B;fontStyle=1;" edge="1" parent="1" source="st_review" target="st_rej" />
    <mxCell id="t7" value="7-Day SLA Expires" style="endArrow=classic;html=1;strokeColor=#C026D3;strokeWidth=1.5;fontSize=10;fontColor=#86198F;fontStyle=1;" edge="1" parent="1" source="st_sub" target="st_esc" />
    <mxCell id="t8" value="Re-Allocate" style="endArrow=classic;html=1;strokeColor=#C026D3;strokeWidth=1.5;fontSize=10;fontColor=#86198F;" edge="1" parent="1" source="st_esc" target="st_sub" />
    <mxCell id="t9" style="endArrow=classic;html=1;strokeColor=#16A34A;strokeWidth=2;" edge="1" parent="1" source="st_acc" target="s_end" />

  </root>
</mxGraphModel>'''

def make_single_drawio(name, xml_content):
    path = os.path.join('docs_assets', name)
    content = f'''<mxfile host="Electron" modified="2026-11-26T13:30:00.000Z" agent="UniExpert Capstone" version="24.0.0" type="device">
  <diagram id="{name.replace('.drawio', '')}" name="{name.replace('.drawio', '').replace('_', ' ').title()}">
{xml_content}
  </diagram>
</mxfile>'''
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Generated {path}")

def make_workbook_drawio():
    path = os.path.join('docs_assets', 'UniExpert_All_Diagrams.drawio')
    content = f'''<mxfile host="Electron" modified="2026-11-26T13:30:00.000Z" agent="UniExpert Capstone" version="24.0.0" type="device">
  <diagram id="diag_arch" name="1. System Architecture">
{build_architecture_xml()}
  </diagram>
  <diagram id="diag_usecase" name="2. Use Case Model">
{build_use_case_xml()}
  </diagram>
  <diagram id="diag_erd" name="3. Entity-Relationship (ERD)">
{build_erd_xml()}
  </diagram>
  <diagram id="diag_seq" name="4. Matching Sequence Flow">
{build_sequence_xml()}
  </diagram>
  <diagram id="diag_fsm" name="5. Proposal FSM Lifecycle">
{build_fsm_xml()}
  </diagram>
</mxfile>'''
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Generated {path}")

def main():
    make_single_drawio('uniexpert_architecture.drawio', build_architecture_xml())
    make_single_drawio('uniexpert_use_case.drawio', build_use_case_xml())
    make_single_drawio('uniexpert_erd.drawio', build_erd_xml())
    make_single_drawio('uniexpert_sequence_matching.drawio', build_sequence_xml())
    make_single_drawio('uniexpert_fsm_lifecycle.drawio', build_fsm_xml())
    make_workbook_drawio()
    print("All draw.io files generated successfully!")

if __name__ == '__main__':
    main()
