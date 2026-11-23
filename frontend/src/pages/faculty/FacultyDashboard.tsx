import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, BookOpen, Clock, AlertTriangle, ArrowRight, CheckCircle2, 
  XCircle, GitPullRequest, Calendar, Award, Bell, Shield, Layers, FileCheck,
  ShieldCheck, Lock, Sliders, CheckSquare, X, Sparkles, MessageSquare
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useApp } from '../../context/AppContext';
import { api } from '../../api/client';
import StatusBadge from '../../components/shared/StatusBadge';
import MetricCard from '../../components/shared/MetricCard';

const ACTIVE_PROPOSAL_ID = 'af8b2f33-bfe6-4e4f-82b7-18446b3275da';

export const FacultyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { proposals, experts } = useApp();
  const faculty = experts[0]; // Md. Shohel Arman

  const pendingProposals = proposals.filter((p) => p.state === 'submitted' || p.state === 'under_review' || p.state === 'negotiation');

  // Supervisory Endorsement Modal State
  const [endorseModalOpen, setEndorseModalOpen] = useState(false);
  const [submittingEndorsement, setSubmittingEndorsement] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState('Milestone 2: Prototype & Demo');
  const [signatureConfirmed, setSignatureConfirmed] = useState(true);
  const [latestEndorsement, setLatestEndorsement] = useState<any>(null);

  const [memberRatings, setMemberRatings] = useState([
    {
      member_id: 'stu-1',
      member_name: 'Abu Zafor',
      role: 'Team Lead & Embedded AI',
      telemetry: '12 Commits · 4 Tasks · ARM Cortex-M4 Firmware',
      points: 95,
      percentage: 32,
      qualitative_feedback: 'Demonstrated exceptional technical depth in BLE 5.0 GATT firmware and TinyML 1D-CNN pipeline.'
    },
    {
      member_id: 'stu-2',
      member_name: 'Anamul Haque',
      role: 'Full-Stack & Systems Lead',
      telemetry: '10 Commits · 6 Tasks · WebSockets & Merkle Ledger',
      points: 92,
      percentage: 28,
      qualitative_feedback: 'Engineered robust multi-tab WebSocket signaling, meeting room synchronization, and SHA-256 Merkle ledger.'
    },
    {
      member_id: 'stu-3',
      member_name: 'Rafi Ahmed',
      role: 'Backend & Security',
      telemetry: '8 Commits · 3 Tasks · JWT Middleware & SQLite',
      points: 88,
      percentage: 20,
      qualitative_feedback: 'Built clean JWT security guards and SQLite persistence models.'
    },
    {
      member_id: 'stu-4',
      member_name: 'Lamia Sultana',
      role: 'ML & Dataset Prep',
      telemetry: '6 Commits · 2 Tasks · IMU Dataset Normalization',
      points: 85,
      percentage: 20,
      qualitative_feedback: 'Cleaned and normalized 48k multi-modal sensor samples for embedded training.'
    }
  ]);

  // Fetch existing latest endorsement on load
  useEffect(() => {
    api.getLatestContributionEndorsement(ACTIVE_PROPOSAL_ID)
      .then((data) => {
        if (data) {
          setLatestEndorsement(data);
        }
      })
      .catch((err) => console.log('No prior endorsement found', err));
  }, []);

  const handleRatingChange = (index: number, field: string, value: any) => {
    const updated = [...memberRatings];
    updated[index] = { ...updated[index], [field]: value };
    setMemberRatings(updated);
  };

  const handleEndorseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signatureConfirmed) {
      toast.error('Please confirm the supervisory OBE certification checkbox.');
      return;
    }

    setSubmittingEndorsement(true);
    try {
      const payload = {
        supervisor_id: 'exp-1',
        supervisor_name: faculty.name || 'Md. Shohel Arman',
        milestone_title: selectedMilestone,
        ratings: memberRatings.map(m => ({
          member_id: m.member_id,
          member_name: m.member_name,
          role: m.role,
          points: Number(m.points),
          percentage: Number(m.percentage),
          qualitative_feedback: m.qualitative_feedback
        })),
        signature_confirmed: true
      };

      const result = await api.endorseContributions(ACTIVE_PROPOSAL_ID, payload);
      setLatestEndorsement(result);
      setEndorseModalOpen(false);
      toast.success(
        `✓ Endorsed! Cryptographically sealed on Merkle Ledger (Block #${result.merkle_block_index})`,
        { duration: 5000 }
      );
    } catch (err: any) {
      toast.error(`Endorsement failed: ${err.message}`);
    } finally {
      setSubmittingEndorsement(false);
    }
  };

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
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
                  <Users size={18} className="text-[#8AB4F8]" />
                  Active Capstone Research Groups (2 Active)
                </h2>
                <p className="text-xs text-[#64748B]">
                  Under active supervisory guidance · Outcome-Based Education (OBE) tracking
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <ShieldCheck size={13} /> Merkle Audit Active
              </span>
            </div>

            <div className="space-y-3">
              {/* Group 1: Team BioShield AI (Wired with Endorsement) */}
              <div className="p-4 rounded-2xl border border-[#E2E8F0] bg-[#F4F8FF] hover:border-[#8AB4F8]/50 transition-all space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-[#1E293B]">Team BioShield AI (Group #32)</span>
                      <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#A7E8D0]/30 text-[#1E293B] border border-[#A7E8D0]">
                        Stage 3: Active Supervision
                      </span>
                      {latestEndorsement && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 size={11} /> Merkle Sealed #{latestEndorsement.merkle_block_index}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#64748B] mt-1">
                      Topic: Autonomous Edge-AI Healthcare Monitoring via BLE 5.0 Sensor Fusion
                    </p>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      Members: Abu Zafor (Lead), Anamul Haque, Rafi Ahmed, Lamia Sultana
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setEndorseModalOpen(true)}
                      className="btn-primary text-xs py-1.5 px-3.5 rounded-xl flex items-center gap-1.5 shadow-sm bg-[#2563EB] hover:bg-[#1D4ED8]"
                    >
                      <Award size={14} /> Grade & Endorse Points
                    </button>
                    <button
                      onClick={() => navigate('/student/workspace')}
                      className="btn-secondary text-xs py-1.5 px-3 rounded-xl"
                    >
                      Workspace
                    </button>
                  </div>
                </div>

                {latestEndorsement && (
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs space-y-1">
                    <div className="flex items-center justify-between text-emerald-800 font-semibold">
                      <span className="flex items-center gap-1">
                        <Sparkles size={13} className="text-emerald-600" />
                        Latest Supervisory Endorsement ({latestEndorsement.milestone_title}):
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">
                        Hash: {latestEndorsement.block_hash ? `${latestEndorsement.block_hash.substring(0, 14)}...` : 'Verified'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      {latestEndorsement.ratings?.map((r: any, i: number) => (
                        <div key={i} className="p-1.5 rounded bg-slate-50 border border-slate-200">
                          <span className="font-bold text-[#1E293B] block text-[11px]">{r.member_name}</span>
                          <span className="text-[10px] text-emerald-700 font-semibold">{r.points} Pts ({r.percentage}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Group 2: Team NeuroWear */}
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
                  Workspace
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
              <div className="p-3.5 rounded-2xl border border-[#E2E8F0] bg-[#F4F8FF] space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#1E293B]">Team BioShield AI</span>
                  <span className="text-[10px] font-mono text-[#2563EB] bg-[#EAF2FF] px-2 py-0.5 rounded">
                    Room 611
                  </span>
                </div>
                <p className="text-xs text-[#64748B]">Tuesday · 14:00 - 14:45</p>
                <p className="text-[11px] text-[#64748B] italic">Agenda: TinyML BLE GATT benchmarking review</p>
              </div>

              <div className="p-3.5 rounded-2xl border border-[#E2E8F0] bg-[#F4F8FF] space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#1E293B]">Team NeuroWear</span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Google Meet
                  </span>
                </div>
                <p className="text-xs text-[#64748B]">Thursday · 19:30 - 20:15</p>
                <p className="text-[11px] text-[#64748B] italic">Agenda: Pre-defense oral rehearsal</p>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="card p-6 space-y-3 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
            <h2 className="text-base font-bold text-[#1E293B]">Quick Management</h2>

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

      {/* Supervisory Milestone & Contribution Endorsement Modal */}
      {endorseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-[#E2E8F0] rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-5 animate-scale-up">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Award className="text-[#2563EB]" size={22} />
                  <h2 className="text-lg font-bold text-[#0F172A]">
                    Supervisory Milestone & Contribution Endorsement
                  </h2>
                </div>
                <p className="text-xs text-[#64748B]">
                  Formal evaluation of individual member contributions under BAETE Criterion 4 & 5 OBE rubrics
                </p>
                <div className="flex items-center gap-2 text-[11px] text-[#2563EB] font-medium pt-0.5">
                  <span>Evaluating: <strong>Team BioShield AI (Group #32)</strong></span>
                  <span>·</span>
                  <span>Supervisor: <strong>{faculty.name}</strong></span>
                </div>
              </div>
              <button
                onClick={() => setEndorseModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Milestone Selection */}
            <form onSubmit={handleEndorseSubmit} className="space-y-5">
              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0] space-y-2">
                <label className="text-xs font-bold text-[#334155] block">
                  Evaluation Milestone / Cycle
                </label>
                <select
                  value={selectedMilestone}
                  onChange={(e) => setSelectedMilestone(e.target.value)}
                  className="input text-xs w-full bg-white border-[#CBD5E1]"
                >
                  <option value="Milestone 1: Problem Formulation & SRS">Milestone 1: Problem Formulation & SRS (Oct 15, 2026)</option>
                  <option value="Milestone 2: Prototype & Demo">Milestone 2: Prototype & Demo (Nov 15, 2026 - Active)</option>
                  <option value="Milestone 3: Full Implementation">Milestone 3: Full Implementation (Dec 01, 2026)</option>
                  <option value="Final Capstone Defense & Oral Examination">Final Capstone Defense & Oral Examination (Dec 20, 2026)</option>
                </select>
              </div>

              {/* Individual Member Grade Cards */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#334155] uppercase tracking-wider block">
                  Individual Team Member Grading & Qualitative Feedback
                </span>

                {memberRatings.map((member, idx) => (
                  <div
                    key={member.member_id}
                    className="p-4 rounded-2xl border border-[#E2E8F0] bg-white hover:border-[#93C5FD] transition-all space-y-3 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-[#1E293B] flex items-center gap-2">
                          {member.member_name}
                          <span className="text-[10px] font-semibold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded-full border border-[#BFDBFE]">
                            {member.role}
                          </span>
                        </h4>
                        <span className="text-[11px] text-[#64748B] block mt-0.5">
                          Telemetry: {member.telemetry}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] text-[#64748B] font-bold block uppercase">Points (0-100)</span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={member.points}
                            onChange={(e) => handleRatingChange(idx, 'points', e.target.value)}
                            className="input text-xs py-1 px-2.5 w-20 text-center font-bold text-[#1E293B] border-[#CBD5E1]"
                          />
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-[#64748B] font-bold block uppercase">Effort Share (%)</span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={member.percentage}
                            onChange={(e) => handleRatingChange(idx, 'percentage', e.target.value)}
                            className="input text-xs py-1 px-2.5 w-20 text-center font-bold text-[#2563EB] border-[#CBD5E1]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Qualitative Remarks */}
                    <div>
                      <label className="text-[11px] font-semibold text-[#64748B] block mb-1">
                        Supervisor Qualitative Remarks & Defense Feedback:
                      </label>
                      <input
                        type="text"
                        value={member.qualitative_feedback}
                        onChange={(e) => handleRatingChange(idx, 'qualitative_feedback', e.target.value)}
                        placeholder="Add constructive feedback on code depth and defense readiness..."
                        className="input text-xs w-full bg-[#F8FAFC] border-[#E2E8F0]"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* OBE Certification Checkbox */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={signatureConfirmed}
                    onChange={(e) => setSignatureConfirmed(e.target.checked)}
                    className="mt-0.5 rounded text-[#2563EB] focus:ring-[#2563EB]"
                  />
                  <span className="text-emerald-950 font-medium leading-relaxed">
                    <strong>Formal Academic Certification:</strong> I hereby certify as the official Faculty Advisor that I have examined the individual technical code authorship, meeting attendance, and oral problem-solving contributions of each student according to BAETE Criteria 4 & 5 OBE guidelines.
                  </span>
                </label>
                <div className="text-[11px] text-emerald-800 flex items-center gap-1.5 pl-6 font-mono">
                  <ShieldCheck size={14} className="text-emerald-700" />
                  Submission will generate an immutable, cryptographically sealed block on the SHA-256 Merkle Ledger.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end items-center gap-3 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setEndorseModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#1E293B] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingEndorsement}
                  className="btn-primary text-xs px-5 py-2.5 font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all bg-[#2563EB] hover:bg-[#1D4ED8]"
                >
                  <ShieldCheck size={15} />
                  {submittingEndorsement ? 'Sealing on Merkle Ledger...' : 'Sign & Seal on Merkle Ledger'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
