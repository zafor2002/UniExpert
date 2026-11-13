# UniExpert: Student Dashboard — Design Brief

## 1. Product Summary & Problem Statement
UniExpert is an AI-powered academic capstone collaboration and expert discovery platform tailored for Daffodil International University (DIU), Department of Software Engineering. It provides students and faculty with zero-shot NLP project matching, explainable AI alignment scoring, automated FSM proposal solicitation workflows, and an immutable audit trail adhering to BAETE Criteria 4 & 5 accreditation standards.

> **Problem Statement:** *A final-year software engineering student lead needs a way to seamlessly orchestrate daily capstone milestone deliverables, weekly supervisor consultations, and team task readiness in one unified dashboard because fragmented communication channels and unclear progress states risk advisor friction and BAETE accreditation delays.*

---

## 2. Primary User & Context of Use
- **Primary Persona:** Abu Zafor, Student Project Lead (DIU Software Engineering, Batch 41, Section A).
- **Context:** Managing a complex technical capstone (*Autonomous Edge-AI Healthcare Monitoring via BLE 5.0 Sensor Fusion & TinyML ECG Anomaly Detection*) under primary supervisor Dr. Farhana Rahman (Associate Professor) and industry mentor Engr. Sakib Al Hasan.
- **Environment:** 13" to 16" laptops in campus laboratories, development desks, and home workstations, with secondary mobile access for quick on-campus schedule verification.

---

## 3. Chosen Concept & Mental Model
- **Concept:** **The Asymmetric Execution Cockpit (Workspace-First with Consultation-Deliverable Hybrid)**.
- **Mental Model:** A flight deck / sprint issue tracker (e.g. Linear / Raycast) paired with an academic supervision rail. The left 8 columns drive daily task execution and deliverable verification; the right 4 columns maintain perpetual awareness of defense deadlines, consultation logistics, and linked review targets.

---

## 4. Condensed Core Job Flows
1. **Milestone Execution & Deliverable Verification:**
   - Scan active sprint milestones $\rightarrow$ click deliverable tag to open slide-over drawer $\rightarrow$ inspect version / preview $\rightarrow$ toggle milestone checkbox $\rightarrow$ observe instant progress recalculation.
2. **Consultation Preparation & Launch:**
   - Review right-rail consultation card $\rightarrow$ inspect linked review target deliverable $\rightarrow$ check Room 611 details (Physical) or click "Launch Meeting" (Virtual Google Meet).
3. **FSM Negotiation Revision:**
   - Soft lavender/amber alert banner displays advisor feedback quote $\rightarrow$ student clicks "Revise Proposal Roadmap" $\rightarrow$ opens inline modal to adjust milestones $\rightarrow$ resubmits to supervisor.

---

## 5. Navigation Model & Screen Inventory (Journey Order)

| Section / Component | Journey Role | Primary Action | Content Priority | Visual Classification |
| :--- | :---: | :--- | :--- | :---: |
| **1. Minimal Profile Header** | Identity | View student credentials | 1. Avatar AZ & Name<br>2. ID & Cohort<br>3. BAETE Pill | Supporting |
| **2. 5-Stage Lifecycle Stepper** | Macro Roadmap | Navigate to stage route | 1. Active Supervision step<br>2. Completed line<br>3. Labels | Key Navigation |
| **3. 4-Card Telemetry Row** | Health Signals | Quick scan metrics | 1. Values (3/5, 94%, 100%, 38d)<br>2. Sub-labels<br>3. Icons | Supporting |
| **4. FSM Negotiation Banner** | Alerts (Conditional) | "Revise Proposal Roadmap" | 1. Advisor Quote<br>2. SLA countdown<br>3. Action button | Key Action |
| **5. Active Capstone Card** | **HERO SCREEN** | Toggle milestone checkboxes | 1. Title & Team presence<br>2. Progress bar<br>3. Milestones & Deliverables | **PRIMARY HERO KEY** |
| **6. Deliverable Slide-Over Drawer** | Document Verification | Download / Upload draft | 1. File name & version<br>2. Metadata & download<br>3. Close | Key Drawer |
| **7. Defense Countdown Card** | Deadline Urgency | Review target date | 1. Hero digits (38d)<br>2. Timeline bar<br>3. Target Dec 20 | Key Card (Right Rail) |
| **8. Upcoming Consultations Card** | Meeting Sync | Launch Meet / View Room | 1. Next meeting time<br>2. Room / Meet link<br>3. Review target tag | Key Card (Right Rail) |
| **9. Capstone Governance Card** | Accreditation | Verify BAETE checklist | 1. Criteria 4 & 5 items<br>2. Guidelines link | Supporting (Right Rail) |

---

## 6. Hero Screen to Design First
- **Hero Screen:** The **Active Capstone Workspace Showcase (`/student`)**.
- **Reason:** It is the central operational interface where the student lead spends the majority of their time executing milestones, inspecting deliverables, and tracking live completion percentages.

---

## 7. UX Principles
1. **Information at a Glance:** Crucial logistics (room numbers, meeting times, defense countdown) must be legible within 3 seconds of page load.
2. **Context Over Redirection:** Deliverables open in a slide-over drawer; proposal revisions open in an inline modal without causing a full-page context switch.
3. **Calm Academic Reassurance:** High-stakes capstone deadlines are mediated by eye-friendly soft pastels (`#F4F8FF`, `#FFFFFF`, `#8AB4F8`) and positive mint indicators (`#D1FAE5`).
4. **Transparent Governance:** Every cleared milestone visibly demonstrates progression toward BAETE Criteria 4 & 5 compliance.

---

## 8. Brand, Tone & Design System Tokens

### Palette Tokens
- **Main Canvas Background:** `#F4F8FF` (Ultra-light sky blue)
- **Section / AI Card Background:** `#EAF2FF` (Soft periwinkle)
- **Primary Accent:** `#8AB4F8` (Soft pastel blue)
- **Secondary Accent:** `#A5B4FC` (Soft lavender)
- **Success Indicator:** `#D1FAE5` with `#065F46` text (Soft mint, strictly for success states)
- **Card Surfaces:** `#FFFFFF` (Crisp white with `#E2E8F0` hairline border)
- **Typography:** `#1E293B` (Headings) / `#334155` (Body copy) / `#64748B` (Muted labels)

### Tone & Style
- **Personality:** Minimalist, academic, intelligent, structured, authoritative, calming.
- **Must Never Feel:** Dark, chaotic, cluttered, heavy gradient, gamified, or generic corporate.
- **Corner Radii:** Cards: 16–20px (`rounded-2xl` / `rounded-[20px]`), Buttons & Inputs: 12px (`rounded-xl`), Pills: Full rounded (`rounded-full`).

---

## 9. Platform, Breakpoints & Accessibility
- **Platform:** Responsive React 19 / Vite / Tailwind CSS / TypeScript web application.
- **Breakpoints:**
  - Desktop (`lg: 1024px+`): Asymmetric 2-column grid (8 columns left + 4 columns right).
  - Tablet (`md: 768px - 1023px`): Stacked 2 columns with sticky navigation.
  - Mobile (`< 768px`): Single vertical column; right rail flows naturally beneath active milestones.
- **Accessibility:** WCAG 2.1 AA compliant contrast for all text over pastel cards; screen-reader accessible form controls and ARIA labels on all interactive checkboxes.

---

## 10. Must-Haves vs. Won't-Haves

### Must-Haves
- Retain the approved **Minimal Profile Header** (`Variation1Minimal`).
- Interactive 5-Stage Capstone Lifecycle Stepper with route navigation.
- 4-Card KPI Telemetry Row.
- Active Capstone Showcase with interactive milestone checklist and instant progress updates.
- Slide-over preview drawer for milestone deliverables (`DeliverableDrawer.tsx`).
- Standalone Final Defense Countdown card with visual semester progress bar.
- Upcoming Consultations card with physical room location, virtual Google Meet trigger, and linked review deliverable.
- Contextual FSM negotiation revision alert banner.

### Won't-Haves (Strict Out-of-Scope)
- In-browser code IDE or terminal emulator (out of scope).
- Administrative quota override controls (restricted to Coordinator dashboard).
- Real-time video conferencing engine inside browser (delegated to Google Meet deep links).

