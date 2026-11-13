import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Send, Plus, Trash2, Shield, Clock, AlertTriangle, ArrowLeft, CheckCircle2, Award } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useApp } from '../../context/AppContext';
import type { Milestone, AdvisoryProposal } from '../../types';

export const ProposalModal: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const expertIdParam = searchParams.get('expertId') || 'exp-1';

  const { experts, addProposal } = useApp();
  const expert = experts.find((e) => e.id === expertIdParam) || experts[0];

  const [title, setTitle] = useState('EdgeShield: BLE-Based ECG Monitoring with TinyML Anomaly Detection');
  const [synopsis, setSynopsis] = useState(
    'We propose EdgeShield — a resource-constrained ECG monitoring system deploying CNN-based arrhythmia detection on ARM Cortex-M4 microcontrollers. Data is transmitted via BLE 5.0 with AES-GCM encryption and published to a healthcare cloud via MQTT-over-TLS. The system targets HIPAA compliance under 3mW average power budget.'
  );
  const [scope, setScope] = useState<'primary' | 'co_advisor'>('primary');
  const [weeklyCommitment, setWeeklyCommitment] = useState(12);
  const [meetingFrequency, setMeetingFrequency] = useState('Weekly (every Tuesday)');
  const [motivation, setMotivation] = useState(
    "Dr. Rahman's TinyML-on-Cortex-M4 research directly aligns with our hardware target. Her BLE mesh security expertise is critical for our MQTT transport layer."
  );

  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: 'm1', title: 'Hardware prototype & BLE stack setup', dueDate: '2026-10-30', description: 'nRF52840 DK + ECG sensor integration' },
    { id: 'm2', title: 'TinyML model training & quantization', dueDate: '2026-11-20', description: 'CNN on PTB-XL dataset, 8-bit INT quantization, CMSIS-NN deployment' },
    { id: 'm3', title: 'AES-GCM security layer & MQTT integration', dueDate: '2026-12-05', description: 'mbedTLS AES-128-GCM + MQTT broker setup' },
    { id: 'm4', title: 'End-to-end testing & final defense', dueDate: '2026-12-20', description: 'System integration test + performance benchmarking' },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleAddMilestone = () => {
    const newM: Milestone = {
      id: `m-${Date.now()}`,
      title: 'New Project Deliverable',
      dueDate: '2026-12-15',
      description: 'Formal implementation and validation report',
    };
    setMilestones([...milestones, newM]);
  };

  const handleRemoveMilestone = (id: string) => {
    if (milestones.length <= 1) {
      toast.error('At least one milestone deliverable is required.');
      return;
    }
    setMilestones(milestones.filter((m) => m.id !== id));
  };

  const handleMilestoneChange = (id: string, field: keyof Milestone, value: string) => {
    setMilestones(milestones.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);

      const newProp: AdvisoryProposal = {
        id: `prop-${Date.now()}`,
        studentId: 'stu-1',
        expertId: expert.id,
        projectTitle: title,
        synopsis,
        milestones,
        weeklyCommitment,
        meetingFrequency,
        motivation,
        scope,
        state: 'submitted',
        aiAlignmentScore: 94,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        timeline: [
          { id: `ev-${Date.now()}-1`, state: 'draft', timestamp: new Date().toISOString(), actor: 'Abu Zafor', note: 'Created proposal draft' },
          { id: `ev-${Date.now()}-2`, state: 'submitted', timestamp: new Date().toISOString(), actor: 'Abu Zafor', note: 'Formal solicitation dispatched' },
        ],
      };

      addProposal(newProp);
      setSubmittedSuccess(true);
      toast.success('Proposal submitted successfully. The advisor has 7 days to respond.');
    }, 1200);
  };

  const triggerRaceConditionError = () => {
    toast.error("Professor's quota was filled by another group.");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      {/* Header back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Target Expert Card */}
      <div className="card p-6 bg-white border border-[#E2E8F0] shadow-sm rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#EAF2FF] border border-[#8AB4F8]/50 flex items-center justify-center text-xl font-bold text-[#1E293B]">
            {expert.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#1E293B]">{expert.name}</h2>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold bg-[#EAF2FF] text-[#1E293B] border border-[#8AB4F8]/40">
                Tier {expert.tier}
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">{expert.title} · {expert.department}</p>
            <p className="text-[11px] text-[#64748B] mt-0.5">
              Current Load: {expert.slotsUsed} of {expert.slotsTotal} Supervisory Slots Assigned
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 bg-[#A7E8D0]/25 border border-[#A7E8D0] px-4 py-2.5 rounded-2xl">
          <Award className="text-emerald-700" size={20} />
          <div>
            <span className="text-[10px] uppercase font-bold text-[#1E293B] block">AI Alignment Score</span>
            <span className="text-sm font-extrabold text-[#1E293B]">94% Semantic Match</span>
          </div>
        </div>
      </div>

      {/* Success banner after submission */}
      {submittedSuccess ? (
        <div className="card p-8 text-center space-y-4 border border-[#A7E8D0] bg-[#A7E8D0]/15 rounded-3xl animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-[#A7E8D0] text-[#1E293B] flex items-center justify-center mx-auto">
            <CheckCircle2 size={36} />
          </div>
          <h3 className="text-xl font-bold text-[#1E293B]">Proposal Dispatched into FSM Queue</h3>
          <p className="text-sm text-[#334155] max-w-lg mx-auto">
            Your formal solicitation has been submitted to {expert.name}. The platform enforces an automatic <strong>7-Day Response SLA</strong>.
          </p>

          <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] max-w-md mx-auto text-left flex items-start gap-3 shadow-2xs">
            <Clock className="text-[#8AB4F8] shrink-0 mt-0.5" size={18} />
            <div className="text-xs text-[#64748B]">
              <span className="font-bold text-[#1E293B] block">7-Day Auto-Response Timer Active:</span>
              If no decision or negotiation request is made within 7 days (by Nov 18, 2026), the system will suggest next-best advisors to protect your capstone timeline.
            </div>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <button onClick={() => navigate('/student/requests')} className="btn-primary text-xs px-5 py-2.5 rounded-xl">
              Track Request Status (FSM Stepper)
            </button>
            <button onClick={() => navigate('/student/discovery')} className="btn-secondary text-xs px-5 py-2.5 rounded-xl">
              Back to Discovery
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmitProposal} className="space-y-6">
          {/* Main proposal form card */}
          <div className="card p-6 md:p-8 space-y-5 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1E293B]">
                Formal Advisory Proposal Form
              </h3>
              {/* Privacy badge */}
              <span className="text-xs text-[#334155] bg-[#EAF2FF] border border-[#E2E8F0] px-3 py-1 rounded-full flex items-center gap-1 font-medium">
                <Shield size={12} className="text-[#8AB4F8]" /> Proposals remain private until you submit
              </span>
            </div>

            {/* Scope Toggle */}
            <div>
              <label className="label text-[#334155] font-semibold">Supervisory Relationship Scope</label>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => setScope('primary')}
                  className={`p-3.5 rounded-2xl border text-xs font-bold transition-all text-left ${
                    scope === 'primary'
                      ? 'bg-[#EAF2FF] border-2 border-[#8AB4F8] text-[#1E293B] ring-2 ring-[#8AB4F8]/20'
                      : 'border-[#E2E8F0] hover:bg-[#F4F8FF] text-[#334155]'
                  }`}
                >
                  <span className="block text-sm text-[#1E293B]">Primary Supervisor</span>
                  <span className="text-[11px] font-normal text-[#64748B]">Official lead advisor for credit and grading</span>
                </button>

                <button
                  type="button"
                  onClick={() => setScope('co_advisor')}
                  className={`p-3.5 rounded-2xl border text-xs font-bold transition-all text-left ${
                    scope === 'co_advisor'
                      ? 'bg-[#EAF2FF] border-2 border-[#8AB4F8] text-[#1E293B] ring-2 ring-[#8AB4F8]/20'
                      : 'border-[#E2E8F0] hover:bg-[#F4F8FF] text-[#334155]'
                  }`}
                >
                  <span className="block text-sm text-[#1E293B]">Co-Advisor / Specialist</span>
                  <span className="text-[11px] font-normal text-[#64748B]">Cross-department or industry domain expert</span>
                </button>
              </div>
            </div>

            {/* Project Title */}
            <div>
              <label className="label">Capstone Project Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input text-sm font-semibold"
                required
              />
            </div>

            {/* Project Synopsis */}
            <div>
              <label className="label">Pre-filled Problem Synopsis & Scope Formulation</label>
              <textarea
                rows={4}
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
                className="input text-xs leading-relaxed"
                required
              />
            </div>

            {/* Commitment & Meetings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Team Weekly Hours Commitment</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={4}
                    max={40}
                    value={weeklyCommitment}
                    onChange={(e) => setWeeklyCommitment(Number(e.target.value))}
                    className="input text-xs w-28"
                  />
                  <span className="text-xs text-slate-500">Hours / Week / Member</span>
                </div>
              </div>

              <div>
                <label className="label">Desired Consultation Frequency</label>
                <select
                  value={meetingFrequency}
                  onChange={(e) => setMeetingFrequency(e.target.value)}
                  className="input text-xs"
                >
                  <option value="Weekly (every Tuesday)">Weekly (every Tuesday)</option>
                  <option value="Bi-weekly (Alternate Weeks)">Bi-weekly (Alternate Weeks)</option>
                  <option value="Monthly Milestone Sign-off">Monthly Milestone Sign-off</option>
                  <option value="Asynchronous Code Review">Asynchronous Code Review</option>
                </select>
              </div>
            </div>

            {/* Motivation statement */}
            <div>
              <label className="label">Why this advisor? (Alignment Rationale)</label>
              <textarea
                rows={3}
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                className="input text-xs leading-relaxed"
                required
              />
            </div>
          </div>

          {/* Milestone Deliverable Builder Card */}
          <div className="card p-6 md:p-8 space-y-4 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1E293B]">
                  Collaborative Milestone Roadmap
                </h3>
                <p className="text-xs text-[#64748B]">
                  Explicit timeline agreed upon before formal supervisor commitment
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddMilestone}
                className="btn-secondary text-xs px-3.5 py-1.5 rounded-xl"
              >
                <Plus size={14} /> Add Milestone
              </button>
            </div>

            <div className="space-y-3">
              {milestones.map((m, idx) => (
                <div key={m.id} className="p-4 rounded-2xl border border-[#E2E8F0] bg-[#F4F8FF] flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <span className="w-7 h-7 rounded-full bg-[#EAF2FF] text-[#1E293B] border border-[#8AB4F8]/50 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full">
                    <input
                      type="text"
                      placeholder="Milestone Deliverable Title"
                      value={m.title}
                      onChange={(e) => handleMilestoneChange(m.id, 'title', e.target.value)}
                      className="input text-xs sm:col-span-2"
                      required
                    />
                    <input
                      type="date"
                      value={m.dueDate}
                      onChange={(e) => handleMilestoneChange(m.id, 'dueDate', e.target.value)}
                      className="input text-xs font-mono"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMilestone(m.id)}
                    className="text-[#64748B] hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-white"
                    title="Remove milestone"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row & Race Condition Simulation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            {/* Race condition button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={triggerRaceConditionError}
                className="text-xs text-amber-800 border border-amber-200 bg-amber-50 px-3.5 py-2 rounded-xl hover:bg-amber-100 transition-colors flex items-center gap-1.5 font-medium"
              >
                <AlertTriangle size={13} className="text-amber-600" />
                Simulate Quota Race Condition
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-secondary text-xs px-4 py-2.5 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary text-xs px-6 py-2.5 font-bold rounded-xl shadow-sm"
              >
                <Send size={14} />
                {submitting ? 'Dispatching...' : 'Dispatch Proposal to Advisor'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProposalModal;

