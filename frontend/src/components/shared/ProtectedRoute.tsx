import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import type { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

const roleDashboards: Record<UserRole, string> = {
  student: '/student/dashboard',
  faculty: '/faculty/dashboard',
  mentor: '/mentor/dashboard',
  coordinator: '/coordinator/dashboard',
  admin: '/admin/taxonomy',
  auditor: '/auditor/trail',
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, currentRole } = useApp();
  const location = useLocation();

  // Check token in localStorage as immediate fallback to prevent any render-gap race condition
  const hasToken = typeof window !== 'undefined' ? Boolean(localStorage.getItem('uniexpert_token')) : false;
  const isAuthed = isAuthenticated || hasToken;

  let effectiveRole = currentRole;
  if (typeof window !== 'undefined') {
    try {
      const savedUser = localStorage.getItem('uniexpert_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.role) effectiveRole = parsed.role;
      }
    } catch {
      // ignore
    }
  }

  if (!isAuthed) {
    // Unauthenticated user -> redirect to /login saving attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(effectiveRole)) {
    // Authenticated, but unauthorized for this section -> redirect to own role dashboard
    const fallback = roleDashboards[effectiveRole] || '/student/dashboard';
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
