import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Search, TrendingUp, Bell, Plus, Calendar,
  ChevronRight, Layers, Shield, GraduationCap, CheckCircle2,
  AlertTriangle, Clock, Zap, Target, ExternalLink, MessageSquare,
  Sparkles, Check, ArrowRight, UserCheck, ShieldCheck, MapPin, Video
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useApp } from '@/context/AppContext';
import { mockStudents, mockProposals } from '@/data/mockData';
import type { ProjectStage } from '@/types';
import MetricCard from '@/components/shared/MetricCard';
import StatusBadge from '@/components/shared/StatusBadge';
import StudentWelcomeHeader from '@/components/student/StudentWelcomeHeader';
import { cn } from '@/lib/utils';

interface StageConfig {
  key: ProjectStage;
  label: string;
  stepNumber: number;
  route: string;
  icon: React.ReactNode;
  description: string;
}

const STAGES: StageConfig[] = [
  {
    key: 'problem_formulation',
    label: 'Problem Formulation',
    stepNumber: 1,
    route: '/student/proposals/new',
    icon: <FileText size={16} />,
    description: 'NLP entity extraction & domain classification',
  },
  {
    key: 'advisor_matching',
    label: 'Advisor Matching',
    stepNumber: 2,
    route: '/student/discovery',
    icon: <Search size={16} />,
    description: 'Semantic vector search & hybrid scoring',
  },
  {
    key: 'active_supervision',
    label: 'Active Supervision',
    stepNumber: 3,
    route: '/student/workspace',
    icon: <Layers size={16} />,
    description: 'Milestone tracking & weekly consultations',
  },
  {
    key: 'defense_ready',
    label: 'Defense Ready',
    stepNumber: 4,
    route: '/student/requests',
    icon: <Shield size={16} />,
    description: 'Thesis review & plagiarism verification',
  },
  {
    key: 'completed',
    label: 'Completed',
    stepNumber: 5,
    route: '/student/post-evaluation',
    icon: <GraduationCap size={16} />,
    description: 'BAETE accreditation audit & signoff',
  },
];

const CURRENT_STAGE: ProjectStage = 'active_supervision';
const DEFENSE_DATE = new Date('2026-12-20T00:00:00Z');

function daysUntil(target: Date): number {
  const diff = target.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { notifications, markNotificationRead } = useApp();

  const student = mockStudents[0];
  const proposals = mockProposals;
  const daysLeft = daysUntil(DEFENSE_DATE);
  const currentStageIndex = STAGES.findIndex((s) => s.key === CURRENT_STAGE);
  const negotiationProposal = proposals.find((p) => p.state === 'negotiation');

  // Interactive milestone state
  const [milestones, setMilestones] = useState([
    {
      id: 'm1',
      title: 'Literature Review & Architecture Specification',
      dueDate: 'Oct 15, 2026',
      completed: true,
      deliverable: 'SRS Document v1.0',
    },
    {
      id: 'm2',
      title: 'BLE 5.0 GATT Firmware & ECG Analog Frontend',
      dueDate: 'Nov 18, 2026',
      completed: false,
      deliverable: 'Cortex-M4 Embedded C Codebase',
    },
    {
      id: 'm3',
      title: 'Quantized TinyML 1D-CNN Inference Kernel',
      dueDate: 'Dec 05, 2026',
      completed: false,
      deliverable: 'CMSIS-NN 8-bit Benchmark Report',
    },
    {
      id: 'm4',
      title: 'Final Capstone Thesis & Defense Presentation',
      dueDate: 'Dec 18, 2026',
      completed: false,
      deliverable: 'BAETE Criterion 4 & 5 Dossier',
    },
  ]);

  const completedCount = milestones.filter((m) => m.completed).length;
  const progressPercent = Math.round((completedCount / milestones.length) * 100);

  const toggleMilestone = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const updated = !m.completed;
          toast.success(
            updated
              ? `Milestone marked complete: ${m.title}`
              : `Milestone reverted to pending: ${m.title}`
          );
          return { ...m, completed: updated };
        }
        return m;
      })
    );
  };

  const consultations = [
    {
      id: 'c1',
      title: 'Weekly Supervisory Sync — Dr. Farhana Rahman',
      day: 'Tuesday, Nov 17',
      time: '14:00 – 14:30',
      type: 'physical',
      location: 'Faculty Office Room 611, SE Building',
      advisor: 'Dr. Farhana Rahman',
    },
    {
      id: 'c2',
      title: 'Industry Cloud Review — Engr. Sakib Al Hasan',
      day: 'Thursday, Nov 19',
      time: '19:30 – 20:00',
      type: 'virtual',
      location: 'Google Meet (meet.google.com/uex-ble-sync)',
      advisor: 'Engr. Sakib Al Hasan',
    },
  ];

  const latestNotifications = useMemo(
    () => notifications.slice(0, 3),
    [notifications]
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* 1. Minimal Profile Header & Capstone Defense Countdown */}
      <StudentWelcomeHeader
        student={student}
        daysLeft={daysLeft}
        defenseDate={DEFENSE_DATE}
        defaultVariation="minimal"
        showSwitcher={false}
      />

      {/* 2. 5-Stage Capstone Lifecycle Horizontal Stepper */}
      <section className="card p-6 md:p-8 bg-white border border-[#E2E8F0] shadow-sm rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
              Capstone Lifecycle Roadmap (FSM State)
            </h2>
            <p className="text-xs text-[#1E293B] font-semibold mt-0.5">
              Current Stage: Active Supervision & Prototype Implementation
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-xl bg-[#EAF2FF] text-[#1E3A8A] border border-[#B0CFFB]">
            Phase 3 of 5
          </span>
        </div>

        <div className="flex items-center gap-0 overflow-x-auto pb-3 pt-2">
          {STAGES.map((stage, idx) => {
            const isCurrent = idx === currentStageIndex;
            const isDone = idx < currentStageIndex;
            const isLast = idx === STAGES.length - 1;

            return (
              <React.Fragment key={stage.key}>
                <div
                  onClick={() => navigate(stage.route)}
                  className="flex flex-col items-center min-w-[130px] group cursor-pointer transition-all"
                >
                  <div
                    className={cn(
                      'w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200',
                      isCurrent
                        ? 'bg-[#8AB4F8] text-[#1E293B] font-bold shadow-md ring-4 ring-[#8AB4F8]/20 scale-105'
                        : isDone
                        ? 'bg-[#DCFCEE] text-[#13533E] border border-[#A7E8D0] group-hover:bg-[#C8F7E3]'
                        : 'bg-[#F4F8FF] border border-[#E2E8F0] text-[#94A3B8] group-hover:bg-[#EAF2FF] group-hover:text-[#334155]'
                    )}
                  >
                    {isDone ? (
                      <CheckCircle2 size={18} className="text-[#0F766E]" />
                    ) : (
                      stage.icon
                    )}
                  </div>
                  <span
                    className={cn(
                      'mt-2.5 text-xs text-center leading-tight max-w-[120px] transition-colors',
                      isCurrent
                        ? 'font-bold text-[#1E293B]'
                        : isDone
                        ? 'font-semibold text-[#13533E]'
                        : 'text-[#64748B] group-hover:text-[#1E293B]'
                    )}
                  >
                    {stage.label}
                  </span>
                  <span className="text-[10px] text-[#94A3B8] font-mono mt-0.5">
                    Step {stage.stepNumber}
                  </span>
                  {isCurrent && (
                    <span className="mt-1 text-[9px] bg-[#EAF2FF] text-[#1E3A8A] border border-[#B0CFFB] px-2 py-0.5 rounded-full font-bold">
                      Active
                    </span>
                  )}
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      'flex-1 h-1 mx-2 min-w-[28px] rounded-full transition-colors',
                      idx < currentStageIndex ? 'bg-[#A7E8D0]' : 'bg-[#E2E8F0]'
                    )}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </section>

      {/* 3. Key Performance Indicator (KPI) Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Lifecycle Status"
          value="Stage 3 of 5"
          badge="In Progress"
          subtext="Active supervision phase running on schedule"
          variant="blue"
          icon={<Layers size={18} className="text-[#2563EB]" />}
        />
        <MetricCard
          label="Primary Advisor Fit"
          value="94% Match"
          badge="Dr. Farhana"
          subtext="Associate Prof · Embedded AI Specialization"
          variant="mint"
          icon={<Zap size={18} className="text-[#0F766E]" />}
        />
        <MetricCard
          label="Team Skill Coverage"
          value="100% Core"
          badge="Balanced"
          subtext="Kreq vs Kteam prerequisites satisfied"
          variant="lavender"
          icon={<ShieldCheck size={18} className="text-[#4338CA]" />}
        />
        <MetricCard
          label="Defense SLA Clock"
          value={`${daysLeft} Days`}
          badge="Dec 20, 2026"
          subtext="Formal departmental thesis submission"
          variant="default"
          icon={<Clock size={18} className="text-[#64748B]" />}
        />
      </div>

      {/* 4. Main Two-Column Grid: Active Project vs Right Sidebar */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Active Project & Negotiation Banner */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Registered Project Card */}
          <div className="card-ai-blue p-6 md:p-8 rounded-3xl border border-[#D5E5FD] shadow-sm space-y-6">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-xs font-bold text-[#1E3A8A] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#2563EB]" />
                  Active Capstone Project
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white text-[#1E3A8A] border border-[#B0CFFB] shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#A7E8D0] border border-[#0F766E] animate-pulse" />
                  Active Supervision
                </span>
              </div>

              <h3 className="text-xl font-bold text-[#1E293B] leading-snug">
                EdgeShield: BLE-Based ECG Monitoring with TinyML Anomaly Detection
              </h3>

              {/* Advisors and timeline chips */}
              <div className="flex flex-wrap gap-4 text-xs text-[#64748B] mt-3">
                <span className="flex items-center gap-1.5 font-medium text-[#1E293B] bg-white/80 px-2.5 py-1 rounded-xl border border-[#E2E8F0]">
                  <GraduationCap size={15} className="text-[#2563EB]" />
                  Lead: Dr. Farhana Rahman (SWE)
                </span>
                <span className="flex items-center gap-1.5 font-medium text-[#1E293B] bg-white/80 px-2.5 py-1 rounded-xl border border-[#E2E8F0]">
                  <UserCheck size={15} className="text-[#4338CA]" />
                  Mentor: Engr. Sakib Al Hasan (TechBridge)
                </span>
                <span className="flex items-center gap-1.5 text-[#64748B] px-2 py-1">
                  <Clock size={14} /> Weekly Sync: Tuesday 14:00
                </span>
              </div>
            </div>

            {/* Milestone Progress Bar */}
            <div className="p-4 bg-white rounded-2xl border border-[#E2E8F0] space-y-2 shadow-xs">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#1E293B]">
                  Roadmap Milestone Progress: {completedCount} of {milestones.length} Cleared
                </span>
                <span className="font-mono font-bold text-[#0F766E] bg-[#DCFCEE] px-2.5 py-0.5 rounded-full border border-[#A7E8D0]">
                  {progressPercent}% Complete
                </span>
              </div>
              <div className="w-full bg-[#F4F8FF] border border-[#E2E8F0] h-3 rounded-full overflow-hidden">
                <div
                  className="bg-[#8AB4F8] h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Interactive Milestone Checklist */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-[#1E293B]">
                <span>Agreed Capstone Milestones (Click checkbox to update):</span>
                <span className="text-[11px] text-[#64748B] font-normal">
                  Tracked by Coordinator Office
                </span>
              </div>

              <div className="space-y-2.5">
                {milestones.map((m, idx) => (
                  <div
                    key={m.id}
                    onClick={() => toggleMilestone(m.id)}
                    className={cn(
                      'flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all cursor-pointer',
                      m.completed
                        ? 'bg-[#DCFCEE]/40 border-[#A7E8D0]'
                        : idx === 1
                        ? 'bg-white border-[#8AB4F8] shadow-sm'
                        : 'bg-white border-[#E2E8F0] hover:bg-[#F4F8FF]'
                    )}
                  >
                    <div
                      className={cn(
                        'w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold transition-colors',
                        m.completed
                          ? 'bg-[#0F766E] text-white'
                          : idx === 1
                          ? 'bg-[#8AB4F8] text-[#1E293B]'
                          : 'bg-[#F4F8FF] text-[#64748B] border border-[#E2E8F0]'
                      )}
                    >
                      {m.completed ? <Check size={14} strokeWidth={3} /> : idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={cn(
                            'text-xs font-bold truncate',
                            m.completed ? 'text-[#13533E] line-through opacity-85' : 'text-[#1E293B]'
                          )}
                        >
                          {m.title}
                        </p>
                        <span className="text-[11px] font-mono text-[#64748B] shrink-0">
                          Due: {m.dueDate}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#64748B] mt-0.5">
                        Deliverable: <span className="font-mono">{m.deliverable}</span>
                      </p>
                    </div>

                    {idx === 1 && !m.completed && (
                      <span className="text-[10px] font-semibold text-[#1E3A8A] bg-[#EAF2FF] px-2 py-0.5 rounded-full border border-[#B0CFFB] shrink-0">
                        In Progress
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-4 border-t border-[#D5E5FD] flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-[#64748B]">
                Repository & artifacts synced with Department Archive
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/student/requests')}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#334155] bg-white hover:bg-[#F4F8FF] border border-[#E2E8F0] transition-colors"
                >
                  View Full Proposal
                </button>
                <button
                  onClick={() => navigate('/student/workspace')}
                  className="btn-primary text-xs py-2 px-4 font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  Open Project Workspace <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* FSM Negotiation Solicitation Alert Card */}
          {negotiationProposal && (
            <div className="card-ai-lavender p-6 rounded-3xl border border-[#C7D2FE] space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#3730A3] uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare size={14} className="text-[#4338CA]" />
                    FSM Collaboration Solicitation
                  </span>
                  <span className="text-[10px] font-mono text-[#64748B]">
                    #{negotiationProposal.id}
                  </span>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                  In Negotiation
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E0E7FF] shadow-xs space-y-2">
                <h4 className="text-xs font-bold text-[#1E293B]">
                  {negotiationProposal.projectTitle}
                </h4>
                {negotiationProposal.negotiationNote && (
                  <div className="p-3 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#92400E] italic leading-relaxed">
                    "{negotiationProposal.negotiationNote}"
                  </div>
                )}
                <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-1">
                  <span>Target Advisor: Dr. Farhana Rahman</span>
                  <span className="font-mono">
                    Updated {formatDate(negotiationProposal.updatedAt)}
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => navigate('/student/requests')}
                  className="btn-primary text-xs py-2 px-4 font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  Respond & Re-submit Revised Roadmap <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (1 span): Quick Actions, Consultations, & Alerts */}
        <div className="space-y-6">
          {/* Quick Actions Panel */}
          <div className="card p-6 bg-white border border-[#E2E8F0] shadow-sm rounded-3xl space-y-4">
            <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
              Quick Actions
            </h2>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => navigate('/student/proposals/new')}
                className="btn-primary justify-start gap-3 py-2.5 px-4 text-xs font-semibold shadow-sm"
              >
                <Plus size={16} /> New Capstone Proposal
              </button>
              <button
                onClick={() => navigate('/student/discovery')}
                className="w-full text-left px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F4F8FF] hover:bg-[#EAF2FF] text-[#1E293B] text-xs font-semibold flex items-center gap-3 transition-colors"
              >
                <Search size={16} className="text-[#2563EB]" /> Find Academic Advisors
              </button>
              <button
                onClick={() => navigate('/student/skill-gap')}
                className="w-full text-left px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F4F8FF] hover:bg-[#EAF2FF] text-[#1E293B] text-xs font-semibold flex items-center gap-3 transition-colors"
              >
                <TrendingUp size={16} className="text-[#4338CA]" /> Analyze Team Skill Gap (ΔK)
              </button>
              <button
                onClick={() => navigate('/student/scheduler')}
                className="w-full text-left px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F4F8FF] hover:bg-[#EAF2FF] text-[#1E293B] text-xs font-semibold flex items-center gap-3 transition-colors"
              >
                <Calendar size={16} className="text-[#0F766E]" /> Schedule Consultation Slot
              </button>
            </div>
          </div>

          {/* Upcoming Consultations Card */}
          <div className="card p-6 bg-white border border-[#E2E8F0] shadow-sm rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                Upcoming Consultations
              </h2>
              <button
                onClick={() => navigate('/student/scheduler')}
                className="text-xs font-semibold text-[#2563EB] hover:underline"
              >
                Book New Slot
              </button>
            </div>

            <div className="space-y-3">
              {consultations.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-2xl border border-[#E2E8F0] bg-[#F4F8FF] hover:bg-[#EAF2FF] transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1E293B]">{c.day}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DCFCEE] text-[#13533E] border border-[#A7E8D0]">
                      Confirmed
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-[#1E293B] leading-tight">
                    {c.title}
                  </p>

                  <div className="text-[11px] text-[#64748B] space-y-0.5">
                    <p className="flex items-center gap-1 font-mono">
                      <Clock size={12} /> {c.time}
                    </p>
                    <p className="flex items-center gap-1">
                      {c.type === 'virtual' ? (
                        <Video size={12} className="text-[#2563EB]" />
                      ) : (
                        <MapPin size={12} className="text-[#0F766E]" />
                      )}
                      <span>{c.location}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Alerts Feed */}
          <div className="card p-6 bg-white border border-[#E2E8F0] shadow-sm rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                Recent Alerts
              </h2>
              <span className="text-xs text-[#2563EB] font-semibold bg-[#EAF2FF] px-2 py-0.5 rounded-full border border-[#B0CFFB]">
                {notifications.filter((n) => !n.read).length} unread
              </span>
            </div>

            <div className="space-y-3">
              {latestNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={cn(
                    'p-3.5 rounded-2xl border transition-all cursor-pointer',
                    !n.read
                      ? 'bg-[#EAF2FF]/40 border-[#B0CFFB]'
                      : 'bg-white border-[#E2E8F0] hover:bg-[#F4F8FF]'
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-bold text-[#1E293B]">{n.title}</p>
                    <span className="text-[10px] text-[#94A3B8] font-mono">
                      {relativeTime(n.timestamp)}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] line-clamp-2 leading-relaxed">
                    {n.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
