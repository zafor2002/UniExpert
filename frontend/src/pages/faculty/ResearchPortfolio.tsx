import React, { useState } from 'react';
import { 
  BookOpen, RefreshCw, Upload, CheckCircle2, AlertCircle, Award, 
  ExternalLink, FileSpreadsheet, ChevronRight, Lock, Check 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useApp } from '../../context/AppContext';
import { mockPublications } from '../../data/mockData';
import type { Publication } from '../../types';

type SyncState = 'idle' | 'queued' | 'fetching' | 'parsing' | 'indexed' | 'failed';

export const ResearchPortfolio: React.FC = () => {
  const { experts } = useApp();
  const faculty = experts[0];

  const [orcid, setOrcid] = useState('0000-0002-1234-5678');
  const [scholarId, setScholarId] = useState('farhana_rahman_diu');
  const [syncState, setSyncState] = useState<SyncState>('idle');
  const [publications, setPublications] = useState<Publication[]>(mockPublications);

  const startSync = () => {
    setSyncState('queued');
    setTimeout(() => {
      setSyncState('fetching');
      setTimeout(() => {
        setSyncState('parsing');
        setTimeout(() => {
          setSyncState('indexed');
          toast.success('Publications and citations synchronized from Google Scholar.');
        }, 1200);
      }, 1500);
    }, 1000);
  };

  const simulateFailure = () => {
    setSyncState('queued');
    setTimeout(() => {
      setSyncState('fetching');
      setTimeout(() => {
        setSyncState('failed');
        toast.error('Google Scholar API timeout. Please retry or upload a bibtex/CSV.');
      }, 1500);
    }, 800);
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSyncState('indexed');
      toast.success(`Parsed ${file.name}: 18 publications indexed.`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24">
      {/* Top Banner */}
      <div className="card p-6 md:p-8 bg-white border border-[#E2E8F0] shadow-sm rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-[#EAF2FF] text-[#1E293B] border border-[#8AB4F8]/50">
              Scholar Registry
            </span>
            <span className="text-xs text-[#64748B]">· Automated Semantic Indexer</span>
          </div>
          <h1 className="text-xl font-bold text-[#1E293B]">Research Portfolio & Academic Profile</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Synchronizes publications with Qdrant vector database for problem statement semantic matching
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right bg-[#F4F8FF] p-3.5 rounded-2xl border border-[#E2E8F0]">
            <span className="text-[10px] text-[#64748B] uppercase font-bold block">Current Metrics</span>
            <span className="text-base font-bold text-[#1E293B]">18 Papers · h-index 7 · 213 Citations</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Sync Controls & Tier Progression */}
        <div className="space-y-6">
          {/* ORCID & Scholar Sync Card */}
          <div className="card p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <RefreshCw size={18} className="text-primary-600" />
              External Scholar Sync
            </h2>

            <div className="space-y-3">
              <div>
                <label className="label">ORCID iD (Verified)</label>
                <input
                  type="text"
                  value={orcid}
                  onChange={(e) => setOrcid(e.target.value)}
                  className="input text-xs font-mono"
                />
              </div>

              <div>
                <label className="label">Google Scholar User ID</label>
                <input
                  type="text"
                  value={scholarId}
                  onChange={(e) => setScholarId(e.target.value)}
                  className="input text-xs font-mono"
                />
              </div>

              {/* Sync Progress Status */}
              {syncState !== 'idle' && syncState !== 'failed' && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300 capitalize">
                      Status: {syncState}...
                    </span>
                    {syncState === 'indexed' ? (
                      <CheckCircle2 size={16} className="text-accent-600" />
                    ) : (
                      <RefreshCw size={14} className="text-primary-600 animate-spin" />
                    )}
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-primary-600 h-full transition-all duration-300"
                      style={{
                        width:
                          syncState === 'queued'
                            ? '25%'
                            : syncState === 'fetching'
                            ? '55%'
                            : syncState === 'parsing'
                            ? '85%'
                            : '100%',
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {syncState === 'queued' && 'Queued in background task worker...'}
                    {syncState === 'fetching' && 'Connecting to Google Scholar scraping proxy...'}
                    {syncState === 'parsing' && 'Extracting publication abstracts & BibTeX tags...'}
                    {syncState === 'indexed' && 'Vectorized & indexed in Qdrant successfully.'}
                  </span>
                </div>
              )}

              {/* Sync Failure State with CSV Upload */}
              {syncState === 'failed' && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 space-y-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-red-900 dark:text-red-200">
                      <span className="font-bold block">Scholar Sync Failure</span>
                      External citation gateway timed out. Please retry or supply a BibTeX/CSV publication export.
                    </div>
                  </div>

                  <label className="btn-secondary text-xs w-full justify-center cursor-pointer py-2">
                    <FileSpreadsheet size={14} /> Upload Publications CSV
                    <input type="file" accept=".csv,.bib" onChange={handleCsvUpload} className="hidden" />
                  </label>
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={startSync}
                  disabled={syncState === 'queued' || syncState === 'fetching' || syncState === 'parsing'}
                  className="btn-primary text-xs flex-1 justify-center py-2"
                >
                  <RefreshCw size={13} /> Sync Publications
                </button>
                <button
                  type="button"
                  onClick={simulateFailure}
                  className="btn-secondary text-xs py-2 px-2.5 text-slate-500"
                  title="Simulate network failure"
                >
                  Simulate Error
                </button>
              </div>
            </div>
          </div>

          {/* Credential Tier Progression Card (Screen 21) */}
          <div className="card p-6 space-y-4 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
                <Award size={18} className="text-[#8AB4F8]" />
                Faculty Credential Tier
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#EAF2FF] text-[#1E293B] border border-[#8AB4F8]/40">
                Tier 2 Active
              </span>
            </div>

            <p className="text-xs text-[#64748B]">
              Departmental tier determines ranking weight $w_4$ and supervisory delegation limits
            </p>

            {/* Tier Steps */}
            <div className="space-y-3 pt-1">
              {/* Tier 1 */}
              <div className="p-3.5 rounded-2xl border border-[#A7E8D0] bg-[#A7E8D0]/15 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#A7E8D0] text-[#1E293B] flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={14} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1E293B]">Tier 1: Associate Faculty</span>
                    <span className="text-[10px] text-emerald-800 font-bold bg-[#A7E8D0]/40 px-2 py-0.2 rounded-full">Cleared</span>
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-0.5">≥ 5 Publications · M.Sc. or Ph.D. enrolled</p>
                </div>
              </div>

              {/* Tier 2 (Current) */}
              <div className="p-3.5 rounded-2xl border-2 border-[#8AB4F8] bg-[#EAF2FF] flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#8AB4F8] text-[#1E293B] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  2
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1E293B]">Tier 2: Senior Researcher</span>
                    <span className="text-[10px] font-bold text-[#1E293B] bg-white px-2 py-0.2 rounded-full border border-[#8AB4F8]/40">CURRENT</span>
                  </div>
                  <p className="text-[11px] text-[#334155] mt-0.5">
                    ≥ 15 Publications · h-index ≥ 6 · Ph.D. Completed
                  </p>
                </div>
              </div>

              {/* Tier 3 (Locked) */}
              <div className="p-3.5 rounded-2xl border border-[#E2E8F0] bg-[#F4F8FF] opacity-75 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-200 text-[#64748B] flex items-center justify-center shrink-0 mt-0.5">
                  <Lock size={12} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#64748B]">Tier 3: Distinguished Chair</span>
                    <span className="text-[10px] text-[#64748B]">Locked</span>
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-0.5">
                    ≥ 25 Publications · h-index ≥ 12 · IEEE/ACM Senior Member (Requires 7 more publications)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (2 spans): Indexed Publications List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-6 md:p-8 space-y-4 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
                  <BookOpen size={18} className="text-[#8AB4F8]" />
                  Indexed Academic Publications ({publications.length})
                </h2>
                <p className="text-xs text-[#64748B]">
                  Dense semantic embeddings generated using FastEmbed / Qdrant HNSW
                </p>
              </div>
              <span className="text-xs font-mono text-[#64748B]">Sort: Citation Count (Desc)</span>
            </div>

            <div className="space-y-3">
              {publications.map((pub, idx) => (
                <div
                  key={pub.id}
                  className="p-4 rounded-2xl border border-[#E2E8F0] bg-[#F4F8FF] hover:border-[#8AB4F8]/50 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xs font-bold text-[#1E293B]">
                        {idx + 1}. {pub.title}
                      </h3>
                      <p className="text-[11px] text-[#64748B] mt-0.5 font-medium">
                        {pub.venue} · <span className="font-mono">{pub.year}</span>
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#EAF2FF] text-[#1E293B] shrink-0 border border-[#8AB4F8]/40">
                      {pub.citations} Citations
                    </span>
                  </div>

                  <p className="text-xs text-[#64748B] italic line-clamp-2">
                    "{pub.abstract || 'Demonstrated TinyML optimization on Cortex-M4 with real-time BLE latency constraints.'}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-1">
                    <span className="font-mono text-[10px]">DOI: 10.1109/TBME.2024.94021</span>
                    <a
                      href="#scholar"
                      className="text-[#1E293B] font-semibold hover:underline flex items-center gap-1"
                    >
                      View on Scholar <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchPortfolio;

