import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import type { UserRole } from '../../types';
import {
  LayoutDashboard,
  User,
  FilePlus,
  Search,
  TrendingUp,
  Inbox,
  CalendarClock,
  FolderKanban,
  Star,
  BookOpen,
  FileText,
  Users,
  Sliders,
  Calendar,
  ListChecks,
  ShieldCheck,
  Settings2,
  Eye,
  ClipboardList,
  ChevronRight,
  Sparkles,
  BarChart3,
  MessageSquare,
} from 'lucide-react';
import { clsx } from 'clsx';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const navConfig: Record<UserRole, NavItem[]> = {
  student: [
    { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'My Profile', path: '/student/profile', icon: User },
    { label: 'New Proposal', path: '/student/proposals/new', icon: FilePlus },
    { label: 'Find Advisors', path: '/student/discovery', icon: Search },
    { label: 'Skill Gap', path: '/student/skill-gap', icon: TrendingUp },
    { label: 'My Requests', path: '/student/proposals', icon: Inbox },
    { label: 'Consultation', path: '/student/consultation', icon: CalendarClock },
    { label: 'Workspace', path: '/student/workspace', icon: FolderKanban },
    { label: 'Contributions', path: '/student/contributions', icon: BarChart3 },
    { label: 'Team Chat', path: '/student/chat', icon: MessageSquare },
    { label: 'Evaluation', path: '/student/evaluation', icon: Star },
  ],
  faculty: [
    { label: 'Dashboard', path: '/faculty/dashboard', icon: LayoutDashboard },
    { label: 'Research Portfolio', path: '/faculty/portfolio', icon: BookOpen },
    { label: 'Incoming Proposals', path: '/faculty/proposals', icon: FileText },
    { label: 'Capacity & Quota', path: '/faculty/quota', icon: Sliders },
    { label: 'Calendar Settings', path: '/faculty/calendar', icon: Calendar },
  ],
  mentor: [
    { label: 'Dashboard', path: '/mentor/dashboard', icon: LayoutDashboard },
    { label: 'My Profile', path: '/mentor/profile', icon: User },
    { label: 'Request Queue', path: '/mentor/requests', icon: ListChecks },
  ],
  coordinator: [
    { label: 'Allocation Dashboard', path: '/coordinator/dashboard', icon: LayoutDashboard },
    { label: 'Faculty Verification', path: '/coordinator/verification', icon: ShieldCheck },
    { label: 'Quota Policy', path: '/coordinator/quota', icon: Sliders },
    { label: 'Disputes', path: '/coordinator/disputes', icon: Users },
  ],
  admin: [
    { label: 'Taxonomy', path: '/admin/taxonomy', icon: Settings2 },
    { label: 'RBAC & Users', path: '/admin/rbac', icon: ShieldCheck },
    { label: 'System Health', path: '/admin/health', icon: Star },
  ],
  auditor: [
    { label: 'Audit Trail', path: '/auditor/trail', icon: ClipboardList },
    { label: 'Reports', path: '/auditor/reports', icon: Eye },
  ],
};

const roleTitles: Record<UserRole, string> = {
  student: 'Student Workspace',
  faculty: 'Faculty Workspace',
  mentor: 'Industry Mentor',
  coordinator: 'Coordinator Portal',
  admin: 'System Administrator',
  auditor: 'Auditor & Compliance',
};

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onMobileClose }) => {
  const { currentRole } = useApp();
  const location = useLocation();
  const navItems = navConfig[currentRole] ?? [];
  const currentPath = location.pathname;
  const [collapsed, setCollapsed] = useState(false);

  const sidebarContent = (
    <div
      className={clsx(
        'h-full flex flex-col bg-white border-r border-[#E2E8F0] transition-all duration-300 shadow-sm',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-[#E2E8F0] flex-shrink-0 bg-white">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#EAF2FF] border border-[#D5E5FD] flex items-center justify-center text-[#3B75DE]">
              <Sparkles size={14} />
            </div>
            <span className="text-base font-bold text-[#1E293B] select-none tracking-tight">
              Uni<span className="text-[#3B75DE]">Expert</span>
            </span>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-[#EAF2FF] border border-[#D5E5FD] flex items-center justify-center text-[#3B75DE] mx-auto">
            <Sparkles size={16} />
          </div>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#334155] hover:bg-[#F4F8FF] transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronRight
            size={16}
            className={clsx('transition-transform duration-300', !collapsed && 'rotate-180')}
          />
        </button>
      </div>

      {/* Role Pill label */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-[#F1F5F9]">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#EEF2FF] text-[#3730A3] border border-[#C7D2FE]">
            {roleTitles[currentRole]}
          </span>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {navItems.map((item) => {
          const isActive = currentPath === item.path || currentPath.startsWith(item.path + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150',
                isActive
                  ? 'bg-[#EAF2FF] text-[#1E3A8A] font-semibold shadow-sm border border-[#D5E5FD]'
                  : 'text-[#64748B] hover:bg-[#F4F8FF] hover:text-[#1E293B]',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? item.label : undefined}
              onClick={onMobileClose}
            >
              <Icon size={17} className={clsx('flex-shrink-0', isActive ? 'text-[#3B75DE]' : 'text-[#94A3B8]')} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Subtle DIU academic badge */}
      {!collapsed && (
        <div className="p-4 border-t border-[#F1F5F9] text-center">
          <p className="text-[11px] text-[#94A3B8] font-medium">Daffodil Int. University</p>
          <p className="text-[10px] text-[#CBD5E1]">SE 331 Capstone Platform</p>
        </div>
      )}

      {/* Bottom spacer for DemoRoleSwitcher */}
      <div className="h-14 flex-shrink-0" />
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={clsx(
        'hidden md:block fixed top-0 left-0 h-full z-30 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}>
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
            onClick={onMobileClose}
          />
          <aside className="fixed top-0 left-0 h-full z-50 w-64 md:hidden shadow-soft">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
};

export default Sidebar;
