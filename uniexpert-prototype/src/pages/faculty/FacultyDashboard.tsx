import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, BookOpen, Clock, AlertTriangle, ArrowRight, CheckCircle2, 
  XCircle, GitPullRequest, Calendar, Award, Bell, Shield, Layers, FileCheck
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/shared/StatusBadge';
import MetricCard from '../../components/shared/MetricCard';

export const FacultyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { proposals, experts } = useApp();
  const faculty = experts[0]; // Dr. Farhana Rahman

  const pendingProposals = proposals.filter((p) => p.state === 'submitted' || p.state === 'under_review' || p.state === 'negotiation');

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24">
      {/* Top Banner with Quota Meter */}
      <div className="card p-6 md:p-8 bg-white border border-[#E2E8F0] shadow-sm rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#EAF2FF] border border-[#8AB4F8]/50 flex items-center justify-center text-2xl font-bold text-[#1E293B]">
            FR
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#1E293B]">{faculty.name}</h1>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold bg-[#EAF2FF] text-[#1E293B] border border-[#8AB4F8]/40">
                Tier {faculty.tier} Verified
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              {faculty.title} · Department of {faculty.department} · Daffodil International University
            </p>
            <p className="text-[11px] text-[#64748B] mt-1 font-mono">
              ORCID: 0000-0002-1234-5678 · h-index: {faculty.hIndex}
            </p>
          </div>
        </div>

        {/* Quota Meter */}
        <div className="bg-[#F4F8FF] p-4 rounded-2xl border border-[#E2E8F0] min-w-[260px]">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-[#64748B] font-semibold uppercase tracking-wider text-[10px]">
              Supervisory Anti-Burnout Quota
            </span>
            <span className="font-bold text-[#1E293B]">
              {faculty.slotsUsed} / {faculty.slotsTotal} Slots
            </span>
          </div>
          <div className="w-full bg-white border border-[#E2E8F0] h-3 rounded-full overflow-hidden">
            <div
              className="bg-[#8AB4F8] h-full transition-all duration-500 rounded-full"
              style={{ width: `${(faculty.slotsUsed / faculty.slotsTotal) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-[#64748B] block mt-1.5">
            {faculty.slotsTotal - faculty.slotsUsed} slots available for Fall 2026 capstones
          </span>
        </div>
      </div>

      {/* Faculty KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <MetricCard
          label="Supervisory Load"
          value={`${faculty.slotsUsed} / ${faculty.slotsTotal} Groups`}
          badge="40% Capacity"
          subtext="Within institutional anti-burnout threshold"
          variant="blue"
          icon={<Users size={18} className="text-[#2563EB]" />}
        />
        <MetricCard
          label="Inbound Queue"
          value={`${pendingProposals.length} Solicitations`}
          badge="Awaiting Decision"
          subtext="Mandatory 7-day SLA response required"
          variant="amber"
          icon={<GitPullRequest size={18} className="text-[#B45309]" />}
        />
        <MetricCard
          label="Credential Tier"
          value={`Tier ${faculty.tier} Chair`}
          badge="Verified"
          subtext={`h-index: ${faculty.hIndex} · 18 Scopus citations`}
          variant="mint"
          icon={<Award size={18} className="text-[#0F766E]" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Pending Solicitations & Active Teams */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Solicitations Queue */}
          <div className="card p-6 md:p-8 space-y-4 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
                  <GitPullRequest size={18} className="text-[#8AB4F8]" />
                  Inbound Capstone Solicitations ({pendingProposals.length})
                </h2>
                <p className="text-xs text-[#64748B]">
                  Student project statements awaiting formal supervisory review
                </p>
              </div>
              <button
                onClick={() => navigate('/faculty/proposals')}
                className="text-xs text-[#2563EB] font-semibold hover:underline flex items-center gap-1"
              >
                Review Full Queue <ArrowRight size={13} />
              </button>
            </div>

            <div className="space-y-3">
              {pendingProposals.map((prop) => (
                <div
                  key={prop.id}
                  className="p-4 rounded-2xl border border-[#E2E8F0] bg-[#F4F8FF] hover:border-[#8AB4F8]/50 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <StatusBadge status={prop.state} />
                        <span className="text-xs text-[#64748B]">· Submitted by Abu Zafor (Team Lead)</span>
                      </div>
                      <h3 className="text-sm font-bold text-[#1E293B]">
                        {prop.projectTitle}
                      </h3>
                      <p className="text-xs text-[#64748B] mt-1 line-clamp-2">
                        {prop.synopsis}
                      </p>
                    </div>

                    <div className="text-right shrink-0 bg-white p-2 rounded-xl border border-[#E2E8F0]">
                      <span className="text-[10px] text-[#64748B] uppercase font-bold block">AI Fit</span>
                      <span className="text-sm font-extrabold text-[#1E293B]">
                        {prop.aiAlignmentScore}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0]">
                    <span className="text-[11px] font-mono text-[#64748B]">
                      Response SLA: 5 Days Remaining
                    </span>
                    <button
                      onClick={() => navigate('/faculty/proposals')}
                      className="btn-primary text-xs py-1.5 px-3.5 rounded-xl shadow-sm"
                    >
                      Open Review & Decision
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Supervised Groups */}
          <div className="card p-6 md:p-8 space-y-4 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
            <h2 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
              <Users size={18} className="text-[#8AB4F8]" />
              Active Capstone Research Groups (2 Active)
            </h2>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl border border-[#E2E8F0] bg-[#F4F8FF] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#1E293B]">Team BioShield AI</span>
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#A7E8D0]/30 text-[#1E293B] border border-[#A7E8D0]">
                      Stage 3: Active Supervision
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Lead: Anamul Haque · Last milestone approved: Oct 28, 2026
                  </p>
                </div>
                <button
                  onClick={() => navigate('/student/workspace')}
                  className="btn-secondary text-xs py-1.5 px-3 rounded-xl"
                >
                  Open Workspace
                </button>
              </div>

              <div className="p-4 rounded-2xl border border-[#E2E8F0] bg-[#F4F8FF] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#1E293B]">Team NeuroWear</span>
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#A7E8D0]/30 text-[#1E293B] border border-[#A7E8D0]">
                      Stage 4: Defense Ready
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Lead: Sadia Karim · Final thesis draft submitted for plagiarism scan
                  </p>
                </div>
                <button
                  onClick={() => navigate('/student/workspace')}
                  className="btn-secondary text-xs py-1.5 px-3 rounded-xl"
                >
                  Open Workspace
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming Consultations & Quick Actions */}
        <div className="space-y-6">
          {/* Upcoming Consultations */}
          <div className="card p-6 space-y-4 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
            <h2 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
              <Calendar size={18} className="text-[#8AB4F8]" />
              Upcoming Consultations
            </h2>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl border border-[#E2E8F0] bg-[#F4F8FF] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#1E293B]">
                  <span>Tuesday, Nov 17 · 14:00</span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#EAF2FF] text-[#1E293B] border border-[#8AB4F8]/40">
                    Zoom Active
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#1E293B]">
                  EdgeShield: TinyML Quantization Review
                </p>
                <p className="text-[11px] text-[#64748B]">
                  Student: Abu Zafor (ID: 232-35-331)
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-[#E2E8F0] bg-[#F4F8FF] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#1E293B]">
                  <span>Thursday, Nov 19 · 10:30</span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-white text-[#334155] border border-[#E2E8F0]">
                    Office Room 402
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#1E293B]">
                  BioShield: Genomic Pipeline Checkpoint
                </p>
                <p className="text-[11px] text-[#64748B]">
                  Student: Anamul Haque
                </p>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="card p-6 space-y-3 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
            <h3 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
              Faculty Management Tools
            </h3>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => navigate('/faculty/portfolio')}
                className="w-full p-3 rounded-xl border border-[#E2E8F0] hover:bg-[#F4F8FF] text-left font-semibold text-[#334155] hover:text-[#1E293B] flex items-center justify-between transition-colors"
              >
                <span>Research Portfolio & ORCID Sync</span>
                <ArrowRight size={14} className="text-[#64748B]" />
              </button>

              <button
                onClick={() => navigate('/faculty/capacity')}
                className="w-full p-3 rounded-xl border border-[#E2E8F0] hover:bg-[#F4F8FF] text-left font-semibold text-[#334155] hover:text-[#1E293B] flex items-center justify-between transition-colors"
              >
                <span>Advisory Capacity & Blackout Dates</span>
                <ArrowRight size={14} className="text-[#64748B]" />
              </button>

              <button
                onClick={() => navigate('/faculty/calendar')}
                className="w-full p-3 rounded-xl border border-[#E2E8F0] hover:bg-[#F4F8FF] text-left font-semibold text-[#334155] hover:text-[#1E293B] flex items-center justify-between transition-colors"
              >
                <span>Weekly Office Hours Configuration</span>
                <ArrowRight size={14} className="text-[#64748B]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;

