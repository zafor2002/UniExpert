import React from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  Zap,
  BookOpen,
  Shield,
  GitBranch,
  Lock,
  Search,
  TrendingUp,
  GraduationCap,
  Briefcase,
  Eye,
  LayoutDashboard,
  UserCheck,
  ArrowRight,
  CheckCircle,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

const stats = [
  { label: 'Capstone Groups', value: '142' },
  { label: 'Faculty Experts', value: '200+' },
  { label: 'Student Teams', value: '500+' },
  { label: 'Search Speed', value: '38ms' },
];

const steps = [
  {
    num: '01',
    icon: <BookOpen className="w-6 h-6 text-[#3B75DE]" />,
    title: 'Describe Your Problem',
    desc: 'Paste your unstructured capstone problem statement. No keyword tuning needed — just natural language.',
    badge: 'NLP Ingestion',
  },
  {
    num: '02',
    icon: <Brain className="w-6 h-6 text-[#4F46E5]" />,
    title: 'AI Extracts Domains & Skills',
    desc: 'Zero-shot transformers decompose your project into prerequisite skill entities and technical taxonomies.',
    badge: 'Vector Decomposition',
  },
  {
    num: '03',
    icon: <Search className="w-6 h-6 text-[#22A375]" />,
    title: 'Find & Connect with Experts',
    desc: 'Dense semantic search retrieves verified advisors with transparent Explainable AI (XAI) scoring.',
    badge: 'Hybrid Fit Ranking',
  },
];

const features = [
  {
    icon: <Brain className="w-5 h-5 text-[#3B75DE]" />,
    title: 'Semantic Expert Matching',
    desc: 'Qdrant vector search aligns student problems with faculty research papers by conceptual meaning.',
    cardClass: 'card-ai-blue',
    tag: 'Qdrant HNSW',
  },
  {
    icon: <Eye className="w-5 h-5 text-[#4F46E5]" />,
    title: 'Explainable AI (XAI)',
    desc: 'Transparent 4-part score decomposition: semantic vectors, skill overlap, tier credentials, and bandwidth.',
    cardClass: 'card-ai-lavender',
    tag: '4-Part Score',
  },
  {
    icon: <TrendingUp className="w-5 h-5 text-[#3B75DE]" />,
    title: 'Skill Gap Optimizer (ΔK)',
    desc: 'Detects missing team competencies and uses set-cover optimization to propose targeted co-advisors.',
    cardClass: 'card-ai-blue',
    tag: 'Set Cover',
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-[#22A375]" />,
    title: 'Anti-Burnout Quotas',
    desc: 'Hard limits on faculty supervision (1–10 groups) guarantee balanced student attention.',
    cardClass: 'bg-white border border-[#E2E8F0]',
    tag: 'Fair Capacity',
  },
  {
    icon: <GitBranch className="w-5 h-5 text-[#4F46E5]" />,
    title: 'Collaboration FSM',
    desc: 'Formal finite state machine (Draft → Submitted → Negotiation → Accepted) with 7-day auto-response SLAs.',
    cardClass: 'card-ai-lavender',
    tag: 'FSM Engine',
  },
  {
    icon: <Lock className="w-5 h-5 text-[#334155]" />,
    title: 'Immutable Audit Trail',
    desc: 'Every milestone, state transition, and quota change is SHA-256 hash-chained for BAETE accreditation.',
    cardClass: 'bg-white border border-[#E2E8F0]',
    tag: 'Merkle Ledger',
  },
];

const roles = [
  { icon: <GraduationCap className="w-6 h-6 text-[#1E3A8A]" />, title: 'Student Lead', desc: 'Formulate problems, review extracted skills, explore matches, and manage milestones.', bg: 'bg-[#EAF2FF] border-[#B0CFFB]' },
  { icon: <BookOpen className="w-6 h-6 text-[#3730A3]" />, title: 'Faculty Advisor', desc: 'Review proposals, manage research citations, supervise active groups, and set quotas.', bg: 'bg-[#EEF2FF] border-[#C7D2FE]' },
  { icon: <Briefcase className="w-6 h-6 text-[#13533E]" />, title: 'Industry Mentor', desc: 'Sync GitHub/LinkedIn credentials, co-advise real-world tech stacks, and review code.', bg: 'bg-[#F0FDF8] border-[#A7E8D0]' },
  { icon: <LayoutDashboard className="w-6 h-6 text-[#92400E]" />, title: 'Department Coordinator', desc: 'Monitor supervisor load heatmaps, approve faculty tiers, and resolve allocation bottlenecks.', bg: 'bg-[#FFFBEB] border-[#FDE68A]' },
  { icon: <Shield className="w-6 h-6 text-[#9F1239]" />, title: 'System Administrator', desc: 'Manage taxonomy trees, approve custom tags, oversee RBAC, and monitor cluster latency.', bg: 'bg-[#FFF1F2] border-[#FECDD3]' },
  { icon: <UserCheck className="w-6 h-6 text-[#334155]" />, title: 'Institutional Auditor', desc: 'Verify SHA-256 Merkle chain integrity and export signed BAETE accreditation reports.', bg: 'bg-[#F8FAFC] border-[#E2E8F0]' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F4F8FF] text-[#334155] font-sans">
      {/* Navbar: White with subtle border */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EAF2FF] border border-[#D5E5FD] flex items-center justify-center text-[#3B75DE]">
              <Sparkles size={16} />
            </div>
            <span className="text-lg font-bold text-[#1E293B] tracking-tight">
              Uni<span className="text-[#3B75DE]">Expert</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-secondary text-xs px-4 py-2">
              Log In
            </Link>
            <Link to="/register" className="btn-primary text-xs px-4 py-2 font-semibold">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section: Eye-friendly soft pastel canvas with generous white space */}
      <section className="relative pt-36 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Soft pastel pill badge */}
        <div className="inline-flex items-center gap-2 bg-white border border-[#E2E8F0] shadow-sm rounded-full px-4 py-1.5 text-xs font-semibold text-[#475569] mb-8">
          <span className="w-2 h-2 rounded-full bg-[#A7E8D0] border border-[#22A375]" />
          <span>Fall 2026 Academic Term</span>
          <span className="text-[#CBD5E1]">·</span>
          <span className="text-[#3B75DE]">Daffodil International University</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1E293B] tracking-tight mb-6 leading-tight max-w-4xl mx-auto">
          Describe your problem.<br />
          <span className="text-[#3B75DE]">Find your perfect expert.</span>
        </h1>

        <p className="text-base sm:text-lg text-[#64748B] max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          UniExpert replaces static directories with a problem-first semantic matchmaking platform.
          Extract research skills, optimize panel gaps, and collaborate transparently.
        </p>

        {/* Soft Blue CTA with dark readable text */}
        <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-[#8AB4F8] hover:bg-[#76A4F2] text-[#1E293B] px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm active:scale-95"
          >
            Start Capstone Match <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-white hover:bg-[#F8FAFC] text-[#334155] border border-[#E2E8F0] px-6 py-3 rounded-xl font-medium text-sm transition-all shadow-sm"
          >
            Institutional Log In
          </Link>
        </div>

        {/* Floating KPI Cards in White */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-card text-center">
              <div className="text-2xl font-bold text-[#1E293B]">{s.value}</div>
              <div className="text-xs text-[#64748B] mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works: Section background #EAF2FF with white cards */}
      <section className="py-20 bg-[#EAF2FF] border-y border-[#D5E5FD]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#3B75DE] uppercase tracking-wider block mb-1">
              Workflow Pipeline
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1E293B]">
              How UniExpert Works
            </h2>
            <p className="text-sm text-[#64748B] mt-2">
              From natural language problem statement to supervisory collaboration in three simple stages.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div key={step.num} className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-card flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[#EAF2FF] text-[#1E3A8A] border border-[#B0CFFB]">
                      {step.num}
                    </span>
                    <span className="text-[11px] font-semibold text-[#64748B]">
                      {step.badge}
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[#F4F8FF] border border-[#E2E8F0] flex items-center justify-center mb-4">
                    {step.icon}
                  </div>
                  <h3 className="font-bold text-[#1E293B] text-base mb-2">{step.title}</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid: Light blue & lavender AI cards */}
      <section className="py-20 bg-[#F4F8FF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#3B75DE] uppercase tracking-wider block mb-1">
              Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1E293B]">
              Engineered for Academic Research & Governance
            </h2>
            <p className="text-sm text-[#64748B] mt-2">
              Combining semantic vector AI with institutional anti-burnout quotas and immutable audit logs.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className={`${f.cardClass} p-5 rounded-2xl shadow-card transition-all hover:shadow-card-hover`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center shadow-sm">
                    {f.icon}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/80 border border-[#E2E8F0] text-[#475569] font-medium">
                    {f.tag}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[#1E293B] mb-1.5">{f.title}</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built for Every Stakeholder: Pastel role cards */}
      <section className="py-20 bg-[#EAF2FF] border-y border-[#D5E5FD]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#3B75DE] uppercase tracking-wider block mb-1">
              Tailored Workspaces
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1E293B]">
              Role-Based Collaboration
            </h2>
            <p className="text-sm text-[#64748B] mt-2">
              Dedicated, specialized workflows for all 6 university capstone participants.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {roles.map((r) => (
              <div key={r.title} className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-card flex items-start gap-3.5">
                <div className={`p-2.5 rounded-xl border ${r.bg} flex-shrink-0`}>
                  {r.icon}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#1E293B] mb-1">{r.title}</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section: Light pastel container with soft blue button */}
      <section className="py-20 bg-[#F4F8FF] text-center">
        <div className="max-w-3xl mx-auto px-4 bg-white rounded-3xl p-10 border border-[#E2E8F0] shadow-card">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF2FF] border border-[#D5E5FD] flex items-center justify-center text-[#3B75DE] mx-auto mb-5">
            <Zap size={22} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] mb-3">
            Ready to find your capstone advisor?
          </h2>
          <p className="text-sm text-[#64748B] max-w-lg mx-auto mb-8">
            Join student teams and faculty across Daffodil International University on the modern expert discovery platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 bg-[#8AB4F8] hover:bg-[#76A4F2] text-[#1E293B] px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm active:scale-95"
            >
              Register with Institutional Email <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-xs text-[#64748B]">
            {['No credit card required', 'DIU institutional login', 'BAETE Criterion 4 & 5 compliant'].map((t) => (
              <span key={t} className="flex items-center gap-1.5 font-medium">
                <CheckCircle className="w-3.5 h-3.5 text-[#22A375]" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Clean White Footer with subtle border */}
      <footer className="bg-white border-t border-[#E2E8F0] text-[#64748B] text-xs text-center py-6">
        © 2026 Daffodil International University · UniExpert AI Collaboration Platform · Department of Software Engineering
      </footer>
    </div>
  );
}
