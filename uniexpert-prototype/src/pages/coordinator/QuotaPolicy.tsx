import React, { useState } from 'react';
import { Shield, Plus, ArrowUpRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const QuotaPolicy: React.FC = () => {
  const [defaultCap, setDefaultCap] = useState(5);
  const [facultySelect, setFacultySelect] = useState('Dr. Farhana Rahman');
  const [overrideValue, setOverrideValue] = useState(6);
  const [rationale, setRationale] = useState(
    'Special departmental dispensation granted for interdisciplinary medical IoT project with Department of Pharmacy.'
  );

  const [overrides, setOverrides] = useState([
    {
      id: 'ov-1',
      faculty: 'Dr. Farhana Rahman',
      original: 5,
      granted: 6,
      rationale: 'Special dispensation for interdisciplinary medical IoT',
      approvedBy: 'Prof. Dr. Syed Akhter Hossain',
      date: 'Nov 04, 2026',
    },
  ]);

  const handleApplyOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (rationale.trim().length < 20) {
      toast.error('Mandatory rationale must contain at least 20 characters.');
      return;
    }

    const ov = {
      id: `ov-${Date.now()}`,
      faculty: facultySelect,
      original: 5,
      granted: overrideValue,
      rationale: rationale.trim(),
      approvedBy: 'Coordinator Office',
      date: new Date().toLocaleDateString(),
    };

    setOverrides([...overrides, ov]);
    toast.success(`Quota override (+1) granted for ${facultySelect}.`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      <div>
        <h1 className="text-xl font-bold text-[#334155] flex items-center gap-2">
          <Shield className="text-[#8AB4F8]" size={22} />
          Departmental Supervisory Quota Override Panel
        </h1>
        <p className="text-xs text-[#64748B] mt-0.5">
          Manage institutional anti-burnout caps and record audited temporary capacity exceptions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Global Cap Policy */}
        <div className="card p-6 space-y-4 bg-white border border-[#E2E8F0] shadow-sm rounded-3xl">
          <h2 className="text-base font-bold text-[#334155]">
            Default Department Baseline
          </h2>
          <p className="text-xs text-[#64748B]">
            Standard maximum cap for regular full-time faculty advisors
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <label className="label text-xs font-semibold text-[#334155]">Institutional Cap (Groups / Semester)</label>
              <input
                type="number"
                min={1}
                max={10}
                value={defaultCap}
                onChange={(e) => setDefaultCap(Number(e.target.value))}
                className="input text-xs font-mono w-28 border-[#E2E8F0] bg-white text-[#334155]"
              />
            </div>
            <button
              onClick={() => toast.success('Department baseline quota updated to 5 groups.')}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#334155] bg-[#F4F8FF] hover:bg-[#EAF2FF] border border-[#E2E8F0] w-full justify-center transition-colors"
            >
              Update Global Baseline
            </button>
          </div>
        </div>

        {/* Right Column: Grant Override Form */}
        <div className="md:col-span-2 card p-6 space-y-4 bg-white border border-[#E2E8F0] shadow-sm rounded-3xl">
          <h2 className="text-base font-bold text-[#334155]">
            Grant Individual Faculty Quota Override (+1)
          </h2>

          <form onSubmit={handleApplyOverride} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label text-xs font-semibold text-[#334155]">Select Faculty Member</label>
                <select
                  value={facultySelect}
                  onChange={(e) => setFacultySelect(e.target.value)}
                  className="input text-xs border-[#E2E8F0] bg-white text-[#334155]"
                >
                  <option value="Dr. Farhana Rahman">Dr. Farhana Rahman (SWE)</option>
                  <option value="Dr. Tanvir Ahmed">Dr. Tanvir Ahmed (Pharmacy)</option>
                  <option value="Prof. Md. Rafiqul Islam">Prof. Md. Rafiqul Islam (CSE)</option>
                  <option value="Dr. Shohel Arman">Dr. Shohel Arman (SWE)</option>
                </select>
              </div>

              <div>
                <label className="label text-xs font-semibold text-[#334155]">New Quota Limit</label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={overrideValue}
                  onChange={(e) => setOverrideValue(Number(e.target.value))}
                  className="input text-xs font-mono border-[#E2E8F0] bg-white text-[#334155]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label text-xs font-semibold text-[#334155]">Mandatory Academic Rationale (Audited)</label>
              <textarea
                rows={3}
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                placeholder="Detailed rationale for exceeding institutional limit..."
                className="input text-xs leading-relaxed border-[#E2E8F0] bg-white text-[#334155]"
                required
              />
            </div>

            <div className="flex justify-end">
              <button type="submit" className="btn-primary text-xs px-5 py-2 font-semibold flex items-center gap-1.5">
                <CheckCircle2 size={14} /> Authorize Quota Override
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Active Overrides Table */}
      <div className="card p-6 space-y-4 bg-white border border-[#E2E8F0] shadow-sm rounded-3xl">
        <h2 className="text-base font-bold text-[#334155]">
          Active Supervisory Overrides (Fall 2026)
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[#64748B] uppercase font-mono">
                <th className="pb-2">Faculty Member</th>
                <th className="pb-2">Base → Granted</th>
                <th className="pb-2">Approved Rationale</th>
                <th className="pb-2">Authorized By</th>
                <th className="pb-2">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {overrides.map((ov) => (
                <tr key={ov.id} className="hover:bg-[#F4F8FF]/50 transition-colors">
                  <td className="py-3 font-bold text-[#334155]">{ov.faculty}</td>
                  <td className="py-3 font-mono text-[#2563EB] font-bold">
                    {ov.original} → {ov.granted} (+1)
                  </td>
                  <td className="py-3 text-[#64748B]">{ov.rationale}</td>
                  <td className="py-3 text-[#64748B]">{ov.approvedBy}</td>
                  <td className="py-3 text-[#64748B] font-mono">{ov.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QuotaPolicy;

