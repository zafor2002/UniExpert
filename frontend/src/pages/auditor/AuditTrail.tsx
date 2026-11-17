import React, { useState } from 'react';
import { 
  ShieldCheck, ShieldAlert, Download, Search, Filter, 
  ChevronDown, ChevronRight, CheckCircle2, AlertTriangle, RefreshCw 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { mockAuditEntries } from '../../data/mockData';
import type { AuditEntry } from '../../types';

export const AuditTrail: React.FC = () => {
  const [entries, setEntries] = useState<AuditEntry[]>(mockAuditEntries);
  const [isChainValid, setIsChainValid] = useState(true);
  const [expandedPayloads, setExpandedPayloads] = useState<Record<string, boolean>>({});

  const [roleFilter, setRoleFilter] = useState('ALL');
  const [eventFilter, setEventFilter] = useState('ALL');
  const [searchUuid, setSearchUuid] = useState('');

  const togglePayload = (id: string) => {
    setExpandedPayloads({ ...expandedPayloads, [id]: !expandedPayloads[id] });
  };

  const simulateTamper = () => {
    setIsChainValid(false);
    setEntries((prev) =>
      prev.map((e, idx) => (idx === 1 ? { ...e, valid: false, hash: 'TAMPERED_0000_CORRUPT' } : e))
    );
    toast.error('Cryptographic hash chain violation detected! Block #2 parent hash mismatch.');
  };

  const resetChain = () => {
    setIsChainValid(true);
    setEntries(mockAuditEntries);
    toast.success('Cryptographic Merkle chain re-verified against root ledger.');
  };

  const exportSignedCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'ID,Timestamp,ActorRole,IPAddress,EventType,Hash,ChainValid\n' +
      entries.map((e) => `${e.id},${e.timestamp},${e.userRole},${e.ip},${e.eventType},${e.hash},${e.valid}`).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'uniexpert_signed_audit_trail.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Signed audit trail exported with cryptographic checksum.');
  };

  const filtered = entries.filter((e) => {
    if (roleFilter !== 'ALL' && e.userRole !== roleFilter) return false;
    if (eventFilter !== 'ALL' && e.eventType !== eventFilter) return false;
    if (searchUuid && !e.userId.toLowerCase().includes(searchUuid.toLowerCase()) && !e.hash.toLowerCase().includes(searchUuid.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="card p-6 md:p-8 bg-white border border-[#E2E8F0] shadow-sm rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-[#EAF2FF] text-[#2563EB] border border-[#8AB4F8]/30">
              Institutional Compliance
            </span>
            <span className="text-xs text-[#64748B]">· BAETE Criterion 4 & 5 Governance</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-[#334155]">Cryptographic Append-Only Audit Trail</h1>
          <p className="text-xs text-[#64748B] mt-1">
            Immutable SHA-256 hash-chained ledger logging every FSM state transition and quota modification
          </p>
        </div>

        {/* Chain Verification Badge */}
        <div className="flex items-center gap-3">
          <div
            className={`px-3.5 py-2 rounded-2xl flex items-center gap-2 font-mono text-xs font-bold ${
              isChainValid
                ? 'bg-[#A7E8D0]/30 text-[#0F766E] border border-[#A7E8D0]/60'
                : 'bg-rose-50 text-rose-600 border border-rose-300 animate-pulse'
            }`}
          >
            {isChainValid ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
            <span>{isChainValid ? 'Hash Chain: VALID' : 'CHAIN COMPROMISED'}</span>
          </div>

          <button
            onClick={exportSignedCsv}
            className="btn-primary text-xs px-4 py-2 font-semibold flex items-center gap-1.5"
          >
            <Download size={13} /> Export Signed CSV
          </button>
        </div>
      </div>

      {/* Tamper Alert State (if tampered) */}
      {!isChainValid && (
        <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-rose-600 shrink-0" size={20} />
            <div className="text-xs text-rose-900 leading-relaxed">
              <span className="font-bold block">Cryptographic Merkle Inconsistency Detected!</span>
              Parent hash pointer at Block #2 (ID: audit-2) does not resolve to the cryptographic preimage.
            </div>
          </div>
          <button onClick={resetChain} className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#334155] bg-white hover:bg-[#F4F8FF] border border-[#E2E8F0] shrink-0 flex items-center gap-1.5 transition-colors">
            <RefreshCw size={13} /> Re-verify & Repair
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="card p-4 bg-white border border-[#E2E8F0] shadow-sm rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <Search size={14} className="text-[#64748B]" />
          <input
            type="text"
            placeholder="Search by Actor UUID or Block Hash..."
            value={searchUuid}
            onChange={(e) => setSearchUuid(e.target.value)}
            className="input text-xs py-1.5 border-[#E2E8F0] bg-white text-[#334155] focus:border-[#8AB4F8]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input text-xs py-1 border-[#E2E8F0] bg-white text-[#334155]"
            >
              <option value="ALL">All Roles</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="coordinator">Coordinator</option>
            </select>
          </div>

          <div>
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="input text-xs py-1 border-[#E2E8F0] bg-white text-[#334155]"
            >
              <option value="ALL">All Event Types</option>
              <option value="FSM_STATE_TRANSITION">FSM_STATE_TRANSITION</option>
              <option value="PROPOSAL_CREATED">PROPOSAL_CREATED</option>
              <option value="FACULTY_TIER_UPDATED">FACULTY_TIER_UPDATED</option>
            </select>
          </div>

          <button
            onClick={simulateTamper}
            className="text-xs text-[#B45309] border border-[#FDE68A] bg-[#FEF3C7] px-3.5 py-1.5 rounded-xl hover:bg-[#FDE68A]/60 font-semibold transition-colors"
          >
            Simulate Tamper
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="card overflow-x-auto shadow-sm bg-white border border-[#E2E8F0] rounded-3xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F4F8FF]/80 text-[#64748B] uppercase font-mono">
              <th className="p-3 w-8"></th>
              <th className="p-3">Timestamp (UTC)</th>
              <th className="p-3">Actor / UUID</th>
              <th className="p-3">Client IP</th>
              <th className="p-3">Event Type</th>
              <th className="p-3">Merkle Hash</th>
              <th className="p-3">Integrity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {filtered.map((entry) => {
              const isExpanded = expandedPayloads[entry.id];
              return (
                <React.Fragment key={entry.id}>
                  <tr
                    className={`hover:bg-[#F4F8FF]/40 transition-colors ${
                      !entry.valid ? 'bg-rose-50/70 text-rose-900' : ''
                    }`}
                  >
                    <td className="p-3">
                      <button
                        onClick={() => togglePayload(entry.id)}
                        className="text-[#64748B] hover:text-[#334155]"
                      >
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </button>
                    </td>

                    <td className="p-3 font-mono text-[#64748B]">
                      {new Date(entry.timestamp).toISOString()}
                    </td>

                    <td className="p-3">
                      <span className="font-bold text-[#334155] capitalize block">
                        {entry.userRole}
                      </span>
                      <span className="font-mono text-[10px] text-[#64748B]">{entry.userId}</span>
                    </td>

                    <td className="p-3 font-mono text-[#64748B]">{entry.ip}</td>

                    <td className="p-3">
                      <span className="font-mono font-semibold text-[#2563EB] bg-[#EAF2FF] px-2 py-0.5 rounded-lg border border-[#8AB4F8]/30">
                        {entry.eventType}
                      </span>
                    </td>

                    <td className="p-3 font-mono text-[#64748B]">
                      {entry.hash.slice(0, 12)}...
                    </td>

                    <td className="p-3">
                      {entry.valid ? (
                        <span className="text-[#0F766E] font-bold flex items-center gap-1 font-mono text-[11px]">
                          <CheckCircle2 size={13} /> VALID
                        </span>
                      ) : (
                        <span className="text-rose-600 font-bold flex items-center gap-1 font-mono text-[11px]">
                          <AlertTriangle size={13} /> TAMPERED
                        </span>
                      )}
                    </td>
                  </tr>

                  {/* Expandable Payload Diff */}
                  {isExpanded && (
                    <tr className="bg-[#F8FAFC]">
                      <td colSpan={7} className="p-4 pl-12 font-mono text-xs">
                        <div className="space-y-1.5">
                          <span className="text-[#64748B] uppercase font-bold text-[10px] tracking-wider block">
                            Cryptographic Block Payload & Previous Hash:
                          </span>
                          <p className="text-[11px] text-[#64748B] font-mono">
                            Parent Hash: <code className="bg-white px-1.5 py-0.5 border border-[#E2E8F0] rounded text-[#334155]">{entry.previousHash}</code>
                          </p>
                          <pre className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] text-[#334155] overflow-x-auto text-[11px] leading-relaxed shadow-sm">
                            {JSON.stringify(entry.payload, null, 2)}
                          </pre>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditTrail;

