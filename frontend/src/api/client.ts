// API client for connecting the frontend to the backend REST and WebSocket services

const API_BASE = '/api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: string;
  department: string;
  student_id?: string;
}

export interface ProposalPayload {
  title: string;
  problem_statement: string;
  methodology?: string;
  primary_advisor_id: string;
  co_advisor_id?: string;
}

export const api = {
  // Auth
  async login(payload: LoginPayload) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let errMsg = 'Failed to login';
        try {
          const err = await res.json();
          errMsg = err.detail || errMsg;
        } catch (_) {}
        // If server returned 500, 502, 504 (e.g. proxy couldn't reach backend), mark as offline
        if (res.status >= 500) {
          throw new Error('BACKEND_OFFLINE');
        }
        throw new Error(errMsg);
      }
      return res.json();
    } catch (e: any) {
      if (e.message !== 'BACKEND_OFFLINE' && (e.name === 'TypeError' || e.message.includes('fetch') || e.message.includes('Failed to fetch'))) {
        throw new Error('BACKEND_OFFLINE');
      }
      throw e;
    }
  },

  async register(payload: RegisterPayload) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to register');
    }
    return res.json();
  },

  // Proposals
  async getProposals() {
    const res = await fetch(`${API_BASE}/proposals/`);
    if (!res.ok) throw new Error('Failed to fetch proposals');
    return res.json();
  },

  async submitProposal(payload: ProposalPayload) {
    const res = await fetch(`${API_BASE}/proposals/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to submit proposal');
    }
    return res.json();
  },

  async updateProposalStatus(proposalId: string, newStatus: string) {
    const res = await fetch(`${API_BASE}/proposals/${proposalId}/status?new_status=${newStatus}`, {
      method: 'PUT',
    });
    if (!res.ok) throw new Error('Failed to update proposal status');
    return res.json();
  },

  // AI Matching & NLP Engine
  async getFaculty() {
    const res = await fetch(`${API_BASE}/matching/faculty`);
    if (!res.ok) throw new Error('Failed to fetch faculty profiles');
    return res.json();
  },

  async extractEntities(title: string, problemStatement: string) {
    const res = await fetch(`${API_BASE}/matching/extract-entities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, problem_statement: problemStatement }),
    });
    if (!res.ok) throw new Error('Failed to extract project entities');
    return res.json();
  },

  async discoverAdvisors(payload: { title?: string; problem_statement: string; team_skills?: string[]; department_filter?: string; min_tier?: number } | string) {
    const body = typeof payload === 'string' ? { problem_statement: payload } : payload;
    const res = await fetch(`${API_BASE}/matching/discover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('Failed to discover advisors');
    return res.json();
  },

  async getXAI(expertId: string, title?: string, problemStatement?: string) {
    const params = new URLSearchParams();
    if (title) params.append('title', title);
    if (problemStatement) params.append('problem_statement', problemStatement);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE}/matching/xai/${expertId}${queryString}`);
    if (!res.ok) throw new Error('Failed to fetch XAI breakdown');
    return res.json();
  },

  async optimizeCoAdvisor(payload: { primary_advisor_id: string; required_skills: string[]; team_skills?: string[] }) {
    const res = await fetch(`${API_BASE}/matching/optimize-coadvisor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to optimize co-advisors');
    return res.json();
  },

  // Team Chat
  async getChatHistory(channelId: string) {
    const res = await fetch(`${API_BASE}/chat/messages/${channelId}`);
    if (!res.ok) throw new Error('Failed to fetch chat history');
    return res.json();
  },

  async sendChatMessage(channelId: string, content: string) {
    const res = await fetch(`${API_BASE}/chat/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel_id: channelId, content }),
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  },

  // Audit
  async getAuditTrail() {
    const res = await fetch(`${API_BASE}/audit/blocks`);
    if (!res.ok) throw new Error('Failed to fetch audit blocks');
    return res.json();
  },

  async verifyAuditLedger() {
    const res = await fetch(`${API_BASE}/audit/verify`);
    if (!res.ok) throw new Error('Failed to verify audit ledger');
    return res.json();
  },
};
