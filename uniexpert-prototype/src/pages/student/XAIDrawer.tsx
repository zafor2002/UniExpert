import React from 'react';
import { X, Award, Cpu, BookOpen, Layers, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { useApp } from '../../context/AppContext';
import ScoreRing from '../../components/shared/ScoreRing';
import SkillChip from '../../components/shared/SkillChip';

interface XAIDrawerProps {
  expertId: string | null;
  onClose: () => void;
}

export const XAIDrawer: React.FC<XAIDrawerProps> = ({ expertId, onClose }) => {
  const { experts } = useApp();

  if (!expertId) return null;

  const expert = experts.find((e) => e.id === expertId);
  if (!expert) return null;

  const radarData = [
    { subject: 'Embedded AI', req: 95, exp: 92 },
    { subject: 'BLE & IoT', req: 85, exp: 90 },
    { subject: 'TinyML/CMSIS', req: 90, exp: 95 },
    { subject: 'Hardware Dev', req: 75, exp: 88 },
    { subject: 'Cloud & MQTT', req: 70, exp: 75 },
    { subject: 'Bio-Sensing', req: 80, exp: 65 },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/20 backdrop-blur-xs flex justify-end transition-opacity">
      <div 
        className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-[#E2E8F0] animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-label="Explainable AI Match Breakdown"
      >
        {/* Header */}
        <div className="p-6 border-b border-[#E2E8F0] flex items-start justify-between bg-[#F4F8FF]">
          <div className="flex items-center gap-4">
            <div className="bg-white p-1 rounded-2xl border border-[#E2E8F0]">
              <ScoreRing score={expert.id === 'exp-1' ? 94 : expert.id === 'exp-3' ? 82 : 71} size={68} strokeWidth={6} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#1E293B]">{expert.name}</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-[#EAF2FF] text-[#1E293B] border border-[#8AB4F8]/50">
                  Tier {expert.tier} Verified
                </span>
              </div>
              <p className="text-sm text-[#64748B]">{expert.title} · {expert.department}</p>
              <p className="text-xs font-mono text-[#64748B] mt-0.5">XAI Diagnostic ID: #XAI-VEC-94021</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#64748B] hover:text-[#1E293B] hover:bg-white border border-transparent hover:border-[#E2E8F0] transition-colors"
            aria-label="Close drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Hint Variant Notice */}
          <div className="p-4 rounded-2xl bg-[#EAF2FF] border border-[#E2E8F0] flex items-start gap-3">
            <AlertCircle className="text-[#8AB4F8] shrink-0 mt-0.5" size={18} />
            <div className="text-xs text-[#334155] leading-relaxed">
              <span className="font-semibold text-[#1E293B] block mb-0.5">XAI Diagnostic Hint:</span>
              "Strong practical toolchain overlap; limited recent publication history in this exact domain."
            </div>
          </div>

          {/* 4-Part Hybrid Breakdown Formula (Sums to 100%) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider flex items-center gap-2">
                <Layers size={16} className="text-[#8AB4F8]" />
                Hybrid Mathematical Decomposition (100%)
              </h3>
              <span className="text-xs font-mono font-medium text-[#64748B]">S = Σ(w_i · S_i)</span>
            </div>

            {/* Stacked Progress Bar Bar Visual */}
            <div className="h-4 rounded-full overflow-hidden flex shadow-inner bg-[#E2E8F0]">
              <div style={{ width: '45%' }} className="bg-[#8AB4F8] h-full" title="Semantic Vector Similarity: 45%" />
              <div style={{ width: '30%' }} className="bg-[#A7E8D0] h-full" title="Skill Overlap: 30%" />
              <div style={{ width: '15%' }} className="bg-[#A5B4FC] h-full" title="Credential Tier: 15%" />
              <div style={{ width: '10%' }} className="bg-[#FDBA74] h-full" title="Supervisory Bandwidth: 10%" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#EAF2FF] border border-[#8AB4F8]/40">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8AB4F8] shrink-0" />
                <span className="font-medium text-[#1E293B]">Semantic Vector Sim: <strong>45%</strong></span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F0FDF4] border border-[#A7E8D0]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A7E8D0] shrink-0" />
                <span className="font-medium text-[#1E293B]">Skill Overlap: <strong>30%</strong></span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#EEF2FF] border border-[#A5B4FC]/40">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A5B4FC] shrink-0" />
                <span className="font-medium text-[#1E293B]">Credential Tier: <strong>15%</strong></span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FFF7ED] border border-orange-200">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FDBA74] shrink-0" />
                <span className="font-medium text-[#1E293B]">Supervisory Bandwidth: <strong>10%</strong></span>
              </div>
            </div>
          </div>

          {/* Semantic Vector Similarity Details (3 Matched Publications) */}
          <div className="p-5 rounded-2xl bg-[#F4F8FF] border border-[#E2E8F0] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1E293B] flex items-center gap-1.5">
                <BookOpen size={14} className="text-[#8AB4F8]" />
                45% Semantic Vector Similarity · Top 3 Matched Abstracts
              </span>
              <span className="text-xs text-[#1E293B] font-mono font-semibold">Qdrant HNSW Cosine = 0.941</span>
            </div>
            
            <div className="space-y-2.5">
              {expert.publications.slice(0, 3).map((pub, idx) => (
                <div key={pub.id} className="p-3 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-[#1E293B] line-clamp-1">
                      {idx + 1}. {pub.title}
                    </span>
                    <span className="text-[10px] shrink-0 font-mono px-2 py-0.5 rounded-full bg-[#F4F8FF] text-[#64748B] border border-[#E2E8F0]">
                      {pub.year}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-1.5 italic line-clamp-2">
                    "{pub.abstract || 'Demonstrated TinyML optimization on Cortex-M4 with real-time BLE latency constraints.'}"
                  </p>
                  <div className="flex items-center justify-between mt-2 text-[10px] text-[#64748B] font-medium">
                    <span>{pub.venue}</span>
                    <span>Citations: {pub.citations}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Radar Chart: Project Requirements vs Expert Proficiency */}
          <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm">
            <h4 className="text-xs font-bold text-[#1E293B] mb-2 flex items-center gap-1.5">
              <Cpu size={14} className="text-[#8AB4F8]" />
              Multi-Dimensional Alignment (Project vs Expert)
            </h4>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: '#94a3b8' }} />
                  <Radar name="Project Req" dataKey="req" stroke="#8AB4F8" fill="#8AB4F8" fillOpacity={0.25} />
                  <Radar name="Expert Level" dataKey="exp" stroke="#A5B4FC" fill="#A5B4FC" fillOpacity={0.35} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 text-xs mt-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#8AB4F8]" />
                <span className="text-[#64748B]">Required Competency</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#A5B4FC]" />
                <span className="text-[#64748B]">Expert Proficiency</span>
              </div>
            </div>
          </div>

          {/* 30% Skill Overlap Matrix */}
          <div className="p-5 rounded-2xl bg-[#F4F8FF] border border-[#E2E8F0] space-y-3">
            <h4 className="text-xs font-bold text-[#1E293B] flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" />
              30% Skill Overlap Matrix (6/8 Matched)
            </h4>
            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-[#1E293B] block mb-1.5">
                  ✓ Matched Technical Skills (In Expert Portfolio):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['BLE 5.0', 'C/C++ Embedded', 'CNN', 'AES-GCM', 'ARM Cortex-M4', 'MQTT'].map((s) => (
                    <SkillChip key={s} skill={s} variant="matched" />
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-[#64748B] block mb-1.5">
                  ○ Unaddressed by Expert (Potential Co-Advisor Needed):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['IEC 62304 Medical Standard', 'FreeRTOS Hard Real-Time'].map((s) => (
                    <SkillChip key={s} skill={s} variant="missing" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#E2E8F0] bg-[#F4F8FF] flex items-center justify-between">
          <span className="text-xs text-[#64748B]">Verified by DIU AI Registry</span>
          <button
            onClick={onClose}
            className="btn-primary text-xs py-2 px-5"
          >
            Done Reviewing
          </button>
        </div>
      </div>
    </div>
  );
};

export default XAIDrawer;

