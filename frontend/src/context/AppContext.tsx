import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import type { UserRole, Expert, Student, AdvisoryProposal, Notification } from '../types';
import { mockStudents, mockExperts, mockProposals, mockNotifications, officeHoursTemplate } from '../data/mockData';
import { api } from '../api/client';

interface AppState {
  currentRole: UserRole;
  currentUser: Student | Expert | null;
  darkMode: boolean;
  experts: Expert[];
  proposals: AdvisoryProposal[];
  notifications: Notification[];
  compareList: string[];
  isAuthenticated: boolean;
  mfaRequired: boolean;
  loginAttempts: number;
  lockedUntil: Date | null;
  vectorSearchOnline: boolean;
}

interface AppContextType extends AppState {
  setRole: (role: UserRole) => void;
  toggleDarkMode: () => void;
  addToCompare: (expertId: string) => boolean;
  removeFromCompare: (expertId: string) => void;
  clearCompare: () => void;
  updateProposal: (proposal: AdvisoryProposal) => void;
  addProposal: (proposal: AdvisoryProposal) => void;
  updateExpertQuota: (expertId: string, delta: number) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (n: Notification) => void;
  login: (email: string, _password: string, targetRole?: UserRole) => { success: boolean; message: string; requiresMfa?: boolean; role?: UserRole };
  setAuthSession: (user: Student | Expert, role: UserRole, token?: string) => void;
  logout: () => void;
  submitMfa: (code: string) => { success: boolean; message: string };
  incrementLoginAttempts: () => void;
  resetLockout: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const roleUserMap: Record<UserRole, Student | Expert> = {
  student: mockStudents[0],
  faculty: mockExperts[0],
  mentor: mockExperts[3],
  coordinator: { id: 'coord-1', name: 'Prof. Dr. Syed Akhter Hossain', email: 'coord@diu.edu.bd', role: 'coordinator', department: 'Software Engineering' } as unknown as Expert,
  admin: { id: 'admin-1', name: 'System Administrator', email: 'admin@diu.edu.bd', role: 'admin', department: 'IT' } as unknown as Expert,
  auditor: { id: 'audit-1', name: 'DIU Quality Assurance Cell', email: 'qa@diu.edu.bd', role: 'auditor', department: 'QA' } as unknown as Expert,
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    let savedRole: UserRole = 'student';
    let savedUser: Student | Expert = mockStudents[0];
    let isAuth = false;

    try {
      const savedToken = typeof window !== 'undefined' ? localStorage.getItem('uniexpert_token') : null;
      const savedUserStr = typeof window !== 'undefined' ? localStorage.getItem('uniexpert_user') : null;
      if (savedToken && savedUserStr) {
        const u = JSON.parse(savedUserStr);
        if (u.role && roleUserMap[u.role as UserRole]) {
          savedRole = u.role as UserRole;
          savedUser = roleUserMap[savedRole] || mockStudents[0];
          isAuth = true;
        }
      }
    } catch {
      // ignore
    }

    return {
      currentRole: savedRole,
      currentUser: savedUser,
      darkMode: false,
      experts: mockExperts,
      proposals: mockProposals,
      notifications: mockNotifications,
      compareList: [],
      isAuthenticated: isAuth,
      mfaRequired: false,
      loginAttempts: 0,
      lockedUntil: null,
      vectorSearchOnline: true,
    };
  });

  // Check saved session & sync proposals from backend
  useEffect(() => {
    // Fetch live 50 faculty profiles from backend SQLite
    api.getFaculty()
      .then((facList) => {
        if (facList && Array.isArray(facList) && facList.length > 0) {
          const mapped = facList.map((f: any) => ({
            id: f.id,
            name: f.name,
            email: `${f.id}@diu.edu.bd`,
            role: f.is_industry ? ('mentor' as const) : ('faculty' as const),
            department: f.department,
            title: f.title,
            tier: f.tier,
            slotsUsed: f.slots_used,
            slotsTotal: f.slots_total,
            quotaStatus: f.quota_status,
            researchAreas: f.research_areas || [],
            skills: f.skills || [],
            hIndex: f.h_index || 10,
            publications: f.publications || [],
            bio: f.bio || '',
            isIndustry: Boolean(f.is_industry),
            rating: 4.8,
            officeHours: officeHoursTemplate,
          }));
          setState(prev => ({ ...prev, experts: mapped }));
        }
      })
      .catch((err) => {
        console.warn('Backend faculty sync fallback:', err.message);
      });

    // Attempt to fetch saved proposals from backend API
    api.getProposals()
      .then((backendProps) => {
        if (backendProps && backendProps.length > 0) {
          const mapped = backendProps.map((bp: any) => ({
            id: bp.id,
            studentId: bp.student_id,
            expertId: bp.primary_advisor_id,
            projectTitle: bp.title,
            synopsis: bp.problem_statement,
            milestones: [
              { id: 'm1', title: 'Architecture Review', dueDate: '2026-11-20', description: 'Core system specs' },
              { id: 'm2', title: 'Implementation Validation', dueDate: '2026-12-10', description: 'Live prototype tests' }
            ],
            weeklyCommitment: 10,
            meetingFrequency: 'Weekly',
            motivation: bp.methodology || '',
            scope: bp.co_advisor_id ? 'co_advisor' : 'primary',
            state: bp.status,
            aiAlignmentScore: 92,
            createdAt: bp.created_at,
            updatedAt: bp.created_at,
            timeline: [
              { id: `ev-${bp.id}`, state: bp.status, timestamp: bp.created_at, actor: 'System', note: 'Synced from backend database' }
            ]
          }));
          setState(prev => {
            const existingIds = new Set(prev.proposals.map(p => p.id));
            const uniqueNew = mapped.filter((p: any) => !existingIds.has(p.id));
            return {
              ...prev,
              proposals: [...uniqueNew, ...prev.proposals]
            };
          });
        }
      })
      .catch((err) => {
        console.warn('Backend proposals sync:', err.message);
      });
  }, []);

  const setRole = useCallback((role: UserRole) => {
    setState(prev => ({
      ...prev,
      currentRole: role,
      currentUser: roleUserMap[role],
    }));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setState(prev => {
      const next = !prev.darkMode;
      if (next) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      return { ...prev, darkMode: next };
    });
  }, []);

  const addToCompare = useCallback((expertId: string) => {
    let success = false;
    setState(prev => {
      if (prev.compareList.includes(expertId)) return prev;
      if (prev.compareList.length >= 3) return prev;
      success = true;
      return { ...prev, compareList: [...prev.compareList, expertId] };
    });
    return success;
  }, []);

  const removeFromCompare = useCallback((expertId: string) => {
    setState(prev => ({ ...prev, compareList: prev.compareList.filter(id => id !== expertId) }));
  }, []);

  const clearCompare = useCallback(() => {
    setState(prev => ({ ...prev, compareList: [] }));
  }, []);

  const updateProposal = useCallback((proposal: AdvisoryProposal) => {
    setState(prev => ({
      ...prev,
      proposals: prev.proposals.map(p => p.id === proposal.id ? proposal : p),
    }));
  }, []);

  const addProposal = useCallback((proposal: AdvisoryProposal) => {
    setState(prev => ({
      ...prev,
      proposals: [proposal, ...prev.proposals.filter(p => p.id !== proposal.id)],
    }));
  }, []);

  const updateExpertQuota = useCallback((expertId: string, delta: number) => {
    setState(prev => ({
      ...prev,
      experts: prev.experts.map(e => {
        if (e.id !== expertId) return e;
        const newUsed = Math.max(0, Math.min(e.slotsTotal, e.slotsUsed + delta));
        const quotaStatus = newUsed >= e.slotsTotal ? 'full' :
          newUsed >= e.slotsTotal - 1 ? 'nearing' : 'available';
        return { ...e, slotsUsed: newUsed, quotaStatus };
      }),
    }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => n.id === id ? { ...n, read: true } : n),
    }));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, read: true })),
    }));
  }, []);

  const addNotification = useCallback((n: Notification) => {
    setState(prev => ({ ...prev, notifications: [n, ...prev.notifications] }));
  }, []);

  const setAuthSession = useCallback((user: Student | Expert, role: UserRole, token?: string) => {
    try {
      if (token) localStorage.setItem('uniexpert_token', token);
      localStorage.setItem('uniexpert_user', JSON.stringify({
        id: user.id,
        role: role,
        name: user.name,
      }));
    } catch {
      // ignore
    }
    setState(prev => ({
      ...prev,
      isAuthenticated: true,
      currentRole: role,
      currentUser: user,
      mfaRequired: false,
      loginAttempts: 0,
      lockedUntil: null,
    }));
  }, []);

  const login = useCallback((email: string, _password: string, targetRole?: UserRole) => {
    // Permissive institutional check for seamless demo & test experience
    const validDomain = email.includes('diu.edu.bd') || email.includes('.edu.bd') || email.includes('@techbridge.io') || email.includes('diu') || email.includes('student') || email.includes('faculty');
    if (validDomain) {
      const requiresMfa = email.includes('admin') || email.includes('coord');
      const resolvedRole: UserRole = targetRole || (
        email.includes('shohel') || email.includes('arman') || email.includes('faculty') ? 'faculty' :
        email.includes('coord') ? 'coordinator' :
        email.includes('admin') ? 'admin' :
        email.includes('mentor') || email.includes('sakib') || email.includes('techbridge') ? 'mentor' :
        email.includes('audit') || email.includes('qa') ? 'auditor' : 'student'
      );
      const user = roleUserMap[resolvedRole] || mockStudents[0];
      const token = 'mock_jwt_' + resolvedRole + '_' + Date.now();

      try {
        localStorage.setItem('uniexpert_token', token);
        localStorage.setItem('uniexpert_user', JSON.stringify({
          id: user.id,
          role: resolvedRole,
          name: user.name,
        }));
      } catch {
        // ignore
      }

      setState(prev => ({
        ...prev,
        isAuthenticated: !requiresMfa,
        mfaRequired: requiresMfa,
        currentRole: resolvedRole,
        currentUser: user,
        loginAttempts: 0,
        lockedUntil: null
      }));

      return { success: true, message: 'Authentication successful.', requiresMfa, role: resolvedRole };
    }
    return { success: false, message: 'Please enter a valid institutional email ending in .edu.bd' };
  }, []);

  const resetLockout = useCallback(() => {
    setState(prev => ({ ...prev, loginAttempts: 0, lockedUntil: null }));
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('uniexpert_token');
      localStorage.removeItem('uniexpert_user');
    } catch {
      // ignore
    }
    setState(prev => ({
      ...prev,
      isAuthenticated: false,
      mfaRequired: false,
      currentRole: 'student',
      currentUser: mockStudents[0]
    }));
  }, []);

  const submitMfa = useCallback((code: string) => {
    if (code === '123456') {
      setState(prev => {
        try {
          localStorage.setItem('uniexpert_token', 'mock_jwt_mfa_' + prev.currentRole + '_' + Date.now());
          localStorage.setItem('uniexpert_user', JSON.stringify({
            id: prev.currentRole + '-1',
            role: prev.currentRole,
            name: roleUserMap[prev.currentRole]?.name || prev.currentRole.toUpperCase()
          }));
        } catch {
          // ignore
        }
        return { ...prev, isAuthenticated: true, mfaRequired: false };
      });
      return { success: true, message: 'Authentication successful.' };
    }
    return { success: false, message: 'Invalid MFA code.' };
  }, []);

  const incrementLoginAttempts = useCallback(() => {
    setState(prev => {
      const attempts = prev.loginAttempts + 1;
      const lockedUntil = attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;
      return { ...prev, loginAttempts: attempts, lockedUntil };
    });
  }, []);

  return (
    <AppContext.Provider value={{
      ...state,
      setRole,
      toggleDarkMode,
      addToCompare,
      removeFromCompare,
      clearCompare,
      updateProposal,
      addProposal,
      updateExpertQuota,
      markNotificationRead,
      markAllNotificationsRead,
      addNotification,
      login,
      setAuthSession,
      logout,
      submitMfa,
      incrementLoginAttempts,
      resetLockout,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

