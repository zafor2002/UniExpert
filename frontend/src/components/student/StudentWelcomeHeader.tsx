import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  ShieldCheck,
  Award,
  Sparkles,
  GraduationCap,
  CheckCircle2,
  Users,
  Hash,
  Layers,
  Eye,
  Sliders,
} from 'lucide-react';
import type { Student } from '@/types';
import { cn } from '@/lib/utils';

export type HeaderVariation = 'minimal' | 'gradient' | 'split' | 'premium' | 'all';

interface StudentWelcomeHeaderProps {
  student: Student;
  daysLeft: number;
  defenseDate?: Date;
  defaultVariation?: HeaderVariation;
  showSwitcher?: boolean;
}

export default function StudentWelcomeHeader({
  student,
  daysLeft,
  defenseDate = new Date('2026-12-20T00:00:00Z'),
  defaultVariation = 'minimal',
  showSwitcher = false,
}: StudentWelcomeHeaderProps) {
  const [variation, setVariation] = useState<HeaderVariation>(defaultVariation);

  const formattedTargetDate = defenseDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-4">
      {/* Variation Switcher */}
      {showSwitcher && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-[#CBD5E1] p-2.5 px-4 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2">
            <Sliders size={14} className="text-[#4D90F0]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#334155]">
              Style
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {(['minimal', 'gradient', 'split', 'premium'] as HeaderVariation[]).map((v, i) => {
              const labels = ['Minimal', 'Gradient', 'Split', 'Premium'];
              const icons = [null, <Sparkles size={12} />, <Layers size={12} />, <Award size={12} />];
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVariation(v)}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5',
                    variation === v
                      ? 'bg-[#DDE8FA] text-[#1E3A8A] border border-[#4D90F0]/50 shadow-2xs'
                      : 'text-[#334155] hover:text-[#0F172A] hover:bg-[#EDF2FB]'
                  )}
                >
                  {icons[i] && <span className="text-[#4D90F0]">{icons[i]}</span>}
                  <span>{i + 1}. {labels[i]}</span>
                </button>
              );
            })}

            <div className="h-4 w-px bg-[#CBD5E1] mx-1 hidden sm:block" />

            <button
              type="button"
              onClick={() => setVariation('all')}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5',
                variation === 'all'
                  ? 'bg-[#4D90F0] text-white shadow-xs'
                  : 'bg-[#EDF2FB] text-[#1E3A8A] border border-[#CBD5E1] hover:bg-[#DDE8FA]'
              )}
            >
              <Eye size={12} />
              <span>Compare All</span>
            </button>
          </div>
        </div>
      )}

      {variation === 'minimal' && <Variation1Minimal student={student} daysLeft={daysLeft} targetDate={formattedTargetDate} />}
      {variation === 'gradient' && <Variation2Gradient student={student} daysLeft={daysLeft} targetDate={formattedTargetDate} />}
      {variation === 'split' && <Variation3Split student={student} daysLeft={daysLeft} targetDate={formattedTargetDate} />}
      {variation === 'premium' && <Variation4Premium student={student} daysLeft={daysLeft} targetDate={formattedTargetDate} />}

      {variation === 'all' && (
        <div className="space-y-6 pt-2">
          {[
            { label: 'Minimal', Component: Variation1Minimal },
            { label: 'Gradient', Component: Variation2Gradient },
            { label: 'Split', Component: Variation3Split },
            { label: 'Premium', Component: Variation4Premium },
          ].map(({ label, Component }, i) => (
            <div key={label} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#DDE8FA] text-[#1E3A8A] text-xs font-bold flex items-center justify-center border border-[#4D90F0]/30">
                  {i + 1}
                </span>
                <h3 className="text-sm font-bold text-[#0F172A]">{label}</h3>
              </div>
              <Component student={student} daysLeft={daysLeft} targetDate={formattedTargetDate} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface VariationProps {
  student: Student;
  daysLeft: number;
  targetDate: string;
}

/* =========================================================================
   VARIATION 1: MINIMAL
   Clean white card — high-contrast text, minimal labels
   ========================================================================= */
export function Variation1Minimal({ student, daysLeft, targetDate }: VariationProps) {
  return (
    <div className="bg-white border border-[#CBD5E1] shadow-sm rounded-2xl p-5 md:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
      {/* Profile */}
      <div className="flex items-center gap-4">
        <div className="w-13 h-13 rounded-2xl bg-[#DDE8FA] border border-[#4D90F0]/30 flex items-center justify-center text-lg font-bold text-[#1E3A8A] shrink-0">
          {student.name?.slice(0, 2).toUpperCase() ?? 'AZ'}
        </div>
        <div className="space-y-1">
          <span className="text-xs font-semibold text-[#334155] bg-[#DDE8FA] px-2.5 py-0.5 rounded-full border border-[#93C5FD]">
            Student Lead · {student.batch}
          </span>
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">
            Welcome back, {student.name}
          </h1>
          <div className="flex items-center gap-2 flex-wrap text-xs text-[#334155]">
            <span className="font-mono font-semibold">{student.studentId}</span>
            <span className="text-[#94A3B8]">·</span>
            <span>Section {student.section}</span>
            <span className="text-[#94A3B8]">·</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#BBFBDE] text-[#065F46] border border-[#6EE7B7] font-semibold">
              <ShieldCheck size={12} className="text-[#059669]" />
              BAETE Eligible
            </span>
          </div>
        </div>
      </div>

      {/* Countdown */}
      <div className="flex items-center gap-3 bg-[#EDF2FB] border border-[#CBD5E1] rounded-xl p-3 px-4 shrink-0 self-start lg:self-auto">
        <div className="w-9 h-9 rounded-xl bg-[#4D90F0] text-white flex items-center justify-center shrink-0">
          <Clock size={17} />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#334155] block">Defense</span>
          <span className="text-base font-black text-[#0F172A] block leading-tight">{daysLeft} Days</span>
          <span className="text-xs font-medium text-[#059669] block mt-0.5">Dec 20, 2026</span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   VARIATION 2: GRADIENT
   Blue-tinted gradient, frosted widget
   ========================================================================= */
export function Variation2Gradient({ student, daysLeft, targetDate }: VariationProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-white via-[#EDF2FB] to-[#DDE8FA] border border-[#CBD5E1] shadow-sm rounded-2xl p-5 md:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
      <div className="absolute -right-10 -top-10 w-56 h-56 bg-[#4D90F0]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Left */}
      <div className="flex items-start sm:items-center gap-4 relative z-10">
        <div className="p-[2px] rounded-2xl bg-gradient-to-tr from-[#4D90F0] via-[#7C8FF5] to-[#34C99A] shadow-xs shrink-0">
          <div className="w-14 h-14 rounded-[14px] bg-white flex items-center justify-center text-lg font-extrabold text-[#1E3A8A]">
            {student.name?.slice(0, 2).toUpperCase() ?? 'AZ'}
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/90 px-2.5 py-0.5 rounded-full text-[#1E3A8A] border border-[#93C5FD] shadow-2xs">
              <Sparkles size={11} className="text-[#4D90F0]" />
              Student Lead
            </span>
            <span className="text-xs text-[#334155] flex items-center gap-1 font-medium">
              <GraduationCap size={12} className="text-[#334155]" />
              Software Engineering · DIU
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Welcome back, {student.name} 👋
          </h1>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-white/90 border border-[#CBD5E1] text-xs font-semibold text-[#0F172A] px-2.5 py-0.5 rounded-lg shadow-2xs">
              {student.studentId}
            </span>
            <span className="bg-white/90 border border-[#CBD5E1] text-xs font-semibold text-[#0F172A] px-2.5 py-0.5 rounded-lg shadow-2xs">
              Batch {student.batch} · §{student.section}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-[#BBFBDE] text-[#065F46] border border-[#6EE7B7] text-xs font-bold px-2.5 py-0.5 rounded-lg">
              <ShieldCheck size={13} className="text-[#059669]" />
              BAETE Eligible
            </span>
          </div>
        </div>
      </div>

      {/* Countdown widget */}
      <div className="relative z-10 bg-white/95 backdrop-blur border border-[#93C5FD]/60 shadow-sm rounded-2xl p-4 px-5 flex items-center gap-4 shrink-0 self-start lg:self-auto">
        <div className="w-11 h-11 rounded-xl bg-[#4D90F0] text-white flex items-center justify-center shrink-0 relative">
          <Clock size={20} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#34C99A] rounded-full border-2 border-white animate-pulse" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#334155] block">Final Defense</span>
          <span className="text-xl font-black text-[#1E3A8A] block leading-tight tracking-tight">{daysLeft} Days</span>
          <span className="text-xs font-semibold text-[#059669] flex items-center gap-1 mt-0.5">
            <Calendar size={11} />
            Dec 20, 2026
          </span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   VARIATION 3: SPLIT CARDS
   Two-column: profile left, countdown right with progress bar
   ========================================================================= */
export function Variation3Split({ student, daysLeft, targetDate }: VariationProps) {
  const semesterTotalDays = 120;
  const daysPassed = Math.max(0, semesterTotalDays - daysLeft);
  const progressPercent = Math.min(100, Math.round((daysPassed / semesterTotalDays) * 100));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Left: Profile (8 cols) */}
      <div className="lg:col-span-8 bg-white border border-[#CBD5E1] shadow-sm rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-[#DDE8FA] border border-[#4D90F0]/40 flex items-center justify-center text-xl font-bold text-[#1E3A8A] shrink-0">
          {student.name?.slice(0, 2).toUpperCase() ?? 'AZ'}
        </div>
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#DDE8FA] text-[#1E3A8A] border border-[#93C5FD]">
              Student Lead
            </span>
            <span className="text-xs text-[#334155] font-medium">Software Engineering · DIU</span>
          </div>

          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">
            Welcome back, {student.name}
          </h1>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-[#0F172A] font-semibold bg-[#EDF2FB] border border-[#CBD5E1] px-2.5 py-0.5 rounded-lg font-mono">
              {student.studentId}
            </span>
            <span className="text-[#0F172A] font-semibold bg-[#EDF2FB] border border-[#CBD5E1] px-2.5 py-0.5 rounded-lg">
              Batch {student.batch} · §{student.section}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-[#BBFBDE] text-[#065F46] border border-[#6EE7B7] px-2.5 py-0.5 rounded-lg font-bold">
              <ShieldCheck size={13} className="text-[#059669]" />
              BAETE Eligible
            </span>
          </div>
        </div>
      </div>

      {/* Right: Countdown (4 cols) */}
      <div className="lg:col-span-4 bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] border border-[#1E3A8A]/20 shadow-sm rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-6 -translate-y-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />

        <div className="space-y-3 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/20 text-white flex items-center justify-center">
                <Clock size={14} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-white/90">Defense</span>
            </div>
            <span className="inline-flex items-center gap-1 bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34C99A] animate-pulse" />
              On Track
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-5xl font-black text-white tracking-tight leading-none">{daysLeft}</span>
              <span className="text-xs font-bold text-white/70 uppercase tracking-wider">days</span>
            </div>
            <p className="text-xs text-white/70 mt-1 font-medium">Dec 20, 2026</p>
          </div>

          {/* Progress */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-[10px] font-semibold text-white/70">
              <span>Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   VARIATION 4: PREMIUM BANNER
   Accent stripe, structured credential pills
   ========================================================================= */
export function Variation4Premium({ student, daysLeft, targetDate }: VariationProps) {
  return (
    <div className="bg-white border border-[#CBD5E1] shadow-sm rounded-2xl overflow-hidden">
      {/* Accent stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-[#4D90F0] via-[#7C8FF5] to-[#34C99A]" />

      <div className="p-5 md:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Left */}
        <div className="flex items-start sm:items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-[#DDE8FA] border-2 border-[#4D90F0]/40 flex items-center justify-center text-xl font-bold text-[#1E3A8A]">
              {student.name?.slice(0, 2).toUpperCase() ?? 'AZ'}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
              <CheckCircle2 size={16} className="text-[#059669]" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#334155]">
              <span className="text-[#1E3A8A] font-bold">Daffodil International University</span>
              <span>·</span>
              <span>Software Engineering</span>
            </div>

            <h1 className="text-xl md:text-2xl font-black text-[#0F172A] tracking-tight">
              {student.name}
            </h1>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-1.5 bg-[#EDF2FB] border border-[#CBD5E1] px-2.5 py-0.5 rounded-lg text-xs font-semibold text-[#0F172A]">
                <Hash size={11} className="text-[#334155]" />
                <span className="font-mono">{student.studentId}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-[#EDF2FB] border border-[#CBD5E1] px-2.5 py-0.5 rounded-lg text-xs font-semibold text-[#0F172A]">
                <Users size={11} className="text-[#334155]" />
                Batch {student.batch} · §{student.section}
              </div>
              <div className="inline-flex items-center gap-1.5 bg-[#BBFBDE] border border-[#6EE7B7] px-2.5 py-0.5 rounded-lg text-xs font-bold text-[#065F46]">
                <Award size={12} className="text-[#059669]" />
                BAETE Eligible
              </div>
            </div>
          </div>
        </div>

        {/* Right: countdown */}
        <div className="bg-[#EDF2FB] border border-[#CBD5E1] rounded-2xl p-4 px-5 flex items-center gap-4 shrink-0 self-start lg:self-auto">
          <div className="w-12 h-12 rounded-2xl bg-[#4D90F0] flex flex-col items-center justify-center text-white shrink-0">
            <Clock size={14} />
            <span className="text-sm font-black leading-none mt-0.5">{daysLeft}d</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#334155] block">Defense Window</span>
            <span className="text-base font-black text-[#0F172A] block leading-tight">{daysLeft} Days Remaining</span>
            <span className="text-xs font-bold text-[#059669] flex items-center gap-1">
              <Calendar size={11} />
              Dec 20, 2026
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
