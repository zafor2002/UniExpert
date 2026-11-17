import React, { useState } from 'react';
import { Star, Award, CheckCircle2, MessageSquare, ThumbsUp, ArrowLeft } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export const PostEvaluation: React.FC = () => {
  const navigate = useNavigate();
  const { experts } = useApp();
  const advisor = experts[0]; // Dr. Farhana Rahman

  const [responsiveness, setResponsiveness] = useState(5);
  const [technicalDepth, setTechnicalDepth] = useState(5);
  const [milestoneAdherence, setMilestoneAdherence] = useState(4);
  const [clarity, setClarity] = useState(5);
  const [overallSatisfaction, setOverallSatisfaction] = useState(5);

  const [comments, setComments] = useState(
    'Dr. Rahman provided exceptional guidance on deploying TinyML on ARM Cortex-M4 and helped us optimize our BLE AES-GCM transport to meet HIPAA latency budgets. Highly recommended advisor for embedded systems.'
  );

  const [endorsedSkills, setEndorsedSkills] = useState<string[]>([
    'TinyML', 'ARM Cortex-M4', 'BLE 5.0', 'AES-GCM'
  ]);

  const toggleEndorsement = (skill: string) => {
    if (endorsedSkills.includes(skill)) {
      setEndorsedSkills(endorsedSkills.filter((s) => s !== skill));
    } else {
      setEndorsedSkills([...endorsedSkills, skill]);
    }
  };

  const radarData = [
    { metric: 'Responsiveness', score: responsiveness * 20 },
    { metric: 'Technical Depth', score: technicalDepth * 20 },
    { metric: 'Milestones', score: milestoneAdherence * 20 },
    { metric: 'Clarity', score: clarity * 20 },
    { metric: 'Overall', score: overallSatisfaction * 20 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Evaluation submitted. Thank you for your feedback!');
    setTimeout(() => {
      navigate('/student');
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="card p-6 bg-white border border-[#E2E8F0] shadow-sm rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
            Official Capstone Exit Rubric
          </span>
          <h1 className="text-xl font-bold text-[#1E293B] mt-1">Supervisory Collaboration Evaluation</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Evaluating: <strong className="text-[#1E293B]">{advisor.name}</strong> · {advisor.title}, {advisor.department}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#F4F8FF] px-4 py-2 rounded-2xl border border-[#E2E8F0]">
          <Star className="text-amber-500 fill-amber-500" size={18} />
          <span className="text-sm font-bold text-[#1E293B]">{((responsiveness + technicalDepth + milestoneAdherence + clarity + overallSatisfaction) / 5).toFixed(1)} / 5.0</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rubric Sliders Card */}
          <div className="card p-6 md:p-8 space-y-4 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
            <h2 className="text-base font-bold text-[#1E293B]">
              Institutional Rubric Dimensions
            </h2>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-[#334155] mb-1">
                  <span>Responsiveness & Availability</span>
                  <span className="font-bold text-[#1E293B]">{responsiveness} / 5</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={responsiveness}
                  onChange={(e) => setResponsiveness(Number(e.target.value))}
                  className="w-full accent-[#8AB4F8]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-[#334155] mb-1">
                  <span>Technical & Research Depth</span>
                  <span className="font-bold text-[#1E293B]">{technicalDepth} / 5</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={technicalDepth}
                  onChange={(e) => setTechnicalDepth(Number(e.target.value))}
                  className="w-full accent-[#8AB4F8]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-[#334155] mb-1">
                  <span>Milestone & Roadmap Adherence</span>
                  <span className="font-bold text-[#1E293B]">{milestoneAdherence} / 5</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={milestoneAdherence}
                  onChange={(e) => setMilestoneAdherence(Number(e.target.value))}
                  className="w-full accent-[#8AB4F8]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-[#334155] mb-1">
                  <span>Communication Clarity</span>
                  <span className="font-bold text-[#1E293B]">{clarity} / 5</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={clarity}
                  onChange={(e) => setClarity(Number(e.target.value))}
                  className="w-full accent-[#8AB4F8]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-[#334155] mb-1">
                  <span>Overall Mentorship Satisfaction</span>
                  <span className="font-bold text-[#1E293B]">{overallSatisfaction} / 5</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={overallSatisfaction}
                  onChange={(e) => setOverallSatisfaction(Number(e.target.value))}
                  className="w-full accent-[#8AB4F8]"
                />
              </div>
            </div>
          </div>

          {/* Radar Visualization Card */}
          <div className="card p-6 md:p-8 flex flex-col items-center justify-center bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
            <h3 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider mb-2">
              Performance Geometry
            </h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} />
                  <Radar dataKey="score" stroke="#8AB4F8" fill="#8AB4F8" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Skill Endorsement Chips Card */}
        <div className="card p-6 md:p-8 space-y-3 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
          <h2 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
            <Award size={18} className="text-[#8AB4F8]" />
            Endorse Advisor Technical Skills
          </h2>
          <p className="text-xs text-[#64748B]">
            Student endorsements increase verified weight for future capstone matching
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {advisor.skills.map((skill) => {
              const isEndorsed = endorsedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleEndorsement(skill)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isEndorsed
                      ? 'bg-[#A7E8D0]/30 text-[#1E293B] border border-[#A7E8D0]'
                      : 'bg-[#F4F8FF] text-[#64748B] border border-[#E2E8F0] hover:bg-[#EAF2FF]'
                  }`}
                >
                  <ThumbsUp size={12} className={isEndorsed ? 'fill-emerald-700 text-emerald-700' : ''} />
                  {skill} {isEndorsed && '✓'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Qualitative Comments */}
        <div className="card p-6 md:p-8 space-y-3 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
          <h2 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
            <MessageSquare size={18} className="text-[#8AB4F8]" />
            Qualitative Assessment & Recommendations
          </h2>
          <textarea
            rows={4}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="input text-xs leading-relaxed"
            placeholder="Share feedback for departmental accreditation review..."
            required
          />
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary text-xs px-4 py-2.5 rounded-xl">
            Cancel
          </button>
          <button type="submit" className="btn-primary text-xs px-6 py-2.5 font-bold rounded-xl shadow-sm">
            <CheckCircle2 size={14} /> Submit Final Accreditation Evaluation
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostEvaluation;

