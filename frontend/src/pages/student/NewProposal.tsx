import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Zap, Lock, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockECGProblemStatement } from '../../data/mockData';

const MAX_CHARS = 5000;
const MIN_CHARS = 50;
const WARN_CHARS = 4500;

function getCharCountIndicator(count: number) {
  if (count === 0) return null;
  if (count < MIN_CHARS) {
    return {
      color: 'text-red-600',
      bg: 'bg-red-500',
      msg: 'Minimum 50 characters required',
      icon: <AlertCircle size={14} className="text-red-600" />,
    };
  }
  if (count >= MIN_CHARS && count < WARN_CHARS) {
    return {
      color: 'text-green-600',
      bg: 'bg-green-500',
      msg: null,
      icon: <CheckCircle size={14} className="text-green-600" />,
    };
  }
  if (count >= WARN_CHARS && count < MAX_CHARS) {
    return {
      color: 'text-amber-600',
      bg: 'bg-amber-500',
      msg: 'Approaching character limit',
      icon: <AlertTriangle size={14} className="text-amber-600" />,
    };
  }
  return {
    color: 'text-red-600',
    bg: 'bg-red-500',
    msg: 'Character limit reached',
    icon: <AlertCircle size={14} className="text-red-600" />,
  };
}

const NewProposal: React.FC = () => {
  const navigate = useNavigate();
  const { addProposal } = useApp();
  const [title, setTitle] = useState('');
  const [problem, setProblem] = useState('');
  const [loading, setLoading] = useState(false);

  const charCount = problem.length;
  const indicator = getCharCountIndicator(charCount);
  const barWidth = Math.min((charCount / MAX_CHARS) * 100, 100);
  const isValid = charCount >= MIN_CHARS;

  const handleAnalyze = async () => {
    if (!isValid) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    // Store in sessionStorage for EntityReview to pick up
    sessionStorage.setItem('uniexpert_problem', problem);
    sessionStorage.setItem('uniexpert_title', title);
    setLoading(false);
    navigate('/student/entity-review');
  };

  const handleLoadSample = () => {
    setProblem(mockECGProblemStatement);
    if (!title) setTitle('EdgeShield: BLE-Based ECG Monitoring with TinyML Anomaly Detection');
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-[#EAF2FF] border border-[#E2E8F0] rounded-xl">
          <FileText size={22} className="text-[#334155]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">New Proposal</h1>
          <p className="text-sm text-[#64748B]">
            Describe your capstone problem to find the best-matched advisors.
          </p>
        </div>
      </div>

      <div className="card p-6 md:p-8 space-y-6 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Project Title <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. EdgeShield: BLE ECG Monitoring System"
            className="input w-full"
          />
        </div>

        {/* Problem statement */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Problem Statement <span className="text-red-500">*</span>
            </label>
            {/* Character counter */}
            <span
              className={`text-xs font-mono font-semibold ${
                charCount >= MAX_CHARS
                  ? 'text-red-600'
                  : charCount >= WARN_CHARS
                  ? 'text-amber-600'
                  : charCount >= MIN_CHARS
                  ? 'text-green-600'
                  : 'text-slate-400'
              }`}
            >
              {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters
            </span>
          </div>

          <textarea
            value={problem}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) setProblem(e.target.value);
            }}
            rows={12}
            placeholder="Describe your capstone problem in detail. Include the technical context, goals, constraints, and required expertise areas..."
            className="input w-full resize-none font-mono text-sm leading-relaxed"
          />

          {/* Progress bar */}
          <div className="mt-2">
            <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  charCount >= MAX_CHARS
                    ? 'bg-red-500'
                    : charCount >= WARN_CHARS
                    ? 'bg-amber-500'
                    : charCount >= MIN_CHARS
                    ? 'bg-green-500'
                    : 'bg-slate-400'
                }`}
                style={{ width: `${barWidth}%` }}
              />
            </div>
          </div>

          {/* Indicator message */}
          {indicator?.msg && (
            <div className="flex items-center gap-1.5 mt-2">
              {indicator.icon}
              <span className={`text-xs font-medium ${indicator.color}`}>{indicator.msg}</span>
            </div>
          )}
          {charCount >= MIN_CHARS && charCount < WARN_CHARS && (
            <div className="flex items-center gap-1.5 mt-2">
              <CheckCircle size={14} className="text-green-600" />
              <span className="text-xs font-medium text-green-600">Good length</span>
            </div>
          )}
        </div>

        {/* Load sample button */}
        <div>
          <button
            type="button"
            onClick={handleLoadSample}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E2E8F0] text-sm text-[#334155] bg-[#F4F8FF] hover:bg-[#EAF2FF] transition-colors font-medium"
          >
            <Zap size={15} className="text-[#8AB4F8]" />
            Load Sample Problem (ECG Healthcare)
          </button>
        </div>

        {/* Privacy note */}
        <div className="flex items-start gap-2.5 p-3.5 bg-[#EAF2FF] border border-[#E2E8F0] rounded-xl">
          <Lock size={15} className="text-[#64748B] mt-0.5 shrink-0" />
          <p className="text-sm text-[#334155]">
            <span className="font-semibold text-[#1E293B]">Privacy note:</span> Proposals remain private until you submit them to an expert.
          </p>
        </div>

        {/* Analyze button */}
        <div>
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!isValid || loading}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
              isValid && !loading
                ? 'bg-[#8AB4F8] hover:bg-[#72A3F6] text-[#1E293B] shadow-sm hover:shadow-md'
                : 'bg-slate-100 text-slate-400 border border-[#E2E8F0] cursor-not-allowed'
            }`}
          >
            {loading ? (
              <>
                {/* Spinner */}
                <svg
                  className="animate-spin h-4 w-4 text-[#1E293B]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                <span className="text-[#1E293B]">Analyzing problem formulation…</span>
              </>
            ) : !isValid ? (
              <span>Need at least 50 characters</span>
            ) : (
              <>
                <Zap size={16} />
                <span>Analyze Problem Formulation</span>
              </>
            )}
          </button>

          {/* Skeleton preview while loading */}
          {loading && (
            <div className="mt-4 space-y-2 animate-pulse">
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewProposal;
