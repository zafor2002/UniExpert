import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, ExternalLink, BookOpen, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PendingFaculty {
  id: string;
  name: string;
  email: string;
  dept: string;
  title: string;
  pubsCount: number;
  hIndex: number;
  submittedAt: string;
}

export const FacultyVerification: React.FC = () => {
  const [pendingList, setPendingList] = useState<PendingFaculty[]>([
    {
      id: 'f-1',
      name: 'Dr. Shohel Arman',
      email: 'shohel.arman@diu.edu.bd',
      dept: 'Software Engineering',
      title: 'Assistant Professor',
      pubsCount: 18,
      hIndex: 7,
      submittedAt: 'Nov 09, 2026',
    },
    {
      id: 'f-2',
      name: 'Dr. Nadia Sultana',
      email: 'nadia.cse@diu.edu.bd',
      dept: 'Computer Science',
      title: 'Senior Lecturer',
      pubsCount: 11,
      hIndex: 5,
      submittedAt: 'Nov 10, 2026',
    },
  ]);

  const [selectedFaculty, setSelectedFaculty] = useState<PendingFaculty>(pendingList[0]);
  const [selectedTier, setSelectedTier] = useState<1 | 2 | 3>(1);
  const [justification, setJustification] = useState(
    'Reviewed 18 publications on Scholar, h-index 7 confirmed. Promoted to verified Tier 1 capstone advisor.'
  );

  const handleApprove = () => {
    toast.success(`Dr. ${selectedFaculty.name} verified as Tier ${selectedTier} Advisor.`);
    setPendingList(pendingList.filter((f) => f.id !== selectedFaculty.id));
  };

  const handleReject = () => {
    toast.error('Faculty accreditation rejected. Notification sent with revision note.');
    setPendingList(pendingList.filter((f) => f.id !== selectedFaculty.id));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24">
      <div>
        <h1 className="text-xl font-bold text-[#334155] flex items-center gap-2">
          <Award className="text-[#8AB4F8]" size={22} />
          Faculty Accreditation & Verification Queue
        </h1>
        <p className="text-xs text-[#64748B] mt-0.5">
          Verify academic credentials, publication citations, and assign institutional tier weight
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Pending List */}
        <div className="card p-6 space-y-4 bg-white border border-[#E2E8F0] shadow-sm rounded-3xl">
          <h2 className="text-base font-bold text-[#334155]">
            Pending Submissions ({pendingList.length})
          </h2>

          <div className="space-y-2">
            {pendingList.map((fac) => (
              <button
                key={fac.id}
                type="button"
                onClick={() => setSelectedFaculty(fac)}
                className={`w-full p-3.5 rounded-2xl border text-left transition-all ${
                  selectedFaculty?.id === fac.id
                    ? 'border-[#8AB4F8] bg-[#EAF2FF] ring-2 ring-[#8AB4F8]/30'
                    : 'border-[#E2E8F0] bg-white hover:bg-[#F4F8FF]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-[#334155]">{fac.name}</span>
                  <span className="text-[10px] text-[#64748B] font-mono">{fac.submittedAt}</span>
                </div>
                <p className="text-[11px] text-[#64748B]">{fac.title} · {fac.dept}</p>
                <div className="flex gap-3 text-[10px] text-[#2563EB] font-mono mt-1 font-semibold">
                  <span>{fac.pubsCount} Pubs</span>
                  <span>h-index: {fac.hIndex}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Verification Review & Tier Selection */}
        <div className="lg:col-span-2 card p-6 space-y-5 bg-white border border-[#E2E8F0] shadow-sm rounded-3xl">
          <div className="flex justify-between items-start pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-lg font-bold text-[#334155]">{selectedFaculty.name}</h3>
              <p className="text-xs text-[#64748B]">{selectedFaculty.title} · {selectedFaculty.dept}</p>
              <p className="text-[11px] font-mono text-[#64748B] mt-0.5">{selectedFaculty.email}</p>
            </div>
            <a
              href="#scholar"
              className="text-xs text-[#2563EB] hover:underline flex items-center gap-1 font-semibold"
            >
              Verify on Google Scholar <ExternalLink size={12} />
            </a>
          </div>

          {/* Tier Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-[#334155] uppercase tracking-wider block">
              Assign Institutional Verification Tier:
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { tier: 1, title: 'Tier 1: Associate', desc: '< 10 pubs, h < 5' },
                { tier: 2, title: 'Tier 2: Senior', desc: '10-25 pubs, h 5-15' },
                { tier: 3, title: 'Tier 3: Chair', desc: '> 25 pubs, h > 15' },
              ].map((t) => (
                <button
                  key={t.tier}
                  type="button"
                  onClick={() => setSelectedTier(t.tier as 1 | 2 | 3)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    selectedTier === t.tier
                      ? 'border-[#8AB4F8] bg-[#EAF2FF] text-[#1E293B] ring-2 ring-[#8AB4F8]/30'
                      : 'border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F4F8FF]'
                  }`}
                >
                  <span className="text-xs font-bold block">{t.title}</span>
                  <span className="text-[10px] text-[#64748B] block mt-0.5">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mandatory Justification Note */}
          <div className="space-y-2">
            <label className="label text-xs font-semibold text-[#334155]">Institutional Justification Rationale (Mandatory for Audit Trail)</label>
            <textarea
              rows={3}
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              className="input text-xs leading-relaxed border-[#E2E8F0] focus:border-[#8AB4F8] bg-white"
              required
            />
          </div>

          {/* Decision Buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <button
              onClick={handleReject}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 border border-rose-200 hover:bg-rose-50 transition-colors flex items-center gap-1.5"
            >
              <XCircle size={14} /> Reject Accreditation
            </button>
            <button
              onClick={handleApprove}
              className="btn-primary text-xs px-5 py-2 font-semibold flex items-center gap-1.5"
            >
              <CheckCircle2 size={14} /> Approve & Grant Tier {selectedTier}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyVerification;

