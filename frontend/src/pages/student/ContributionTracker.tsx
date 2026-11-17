import React, { useState } from 'react';
import {
  GitCommit, CheckCircle2, Clock, TrendingUp, Award,
  Calendar, Filter, ChevronDown, User, FileText,
  Code2, Layers, Zap, ArrowUpRight, Star, BarChart3,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

/* ─── Mock Data ─────────────────────────────────────────────────────────── */
const MEMBERS = [
  { id: 'stu-1', name: 'Abu Zafor',      initials: 'AZ', color: '#4D90F0', role: 'Team Lead' },
  { id: 'stu-2', name: 'Rafi Ahmed',     initials: 'RA', color: '#7C8FF5', role: 'Backend Dev' },
  { id: 'stu-3', name: 'Lamia Sultana', initials: 'LS', color: '#34C99A', role: 'ML Engineer' },
  { id: 'stu-4', name: 'Tanvir Hassan', initials: 'TH', color: '#F59E0B', role: 'Frontend Dev' },
];

const CONTRIBUTIONS = [
  { id: 'c1',  memberId: 'stu-1', type: 'commit',   title: 'Implement BLE handshake & AES-GCM auth', date: '2026-11-13', points: 8, category: 'Backend' },
  { id: 'c2',  memberId: 'stu-3', type: 'task',     title: 'Train 1D-CNN classifier on IMU dataset', date: '2026-11-13', points: 10, category: 'ML' },
  { id: 'c3',  memberId: 'stu-2', type: 'commit',   title: 'REST API endpoint for sensor ingestion', date: '2026-11-12', points: 7, category: 'Backend' },
  { id: 'c4',  memberId: 'stu-4', type: 'task',     title: 'Dashboard UI: real-time chart component', date: '2026-11-12', points: 6, category: 'Frontend' },
  { id: 'c5',  memberId: 'stu-1', type: 'review',   title: 'Code review: BLE driver module', date: '2026-11-11', points: 4, category: 'Review' },
  { id: 'c6',  memberId: 'stu-2', type: 'commit',   title: 'JWT middleware & role-based guards', date: '2026-11-11', points: 7, category: 'Backend' },
  { id: 'c7',  memberId: 'stu-3', type: 'report',   title: 'Model accuracy report: 92.4% F1 score', date: '2026-11-10', points: 5, category: 'Docs' },
  { id: 'c8',  memberId: 'stu-4', type: 'commit',   title: 'Mobile layout: responsive sensor grid', date: '2026-11-10', points: 6, category: 'Frontend' },
  { id: 'c9',  memberId: 'stu-1', type: 'task',     title: 'Set up CI/CD pipeline with GitHub Actions', date: '2026-11-09', points: 9, category: 'DevOps' },
  { id: 'c10', memberId: 'stu-3', type: 'commit',   title: 'ONNX export & edge inference wrapper', date: '2026-11-09', points: 8, category: 'ML' },
  { id: 'c11', memberId: 'stu-2', type: 'task',     title: 'PostgreSQL schema: device & session tables', date: '2026-11-08', points: 6, category: 'Backend' },
  { id: 'c12', memberId: 'stu-4', type: 'review',   title: 'UX review: accessibility audit pass', date: '2026-11-08', points: 4, category: 'Review' },
  { id: 'c13', memberId: 'stu-1', type: 'commit',   title: 'ARM CMSIS-NN integration on Cortex-M4', date: '2026-11-07', points: 10, category: 'Embedded' },
  { id: 'c14', memberId: 'stu-3', type: 'report',   title: 'Dataset preprocessing: 48k samples cleaned', date: '2026-11-07', points: 5, category: 'Docs' },
  { id: 'c15', memberId: 'stu-2', type: 'commit',   title: 'WebSocket server: live telemetry stream', date: '2026-11-06', points: 8, category: 'Backend' },
];

const MILESTONES = [
  { id: 'm1', title: 'Problem Statement & SRS', due: 'Oct 15', done: true },
  { id: 'm2', title: 'Prototype & Demo', due: 'Nov 15', done: true },
  { id: 'm3', title: 'Full Implementation', due: 'Dec 01', done: false },
  { id: 'm4', title: 'Final Defense', due: 'Dec 20', done: false },
];

// Generate heatmap data (last 10 weeks × 7 days)
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

  const filtered = CONTRIBUTIONS.filter(c => {
    if (filterMember !== 'all' && c.memberId !== filterMember) return false;
    if (filterType   !== 'all' && c.type    !== filterType)   return false;
    return true;
  });

  // Per-member stats
  const memberStats = MEMBERS.map(m => {
    const contribs = CONTRIBUTIONS.filter(c => c.memberId === m.id);
    return {
      ...m,
      total:   contribs.length,
      points:  contribs.reduce((s, c) => s + c.points, 0),
      commits: contribs.filter(c => c.type === 'commit').length,
      tasks:   contribs.filter(c => c.type === 'task').length,
    };
  }).sort((a, b) => b.points - a.points);

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
            EdgeShield AI · Fall 2026 · Group #32
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#BBFBDE] text-[#065F46] border border-[#6EE7B7]">
          BAETE Criterion 4 & 5
        </span>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Points', value: totalPoints, icon: <Star size={16} className="text-[#4D90F0]" />, bg: 'bg-[#DDE8FA]' },
          { label: 'Commits', value: totalCommits, icon: <GitCommit size={16} className="text-[#7C8FF5]" />, bg: 'bg-[#ECE9FF]' },
          { label: 'Tasks Done', value: totalTasks, icon: <CheckCircle2 size={16} className="text-[#34C99A]" />, bg: 'bg-[#BBFBDE]/50' },
          { label: 'Active Days', value: 10, icon: <Calendar size={16} className="text-[#F59E0B]" />, bg: 'bg-[#FEF3C7]' },
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
            Activity Heatmap
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
          Milestone Progress
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
            Member Scores
          </h2>
          {memberStats.map((m, rank) => (
            <div key={m.id} className="flex items-center gap-3">
              <span className="text-xs font-black text-[#94A3B8] w-4">{rank + 1}</span>
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ backgroundColor: m.color }}
              >
                {m.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0F172A] truncate">{m.name}</span>
                  <span className="text-xs font-black text-[#0F172A]">{m.points}pts</span>
                </div>
                <div className="mt-1 h-1.5 w-full bg-[#EDF2FB] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${(m.points / totalPoints) * 100}%`, backgroundColor: m.color }}
                  />
                </div>
                <div className="flex gap-2 mt-0.5 text-[10px] text-[#334155]">
                  <span>{m.commits} commits</span>
                  <span>·</span>
                  <span>{m.tasks} tasks</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contribution Feed (3 cols) */}
        <div className="lg:col-span-3 bg-white border border-[#CBD5E1] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <Zap size={15} className="text-[#4D90F0]" />
              Activity Feed
            </h2>
            <div className="flex items-center gap-2">
              {/* Member filter */}
              <div className="relative">
                <select
                  value={filterMember}
                  onChange={e => setFilterMember(e.target.value)}
                  className="text-xs border border-[#CBD5E1] rounded-xl px-2.5 py-1.5 bg-white text-[#0F172A] font-medium pr-7 appearance-none focus:ring-2 focus:ring-[#4D90F0] focus:outline-none"
                >
                  <option value="all">All Members</option>
                  {MEMBERS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#334155] pointer-events-none" />
              </div>
              {/* Type filter */}
              <div className="relative">
                <select
                  value={filterType}
                  onChange={e => setFilterType(e.target.value)}
                  className="text-xs border border-[#CBD5E1] rounded-xl px-2.5 py-1.5 bg-white text-[#0F172A] font-medium pr-7 appearance-none focus:ring-2 focus:ring-[#4D90F0] focus:outline-none"
                >
                  <option value="all">All Types</option>
                  <option value="commit">Commit</option>
                  <option value="task">Task</option>
                  <option value="review">Review</option>
                  <option value="report">Report</option>
                </select>
                <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#334155] pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {filtered.length === 0 && (
              <div className="text-center py-10 text-xs text-[#334155]">No contributions match filters.</div>
            )}
            {filtered.map(c => {
              const member = MEMBERS.find(m => m.id === c.memberId)!;
              return (
                <div key={c.id} className="flex items-start gap-3 p-3 rounded-xl border border-[#EDF2FB] hover:border-[#CBD5E1] hover:bg-[#EDF2FB]/40 transition-colors">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5"
                    style={{ backgroundColor: member.color }}
                  >
                    {member.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${TYPE_COLOR[c.type]}`}>
                        {TYPE_ICON[c.type]}
                        {c.type}
                      </span>
                      <span className="text-[10px] text-[#334155] font-medium">{c.category}</span>
                    </div>
                    <p className="text-xs font-semibold text-[#0F172A] mt-0.5 leading-snug">{c.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-[#334155]">{member.name}</span>
                      <span className="text-[#CBD5E1]">·</span>
                      <span className="text-[10px] font-mono text-[#334155]">{c.date}</span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-[#4D90F0] shrink-0">+{c.points}</span>
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
