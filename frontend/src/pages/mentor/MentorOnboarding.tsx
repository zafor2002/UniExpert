import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, CheckCircle2, Globe, Share2, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const MentorOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Step 1: Credentials
  const [name, setName] = useState('Engr. Sakib Al Hasan');
  const [title, setTitle] = useState('Principal Cloud Architect');
  const [company, setCompany] = useState('TechBridge Ltd.');
  const [linkedin, setLinkedin] = useState('sakib-al-hasan');
  const [github, setGithub] = useState('sakib-dev');
  const [experience, setExperience] = useState('12');

  // Step 2: Skill Toolchain
  const allSkills = ['AWS', 'GCP', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'Microservices', 'Go', 'Python', 'Prometheus', 'Kafka', 'GraphQL'];
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['AWS', 'GCP', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD']);

  // Step 3: Capacity
  const [maxGroups, setMaxGroups] = useState(3);
  const [hours, setHours] = useState('4');

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Mentor profile created. Pending coordinator verification.');
    setTimeout(() => {
      navigate('/mentor');
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Briefcase className="text-primary-600" size={22} />
          Industry Mentor Accreditation & Onboarding
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Join the DIU Academic-Industry Collaboration Network to co-advise university capstone research
        </p>
      </div>

      {/* Stepper Progress */}
      <div className="flex items-center justify-between card p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm">
        {[
          { num: 1, label: 'Professional Profile' },
          { num: 2, label: 'Technical Toolchain' },
          { num: 3, label: 'Supervisory Capacity' },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step === s.num
                  ? 'bg-[#8AB4F8] text-[#1E293B]'
                  : step > s.num
                  ? 'bg-[#A7E8D0] text-[#1E293B]'
                  : 'bg-[#F4F8FF] border border-[#E2E8F0] text-[#64748B]'
              }`}
            >
              {step > s.num ? <CheckCircle2 size={16} className="text-emerald-800" /> : s.num}
            </span>
            <span className={`text-xs font-semibold ${step === s.num ? 'text-[#1E293B] font-bold' : 'text-[#64748B]'}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <div className="card p-6 md:p-8 space-y-4 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
            <h2 className="text-base font-bold text-[#1E293B]">Step 1: Professional Background</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label text-[#334155] font-semibold">Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input text-xs" required />
              </div>
              <div>
                <label className="label text-[#334155] font-semibold">Current Job Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input text-xs" required />
              </div>
              <div>
                <label className="label text-[#334155] font-semibold">Organization / Company</label>
                <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="input text-xs" required />
              </div>
              <div>
                <label className="label text-[#334155] font-semibold">Years of Industry Experience</label>
                <input type="number" value={experience} onChange={(e) => setExperience(e.target.value)} className="input text-xs" required />
              </div>
              <div>
                <label className="label text-[#334155] font-semibold">LinkedIn Profile URL</label>
                <input type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="input text-xs" required />
              </div>
              <div>
                <label className="label text-[#334155] font-semibold">GitHub Handle</label>
                <input type="text" value={github} onChange={(e) => setGithub(e.target.value)} className="input text-xs" required />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button type="button" onClick={() => setStep(2)} className="btn-primary text-xs px-5 py-2.5 rounded-xl font-semibold shadow-sm">
                Continue to Toolchains <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="card p-6 md:p-8 space-y-4 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
            <h2 className="text-base font-bold text-[#1E293B]">Step 2: Industry Skill & Stack Matrix</h2>
            <p className="text-xs text-[#64748B]">Select technologies you can review and mentor students on:</p>

            <div className="flex flex-wrap gap-2 pt-2">
              {allSkills.map((s) => {
                const active = selectedSkills.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSkill(s)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      active
                        ? 'bg-[#8AB4F8] text-[#1E293B] border border-[#8AB4F8]'
                        : 'bg-[#F4F8FF] text-[#334155] border border-[#E2E8F0] hover:bg-[#EAF2FF]'
                    }`}
                  >
                    {s} {active && '✓'}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between pt-4">
              <button type="button" onClick={() => setStep(1)} className="btn-secondary text-xs px-4 py-2.5 rounded-xl">
                <ArrowLeft size={14} /> Back
              </button>
              <button type="button" onClick={() => setStep(3)} className="btn-primary text-xs px-5 py-2.5 rounded-xl font-semibold shadow-sm">
                Continue to Capacity <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="card p-6 md:p-8 space-y-4 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
            <h2 className="text-base font-bold text-[#1E293B]">Step 3: Availability & Capacity Agreement</h2>
            <div className="space-y-4">
              <div>
                <label className="label text-[#334155] font-semibold">Maximum Student Teams Co-Supervised Simultaneously</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={maxGroups}
                  onChange={(e) => setMaxGroups(Number(e.target.value))}
                  className="input text-xs w-28"
                  required
                />
              </div>

              <div>
                <label className="label text-[#334155] font-semibold">Monthly Commitment (Hours)</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="input text-xs w-28"
                  required
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#F4F8FF] border border-[#E2E8F0] text-xs text-[#334155]">
                By submitting this form, you agree to adhere to the DIU Department of Software Engineering Capstone Mentorship Code of Conduct and provide timely feedback on agreed milestone artifacts.
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button type="button" onClick={() => setStep(2)} className="btn-secondary text-xs px-4 py-2.5 rounded-xl">
                <ArrowLeft size={14} /> Back
              </button>
              <button type="submit" className="btn-primary text-xs px-6 py-2.5 font-bold rounded-xl shadow-sm">
                Submit Mentor Application
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default MentorOnboarding;
