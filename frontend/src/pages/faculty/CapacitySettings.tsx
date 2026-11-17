import React, { useState } from 'react';
import { Shield, Plus, Trash2, Calendar, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useApp } from '../../context/AppContext';

export const CapacitySettings: React.FC = () => {
  const { experts } = useApp();
  const faculty = experts[0];

  const [quota, setQuota] = useState(5);
  const [blackouts, setBlackouts] = useState<{ id: string; start: string; end: string; reason: string }[]>([
    { id: 'b1', start: '2026-11-24', end: '2026-11-28', reason: 'IEEE GLOBECOM Conference' },
  ]);
  const [newStart, setNewStart] = useState('');
  const [newEnd, setNewEnd] = useState('');
  const [newReason, setNewReason] = useState('');

  const handleQuotaChange = (delta: number) => {
    const next = quota + delta;
    if (next < 1 || next > 10) {
      toast.error('Quota must be between 1 and 10.');
      return;
    }
    if (next < faculty.slotsUsed) {
      toast.error(`Cannot reduce below active groups (${faculty.slotsUsed}).`);
      return;
    }
    setQuota(next);
  };

  const handleAddBlackout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStart || !newEnd || !newReason.trim()) {
      toast.error('All fields are required.');
      return;
    }
    setBlackouts([...blackouts, { id: `b-${Date.now()}`, start: newStart, end: newEnd, reason: newReason.trim() }]);
    setNewStart(''); setNewEnd(''); setNewReason('');
    toast.success('Blackout added.');
  };

  const handleRemoveBlackout = (id: string) => setBlackouts(blackouts.filter((b) => b.id !== id));
  const handleSave = () => toast.success('Settings saved.');

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-24">
      {/* Page Header */}
      <div>
        <h1 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
          <Shield className="text-[#4D90F0]" size={20} />
          Capacity & Quota
        </h1>
        <p className="text-xs text-[#334155] mt-0.5">
          Cap student teams to maintain mentorship quality
        </p>
      </div>

      {/* Quota Stepper */}
      <div className="bg-white border border-[#CBD5E1] rounded-2xl shadow-sm p-5 md:p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#0F172A]">Max Supervisory Quota</h2>
            <p className="text-xs text-[#334155] mt-0.5">1–10 capstone groups per semester</p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#DDE8FA] text-[#1E3A8A] border border-[#93C5FD] font-mono">
            {faculty.slotsUsed} active
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center border border-[#CBD5E1] rounded-2xl overflow-hidden bg-white shadow-2xs">
            <button
              type="button"
              onClick={() => handleQuotaChange(-1)}
              className="px-4 py-2.5 text-base font-bold hover:bg-[#EDF2FB] text-[#0F172A] transition-colors"
            >
              −
            </button>
            <div className="px-6 py-2.5 font-black text-xl text-[#0F172A] font-mono border-x border-[#CBD5E1]">
              {quota}
            </div>
            <button
              type="button"
              onClick={() => handleQuotaChange(1)}
              className="px-4 py-2.5 text-base font-bold hover:bg-[#EDF2FB] text-[#0F172A] transition-colors"
            >
              +
            </button>
          </div>
          <span className="text-xs text-[#334155] font-medium">
            Max groups · Fall 2026
          </span>
        </div>

        {/* Availability Preview */}
        <div>
          <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider block mb-2">
            Availability State
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className={`p-3 rounded-xl border ${quota - faculty.slotsUsed >= 2 ? 'border-[#6EE7B7] bg-[#BBFBDE]/50 ring-2 ring-[#6EE7B7]/40' : 'border-[#CBD5E1] bg-[#F8FAFC]'}`}>
              <div className="flex items-center gap-1.5 font-bold text-[#065F46]">
                <CheckCircle2 size={13} /> Available
              </div>
              <span className="text-[10px] text-[#334155] block mt-1">≥ 2 slots open</span>
            </div>

            <div className={`p-3 rounded-xl border ${quota - faculty.slotsUsed === 1 ? 'border-amber-400 bg-amber-50 ring-2 ring-amber-400/20' : 'border-[#CBD5E1] bg-[#F8FAFC]'}`}>
              <div className="flex items-center gap-1.5 font-bold text-amber-800">
                <AlertTriangle size={13} /> Near Quota
              </div>
              <span className="text-[10px] text-[#334155] block mt-1">1 slot left</span>
            </div>

            <div className={`p-3 rounded-xl border ${quota - faculty.slotsUsed === 0 ? 'border-red-400 bg-red-50 ring-2 ring-red-400/20' : 'border-[#CBD5E1] bg-[#F8FAFC]'}`}>
              <div className="flex items-center gap-1.5 font-bold text-red-700">
                <AlertCircle size={13} /> Full
              </div>
              <span className="text-[10px] text-[#334155] block mt-1">No slots (greyed)</span>
            </div>

            <div className="p-3 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC]">
              <div className="flex items-center gap-1.5 font-bold text-[#334155]">
                <Calendar size={13} /> Blackout
              </div>
              <span className="text-[10px] text-[#334155] block mt-1">Leave / sabbatical</span>
            </div>
          </div>
        </div>
      </div>

      {/* Blackout Periods */}
      <div className="bg-white border border-[#CBD5E1] rounded-2xl shadow-sm p-5 md:p-6 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
            <Calendar size={16} className="text-[#4D90F0]" />
            Blackout Periods
          </h2>
          <p className="text-xs text-[#334155] mt-0.5">
            Cards show consultation freeze during these dates
          </p>
        </div>

        <form onSubmit={handleAddBlackout} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="date"
            value={newStart}
            onChange={(e) => setNewStart(e.target.value)}
            className="input text-xs font-mono"
            required
          />
          <input
            type="date"
            value={newEnd}
            onChange={(e) => setNewEnd(e.target.value)}
            className="input text-xs font-mono"
            required
          />
          <input
            type="text"
            placeholder="Reason (e.g. Conference)"
            value={newReason}
            onChange={(e) => setNewReason(e.target.value)}
            className="input text-xs"
            required
          />
          <button type="submit" className="btn-secondary text-xs justify-center py-2.5 rounded-xl">
            <Plus size={13} /> Add
          </button>
        </form>

        <div className="space-y-2">
          {blackouts.map((b) => (
            <div
              key={b.id}
              className="p-3 rounded-xl border border-[#CBD5E1] bg-[#EDF2FB] flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-[#0F172A]">
                  {b.start} → {b.end}
                </span>
                <span className="text-[#334155]">{b.reason}</span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveBlackout(b.id)}
                className="text-[#334155] hover:text-red-600 p-1 rounded-lg hover:bg-white transition-colors"
                title="Remove"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} className="btn-primary text-xs px-5 py-2.5 font-bold rounded-xl">
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default CapacitySettings;
