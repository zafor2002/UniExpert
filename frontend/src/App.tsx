import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/shared/ProtectedRoute';

// Public pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import EmailVerifyPage, { MfaPage } from './pages/public/EmailVerifyPage';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import NewProposal from './pages/student/NewProposal';
import EntityReview from './pages/student/EntityReview';
import AdvisorDiscovery from './pages/student/AdvisorDiscovery';
import ExpertComparison from './pages/student/ExpertComparison';
import SkillGapAnalysis from './pages/student/SkillGapAnalysis';
import CoAdvisorOptimizer from './pages/student/CoAdvisorOptimizer';
import ProposalModal from './pages/student/ProposalModal';
import MyRequests from './pages/student/MyRequests';
import ConsultationScheduler from './pages/student/ConsultationScheduler';
import ProjectWorkspace from './pages/student/ProjectWorkspace';
import PostEvaluation from './pages/student/PostEvaluation';
import ContributionTracker from './pages/student/ContributionTracker';
import TeamChat from './pages/student/TeamChat';

// Faculty pages
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import ResearchPortfolio from './pages/faculty/ResearchPortfolio';
import IncomingProposals from './pages/faculty/IncomingProposals';
import CapacitySettings from './pages/faculty/CapacitySettings';
import CalendarSettings from './pages/faculty/CalendarSettings';

// Mentor pages
import MentorDashboard from './pages/mentor/MentorDashboard';
import MentorOnboarding from './pages/mentor/MentorOnboarding';

// Coordinator pages
import AllocationDashboard from './pages/coordinator/AllocationDashboard';
import FacultyVerification from './pages/coordinator/FacultyVerification';
import QuotaPolicy from './pages/coordinator/QuotaPolicy';
import DisputesResolution from './pages/coordinator/DisputesResolution';

// Admin pages
import TaxonomyConsole from './pages/admin/TaxonomyConsole';
import RBACManagement from './pages/admin/RBACManagement';
import SystemHealth from './pages/admin/SystemHealth';

// Auditor pages
import AuditTrail from './pages/auditor/AuditTrail';
import AccreditationReports from './pages/auditor/AccreditationReports';

// Route Guards by Role
const StudentRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute allowedRoles={['student']}>
    <AppLayout>{children}</AppLayout>
  </ProtectedRoute>
);

const FacultyRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute allowedRoles={['faculty']}>
    <AppLayout>{children}</AppLayout>
  </ProtectedRoute>
);

const MentorRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute allowedRoles={['mentor']}>
    <AppLayout>{children}</AppLayout>
  </ProtectedRoute>
);

const CoordinatorRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute allowedRoles={['coordinator']}>
    <AppLayout>{children}</AppLayout>
  </ProtectedRoute>
);

const AdminRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute allowedRoles={['admin']}>
    <AppLayout>{children}</AppLayout>
  </ProtectedRoute>
);

const AuditorRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute allowedRoles={['auditor']}>
    <AppLayout>{children}</AppLayout>
  </ProtectedRoute>
);

export default function App() {
  return (
    <Routes>
      {/* Public Unauthenticated Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<EmailVerifyPage />} />
      <Route path="/mfa" element={<MfaPage />} />

      {/* Student Routes (Protected: Student Role) */}
      <Route path="/student" element={<StudentRoute><Navigate to="/student/dashboard" replace /></StudentRoute>} />
      <Route path="/student/dashboard" element={<StudentRoute><StudentDashboard /></StudentRoute>} />
      <Route path="/student/profile" element={<StudentRoute><StudentProfile /></StudentRoute>} />
      <Route path="/student/new-proposal" element={<StudentRoute><NewProposal /></StudentRoute>} />
      <Route path="/student/proposals/new" element={<StudentRoute><NewProposal /></StudentRoute>} />
      <Route path="/student/entity-review" element={<StudentRoute><EntityReview /></StudentRoute>} />
      <Route path="/student/discovery" element={<StudentRoute><AdvisorDiscovery /></StudentRoute>} />
      <Route path="/student/compare" element={<StudentRoute><ExpertComparison /></StudentRoute>} />
      <Route path="/student/skill-gap" element={<StudentRoute><SkillGapAnalysis /></StudentRoute>} />
      <Route path="/student/co-advisor" element={<StudentRoute><CoAdvisorOptimizer /></StudentRoute>} />
      <Route path="/student/proposal-modal" element={<StudentRoute><ProposalModal /></StudentRoute>} />
      <Route path="/student/proposals" element={<StudentRoute><MyRequests /></StudentRoute>} />
      <Route path="/student/requests" element={<StudentRoute><MyRequests /></StudentRoute>} />
      <Route path="/student/consultation" element={<StudentRoute><ConsultationScheduler /></StudentRoute>} />
      <Route path="/student/scheduler" element={<StudentRoute><ConsultationScheduler /></StudentRoute>} />
      <Route path="/student/workspace" element={<StudentRoute><ProjectWorkspace /></StudentRoute>} />
      <Route path="/student/evaluation" element={<StudentRoute><PostEvaluation /></StudentRoute>} />
      <Route path="/student/contributions" element={<StudentRoute><ContributionTracker /></StudentRoute>} />
      <Route path="/student/chat" element={<StudentRoute><TeamChat /></StudentRoute>} />

      {/* Faculty Routes (Protected: Faculty Role) */}
      <Route path="/faculty" element={<FacultyRoute><Navigate to="/faculty/dashboard" replace /></FacultyRoute>} />
      <Route path="/faculty/dashboard" element={<FacultyRoute><FacultyDashboard /></FacultyRoute>} />
      <Route path="/faculty/workspace" element={<FacultyRoute><ProjectWorkspace /></FacultyRoute>} />
      <Route path="/faculty/chat" element={<FacultyRoute><TeamChat /></FacultyRoute>} />
      <Route path="/faculty/portfolio" element={<FacultyRoute><ResearchPortfolio /></FacultyRoute>} />
      <Route path="/faculty/proposals" element={<FacultyRoute><IncomingProposals /></FacultyRoute>} />
      <Route path="/faculty/capacity" element={<FacultyRoute><CapacitySettings /></FacultyRoute>} />
      <Route path="/faculty/quota" element={<FacultyRoute><CapacitySettings /></FacultyRoute>} />
      <Route path="/faculty/calendar" element={<FacultyRoute><CalendarSettings /></FacultyRoute>} />

      {/* Industry Mentor Routes (Protected: Mentor Role) */}
      <Route path="/mentor" element={<MentorRoute><Navigate to="/mentor/dashboard" replace /></MentorRoute>} />
      <Route path="/mentor/dashboard" element={<MentorRoute><MentorDashboard /></MentorRoute>} />
      <Route path="/mentor/profile" element={<MentorRoute><MentorOnboarding /></MentorRoute>} />
      <Route path="/mentor/onboarding" element={<MentorRoute><MentorOnboarding /></MentorRoute>} />
      <Route path="/mentor/requests" element={<MentorRoute><MentorDashboard /></MentorRoute>} />

      {/* Coordinator Routes (Protected: Coordinator Role) */}
      <Route path="/coordinator" element={<CoordinatorRoute><Navigate to="/coordinator/dashboard" replace /></CoordinatorRoute>} />
      <Route path="/coordinator/dashboard" element={<CoordinatorRoute><AllocationDashboard /></CoordinatorRoute>} />
      <Route path="/coordinator/verification" element={<CoordinatorRoute><FacultyVerification /></CoordinatorRoute>} />
      <Route path="/coordinator/quota" element={<CoordinatorRoute><QuotaPolicy /></CoordinatorRoute>} />
      <Route path="/coordinator/disputes" element={<CoordinatorRoute><DisputesResolution /></CoordinatorRoute>} />

      {/* Admin Routes (Protected: Admin Role) */}
      <Route path="/admin" element={<AdminRoute><Navigate to="/admin/taxonomy" replace /></AdminRoute>} />
      <Route path="/admin/taxonomy" element={<AdminRoute><TaxonomyConsole /></AdminRoute>} />
      <Route path="/admin/rbac" element={<AdminRoute><RBACManagement /></AdminRoute>} />
      <Route path="/admin/health" element={<AdminRoute><SystemHealth /></AdminRoute>} />

      {/* Auditor Routes (Protected: Auditor Role) */}
      <Route path="/auditor" element={<AuditorRoute><Navigate to="/auditor/trail" replace /></AuditorRoute>} />
      <Route path="/auditor/trail" element={<AuditorRoute><AuditTrail /></AuditorRoute>} />
      <Route path="/auditor/reports" element={<AuditorRoute><AccreditationReports /></AuditorRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
