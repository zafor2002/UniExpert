import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { UserRole, Expert, Student, AdvisoryProposal, Notification } from '../types';
import { mockStudents, mockExperts, mockProposals, mockNotifications } from '../data/mockData';

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
  login: (email: string, _password: string) => { success: boolean; message: string; requiresMfa?: boolean };
  logout: () => void;
  submitMfa: (code: string) => { success: boolean; message: string };
  incrementLoginAttempts: () => void;
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
  const [state, setState] = useState<AppState>({
    currentRole: 'student',
    currentUser: mockStudents[0],
    darkMode: false,
    experts: mockExperts,
    proposals: mockProposals,
    notifications: mockNotifications,
    compareList: [],
    isAuthenticated: false,
    mfaRequired: false,
    loginAttempts: 0,
    lockedUntil: null,
    vectorSearchOnline: true,
  });

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
    setState(prev => ({ ...prev, proposals: [...prev.proposals, proposal] }));
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

  const login = useCallback((email: string, _password: string) => {
    if (state.lockedUntil && new Date() < state.lockedUntil) {
      return { success: false, message: 'Account temporarily locked due to too many failed attempts.' };
    }
    // Mock login: any @diu.edu.bd email works
    if (email.endsWith('@diu.edu.bd') || email.endsWith('@techbridge.io')) {
      const requiresMfa = email.includes('admin') || email.includes('coord');
      setState(prev => ({ ...prev, isAuthenticated: !requiresMfa, mfaRequired: requiresMfa, loginAttempts: 0 }));
      return { success: true, message: 'Authentication successful.', requiresMfa };
    }
    return { success: false, message: 'Invalid credentials.' };
  }, [state.lockedUntil]);

  const logout = useCallback(() => {
    setState(prev => ({ ...prev, isAuthenticated: false, mfaRequired: false }));
  }, []);

  const submitMfa = useCallback((code: string) => {
    if (code === '123456') {
      setState(prev => ({ ...prev, isAuthenticated: true, mfaRequired: false }));
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
      logout,
      submitMfa,
      incrementLoginAttempts,
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

