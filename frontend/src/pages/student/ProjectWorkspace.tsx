import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  FolderKanban, CheckSquare, MessageSquare, Paperclip, Send, Download, 
  FileText, Clock, Users, Shield, Plus, Upload, BookOpen, Video, ExternalLink
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useApp } from '../../context/AppContext';
import { mockWorkspace } from '../../data/mockData';
import { api, getWsUrl, formatMessageTime } from '../../api/client';
import { LiveMeetingModal } from '../../components/meeting/LiveMeetingModal';
import type { WorkspaceMessage, WorkspaceFile } from '../../types';

export const ProjectWorkspace: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useApp();

  const isFaculty = currentUser?.role === 'faculty' || currentUser?.id === 'exp-1';
  const initialTab = searchParams.get('tab') === 'discussion' || searchParams.get('tab') === 'chat' 
    ? 'discussion' 
    : 'milestones';

  const [activeTab, setActiveTab] = useState<'milestones' | 'discussion' | 'files' | 'notes'>(initialTab);
  const [messages, setMessages] = useState<WorkspaceMessage[]>(mockWorkspace.messages);
  const [newMessage, setNewMessage] = useState('');
  const [files, setFiles] = useState<WorkspaceFile[]>(mockWorkspace.files);
  const [milestones, setMilestones] = useState(mockWorkspace.milestones);
  const [isMeetingOpen, setIsMeetingOpen] = useState(false);
  const [wsStatus, setWsStatus] = useState<'connected' | 'connecting' | 'offline'>('connecting');
  const [clientId] = useState(() => `client-${Math.random().toString(36).substring(2, 9)}`);

  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const unreadCount = messages.filter((m) => !m.read).length;

  // Respond to URL tab changes
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'discussion' || tabParam === 'chat') {
      setActiveTab('discussion');
    }
  }, [searchParams]);

  // Load backend chat history on mount
  useEffect(() => {
    api.getChatHistory('ch-general')
      .then((history) => {
        if (history && Array.isArray(history) && history.length > 0) {
          const seen = new Set<string>();
          const deduped: WorkspaceMessage[] = [];
          for (const m of history) {
            const key = `${m.sender_id || m.sender_name}-${m.content}-${Math.floor(new Date(m.timestamp).getTime() / 4000)}`;
            if (!seen.has(key)) {
              seen.add(key);
              deduped.push({
                id: String(m.id),
                senderId: m.sender_id || 'stu-1',
                senderName: m.sender_name || 'Team Member',
                content: m.content,
                timestamp: m.timestamp || new Date().toISOString(),
                read: true,
              });
            }
          }
          if (deduped.length > 0) {
            setMessages(deduped);
          }
        }
      })
      .catch((err) => {
        console.debug('Workspace chat history fallback:', err.message);
      });
  }, []);

  // Live WebSocket for Supervision Feed
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimer: any = null;
    let isDisposed = false;

    const connectWs = () => {
      if (isDisposed) return;
      try {
        setWsStatus('connecting');
        const url = getWsUrl('chat/ws/ch-general');
        ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
          if (!isDisposed) setWsStatus('connected');
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'new_message' || data.content) {
              // Ignore messages sent by our own browser tab
              if (data.client_id && data.client_id === clientId) return;

              setMessages((prev) => {
                // Deduplicate by ID, client_msg_id, or identical content+sender within 5s
                const isDuplicate = prev.some((m) => {
                  if (data.id && m.id === String(data.id)) return true;
                  if (data.client_msg_id && m.id === data.client_msg_id) return true;
                  if (m.content === data.content && (m.senderId === data.sender_id || m.senderName === data.sender_name)) {
                    const msgTime = new Date(m.timestamp).getTime();
                    const incomingTime = new Date(data.timestamp || Date.now()).getTime();
                    if (Math.abs(msgTime - incomingTime) < 5000) return true;
                  }
                  return false;
                });
                if (isDuplicate) return prev;

                return [
                  ...prev,
                  {
                    id: String(data.id || data.client_msg_id || `ws-${Date.now()}`),
                    senderId: data.sender_id || 'stu-1',
                    senderName: data.sender_name || 'Team Member',
                    content: data.content,
                    timestamp: data.timestamp || new Date().toISOString(),
                    read: true,
                  },
                ];
              });
            }
          } catch (e) {
            // ignore
          }
        };

        ws.onclose = () => {
          if (!isDisposed) {
            setWsStatus('offline');
            reconnectTimer = setTimeout(connectWs, 3000);
          }
        };

        ws.onerror = () => {
          if (!isDisposed) setWsStatus('offline');
        };
      } catch (e) {
        if (!isDisposed) {
          setWsStatus('offline');
          reconnectTimer = setTimeout(connectWs, 4000);
        }
      }
    };

    connectWs();

    return () => {
      isDisposed = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (ws) ws.close();
      wsRef.current = null;
    };
  }, [clientId]);

  useEffect(() => {
    if (activeTab === 'discussion') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const content = newMessage.trim();
    const mySenderId = currentUser?.id || (isFaculty ? 'exp-1' : 'stu-1');
    const mySenderName = currentUser?.name || (isFaculty ? 'Md. Shohel Arman' : 'Abu Zafor');

    const tempId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const localMsg: WorkspaceMessage = {
      id: tempId,
      senderId: mySenderId,
      senderName: mySenderName,
      content: content,
      timestamp: new Date().toISOString(),
      read: true,
    };

    setMessages((prev) => [...prev, localMsg]);
    setNewMessage('');

    // If WebSocket is open, send ONLY via WebSocket (persists to DB and broadcasts to peers)
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(
          JSON.stringify({
            type: 'chat_message',
            content: content,
            sender_id: mySenderId,
            sender_name: mySenderName,
            client_id: clientId,
            client_msg_id: tempId,
          })
        );
      } catch (e) {
        // ignore
      }
    } else {
      // Fallback to REST API ONLY when WebSocket is disconnected
      try {
        await api.sendChatMessage('ch-general', content, mySenderId, mySenderName, clientId, tempId);
      } catch (err: any) {
        console.debug('REST message fallback:', err.message);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Over 25MB validation
    if (file.size > 25 * 1024 * 1024) {
      toast.error('Attachment exceeds 25 MB limit. Please use GitHub or Google Drive and paste the link.');
      return;
    }

    const newFile: WorkspaceFile = {
      id: `file-${Date.now()}`,
      name: file.name,
      size: file.size,
      type: file.name.split('.').pop() || 'pdf',
      uploadedBy: currentUser?.name || 'Abu Zafor',
      uploadedAt: new Date().toISOString(),
      url: '#',
    };

    setFiles([newFile, ...files]);
    toast.success(`Uploaded "${file.name}" to project repository.`);
  };

  const toggleMilestone = (id: string) => {
    toast.success('Milestone deliverable marked as completed.');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24">
      {/* Project Top Card */}
      <div className="card p-6 md:p-8 bg-white border border-[#E2E8F0] shadow-sm rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-3 py-1 rounded-full font-semibold bg-[#A7E8D0]/30 text-[#1E293B] border border-[#A7E8D0]">
              Stage 3: Active Supervision
            </span>
            <span className="text-xs text-[#64748B]">· Fall 2026 Capstone Group #32</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1E293B]">{mockWorkspace.projectTitle}</h1>
          <p className="text-xs text-[#64748B] mt-1">
            Supervised by: <strong className="text-[#1E293B]">Md. Shohel Arman</strong> (Department of Software Engineering)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right bg-[#F4F8FF] p-3.5 rounded-2xl border border-[#E2E8F0]">
            <span className="text-[10px] text-[#64748B] uppercase font-bold block">Target Final Defense</span>
            <span className="text-sm font-mono font-bold text-[#1E293B]">Dec 20, 2026</span>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-[#E2E8F0] space-x-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('milestones')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'milestones'
              ? 'border-[#8AB4F8] text-[#1E293B]'
              : 'border-transparent text-[#64748B] hover:text-[#1E293B]'
          }`}
        >
          <CheckSquare size={16} className="text-[#8AB4F8]" /> Deliverable Milestones
        </button>

        <button
          onClick={() => setActiveTab('discussion')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors relative ${
            activeTab === 'discussion'
              ? 'border-[#8AB4F8] text-[#1E293B]'
              : 'border-transparent text-[#64748B] hover:text-[#1E293B]'
          }`}
        >
          <MessageSquare size={16} className="text-[#8AB4F8]" /> Live Supervision Feed
          {unreadCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#8AB4F8] text-[#1E293B] text-[10px] flex items-center justify-center font-mono font-bold">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('files')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'files'
              ? 'border-[#8AB4F8] text-[#1E293B]'
              : 'border-transparent text-[#64748B] hover:text-[#1E293B]'
          }`}
        >
          <Paperclip size={16} className="text-[#8AB4F8]" /> Repository & Artifacts ({files.length})
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'notes'
              ? 'border-[#8AB4F8] text-[#1E293B]'
              : 'border-transparent text-[#64748B] hover:text-[#1E293B]'
          }`}
        >
          <BookOpen size={16} className="text-[#8AB4F8]" /> Consultation Notes Archive
        </button>
      </div>

      {/* Tab 1: Milestones */}
      {activeTab === 'milestones' && (
        <div className="card p-6 md:p-8 space-y-5 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#1E293B]">Agreed Capstone Milestones</h2>
              <p className="text-xs text-[#64748B]">Formally tracked by academic coordinator for BAETE Criterion 4 & 5</p>
            </div>
            <span className="text-xs font-bold text-[#1E293B] bg-[#A7E8D0]/30 px-3 py-1 rounded-full border border-[#A7E8D0]">
              2 of 4 Milestones Cleared
            </span>
          </div>

          <div className="space-y-3">
            {milestones.map((m, idx) => (
              <div
                key={m.id}
                className="p-4 rounded-2xl border border-[#E2E8F0] bg-[#F4F8FF] flex items-start gap-4 hover:border-[#8AB4F8]/50 transition-colors"
              >
                <input
                  type="checkbox"
                  defaultChecked={idx < 2}
                  onChange={() => toggleMilestone(m.id)}
                  className="mt-1 w-4 h-4 rounded accent-[#8AB4F8] cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#1E293B]">
                      M{idx + 1}: {m.title}
                    </span>
                    <span className="text-xs font-mono font-medium text-[#64748B]">
                      Due: {m.dueDate}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Discussion Feed */}
      {activeTab === 'discussion' && (
        <div className="card p-6 md:p-8 space-y-4 flex flex-col h-[540px] bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  wsStatus === 'connected'
                    ? 'bg-emerald-500 animate-pulse'
                    : wsStatus === 'connecting'
                    ? 'bg-amber-400 animate-ping'
                    : 'bg-slate-400'
                }`}
              />
              <span className="text-xs font-bold text-[#1E293B]">
                Live Supervision Channel (#edgeshield-supervision)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border bg-slate-50 text-slate-600">
                {wsStatus === 'connected' ? 'WebSocket Live' : wsStatus === 'connecting' ? 'Connecting...' : 'Offline'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(isFaculty ? '/faculty/chat' : '/student/chat')}
                className="btn-secondary text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 font-semibold hover:border-blue-400"
                title="Open Discord-style multi-channel chat"
              >
                <MessageSquare size={13} className="text-blue-600" /> Open Full Team Chat
              </button>
              <button
                onClick={() => setIsMeetingOpen(true)}
                className="btn-primary text-xs px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1 font-semibold shadow-xs"
              >
                <Video size={13} /> Join Live Video Room
              </button>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {messages.map((msg) => {
              const isMe =
                msg.senderId === currentUser?.id ||
                (isFaculty && msg.senderId === 'exp-1') ||
                (!isFaculty && msg.senderId === 'stu-1');
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold text-[#1E293B]">
                      {msg.senderName}
                    </span>
                    <span className="text-[10px] text-[#64748B] font-mono">
                      {formatMessageTime(msg.timestamp)}
                    </span>
                  </div>
                  <div
                    className={`p-3.5 rounded-2xl max-w-lg text-xs leading-relaxed ${
                      isMe
                        ? 'bg-[#8AB4F8] text-[#1E293B] font-medium rounded-br-none shadow-2xs'
                        : 'bg-[#F4F8FF] text-[#334155] border border-[#E2E8F0] rounded-bl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-[#E2E8F0]">
            <input
              type="text"
              placeholder="Post an update or question to the supervisory channel..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="input text-xs flex-1"
            />
            <button type="submit" className="btn-primary text-xs px-5 py-2.5 rounded-xl font-semibold shadow-sm">
              <Send size={14} /> Send
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Files & Artifacts */}
      {activeTab === 'files' && (
        <div className="card p-6 md:p-8 space-y-5 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#1E293B]">Project Artifact Repository</h2>
              <p className="text-xs text-[#64748B]">Architecture diagrams, datasets, and design specifications (Max 25 MB per file)</p>
            </div>
            
            <label className="btn-primary text-xs cursor-pointer px-4 py-2 rounded-xl font-semibold shadow-sm">
              <Upload size={14} /> Upload Artifact
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="p-4 rounded-2xl border border-[#E2E8F0] bg-[#F4F8FF] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#EAF2FF] border border-[#8AB4F8]/40 text-[#1E293B]">
                    <FileText size={20} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#1E293B] block">{file.name}</span>
                    <span className="text-[11px] text-[#64748B]">
                      {(file.size / 1024 / 1024).toFixed(2)} MB · Uploaded by {file.uploadedBy} on {new Date(file.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toast.success(`Initiating download for ${file.name}`)}
                  className="btn-secondary text-xs py-1.5 px-3.5 rounded-xl"
                >
                  <Download size={13} /> Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Consultation Notes Archive */}
      {activeTab === 'notes' && (
        <div className="card p-6 md:p-8 space-y-4 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
          <h2 className="text-base font-bold text-[#1E293B]">Supervisory Consultation Archive</h2>
          <p className="text-xs text-[#64748B]">Historical records of office-hour meetings, directives, and scope approvals</p>

          <div className="space-y-3">
            <div className="p-5 rounded-2xl border border-[#E2E8F0] bg-[#F4F8FF] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#1E293B]">
                <span>Session #1: Hardware & BLE Architectural Review</span>
                <span className="font-mono text-[#64748B]">Nov 07, 2026 (14:00 - 14:30)</span>
              </div>
              <p className="text-xs text-[#334155] leading-relaxed">
                "Advised team to adopt ARM CMSIS-NN library for the 1D-CNN classifier to keep latency below 4.5ms on Cortex-M4. Team demonstrated working BLE advertisement with AES-128-GCM authentication."
              </p>
              <div className="text-[11px] text-[#1E293B] bg-white p-2.5 rounded-xl border border-[#E2E8F0] font-semibold">
                Action Item: Produce comparative table of CMSIS-NN vs TFLite-Micro before next milestone.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Video Meeting Modal */}
      <LiveMeetingModal
        isOpen={isMeetingOpen}
        onClose={() => setIsMeetingOpen(false)}
        roomId="room-edgeshield"
        roomTitle="EdgeShield · Live Project Advisory Meeting"
        currentUser={currentUser}
      />
    </div>
  );
};

export default ProjectWorkspace;

