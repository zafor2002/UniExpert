import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, AlertTriangle, RefreshCw, Filter, 
  UserPlus, CheckCircle2, Flame, ShieldAlert, Award, PieChart 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { toast } from 'react-hot-toast';
import { useApp } from '../../context/AppContext';
import MetricCard from '../../components/shared/MetricCard';

export const AllocationDashboard: React.FC = () => {
  const { experts } = useApp();

  const [semester, setSemester] = useState('Fall 2026');
  const [program, setProgram] = useState('SWE');
  const [track, setTrack] = useState('All');
  const [countdown, setCountdown] = useState(60);

  // 60-second auto-refresh countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 60 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const facultyLoadData = [
    { name: 'Dr. Farhana', load: 2, cap: 5, status: 'normal' },
    { name: 'Dr. Tanvir', load: 1, cap: 4, status: 'normal' },
    { name: 'Prof. Rafiqul', load: 5, cap: 5, status: 'overload' },
    { name: 'Engr. Sakib', load: 1, cap: 3, status: 'normal' },
    { name: 'Dr. Shohel', load: 3, cap: 5, status: 'nearing' },
  ];

  const unallocatedTeams = [
    { id: 'team-101', name: 'NeuroPredict', topic: 'EEG Anomaly Classification with Spiking NN', size: 3 },
    { id: 'team-102', name: 'AgriSense IoT', topic: 'LoRaWAN Soil Moisture Predictive Analytics', size: 4 },
    { id: 'team-103', name: 'MedChain Ledger', topic: 'Decentralized EHR with Zero-Knowledge Proofs', size: 3 },
  ];

  const handleAssignCoAdvisor = (teamName: string) => {
    toast.success(`Assigned Dr. Farhana Rahman as co-advisor for ${teamName}.`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24">
      {/* Top Banner */}
      <div className="card p-6 md:p-8 bg-white border border-[#E2E8F0] shadow-sm rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-[#EAF2FF] text-[#1E293B] border border-[#8AB4F8]/50">
              Institutional Administration
            </span>
            <span className="text-xs text-[#64748B]">· Department Coordinator Workspace</span>
          </div>
          <h1 className="text-xl font-bold text-[#1E293B]">Capstone Supervisory Allocation Heatmap</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Balancing advisor quotas and resolving multidisciplinary student team deficits
          </p>
        </div>

        {/* 60s Auto-refresh indicator */}
        <div className="flex items-center gap-2 bg-[#F4F8FF] px-4 py-2.5 rounded-2xl border border-[#E2E8F0] text-xs font-mono text-[#334155]">
          <RefreshCw size={14} className="text-[#8AB4F8] animate-spin" />
          <span>Auto-refreshing in: <strong>{countdown}s</strong></span>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          label="Allocated Teams"
          value="126 Groups"
          badge="88.9%"
          subtext="126 of 142 Total Groups Matched"
          variant="blue"
          icon={<Users size={16} className="text-[#2563EB]" />}
        />
        <MetricCard
          label="Allocation Velocity"
          value="On Track"
          badge="BAETE Met"
          subtext="Zero SLA violations this cycle"
          variant="mint"
          icon={<CheckCircle2 size={16} className="text-[#0F766E]" />}
        />
        <MetricCard
          label="Unallocated Teams"
          value="16 Groups"
          badge="In Queue"
          subtext="Awaiting multidisciplinary advisor match"
          variant="amber"
          icon={<AlertTriangle size={16} className="text-[#B45309]" />}
        />
        <MetricCard
          label="Maxed Capacity"
          value="1 Faculty"
          badge="Quota 5/5"
          subtext="Prof. Md. Rafiqul Islam reached cap"
          variant="rose"
          icon={<Flame size={16} className="text-[#DC2626]" />}
        />
      </div>

      {/* Overload Alert Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
        <Flame className="text-amber-600 shrink-0 mt-0.5" size={18} />
        <div className="text-xs text-amber-900">
          <span className="font-bold block mb-0.5">Faculty Workload Alert:</span>
          Prof. Md. Rafiqul Islam has reached the maximum institutional cap of 5/5 groups. 2 incoming machine-learning solicitations have been automatically diverted to the Department Reassignment Pool.
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[#64748B]" />
          <span className="font-bold text-[#1E293B]">Filter Scope:</span>
        </div>

        <div>
          <select value={semester} onChange={(e) => setSemester(e.target.value)} className="input text-xs py-1.5">
            <option value="Fall 2026">Term: Fall 2026 (Active)</option>
            <option value="Spring 2026">Term: Spring 2026</option>
            <option value="Fall 2025">Term: Fall 2025</option>
          </select>
        </div>

        <div>
          <select value={program} onChange={(e) => setProgram(e.target.value)} className="input text-xs py-1.5">
            <option value="SWE">Program: Software Engineering</option>
            <option value="CSE">Program: Computer Science & Eng.</option>
            <option value="CIS">Program: Computing & Info Systems</option>
          </select>
        </div>

        <div>
          <select value={track} onChange={(e) => setTrack(e.target.value)} className="input text-xs py-1.5">
            <option value="All">Track: All Capstone Tracks</option>
            <option value="Embedded">Track: Embedded & IoT</option>
            <option value="AI">Track: Artificial Intelligence</option>
            <option value="Bio">Track: Health & Bioinformatics</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Load Distribution Heatmap Chart */}
        <div className="card p-6 md:p-8 space-y-4 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1E293B]">
              Faculty Supervisory Load Heatmap
            </h2>
            <span className="text-[11px] text-[#64748B] font-mono">Capacity vs Assigned</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={facultyLoadData} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" domain={[0, 6]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#334155' }} width={90} />
                <Tooltip />
                <Bar dataKey="load" radius={[0, 6, 6, 0]}>
                  {facultyLoadData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.status === 'overload' ? '#F87171' : entry.status === 'nearing' ? '#FBBF24' : '#A7E8D0'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center gap-6 text-xs text-[#64748B] pt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#A7E8D0] border border-emerald-400" />
              <span>Available (&lt; 3)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span>Nearing Cap (3-4)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span>Quota Reached (5/5)</span>
            </div>
          </div>
        </div>

        {/* Unallocated Student Teams Queue */}
        <div className="card p-6 md:p-8 space-y-4 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
              <Users size={18} className="text-[#8AB4F8]" />
              Unallocated Student Teams
            </h2>
            <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              16 Pending Ingest
            </span>
          </div>

          <div className="space-y-3">
            {unallocatedTeams.map((team) => (
              <div
                key={team.id}
                className="p-4 rounded-2xl border border-[#E2E8F0] bg-[#F4F8FF] flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1E293B]">{team.name}</span>
                    <span className="text-[10px] text-[#64748B]">({team.size} Members)</span>
                  </div>
                  <p className="text-[#64748B] mt-0.5">{team.topic}</p>
                </div>

                <button
                  onClick={() => handleAssignCoAdvisor(team.name)}
                  className="btn-primary text-[11px] py-1.5 px-3.5 shrink-0 rounded-xl font-semibold shadow-sm"
                >
                  <UserPlus size={12} /> Assign Co-Advisor
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllocationDashboard;

