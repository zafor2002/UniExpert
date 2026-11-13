import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GitCompare, ArrowLeft, Star, BookOpen, Clock, Users, CheckCircle2, XCircle, Send, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useApp } from '../../context/AppContext';
import ScoreRing from '../../components/shared/ScoreRing';
import SkillChip from '../../components/shared/SkillChip';

export const ExpertComparison: React.FC = () => {
  const navigate = useNavigate();
  const { compareList, experts, removeFromCompare, clearCompare } = useApp();

  const selectedExperts = experts.filter((e) => compareList.includes(e.id));

  const MATCH_SCORES: Record<string, number> = {
    'exp-1': 94,
    'exp-2': 71,
    'exp-3': 82,
    'exp-4': 65,
    'exp-5': 58,
  };

  const MATCHED_SKILLS: Record<string, string[]> = {
    'exp-1': ['BLE 5.0', 'C/C++ Embedded', 'CNN', 'AES-GCM', 'ARM Cortex-M4', 'MQTT'],
    'exp-2': ['Bioinformatics Pipelines', 'Python', 'GNN'],
    'exp-3': ['CNN', 'TensorFlow', 'PyTorch'],
    'exp-4': ['Docker', 'Kubernetes', 'CI/CD'],
    'exp-5': ['Agile', 'UML', 'Requirements Engineering'],
  };

  const MISSING_SKILLS: Record<string, string[]> = {
    'exp-1': ['IEC 62304 Medical SW'],
    'exp-2': ['BLE 5.0', 'ARM Cortex-M4', 'AES-GCM'],
    'exp-3': ['BLE 5.0', 'Hardware Dev', 'MQTT'],
    'exp-4': ['TinyML', 'Embedded C/C++', 'ECG Biosignals'],
    'exp-5': ['TinyML', 'BLE 5.0', 'Embedded Hardware'],
  };

  if (selectedExperts.length < 2) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#EAF2FF] border border-[#E2E8F0] text-[#334155] flex items-center justify-center mx-auto">
          <GitCompare size={32} />
        </div>
        <h2 className="text-xl font-bold text-[#1E293B]">Comparative Matrix Requires Candidates</h2>
        <p className="text-sm text-[#64748B] max-w-md mx-auto">
          Please select between 2 and 3 faculty or industry mentors from the discovery catalog to perform deep differential feature benchmarking.
        </p>
        <button
          onClick={() => navigate('/student/discovery')}
          className="btn-primary inline-flex text-xs px-5 py-2.5 rounded-xl"
        >
          Return to Discovery Catalog
        </button>
      </div>
    );
  }

  // Helper to determine differential highlight
  const isScoreDifferent = selectedExperts.some((e, _, arr) => (MATCH_SCORES[e.id] || 0) !== (MATCH_SCORES[arr[0].id] || 0));

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Top action header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/student/discovery')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#1E293B] bg-white px-3 py-1.5 rounded-xl border border-[#E2E8F0] transition-colors"
        >
          <ArrowLeft size={16} /> Back to Advisor Discovery
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#64748B] font-medium">Comparing {selectedExperts.length} of 3 Candidates</span>
          <button
            onClick={clearCompare}
            className="text-xs text-red-600 font-semibold hover:underline flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-[#E2E8F0]"
          >
            <X size={14} /> Clear Matrix
          </button>
        </div>
      </div>

      {/* Main Comparison Table Card */}
      <div className="card overflow-x-auto shadow-sm bg-white border border-[#E2E8F0] rounded-3xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F4F8FF]">
              <th className="p-4 w-48 text-xs font-bold text-[#64748B] uppercase tracking-wider">
                Evaluation Criterion
              </th>
              {selectedExperts.map((exp) => (
                <th key={exp.id} className="p-4 min-w-[280px]">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#1E293B]">{exp.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-[#EAF2FF] text-[#1E293B] border border-[#8AB4F8]/50">
                          Tier {exp.tier}
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B]">{exp.title} · {exp.department}</p>
                    </div>
                    <button
                      onClick={() => removeFromCompare(exp.id)}
                      className="text-[#64748B] hover:text-[#1E293B] p-1 rounded-lg hover:bg-[#EAF2FF]"
                      title="Remove candidate"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E2E8F0] text-xs">
            {/* Match Score Row (Highlighted differential) */}
            <tr className={isScoreDifferent ? 'bg-amber-50/50' : ''}>
              <td className="p-4 font-bold text-[#1E293B]">
                AI Match Score
                <span className="block text-[10px] font-normal text-[#64748B]">Hybrid NLP Vector Fit</span>
              </td>
              {selectedExperts.map((exp) => {
                const score = MATCH_SCORES[exp.id] || 60;
                const isHighest = score === Math.max(...selectedExperts.map((e) => MATCH_SCORES[e.id] || 0));
                return (
                  <td key={exp.id} className="p-4">
                    <div className="flex items-center gap-3">
                      <ScoreRing score={score} size={48} strokeWidth={5} />
                      <div>
                        <span className="text-base font-bold text-[#1E293B]">{score}%</span>
                        {isHighest && (
                          <span className="inline-block mt-0.5 text-[10px] font-semibold text-[#1E293B] bg-[#A7E8D0]/40 px-2 py-0.5 rounded-full border border-[#A7E8D0]">
                            ★ Top Match
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Matched Skills */}
            <tr>
              <td className="p-4 font-bold text-[#1E293B]">
                Matched Technical Skills
                <span className="block text-[10px] font-normal text-[#64748B]">Prerequisites Addressed</span>
              </td>
              {selectedExperts.map((exp) => (
                <td key={exp.id} className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {(MATCHED_SKILLS[exp.id] || []).length > 0 ? (
                      MATCHED_SKILLS[exp.id].map((s) => (
                        <SkillChip key={s} skill={s} variant="matched" />
                      ))
                    ) : (
                      <span className="text-[#64748B] italic">No direct keyword overlap</span>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* Missing Skills */}
            <tr>
              <td className="p-4 font-bold text-[#1E293B]">
                Skill Deficits (ΔK)
                <span className="block text-[10px] font-normal text-[#64748B]">Uncovered Requirements</span>
              </td>
              {selectedExperts.map((exp) => (
                <td key={exp.id} className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {(MISSING_SKILLS[exp.id] || []).map((s) => (
                      <SkillChip key={s} skill={s} variant="missing" />
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Total Citations */}
            <tr className="bg-[#F4F8FF]/50">
              <td className="p-4 font-bold text-[#1E293B]">
                Academic Citations
                <span className="block text-[10px] font-normal text-[#64748B]">Total Scored Citations</span>
              </td>
              {selectedExperts.map((exp) => {
                const cits = exp.publications.reduce((sum, p) => sum + p.citations, 0) || (exp.isIndustry ? 0 : 73);
                return (
                  <td key={exp.id} className="p-4 font-semibold text-[#1E293B]">
                    {cits} Citations
                  </td>
                );
              })}
            </tr>

            {/* h-Index */}
            <tr>
              <td className="p-4 font-bold text-[#1E293B]">
                h-Index
                <span className="block text-[10px] font-normal text-[#64748B]">Productivity & Impact</span>
              </td>
              {selectedExperts.map((exp) => (
                <td key={exp.id} className="p-4 font-mono font-bold text-[#1E293B]">
                  h={exp.hIndex || 0}
                </td>
              ))}
            </tr>

            {/* Recent Publications (3 Years) */}
            <tr className="bg-[#F4F8FF]/50">
              <td className="p-4 font-bold text-[#1E293B]">
                Recent Pubs (Last 3 Yrs)
                <span className="block text-[10px] font-normal text-[#64748B]">2023 - 2026 Volume</span>
              </td>
              {selectedExperts.map((exp) => (
                <td key={exp.id} className="p-4 font-semibold text-[#1E293B]">
                  {exp.publications.filter((p) => p.year >= 2023).length} Indexed Papers
                </td>
              ))}
            </tr>

            {/* Supervisory Capacity */}
            <tr>
              <td className="p-4 font-bold text-[#1E293B]">
                Supervisory Capacity
                <span className="block text-[10px] font-normal text-[#64748B]">Anti-Burnout Quota</span>
              </td>
              {selectedExperts.map((exp) => {
                const isFull = exp.quotaStatus === 'full';
                return (
                  <td key={exp.id} className="p-4">
                    <span className={`inline-flex items-center gap-1 font-semibold px-2.5 py-0.5 rounded-full text-xs ${
                      isFull ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-[#A7E8D0]/30 text-[#1E293B] border border-[#A7E8D0]'
                    }`}>
                      {exp.slotsUsed} of {exp.slotsTotal} Slots Used {isFull ? '(FULL)' : ''}
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Office Hours Availability */}
            <tr className="bg-[#F4F8FF]/50">
              <td className="p-4 font-bold text-[#1E293B]">
                Office Hours
                <span className="block text-[10px] font-normal text-[#64748B]">Regular Consultation Days</span>
              </td>
              {selectedExperts.map((exp) => (
                <td key={exp.id} className="p-4 text-[#334155]">
                  {exp.officeHours.length > 0 ? (
                    exp.officeHours.slice(0, 2).map((oh) => `${oh.day} (${oh.startTime})`).join(', ')
                  ) : (
                    <span className="text-[#64748B] italic">By Appointment</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Average Rating */}
            <tr>
              <td className="p-4 font-bold text-[#1E293B]">
                Student Satisfaction
                <span className="block text-[10px] font-normal text-[#64748B]">Historical Rubric Score</span>
              </td>
              {selectedExperts.map((exp) => (
                <td key={exp.id} className="p-4">
                  <div className="flex items-center gap-1 font-bold text-[#1E293B]">
                    <Star size={14} className="text-amber-500 fill-amber-500" />
                    {exp.rating} / 5.0
                  </div>
                </td>
              ))}
            </tr>

            {/* Bottom Actions */}
            <tr className="bg-[#F4F8FF]">
              <td className="p-4 font-bold text-[#64748B]">Action Decision</td>
              {selectedExperts.map((exp) => {
                const isFull = exp.quotaStatus === 'full';
                return (
                  <td key={exp.id} className="p-4">
                    <button
                      disabled={isFull}
                      onClick={() => navigate(`/student/proposal-modal?expertId=${exp.id}`)}
                      className={`btn-primary w-full text-xs justify-center py-2.5 rounded-xl ${
                        isFull ? 'bg-slate-100 text-slate-400 border border-[#E2E8F0] cursor-not-allowed pointer-events-none' : ''
                      }`}
                    >
                      <Send size={13} />
                      {isFull ? 'Quota Full' : 'Send Proposal'}
                    </button>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpertComparison;

