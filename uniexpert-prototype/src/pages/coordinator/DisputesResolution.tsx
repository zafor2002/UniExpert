import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, UserCheck, ArrowRight, ShieldAlert } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const DisputesResolution: React.FC = () => {
  const [disputes, setDisputes] = useState([
    {
      id: 'disp-1',
      team: 'Team NeuroWear (Batch 41)',
      faculty: 'Prof. Md. Rafiqul Islam',
      issue: 'Proposal SLA Expired (7-Day Limit Reached with Quota Maxed)',
      suggestedAdvisor: 'Dr. Farhana Rahman (Embedded AI)',
      status: 'pending',
    },
    {
      id: 'disp-2',
      team: 'Team BioGenomics (Batch 40)',
      faculty: 'Dr. Tanvir Ahmed',
      issue: 'Interdisciplinary Co-advising Disagreement on Milestone Deliverable 3',
      suggestedAdvisor: 'Departmental Mediation Session',
      status: 'pending',
    },
  ]);

  const handleResolve = (id: string, action: string) => {
    toast.success(`Dispute resolved via: ${action}. Team notified.`);
    setDisputes(disputes.filter((d) => d.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      <div>
        <h1 className="text-xl font-bold text-[#334155] flex items-center gap-2">
          <ShieldAlert className="text-[#8AB4F8]" size={22} />
          Supervisory Disputes & Expired-Request Resolution
        </h1>
        <p className="text-xs text-[#64748B] mt-0.5">
          Departmental mediation queue for unblocking stalled capstone relationships
        </p>
      </div>

      <div className="space-y-4">
        {disputes.map((d) => (
          <div
            key={d.id}
            className="card p-6 bg-white border border-[#E2E8F0] shadow-sm rounded-3xl space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <span className="text-xs font-mono font-bold text-[#D97706] bg-[#FEF3C7] px-2.5 py-0.5 rounded-lg border border-[#FDE68A] inline-block">
                  CASE #{d.id.toUpperCase()}
                </span>
                <h3 className="text-base font-bold text-[#334155] mt-1.5">
                  {d.team} ↔ {d.faculty}
                </h3>
                <p className="text-xs text-rose-600 font-semibold mt-0.5">
                  Issue: {d.issue}
                </p>
              </div>

              <span className="text-xs text-[#64748B]">Awaiting Coordinator Intervention</span>
            </div>

            <div className="p-3.5 bg-[#F4F8FF] rounded-2xl border border-[#E2E8F0] text-xs">
              <span className="text-[#64748B] block mb-0.5 font-bold uppercase text-[10px] tracking-wider">
                Recommended Resolution:
              </span>
              <p className="text-[#334155] font-medium">
                Reassign student group to: <strong className="text-[#1E293B]">{d.suggestedAdvisor}</strong> to avoid capstone project delay.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
              <button
                onClick={() => handleResolve(d.id, 'Direct Mediation Meeting Scheduled')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#334155] bg-[#F4F8FF] hover:bg-[#EAF2FF] border border-[#E2E8F0] transition-colors"
              >
                Schedule Mediation
              </button>
              <button
                onClick={() => handleResolve(d.id, `Reassigned to ${d.suggestedAdvisor}`)}
                className="btn-primary text-xs px-4 py-2 font-semibold flex items-center gap-1.5"
              >
                <UserCheck size={14} /> Execute Administrative Reassignment
              </button>
            </div>
          </div>
        ))}

        {disputes.length === 0 && (
          <div className="card p-12 text-center text-[#64748B] text-xs bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
            No active supervisory disputes or stalled allocations in queue.
          </div>
        )}
      </div>
    </div>
  );
};

export default DisputesResolution;

