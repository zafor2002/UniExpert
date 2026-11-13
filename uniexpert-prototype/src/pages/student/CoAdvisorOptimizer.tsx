import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, AlertTriangle, User, Info, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import toast from 'react-hot-toast';
import { mockExperts } from '../../data/mockData';

const drTanvir = mockExperts.find(e => e.id === 'exp-2')!;
const engSakib = mockExperts.find(e => e.id === 'exp-4')!;

const chartData = [
  { name: 'Without Dr. Tanvir', coverage: 40 },
  { name: 'With Dr. Tanvir', coverage: 92 },
];

export default function CoAdvisorOptimizer() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handlePropose = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitting(false);
    setModalOpen(false);
    toast.success('Co-advisory proposal sent to Dr. Tanvir Ahmed.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1E293B]">Co-Advisor Optimizer</h1>
        <p className="text-sm text-[#64748B] mt-0.5">
          Set-cover optimization to maximize team skill coverage with minimal supervisory overhead
        </p>
      </div>

      {/* Current State Info */}
      <div className="card p-4 bg-amber-50 border border-amber-200 rounded-2xl">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-bold text-amber-900 text-sm">Current Coverage: 40%</p>
            <p className="text-xs text-amber-800 mt-1">
              BioShield AI project — Your team (Abu Zafor + Anamul) + primary advisor covers 40% of required bioinformatics skills.
              The optimizer identified 1 optimal co-advisor to maximize coverage.
            </p>
          </div>
        </div>
      </div>

      {/* Primary Recommendation */}
      <div className="card p-6 bg-white border-2 border-[#8AB4F8]/70 rounded-3xl shadow-sm relative pt-6">
        <div className="absolute -top-3 left-6">
          <span className="bg-[#8AB4F8] text-[#1E293B] text-xs font-bold px-3.5 py-1 rounded-full shadow-sm">
            ✦ Optimal Co-Advisor Match
          </span>
        </div>
        <div className="pt-2 space-y-4">
          {/* Advisor header */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#EAF2FF] border border-[#8AB4F8]/50 flex items-center justify-center text-[#1E293B] font-bold text-xl flex-shrink-0">
              {drTanvir.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-[#1E293B] text-lg">{drTanvir.name}</h2>
              <p className="text-sm text-[#64748B]">{drTanvir.title} · {drTanvir.department}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-[#EAF2FF] text-[#1E293B] border border-[#8AB4F8]/40 px-2.5 py-0.5 rounded-full font-semibold">
                  h-index {drTanvir.hIndex}
                </span>
                <span className="text-xs bg-[#A7E8D0]/30 text-[#1E293B] border border-[#A7E8D0] px-2.5 py-0.5 rounded-full font-semibold">
                  {drTanvir.rating} ★
                </span>
              </div>
            </div>
          </div>

          {/* Impact statement */}
          <div className="bg-[#F4F8FF] border border-[#E2E8F0] rounded-2xl p-4">
            <p className="text-sm text-[#334155]">
              <span className="font-semibold text-[#1E293B]">Adding Dr. Tanvir Ahmed (Bioinformatics) increases team coverage from </span>
              <span className="text-red-600 font-bold">40%</span>
              <span className="font-semibold text-[#1E293B]"> to </span>
              <span className="text-emerald-700 font-bold">92%</span>
            </p>
          </div>

          {/* Skills this advisor brings */}
          <div>
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-2">
              Skills this advisor contributes:
            </p>
            <div className="flex flex-wrap gap-2">
              {['scRNA-seq', 'Genomic Annotation', 'Bioinformatics Pipelines', 'Nextflow', 'GNN', 'CRISPR Analysis'].map(skill => (
                <span key={skill} className="skill-chip-matched">{skill}</span>
              ))}
            </div>
          </div>

          {/* Before / After coverage bar */}
          <div>
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-3">
              Coverage Before → After
            </p>
            <div className="flex items-center gap-3">
              {/* Before */}
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#64748B]">Without Co-Advisor</span>
                  <span className="font-bold text-red-600">40%</span>
                </div>
                <div className="h-3 bg-[#F4F8FF] border border-[#E2E8F0] rounded-full overflow-hidden">
                  <div className="h-full bg-red-400 rounded-full" style={{ width: '40%' }} />
                </div>
              </div>
              <ArrowRight size={18} className="text-[#8AB4F8] flex-shrink-0" />
              {/* After */}
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#64748B]">With Dr. Tanvir</span>
                  <span className="font-bold text-emerald-700">92%</span>
                </div>
                <div className="h-3 bg-[#F4F8FF] border border-[#E2E8F0] rounded-full overflow-hidden">
                  <div className="h-full bg-[#A7E8D0] rounded-full transition-all duration-1000" style={{ width: '92%' }} />
                </div>
              </div>
            </div>
            <p className="text-xs text-[#64748B] mt-2.5">
              Remaining gap after adding Dr. Tanvir: <span className="skill-chip-missing">CRISPR Analysis</span>
            </p>
          </div>

          {/* Action button */}
          <button
            onClick={() => setModalOpen(true)}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold shadow-sm"
          >
            <User size={16} />
            Propose Co-Advisory Collaboration
          </button>
        </div>
      </div>

      {/* Simulation Chart */}
      <div className="card p-6 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
        <h2 className="text-base font-bold text-[#1E293B] mb-4">Coverage Simulation</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 12, fill: '#64748b' }} />
            <Tooltip formatter={(value: any) => [`${value}%`, 'Coverage']} />
            <Bar dataKey="coverage" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? '#F87171' : '#A7E8D0'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-6 mt-3 text-xs text-[#64748B]">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-400 inline-block" />Without Dr. Tanvir (40%)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#A7E8D0] inline-block border border-emerald-400" />With Dr. Tanvir (92%)</span>
        </div>
      </div>

      {/* Not Recommended card */}
      <div className="card p-4 bg-[#F4F8FF] border border-dashed border-[#E2E8F0] rounded-2xl">
        <div className="flex items-start gap-3">
          <Info className="text-[#64748B] flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm font-semibold text-[#1E293B]">
              {engSakib.name} (Cloud DevOps)
            </p>
            <p className="text-xs text-[#64748B] mt-0.5">
              Adding Engr. Sakib (Cloud DevOps) adds <strong>0% biological coverage</strong> — not recommended for this gap.
              His skills (AWS, Kubernetes, Docker) don't overlap with the BioShield AI requirements.
            </p>
          </div>
        </div>
      </div>

      {/* Proposal Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#1E293B]">Confirm Co-Advisory Proposal</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#64748B] hover:text-[#1E293B] p-1 rounded-lg hover:bg-[#F4F8FF]"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3 mb-6">
              <p className="text-sm text-[#64748B]">
                You are proposing a co-advisory collaboration with:
              </p>
              <div className="bg-[#F4F8FF] border border-[#E2E8F0] rounded-2xl p-3.5">
                <p className="font-bold text-[#1E293B]">{drTanvir.name}</p>
                <p className="text-sm text-[#64748B]">{drTanvir.title} · {drTanvir.department}</p>
              </div>
              <div className="flex items-start gap-2.5 bg-[#EAF2FF] border border-[#E2E8F0] rounded-2xl p-3.5">
                <CheckCircle size={16} className="text-[#8AB4F8] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-[#334155]">
                  This proposal will be sent for review. Dr. Tanvir Ahmed will have 7 days to respond.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 btn-secondary py-2.5 rounded-xl"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handlePropose}
                className="flex-1 btn-primary flex items-center justify-center gap-2 py-2.5 rounded-xl"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#1E293B] border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : 'Send Proposal'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigate to full proposal */}
      <div className="flex justify-between items-center pt-2">
        <button
          onClick={() => navigate('/student/skill-gap')}
          className="text-sm font-semibold text-[#334155] hover:text-[#1E293B] hover:underline"
        >
          ← Back to Skill Gap Analysis
        </button>
        <button
          onClick={() => navigate('/student/proposal')}
          className="btn-secondary text-sm px-4 py-2 rounded-xl"
        >
          Go to Full Proposal Composer →
        </button>
      </div>
    </div>
  );
}
