import React, { useState, useRef, useEffect } from 'react';
import {
  Send, Paperclip, Smile, Users, Hash, Pin,
  Search, Phone, Video, MoreHorizontal, CheckCheck,
  ChevronDown, Plus, AtSign, Mic, ImageIcon,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { toast } from 'react-hot-toast';

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderInitials: string;
  senderColor: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'system';
  reactions?: { emoji: string; count: number; byMe: boolean }[];
  pinned?: boolean;
}

interface Channel {
  id: string;
  name: string;
  description: string;
  unread: number;
}

/* ─── Mock Data ─────────────────────────────────────────────────────────── */
const MEMBERS = [
  { id: 'stu-1', name: 'Abu Zafor',      initials: 'AZ', color: '#4D90F0', role: 'Team Lead',    online: true  },
  { id: 'stu-2', name: 'Rafi Ahmed',     initials: 'RA', color: '#7C8FF5', role: 'Backend Dev',  online: true  },
  { id: 'stu-3', name: 'Lamia Sultana',  initials: 'LS', color: '#34C99A', role: 'ML Engineer',  online: false },
  { id: 'stu-4', name: 'Tanvir Hassan',  initials: 'TH', color: '#F59E0B', role: 'Frontend Dev', online: true  },
  { id: 'adv-1', name: 'Dr. Farhana Rahman', initials: 'FR', color: '#EF4444', role: 'Supervisor', online: false },
];

const CHANNELS: Channel[] = [
  { id: 'ch-general',   name: 'general',   description: 'Team-wide announcements',   unread: 0 },
  { id: 'ch-dev',       name: 'dev',        description: 'Code & technical discussion', unread: 3 },
  { id: 'ch-ml',        name: 'ml-models',  description: 'ML experiments & results',  unread: 1 },
  { id: 'ch-meetings',  name: 'meetings',   description: 'Meeting notes & action items', unread: 0 },
];

const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  'ch-general': [
    {
      id: 'm1', senderId: 'adv-1', senderName: 'Dr. Farhana Rahman', senderInitials: 'FR', senderColor: '#EF4444',
      content: 'Good morning team! Reminder: Final defense is Dec 20. Please ensure all deliverables are submitted by Dec 15.',
      timestamp: '2026-11-13T09:00:00Z', type: 'text', pinned: true,
      reactions: [{ emoji: '👍', count: 3, byMe: true }],
    },
    {
      id: 'm2', senderId: 'stu-1', senderName: 'Abu Zafor', senderInitials: 'AZ', senderColor: '#4D90F0',
      content: "Understood, Dr. Rahman. We're on track. M2 (Prototype Demo) is ready for the Nov 15 deadline.",
      timestamp: '2026-11-13T09:15:00Z', type: 'text',
    },
    {
      id: 'm3', senderId: 'stu-3', senderName: 'Lamia Sultana', senderInitials: 'LS', senderColor: '#34C99A',
      content: "ML model hit 92.4% F1 score on the test set! 🎉 ONNX export is ready for edge deployment.",
      timestamp: '2026-11-13T10:30:00Z', type: 'text',
      reactions: [{ emoji: '🔥', count: 4, byMe: false }],
    },
    {
      id: 'm4', senderId: 'stu-2', senderName: 'Rafi Ahmed', senderInitials: 'RA', senderColor: '#7C8FF5',
      content: "Great work Lamia! I'll integrate the ONNX model with the REST endpoint today.",
      timestamp: '2026-11-13T10:45:00Z', type: 'text',
    },
  ],
  'ch-dev': [
    {
      id: 'd1', senderId: 'stu-2', senderName: 'Rafi Ahmed', senderInitials: 'RA', senderColor: '#7C8FF5',
      content: 'JWT middleware is merged. All endpoints are now protected with RBAC guards. PR #42 closed.',
      timestamp: '2026-11-13T11:00:00Z', type: 'text',
    },
    {
      id: 'd2', senderId: 'stu-4', senderName: 'Tanvir Hassan', senderInitials: 'TH', senderColor: '#F59E0B',
      content: 'Dashboard WebSocket hook is working. Live sensor telemetry updating at 100ms intervals.',
      timestamp: '2026-11-13T11:30:00Z', type: 'text',
    },
    {
      id: 'd3', senderId: 'stu-1', senderName: 'Abu Zafor', senderInitials: 'AZ', senderColor: '#4D90F0',
      content: "CI/CD pipeline deployed. GitHub Actions runs lint → test → build → deploy on every push to main.",
      timestamp: '2026-11-13T13:00:00Z', type: 'text',
      reactions: [{ emoji: '🚀', count: 2, byMe: true }],
    },
  ],
  'ch-ml': [
    {
      id: 'ml1', senderId: 'stu-3', senderName: 'Lamia Sultana', senderInitials: 'LS', senderColor: '#34C99A',
      content: "Confusion matrix uploaded. False positive rate < 2% on anomaly detection. Ready for Cortex-M4 deployment.",
      timestamp: '2026-11-12T14:00:00Z', type: 'text',
    },
  ],
  'ch-meetings': [
    {
      id: 'mt1', senderId: 'stu-1', senderName: 'Abu Zafor', senderInitials: 'AZ', senderColor: '#4D90F0',
      content: '📋 **Meeting Notes – Nov 7, 2026**\n\nPresent: All members + Dr. Rahman\n• Action: CMSIS-NN integration by Nov 10 ✅\n• Action: BLE driver testing by Nov 12 ✅\n• Next meeting: Nov 14, 15:00 (Room 602)',
      timestamp: '2026-11-07T16:00:00Z', type: 'text', pinned: true,
    },
  ],
};

const EMOJIS = ['👍', '🔥', '✅', '🎉', '👀', '🚀'];

/* ─── Component ─────────────────────────────────────────────────────────── */
export const TeamChat: React.FC = () => {
  const { currentUser } = useApp();
  const myId = currentUser?.id || 'stu-1';

  const [activeChannel, setActiveChannel] = useState('ch-general');
  const [messagesByChannel, setMessagesByChannel] = useState(MOCK_MESSAGES);
  const [input, setInput] = useState('');
  const [showEmoji, setShowEmoji] = useState<string | null>(null);
  const [channels, setChannels] = useState(CHANNELS);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const messages = messagesByChannel[activeChannel] || [];
  const myMember = MEMBERS.find(m => m.id === myId) || MEMBERS[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark channel as read when switching
  useEffect(() => {
    setChannels(prev => prev.map(ch => ch.id === activeChannel ? { ...ch, unread: 0 } : ch));
  }, [activeChannel]);

  const handleSend = () => {
    if (!input.trim()) return;
    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: myId,
      senderName: myMember.name,
      senderInitials: myMember.initials,
      senderColor: myMember.color,
      content: input.trim(),
      timestamp: new Date().toISOString(),
      type: 'text',
    };
    setMessagesByChannel(prev => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), msg],
    }));
    setInput('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleReaction = (msgId: string, emoji: string) => {
    setMessagesByChannel(prev => ({
      ...prev,
      [activeChannel]: prev[activeChannel].map(m => {
        if (m.id !== msgId) return m;
        const existing = m.reactions?.find(r => r.emoji === emoji);
        const reactions = existing
          ? m.reactions!.map(r => r.emoji === emoji
              ? { ...r, count: r.byMe ? r.count - 1 : r.count + 1, byMe: !r.byMe }
              : r).filter(r => r.count > 0)
          : [...(m.reactions || []), { emoji, count: 1, byMe: true }];
        return { ...m, reactions };
      }),
    }));
    setShowEmoji(null);
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const activeChannelData = channels.find(c => c.id === activeChannel);
  const pinnedMessages = messages.filter(m => m.pinned);

  return (
    <div className="max-w-6xl mx-auto pb-4 h-[calc(100vh-7rem)] flex gap-0 bg-white border border-[#CBD5E1] rounded-2xl shadow-sm overflow-hidden">

      {/* ── Sidebar ───────────────────────────────────────────────────────── */}
      <aside className="w-56 shrink-0 bg-[#EDF2FB] border-r border-[#CBD5E1] flex flex-col">
        {/* Team Name */}
        <div className="p-4 border-b border-[#CBD5E1]">
          <h2 className="text-sm font-black text-[#0F172A]">EdgeShield AI</h2>
          <p className="text-[10px] text-[#334155] mt-0.5">Capstone Group #32</p>
        </div>

        {/* Channels */}
        <div className="flex-1 overflow-y-auto p-3 space-y-0.5">
          <p className="text-[9px] font-bold uppercase tracking-widest text-[#334155] px-2 pb-1.5 pt-1">Channels</p>
          {channels.map(ch => (
            <button
              key={ch.id}
              onClick={() => setActiveChannel(ch.id)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                activeChannel === ch.id
                  ? 'bg-white text-[#0F172A] font-semibold shadow-sm border border-[#CBD5E1]'
                  : 'text-[#334155] hover:bg-white/60 hover:text-[#0F172A]'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Hash size={12} className="shrink-0" />
                {ch.name}
              </span>
              {ch.unread > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#4D90F0] text-white text-[9px] flex items-center justify-center font-bold">
                  {ch.unread}
                </span>
              )}
            </button>
          ))}

          {/* Members */}
          <p className="text-[9px] font-bold uppercase tracking-widest text-[#334155] px-2 pb-1.5 pt-3">Members</p>
          {MEMBERS.map(m => (
            <div key={m.id} className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs text-[#334155]">
              <div className="relative shrink-0">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-bold text-white"
                  style={{ backgroundColor: m.color }}
                >
                  {m.initials}
                </div>
                <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#EDF2FB] ${m.online ? 'bg-[#34C99A]' : 'bg-[#CBD5E1]'}`} />
              </div>
              <div className="min-w-0">
                <p className={`truncate font-medium leading-none ${m.id === myId ? 'text-[#0F172A]' : 'text-[#334155]'}`}>
                  {m.name} {m.id === myId && <span className="text-[9px] opacity-60">(you)</span>}
                </p>
                <p className="text-[9px] text-[#94A3B8] mt-0.5">{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* ── Main Chat Area ────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Channel Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#CBD5E1] bg-white shrink-0">
          <div className="flex items-center gap-2">
            <Hash size={15} className="text-[#334155]" />
            <span className="text-sm font-bold text-[#0F172A]">{activeChannelData?.name}</span>
            <span className="text-xs text-[#334155] hidden sm:block">· {activeChannelData?.description}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="p-1.5 rounded-lg hover:bg-[#EDF2FB] text-[#334155] transition-colors" title="Search">
              <Search size={15} />
            </button>
            <button
              onClick={() => toast('Video call feature coming soon!')}
              className="p-1.5 rounded-lg hover:bg-[#EDF2FB] text-[#334155] transition-colors"
              title="Video call"
            >
              <Video size={15} />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-[#EDF2FB] text-[#334155] transition-colors" title="Members">
              <Users size={15} />
            </button>
          </div>
        </div>

        {/* Pinned Messages Banner */}
        {pinnedMessages.length > 0 && (
          <div className="px-5 py-2 bg-[#FEF3C7]/60 border-b border-[#FCD34D]/40 flex items-center gap-2">
            <Pin size={12} className="text-[#78350F] shrink-0" />
            <p className="text-[11px] text-[#78350F] font-semibold truncate">
              📌 {pinnedMessages[0].senderName}: {pinnedMessages[0].content.slice(0, 70)}…
            </p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
          {messages.map((msg, i) => {
            const isMe = msg.senderId === myId;
            const prevMsg = messages[i - 1];
            const isSameGroup = prevMsg && prevMsg.senderId === msg.senderId &&
              Math.abs(new Date(msg.timestamp).getTime() - new Date(prevMsg.timestamp).getTime()) < 5 * 60 * 1000;
            const showDate = !prevMsg || formatDate(msg.timestamp) !== formatDate(prevMsg.timestamp);

            return (
              <React.Fragment key={msg.id}>
                {showDate && (
                  <div className="flex items-center gap-3 py-3">
                    <div className="flex-1 h-px bg-[#CBD5E1]" />
                    <span className="text-[10px] font-bold text-[#334155] px-2">{formatDate(msg.timestamp)}</span>
                    <div className="flex-1 h-px bg-[#CBD5E1]" />
                  </div>
                )}
                <div className={`flex items-end gap-2 group ${isMe ? 'flex-row-reverse' : ''} ${isSameGroup ? 'mt-0.5' : 'mt-3'}`}>
                  {/* Avatar */}
                  {!isSameGroup ? (
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shrink-0 mb-0.5"
                      style={{ backgroundColor: msg.senderColor }}
                    >
                      {msg.senderInitials}
                    </div>
                  ) : <div className="w-7 shrink-0" />}

                  <div className={`flex flex-col max-w-[72%] ${isMe ? 'items-end' : 'items-start'}`}>
                    {!isSameGroup && (
                      <div className={`flex items-baseline gap-2 mb-0.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                        <span className="text-[11px] font-bold text-[#0F172A]">{msg.senderName}</span>
                        <span className="text-[10px] text-[#94A3B8] font-mono">{formatTime(msg.timestamp)}</span>
                        {msg.pinned && <Pin size={10} className="text-[#F59E0B]" />}
                      </div>
                    )}

                    {/* Bubble */}
                    <div className="relative">
                      <div
                        className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                          isMe
                            ? 'bg-[#4D90F0] text-white rounded-br-sm'
                            : 'bg-[#EDF2FB] text-[#0F172A] border border-[#CBD5E1] rounded-bl-sm'
                        }`}
                      >
                        {msg.content}
                      </div>

                      {/* Hover actions */}
                      <div className={`absolute top-1/2 -translate-y-1/2 ${isMe ? '-left-20' : '-right-20'} hidden group-hover:flex items-center gap-1 bg-white border border-[#CBD5E1] rounded-xl shadow-sm px-1.5 py-1`}>
                        <button
                          onClick={() => setShowEmoji(showEmoji === msg.id ? null : msg.id)}
                          className="p-1 rounded-lg hover:bg-[#EDF2FB] text-[#334155] transition-colors"
                        >
                          <Smile size={12} />
                        </button>
                        <button className="p-1 rounded-lg hover:bg-[#EDF2FB] text-[#334155] transition-colors">
                          <MoreHorizontal size={12} />
                        </button>
                      </div>

                      {/* Emoji picker */}
                      {showEmoji === msg.id && (
                        <div className={`absolute top-full mt-1 ${isMe ? 'right-0' : 'left-0'} flex items-center gap-1 bg-white border border-[#CBD5E1] rounded-xl shadow-md px-2 py-1.5 z-10`}>
                          {EMOJIS.map(e => (
                            <button
                              key={e}
                              onClick={() => toggleReaction(msg.id, e)}
                              className="text-base hover:scale-125 transition-transform"
                            >
                              {e}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Reactions */}
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className={`flex items-center gap-1 mt-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                        {msg.reactions.map(r => (
                          <button
                            key={r.emoji}
                            onClick={() => toggleReaction(msg.id, r.emoji)}
                            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold border transition-colors ${
                              r.byMe
                                ? 'bg-[#DDE8FA] border-[#4D90F0] text-[#1E3A8A]'
                                : 'bg-white border-[#CBD5E1] text-[#334155] hover:border-[#4D90F0]'
                            }`}
                          >
                            {r.emoji} <span>{r.count}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Read receipt for my messages */}
                    {isMe && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <CheckCheck size={11} className="text-[#34C99A]" />
                        <span className="text-[9px] text-[#94A3B8]">{formatTime(msg.timestamp)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="shrink-0 px-4 pb-4 pt-2 border-t border-[#CBD5E1]">
          <div className="flex items-end gap-2 bg-[#EDF2FB] border border-[#CBD5E1] rounded-2xl px-3 py-2">
            {/* Left actions */}
            <div className="flex items-center gap-1 pb-1 shrink-0">
              <button
                onClick={() => toast('File upload coming soon!')}
                className="p-1 rounded-lg hover:bg-white text-[#334155] transition-colors"
                title="Attach file"
              >
                <Paperclip size={15} />
              </button>
              <button
                onClick={() => toast('Image sharing coming soon!')}
                className="p-1 rounded-lg hover:bg-white text-[#334155] transition-colors"
                title="Share image"
              >
                <ImageIcon size={15} />
              </button>
            </div>

            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message #${activeChannelData?.name}…`}
              className="flex-1 bg-transparent resize-none text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none py-1 max-h-28 leading-relaxed"
              style={{ minHeight: '1.5rem' }}
            />

            {/* Right actions */}
            <div className="flex items-center gap-1 pb-1 shrink-0">
              <button
                onClick={() => setShowEmoji(showEmoji ? null : 'input')}
                className="p-1 rounded-lg hover:bg-white text-[#334155] transition-colors"
              >
                <Smile size={15} />
              </button>
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-1.5 rounded-xl bg-[#4D90F0] text-white hover:bg-[#3A7EDE] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
          <p className="text-[9px] text-[#94A3B8] mt-1 px-1">
            Press <kbd className="font-mono bg-[#EDF2FB] border border-[#CBD5E1] px-1 py-0.5 rounded text-[9px]">Enter</kbd> to send · <kbd className="font-mono bg-[#EDF2FB] border border-[#CBD5E1] px-1 py-0.5 rounded text-[9px]">Shift+Enter</kbd> for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeamChat;
