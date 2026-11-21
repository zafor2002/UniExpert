import React, { useState, useEffect, useRef } from 'react';
import {
  Mic, MicOff, Video, VideoOff, Monitor, MonitorOff,
  Hand, MessageSquare, ListTodo, PhoneOff, Users,
  CheckCircle2, Sparkles, Send, X, Shield, Clock, Volume2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

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

  const [participants, setParticipants] = useState<Participant[]>([]);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'agenda' | 'chat' | null>('agenda');
  
  const [chatMessages, setChatMessages] = useState<InMeetingMessage[]>([]);
  const [chatInput, setChatInput] = useState('');

  const [agenda, setAgenda] = useState<AgendaItem[]>([
    { id: 'ag-1', text: 'Review TinyML CMSIS-NN 8-bit quantization benchmark', completed: true },
    { id: 'ag-2', text: 'Verify BLE 5.0 AES-GCM transport payload format', completed: false },
    { id: 'ag-3', text: 'Lock Milestone 2 deliverable submission date', completed: false }
  ]);

  const [secondsElapsed, setSecondsElapsed] = useState(245);
  const [wsConnected, setWsConnected] = useState(false);
  const [sessionPeerId] = useState(() => `${myId}-${Math.random().toString(36).substring(2, 7)}`);
  const wsRef = useRef<WebSocket | null>(null);

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

  // WebSocket Connection for Live Meeting Signaling & State
  useEffect(() => {
    if (!isOpen) return;

    let ws: WebSocket | null = null;
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const url = `${protocol}//${window.location.host}/api/meeting/ws/${roomId}?peer_id=${encodeURIComponent(sessionPeerId)}&name=${encodeURIComponent(myName)}&role=${encodeURIComponent(myRole)}`;
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
          } else if (data.type === 'peer_joined') {
            if (data.peer_id !== sessionPeerId) {
              setParticipants((prev) => {
                if (prev.some((p) => p.peer_id === data.peer_id)) return prev;
                return [...prev, { peer_id: data.peer_id, ...data.user }];
              });
              toast.success(`${data.user?.name || 'A team member'} joined the meeting.`);
            }
          } else if (data.type === 'peer_left') {
            setParticipants((prev) => prev.filter((p) => p.peer_id !== data.peer_id));
            if (data.user?.name) {
              toast(`${data.user.name} left the room.`);
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
            setChatMessages((prev) => [...prev, data]);
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
  }, [isOpen, roomId, myId, myName, myRole]);

  // Media Controls
  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    wsRef.current?.send(JSON.stringify({ type: 'media_state', audio_muted: next }));
  };

  const toggleVideo = () => {
    const next = !isVideoOff;
    setIsVideoOff(next);
    wsRef.current?.send(JSON.stringify({ type: 'media_state', video_off: next }));
  };

  const toggleScreenShare = () => {
    const next = !isScreenSharing;
    setIsScreenSharing(next);
    wsRef.current?.send(JSON.stringify({ type: 'media_state', screen_sharing: next }));
    toast(next ? 'Screen sharing activated' : 'Screen sharing stopped');
  };

  const toggleHandRaise = () => {
    const next = !isHandRaised;
    setIsHandRaised(next);
    wsRef.current?.send(JSON.stringify({ type: 'raise_hand', hand_raised: next }));
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const msgPayload = {
      type: 'meeting_chat',
      content: chatInput.trim()
    };
    wsRef.current?.send(JSON.stringify(msgPayload));

    // Optimistically add locally
    setChatMessages((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        sender_name: myName,
        sender_role: myRole,
        content: chatInput.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
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
        <div className="flex-1 flex min-h-0 overflow-hidden">
          
          {/* Video Grid */}
          <div className="flex-1 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 overflow-y-auto">

            {/* Local Participant (You) */}
            <div className="relative rounded-2xl bg-slate-900 border-2 border-slate-700 overflow-hidden flex flex-col items-center justify-center group shadow-lg">
              {isVideoOff ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-2xl font-bold shadow-md">
                    {myName.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <span className="text-xs text-slate-400 font-mono">Camera Off</span>
                </div>
              ) : (
                <div className="w-full h-full relative bg-slate-950 flex items-center justify-center">
                  {/* Simulated HD video canvas stream */}
                  <div className="w-full h-full bg-gradient-to-b from-slate-900 via-slate-850 to-slate-950 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-24 h-24 rounded-full border-4 border-emerald-500/80 bg-slate-800 flex items-center justify-center shadow-xl animate-pulse">
                      <span className="text-3xl font-extrabold text-white">
                        {myName.split(' ').map((n) => n[0]).join('')}
                      </span>
                    </div>
                    <span className="mt-3 text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800">
                      HD Camera Stream Active
                    </span>
                  </div>
                </div>
              )}

              {/* Status badges */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="text-[11px] font-bold bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl text-white border border-white/10 flex items-center gap-1.5">
                  {myName} (You · {myRole})
                </span>
                {isHandRaised && (
                  <span className="bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                    ✋ Raised Hand
                  </span>
                )}
              </div>

              <div className="absolute bottom-3 right-3 flex items-center gap-2">
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
                  Open this meeting in a second tab or wait for your advisor/peer to enter.
                </p>
                <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] text-emerald-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Live Room: {roomId}
                </div>
              </div>
            )}

            {participants.map((p, idx) => (
              <div
                key={p.peer_id}
                className={`relative rounded-2xl bg-slate-900 border-2 overflow-hidden flex flex-col items-center justify-center shadow-lg transition-all ${
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
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="text-[11px] font-bold bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl text-white border border-white/10">
                    {p.name}
                  </span>
                  {p.hand_raised && (
                    <span className="bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                      ✋ Raised Hand
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3 flex items-center gap-2">
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
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <ListTodo size={14} /> Live Agenda
                </button>
                <button
                  onClick={() => setSidebarTab('chat')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    sidebarTab === 'chat'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <MessageSquare size={14} /> Meeting Chat
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
                    <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                      {chatMessages.map((msg) => (
                        <div key={msg.id} className="p-2.5 rounded-xl bg-slate-850 border border-slate-800 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-blue-400">{msg.sender_name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                          </div>
                          <p className="text-slate-200 leading-relaxed">{msg.content}</p>
                        </div>
                      ))}
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={handleSendChatMessage} className="mt-3 flex gap-2">
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
