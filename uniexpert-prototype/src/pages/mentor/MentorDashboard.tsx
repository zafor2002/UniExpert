import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Clock, Users, ExternalLink, Calendar, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import SkillChip from '../../components/shared/SkillChip';
import MetricCard from '../../components/shared/MetricCard';

export const MentorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { experts } = useApp();
  const mentor = experts[3]; // Engr. Sakib Al Hasan

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24">
      {/* Header Banner */}
      <div className="card p-6 md:p-8 bg-white border border-[#E2E8F0] shadow-sm rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#EEF2FF] border border-[#A5B4FC]/60 flex items-center justify-center text-2xl font-bold text-[#1E293B]">
            SH
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#1E293B]">{mentor.name}</h1>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold bg-[#EEF2FF] text-[#1E293B] border border-[#A5B4FC]/50">
                Industry Mentor
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              {mentor.title} · TechBridge Ltd. · 12+ Years Enterprise Architecture
            </p>
            <p className="text-[11px] text-[#64748B] mt-1">
              Practitioner Track: Cloud Architecture, Kubernetes, DevOps, CI/CD
            </p>
          </div>
        </div>

        <div className="bg-[#F4F8FF] p-4 rounded-2xl border border-[#E2E8F0] min-w-[220px]">
          <span className="text-[10px] uppercase font-bold text-[#64748B] block">Mentorship Bandwidth</span>
          <span className="text-base font-bold text-[#1E293B]">
            {mentor.slotsUsed} of {mentor.slotsTotal} Active Teams
          </span>
          <span className="text-[10px] text-[#64748B] block mt-0.5">Weekend & Evening Consultation</span>
        </div>
      </div>

      {/* Mentor KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <MetricCard
          label="Practitioner Track"
          value="Enterprise Cloud"
          badge="12+ Yrs Exp"
          subtext="Kubernetes, Terraform & CI/CD Pipelines"
          variant="lavender"
          icon={<Briefcase size={18} className="text-[#4338CA]" />}
        />
        <MetricCard
          label="Active Co-Supervision"
          value={`${mentor.slotsUsed} of ${mentor.slotsTotal} Groups`}
          badge="1 Available"
          subtext="Co-advising Team EdgeShield on IoT Cloud"
          variant="mint"
          icon={<Users size={18} className="text-[#0F766E]" />}
        />
        <MetricCard
          label="Monthly Commitment"
          value="4 Hours"
          badge="Evenings & Weekends"
          subtext="Direct architectural guidance & code review"
          variant="blue"
          icon={<Clock size={18} className="text-[#2563EB]" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Request Queue & Industry Skill Toolchain */}
        <div className="lg:col-span-2 space-y-6">
          {/* Incoming Mentorship Inquiries */}
          <div className="card p-6 md:p-8 space-y-4 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
            <h2 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
              <Briefcase size={18} className="text-[#8AB4F8]" />
              Industry Co-Supervision Requests (1 Inbound)
            </h2>

            <div className="p-4 rounded-2xl border border-[#E2E8F0] bg-[#F4F8FF] space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EEF2FF] text-[#1E293B] border border-[#A5B4FC]/40 font-semibold">
                      Cloud Architecture Co-Advising
                    </span>
                    <span className="text-xs text-[#64748B]">· Team EdgeShield</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#1E293B]">
                    EdgeShield: Cloud MQTT-over-TLS Ingestion & Terraform Deployment
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1">
                    Student lead Abu Zafor requested 2 hours/month architectural review for AWS IoT Core vs Mosquitto on Kubernetes cluster.
                  </p>
                </div>
                <span className="text-sm font-bold text-emerald-800 bg-[#A7E8D0]/30 px-2 py-0.5 rounded-full border border-[#A7E8D0] shrink-0">89% Fit</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0]">
                <span className="text-[11px] text-[#64748B] font-mono">Suggested Slot: Saturday 20:00</span>
                <div className="flex gap-2">
                  <button className="btn-secondary text-xs py-1.5 px-3 rounded-xl">Decline</button>
                  <button className="btn-primary text-xs py-1.5 px-3.5 rounded-xl font-semibold shadow-sm">Accept Co-Supervision</button>
                </div>
              </div>
            </div>
          </div>

          {/* Industry Skill Toolchain */}
          <div className="card p-6 md:p-8 space-y-3 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
            <h2 className="text-base font-bold text-[#1E293B]">
              Verified Industry Skill Toolchain
            </h2>
            <div className="flex flex-wrap gap-2">
              {mentor.skills.map((s) => (
                <SkillChip key={s} skill={s} variant="neutral" />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Office Hours & Onboarding Link */}
        <div className="space-y-6">
          <div className="card p-6 space-y-4 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
            <h2 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
              <Calendar size={18} className="text-[#8AB4F8]" />
              Evening Consultation Slots
            </h2>

            <div className="space-y-2 text-xs">
              <div className="p-3.5 rounded-2xl border border-[#E2E8F0] bg-[#F4F8FF] flex items-center justify-between">
                <span className="font-bold text-[#1E293B]">Friday (19:00 - 19:30)</span>
                <span className="text-emerald-800 bg-[#A7E8D0]/30 px-2.5 py-0.5 rounded-full border border-[#A7E8D0] font-semibold">Open</span>
              </div>
              <div className="p-3.5 rounded-2xl border border-[#E2E8F0] bg-[#F4F8FF] flex items-center justify-between">
                <span className="font-bold text-[#1E293B]">Saturday (20:00 - 20:30)</span>
                <span className="text-emerald-800 bg-[#A7E8D0]/30 px-2.5 py-0.5 rounded-full border border-[#A7E8D0] font-semibold">Open</span>
              </div>
            </div>
          </div>

          <div className="card p-6 space-y-3 bg-[#EEF2FF] border border-[#A5B4FC]/40 rounded-3xl">
            <h3 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
              Mentor Onboarding Wizard
            </h3>
            <p className="text-xs text-[#64748B]">
              Need to adjust your verified company credentials, Git toolchains, or availability windows?
            </p>
            <button
              onClick={() => navigate('/mentor/onboarding')}
              className="btn-primary text-xs w-full justify-center py-2.5 rounded-xl font-semibold shadow-sm"
            >
              Launch Onboarding Wizard <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;

