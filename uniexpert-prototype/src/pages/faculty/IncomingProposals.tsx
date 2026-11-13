import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GitPullRequest, CheckCircle2, MessageSquare, XCircle, Clock, 
  Layers, Shield, ArrowLeft, AlertTriangle, Users 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/shared/StatusBadge';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import type { AdvisoryProposal } from '../../types';

export const IncomingProposals: React.FC = () => {
  const navigate = useNavigate();
  const { proposals, updateProposal, updateExpertQuota, experts } = useApp();
  const faculty = experts[0]; // Dr. Farhana Rahman

  const proposal = proposals[0];

  // Auto-move status to 'under_review' on open if it was 'submitted'
  useEffect(() => {
    if (proposal && proposal.state === 'submitted') {
      const updated: AdvisoryProposal = {
        ...proposal,
        state: 'under_review',
        updatedAt: new Date().toISOString(),
        timeline: [
          ...proposal.timeline,
          {
            id: `ev-${Date.now()}`,
            state: 'under_review',
            timestamp: new Date().toISOString(),
            actor: 'Dr. Farhana Rahman (Faculty)',
            note: 'Proposal opened for detailed faculty technical evaluation',
          },
        ],
      };
      updateProposal(updated);
    }
  }, [proposal]);

  const [confirmAcceptOpen, setConfirmAcceptOpen] = useState(false);
  const [showNegotiationForm, setShowNegotiationForm] = useState(false);
  const [negotiationNote, setNegotiationNote] = useState(
    'Scope needs to benchmark TinyML on ARM Cortex-M4 hardware with CMSIS-NN vs TensorFlow Lite comparison. Please add a hardware benchmarking milestone.'
  );

  const [showDeclineForm, setShowDeclineForm] = useState(false);
  const [declineReason, setDeclineReason] = useState('Out of domain scope for current lab semester');

  const handleAcceptProposal = () => {
    if (!proposal) return;

    const updated: AdvisoryProposal = {
      ...proposal,
      state: 'accepted',
      updatedAt: new Date().toISOString(),
      timeline: [
        ...proposal.timeline,
        {
          id: `ev-${Date.now()}`,
          state: 'accepted',
          timestamp: new Date().toISOString(),
          actor: 'Dr. Farhana Rahman (Faculty)',
          note: 'Proposal officially accepted for primary supervision. Active workspace provisioned.',
        },
      ],
    };

    updateProposal(updated);
    updateExpertQuota(faculty.id, 1); // Decrements available slots (increases slotsUsed)
    setConfirmAcceptOpen(false);
    toast.success('Proposal accepted. Supervisory quota decremented: 3 → 2 slots remaining.');
    
    setTimeout(() => {
      navigate('/student/workspace');
    }, 1500);
  };

  const handleSendNegotiation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposal) return;

    const updated: AdvisoryProposal = {
      ...proposal,
      state: 'negotiation',
      negotiationNote,
      updatedAt: new Date().toISOString(),
      timeline: [
        ...proposal.timeline,
        {
          id: `ev-${Date.now()}`,
          state: 'negotiation',
          timestamp: new Date().toISOString(),
          actor: 'Dr. Farhana Rahman (Faculty)',
          note: negotiationNote,
        },
      ],
    };

    updateProposal(updated);
    setShowNegotiationForm(false);
    toast.success('Negotiation conditions dispatched to student team lead.');
  };

  const handleDeclineProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposal) return;

    const updated: AdvisoryProposal = {
      ...proposal,
      state: 'declined',
      updatedAt: new Date().toISOString(),
      timeline: [
        ...proposal.timeline,
        {
          id: `ev-${Date.now()}`,
          state: 'declined',
          timestamp: new Date().toISOString(),
          actor: 'Dr. Farhana Rahman (Faculty)',
          note: `Declined: ${declineReason}`,
        },
      ],
    };

    updateProposal(updated);
    setShowDeclineForm(false);
    toast.success('Proposal declined. Student prompted to review alternative advisors.');
  };

  if (!proposal) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h2 className="text-lg font-bold">No Proposals Currently in Queue</h2>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      <button
        onClick={() => navigate('/faculty')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Faculty Dashboard
      </button>

      {/* Main Review Card */}
      <div className="card p-6 md:p-8 space-y-6 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold text-[#1E293B] bg-[#EAF2FF] px-2.5 py-0.5 rounded-full border border-[#8AB4F8]/40">
                Solicitation #{proposal.id.toUpperCase()}
              </span>
              <StatusBadge status={proposal.state} />
              <span className="text-xs text-[#64748B]">· Fall 2026 Batch 41</span>
            </div>
            <h1 className="text-xl font-bold text-[#1E293B]">
              {proposal.projectTitle}
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Student Lead: <strong className="text-[#1E293B]">Abu Zafor</strong> (ID: 232-35-331) & <strong className="text-[#1E293B]">Anamul Haque</strong> · Department of Software Engineering
            </p>
          </div>

          <div className="bg-[#F4F8FF] p-3.5 rounded-2xl border border-[#E2E8F0] text-right shrink-0">
            <span className="text-[10px] text-[#64748B] uppercase font-bold block">AI Fit Alignment</span>
            <span className="text-xl font-extrabold text-[#1E293B]">
              {proposal.aiAlignmentScore}% Match
            </span>
          </div>
        </div>

        {/* XAI Hybrid Decomposition Preview */}
        <div className="p-5 rounded-2xl bg-[#F4F8FF] border border-[#E2E8F0] space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-[#1E293B]">
            <span className="flex items-center gap-1.5">
              <Layers size={14} className="text-[#8AB4F8]" />
              Explainable AI Alignment Breakdown (Normalized to 100%)
            </span>
            <span className="text-[11px] font-mono text-[#64748B]">FastEmbed Qdrant Engine</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-white border border-[#8AB4F8]/40 shadow-2xs">
              <span className="text-[10px] text-[#64748B] block">45% Vector Sim</span>
              <span className="font-bold text-[#1E293B]">0.941 Cosine</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-[#A7E8D0] shadow-2xs">
              <span className="text-[10px] text-[#64748B] block">30% Skill Overlap</span>
              <span className="font-bold text-[#1E293B]">6 / 8 Matched</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-[#A5B4FC]/40 shadow-2xs">
              <span className="text-[10px] text-[#64748B] block">15% Credential Tier</span>
              <span className="font-bold text-[#1E293B]">Tier 2 Verified</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-amber-200 shadow-2xs">
              <span className="text-[10px] text-[#64748B] block">10% Bandwidth</span>
              <span className="font-bold text-[#1E293B]">2 / 5 Slots Used</span>
            </div>
          </div>
        </div>

        {/* Project Synopsis */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
            Project Statement Synopsis
          </h3>
          <p className="text-xs text-[#334155] leading-relaxed bg-[#F4F8FF] p-4 rounded-2xl border border-[#E2E8F0]">
            {proposal.synopsis}
          </p>
        </div>

        {/* Proposed Milestones */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
            Student Proposed Milestones
          </h3>
          <div className="space-y-2">
            {proposal.milestones.map((m, idx) => (
              <div
                key={m.id}
                className="p-3.5 rounded-2xl border border-[#E2E8F0] bg-[#F4F8FF] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#EAF2FF] text-[#1E293B] border border-[#8AB4F8]/40 text-[11px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-[#1E293B] block">{m.title}</span>
                    <span className="text-[11px] text-[#64748B]">{m.description}</span>
                  </div>
                </div>
                <span className="font-mono text-[#64748B] font-medium shrink-0">Due: {m.dueDate}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Negotiation Form Box (Conditional) */}
        {showNegotiationForm && (
          <form onSubmit={handleSendNegotiation} className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="text-amber-700" size={16} />
              <span className="text-xs font-bold text-amber-950">
                Specify Scope Negotiation Condition:
              </span>
            </div>
            <textarea
              rows={3}
              value={negotiationNote}
              onChange={(e) => setNegotiationNote(e.target.value)}
              className="input text-xs leading-relaxed"
              required
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowNegotiationForm(false)}
                className="btn-secondary text-xs px-3.5 py-1.5 rounded-xl"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary text-xs px-4 py-2 rounded-xl font-semibold shadow-sm">
                Dispatch Condition to Team
              </button>
            </div>
          </form>
        )}

        {/* Decline Form Box (Conditional) */}
        {showDeclineForm && (
          <form onSubmit={handleDeclineProposal} className="p-5 rounded-2xl bg-red-50 border border-red-200 space-y-3">
            <div className="flex items-center gap-2">
              <XCircle className="text-red-600" size={16} />
              <span className="text-xs font-bold text-red-950">
                Provide Institutional Decline Rationale:
              </span>
            </div>
            <select
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              className="input text-xs"
            >
              <option value="Out of domain scope for current lab semester">Out of domain scope for current lab semester</option>
              <option value="Supervisory quota reached for hardware track">Supervisory quota reached for hardware track</option>
              <option value="Conflict of interest or insufficient hardware resources">Conflict of interest or insufficient hardware resources</option>
              <option value="Prerequisites not met by student group">Prerequisites not met by student group</option>
            </select>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowDeclineForm(false)}
                className="btn-secondary text-xs px-3.5 py-1.5 rounded-xl"
              >
                Cancel
              </button>
              <button type="submit" className="btn-danger text-xs px-4 py-2 rounded-xl">
                Confirm Decline Decision
              </button>
            </div>
          </form>
        )}

        {/* Action Decision Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#E2E8F0]">
          <div className="text-xs text-[#64748B] flex items-center gap-1.5">
            <Clock size={14} className="text-[#8AB4F8]" />
            <span>Auto-decrement: Accepting binds 1 of your remaining 3 supervisory slots.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                setShowDeclineForm(true);
                setShowNegotiationForm(false);
              }}
              className="btn-secondary text-xs text-red-600 hover:text-red-700 border border-red-200 hover:bg-red-50 flex-1 sm:flex-none justify-center px-4 py-2 rounded-xl"
            >
              <XCircle size={14} /> Decline
            </button>

            <button
              type="button"
              onClick={() => {
                setShowNegotiationForm(true);
                setShowDeclineForm(false);
              }}
              className="btn-secondary text-xs flex-1 sm:flex-none justify-center px-4 py-2 rounded-xl"
            >
              <MessageSquare size={14} /> Request Negotiation
            </button>

            <button
              type="button"
              onClick={() => setConfirmAcceptOpen(true)}
              className="btn-primary text-xs px-5 py-2.5 font-bold flex-1 sm:flex-none justify-center rounded-xl shadow-sm"
            >
              <CheckCircle2 size={14} /> Accept Proposal
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmAcceptOpen}
        onClose={() => setConfirmAcceptOpen(false)}
        onConfirm={handleAcceptProposal}
        title="Accept Capstone Supervision"
        message="Are you sure you want to formally accept EdgeShield as primary advisor? This will decrement your available quota by 1 and provision the collaboration workspace."
        confirmLabel="Accept & Provision Workspace"
      />
    </div>
  );
};

export default IncomingProposals;

