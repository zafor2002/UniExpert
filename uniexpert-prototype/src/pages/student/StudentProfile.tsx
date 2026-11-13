import React, { useState } from 'react';
import { Mail, Award, BookOpen, Globe, Share2, Upload, CheckCircle2, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useApp } from '../../context/AppContext';
import ScoreRing from '../../components/shared/ScoreRing';
import SkillChip from '../../components/shared/SkillChip';
import type { Student } from '../../types';

export const StudentProfile: React.FC = () => {
  const { currentUser } = useApp();
  const student = currentUser as Student;

  const [skills, setSkills] = useState<string[]>(student?.skills || ['Python', 'React', 'C/C++', 'BLE', 'MQTT', 'Machine Learning Basics']);
  const [newSkill, setNewSkill] = useState('');
  const [github, setGithub] = useState(student?.github || 'zafor2002');
  const [linkedin, setLinkedin] = useState(student?.linkedin || 'abu-zafor');
  const [cvName, setCvName] = useState<string | null>('Abu_Zafor_CV_2026.pdf');
  const [isEditing, setIsEditing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 5 MB limit
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File exceeds the 5 MB limit. Please compress or upload a smaller file.');
      return;
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Only PDF documents are allowed for curriculum vitae.');
      return;
    }

    setCvName(file.name);
    toast.success('CV uploaded and parsed successfully.');
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (skills.includes(newSkill.trim())) {
      toast.error('Skill already present.');
      return;
    }
    setSkills([...skills, newSkill.trim()]);
    setNewSkill('');
    toast.success(`Skill "${newSkill.trim()}" added to student profile.`);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast.success('Student profile updated successfully.');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Top Banner / Header */}
      <div className="card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white border border-[#E2E8F0] shadow-sm rounded-3xl">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-[#EAF2FF] border border-[#E2E8F0] flex items-center justify-center text-2xl font-bold tracking-wider text-[#334155]">
            AZ
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#1E293B]">{student?.name || 'Abu Zafor'}</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-[#A7E8D0]/40 text-[#1E293B] border border-[#A7E8D0]">
                Active Student
              </span>
            </div>
            <p className="text-sm text-[#64748B] mt-1">
              Student ID: <span className="font-mono font-medium text-[#334155]">{student?.studentId || '232-35-331'}</span> · Batch {student?.batch || 41} (Section {student?.section || 'A'})
            </p>
            <p className="text-xs text-[#64748B] mt-0.5">
              Department of {student?.department || 'Software Engineering'} · Daffodil International University
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-[#F4F8FF] p-3 rounded-2xl border border-[#E2E8F0]">
          <ScoreRing score={student?.profileCompletion || 78} size={64} strokeWidth={6} />
          <div>
            <span className="text-xs text-[#64748B] uppercase tracking-wider font-semibold block">Profile Score</span>
            <span className="text-sm font-bold text-[#1E293B]">78% Complete</span>
            <span className="text-[11px] text-[#64748B] block">Add IEEE/ACM links to reach 100%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Academic Credentials */}
        <div className="card p-6 md:p-8 space-y-5 bg-white border border-[#E2E8F0] shadow-sm rounded-3xl">
          <h2 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
            <Award size={18} className="text-[#8AB4F8]" />
            Academic Details
          </h2>

          <div className="space-y-3.5 text-sm">
            <div>
              <label className="text-xs font-semibold text-[#64748B]">Degree Program</label>
              <div className="font-medium text-[#334155] mt-0.5">
                {student?.degree || 'B.Sc. in Software Engineering'}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#64748B]">Institutional Email</label>
              <div className="font-mono text-xs text-[#334155] mt-0.5 flex items-center gap-1.5">
                <Mail size={13} className="text-[#64748B]" />
                {student?.email || 'abu.zafor@diu.edu.bd'}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#64748B]">Current Semester</label>
              <div className="font-medium text-[#334155] mt-0.5">
                Fall 2026 (Final Capstone Term)
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#64748B]">Capstone Project Track</label>
              <div className="font-medium text-[#334155] mt-0.5">
                Embedded AI & Healthcare Telemetry
              </div>
            </div>
          </div>

          <hr className="border-[#E2E8F0]" />

          {/* Online Profiles */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
              Developer Portfolios
            </h3>

            <div>
              <label className="text-xs text-[#64748B] flex items-center gap-1 mb-1">
                <Globe size={13} /> GitHub Profile
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="input text-xs border-[#E2E8F0] bg-white text-[#334155]"
                />
              ) : (
                <a
                  href={`https://github.com/${github}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-[#2563EB] hover:underline flex items-center gap-1 font-semibold"
                >
                  github.com/{github}
                </a>
              )}
            </div>

            <div>
              <label className="text-xs text-[#64748B] flex items-center gap-1 mb-1">
                <Share2 size={13} /> LinkedIn Profile
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="input text-xs border-[#E2E8F0] bg-white text-[#334155]"
                />
              ) : (
                <a
                  href={`https://linkedin.com/in/${linkedin}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-[#2563EB] hover:underline flex items-center gap-1 font-semibold"
                >
                  linkedin.com/in/{linkedin}
                </a>
              )}
            </div>
          </div>

          <div className="pt-2">
            {isEditing ? (
              <button onClick={handleSaveProfile} className="btn-primary w-full text-xs justify-center py-2.5 font-semibold">
                Save Information
              </button>
            ) : (
              <button onClick={() => setIsEditing(true)} className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#334155] bg-[#F4F8FF] hover:bg-[#EAF2FF] border border-[#E2E8F0] w-full justify-center transition-colors">
                Edit Profiles
              </button>
            )}
          </div>
        </div>

        {/* Center & Right Column: Skills & CV Upload */}
        <div className="md:col-span-2 space-y-6">
          {/* Technical Skills Portfolio */}
          <div className="card p-6 md:p-8 space-y-4 bg-white border border-[#E2E8F0] shadow-sm rounded-3xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
                  <BookOpen size={18} className="text-[#8AB4F8]" />
                  Verified Student Skill Matrix
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Used by the vector matching engine to compute team competency overlap
                </p>
              </div>
              <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-xl bg-[#F4F8FF] text-[#1E293B] border border-[#E2E8F0]">
                {skills.length} Registered
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {skills.map((s) => (
                <SkillChip
                  key={s}
                  skill={s}
                  variant="neutral"
                  onRemove={() => handleRemoveSkill(s)}
                />
              ))}
            </div>

            {/* Add skill input */}
            <form onSubmit={handleAddSkill} className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Add a new skill (e.g. FreeRTOS, TinyML, Docker)..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="input text-xs flex-1 border-[#E2E8F0] bg-white text-[#334155]"
              />
              <button type="submit" className="px-4 py-2 rounded-xl text-xs font-semibold text-[#334155] bg-[#F4F8FF] hover:bg-[#EAF2FF] border border-[#E2E8F0] shrink-0 transition-colors">
                Add Skill
              </button>
            </form>
          </div>

          {/* Curriculum Vitae (PDF Upload with 5MB validation) */}
          <div className="card p-6 md:p-8 space-y-4 bg-white border border-[#E2E8F0] shadow-sm rounded-3xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
                  <FileText size={18} className="text-[#8AB4F8]" />
                  Academic Curriculum Vitae (CV)
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Extracted by zero-shot NLP parsers for candidate research indexing
                </p>
              </div>
              <span className="text-xs text-[#64748B]">PDF only · Max 5.0 MB</span>
            </div>

            {cvName && (
              <div className="p-4 rounded-2xl bg-[#DCFCEE]/60 border border-[#A7E8D0] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#A7E8D0] text-[#13533E]">
                    <FileText size={20} />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#1E293B] block">{cvName}</span>
                    <span className="text-xs text-[#64748B]">2.4 MB · Uploaded Nov 2, 2026 · Parsed by Qdrant</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#13533E] flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-[#A7E8D0] shadow-xs">
                    <CheckCircle2 size={14} className="text-[#0F766E]" /> Indexed
                  </span>
                </div>
              </div>
            )}

            <div className="border-2 border-dashed border-[#E2E8F0] rounded-2xl p-8 text-center hover:bg-[#F4F8FF] transition-colors cursor-pointer relative">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
                aria-label="Upload PDF CV"
              />
              <Upload size={32} className="mx-auto text-[#8AB4F8] mb-2" />
              <p className="text-sm font-semibold text-[#1E293B]">
                Click to browse or drag and drop your updated CV
              </p>
              <p className="text-xs text-[#64748B] mt-1">
                Strict institutional validation: Max 5 MB, strictly .pdf format
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
