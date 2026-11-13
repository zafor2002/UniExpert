import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import type { UserRole } from '../../types';
import { GraduationCap, BookOpen, Briefcase, LayoutDashboard, Shield, Eye } from 'lucide-react';

interface RoleButton {
  role: UserRole;
  label: string;
  icon: React.ElementType;
  colorClass: string;
  activeClass: string;
  dashboard: string;
}

const roles: RoleButton[] = [
  {
    role: 'student',
    label: 'Student',
    icon: GraduationCap,
    colorClass: 'bg-[#EAF2FF] text-[#1E3A8A] hover:bg-[#D5E5FD] border border-[#B0CFFB]',
    activeClass: 'ring-2 ring-[#8AB4F8] shadow-sm font-bold bg-[#D5E5FD]',
    dashboard: '/student/dashboard',
  },
  {
    role: 'faculty',
    label: 'Faculty Advisor',
    icon: BookOpen,
    colorClass: 'bg-[#EEF2FF] text-[#3730A3] hover:bg-[#E0E7FF] border border-[#C7D2FE]',
    activeClass: 'ring-2 ring-[#A5B4FC] shadow-sm font-bold bg-[#E0E7FF]',
    dashboard: '/faculty/dashboard',
  },
  {
    role: 'mentor',
    label: 'Industry Mentor',
    icon: Briefcase,
    colorClass: 'bg-[#F0FDF8] text-[#13533E] hover:bg-[#DCFCEE] border border-[#A7E8D0]',
    activeClass: 'ring-2 ring-[#A7E8D0] shadow-sm font-bold bg-[#DCFCEE]',
    dashboard: '/mentor/dashboard',
  },
  {
    role: 'coordinator',
    label: 'Coordinator',
    icon: LayoutDashboard,
    colorClass: 'bg-[#FFFBEB] text-[#92400E] hover:bg-[#FEF3C7] border border-[#FDE68A]',
    activeClass: 'ring-2 ring-[#FDE68A] shadow-sm font-bold bg-[#FEF3C7]',
    dashboard: '/coordinator/dashboard',
  },
  {
    role: 'admin',
    label: 'Admin',
    icon: Shield,
    colorClass: 'bg-[#FFF1F2] text-[#9F1239] hover:bg-[#FFE4E6] border border-[#FECDD3]',
    activeClass: 'ring-2 ring-[#FECDD3] shadow-sm font-bold bg-[#FFE4E6]',
    dashboard: '/admin/taxonomy',
  },
  {
    role: 'auditor',
    label: 'Auditor',
    icon: Eye,
    colorClass: 'bg-[#F8FAFC] text-[#334155] hover:bg-[#F1F5F9] border border-[#E2E8F0]',
    activeClass: 'ring-2 ring-[#CBD5E1] shadow-sm font-bold bg-[#F1F5F9]',
    dashboard: '/auditor/trail',
  },
];

const DemoRoleSwitcher: React.FC = () => {
  const { setRole, currentRole } = useApp();
  const navigate = useNavigate();

  const handleSwitch = (btn: RoleButton) => {
    setRole(btn.role);
    navigate(btn.dashboard);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] shadow-soft">
      <div className="max-w-4xl mx-auto px-4 py-2 flex items-center gap-2 flex-wrap justify-center">
        <span className="text-[11px] font-semibold text-[#64748B] mr-1 whitespace-nowrap flex items-center gap-1">
          <span>🎭</span> Switch Role:
        </span>
        {roles.map((btn) => {
          const Icon = btn.icon;
          const isActive = currentRole === btn.role;
          return (
            <button
              key={btn.role}
              onClick={() => handleSwitch(btn)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all duration-150 ${btn.colorClass} ${
                isActive ? btn.activeClass : 'opacity-85 hover:opacity-100'
              }`}
              title={`Switch workspace to ${btn.label}`}
            >
              <Icon size={13} />
              <span className="hidden sm:inline font-medium">{btn.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DemoRoleSwitcher;
