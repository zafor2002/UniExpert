# UniExpert: Student Dashboard — Requirements

## Summary
The UniExpert Student Dashboard is the central command center for final-year undergraduate software engineering students at Daffodil International University (DIU). It empowers Student Project Leads to orchestrate their capstone journey from initial problem formulation through weekly advisory consultations, deliverable milestone verification, and defense readiness. Designed in a soft pastel academic SaaS visual style, it ensures full transparency, eliminates supervisory friction, and guarantees compliance with BAETE (Board of Accreditation for Engineering and Technical Education) Criteria 4 & 5.

## Problem framing

### Problem statement
A final-year software engineering student lead needs a way to seamlessly orchestrate daily capstone milestone deliverables, weekly supervisor consultations, and team task readiness in one unified dashboard because fragmented communication channels and unclear progress states risk advisor friction and BAETE accreditation delays.

### Primary user snapshot
- **Persona:** Abu Zafor, Student Project Lead (DIU Department of Software Engineering, Batch 41, Section A).
- **Context:** Managing a complex technical capstone (BLE 5.0 GATT Firmware & Quantized TinyML 1D-CNN ECG Detection) while coordinating team tasks, preparing for weekly supervisor meetings, and adhering to strict academic milestones.
- **Pain Points:** Unclear deliverable verification states, anxiety around upcoming defense dates, and disconnected feedback loops during proposal negotiation.

### Key scenarios
1. **Daily Milestone Execution:** The student lead logs in in the morning, reviews the remaining days to final defense, inspects current sprint deliverables, opens an inline slide-over preview to verify the latest document version, and checks off completed tasks.
2. **Supervisory Sync Preparation:** Fifteen minutes prior to a scheduled consultation (e.g. Tuesday 14:00 with Dr. Farhana Rahman), the student checks the right-rail consultation card to review room details (Room 611) or click the virtual Google Meet link with pre-filled agenda discussion items.
3. **FSM Negotiation & Revision Response:** When a faculty advisor requests a roadmap adjustment during the negotiation state, an inline soft lavender/amber alert card surfaces the advisor's feedback, enabling the student lead to revise and resubmit the roadmap with a single click.

### How might we
1. **HMW 1:** How might we make weekly milestone progress and deliverable health immediately obvious at a glance without visual clutter?
2. **HMW 2:** How might we keep consultation times and defense countdowns in perpetual view while students interact with active project tasks?
3. **HMW 3:** How might we reinforce BAETE Criterion 4 & 5 compliance confidence continuously as milestones are cleared?

## Problem
In modern academic capstone programs, students struggle with fragmented workflows: proposals reside in email threads, meeting schedules are disorganized, milestone deliverables get lost in cloud drives, and teams lack visibility into whether their work aligns with institutional accreditation standards. UniExpert unifies this experience into a cohesive, problem-first academic platform.

## Goals and success metrics
- **On-Time Milestone Clearance:** $\ge 90\%$ of scheduled project milestones cleared before target due dates.
- **Consultation Attendance:** $100\%$ punctuality for weekly scheduled faculty syncs via clear calendar and room cues.
- **FSM Response SLA:** Revision turnaround under 48 hours when faculty requests roadmap changes.
- **Accreditation Readiness:** $100\%$ verification of BAETE Criteria 4 & 5 documentation requirements prior to final defense scheduling.

## Users

### Primary user
- **Role:** Student Project Lead (undergraduate senior).
- **Responsibilities:** Setting up milestones, submitting deliverables, coordinating team members, attending faculty office hours, and tracking defense readiness.

### Secondary users
- **Capstone Team Members:** View project roadmap, review consultation agendas, and observe verified milestones.
- **Faculty Advisor:** Conducts weekly reviews, endorses deliverables, schedules office hours, and evaluates progress against BAETE rubrics.
- **Capstone Coordinator:** Monitors departmental progress and intervenes in stalled FSM proposals.

### Roles and permissions
- **Student Lead (Edit):** Can check off milestones, upload/replace deliverable documents, submit revised proposal roadmaps, and schedule/cancel consultations.
- **Team Members (Read-Only/Collaborative):** Live read access to all dashboard telemetry, milestone states, and upcoming meeting links.

### Context of use
- **Primary Devices:** 13" to 16" laptops (macOS, Windows, Linux) during lab sessions, library study, and home development.
- **Secondary Devices:** Campus lab desktop monitors (1080p/1440p) and mobile smartphones for quick schedule checks on campus.

## Core jobs (ranked)
1. **Track and Check Off Milestones:** Real-time visibility into capstone progress, deliverables, due dates, and completion status.
2. **Prepare for & Attend Supervisory Syncs:** Clear display of physical room numbers, virtual meeting links, advisor names, and scheduled times.
3. **Monitor Defense Timeline & BAETE Standing:** Perpetual awareness of days remaining until the December 20, 2026 defense window and accreditation eligibility.
4. **Respond to Advisor Feedback:** Review and act upon FSM negotiation notes without losing project context.
5. **Inspect & Manage Deliverables:** Access file artifacts (`SRS Document v1.0`, `CMSIS-NN Report`) via quick preview.

## Scope

### Must have
- Minimal Profile Header displaying student identity, student ID (`232-35-331`), batch, and BAETE eligibility badge.
- Interactive 5-Stage Capstone Lifecycle Stepper (*Problem Formulation* $\rightarrow$ *Advisor Matching* $\rightarrow$ *Active Supervision* $\rightarrow$ *Defense Ready* $\rightarrow$ *Completed*).
- Asymmetric 2-column layout (8-column main workspace feed + 4-column right utility rail).
- 4-Card KPI Telemetry Row (Lifecycle Stage, Primary Advisor Match Alignment, Team Skill Coverage, Final Defense Countdown).
- Active Capstone Showcase with interactive milestone checklist, deliverable preview drawer triggers, and progress bar.
- Standalone Final Defense Countdown card on the right rail.
- Upcoming Consultations widget with physical vs. virtual badges, room locations, and action links.
- Contextual FSM negotiation revision alert banner.

### Should have
- Slide-over preview drawer for milestone deliverables showing file name, file size, upload timestamp, and download link.
- Team member presence avatar chips on the active project card.
- Quick action navigation shortcuts to Advisor Discovery, Team Skill Gap, and Project Workspace.

### Won't have (this version)
- Full in-browser code editor or direct Git repository commit viewer (handled via external GitHub links).
- Administrative department-wide policy controls (restricted to Coordinator/Admin portals).
- Real-time peer-to-peer audio/video streaming (delegated to external Google Meet integration).

## Content and data
- **Student Profile:** Abu Zafor, ID `232-35-331`, Batch 41 (Section A), Department of Software Engineering, DIU.
- **Active Capstone:** *"Autonomous Edge-AI Healthcare Monitoring via BLE 5.0 Sensor Fusion & TinyML ECG Anomaly Detection"*.
- **Supervisor:** Dr. Farhana Rahman (Associate Professor, Tier 1 Verified, 94% Match Alignment).
- **Co-Advisor / Mentor:** Engr. Sakib Al Hasan (Industry Mentor, Cloud Architect).
- **Milestones Dataset:** 4 structured milestones with deliverables (`SRS Document v1.0`, `Cortex-M4 Embedded C Codebase`, `CMSIS-NN 8-bit Benchmark Report`, `BAETE Criterion 4 & 5 Dossier`).
- **Consultation Schedule:** Weekly Tuesday 14:00 (Room 611) and Thursday 19:30 (Google Meet).

## Platform and integrations
- **Framework:** React 19, TypeScript 5.7+, Tailwind CSS 3.4+, Vite 8, shadcn/ui.
- **Responsive Breakpoints:** Mobile (`< 768px`), Tablet (`768px - 1024px`), Desktop (`> 1024px`).
- **Third-Party Deep Links:** Google Meet consultation URLs, GitHub repository links, DIU Student Portal SSO.

## Constraints
- **Design Tokens:** Strict adherence to the soft pastel academic SaaS color palette:
  - Main Background: `#F4F8FF`
  - Section / AI Background: `#EAF2FF`
  - Primary Accent: `#8AB4F8`
  - Secondary Accent: `#A5B4FC`
  - Success Badge: `#D1FAE5` (with `#065F46` text)
  - Card Surfaces: `#FFFFFF`
  - Text: `#1E293B` (Headings) / `#334155` (Body) / `#64748B` (Muted)
  - Hairline Borders: `#E2E8F0`
- **Component Geometry:** 16px to 20px rounded corners, subtle shadows, WCAG 2.1 AA contrast.
- **Zero Functionality Regressions:** Preserve existing routing, state machines, and mock data integrations.

## Brand and tone
- **Personality:** Minimalist, academic, reassuring, intelligent, structured, authoritative.
- **Must never feel:** Cluttered, overwhelming, dark, chaotic, corporate generic, or gamified with loud gradients.
- **References:** Linear (subtle borders, modular rails), Stripe (crisp typography, whitespace), Notion/Craft (clean document hierarchy).

## Lifecycle
- **Day 1 (New Project):** If unassigned or pre-proposal, surfaces an onboarding callout guiding student to formulate their initial problem statement.
- **Day 100 (Active Supervision):** Renders the full 2-column asymmetric execution cockpit with active milestones, consultation cards, and defense countdown.
- **Post-Defense:** Transitions to defense signoff, peer evaluations, and official BAETE archive export.

## Edge cases and states
- **FSM Negotiation Revision State:** Surfaced via an inline soft lavender/amber card immediately above the workspace feed with the advisor's feedback quote and revision action.
- **Imminent Consultation (<24 Hours):** Displays an active indicator on the consultation card with instant Google Meet link.
- **All Milestones Cleared (100% Progress):** Project card toggles to a celebration state: *"All Sprint Milestones Cleared — Ready for Pre-Defense Thesis Verification"*.
- **Empty Consultations:** Actionable empty state with *"Schedule Office Hours Consultation"* button leading to `/student/scheduler`.

## Assumptions (signed off)
1. The **Minimal Profile Header** approved by the user is the permanent welcome header.
2. The **2-Column Asymmetric Grid (8/4 split)** organizes the page: Left = Main Active Feed (Milestones & Deliverables); Right = Utilities, Final Defense Countdown, Consultations, and Quick Shortcuts.
3. Deliverables open in an accessible slide-over drawer (`DeliverableDrawer.tsx`) without page reloads.

## Open questions
- None. All requirements, user personas, layout grids, and edge cases have been resolved and approved.

## Decision log
| Decision | Options considered | Chosen | Why |
|---|---|---|---|
| Primary Daily Job | Execution vs Communication vs Governance | Daily Capstone Execution | Students visit daily to check sprint deliverables, unblock tasks, and prep for meetings |
| Page Layout Architecture | Asymmetric 2-Column vs Modular Card Matrix vs Linear Roadmap | Asymmetric 2-Column Grid (8/4 split) | Separates working milestone stream from persistent calendar & countdown utilities |
| Deliverables Interaction | Slide-Over Drawer vs Direct Download vs Page Redirect | Inline Deliverable Chips with Slide-Over Drawer | Preserves dashboard context while offering document details and version controls |
| Scope Expansion | Core Refresh vs Enhanced Depth vs Full Suite | Enhanced Milestone & Team Depth | Delivers high value with teammate presence and deliverable drawers without scope bloat |
| Welcome Header Style | Minimal vs Gradient vs Split vs Premium Banner | Minimal Profile Header | User selected Variation 1 for clean, understated Scandinavian academic SaaS aesthetic |

