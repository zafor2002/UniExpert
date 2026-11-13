import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';

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

export default function App() {
  return (
    <Routes>
      {/* Public Unauthenticated Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<EmailVerifyPage />} />
      <Route path="/mfa" element={<MfaPage />} />

      {/* Student Routes (wrapped in AppLayout) */}
      <Route
        path="/student"
        element={
          <AppLayout>
            <Navigate to="/student/dashboard" replace />
          </AppLayout>
        }
      />
      <Route
        path="/student/dashboard"
        element={
          <AppLayout>
            <StudentDashboard />
          </AppLayout>
        }
      />
      <Route
        path="/student/profile"
        element={
          <AppLayout>
            <StudentProfile />
          </AppLayout>
        }
      />
      <Route
        path="/student/new-proposal"
        element={
          <AppLayout>
            <NewProposal />
          </AppLayout>
        }
      />
      <Route
        path="/student/proposals/new"
        element={
          <AppLayout>
            <NewProposal />
          </AppLayout>
        }
      />
      <Route
        path="/student/entity-review"
        element={
          <AppLayout>
            <EntityReview />
          </AppLayout>
        }
      />
      <Route
        path="/student/discovery"
        element={
          <AppLayout>
            <AdvisorDiscovery />
          </AppLayout>
        }
      />
      <Route
        path="/student/compare"
        element={
          <AppLayout>
            <ExpertComparison />
          </AppLayout>
        }
      />
      <Route
        path="/student/skill-gap"
        element={
          <AppLayout>
            <SkillGapAnalysis />
          </AppLayout>
        }
      />
      <Route
        path="/student/co-advisor"
        element={
          <AppLayout>
            <CoAdvisorOptimizer />
          </AppLayout>
        }
      />
      <Route
        path="/student/proposal-modal"
        element={
          <AppLayout>
            <ProposalModal />
          </AppLayout>
        }
      />
      <Route
        path="/student/proposals"
        element={
          <AppLayout>
            <MyRequests />
          </AppLayout>
        }
      />
      <Route
        path="/student/requests"
        element={
          <AppLayout>
            <MyRequests />
          </AppLayout>
        }
      />
      <Route
        path="/student/consultation"
        element={
          <AppLayout>
            <ConsultationScheduler />
          </AppLayout>
        }
      />
      <Route
        path="/student/scheduler"
        element={
          <AppLayout>
            <ConsultationScheduler />
          </AppLayout>
        }
      />
      <Route
        path="/student/workspace"
        element={
          <AppLayout>
            <ProjectWorkspace />
          </AppLayout>
        }
      />
      <Route
        path="/student/evaluation"
        element={
          <AppLayout>
            <PostEvaluation />
          </AppLayout>
        }
      />
      <Route
        path="/student/contributions"
        element={
          <AppLayout>
            <ContributionTracker />
          </AppLayout>
        }
      />
      <Route
        path="/student/chat"
        element={
          <AppLayout>
            <TeamChat />
          </AppLayout>
        }
      />

      {/* Faculty Routes */}
      <Route
        path="/faculty"
        element={
          <AppLayout>
            <Navigate to="/faculty/dashboard" replace />
          </AppLayout>
        }
      />
      <Route
        path="/faculty/dashboard"
        element={
          <AppLayout>
            <FacultyDashboard />
          </AppLayout>
        }
      />
      <Route
        path="/faculty/portfolio"
        element={
          <AppLayout>
            <ResearchPortfolio />
          </AppLayout>
        }
      />
      <Route
        path="/faculty/proposals"
        element={
          <AppLayout>
            <IncomingProposals />
          </AppLayout>
        }
      />
      <Route
        path="/faculty/capacity"
        element={
          <AppLayout>
            <CapacitySettings />
          </AppLayout>
        }
      />
      <Route
        path="/faculty/quota"
        element={
          <AppLayout>
            <CapacitySettings />
          </AppLayout>
        }
      />
      <Route
        path="/faculty/calendar"
        element={
          <AppLayout>
            <CalendarSettings />
          </AppLayout>
        }
      />

      {/* Industry Mentor Routes */}
      <Route
        path="/mentor"
        element={
          <AppLayout>
            <Navigate to="/mentor/dashboard" replace />
          </AppLayout>
        }
      />
      <Route
        path="/mentor/dashboard"
        element={
          <AppLayout>
            <MentorDashboard />
          </AppLayout>
        }
      />
      <Route
        path="/mentor/profile"
        element={
          <AppLayout>
            <MentorOnboarding />
          </AppLayout>
        }
      />
      <Route
        path="/mentor/onboarding"
        element={
          <AppLayout>
            <MentorOnboarding />
          </AppLayout>
        }
      />
      <Route
        path="/mentor/requests"
        element={
          <AppLayout>
            <MentorDashboard />
          </AppLayout>
        }
      />

      {/* Coordinator Routes */}
      <Route
        path="/coordinator"
        element={
          <AppLayout>
            <Navigate to="/coordinator/dashboard" replace />
          </AppLayout>
        }
      />
      <Route
        path="/coordinator/dashboard"
        element={
          <AppLayout>
            <AllocationDashboard />
          </AppLayout>
        }
      />
      <Route
        path="/coordinator/verification"
        element={
          <AppLayout>
            <FacultyVerification />
          </AppLayout>
        }
      />
      <Route
        path="/coordinator/quota"
        element={
          <AppLayout>
            <QuotaPolicy />
          </AppLayout>
        }
      />
      <Route
        path="/coordinator/disputes"
        element={
          <AppLayout>
            <DisputesResolution />
          </AppLayout>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AppLayout>
            <Navigate to="/admin/taxonomy" replace />
          </AppLayout>
        }
      />
      <Route
        path="/admin/taxonomy"
        element={
          <AppLayout>
            <TaxonomyConsole />
          </AppLayout>
        }
      />
      <Route
        path="/admin/rbac"
        element={
          <AppLayout>
            <RBACManagement />
          </AppLayout>
        }
      />
      <Route
        path="/admin/health"
        element={
          <AppLayout>
            <SystemHealth />
          </AppLayout>
        }
      />

      {/* Auditor Routes */}
      <Route
        path="/auditor"
        element={
          <AppLayout>
            <Navigate to="/auditor/trail" replace />
          </AppLayout>
        }
      />
      <Route
        path="/auditor/trail"
        element={
          <AppLayout>
            <AuditTrail />
          </AppLayout>
        }
      />
      <Route
        path="/auditor/reports"
        element={
          <AppLayout>
            <AccreditationReports />
          </AppLayout>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
