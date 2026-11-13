import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Calendar, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import type { Notification } from '../../types';

interface NotificationDropdownProps {
  onClose: () => void;
}

function getNotifIcon(type: Notification['type']) {
  switch (type) {
    case 'fsm_transition':
      return <Bell size={14} className="text-[#2563EB]" />;
    case 'consultation':
      return <Calendar size={14} className="text-[#6366F1]" />;
    case 'quota_change':
      return <AlertTriangle size={14} className="text-[#D97706]" />;
    case 'evaluation':
      return <CheckCircle2 size={14} className="text-[#0F766E]" />;
    case 'system':
    default:
      return <Info size={14} className="text-[#64748B]" />;
  }
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();

  const recent = notifications.slice(0, 5);
  const hasUnread = recent.some((n) => !n.read);

  const handleClick = (n: Notification) => {
    markNotificationRead(n.id);
    onClose();
    if (n.link) navigate(n.link);
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-84 bg-white rounded-3xl shadow-xl border border-[#E2E8F0] z-50 overflow-hidden animate-in fade-in-50 zoom-in-95">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E2E8F0] bg-[#F4F8FF]/80">
        <span className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
          Notifications & Alerts
        </span>
        {hasUnread && (
          <button
            onClick={markAllNotificationsRead}
            className="text-xs text-[#2563EB] hover:underline font-semibold"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-[#E2E8F0]">
        {recent.length === 0 ? (
          <div className="px-4 py-8 text-center text-xs text-[#64748B]">
            No recent notifications
          </div>
        ) : (
          recent.map((n) => (
            <button
              key={n.id}
              onClick={() => handleClick(n)}
              className={`w-full text-left px-4 py-3.5 hover:bg-[#F4F8FF] transition-colors flex gap-3 items-start ${
                !n.read ? 'bg-[#EAF2FF]/30' : 'bg-white'
              }`}
            >
              {/* Unread indicator icon */}
              <div className="relative mt-0.5 flex-shrink-0">
                <div className="w-8 h-8 rounded-xl bg-[#F4F8FF] border border-[#E2E8F0] flex items-center justify-center">
                  {getNotifIcon(n.type)}
                </div>
                {!n.read && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#8AB4F8] rounded-full border-2 border-white" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs leading-snug truncate ${
                    n.read
                      ? 'text-[#334155]'
                      : 'font-bold text-[#1E293B]'
                  }`}
                >
                  {n.title}
                </p>
                <p className="text-[11px] text-[#64748B] mt-0.5 line-clamp-2 leading-relaxed">
                  {n.message}
                </p>
                <p className="text-[10px] text-[#94A3B8] mt-1 font-mono">
                  {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}
                </p>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 5 && (
        <div className="border-t border-[#E2E8F0] px-4 py-2.5 text-center bg-[#F4F8FF]/50">
          <button
            onClick={() => { onClose(); navigate('/student/requests'); }}
            className="text-xs text-[#2563EB] hover:underline font-semibold"
          >
            View all {notifications.length} alerts
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
