import React, { useState } from 'react';
import { 
  Activity, Server, Database, Cpu, CheckCircle2, AlertTriangle, 
  Clock, Shield, RefreshCw, Lock, KeyRound 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'react-hot-toast';
import { mockSystemHealth } from '../../data/mockData';

export const SystemHealth: React.FC = () => {
  const [mfaUnlocked, setMfaUnlocked] = useState(false);
  const [totpCode, setTotpCode] = useState('');

  const latencyHistory = [
    { time: '00:00', ms: 32 }, { time: '02:00', ms: 34 }, { time: '04:00', ms: 30 },
    { time: '06:00', ms: 38 }, { time: '08:00', ms: 45 }, { time: '10:00', ms: 38 },
    { time: '12:00', ms: 52 }, { time: '14:00', ms: 42 }, { time: '16:00', ms: 38 },
    { time: '18:00', ms: 35 }, { time: '20:00', ms: 36 }, { time: '22:00', ms: 38 },
  ];

  const handleUnlockMfa = (e: React.FormEvent) => {
    e.preventDefault();
    if (totpCode === '123456') {
      setMfaUnlocked(true);
      toast.success('Admin privileged operations unlocked.');
    } else {
      toast.error('Invalid TOTP token. Enter demo code 123456.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24">
      {/* Top Header */}
      <div className="card p-6 md:p-8 bg-white border border-[#E2E8F0] shadow-sm rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs px-3 py-1 rounded-full font-semibold bg-[#A7E8D0]/30 text-[#0F766E] border border-[#A7E8D0]/60">
              Cluster Operational
            </span>
            <span className="text-xs text-[#64748B]">· Telemetry & Infrastructure Health</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-[#334155]">System Health & Vector Engine Diagnostics</h1>
          <p className="text-xs text-[#64748B] mt-1">
            Real-time monitoring of Qdrant HNSW vector search, FastAPI gateway, and Celery NLP queues
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-[#EAF2FF] border border-[#8AB4F8]/30 text-[#2563EB] px-3.5 py-2 rounded-2xl font-semibold">
          <Activity size={14} className="text-[#2563EB] animate-pulse" />
          <span>All 4 Pods Nominal</span>
        </div>
      </div>

      {/* 4 Telemetry Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Card 1: Uptime */}
        <div className="card p-5 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm space-y-1">
          <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider block">Cluster Availability</span>
          <span className="text-2xl font-extrabold text-[#0F766E] block">
            {mockSystemHealth.uptime}%
          </span>
          <span className="text-[11px] text-[#64748B] mt-1 block">Target: 99.50% SLA</span>
        </div>

        {/* Card 2: Latency */}
        <div className="card p-5 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm space-y-1">
          <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider block">Qdrant p95 Latency</span>
          <span className="text-2xl font-extrabold text-[#2563EB] block">
            {mockSystemHealth.qdrantLatency} ms
          </span>
          <span className="text-[11px] text-[#64748B] mt-1 block">Target: &lt; 200 ms</span>
        </div>

        {/* Card 3: Queue Depth */}
        <div className="card p-5 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm space-y-1">
          <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider block">NLP Queue Depth</span>
          <span className="text-2xl font-extrabold text-[#334155] block">
            {mockSystemHealth.queueDepth} Jobs
          </span>
          <span className="text-[11px] text-[#0F766E] font-medium mt-1 block">Zero Backlog Spill</span>
        </div>

        {/* Card 4: Last Backup */}
        <div className="card p-5 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm space-y-1">
          <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider block">Snapshot Backup</span>
          <span className="text-base font-bold text-[#334155] mt-1 block">
            3 Hours Ago
          </span>
          <span className="text-[11px] text-[#0F766E] font-medium mt-1 block">SHA-256 Verified</span>
        </div>
      </div>

      {/* Latency History Chart */}
      <div className="card p-6 bg-white border border-[#E2E8F0] shadow-sm rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#334155]">
              Vector Retrieval p95 Latency (24h Trend)
            </h2>
            <p className="text-xs text-[#64748B]">FastEmbed 384-dimensional dense semantic query response time</p>
          </div>
          <span className="text-xs font-mono font-bold text-[#2563EB] bg-[#EAF2FF] px-2.5 py-1 rounded-lg">Avg: 38ms</span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={latencyHistory}>
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748B' }} stroke="#E2E8F0" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} stroke="#E2E8F0" />
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
              <Line type="monotone" dataKey="ms" stroke="#8AB4F8" strokeWidth={3} dot={{ r: 3, fill: '#2563EB' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* NLP Fallback Event Log Table */}
      <div className="card p-6 bg-white border border-[#E2E8F0] shadow-sm rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#334155] flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" />
            NLP Fallback Event Log (BM25 Fallbacks)
          </h2>
          <span className="text-xs text-[#64748B] font-mono">2 Logged Incidents</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F4F8FF]/80 text-[#64748B] uppercase font-mono">
                <th className="p-3">Timestamp</th>
                <th className="p-3">Trigger Query / Event</th>
                <th className="p-3">Degradation Cause</th>
                <th className="p-3">Mitigation Action</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              <tr className="hover:bg-[#F4F8FF]/40 transition-colors">
                <td className="p-3 font-mono text-[#64748B]">2026-11-09 14:11:02</td>
                <td className="p-3 font-medium text-[#334155]">Single-cell RNA FASTQ Seurat Pipeline</td>
                <td className="p-3 text-amber-600">Qdrant HNSW socket read timeout (&gt; 500ms)</td>
                <td className="p-3 text-[#64748B]">BM25 BM25-Okapi keyword match fallback invoked</td>
                <td className="p-3 text-[#0F766E] font-bold">Resolved (38ms)</td>
              </tr>
              <tr className="hover:bg-[#F4F8FF]/40 transition-colors">
                <td className="p-3 font-mono text-[#64748B]">2026-11-06 09:30:19</td>
                <td className="p-3 font-medium text-[#334155]">FPGA Zynq CNN Quantization Inference</td>
                <td className="p-3 text-amber-600">Vector node garbage collection pause</td>
                <td className="p-3 text-[#64748B]">BM25 fallback served to client with warning flag</td>
                <td className="p-3 text-[#0F766E] font-bold">Resolved (44ms)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* MFA-Protected Admin Area */}
      <div className="card p-6 border border-[#E2E8F0] bg-white shadow-sm rounded-3xl space-y-4">
        <div className="flex items-center gap-2">
          <Lock size={18} className="text-[#8AB4F8]" />
          <h2 className="text-base font-bold text-[#334155]">
            MFA-Protected Administrative Operations
          </h2>
        </div>

        {!mfaUnlocked ? (
          <form onSubmit={handleUnlockMfa} className="p-4 bg-[#F4F8FF] rounded-2xl border border-[#E2E8F0] max-w-md space-y-3">
            <p className="text-xs text-[#64748B] leading-relaxed">
              Destructive cluster commands (Database Flush, Vector Store Purge, System Freeze) require hardware TOTP token re-authentication.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter 6-digit TOTP (Demo: 123456)"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                className="input text-xs font-mono border-[#E2E8F0] bg-white text-[#334155]"
                maxLength={6}
                required
              />
              <button type="submit" className="btn-primary text-xs shrink-0 font-semibold px-4 py-2">
                Unlock Operations
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 bg-[#A7E8D0]/20 border border-[#A7E8D0]/60 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-[#0F766E] text-xs font-bold">
              <CheckCircle2 size={16} /> Authenticated via TOTP Hardware Key
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => toast.success('Vector database snapshot taken.')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#334155] bg-white hover:bg-[#F4F8FF] border border-[#E2E8F0] transition-colors"
              >
                Snapshot Qdrant Vectors
              </button>
              <button
                onClick={() => toast.success('Celery job queue purged.')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#334155] bg-white hover:bg-[#F4F8FF] border border-[#E2E8F0] transition-colors"
              >
                Purge Ingest Queues
              </button>
              <button
                onClick={() => setMfaUnlocked(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#64748B] bg-white hover:bg-[#F4F8FF] border border-[#E2E8F0] transition-colors"
              >
                Lock Session
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemHealth;

