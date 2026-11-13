import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Plus, X, ChevronDown, CheckCircle, AlertTriangle, Search } from 'lucide-react';
import SkillChip from '../../components/shared/SkillChip';

interface Domain {
  name: string;
  confidence: number;
}

interface Skill {
  id: string;
  name: string;
  importance: number;
}

const INITIAL_DOMAINS: Domain[] = [
  { name: 'Embedded AI / TinyML', confidence: 0.91 },
  { name: 'IoT Security & Networking', confidence: 0.87 },
  { name: 'Biomedical Signal Processing', confidence: 0.63 },
];

const INITIAL_SKILLS: Skill[] = [
  { id: 's1', name: 'BLE 5.0 / AES-GCM', importance: 0.8 },
  { id: 's2', name: 'C/C++ Embedded (nRF5 SDK)', importance: 1.0 },
  { id: 's3', name: 'CNN / TinyML Inference', importance: 1.0 },
  { id: 's4', name: 'MQTT over TLS', importance: 0.6 },
  { id: 's5', name: 'ARM Cortex-M4 / CMSIS-NN', importance: 0.9 },
  { id: 's6', name: 'IEC 62304 Medical SW', importance: 0.5 },
];

const AUTOCOMPLETE_SUGGESTIONS = [
  'Python', 'React', 'Docker', 'Kubernetes', 'TensorFlow', 'PyTorch',
  'TypeScript', 'Go', 'Rust', 'Java', 'FreeRTOS', 'FPGA', 'CUDA',
  'AWS', 'GCP', 'Azure', 'MongoDB', 'PostgreSQL', 'Redis',
];

function importanceLabel(val: number): string {
  if (val >= 0.75) return 'High';
  if (val >= 0.5) return 'Medium';
  return 'Low';
}

function confidenceBar(confidence: number) {
  const pct = confidence * 100;
  const color =
    confidence >= 0.65
      ? 'bg-[#8AB4F8]'
      : 'bg-amber-400';
  return { pct, color };
}

const EntityReview: React.FC = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState<Skill[]>(INITIAL_SKILLS);
  const [addInput, setAddInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchDone, setSearchDone] = useState(false);
  const [progress, setProgress] = useState(0);

  const filtered = AUTOCOMPLETE_SUGGESTIONS.filter(
    (s) =>
      addInput.length > 0 &&
      s.toLowerCase().includes(addInput.toLowerCase()) &&
      !skills.find((sk) => sk.name.toLowerCase() === s.toLowerCase()),
  );

  const addSkill = (name: string) => {
    if (!name.trim()) return;
    if (skills.find((s) => s.name.toLowerCase() === name.trim().toLowerCase())) return;
    setSkills((prev) => [
      ...prev,
      { id: `s${Date.now()}`, name: name.trim(), importance: 0.6 },
    ]);
    setAddInput('');
    setShowSuggestions(false);
  };

  const removeSkill = (id: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
  };

  const updateImportance = (id: string, val: number) => {
    setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, importance: val } : s)));
  };

  const handleSearch = async () => {
    setSearching(true);
    setSearchDone(false);
    setProgress(0);
    // Simulate progress
    const steps = [20, 50, 75, 90, 100];
    for (const step of steps) {
      await new Promise((r) => setTimeout(r, 400));
      setProgress(step);
    }
    setSearching(false);
    setSearchDone(true);
    await new Promise((r) => setTimeout(r, 600));
    navigate('/student/discovery');
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-[#EAF2FF] border border-[#E2E8F0] rounded-xl">
          <Brain size={22} className="text-[#334155]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">Entity Review</h1>
          <p className="text-sm text-[#64748B]">
            Review and refine the extracted domains and skills before searching.
          </p>
        </div>
      </div>

      {/* Top 3 Domains */}
      <div className="card p-6 mb-6 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
        <h2 className="text-base font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#8AB4F8]" />
          Top 3 Detected Domains
        </h2>
        <div className="space-y-4">
          {INITIAL_DOMAINS.map((d) => {
            const { pct, color } = confidenceBar(d.confidence);
            const isTentative = d.confidence < 0.65;
            return (
              <div key={d.name}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#1E293B]">{d.name}</span>
                    {isTentative && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        <AlertTriangle size={10} />
                        Tentative
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-xs font-mono font-bold ${
                      isTentative ? 'text-amber-700' : 'text-[#334155]'
                    }`}
                  >
                    {(d.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 bg-[#F4F8FF] border border-[#E2E8F0] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${color}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {isTentative && (
                  <p className="text-xs text-amber-700 mt-1 flex items-center gap-1">
                    <AlertTriangle size={11} />
                    Confidence below 0.65 threshold — may not influence matching strongly.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Extracted Skills */}
      <div className="card p-6 mb-6 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
        <h2 className="text-base font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#A5B4FC]" />
          Extracted Technical Skills
        </h2>

        {skills.length === 0 && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl mb-4">
            <AlertTriangle size={15} className="text-red-600" />
            <span className="text-sm text-red-700 font-medium">
              At least one technical skill is required for matching.
            </span>
          </div>
        )}

        <div className="space-y-3">
          {skills.map((sk) => {
            const label = importanceLabel(sk.importance);
            const labelColor =
              label === 'High'
                ? 'text-[#1E293B] font-bold'
                : label === 'Medium'
                ? 'text-[#334155]'
                : 'text-[#64748B]';
            return (
              <div
                key={sk.id}
                className="flex flex-col sm:flex-row sm:items-center gap-2 p-3.5 bg-[#F4F8FF] rounded-2xl border border-[#E2E8F0]"
              >
                {/* Skill chip + remove */}
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <SkillChip skill={sk.name} variant="matched" onRemove={() => removeSkill(sk.id)} />
                </div>
                {/* Slider */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs font-semibold w-14 text-right ${labelColor}`}>{label}</span>
                  <input
                    type="range"
                    min={0.3}
                    max={1.0}
                    step={0.1}
                    value={sk.importance}
                    onChange={(e) => updateImportance(sk.id, parseFloat(e.target.value))}
                    className="w-28 accent-[#8AB4F8]"
                    aria-label={`Importance for ${sk.name}`}
                  />
                  <span className="text-xs font-mono text-[#64748B] w-8">{sk.importance.toFixed(1)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add skill */}
        <div className="mt-4 relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <input
                type="text"
                value={addInput}
                onChange={(e) => {
                  setAddInput(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addSkill(addInput);
                }}
                placeholder="Add a skill (type to search)…"
                className="input pl-10 w-full"
              />
              {showSuggestions && filtered.length > 0 && (
                <div className="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-[#E2E8F0] rounded-2xl shadow-lg max-h-48 overflow-y-auto">
                  {filtered.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onMouseDown={() => addSkill(s)}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#EAF2FF] text-[#334155] transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => addSkill(addInput)}
              disabled={!addInput.trim()}
              className="btn-primary flex items-center gap-1 px-5"
            >
              <Plus size={15} />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Search button */}
      <div className="card p-6 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
        {searching && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-[#64748B] mb-1.5">
              <span className="font-medium text-[#334155]">Searching 200+ faculty & industry mentors…</span>
              <span className="font-mono font-bold text-[#1E293B]">{progress}%</span>
            </div>
            <div className="h-2 bg-[#F4F8FF] border border-[#E2E8F0] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#8AB4F8] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {searchDone && (
          <div className="flex items-center gap-2 mb-4 text-xs text-emerald-800 font-semibold bg-[#A7E8D0]/30 px-3 py-1.5 rounded-full border border-[#A7E8D0] inline-flex">
            <CheckCircle size={14} className="text-emerald-600" />
            Vector & hybrid search completed in 38 ms
          </div>
        )}

        <button
          type="button"
          onClick={handleSearch}
          disabled={skills.length === 0 || searching}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
            skills.length > 0 && !searching
              ? 'bg-[#8AB4F8] hover:bg-[#72A3F6] text-[#1E293B] shadow-sm'
              : 'bg-slate-100 text-slate-400 border border-[#E2E8F0] cursor-not-allowed'
          }`}
        >
          {searching ? (
            <>
              <svg className="animate-spin h-4 w-4 text-[#1E293B]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-[#1E293B]">Searching…</span>
            </>
          ) : (
            <>
              <Search size={16} />
              <span>Confirm Requirements & Find Advisors</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default EntityReview;
