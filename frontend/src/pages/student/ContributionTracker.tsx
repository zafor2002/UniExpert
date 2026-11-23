import React, { useState, useEffect } from 'react';
import {
  GitCommit, CheckCircle2, Clock, TrendingUp, Award,
  Calendar, Filter, ChevronDown, User, FileText,
  Code2, Layers, Zap, ArrowUpRight, Star, BarChart3,
  ShieldCheck, Sparkles, MessageSquare, ExternalLink
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { api } from '@/api/client';

/* ─── Mock Data ─────────────────────────────────────────────────────────── */
const MEMBERS = [
  { id: 'stu-1', name: 'Abu Zafor',      initials: 'AZ', color: '#4D90F0', role: 'Team Lead & Embedded AI' },
  { id: 'stu-2', name: 'Anamul Haque',   initials: 'AH', color: '#10B981', role: 'Full-Stack & Systems Lead' },
  { id: 'stu-3', name: 'Rafi Ahmed',     initials: 'RA', color: '#7C8FF5', role: 'Backend & Security' },
  { id: 'stu-4', name: 'Lamia Sultana',  initials: 'LS', color: '#F59E0B', role: 'ML & Dataset Prep' },
];

const CONTRIBUTIONS = [
  { id: 'c1',  memberId: 'stu-1', type: 'commit',   title: 'Implement BLE handshake & AES-GCM auth', date: '2026-11-13', points: 8, category: 'Backend' },
  { id: 'c2',  memberId: 'stu-4', type: 'task',     title: 'Train 1D-CNN classifier on IMU dataset', date: '2026-11-13', points: 10, category: 'ML' },
  { id: 'c3',  memberId: 'stu-2', type: 'commit',   title: 'WebSocket signaling & live meeting room sync', date: '2026-11-12', points: 9, category: 'FullStack' },
  { id: 'c4',  memberId: 'stu-3', type: 'commit',   title: 'REST API endpoint for sensor ingestion & SQLite', date: '2026-11-12', points: 7, category: 'Backend' },
  { id: 'c5',  memberId: 'stu-1', type: 'review',   title: 'Code review: BLE driver module', date: '2026-11-11', points: 4, category: 'Review' },
  { id: 'c6',  memberId: 'stu-3', type: 'commit',   title: 'JWT middleware & role-based guards', date: '2026-11-11', points: 7, category: 'Backend' },
  { id: 'c7',  memberId: 'stu-4', type: 'report',   title: 'Model accuracy report: 92.4% F1 score', date: '2026-11-10', points: 5, category: 'Docs' },
  { id: 'c8',  memberId: 'stu-2', type: 'commit',   title: 'Cryptographic SHA-256 Merkle ledger integration', date: '2026-11-10', points: 9, category: 'Security' },
  { id: 'c9',  memberId: 'stu-1', type: 'task',     title: 'Set up CI/CD pipeline with GitHub Actions', date: '2026-11-09', points: 9, category: 'DevOps' },
  { id: 'c10', memberId: 'stu-4', type: 'commit',   title: 'ONNX export & edge inference wrapper', date: '2026-11-09', points: 8, category: 'ML' },
  { id: 'c11', memberId: 'stu-3', type: 'task',     title: 'PostgreSQL schema: device & session tables', date: '2026-11-08', points: 6, category: 'Backend' },
  { id: 'c12', memberId: 'stu-2', type: 'commit',   title: 'BAETE Criterion 4 & 5 PDF dossier export engine', date: '2026-11-08', points: 10, category: 'FullStack' },
  { id: 'c13', memberId: 'stu-1', type: 'commit',   title: 'ARM CMSIS-NN integration on Cortex-M4', date: '2026-11-07', points: 10, category: 'Embedded' },
  { id: 'c14', memberId: 'stu-4', type: 'report',   title: 'Dataset preprocessing: 48k samples cleaned', date: '2026-11-07', points: 5, category: 'Docs' },
  { id: 'c15', memberId: 'stu-2', type: 'commit',   title: 'WebSocket server: live telemetry stream', date: '2026-11-06', points: 8, category: 'Backend' },
];

const MILESTONES = [
  { id: 'm1', title: 'Problem Statement & SRS', due: 'Oct 15', done: true },
  { id: 'm2', title: 'Prototype & Demo', due: 'Nov 15', done: true },
  { id: 'm3', title: 'Full Implementation', due: 'Dec 01', done: false },
  { id: 'm4', title: 'Final Defense', due: 'Dec 20', done: false },
];

function generateHeatmap() {
  const cells: { date: string; count: number }[] = [];
  const now = new Date('2026-11-13');
  for (let w = 9; w >= 0; w--) {
    for (let d = 0; d < 7; d++) {
      const dt = new Date(now);
      dt.setDate(now.getDate() - w * 7 - (6 - d));
      const dateStr = dt.toISOString().slice(0, 10);
      const count = CONTRIBUTIONS.filter(c => c.date === dateStr).length;
      cells.push({ date: dateStr, count });
    }
  }
  return cells;
}
const HEATMAP = generateHeatmap();

const TYPE_ICON: Record<string, React.ReactNode> = {
  commit: <GitCommit size={13} />,
  task:   <CheckCircle2 size={13} />,
  review: <Code2 size={13} />,
  report: <FileText size={13} />,
};

const TYPE_COLOR: Record<string, string> = {
  commit: 'bg-[#DDE8FA] text-[#1E3A8A] border-[#93C5FD]',
  task:   'bg-[#BBFBDE] text-[#065F46] border-[#6EE7B7]',
  review: 'bg-[#ECE9FF] text-[#2E1065] border-[#A5B4FC]',
  report: 'bg-[#FEF3C7] text-[#78350F] border-[#FCD34D]',
};

function heatColor(count: number) {
  if (count === 0) return 'bg-[#EDF2FB]';
  if (count === 1) return 'bg-[#93C5FD]';
  if (count === 2) return 'bg-[#4D90F0]';
  return 'bg-[#1E3A8A]';
}

/* ─── Component ─────────────────────────────────────────────────────────── */
export const ContributionTracker: React.FC = () => {
  const { currentUser } = useApp();
  const [filterMember, setFilterMember] = useState<string>('all');
  const [filterType,   setFilterType]   = useState<string>('all');
  const [endorsement,  setEndorsement]  = useState<any>(null);

  useEffect(() => {
    api.getLatestContributionEndorsement('af8b2f33-bfe6-4e4f-82b7-18446b3275da')
      .then((data) => {
        if (data) setEndorsement(data);
      })
      .catch((err) => console.log('Endorsement fetch note:', err));
  }, []);

  const filtered = CONTRIBUTIONS.filter(c => {
    if (filterMember !== 'all' && c.memberId !== filterMember) return false;
    if (filterType   !== 'all' && c.type    !== filterType)   return false;
    return true;
  });

  // Per-member stats
  const memberStats = MEMBERS.map(m => {
    const contribs = CONTRIBUTIONS.filter(c => c.memberId === m.id);
    const endorsed = endorsement?.ratings?.find((r: any) => r.member_id === m.id || r.member_name.includes(m.name.split(' ')[0]));
    return {
      ...m,
      total:   contribs.length,
      points:  contribs.reduce((s, c) => s + c.points, 0),
      commits: contribs.filter(c => c.type === 'commit').length,
      tasks:   contribs.filter(c => c.type === 'task').length,
      endorsedPoints: endorsed ? endorsed.points : null,
      endorsedPercentage: endorsed ? endorsed.percentage : null,
      feedback: endorsed ? endorsed.qualitative_feedback : null,
    };
  }).sort((a, b) => (b.endorsedPoints || b.points) - (a.endorsedPoints || a.points));

  const totalPoints  = CONTRIBUTIONS.reduce((s, c) => s + c.points, 0);
  const totalCommits = CONTRIBUTIONS.filter(c => c.type === 'commit').length;
  const totalTasks   = CONTRIBUTIONS.filter(c => c.type === 'task').length;

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-24">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
            <BarChart3 size={20} className="text-[#4D90F0]" />
            Contribution Tracker
          </h1>
          <p className="text-xs text-[#334155] mt-0.5">
            Team BioShield AI · Autonomous Edge-AI Healthcare Monitoring via BLE 5.0 · Group #32
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#BBFBDE] text-[#065F46] border border-[#6EE7B7] flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-[#059669]" />
            BAETE Criterion 4 & 5
          </span>
        </div>
      </div>

      {/* Official Supervisory Endorsement Banner */}
      {endorsement && (
        <div className="bg-emerald-50/70 border border-emerald-300 rounded-3xl p-5 md:p-6 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Award size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  Official Supervisory Milestone & Contribution Endorsement
                </span>
                <h3 className="text-sm font-bold text-emerald-950">
                  Evaluated by: {endorsement.supervisor_name} · {endorsement.milestone_title}
                </h3>
              </div>
            </div>

            <div className="text-right flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-emerald-200 text-emerald-800 flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-600" />
                Merkle Sealed #{endorsement.merkle_block_index}
              </span>
              <span className="text-[10px] font-mono text-slate-500" title={endorsement.block_hash}>
                Hash: {endorsement.block_hash ? `${endorsement.block_hash.substring(0, 10)}...` : 'Verified'}
              </span>
            </div>
          </div>

          {/* Member Endorsement Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
            {endorsement.ratings?.map((r: any, idx: number) => (
              <div key={idx} className="bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-sm space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-800">{r.member_name}</span>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    {r.points} Pts
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 flex justify-between">
                  <span>Effort Share:</span>
                  <strong className="text-blue-600">{r.percentage}%</strong>
                </div>
                {r.qualitative_feedback && (
                  <p className="text-[10px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 italic line-clamp-2">
                    "{r.qualitative_feedback}"
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="text-[11px] text-emerald-900 pt-1 flex items-center gap-1">
            <Sparkles size={13} className="text-emerald-600" />
            <span>
              Certified under BAETE Outcome-Based Education (OBE) rubrics. Individual contribution points awarded directly by faculty advisor and locked against retrospective alteration.
            </span>
          </div>
        </div>
      )}

      {/* Top Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Telemetry Points', value: totalPoints, icon: <Star size={16} className="text-[#4D90F0]" />, bg: 'bg-[#DDE8FA]' },
          { label: 'Git Commits', value: totalCommits, icon: <GitCommit size={16} className="text-[#7C8FF5]" />, bg: 'bg-[#ECE9FF]' },
          { label: 'Milestones Completed', value: totalTasks, icon: <CheckCircle2 size={16} className="text-[#34C99A]" />, bg: 'bg-[#BBFBDE]/50' },
          { label: 'Active Sprint Days', value: 10, icon: <Calendar size={16} className="text-[#F59E0B]" />, bg: 'bg-[#FEF3C7]' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[#CBD5E1] rounded-2xl p-4 shadow-sm">
            <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center mb-2 border border-[#CBD5E1]`}>
              {s.icon}
            </div>
            <div className="text-xl font-black text-[#0F172A]">{s.value}</div>
            <div className="text-[11px] text-[#334155] font-semibold">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Activity Heatmap */}
      <div className="bg-white border border-[#CBD5E1] rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
            <TrendingUp size={15} className="text-[#4D90F0]" />
            Activity Heatmap (10-Week Continuous Log)
          </h2>
          <div className="flex items-center gap-1.5 text-[10px] text-[#334155]">
            <span>Less</span>
            {['bg-[#EDF2FB]', 'bg-[#93C5FD]', 'bg-[#4D90F0]', 'bg-[#1E3A8A]'].map(c => (
              <div key={c} className={`w-3 h-3 rounded-sm ${c}`} />
            ))}
            <span>More</span>
          </div>
        </div>
        <div className="grid grid-cols-[repeat(10,1fr)] gap-1 overflow-x-auto">
          {Array.from({ length: 10 }, (_, w) => (
            <div key={w} className="flex flex-col gap-1">
              {HEATMAP.slice(w * 7, w * 7 + 7).map((cell, d) => (
                <div
                  key={d}
                  title={`${cell.date}: ${cell.count} contribution${cell.count !== 1 ? 's' : ''}`}
                  className={`w-full aspect-square rounded-sm ${heatColor(cell.count)} cursor-pointer transition-transform hover:scale-125`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Milestone progress */}
      <div className="bg-white border border-[#CBD5E1] rounded-2xl p-5 shadow-sm">
        <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-2 mb-3">
          <Layers size={15} className="text-[#4D90F0]" />
          Milestone Progress & BAETE Verification
        </h2>
        <div className="flex items-center gap-2 flex-wrap">
          {MILESTONES.map((m, i) => (
            <React.Fragment key={m.id}>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                m.done
                  ? 'bg-[#BBFBDE] border-[#6EE7B7] text-[#065F46]'
                  : 'bg-[#EDF2FB] border-[#CBD5E1] text-[#334155]'
              }`}>
                {m.done
                  ? <CheckCircle2 size={12} className="text-[#059669]" />
                  : <Clock size={12} className="text-[#334155]" />
                }
                <span>{m.title}</span>
                <span className="font-mono opacity-70">· {m.due}</span>
              </div>
              {i < MILESTONES.length - 1 && (
                <ArrowUpRight size={12} className="text-[#94A3B8] shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Member Leaderboard + Feed in 2 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Leaderboard (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-[#CBD5E1] rounded-2xl p-5 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
            <Award size={15} className="text-[#4D90F0]" />
            Official Member Scores (Supervisor Endorsed)
          </h2>
          {memberStats.map((m, rank) => (
            <div key={m.id} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-black text-[#94A3B8] w-3">{rank + 1}</span>
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ backgroundColor: m.color }}
                  >
                    {m.initials}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#0F172A] block">{m.name}</span>
                    <span className="text-[10px] text-[#64748B]">{m.role}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {m.endorsedPoints ? `${m.endorsedPoints} Pts` : `${m.points} Pts`}
                  </span>
                  {m.endorsedPercentage && (
                    <span className="block text-[10px] text-blue-600 font-semibold mt-0.5">
                      {m.endorsedPercentage}% Share
                    </span>
                  )}
                </div>
              </div>

              {m.feedback && (
                <div className="text-[10px] text-slate-500 italic pl-6">
                  "{m.feedback}"
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contribution Feed (3 cols) */}
        <div className="lg:col-span-3 bg-white border border-[#CBD5E1] rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <Zap size={15} className="text-[#4D90F0]" />
              Telemetry Feed ({filtered.length})
            </h2>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 text-xs">
              <select
                value={filterMember}
                onChange={e => setFilterMember(e.target.value)}
                className="bg-[#EDF2FB] border border-[#CBD5E1] text-[#0F172A] rounded-xl px-2.5 py-1 text-xs font-medium focus:outline-none"
              >
                <option value="all">All Members</option>
                {MEMBERS.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>

              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="bg-[#EDF2FB] border border-[#CBD5E1] text-[#0F172A] rounded-xl px-2.5 py-1 text-xs font-medium focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="commit">Commits</option>
                <option value="task">Tasks</option>
                <option value="review">Reviews</option>
                <option value="report">Reports</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {filtered.map(c => {
              const member = MEMBERS.find(m => m.id === c.memberId);
              return (
                <div
                  key={c.id}
                  className="flex items-start justify-between gap-3 p-3 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] font-bold shrink-0 mt-0.5 ${TYPE_COLOR[c.type]}`}>
                      {TYPE_ICON[c.type]}
                      {c.type.toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#0F172A] truncate">{c.title}</div>
                      <div className="text-[10px] text-[#64748B] flex items-center gap-1.5 mt-0.5">
                        <span className="font-semibold text-slate-700">{member?.name}</span>
                        <span>·</span>
                        <span>{c.date}</span>
                        <span>·</span>
                        <span className="font-mono text-blue-600">{c.category}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-black text-[#1E3A8A] shrink-0 bg-[#EFF6FF] px-2 py-0.5 rounded-md border border-[#BFDBFE]">
                    +{c.points}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributionTracker;
