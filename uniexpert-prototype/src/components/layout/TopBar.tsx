import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import NotificationDropdown from '../shared/NotificationDropdown';

interface TopBarProps {
  onMenuClick: () => void;
}

const roleLabels: Record<string, string> = {
  student: 'Student',
  faculty: 'Faculty Advisor',
  mentor: 'Industry Mentor',
  coordinator: 'Coordinator',
  admin: 'Admin',
  auditor: 'Auditor',
};

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

function getBreadcrumb(path: string): string {
  const segment = path.split('/').filter(Boolean).pop() ?? '';
  return segment
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { currentUser, currentRole, notifications, logout } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const breadcrumb = getBreadcrumb(window.location.pathname);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/student/discovery?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = currentUser ? getInitials(currentUser.name) : 'UE';
  const displayName = currentUser?.name ?? 'User';

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] flex items-center px-4 sm:px-6 gap-4">
      {/* Left: hamburger + brand + breadcrumb */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-xl text-[#64748B] hover:bg-[#F4F8FF] hover:text-[#334155] transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-xl bg-[#EAF2FF] border border-[#D5E5FD] flex items-center justify-center text-[#3B75DE]">
            <Sparkles size={16} />
          </div>
          <span className="hidden sm:block text-lg font-bold text-[#1E293B] tracking-tight">
            Uni<span className="text-[#3B75DE]">Expert</span>
          </span>
        </div>

        {breadcrumb && (
          <div className="hidden md:flex items-center gap-1.5 text-xs text-[#94A3B8] pl-2 border-l border-[#E2E8F0]">
            <span className="text-[#64748B] font-medium">{breadcrumb}</span>
          </div>
        )}
      </div>

      {/* Center: Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-md mx-auto">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search experts, capstone domains, skills..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E2E8F0] bg-[#F4F8FF] hover:bg-white focus:bg-white text-xs text-[#334155] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#8AB4F8] focus:border-transparent transition-all shadow-sm"
          />
        </div>
      </form>

      {/* Right: Notifications & User profile */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Notification bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications((v) => !v)}
            className="p-2 rounded-xl text-[#64748B] hover:bg-[#F4F8FF] hover:text-[#334155] transition-colors relative"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#A7E8D0] text-[#13533E] text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <NotificationDropdown onClose={() => setShowNotifications(false)} />
          )}
        </div>

        {/* User avatar & dropdown */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setShowUserMenu((v) => !v)}
            className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-[#F4F8FF] transition-all border border-transparent hover:border-[#E2E8F0]"
            aria-label="User menu"
          >
            <div className="w-8 h-8 rounded-xl bg-[#EAF2FF] border border-[#D5E5FD] text-[#1E3A8A] flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-[#1E293B] leading-tight truncate max-w-[110px]">
                {displayName.split(' ')[0]}
              </p>
              <p className="text-[10px] text-[#64748B] leading-tight">
                {roleLabels[currentRole]}
              </p>
            </div>
            <ChevronDown size={13} className="text-[#94A3B8] hidden sm:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-soft border border-[#E2E8F0] py-2 z-50">
              <div className="px-4 py-2.5 border-b border-[#E2E8F0] bg-[#F4F8FF]/60 rounded-t-2xl">
                <p className="text-xs font-bold text-[#1E293B] truncate">
                  {displayName}
                </p>
                <p className="text-[11px] text-[#64748B] mt-0.5 truncate font-mono">
                  {currentUser?.email}
                </p>
                <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#EAF2FF] text-[#1E3A8A] font-semibold mt-1.5 border border-[#B0CFFB]">
                  {roleLabels[currentRole]}
                </span>
              </div>

              <div className="py-1">
                <button
                  onClick={() => { setShowUserMenu(false); navigate('/student/profile'); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#334155] hover:bg-[#F4F8FF] transition-colors"
                >
                  My Profile
                </button>
                <button
                  onClick={() => { setShowUserMenu(false); navigate('/student/workspace'); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#334155] hover:bg-[#F4F8FF] transition-colors"
                >
                  Active Project Workspace
                </button>
                <button
                  onClick={() => { setShowUserMenu(false); handleLogout(); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors border-t border-[#E2E8F0] mt-1 pt-2"
                >
                  <LogOut size={13} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
