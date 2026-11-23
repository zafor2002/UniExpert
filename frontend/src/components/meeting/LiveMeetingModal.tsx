import React, { useState, useEffect, useRef } from 'react';
import {
  Mic, MicOff, Video, VideoOff, Monitor, MonitorOff,
  Hand, MessageSquare, ListTodo, PhoneOff, Users,
  CheckCircle2, Sparkles, Send, X, Shield, Clock, Volume2, Bell
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { api, getWsUrl, formatMessageTime } from '@/api/client';

interface Participant {
  peer_id: string;
  name: string;
  role: string;
  audio_muted?: boolean;
  video_off?: boolean;
  screen_sharing?: boolean;
  hand_raised?: boolean;
}

interface InMeetingMessage {
  id: string;
  sender_name: string;
  sender_role: string;
  content: string;
  timestamp: string;
}

interface AgendaItem {
  id: string;
  text: string;
  completed: boolean;
}

interface LiveMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId?: string;
  roomTitle?: string;
  currentUser?: { id: string; name: string; role: string } | null;
}

// Gentle Web Audio API synthesizer for join chime (0 external files needed)
function playJoinChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    // Two-tone chime: D5 (587.33 Hz) -> A5 (880.00 Hz)
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880.0, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch {
    // Ignore audio autoplay restrictions
  }
}

export const LiveMeetingModal: React.FC<LiveMeetingModalProps> = ({
  isOpen,
  onClose,
  roomId = 'room-edgeshield',
  roomTitle = 'EdgeShield Capstone Weekly Advisory Sync',
  currentUser
}) => {
  const myId = currentUser?.id || `stu-${Math.floor(Math.random() * 900 + 100)}`;
  const myName = currentUser?.name || 'Abu Zafor';
  const myRole = currentUser?.role || 'Team Lead';
  const storageKey = `uniexpert_meeting_chat_${roomId}`;

  const [participants, setParticipants] = useState<Participant[]>([]);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'agenda' | 'chat' | null>('agenda');
  
  // Persistent in-meeting chat history
  const [chatMessages, setChatMessages] = useState<InMeetingMessage[]>(() => {
    try {
      const saved = localStorage.getItem(`uniexpert_meeting_chat_${roomId}`);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });
  const [chatInput, setChatInput] = useState('');

  const [agenda, setAgenda] = useState<AgendaItem[]>([
    { id: 'ag-1', text: 'Review TinyML CMSIS-NN 8-bit quantization benchmark', completed: true },
    { id: 'ag-2', text: 'Verify BLE 5.0 AES-GCM transport payload format', completed: false },
    { id: 'ag-3', text: 'Lock Milestone 2 deliverable submission date', completed: false }
  ]);

  const [secondsElapsed, setSecondsElapsed] = useState(245);
  const [wsConnected, setWsConnected] = useState(false);
  const [sessionPeerId] = useState(() => `${myId}-${Math.random().toString(36).substring(2, 7)}`);
  
  // Real Camera & Mic Stream references
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const [hasMediaPermission, setHasMediaPermission] = useState<boolean | null>(null);

  // Join Notification banner state
  const [joinNotification, setJoinNotification] = useState<{ name: string; role: string } | null>(null);
  const joinNotificationTimerRef = useRef<any>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Meeting timer
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60).toString().padStart(2, '0');
    const secs = (totalSec % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // 1. Real Camera and Microphone Acquisition via Web MediaDevices API
  useEffect(() => {
    if (!isOpen) return;

    let activeStream: MediaStream | null = null;
    let isCancelled = false;

    async function initMedia() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('MediaDevices not supported in this browser.');
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
          audio: true,
        });

        if (isCancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        activeStream = stream;
        localStreamRef.current = stream;
        setHasMediaPermission(true);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Apply initial muted/videoOff states
        stream.getAudioTracks().forEach((t) => (t.enabled = !isMuted));
        stream.getVideoTracks().forEach((t) => (t.enabled = !isVideoOff));
      } catch (err: any) {
        console.warn('getUserMedia camera/mic fallback:', err.message || err);
        setHasMediaPermission(false);

        // Fallback: try audio-only if camera is unavailable or occupied
        try {
          const audioOnly = await navigator.mediaDevices.getUserMedia({ audio: true });
          if (!isCancelled) {
            activeStream = audioOnly;
            localStreamRef.current = audioOnly;
            setHasMediaPermission(true);
            setIsVideoOff(true);
            audioOnly.getAudioTracks().forEach((t) => (t.enabled = !isMuted));
          } else {
            audioOnly.getTracks().forEach((t) => t.stop());
          }
        } catch {
          // If neither is permitted, run in virtual presentation mode without crashing
          setIsVideoOff(true);
          setIsMuted(true);
        }
      }
    }

    initMedia();

    return () => {
      isCancelled = true;
      if (activeStream) {
        activeStream.getTracks().forEach((t) => t.stop());
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
        screenStreamRef.current = null;
      }
      if (joinNotificationTimerRef.current) {
        clearTimeout(joinNotificationTimerRef.current);
      }
    };
  }, [isOpen]);

  // Hook camera stream back to video element whenever video is toggled on
  useEffect(() => {
    if (!isVideoOff && localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
  }, [isVideoOff, hasMediaPermission]);

  // 2. Fetch Chat History from REST Backend on modal open
  useEffect(() => {
    if (!isOpen) return;
    api.getMeetingMessages(roomId)
      .then((history) => {
        if (history && Array.isArray(history) && history.length > 0) {
          setChatMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const newOnes: InMeetingMessage[] = [];
            for (const h of history) {
              if (!existingIds.has(h.id)) {
                newOnes.push({
                  id: h.id,
                  sender_name: h.sender_name || 'Participant',
                  sender_role: h.sender_role || 'Student',
                  content: h.content,
                  timestamp: formatMessageTime(h.timestamp),
                });
              }
            }
            if (newOnes.length === 0) return prev;
            const merged = [...prev, ...newOnes];
            try {
              localStorage.setItem(storageKey, JSON.stringify(merged));
            } catch {
              // ignore
            }
            return merged;
          });
        }
      })
      .catch(() => {});
  }, [isOpen, roomId, storageKey]);

  // 3. WebSocket Connection for Live Meeting Signaling & Events
  useEffect(() => {
    if (!isOpen) return;

    let ws: WebSocket | null = null;
    try {
      const url = getWsUrl(`meeting/ws/${roomId}?peer_id=${encodeURIComponent(sessionPeerId)}&name=${encodeURIComponent(myName)}&role=${encodeURIComponent(myRole)}`);
      ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setWsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'room_state') {
            if (data.participants && data.participants.length > 0) {
              // Exclude myself from remote participants list
              const remotes = data.participants.filter((p: any) => p.peer_id !== sessionPeerId);
              setParticipants(remotes);
            } else {
              setParticipants([]);
            }
            if (data.agenda && Array.isArray(data.agenda) && data.agenda.length > 0) {
              setAgenda(data.agenda);
            }
            // Merge server chat history
            if (data.chat_messages && Array.isArray(data.chat_messages) && data.chat_messages.length > 0) {
              setChatMessages((prev) => {
                const existingIds = new Set(prev.map((m) => m.id));
                const incoming = data.chat_messages
                  .filter((h: any) => !existingIds.has(h.id))
                  .map((h: any) => ({
                    id: h.id,
                    sender_name: h.sender_name,
                    sender_role: h.sender_role,
                    content: h.content,
                    timestamp: formatMessageTime(h.timestamp),
                  }));
                if (incoming.length === 0) return prev;
                const merged = [...prev, ...incoming];
                try {
                  localStorage.setItem(storageKey, JSON.stringify(merged));
                } catch {
                  // ignore
                }
                return merged;
              });
            }

          } else if (data.type === 'peer_joined') {
            if (data.peer_id !== sessionPeerId) {
              setParticipants((prev) => {
                if (prev.some((p) => p.peer_id === data.peer_id)) return prev;
                return [...prev, { peer_id: data.peer_id, ...data.user }];
              });

              // 🔊 Audio Chime
              playJoinChime();

              // 🔔 Floating Notification Banner
              const joinerName = data.user?.name || 'A team member';
              const joinerRole = data.user?.role || 'Participant';
              setJoinNotification({ name: joinerName, role: joinerRole });
              if (joinNotificationTimerRef.current) clearTimeout(joinNotificationTimerRef.current);
              joinNotificationTimerRef.current = setTimeout(() => {
                setJoinNotification(null);
              }, 4500);

              // 💬 Record in Meeting Text History
              const sysMsg: InMeetingMessage = {
                id: `sys-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                sender_name: 'Meeting System',
                sender_role: 'system',
                content: `👋 ${joinerName} (${joinerRole}) joined the call`,
                timestamp: formatMessageTime(new Date().toISOString()),
              };
              setChatMessages((prev) => {
                const updated = [...prev, sysMsg];
                try {
                  localStorage.setItem(storageKey, JSON.stringify(updated));
                } catch {
                  // ignore
                }
                return updated;
              });

              toast.success(`👋 ${joinerName} joined the meeting.`, { duration: 3500 });
            }

          } else if (data.type === 'peer_left') {
            setParticipants((prev) => prev.filter((p) => p.peer_id !== data.peer_id));
            if (data.user?.name) {
              const leftName = data.user.name;
              const sysMsg: InMeetingMessage = {
                id: `sys-left-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                sender_name: 'Meeting System',
                sender_role: 'system',
                content: `${leftName} left the room`,
                timestamp: formatMessageTime(new Date().toISOString()),
              };
              setChatMessages((prev) => {
                const updated = [...prev, sysMsg];
                try {
                  localStorage.setItem(storageKey, JSON.stringify(updated));
                } catch {
                  // ignore
                }
                return updated;
              });
              toast(`${leftName} left the room.`);
            }

          } else if (data.type === 'peer_media_updated') {
            setParticipants((prev) =>
              prev.map((p) =>
                p.peer_id === data.peer_id
                  ? { ...p, ...data.media_state }
                  : p
              )
            );

          } else if (data.type === 'hand_raised') {
            setParticipants((prev) =>
              prev.map((p) =>
                p.peer_id === data.peer_id
                  ? { ...p, hand_raised: data.hand_raised }
                  : p
              )
            );
            if (data.hand_raised) {
              toast(`${data.sender_name} raised their hand ✋`);
            }

          } else if (data.type === 'meeting_chat_message') {
            setChatMessages((prev) => {
              if (data.id && prev.some((m) => m.id === data.id)) return prev;
              const incoming: InMeetingMessage = {
                id: data.id || `mc-${Date.now()}`,
                sender_name: data.sender_name || 'Participant',
                sender_role: data.sender_role || 'Student',
                content: data.content,
                timestamp: formatMessageTime(data.timestamp || new Date().toISOString()),
              };
              const updated = [...prev, incoming];
              try {
                localStorage.setItem(storageKey, JSON.stringify(updated));
              } catch {
                // ignore
              }
              return updated;
            });

          } else if (data.type === 'agenda_item_toggled') {
            setAgenda((prev) =>
              prev.map((item) =>
                item.id === data.item_id ? { ...item, completed: data.completed } : item
              )
            );
          }
        } catch (e) {
          console.debug('Meeting WS parse error:', e);
        }
      };

      ws.onclose = () => {
        setWsConnected(false);
      };
    } catch (e) {
      console.warn('Meeting WS failed to initialize:', e);
    }

    return () => {
      if (ws) {
        ws.close();
      }
      wsRef.current = null;
    };
  }, [isOpen, roomId, myId, myName, myRole, sessionPeerId, storageKey]);

  // Auto-scroll chat to latest message
  useEffect(() => {
    if (sidebarTab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, sidebarTab]);

  // 4. Media Controls
  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !next;
      });
    }
    wsRef.current?.send(JSON.stringify({ type: 'media_state', audio_muted: next }));
  };

  const toggleVideo = async () => {
    const next = !isVideoOff;
    setIsVideoOff(next);

    if (localStreamRef.current && localStreamRef.current.getVideoTracks().length > 0) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !next;
      });
    } else if (!next) {
      // Re-request camera stream if previously stopped
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
          audio: true,
        });
        localStreamRef.current = stream;
        setHasMediaPermission(true);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        toast.error('Unable to acquire camera stream.');
        setIsVideoOff(true);
      }
    }

    wsRef.current?.send(JSON.stringify({ type: 'media_state', video_off: next }));
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        if (!navigator.mediaDevices?.getDisplayMedia) {
          throw new Error('Screen sharing not supported on this browser/platform');
        }
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = screenStream;
        setIsScreenSharing(true);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }

        screenStream.getVideoTracks()[0].onended = () => {
          stopScreenShare();
        };

        wsRef.current?.send(JSON.stringify({ type: 'media_state', screen_sharing: true }));
        toast.success('Screen sharing active');
      } catch (err: any) {
        if (err.name !== 'NotAllowedError') {
          toast.error('Screen sharing was cancelled or unavailable.');
        }
      }
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
    }
    setIsScreenSharing(false);
    if (localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
    wsRef.current?.send(JSON.stringify({ type: 'media_state', screen_sharing: false }));
    toast('Screen sharing stopped');
  };

  const toggleHandRaise = () => {
    const next = !isHandRaised;
    setIsHandRaised(next);
    wsRef.current?.send(JSON.stringify({ type: 'raise_hand', hand_raised: next }));
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const content = chatInput.trim();
    const clientMsgId = `mc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const msgPayload = {
      type: 'meeting_chat',
      content,
      client_msg_id: clientMsgId
    };
    wsRef.current?.send(JSON.stringify(msgPayload));

    // Optimistically record in local state and persist to localStorage
    const localMsg: InMeetingMessage = {
      id: clientMsgId,
      sender_name: myName,
      sender_role: myRole,
      content,
      timestamp: formatMessageTime(new Date().toISOString()),
    };

    setChatMessages((prev) => {
      const updated = [...prev, localMsg];
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    setChatInput('');
  };

  const toggleAgendaItem = (itemId: string, currentVal: boolean) => {
    const next = !currentVal;
    setAgenda((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, completed: next } : item))
    );
    wsRef.current?.send(JSON.stringify({
      type: 'agenda_item_toggle',
      item_id: itemId,
      completed: next
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#0F172A] border border-slate-700 w-full max-w-7xl h-[94vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">

        {/* ─── Top Bar ────────────────────────────────────────────────────────── */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-[#0F172A]/90">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white">{roomTitle}</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800 font-semibold">
                  {wsConnected ? '● LIVE WEBSOCKET' : 'CONNECTING...'}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <Clock size={12} className="text-[#8AB4F8]" /> {formatTimer(secondsElapsed)} · Room ID: <code className="text-slate-300 font-mono">{roomId}</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <Users size={14} className="text-[#8AB4F8]" />
              {participants.length + 1} Attendees in Call
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Close View"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ─── Center Video Grid & Sidebar ───────────────────────────────────── */}
        <div className="flex-1 flex min-h-0 overflow-hidden relative">

          {/* 🔔 Floating Notification Banner on New Participant Join */}
          {joinNotification && (
            <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-none">
              <div className="bg-emerald-600/95 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-2xl flex items-center gap-2.5 border border-emerald-400/40 backdrop-blur-md">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                <span>👋 <strong>{joinNotification.name}</strong> ({joinNotification.role}) joined the meeting</span>
              </div>
            </div>
          )}
          
          {/* Video Grid */}
          <div className="flex-1 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 overflow-y-auto">

            {/* Local Participant (You) */}
            <div className="relative rounded-2xl bg-slate-900 border-2 border-slate-700 overflow-hidden flex flex-col items-center justify-center group shadow-lg min-h-[220px]">
              {isVideoOff ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-2xl font-bold shadow-md">
                    {myName.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <span className="text-xs text-slate-400 font-mono">Camera Off</span>
                </div>
              ) : (
                <div className="w-full h-full relative bg-slate-950 flex items-center justify-center">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                  {!hasMediaPermission && (
                    <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-24 h-24 rounded-full border-4 border-emerald-500/80 bg-slate-800 flex items-center justify-center shadow-xl animate-pulse">
                        <span className="text-3xl font-extrabold text-white">
                          {myName.split(' ').map((n) => n[0]).join('')}
                        </span>
                      </div>
                      <span className="mt-3 text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800">
                        Virtual Presentation Mode
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Status badges */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                <span className="text-[11px] font-bold bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl text-white border border-white/10 flex items-center gap-1.5">
                  {myName} (You · {myRole})
                </span>
                {isHandRaised && (
                  <span className="bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                    ✋ Raised Hand
                  </span>
                )}
              </div>

              {hasMediaPermission && !isVideoOff && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="text-[10px] font-mono bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    HD Feed
                  </span>
                </div>
              )}

              <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
                <div className={`p-1.5 rounded-lg ${isMuted ? 'bg-red-500/80 text-white' : 'bg-black/60 text-emerald-400'}`}>
                  {isMuted ? <MicOff size={14} /> : <Mic size={14} />}
                </div>
              </div>
            </div>

            {/* Remote Participants */}
            {participants.length === 0 && (
              <div className="relative rounded-2xl bg-slate-900/60 border-2 border-dashed border-slate-700/80 flex flex-col items-center justify-center p-8 text-center min-h-[220px]">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-3 animate-pulse">
                  <Users size={28} className="text-[#8AB4F8]" />
                </div>
                <h4 className="text-sm font-bold text-slate-200">Waiting for others to join...</h4>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  Open this meeting in a second browser window or tab to test real-time collaboration.
                </p>
                <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] text-emerald-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Live Room: {roomId}
                </div>
              </div>
            )}

            {participants.map((p) => (
              <div
                key={p.peer_id}
                className={`relative rounded-2xl bg-slate-900 border-2 overflow-hidden flex flex-col items-center justify-center shadow-lg transition-all min-h-[220px] ${
                  !p.audio_muted ? 'border-emerald-500/60 ring-2 ring-emerald-500/20' : 'border-slate-800'
                }`}
              >
                {p.video_off ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-600 to-rose-600 flex items-center justify-center text-2xl font-bold shadow-md">
                      {p.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <span className="text-xs text-slate-400 font-mono">Camera Off</span>
                  </div>
                ) : (
                  <div className="w-full h-full relative bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-24 h-24 rounded-full border-4 border-blue-500/80 bg-slate-800 flex items-center justify-center shadow-xl">
                      <span className="text-3xl font-extrabold text-white">
                        {p.name.split(' ').map((n) => n[0]).join('')}
                      </span>
                    </div>
                    <span className="mt-3 text-xs font-semibold text-slate-300 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700">
                      {p.role}
                    </span>
                  </div>
                )}

                {/* Info badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                  <span className="text-[11px] font-bold bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl text-white border border-white/10">
                    {p.name}
                  </span>
                  {p.hand_raised && (
                    <span className="bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                      ✋ Raised Hand
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
                  <div className={`p-1.5 rounded-lg ${p.audio_muted ? 'bg-red-500/80 text-white' : 'bg-black/60 text-emerald-400'}`}>
                    {p.audio_muted ? <MicOff size={14} /> : <Mic size={14} />}
                  </div>
                </div>
              </div>
            ))}

          </div>

          {/* ─── Expandable Sidebar (Agenda or Chat) ─────────────────────────── */}
          {sidebarTab && (
            <div className="w-80 sm:w-96 border-l border-slate-800 bg-[#0F172A] flex flex-col shrink-0">
              
              {/* Sidebar Tabs */}
              <div className="p-3 border-b border-slate-800 flex items-center gap-2 bg-slate-900/50">
                <button
                  onClick={() => setSidebarTab('agenda')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    sidebarTab === 'agenda'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <ListTodo size={14} /> Live Agenda
                </button>
                <button
                  onClick={() => setSidebarTab('chat')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors relative ${
                    sidebarTab === 'chat'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <MessageSquare size={14} /> Meeting Chat
                  {chatMessages.length > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-400/20 text-blue-300 font-mono">
                      {chatMessages.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {sidebarTab === 'agenda' ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Synchronized Agenda
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        {agenda.filter((a) => a.completed).length} / {agenda.length} Done
                      </span>
                    </div>

                    <div className="space-y-2">
                      {agenda.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => toggleAgendaItem(item.id, item.completed)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                            item.completed
                              ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-200 line-through'
                              : 'bg-slate-850 border-slate-800 text-slate-200 hover:border-slate-750'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => {}}
                            className="mt-0.5 rounded accent-emerald-500"
                          />
                          <span className="leading-relaxed">{item.text}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                      💡 <strong>Real-time Agenda Sync:</strong> Toggling any deliverable item broadcasts an instantaneous state update to all attendees.
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col h-full">
                    <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
                      {chatMessages.length === 0 ? (
                        <div className="text-center py-8 text-xs text-slate-500">
                          <MessageSquare size={24} className="mx-auto mb-2 opacity-40 text-blue-400" />
                          No messages yet. Send a note to call attendees!
                        </div>
                      ) : (
                        chatMessages.map((msg) => {
                          if (msg.sender_role === 'system') {
                            return (
                              <div
                                key={msg.id}
                                className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 italic flex items-center justify-between"
                              >
                                <span>{msg.content}</span>
                                <span className="text-[10px] text-slate-500 font-mono ml-2 shrink-0">{msg.timestamp}</span>
                              </div>
                            );
                          }

                          const isMe = msg.sender_name === myName;
                          return (
                            <div
                              key={msg.id}
                              className={`p-2.5 rounded-xl border text-xs ${
                                isMe
                                  ? 'bg-blue-950/40 border-blue-800/80'
                                  : 'bg-slate-850 border-slate-800'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className={`font-bold flex items-center gap-1.5 ${isMe ? 'text-blue-300' : 'text-blue-400'}`}>
                                  {msg.sender_name}
                                  {msg.sender_role && (
                                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-normal">
                                      {msg.sender_role}
                                    </span>
                                  )}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                              </div>
                              <p className="text-slate-100 leading-relaxed break-words">{msg.content}</p>
                            </div>
                          );
                        })
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={handleSendChatMessage} className="mt-3 flex gap-2 pt-2 border-t border-slate-800">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Type a message to attendees..."
                        className="input flex-1 text-xs bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-blue-500"
                      />
                      <button
                        type="submit"
                        className="btn-primary text-xs px-3.5 rounded-xl bg-blue-600 hover:bg-blue-500"
                        title="Send message"
                      >
                        <Send size={14} />
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* ─── Bottom Call Controls Bar ───────────────────────────────────────── */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#0F172A] flex items-center justify-between shrink-0">
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">
              Secure WebRTC & WebSocket Stream
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Mic Button */}
            <button
              onClick={toggleMute}
              className={`p-3.5 rounded-2xl font-bold transition-all ${
                isMuted
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              }`}
              title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
            >
              {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            {/* Video Button */}
            <button
              onClick={toggleVideo}
              className={`p-3.5 rounded-2xl font-bold transition-all ${
                isVideoOff
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              }`}
              title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
            >
              {isVideoOff ? <VideoOff size={18} /> : <Video size={18} />}
            </button>

            {/* Screen Share Button */}
            <button
              onClick={toggleScreenShare}
              className={`p-3.5 rounded-2xl font-bold transition-all ${
                isScreenSharing
                  ? 'bg-blue-600 text-white border border-blue-500 shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              }`}
              title="Share Screen"
            >
              {isScreenSharing ? <MonitorOff size={18} /> : <Monitor size={18} />}
            </button>

            {/* Raise Hand Button */}
            <button
              onClick={toggleHandRaise}
              className={`p-3.5 rounded-2xl font-bold transition-all ${
                isHandRaised
                  ? 'bg-amber-500 text-black border border-amber-400 shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              }`}
              title="Raise Hand"
            >
              <Hand size={18} />
            </button>

            {/* Sidebar Toggle Button */}
            <button
              onClick={() => setSidebarTab(sidebarTab ? null : 'agenda')}
              className={`p-3.5 rounded-2xl font-bold transition-all ${
                sidebarTab
                  ? 'bg-slate-700 text-white border border-slate-600'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              }`}
              title="Toggle Agenda / Chat Sidebar"
            >
              <ListTodo size={18} />
            </button>

            {/* Leave / End Call Button */}
            <button
              onClick={onClose}
              className="px-5 py-3.5 rounded-2xl font-bold bg-red-600 hover:bg-red-500 text-white flex items-center gap-2 shadow-lg shadow-red-900/40 transition-all ml-2"
            >
              <PhoneOff size={18} />
              <span className="hidden sm:inline text-xs">Leave Meeting</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-500 hidden md:inline">
              100% Zero-Cloud Cost
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default LiveMeetingModal;
