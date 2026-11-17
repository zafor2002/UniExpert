import React, { useState } from 'react';
import { FileText, Download, FileSpreadsheet, Eye, Printer, Award, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'react-hot-toast';

export const AccreditationReports: React.FC = () => {
  const [reportType, setReportType] = useState('allocation');
  const [term, setTerm] = useState('Fall 2026');
  const [department, setDepartment] = useState('Software Engineering');
  const [format, setFormat] = useState<'pdf' | 'csv'>('pdf');
  const [generating, setGenerating] = useState(false);
  const [previewReady, setPreviewReady] = useState(true);

  const reportChartData = [
    { faculty: 'Dr. Farhana Rahman', teams: 2, students: 6 },
    { faculty: 'Dr. Tanvir Ahmed', teams: 1, students: 3 },
    { faculty: 'Prof. Rafiqul Islam', teams: 5, students: 15 },
    { faculty: 'Dr. Shohel Arman', teams: 3, students: 9 },
  ];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (term === 'Spring 2025') {
      setPreviewReady(false);
      return;
    }

    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setPreviewReady(true);
      toast.success(`Generated ${reportType === 'allocation' ? 'Allocation Summary' : 'Research Velocity'} Report.`);
    }, 1000);
  };

  const handleExport = () => {
    toast.success(`Accreditation report exported as signed ${format.toUpperCase()}.`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#334155] flex items-center gap-2">
          <FileText className="text-[#8AB4F8]" size={22} />
          Accreditation & Institutional Governance Reports
        </h1>
        <p className="text-xs text-[#64748B] mt-0.5">
          Generate formal BAETE Criterion 4 & 5 compliance summaries and supervisory velocity dossiers
        </p>
      </div>

      {/* Control Card */}
      <form onSubmit={handleGenerate} className="card p-6 bg-white border border-[#E2E8F0] shadow-sm rounded-3xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="label text-xs font-semibold text-[#334155]">Report Formulation</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="input text-xs border-[#E2E8F0] bg-white text-[#334155]"
            >
              <option value="allocation">Semester Supervisory Allocation Summary</option>
              <option value="velocity">Interdisciplinary Research Velocity</option>
            </select>
          </div>

          <div>
            <label className="label text-xs font-semibold text-[#334155]">Academic Term</label>
            <select
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="input text-xs border-[#E2E8F0] bg-white text-[#334155]"
            >
              <option value="Fall 2026">Fall 2026 (Active)</option>
              <option value="Spring 2026">Spring 2026</option>
              <option value="Fall 2025">Fall 2025</option>
              <option value="Spring 2025">Spring 2025 (Historical Empty)</option>
            </select>
          </div>

          <div>
            <label className="label text-xs font-semibold text-[#334155]">Department Scope</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="input text-xs border-[#E2E8F0] bg-white text-[#334155]"
            >
              <option value="Software Engineering">Department of Software Engineering</option>
              <option value="Computer Science">Department of Computer Science</option>
              <option value="Pharmacy">Department of Pharmacy</option>
            </select>
          </div>

          <div>
            <label className="label text-xs font-semibold text-[#334155]">Export Format</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormat('pdf')}
                className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                  format === 'pdf'
                    ? 'bg-[#EAF2FF] border-[#8AB4F8] text-[#1E293B] ring-2 ring-[#8AB4F8]/30'
                    : 'border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F4F8FF]'
                }`}
              >
                PDF
              </button>
              <button
                type="button"
                onClick={() => setFormat('csv')}
                className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                  format === 'csv'
                    ? 'bg-[#EAF2FF] border-[#8AB4F8] text-[#1E293B] ring-2 ring-[#8AB4F8]/30'
                    : 'border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F4F8FF]'
                }`}
              >
                CSV
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={generating} className="btn-primary text-xs px-5 py-2 font-semibold flex items-center gap-1.5">
            <Eye size={14} /> {generating ? 'Compiling Dossier...' : 'Generate Accreditation Dossier'}
          </button>
        </div>
      </form>

      {/* Empty State */}
      {!previewReady ? (
        <div className="card p-12 text-center space-y-3 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
          <AlertCircle size={36} className="text-[#64748B] mx-auto" />
          <h3 className="text-base font-bold text-[#334155]">
            No completed records found for the selected semester.
          </h3>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto">
            The selected historical term (Spring 2025) has no digitized capstone matching ledgers in the UniExpert registry.
          </p>
        </div>
      ) : (
        /* PDF Preview Card */
        <div className="card p-8 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm space-y-6">
          {/* Institutional Header */}
          <div className="border-b-2 border-[#8AB4F8]/30 pb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF2FF] border border-[#8AB4F8]/40 text-[#2563EB] flex items-center justify-center font-extrabold text-lg">
                DIU
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#334155] uppercase tracking-tight">
                  Daffodil International University
                </h2>
                <p className="text-xs text-[#64748B] font-semibold">
                  Faculty of Science & Information Technology · {department}
                </p>
                <p className="text-[11px] text-[#2563EB] font-mono mt-0.5">
                  BAETE ACCREDITATION DOSSIER · CRITERION 4 & 5 VERIFICATION
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#64748B] block tracking-wider">Report Cycle</span>
              <span className="text-xs font-bold text-[#334155]">{term} Term</span>
              <span className="text-[10px] font-mono text-[#64748B] block mt-0.5">Generated: Nov 11, 2026</span>
            </div>
          </div>

          {/* Report Title */}
          <div>
            <h3 className="text-base font-bold text-[#334155]">
              {reportType === 'allocation' ? 'Semester Supervisory Allocation Summary' : 'Interdisciplinary Research Velocity'}
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Comprehensive registry of student capstone assignments, verified faculty workload bounds, and tier balance
            </p>
          </div>

          {/* Summary Table */}
          <div className="overflow-x-auto rounded-2xl border border-[#E2E8F0]">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F4F8FF] font-semibold text-[#334155] border-b border-[#E2E8F0]">
                <tr>
                  <th className="p-3">Faculty Member</th>
                  <th className="p-3">Tier Weight</th>
                  <th className="p-3">Assigned Teams</th>
                  <th className="p-3">Supervised Students</th>
                  <th className="p-3">Capacity Clearance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                <tr className="hover:bg-[#F4F8FF]/40 transition-colors">
                  <td className="p-3 font-bold text-[#334155]">Dr. Farhana Rahman</td>
                  <td className="p-3 font-mono text-[#64748B]">Tier 2</td>
                  <td className="p-3 font-semibold text-[#2563EB]">2 Groups</td>
                  <td className="p-3 font-mono text-[#64748B]">6 Students</td>
                  <td className="p-3 text-[#0F766E] font-bold">Within Limit (2/5)</td>
                </tr>
                <tr className="hover:bg-[#F4F8FF]/40 transition-colors">
                  <td className="p-3 font-bold text-[#334155]">Dr. Tanvir Ahmed</td>
                  <td className="p-3 font-mono text-[#64748B]">Tier 2</td>
                  <td className="p-3 font-semibold text-[#2563EB]">1 Group (Co-Advisory)</td>
                  <td className="p-3 font-mono text-[#64748B]">3 Students</td>
                  <td className="p-3 text-[#0F766E] font-bold">Within Limit (1/4)</td>
                </tr>
                <tr className="hover:bg-[#F4F8FF]/40 transition-colors">
                  <td className="p-3 font-bold text-[#334155]">Prof. Md. Rafiqul Islam</td>
                  <td className="p-3 font-mono text-[#64748B]">Tier 3</td>
                  <td className="p-3 font-semibold text-rose-600">5 Groups</td>
                  <td className="p-3 font-mono text-[#64748B]">15 Students</td>
                  <td className="p-3 text-rose-600 font-bold">Quota Maxed (5/5)</td>
                </tr>
                <tr className="hover:bg-[#F4F8FF]/40 transition-colors">
                  <td className="p-3 font-bold text-[#334155]">Dr. Shohel Arman</td>
                  <td className="p-3 font-mono text-[#64748B]">Tier 1</td>
                  <td className="p-3 font-semibold text-[#2563EB]">3 Groups</td>
                  <td className="p-3 font-mono text-[#64748B]">9 Students</td>
                  <td className="p-3 text-amber-600 font-bold">Nearing Cap (3/5)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Allocation Velocity Chart */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#334155] uppercase tracking-wider block">
              Supervisory Student Distribution by Faculty
            </span>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportChartData}>
                  <XAxis dataKey="faculty" tick={{ fontSize: 10, fill: '#64748B' }} stroke="#E2E8F0" />
                  <YAxis tick={{ fontSize: 10, fill: '#64748B' }} stroke="#E2E8F0" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E2E8F0',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                      fontSize: '12px',
                      color: '#334155',
                    }}
                  />
                  <Bar dataKey="students" fill="#8AB4F8" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Report Footer */}
          <div className="border-t border-[#E2E8F0] pt-4 flex items-center justify-between text-xs text-[#64748B]">
            <span>Official BAETE Evaluation Document · DIU Quality Assurance Cell</span>
            <button
              onClick={handleExport}
              className="btn-primary text-xs px-4 py-2 font-semibold flex items-center gap-1.5"
            >
              <Download size={13} /> Export Official Signed {format.toUpperCase()}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccreditationReports;

