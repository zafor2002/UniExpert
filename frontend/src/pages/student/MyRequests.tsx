import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GitPullRequest, CheckCircle2, Clock, AlertCircle, RefreshCw, Send, 
  ArrowRight, MessageSquare, ChevronRight, UserCheck, ShieldAlert 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/shared/StatusBadge';
import type { FSMState, AdvisoryProposal } from '../../types';

const FSM_STEPS: { state: FSMState; label: string }[] = [
  { state: 'draft', label: 'Draft' },
  { state: 'submitted', label: 'Submitted' },
  { state: 'under_review', label: 'Under Review' },
  { state: 'negotiation', label: 'Negotiation' },
  { state: 'accepted', label: 'Accepted' },
];

export const MyRequests: React.FC = () => {
  const navigate = useNavigate();
  const { proposals, updateProposal, experts } = useApp();

  const [activeTab, setActiveTab] = useState<'active' | 'expired'>('active');
  const [revisionText, setRevisionText] = useState(
    'Added Milestone 2.5: Benchmark CMSIS-NN 8-bit quantized kernel against TensorFlow Lite for Microcontrollers on nRF52840 (ARM Cortex-M4 @ 64MHz). Will record execution cycle count and RAM consumption.'
  );
  const [submittingRevision, setSubmittingRevision] = useState(false);

  // Proposal 1 in negotiation
  const negotiationProp = proposals[0];

  const handleResubmitRevision = () => {
    if (!negotiationProp) return;
    setSubmittingRevision(true);

    setTimeout(() => {
      setSubmittingRevision(false);
      const updated: AdvisoryProposal = {
        ...negotiationProp,
        state: 'submitted',
        updatedAt: new Date().toISOString(),
        timeline: [
          ...negotiationProp.timeline,
          {
            id: `ev-${Date.now()}`,
            state: 'submitted',
            timestamp: new Date().toISOString(),
            actor: 'Abu Zafor (Student)',
            note: `Revised roadmap submitted: ${revisionText.slice(0, 80)}...`,
          },
        ],
      };
      updateProposal(updated);
      toast.success('Revised roadmap submitted successfully. Advisor has been notified.');
    }, 1000);
  };

  const getStepStatus = (stepState: FSMState, currentState: FSMState) => {
    const order: FSMState[] = ['draft', 'submitted', 'under_review', 'negotiation', 'accepted'];
    const currentIndex = order.indexOf(currentState);
    const stepIndex = order.indexOf(stepState);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1E293B] flex items-center gap-2">
            <GitPullRequest className="text-[#334155]" size={22} />
            Supervisory Solicitation Lifecycle (FSM)
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Finite State Machine tracking every stage of capstone supervisory proposals
          </p>
        </div>

        <div className="flex bg-white border border-[#E2E8F0] p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'active'
                ? 'bg-[#8AB4F8] text-[#1E293B] shadow-sm'
                : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            Active Pipeline (1)
          </button>
          <button
            onClick={() => setActiveTab('expired')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'expired'
                ? 'bg-[#8AB4F8] text-[#1E293B] shadow-sm'
                : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            Historical & Expired (1)
          </button>
        </div>
      </div>

      {activeTab === 'active' && negotiationProp && (
        <div className="space-y-6">
          {/* Main active request card */}
          <div className="card p-6 md:p-8 space-y-6 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-[#1E293B] bg-[#EAF2FF] px-2.5 py-0.5 rounded-full border border-[#8AB4F8]/40">
                    ID: #{negotiationProp.id.toUpperCase()}
                  </span>
                  <StatusBadge status={negotiationProp.state} />
                  <span className="text-xs text-[#64748B]">· Submitted Nov 1, 2026</span>
                </div>
                <h2 className="text-lg font-bold text-[#1E293B]">
                  {negotiationProp.projectTitle}
                </h2>
                <p className="text-xs text-[#64748B] mt-1">
                  Target Advisor: <strong className="text-[#1E293B]">Dr. Farhana Rahman</strong> · Department of Software Engineering
                </p>
              </div>

              <div className="text-right shrink-0 bg-[#F4F8FF] p-3 rounded-2xl border border-[#E2E8F0]">
                <span className="text-[10px] uppercase font-bold text-[#64748B] block">AI Alignment Fit</span>
                <span className="text-base font-extrabold text-[#1E293B]">
                  {negotiationProp.aiAlignmentScore}% Match
                </span>
              </div>
            </div>

            {/* Horizontal FSM Stepper */}
            <div className="pt-2">
              <span className="text-xs font-bold text-[#1E293B] uppercase tracking-wider block mb-4">
                FSM State Machine Progression
              </span>

              <div className="relative flex items-center justify-between">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[#E2E8F0] -z-0" />
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#8AB4F8] transition-all duration-500 -z-0"
                  style={{ width: '75%' }} 
                />

                {FSM_STEPS.map((step) => {
                  const status = getStepStatus(step.state, negotiationProp.state);
                  return (
                    <div key={step.state} className="flex flex-col items-center z-10 bg-white px-2">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                          status === 'completed'
                            ? 'bg-[#A7E8D0] text-[#1E293B] border border-emerald-400'
                            : status === 'current'
                            ? 'bg-[#8AB4F8] text-[#1E293B] ring-4 ring-[#8AB4F8]/30 font-bold'
                            : 'bg-[#F4F8FF] border border-[#E2E8F0] text-[#64748B]'
                        }`}
                      >
                        {status === 'completed' ? (
                          <CheckCircle2 size={18} className="text-emerald-800" />
                        ) : (
                          <span>{FSM_STEPS.indexOf(step) + 1}</span>
                        )}
                      </div>
                      <span
                        className={`text-[11px] font-semibold mt-2 ${
                          status === 'current'
                            ? 'text-[#1E293B] font-bold'
                            : status === 'completed'
                            ? 'text-emerald-800'
                            : 'text-[#64748B]'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Negotiation Feedback Thread */}
            {negotiationProp.state === 'negotiation' && (
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="text-amber-700" size={16} />
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                    Advisor Scope Negotiation Condition
                  </span>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-amber-200/70 text-xs text-[#334155] italic leading-relaxed shadow-2xs">
                  "{negotiationProp.negotiationNote}"
                </div>

                {/* Revision textarea & Resubmit action */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-[#1E293B]">
                    Draft Revised Scope & Roadmap:
                  </label>
                  <textarea
                    rows={3}
                    value={revisionText}
                    onChange={(e) => setRevisionText(e.target.value)}
                    className="input text-xs leading-relaxed"
                  />
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={handleResubmitRevision}
                      disabled={submittingRevision}
                      className="btn-primary text-xs px-5 py-2.5 rounded-xl font-semibold shadow-sm"
                    >
                      <RefreshCw size={14} className={submittingRevision ? 'animate-spin' : ''} />
                      {submittingRevision ? 'Resubmitting...' : 'Re-submit Revised Roadmap'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Audit Timeline History */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-[#1E293B] uppercase tracking-wider block">
                Immutable Lifecycle Timeline
              </span>
              <div className="space-y-2">
                {negotiationProp.timeline.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 text-xs p-3 rounded-xl bg-[#F4F8FF] border border-[#E2E8F0]"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#8AB4F8] mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1E293B] capitalize">
                          {event.state.replace('_', ' ')}: {event.actor}
                        </span>
                        <span className="text-[10px] text-[#64748B] font-mono">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>
                      {event.note && (
                        <p className="text-[#334155] mt-1">{event.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expired State / Fallback Suggestions Tab */}
      {activeTab === 'expired' && (
        <div className="space-y-6">
          <div className="card p-6 md:p-8 space-y-5 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#64748B] bg-[#F4F8FF] border border-[#E2E8F0] px-2.5 py-0.5 rounded-full">
                  ID: #PROP-EXPIRED-8802
                </span>
                <span className="ml-2">
                  <StatusBadge status="expired" />
                </span>
                <h2 className="text-base font-bold text-[#1E293B] mt-1">
                  Wearable IoT Bio-Patch with Cloud Analytics
                </h2>
                <p className="text-xs text-[#64748B]">Solicitation to: Prof. Md. Rafiqul Islam (Expired Nov 05, 2026)</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3">
              <ShieldAlert className="text-red-600 shrink-0 mt-0.5" size={18} />
              <div className="text-xs text-red-900">
                <span className="font-bold block mb-0.5">7-Day Response SLA Expired:</span>
                The professor reached supervisory quota limit (5/5) without completing this solicitation. The state machine has marked this request as EXPIRED. Re-submission is disabled.
              </div>
            </div>

            {/* Next-best Advisor Recommendations */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck size={16} className="text-[#8AB4F8]" />
                System Recommended Next-Best Faculty Advisors
              </h3>
              <p className="text-xs text-[#64748B]">
                Automatically ranked by vector similarity to bypass expired pipeline blockage:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl border border-[#E2E8F0] bg-[#F4F8FF] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#1E293B] block">Dr. Shohel Arman</span>
                    <span className="text-[11px] text-[#64748B]">Software Engineering · 3/5 Slots</span>
                    <span className="text-[10px] font-bold text-[#1E293B] block mt-0.5">78% Semantic Fit</span>
                  </div>
                  <button
                    onClick={() => navigate('/student/proposal-modal?expertId=exp-5')}
                    className="btn-secondary text-[11px] py-1.5 px-3 rounded-xl"
                  >
                    Transfer Proposal <ArrowRight size={12} />
                  </button>
                </div>

                <div className="p-4 rounded-2xl border border-[#E2E8F0] bg-[#F4F8FF] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#1E293B] block">Dr. Tanvir Ahmed</span>
                    <span className="text-[11px] text-[#64748B]">Pharmacy / Bio · 1/4 Slots</span>
                    <span className="text-[10px] font-bold text-[#1E293B] block mt-0.5">71% Semantic Fit</span>
                  </div>
                  <button
                    onClick={() => navigate('/student/proposal-modal?expertId=exp-2')}
                    className="btn-secondary text-[11px] py-1.5 px-3 rounded-xl"
                  >
                    Transfer Proposal <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRequests;

