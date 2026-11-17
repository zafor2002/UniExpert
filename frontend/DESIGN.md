# UniExpert: Design System & Full Architecture Specification
**AI-Powered Expert Discovery & Academic Collaboration Platform**  
**Institution:** Daffodil International University (DIU)  
**Accreditation Framework:** BAETE (Board of Accreditation for Engineering and Technical Education) Criteria 4 & 5  
**Version:** 2.0 (High-Fidelity Soft Pastel Academic SaaS)

---

## 1. Executive Summary & Product Vision

UniExpert replaces legacy, static faculty directories with an **AI-driven, problem-first matching ecosystem**. Instead of students blindly emailing faculty members, they submit an unstructured capstone problem statement. UniExpert's multi-stage NLP pipeline:
1. **Extracts core domains and required competencies** with confidence scoring.
2. **Executes dense semantic vector search** via 384-dimensional FastEmbed embeddings against Qdrant vector collections of faculty publications, patents, and syllabi.
3. **Calculates a multi-factor hybrid match score** (45% semantic similarity, 30% technical skill overlap, 15% institutional tier, 10% supervisory bandwidth).
4. **Provides Explainable AI (XAI)** decomposition showing students exactly why an advisor was matched.
5. **Detects team skill deficits ($\Delta K$)** using set-cover optimization and recommends complementary co-advisors.
6. **Enforces a strict Finite State Machine (FSM)** for solicitations with 7-day SLAs, faculty anti-burnout quotas, and immutable SHA-256 cryptographic audit trails.

---

## 2. Visual Design System (Soft Pastel Academic SaaS)

### 2.1 Color Palette & Semantic Roles
The platform uses a minimalist, soft pastel aesthetic designed for extended daily use by students, faculty, and administrators.

| Token | Hex | Tailwind Token | Semantic Usage |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `#F4F8FF` | `bg-main` | Global page background, ultra-light, eye-friendly |
| **Section / AI Background** | `#EAF2FF` | `bg-section` / `card-ai-blue` | Active capstone cards, AI feature modules, navigation highlights |
| **Primary Accent** | `#8AB4F8` | `primary` / `btn-primary` | Primary buttons, active steppers, progress indicators, interactive focus |
| **Secondary Accent** | `#A5B4FC` | `secondary` / `btn-lavender` | Lavender cards (`card-ai-lavender`), secondary badges, FSM negotiation states |
| **Mint Success Accent** | `#A7E8D0` / `#0F766E` | `accent` / `btn-accent` | **Strictly reserved for positive success states** (verified tiers, 100% readiness, cleared milestones, valid cryptographic chain) |
| **Card Surface** | `#FFFFFF` | `card` | Pure white cards with subtle hairline borders and soft elevation |
| **Hairline Border** | `#E2E8F0` | `border-[#E2E8F0]` | Subtle dividers (`1px`), table row borders, card outlines |
| **Primary Typography** | `#1E293B` | `text-[#1E293B]` | High-contrast headings and prominent values (WCAG 2.1 AA compliant) |
| **Body Typography** | `#334155` | `text-[#334155]` | Main body copy, table data cells, form labels |
| **Muted Metadata** | `#64748B` | `text-[#64748B]` | Subtitles, time stamps, secondary descriptions |

### 2.2 Typography Hierarchy
- **Font Family:** `Inter`, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
- **Scale:**
  - `Display / Hero Title`: `32px` (2rem), bold, line-height `1.2`, tracking `-0.025em`
  - `Page Heading (H1)`: `24px` (1.5rem), bold, line-height `1.3`, tracking `-0.02em`
  - `Section Heading (H2)`: `18px` (1.125rem), semibold, line-height `1.4`, tracking `-0.015em`
  - `Card Title (H3)`: `15px` (0.9375rem), semibold, line-height `1.4`
  - `Body Text`: `13px` - `14px`, regular / medium, line-height `1.5`
  - `Small / Metadata`: `11px` - `12px`, regular / semibold, line-height `1.4`
  - `Code / Hashes / Tokens`: `10px` - `11px`, font-mono (`SFMono-Regular`, Menlo, Consolas)

### 2.3 Geometry & Elevation
- **Border Radii:**
  - Primary Cards: `24px` (`rounded-3xl`)
  - Sub-cards & Interactive Tiles: `16px` (`rounded-2xl`)
  - Buttons & Inputs: `12px` (`rounded-xl`)
  - Badges & Pills: `9999px` (`rounded-full`)
- **Shadows:**
  - Subtle Card Elevation: `0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)`
  - Elevated Dropdown / Modal: `0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`

---

## 3. Platform Roles & Permission Matrix

UniExpert enforces role-based access control (RBAC) across 6 distinct institutional personas:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        UniExpert Platform RBAC                         │
├────────────────────┬───────────────────────────────────────────────────┤
│ Role               │ Core Responsibilities & Workflow Scope            │
├────────────────────┼───────────────────────────────────────────────────┤
│ 1. Student Lead    │ Submit proposals, review AI entities, discover   │
│                    │ advisors, run skill gaps, track FSM solicitations │
│ 2. Faculty Advisor │ Manage quota (1-10), ORCID sync, review inbound   │
│                    │ solicitations (Accept/Negotiate/Decline), sync OH │
│ 3. Industry Mentor │ Co-supervise, provide DevOps/cloud toolchains     │
│ 4. Coordinator     │ Oversee department load, resolve quota overrides, │
│                    │ verify faculty tiers (1/2/3), mediate disputes    │
│ 5. Administrator   │ Manage domain DAG taxonomy, cycle detection,      │
│                    │ re-index Qdrant vectors, configure RBAC           │
│ 6. Auditor (Read)  │ Verify SHA-256 Merkle audit trail, export BAETE   │
│                    │ Criterion 4 & 5 compliance accreditation dossiers │
└────────────────────┴───────────────────────────────────────────────────┘
```

---

## 4. Comprehensive Screen-by-Screen Specification (All 34 Screens)

### Module A: Public & Authentication

#### Screen 1: Public Landing Page (`/`)
- **Hero Section:** "Describe your problem. Find your expert." Minimalist header with live problem formulation teaser.
- **3-Step How-It-Works Flow:**
  1. *Submit Unstructured Problem Statement* (FastEmbed NLP extracts technical entities).
  2. *Discover Ranked Advisors* (Multi-factor semantic & skill matching in <40ms).
  3. *Supervise & Clear Milestones* (BAETE accredited collaborative workspace).
- **Core Feature Grid:** Light blue and lavender cards detailing Explainable AI (XAI), Set-Cover Skill Gap Analysis ($\Delta K$), Anti-Burnout Quotas, and Cryptographic Audit Trails.
- **Header Actions:** Direct navigation to Login (`/login`) and Register (`/register`).

#### Screen 2: User Registration (`/register`)
- **Role Selector:** 6 selectable role cards with real-time feedback.
- **Institutional Email Validation:** Client-side regex checking mandatory `@diu.edu.bd` institutional domains.
- **Dynamic Password Strength Meter:** Evaluates length, numbers, symbols, and uppercase characters with colored progress bar.
- **Feedback States:**
  - *Success Toast:* `"Account registered successfully. Please verify your institutional email."`
  - *Error Toast:* `"Registration failed: Email address already registered or invalid institutional domain."`

#### Screen 3: Email Verification (`/verify-email`)
- **Token Input:** 6-box segmented numeric PIN input with automatic focus forwarding.
- **Timer:** 24-hour token expiration countdown.
- **Resend Action:** Simulated token regeneration with cooling timer.
- **Expired State Simulation:** Toggle testing expired token error states.

#### Screen 4: Login & Multi-Factor Authentication (`/login`)
- **Credentials:** Institutional email and password fields with visibility toggle.
- **Lockout Mechanism:** 5 consecutive failed attempts triggers an automated 15-minute countdown lockout state.
- **MFA Step:** Admin and Coordinator logins automatically prompt a 6-digit TOTP hardware token verification modal.
- **Success State:** `"Authentication successful."` toast with redirect to role-specific dashboard.

---

### Module B: Student Project Lead Workflow

#### Screen 5: Student Dashboard (`/student`)
- **Academic Profile Header:** Student avatar badge, student ID (`232-35-331`), Batch 41 (Section A), and BAETE Criterion 4 & 5 compliance indicator.
- **5-Stage Capstone Lifecycle Stepper:** Interactive visual roadmap: *Problem Formulation* → *Advisor Matching* → *Active Supervision (Active)* → *Defense Ready* → *Completed*.
- **KPI Metric Grid (`MetricCard.tsx`):**
  - *Lifecycle Status:* Stage 3 of 5 (Active Supervision).
  - *Primary Advisor Match:* 94% Alignment (Dr. Farhana Rahman).
  - *Team Skill Coverage:* 100% Core Competency (0 critical gaps).
  - *Defense Countdown:* Real-time day counter to Dec 20, 2026.
- **Active Project Card:** Live milestone progress bar, interactive milestone checkboxes with instantaneous completion toggling, and direct workspace link.
- **FSM Solicitation Banner:** Real-time feedback quote from advisor during negotiation state with a one-click response button.
- **Upcoming Consultations & Alert Feed:** Physical vs virtual session tags, Google Meet links, and relative timestamps.

#### Screen 6: Student Profile & Skill Matrix (`/student/profile`)
- **Profile Completion Ring:** SVG radial progress indicator (e.g. 78% complete).
- **Academic Credentials:** Degree program, current semester, capstone project track.
- **Online Portfolio Links:** GitHub and LinkedIn handles with direct external link previews.
- **Interactive Skill Matrix:** Tag-based technical skills manager with chip dismissal and real-time addition.
- **Curriculum Vitae Upload:** Drag-and-drop PDF upload with strict 5 MB file size limit enforcement.

#### Screen 7: New Capstone Proposal Formulation (`/student/proposals/new`)
- **Title Input:** Project proposal working title.
- **Unstructured Problem Statement Textarea:** Real-time character counter enforcing 50 to 5,000 characters with visual thresholds.
- **Analyze Action:** "Analyze Problem Formulation" triggering simulated zero-shot NLP entity extraction.

#### Screen 8: Entity Review & Requirement Calibration (`/student/entity-review`)
- **Domain Extraction:** Top 3 predicted domains with confidence bars (threshold $\ge 0.65$; values below display a "Tentative" warning badge).
- **Extracted Skill Chips:** Autocomplete skill chips with three-level importance sliders:
  - *Low (0.3)*
  - *Medium (0.7)*
  - *High (1.0)*
- **Validation Guard:** `"At least one technical skill is required for matching."`
- **Proceed Action:** "Confirm Requirements & Find Advisors" navigating to discovery results.

#### Screen 9: Advisor Discovery Results (`/student/discovery`)
- **Filter Sidebar:** Multi-parameter filtering by Department, Verification Tier (1/2/3), Availability, and Industry Mentor Only. Filter states persist across page reloads.
- **Fallback Banner Variant:** Displays `"Displaying keyword-matched results."` when vector search falls back to BM25.
- **Ranked Expert Cards:**
  - Avatar, full name, academic title, department.
  - Credential Tier badge (Tier 1/2/3).
  - Match Score Ring (e.g. `94% Match`).
  - Matched skills in green chips, missing prerequisites in gray.
  - Supervisory Quota badge (e.g. "2 of 5 slots used").
  - "Supervisory Quota Full for Current Semester (Co-Advisory or Consultation Only)" banner on full cards.
- **Card Actions:** "Why this match?" (opens XAI drawer), "Compare" checkbox (up to 3 candidates), and "Send Advisory Proposal".

#### Screen 10: Explainable AI (XAI) Drawer (`XAIDrawer.tsx`)
- **Decomposition Formula Breakdown (Sums to exactly 100%):**
  - *45% Semantic Vector Similarity:* Displays 3 matched publication abstracts with Cosine similarity values.
  - *30% Skill Overlap:* Green matched chips vs red missing prerequisites.
  - *15% Credential Tier Weight:* Points granted for verified faculty publications/h-index.
  - *10% Supervisory Bandwidth:* Current quota headroom.
- **Proficiency Radar Chart:** Requirements vector vs expert publication vector across 5 axes.
- **Contextual Hint:** `"Strong practical toolchain overlap; limited recent publication history in this exact domain."`

#### Screen 11: Side-by-Side Expert Comparison (`/student/comparison`)
- **Comparative Table (2 to 3 experts):** Compares Match Score, Matched Skills, Deficit Skills, Citations, h-index, Recent Publications (past 3 years), Available Capacity, Office Hours, and Student Rating.
- **Differential Highlighting:** Cells with superior metrics are highlighted in soft mint.
- **Constraint Error:** `"You can compare a maximum of 3 candidates simultaneously."`

#### Screen 12: Team Skill Gap Analysis ($\Delta K$) (`/student/skill-gap`)
- **Mathematical Model:** Evaluates required project skills ($K_{req}$) against team member skills ($K_{team}$).
- **Team Readiness Metric ($R_{team}$):** Percentage score displayed on animated radial gauge.
- **Skill Breakdown:** Covered skills in soft mint chips; missing prerequisites in soft rose chips.
- **Critical Alert Banner:** `"Critical Domain Deficit Detected: 60% of biological prerequisites unaddressed."`
- **100% Variant:** `"100% Team Skill Coverage — Ready for Implementation"` green banner.

#### Screen 13: Co-Advisor Optimizer (`/student/optimizer`)
- **Set-Cover Simulation Card:** Algorithmic simulation stating: *"Adding Dr. Tanvir Ahmed (Bioinformatics) increases team coverage from 40% to 92%."*
- **Before / After Bar Chart:** Visualizes delta in coverage upon adding recommended co-advisor.
- **Direct Proposal Action:** "Propose Co-Advisory Collaboration".

#### Screen 14: Advisory Proposal Modal (`/student/proposal-modal`)
- **Pre-filled Synopsis:** Auto-populated from problem formulation.
- **AI Alignment Score:** Displayed in prominent header badge.
- **Milestone Roadmap Builder:** Add/remove milestone rows with title, deliverable, and due date.
- **Commitment Settings:** Weekly student hours commitment (e.g. 15 hrs/wk), meeting frequency.
- **Supervisory Scope Toggle:** Primary Supervisor vs Co-Advisor.
- **Race Condition Guard:** Simulates error: `"Professor's quota was filled by another group."`

#### Screen 15: My Requests & FSM Tracker (`/student/requests`)
- **Horizontal State Machine Stepper:**
  $$\text{Draft} \longrightarrow \text{Submitted} \longrightarrow \text{Under Review} \longrightarrow \text{Negotiation} \longrightarrow \begin{cases} \text{Accepted} \\ \text{Declined} \\ \text{Expired} \end{cases}$$
- **Negotiation Thread:** Shows advisor feedback and revision input box with "Re-submit revised roadmap".
- **7-Day Auto-Response Timer:** Real-time countdown to expiration.
- **Expired State Handling:** Suggests next-best alternative advisors ranked by vector similarity.

#### Screen 16: Consultation Scheduler (`/student/scheduler`)
- **Weekly Calendar Grid:** Advisor's available recurring 30-minute slots.
- **Mandatory Agenda Field:** Validation requiring discussion points before confirmation.
- **File Attachments:** Upload slide decks or documents.
- **Booking Output:** Instant confirmation with `.ics` calendar file download and Google Meet link.
- **Concurrency Collision Error:** `"Slot was just booked by another team."`

#### Screen 17: Collaborative Project Workspace (`/student/workspace`)
- **Milestone Tracker:** Interactive milestone checklists and deliverable status.
- **WebSocket Discussion Feed:** Simulated real-time chat with user bubbles in soft blue and advisor bubbles in light gray.
- **Artifact Repository:** PDF/DOCX/ZIP attachments with 25 MB limit validation.

#### Screen 18: Post-Collaboration Evaluation (`/student/post-evaluation`)
- **BAETE Rubric Sliders (1 to 5 scale):** Responsiveness, Technical Guidance Depth, Milestone Adherence.
- **Endorsement Badges:** Faculty endorses student skills (e.g. "TinyML", "Embedded C").

---

### Module C: Faculty Advisor Workflow

#### Screen 19: Faculty Dashboard (`/faculty`)
- **Academic Header & ORCID Badge:** Dr. Farhana Rahman (Associate Professor), h-index: 7, Tier 1 Verified.
- **Supervisory Anti-Burnout Quota Meter:** Visual progress bar (e.g. 2 of 5 slots used) with warning threshold at 80%.
- **Inbound Solicitation Queue:** Summary of proposals awaiting review.
- **Active Supervised Groups:** Direct access to student project workspaces.

#### Screen 20: Research Portfolio & ORCID Sync (`/faculty/portfolio`)
- **Identifier Inputs:** ORCID iD and Google Scholar profile ID.
- **Sync Progress Stepper:** `Queued` $\rightarrow$ `Fetching Metadata` $\rightarrow$ `Parsing Citations` $\rightarrow$ `Vector Indexed`.
- **Publication Ledger:** Searchable list of indexed papers with citation counts and abstracts.
- **Failure Recovery:** Manual BibTeX / CSV upload option when APIs fail.

#### Screen 21: Credential Tier Card (`/faculty/portfolio#tier`)
- **Tier Assessment Display:** Shows Tier 1, 2, or 3 status with remaining publications and citations required for next level.

#### Screen 22: Incoming Proposal Review (`/faculty/proposals`)
- **Proposal Dossier:** Project synopsis, student profiles, milestone schedule, and AI match score.
- **Review Actions:**
  - *Accept:* Decrements available quota slots by 1 with success toast.
  - *Request Negotiation:* Opens condition textbox for required roadmap changes.
  - *Decline:* Mandatory rejection rationale dropdown and note.

#### Screen 23: Advisory Capacity & Quotas Settings (`/faculty/capacity`)
- **Quota Stepper:** Numeric input (1 to 10 groups). Enforces `"Invalid quota value: Must be between 1 and 10 groups."`
- **Blackout Date Range Picker:** Sets sabbaticals, grading leaves, or conference blackout windows.
- **Availability State Preview:** Live badge toggling between *Available*, *Nearing Quota*, *Quota Reached*, and *Blackout*.

#### Screen 24: Advisory Calendar Settings (`/faculty/calendar`)
- **Recurring Office Hours:** Weekly slot manager (e.g. Tuesdays 14:00 - 16:00).
- **Daily Consultation Limit:** Prevents more than 4 consultations per calendar day.

---

### Module D: Industry Mentor Workflow

#### Screen 25: Mentor Onboarding & Dashboard (`/mentor`)
- **Practitioner Credentials:** Company, industry role (e.g. Principal Cloud Architect), years of experience.
- **Toolchain Chips:** Verified cloud and DevOps toolchain (AWS, Kubernetes, Terraform, Docker, CI/CD).
- **Mentorship Bandwidth:** Dedicated 2 to 4 hours/month commitment tracker.
- **Inbound Co-Advisory Requests:** Review and accept practical architectural guidance requests.

---

### Module E: Department Capstone Coordinator Workflow

#### Screen 26: Supervisory Allocation Dashboard (`/coordinator`)
- **Faculty Workload Heatmap:** Recharts vertical bar chart displaying allocated groups vs institutional cap for all faculty.
- **Overloaded Highlights:** Faculty at 5/5 slots highlighted in rose with an alert banner.
- **Unallocated Student Teams Queue:** List of unassigned groups with one-click "Assign Co-Advisor" action.
- **60-Second Auto-Refresh:** Animated countdown timer simulating live departmental telemetry.

#### Screen 27: Faculty Accreditation & Verification Queue (`/coordinator/verification`)
- **Verification Review:** Profile, publication history, Google Scholar citations, and h-index.
- **Tier Assignment Selector:** Radio selection for Tier 1, 2, or 3.
- **Audited Justification Note:** Mandatory textarea required for accreditation record before approval.

#### Screen 28: Quota Policy & Administrative Override (`/coordinator/quota-policy`)
- **Department Baseline Setter:** Sets department-wide standard quota (default 5).
- **Individual Override (+1):** Authorize capacity increase with mandatory academic justification.
- **Active Overrides Table:** Audit trail of all approved quota exceptions.

#### Screen 29: Disputes & Expired-Request Resolution (`/coordinator/disputes`)
- **Mediation Queue:** Stalled solicitations, expired SLAs, and team-advisor disagreements.
- **Administrative Actions:** "Schedule Mediation" or "Execute Administrative Reassignment".

---

### Module F: System Administrator Workflow

#### Screen 30: Academic Taxonomy & Moderation Console (`/admin/taxonomy`)
- **Hierarchical DAG Tree:** Interactive collapsible domain tree (e.g. Embedded Systems $\rightarrow$ TinyML $\rightarrow$ CMSIS-NN).
- **Cycle Detection Engine:** Visual alert banner simulating: `"Circular dependency detected between domain nodes: [Natural Language Processing] → [Machine Learning] → [NLP Transformer Architectures] → [Natural Language Processing]."`
- **Vector Re-Indexing Engine:** "Re-Index Academic Embeddings" button with animated progress bar updating FastEmbed vectors.
- **Custom Tag Moderation Queue:** Review, merge, or approve student-submitted tags into canonical taxonomy.

#### Screen 31: Role-Based Access Control (RBAC) Management (`/admin/rbac`)
- **User Directory Table:** Search and filter by name, institutional email, or role.
- **Role Assignment Dropdown:** Promote/demote user across all 6 platform roles.
- **Account State Toggle:** Lock or unlock accounts with immediate state update.

#### Screen 32: System Health & Vector Diagnostics (`/admin/health`)
- **Telemetry Metric Cards:**
  - *Cluster Availability:* 99.8% (Target: 99.5% SLA).
  - *Qdrant p95 Latency:* 38 ms (Target: < 200 ms).
  - *NLP Queue Depth:* 0 Jobs (Zero backlog spill).
  - *Snapshot Backup:* 3 Hours Ago (SHA-256 verified).
- **24-Hour Latency Trend Line Chart:** Responsive time-series chart of query response times.
- **NLP Fallback Event Log:** BM25 keyword fallback log when vector latency spikes.
- **MFA-Protected Operations Area:** Requires 6-digit TOTP code (`123456`) before unlocking destructive operations (snapshot purge, queue flush).

---

### Module G: Institutional Auditor & Governance Workflow

#### Screen 33: Cryptographic Append-Only Audit Trail (`/auditor/audit-trail`)
- **Merkle Hash-Chained Ledger:** Table logging every `FSM_STATE_TRANSITION`, `PROPOSAL_CREATED`, and `FACULTY_TIER_UPDATED`.
- **Integrity Validation Badge:** Displays `"Hash Chain: VALID"` in mint green.
- **Interactive Tamper Simulation:** "Simulate Tamper" button intentionally corrupts Block #2 hash pointer, triggering an immediate alert banner: `"Cryptographic hash chain violation detected! Block #2 parent hash mismatch."`
- **Re-verify Action:** Rebuilds Merkle tree and restores valid cryptographic integrity.
- **Export Signed CSV:** Generates and downloads cryptographically signed audit log.

#### Screen 34: Accreditation & Governance Reports (`/auditor/reports`)
- **Report Generator Controls:** Select Report Formulation (Supervisory Allocation Summary vs Interdisciplinary Research Velocity), Academic Term, Department Scope, and Format (PDF vs CSV).
- **Empty State Simulation:** Spring 2025 generates an empty state with polite notice.
- **Official BAETE Dossier Preview:**
  - Daffodil International University institutional letterhead.
  - Summary table of faculty workloads, tier weights, and capacity clearance.
  - Supervisory student distribution bar chart.
  - "Export Official Signed PDF" action with instant download toast.

---

## 5. Mathematical & Algorithmic Foundations

### 5.1 Hybrid Advisor Match Score Formula
For any capstone proposal $P$ and faculty candidate $F$, the aggregate match score $S(P, F) \in [0, 100]$ is computed as:

$$S(P, F) = 0.45 \cdot S_{\text{vector}}(P, F) + 0.30 \cdot S_{\text{skills}}(P, F) + 0.15 \cdot S_{\text{tier}}(F) + 0.10 \cdot S_{\text{bandwidth}}(F)$$

Where:
- $S_{\text{vector}} = \max_{j} \cos(\vec{v}_P, \vec{v}_{F, j}) \times 100$ (Cosine similarity across publication vectors).
- $S_{\text{skills}} = \frac{|K_{req} \cap K_F|}{|K_{req}|} \times 100$ (Weighted technical competency overlap).
- $S_{\text{tier}} = \frac{\text{Tier}(F)}{3} \times 100$ (Institutional accreditation level).
- $S_{\text{bandwidth}} = \left(1 - \frac{\text{SlotsUsed}(F)}{\text{SlotsTotal}(F)}\right) \times 100$ (Anti-burnout headroom).

### 5.2 Team Skill Gap & Set-Cover Formulation
Let $K_{req} = \{s_1, s_2, \dots, s_n\}$ be the required project competencies with weights $w(s_i)$. The team competence is $K_{team} = \bigcup_{m \in M} K_m$.
The skill deficit is:
$$\Delta K = K_{req} \setminus K_{team}$$
The team readiness index $R_{team} \in [0, 1]$ is:
$$R_{team} = \frac{\sum_{s \in K_{req} \cap K_{team}} w(s)}{\sum_{s \in K_{req}} w(s)}$$
The Co-Advisor Optimizer solves a weighted set-cover problem finding candidate $A^*$ that maximizes marginal coverage:
$$A^* = \arg\max_{A} \sum_{s \in \Delta K \cap K_A} w(s)$$

---

## 6. Project Architecture & File Links

```
uniexpert-prototype/
├── components.json                  # shadcn/ui configuration
├── tailwind.config.js               # Soft pastel color tokens
├── vite.config.ts                   # Path alias (@/*) and build settings
├── tsconfig.app.json                # TypeScript compiler options
├── src/
│   ├── index.css                    # Design system classes, focus states, scrollbars
│   ├── main.tsx                     # React 19 root bootstrap
│   ├── App.tsx                      # React Router configuration (34 screens)
│   ├── types/index.ts               # Core data models, FSM states, roles
│   ├── lib/utils.ts                 # shadcn cn() classname merge utility
│   ├── data/mockData.ts             # Rich mock records for DIU faculty & capstones
│   ├── context/AppContext.tsx        # Global state provider for proposals, alerts, & roles
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx        # Master shell with responsive sidebar & topbar
│   │   │   ├── TopBar.tsx           # White navbar with search, notifications, & user menu
│   │   │   ├── Sidebar.tsx          # Responsive navigation sidebar
│   │   │   ├── Footer.tsx           # Minimalist academic footer
│   │   │   └── DemoRoleSwitcher.tsx # Instant 6-role testing switcher
│   │   └── shared/
│   │       ├── MetricCard.tsx       # Reusable 6-variant KPI tile
│   │       ├── PageHeader.tsx       # Standardized academic header
│   │       ├── EmptyState.tsx       # Standardized actionable empty state
│   │       ├── ScoreRing.tsx        # Radial animated percentage gauge
│   │       ├── SkillChip.tsx        # Semantic skill tag with dismiss
│   │       ├── StatusBadge.tsx      # Semantic status indicator
│   │       ├── ConfirmDialog.tsx    # Radix accessible confirmation modal
│   │       ├── LoadingSkeleton.tsx  # Pastel animated loading placeholders
│   │       └── NotificationDropdown.tsx # Real-time notification feed popover
│   └── pages/
│       ├── public/                  # Screens 1-4 (Landing, Login, Register, Verify)
│       ├── student/                 # Screens 5-18 (Student Lead workflows)
│       ├── faculty/                 # Screens 19-24 (Faculty Advisor workflows)
│       ├── mentor/                  # Screen 25 (Industry Mentor workflows)
│       ├── coordinator/             # Screens 26-29 (Department Coordinator workflows)
│       ├── admin/                   # Screens 30-32 (System Admin workflows)
│       └── auditor/                 # Screens 33-34 (Governance & Auditor workflows)
```

---

## 7. Verification & Production Build

The entire application compiles cleanly with zero TypeScript errors:
```bash
npm run build
# Output: ✓ 2867 modules transformed. built in 2.13s
```
To run the live interactive prototype:
```bash
npm run dev
# Live at http://localhost:5173
```

