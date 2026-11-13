import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Filter, RotateCcw, Users, BookOpen, GitCompare, Calendar, X, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useApp } from '../../context/AppContext';
import ScoreRing from '../../components/shared/ScoreRing';
import SkillChip from '../../components/shared/SkillChip';
import EmptyState from '../../components/shared/EmptyState';
import XAIDrawer from './XAIDrawer';

// Match data
const MATCH_SCORES: Record<string, number> = {
  'exp-1': 94,
  'exp-2': 71,
  'exp-3': 82,
  'exp-4': 65,
  'exp-5': 58,
};

const MATCHED_SKILLS: Record<string, string[]> = {
  'exp-1': ['BLE 5.0', 'C/C++ Embedded', 'CNN', 'AES-GCM', 'ARM Cortex-M4', 'MQTT'],
  'exp-2': [],
  'exp-3': ['CNN'],
  'exp-4': [],
  'exp-5': [],
};

const AVATAR_COLORS = [
  'bg-[#EAF2FF] text-[#1E293B] border border-[#8AB4F8]/60',
  'bg-[#EEF2FF] text-[#1E293B] border border-[#A5B4FC]/60',
  'bg-[#F0FDF4] text-[#1E293B] border border-[#A7E8D0]',
  'bg-[#FFF7ED] text-[#1E293B] border border-orange-200',
  'bg-[#FDF4FF] text-[#1E293B] border border-pink-200',
];

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

function tierBadge(tier: number) {
  if (tier === 1) return 'bg-[#EAF2FF] text-[#1E293B] border-[#8AB4F8]/40';
  if (tier === 2) return 'bg-[#EEF2FF] text-[#1E293B] border-[#A5B4FC]/40';
  return 'bg-amber-50 text-amber-800 border-amber-200';
}

type AvailFilter = 'all' | 'available' | 'nearing';

interface Filters {
  departments: string[];
  tiers: number[];
  availability: AvailFilter;
  industryOnly: boolean;
}

const DEPARTMENTS = ['Software Engineering', 'Computer Science', 'Pharmacy', 'Industry'];
const TIERS = [1, 2, 3];

const DEFAULT_FILTERS: Filters = {
  departments: [],
  tiers: [],
  availability: 'all',
  industryOnly: false,
};

const AdvisorDiscovery: React.FC = () => {
  const navigate = useNavigate();
  const { experts, compareList, addToCompare, removeFromCompare, clearCompare, vectorSearchOnline } = useApp();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [xaiExpertId, setXaiExpertId] = useState<string | null>(null);

  const toggleDept = (d: string) =>
    setFilters((f) => ({
      ...f,
      departments: f.departments.includes(d)
        ? f.departments.filter((x) => x !== d)
        : [...f.departments, d],
    }));

  const toggleTier = (t: number) =>
    setFilters((f) => ({
      ...f,
      tiers: f.tiers.includes(t) ? f.tiers.filter((x) => x !== t) : [...f.tiers, t],
    }));

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const filtered = experts.filter((e) => {
    if (filters.departments.length > 0 && !filters.departments.includes(e.department)) return false;
    if (filters.tiers.length > 0 && !filters.tiers.includes(e.tier)) return false;
    if (filters.availability === 'available' && e.quotaStatus !== 'available') return false;
    if (filters.availability === 'nearing' && e.quotaStatus !== 'nearing') return false;
    if (filters.industryOnly && !e.isIndustry) return false;
    return true;
  });

  const handleCompare = (expertId: string) => {
    if (compareList.includes(expertId)) {
      removeFromCompare(expertId);
      return;
    }
    if (compareList.length >= 3) {
      toast.error('You can compare a maximum of 3 candidates simultaneously.');
      return;
    }
    addToCompare(expertId);
  };

  return (
    <div className="flex min-h-screen relative">
      {/* BM25 banner */}
      {!vectorSearchOnline && (
        <div className="fixed top-16 left-0 right-0 z-30 flex items-center gap-2 px-6 py-2.5 bg-amber-50 border-b border-amber-200">
          <AlertTriangle size={16} className="text-amber-600 shrink-0" />
          <span className="text-sm text-amber-800 font-medium">
            Vector search offline. Displaying keyword-matched results.{' '}
            <span className="font-mono font-bold">BM25 fallback active.</span>
          </span>
        </div>
      )}

      {/* Left sidebar filters */}
      <aside className="w-56 shrink-0 border-r border-[#E2E8F0] bg-white p-5 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <span className="font-semibold text-[#1E293B] flex items-center gap-1.5 text-sm">
            <Filter size={15} className="text-[#64748B]" />
            Filters
          </span>
          <button
            onClick={resetFilters}
            className="text-xs text-[#334155] hover:text-[#1E293B] font-medium flex items-center gap-1 bg-[#F4F8FF] px-2.5 py-1 rounded-lg border border-[#E2E8F0]"
          >
            <RotateCcw size={11} />
            Reset
          </button>
        </div>

        {/* Department */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-2.5">
            Department
          </p>
          <label className="flex items-center gap-2 mb-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.departments.length === 0}
              onChange={() => setFilters((f) => ({ ...f, departments: [] }))}
              className="accent-[#8AB4F8]"
            />
            <span className="text-sm text-[#334155]">All</span>
          </label>
          {DEPARTMENTS.map((d) => (
            <label key={d} className="flex items-center gap-2 mb-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.departments.includes(d)}
                onChange={() => toggleDept(d)}
                className="accent-[#8AB4F8]"
              />
              <span className="text-sm text-[#334155]">{d}</span>
            </label>
          ))}
        </div>

        {/* Verification Tier */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-2.5">
            Verification Tier
          </p>
          {TIERS.map((t) => (
            <label key={t} className="flex items-center gap-2 mb-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.tiers.includes(t)}
                onChange={() => toggleTier(t)}
                className="accent-[#8AB4F8]"
              />
              <span className="text-sm text-[#334155]">Tier {t}</span>
            </label>
          ))}
        </div>

        {/* Availability */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-2.5">
            Availability
          </p>
          {(['all', 'available', 'nearing'] as AvailFilter[]).map((opt) => (
            <label key={opt} className="flex items-center gap-2 mb-1.5 cursor-pointer">
              <input
                type="radio"
                name="availability"
                checked={filters.availability === opt}
                onChange={() => setFilters((f) => ({ ...f, availability: opt }))}
                className="accent-[#8AB4F8]"
              />
              <span className="text-sm text-[#334155] capitalize">
                {opt === 'all' ? 'All' : opt === 'available' ? 'Available Only' : 'Nearing Quota'}
              </span>
            </label>
          ))}
        </div>

        {/* Industry Only toggle */}
        <div className="mb-5">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-medium text-[#334155]">Industry Only</span>
            <button
              role="switch"
              aria-checked={filters.industryOnly}
              onClick={() => setFilters((f) => ({ ...f, industryOnly: !f.industryOnly }))}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
                filters.industryOnly ? 'bg-[#8AB4F8]' : 'bg-[#E2E8F0]'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                  filters.industryOnly ? 'translate-x-4.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </label>
        </div>

        <button
          onClick={resetFilters}
          className="w-full text-xs py-2 rounded-xl border border-[#E2E8F0] text-[#334155] bg-[#F4F8FF] hover:bg-[#EAF2FF] transition-colors font-medium"
        >
          Reset All Filters
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1E293B]">Advisor Discovery</h1>
          <p className="text-sm text-[#64748B] mt-1">
            <span className="font-semibold text-[#1E293B]">
              {filtered.length} expert{filtered.length !== 1 ? 's' : ''} found
            </span>
            {' · '}Vector similarity & hybrid rank in{' '}
            <span className="font-mono font-semibold text-[#1E293B]">38 ms</span>
          </p>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <EmptyState
            icon={Users}
            title="No experts match your current filters"
            description="Try loosening your department, availability, or tier criteria to see matching faculty and industry mentors."
            action={{
              label: 'Reset All Filters',
              onClick: resetFilters,
            }}
          />
        )}

        {/* Expert cards */}
        <div className="space-y-4">
          {filtered.map((expert, idx) => {
            const score = MATCH_SCORES[expert.id] ?? 50;
            const matchedSkills = MATCHED_SKILLS[expert.id] ?? [];
            const isFull = expert.quotaStatus === 'full';
            const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
            const inCompare = compareList.includes(expert.id);

            return (
              <div
                key={expert.id}
                className={`card p-6 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm transition-all ${isFull ? 'opacity-70' : 'hover:shadow-md'}`}
              >
                {/* Quota full banner */}
                {isFull && (
                  <div className="flex items-center gap-2 mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl">
                    <AlertTriangle size={15} className="text-red-600 shrink-0" />
                    <span className="text-xs text-red-700 font-semibold">
                      Supervisory Quota Full for Current Semester (Co-Advisory or Consultation Only)
                    </span>
                  </div>
                )}

                <div className="flex gap-5 items-start">
                  {/* Avatar */}
                  <div
                    className={`${avatarColor} rounded-2xl w-14 h-14 flex items-center justify-center text-lg font-bold shrink-0`}
                  >
                    {getInitials(expert.name)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5 mb-1">
                      <h3 className="text-base font-bold text-[#1E293B]">{expert.name}</h3>
                      {/* Tier badge */}
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${tierBadge(expert.tier)}`}
                      >
                        Tier {expert.tier} Verified
                      </span>
                    </div>
                    <p className="text-sm text-[#64748B]">
                      {expert.title} · {expert.department}
                    </p>

                    {/* Quota badge */}
                    <div className="mt-2.5">
                      {isFull ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                          {expert.slotsUsed} of {expert.slotsTotal} — Quota Full
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#A7E8D0]/30 text-[#1E293B] border border-[#A7E8D0]">
                          {expert.slotsUsed} of {expert.slotsTotal} slots used
                        </span>
                      )}
                    </div>

                    {/* Matched skills */}
                    {matchedSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {matchedSkills.map((sk) => (
                          <SkillChip key={sk} skill={sk} variant="matched" />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Score ring */}
                  <div className="shrink-0 bg-[#F4F8FF] p-2 rounded-2xl border border-[#E2E8F0]">
                    <ScoreRing score={score} size={70} strokeWidth={6} label="Match" />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-[#E2E8F0]">
                  {/* Why this match */}
                  <button
                    onClick={() => navigate('/student/xai-drawer', { state: { expertId: expert.id } })}
                    className="text-xs font-semibold text-[#334155] hover:text-[#1E293B] flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F4F8FF] hover:bg-[#EAF2FF] border border-[#E2E8F0] transition-colors"
                  >
                    <BookOpen size={13} className="text-[#8AB4F8]" />
                    Why this match?
                  </button>

                  {/* Compare checkbox */}
                  <label className="flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-xl hover:bg-[#F4F8FF] border border-transparent hover:border-[#E2E8F0] transition-colors">
                    <input
                      type="checkbox"
                      checked={inCompare}
                      onChange={() => handleCompare(expert.id)}
                      className="accent-[#8AB4F8]"
                    />
                    <span className="text-xs font-semibold text-[#64748B] flex items-center gap-1">
                      <GitCompare size={13} />
                      Compare
                    </span>
                  </label>

                  {/* Book Consultation (quota full) */}
                  {isFull && (
                    <button className="ml-auto text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#E2E8F0] text-[#334155] bg-[#F4F8FF] hover:bg-[#EAF2FF] transition-colors flex items-center gap-1">
                      <Calendar size={13} />
                      Book Consultation
                    </button>
                  )}

                  {/* Send Proposal */}
                  <button
                    disabled={isFull}
                    onClick={() => navigate(`/student/proposal-modal?expertId=${expert.id}`)}
                    className={`ml-auto text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm ${
                      isFull
                        ? 'bg-slate-100 text-slate-400 border border-[#E2E8F0] cursor-not-allowed pointer-events-none'
                        : 'bg-[#8AB4F8] hover:bg-[#72A3F6] text-[#1E293B]'
                    }`}
                  >
                    Send Advisory Proposal
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Compare floating bar */}
      {compareList.length >= 2 && (
        <div className="fixed bottom-16 left-0 right-0 z-40 flex items-center justify-center pointer-events-none">
          <div className="bg-white text-[#1E293B] border border-[#E2E8F0] px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-4 pointer-events-auto">
            <GitCompare size={18} className="text-[#8AB4F8]" />
            <span className="font-semibold text-sm">
              Comparing {compareList.length} expert{compareList.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={() => navigate('/student/compare')}
              className="bg-[#8AB4F8] hover:bg-[#72A3F6] text-[#1E293B] font-bold text-xs px-4 py-2 rounded-xl shadow-sm transition-colors"
            >
              Compare Now
            </button>
            <button
              onClick={clearCompare}
              className="ml-2 text-[#64748B] hover:text-[#1E293B] p-1 rounded-lg hover:bg-[#F4F8FF] transition-colors"
              aria-label="Clear compare"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* XAI Drawer */}
      <XAIDrawer expertId={xaiExpertId} onClose={() => setXaiExpertId(null)} />
    </div>
  );
};

export default AdvisorDiscovery;
