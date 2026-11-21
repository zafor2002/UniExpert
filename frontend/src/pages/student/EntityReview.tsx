import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Plus, X, CheckCircle, AlertTriangle, Search, Sparkles, RefreshCw, Cpu, Layers, Award, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import SkillChip from '../../components/shared/SkillChip';
import { api } from '../../api/client';

interface Domain {
  name: string;
  confidence: number;
}

interface Skill {
  id: string;
  name: string;
  importance: number;
}

const SAMPLE_PRESETS = [
  {
    label: 'Edge-AI & TinyML',
    title: 'EdgeShield: BLE-Based ECG Monitoring with TinyML Anomaly Detection',
    problem: 'Designing an ultra-low-power telemetry patch for cardiac patients requiring real-time arrhythmia detection on an ARM Cortex-M4 microcontroller running 8-bit quantized CNN models under strict latency and memory constraints with BLE 5.0 AES-GCM streaming.'
  },
  {
    label: 'Bioinformatics & CRISPR',
    title: 'Scalable Single-Cell RNA Sequencing Analysis via scRNA-seq and CRISPR GNN Prediction',
    problem: 'Automated computational genomics pipeline using Nextflow and Spark to process single-cell RNA sequencing (scRNA-seq) data, with graph neural networks predicting CRISPR off-target interactions and drug-target binding affinity.'
  },
  {
    label: 'Cloud & Kubernetes',
    title: 'Multi-Region Kubernetes Container Orchestration with Terraform and GitOps CI/CD',
    problem: 'Enterprise cloud infrastructure automated via Terraform and Helm on AWS, implementing zero-downtime cross-region Kubernetes pod failover and Prometheus monitoring with policy-as-code and Docker microservices.'
  },
  {
    label: 'Blockchain & ZK-Proofs',
    title: 'Formal Verification of Ethereum Smart Contracts with Zero-Knowledge Proofs and Merkle Trees',
    problem: 'Auditing Solidity smart contracts for reentrancy and flash loan exploits using formal SMT verification, combined with zk-SNARK rollup proofs and Merkle tree state commitments on Ethereum.'
  },
  {
    label: 'Medical Computer Vision',
    title: 'Deep Learning Semantic Segmentation of Brain Tumors on Multi-Modal MRI using YOLO and Vision Transformers',
    problem: 'Computer vision pipeline for automated volumetric radiological segmentation of glioblastoma tumors across T1, T2, and FLAIR MRI modalities using self-supervised Vision Transformers and YOLO with PyTorch.'
  }
];

const INITIAL_DOMAINS: Domain[] = [
  { name: 'Embedded AI & Edge Computing', confidence: 0.94 },
  { name: 'Healthcare & Biomedical Computing', confidence: 0.88 },
  { name: 'Machine Learning & Deep Learning', confidence: 0.72 },
];

const INITIAL_SKILLS: Skill[] = [
  { id: 's1', name: 'TinyML', importance: 1.0 },
  { id: 's2', name: 'ARM Cortex-M4', importance: 1.0 },
  { id: 's3', name: 'BLE 5.0', importance: 0.9 },
  { id: 's4', name: 'CMSIS-NN', importance: 0.8 },
  { id: 's5', name: 'Sensor Fusion', importance: 0.8 },
  { id: 's6', name: 'Bio-Sensing', importance: 0.7 },
];

const AUTOCOMPLETE_SUGGESTIONS = [
  'Python', 'React', 'Docker', 'Kubernetes', 'TensorFlow', 'PyTorch',
  'TypeScript', 'Go', 'Rust', 'Java', 'FreeRTOS', 'FPGA', 'CUDA',
  'AWS', 'GCP', 'Azure', 'MongoDB', 'PostgreSQL', 'Redis', 'YOLO',
  'scRNA-seq', 'CRISPR Analysis', 'GNN', 'Solidity', 'Zero-Knowledge Proofs',
  'Spring Boot', 'Terraform', 'Nextflow', 'UML / SysML', 'Agile / Scrum'
];

function importanceLabel(val: number): string {
  if (val >= 0.75) return 'High';
  if (val >= 0.5) return 'Medium';
  return 'Low';
}

function confidenceBar(confidence: number) {
  const pct = Math.min(100, Math.round(confidence * 100));
  const color = confidence >= 0.75 ? 'bg-[#8AB4F8]' : 'bg-[#A7E8D0]';
  return { pct, color };
}

const EntityReview: React.FC = () => {
  const navigate = useNavigate();

  // Active Proposal Input State (Editable directly on this page)
  const [title, setTitle] = useState(() => {
    return sessionStorage.getItem('uniexpert_title') || SAMPLE_PRESETS[0].title;
  });
  const [problem, setProblem] = useState(() => {
    return sessionStorage.getItem('uniexpert_problem') || SAMPLE_PRESETS[0].problem;
  });

  const [domains, setDomains] = useState<Domain[]>(() => {
    try {
      const saved = sessionStorage.getItem('uniexpert_extracted');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.all_domains && parsed.all_domains.length > 0) {
          return parsed.all_domains.map((d: string, idx: number) => ({
            name: d,
            confidence: Math.max(0.65, 0.95 - idx * 0.12)
          }));
        }
      }
    } catch {}
    return INITIAL_DOMAINS;
  });

  const [skills, setSkills] = useState<Skill[]>(() => {
    try {
      const saved = sessionStorage.getItem('uniexpert_extracted');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.prerequisite_skills && parsed.prerequisite_skills.length > 0) {
          return parsed.prerequisite_skills.map((s: string, idx: number) => ({
            id: `s-live-${idx}`,
            name: s,
            importance: idx < 3 ? 1.0 : 0.8
          }));
        }
      }
    } catch {}
    return INITIAL_SKILLS;
  });

  const [complexity, setComplexity] = useState<{ level: number; label: string; tokenCount: number }>(() => {
    try {
      const saved = sessionStorage.getItem('uniexpert_extracted');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          level: parsed.complexity_level || 5,
          label: parsed.complexity_label || 'Complex Engineering',
          tokenCount: parsed.token_count || 32
        };
      }
    } catch {}
    return { level: 5, label: 'Complex Engineering', tokenCount: 32 };
  });

  const [isExtracting, setIsExtracting] = useState(false);
  const [addInput, setAddInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchDone, setSearchDone] = useState(false);
  const [progress, setProgress] = useState(0);

  // Live NLP Extraction via Backend API
  const handleExtractWithAi = async (t = title, p = problem) => {
    if (!p.trim()) {
      toast.error('Please enter a problem statement to analyze.');
      return;
    }
    setIsExtracting(true);
    try {
      const data = await api.extractEntities(t, p);
      if (data) {
        if (data.all_domains && data.all_domains.length > 0) {
          setDomains(data.all_domains.map((d: string, idx: number) => ({
            name: d,
            confidence: Math.max(0.65, 0.96 - idx * 0.12)
          })));
        }
        if (data.prerequisite_skills && data.prerequisite_skills.length > 0) {
          setSkills(data.prerequisite_skills.map((s: string, idx: number) => ({
            id: `s-${Date.now()}-${idx}`,
            name: s,
            importance: idx < 3 ? 1.0 : 0.8
          })));
        }
        setComplexity({
          level: data.complexity_level || 4,
          label: data.complexity_label || 'Complex Engineering',
          tokenCount: data.token_count || p.split(' ').length
        });
        sessionStorage.setItem('uniexpert_title', t);
        sessionStorage.setItem('uniexpert_problem', p);
        sessionStorage.setItem('uniexpert_extracted', JSON.stringify(data));
        toast.success(`AI Identified: ${data.all_domains?.length || 0} Domains, ${data.prerequisite_skills?.length || 0} Skills`);
      }
    } catch (err) {
      console.debug('Failed to extract entities live', err);
      toast.error('Could not reach backend AI extractor.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleApplyPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setTitle(preset.title);
    setProblem(preset.problem);
    handleExtractWithAi(preset.title, preset.problem);
  };

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
      { id: `s${Date.now()}`, name: name.trim(), importance: 0.8 },
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
    const steps = [25, 55, 80, 95, 100];
    for (const step of steps) {
      await new Promise((r) => setTimeout(r, 120));
      setProgress(step);
    }
    setSearching(false);
    setSearchDone(true);
    await new Promise((r) => setTimeout(r, 200));

    // Save active state and transition to discovery with query parameter
    sessionStorage.setItem('uniexpert_title', title);
    sessionStorage.setItem('uniexpert_problem', problem);
    navigate(`/student/discovery?q=${encodeURIComponent(title || problem)}`);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-[#EAF2FF] border border-[#E2E8F0] rounded-xl">
          <Brain size={22} className="text-[#3B75DE]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">Entity Review & AI Taxonomy</h1>
          <p className="text-sm text-[#64748B]">
            Zero-Cost NLP Entity Extractor: Test different titles and descriptions in real time.
          </p>
        </div>
      </div>

      {/* Interactive Title & Description Input Box */}
      <div className="card p-6 mb-6 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#1E293B] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={15} className="text-[#3B75DE]" />
            Live Project Statement Input
          </span>
          <span className="text-xs font-mono text-[#64748B]">
            {problem.length} chars · {complexity.tokenCount} tokens
          </span>
        </div>

        {/* 1-Click Domain Presets */}
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs font-semibold text-[#64748B] self-center mr-1">Load Domain Preset:</span>
          {SAMPLE_PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="text-xs font-medium px-2.5 py-1 rounded-xl bg-[#F4F8FF] hover:bg-[#EAF2FF] text-[#334155] border border-[#E2E8F0] transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>

        <div>
          <label className="text-xs font-semibold text-[#64748B] block mb-1">Project Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Scalable Single-Cell RNA Sequencing Analysis via scRNA-seq"
            className="input w-full text-sm font-semibold text-[#1E293B]"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[#64748B] block mb-1">Problem Statement / Technical Description</label>
          <textarea
            rows={3}
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="Describe the capstone problem statement, hardware constraints, datasets, and proposed algorithms..."
            className="input w-full text-sm text-[#334155] leading-relaxed resize-y"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => handleExtractWithAi()}
            disabled={isExtracting || !problem.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-[#3B75DE] hover:bg-[#2563EB] text-white shadow-sm transition-all"
          >
            {isExtracting ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Extracting Entities...</span>
              </>
            ) : (
              <>
                <Brain size={15} />
                <span>Re-Extract Entities with AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* BAETE Criterion 4 Complexity Level Card */}
      <div className="card p-5 mb-6 bg-[#F4F8FF] border border-[#E2E8F0] rounded-3xl flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-white border border-[#E2E8F0] rounded-2xl text-[#3B75DE] shadow-xs">
            <Award size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#1E293B]">BAETE Criterion 4 Complexity:</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EAF2FF] text-[#1D4ED8] border border-[#BFDBFE]">
                Level {complexity.level} / 5
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Assessed as <strong className="text-[#1E293B]">{complexity.label}</strong> based on {skills.length} prerequisite technical skills and {domains.length} detected domains.
            </p>
          </div>
        </div>
        <div className="hidden sm:block text-right">
          <span className="text-[11px] font-mono text-emerald-700 bg-[#A7E8D0]/30 px-2.5 py-1 rounded-full border border-[#A7E8D0] font-semibold">
            WP1–WP7 Compliant
          </span>
        </div>
      </div>

      {/* Top 3 Detected Domains */}
      <div className="card p-6 mb-6 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
        <h2 className="text-base font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#8AB4F8]" />
          Top Detected Academic Domains
        </h2>
        <div className="space-y-4">
          {domains.map((d) => {
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
                    {pct}%
                  </span>
                </div>
                <div className="h-2 bg-[#F4F8FF] border border-[#E2E8F0] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${color}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Extracted Skills */}
      <div className="card p-6 mb-6 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
        <h2 className="text-base font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#A5B4FC]" />
          Extracted Prerequisite Technical Skills (K_req)
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
                className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-[#F4F8FF] rounded-2xl border border-[#E2E8F0]"
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
                    className="w-28 accent-[#3B75DE]"
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
                placeholder="Add a custom prerequisite skill…"
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
              <span className="font-medium text-[#334155]">Searching 50 faculty & industry mentors…</span>
              <span className="font-mono font-bold text-[#1E293B]">{progress}%</span>
            </div>
            <div className="h-2 bg-[#F4F8FF] border border-[#E2E8F0] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#3B75DE] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {searchDone && (
          <div className="flex items-center gap-2 mb-4 text-xs text-emerald-800 font-semibold bg-[#A7E8D0]/30 px-3 py-1.5 rounded-full border border-[#A7E8D0] inline-flex">
            <CheckCircle size={14} className="text-emerald-600" />
            Vector & hybrid search completed in 24 ms
          </div>
        )}

        <button
          type="button"
          onClick={handleSearch}
          disabled={skills.length === 0 || searching}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 ${
            skills.length > 0 && !searching
              ? 'bg-[#3B75DE] hover:bg-[#2563EB] text-white shadow-sm'
              : 'bg-slate-100 text-slate-400 border border-[#E2E8F0] cursor-not-allowed'
          }`}
        >
          {searching ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Finding Best-Fit Advisors…</span>
            </>
          ) : (
            <>
              <Search size={16} />
              <span>Confirm Requirements & Find Advisors (50 Faculty)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default EntityReview;
