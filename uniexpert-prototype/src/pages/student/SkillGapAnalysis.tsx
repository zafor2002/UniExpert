import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle, ChevronRight, ArrowRight } from 'lucide-react';
import ScoreRing from '../../components/shared/ScoreRing';
import SkillChip from '../../components/shared/SkillChip';

// BioShield scenario
const bioShieldScenario = {
  projectName: 'BioShield AI',
  teamReadiness: 25,
  required: ['scRNA-seq', 'Genomic Annotation', 'Bioinformatics Pipelines', 'Python/R', 'Nextflow', 'GNN', 'CRISPR Analysis'],
  teamSkills: ['Python', 'React', 'SQL', 'Docker', 'Machine Learning Basics'],
  covered: ['Python/R'],
  deficits: ['scRNA-seq', 'Genomic Annotation', 'Bioinformatics Pipelines', 'Nextflow', 'GNN', 'CRISPR Analysis'],
  coverageLabel: 'Team covers 2 of 7 required skills (28.6%)',
  coveragePct: 28.6,
  criticalBanner: 'Critical Domain Deficit Detected: 60% of biological prerequisites unaddressed',
};

// ECG scenario
const ecgScenario = {
  projectName: 'EdgeShield ECG Healthcare',
  teamReadiness: 100,
  required: ['TinyML', 'ARM Cortex-M4', 'C/C++ Embedded', 'BLE 5.0', 'AES-GCM', 'Python', 'MQTT'],
  teamSkills: ['Python', 'React', 'C/C++', 'BLE', 'MQTT', 'Machine Learning Basics'],
  covered: ['TinyML', 'ARM Cortex-M4', 'C/C++ Embedded', 'BLE 5.0', 'AES-GCM', 'Python', 'MQTT'],
  deficits: [],
  coverageLabel: 'Team covers 7 of 7 required skills (100%)',
  coveragePct: 100,
  successBanner: '100% Team Skill Coverage — No gaps detected!',
};

export default function SkillGapAnalysis() {
  const navigate = useNavigate();
  const [scenario, setScenario] = useState<'bioshield' | 'ecg'>('bioshield');

  const data = scenario === 'bioshield' ? bioShieldScenario : ecgScenario;
  const isBio = scenario === 'bioshield';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">Skill Gap Analysis</h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            Team readiness evaluation (ΔK = K<sub>req</sub> \ K<sub>team</sub>) for your capstone project
          </p>
        </div>
        {/* Toggle buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setScenario('bioshield')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              isBio
                ? 'bg-[#8AB4F8] text-[#1E293B] shadow-sm'
                : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#F4F8FF]'
            }`}
          >
            BioShield AI Project
          </button>
          <button
            onClick={() => setScenario('ecg')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              !isBio
                ? 'bg-[#8AB4F8] text-[#1E293B] shadow-sm'
                : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#F4F8FF]'
            }`}
          >
            ECG Healthcare Project
          </button>
        </div>
      </div>

      {/* Scenario banner */}
      {isBio ? (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
          <AlertTriangle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
          <div>
            <p className="font-semibold text-red-700 text-sm">{bioShieldScenario.criticalBanner}</p>
            <p className="text-xs text-red-600 mt-1">
              Your team lacks specialized bioinformatics expertise required for this project. Consider finding a co-advisor.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 p-4 bg-[#A7E8D0]/30 border border-[#A7E8D0] rounded-2xl">
          <CheckCircle className="text-emerald-700 mt-0.5 flex-shrink-0" size={20} />
          <p className="font-semibold text-[#1E293B] text-sm">{ecgScenario.successBanner}</p>
        </div>
      )}

      {/* Team Readiness Score */}
      <div className="card p-6 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
        <h2 className="text-lg font-bold text-[#1E293B] mb-4">Team Readiness Score (R<sub>team</sub>)</h2>
        <div className="flex items-center gap-8 flex-wrap">
          <div className="bg-[#F4F8FF] p-3 rounded-2xl border border-[#E2E8F0]">
            <ScoreRing
              score={data.teamReadiness}
              size={130}
              strokeWidth={10}
              label="Readiness"
            />
          </div>
          <div className="flex-1 min-w-48 space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-[#64748B]">Competency Coverage</span>
                <span className="font-bold text-[#1E293B]">{data.coveragePct}%</span>
              </div>
              <div className="h-3 bg-[#F4F8FF] border border-[#E2E8F0] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    data.coveragePct >= 80 ? 'bg-[#A7E8D0]' :
                    data.coveragePct >= 50 ? 'bg-[#8AB4F8]' : 'bg-red-400'
                  }`}
                  style={{ width: `${data.coveragePct}%` }}
                />
              </div>
            </div>
            <p className="text-sm font-medium text-[#334155]">{data.coverageLabel}</p>
            {isBio && (
              <div className="text-xs text-[#64748B] space-y-0.5">
                <p>Formula: R<sub>team</sub> = |K<sub>team</sub> ∩ K<sub>req</sub>| / |K<sub>req</sub>| × 100</p>
                <p>= 2 ∩ 7 / 7 × 100 = <strong className="text-[#1E293B]">28.6%</strong></p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Required Skills */}
      <div className="card p-6 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
        <h2 className="text-base font-bold text-[#1E293B] mb-3">
          Required Skills (K<sub>req</sub>)
        </h2>
        <div className="flex flex-wrap gap-2">
          {data.required.map(skill => (
            <SkillChip
              key={skill}
              skill={skill}
              variant={data.covered.includes(skill) ? 'matched' : 'missing'}
            />
          ))}
        </div>
        <p className="text-xs text-[#64748B] mt-3">
          Green = covered by team · Red = deficit gap
        </p>
      </div>

      {/* Team Skills */}
      <div className="card p-6 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
        <h2 className="text-base font-bold text-[#1E293B] mb-3">
          Team Skills (K<sub>team</sub>) — Abu Zafor + Anamul Haque
        </h2>
        <div className="flex flex-wrap gap-2">
          {data.teamSkills.map(skill => (
            <SkillChip key={skill} skill={skill} variant="matched" />
          ))}
        </div>
      </div>

      {/* Deficits */}
      {isBio && (
        <div className="card p-6 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
          <h2 className="text-base font-bold text-[#1E293B] mb-3">
            Skill Deficits (ΔK = K<sub>req</sub> \ K<sub>team</sub>)
          </h2>
          <div className="flex flex-wrap gap-2">
            {bioShieldScenario.deficits.map(skill => (
              <SkillChip key={skill} skill={skill} variant="missing" />
            ))}
          </div>
          <p className="text-xs text-red-600 mt-3 font-medium">
            {bioShieldScenario.deficits.length} critical gaps — a co-advisor with bioinformatics expertise is strongly recommended.
          </p>
        </div>
      )}

      {/* Find Co-Advisor CTA */}
      {isBio && (
        <div className="flex justify-end">
          <button
            onClick={() => navigate('/student/co-advisor')}
            className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl text-sm"
          >
            Find Co-Advisor
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {!isBio && (
        <div className="card p-6 bg-[#A7E8D0]/20 border border-[#A7E8D0] rounded-3xl">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-emerald-700 flex-shrink-0" size={24} />
            <div>
              <p className="font-bold text-[#1E293B]">Your team is fully equipped!</p>
              <p className="text-sm text-[#334155] mt-0.5">
                All 7 required skills for EdgeShield ECG are covered. You can proceed to send proposals directly.
              </p>
            </div>
            <button
              onClick={() => navigate('/student/discovery')}
              className="ml-auto flex items-center gap-1.5 text-sm text-[#1E293B] bg-white px-4 py-2 rounded-xl border border-[#A7E8D0] hover:bg-[#F4F8FF] font-semibold flex-shrink-0 transition-colors"
            >
              Find Advisor <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
