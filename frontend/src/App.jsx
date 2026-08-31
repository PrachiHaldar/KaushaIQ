import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import DemoSwitcher from './components/common/DemoSwitcher';
import DemoJourneyBar from './components/common/DemoJourneyBar';
import ProtectedRoute from './components/common/ProtectedRoute';
import AICareerCopilot from './components/ai/AICareerCopilot';

// Pages
import LandingPage from './pages/LandingPage';
import DomainExplorerPage from './pages/DomainExplorerPage';
import AuthPage from './pages/AuthPage';
import StudentDashboard from './pages/StudentDashboard';
import SkillGapPage from './pages/SkillGapPage';
import LearningHubPage from './pages/LearningHubPage';
import LearningDetailPage from './pages/LearningDetailPage';
import OpportunityHubPage from './pages/OpportunityHubPage';
import OpportunityDetailPage from './pages/OpportunityDetailPage';
import ApplicationTrackerPage from './pages/ApplicationTrackerPage';
import ProjectsMarketplacePage from './pages/ProjectsMarketplacePage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import SkillPassportPage from './pages/SkillPassportPage';
import VerifyPassportPage from './pages/VerifyPassportPage';
import FacultyDashboard from './pages/FacultyDashboard';
import IndustryDashboard from './pages/IndustryDashboard';
import CandidateDiscoveryPage from './pages/CandidateDiscoveryPage';
import InstitutionDashboard from './pages/InstitutionDashboard';
import SkillIntelligencePage from './pages/SkillIntelligencePage';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  const [copilotOpen, setCopilotOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#070A12] text-slate-100 selection:bg-brand-500 selection:text-white">
      {/* 1-Click Demo Persona Bar */}
      <DemoSwitcher />

      {/* SIH 2026 10-Step Interactive Judge Journey Bar */}
      <DemoJourneyBar />

      {/* Global Navigation */}
      <Navbar onOpenCopilot={() => setCopilotOpen(true)} />

      {/* Main Routed Content */}
      <main className="flex-1">
        <Routes>
          {/* Public & General Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/domains" element={<DomainExplorerPage />} />
          <Route path="/domains/:slug" element={<DomainExplorerPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/verify-passport/:code" element={<VerifyPassportPage />} />
          
          {/* Shared Discovery & Learning Hub */}
          <Route path="/learning" element={<LearningHubPage />} />
          <Route path="/learning/:slug" element={<LearningDetailPage />} />
          <Route path="/opportunities" element={<OpportunityHubPage />} />
          <Route path="/opportunities/:id" element={<OpportunityDetailPage />} />
          <Route path="/projects" element={<ProjectsMarketplacePage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/passport" element={<SkillPassportPage />} />
          <Route path="/intelligence" element={<SkillIntelligencePage />} />

          {/* Student Protected Portal */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                <StudentDashboard onOpenCopilot={() => setCopilotOpen(true)} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/skill-gaps"
            element={
              <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                <SkillGapPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                <ApplicationTrackerPage />
              </ProtectedRoute>
            }
          />

          {/* Faculty Protected Portal */}
          <Route
            path="/faculty/dashboard"
            element={
              <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
                <FacultyDashboard />
              </ProtectedRoute>
            }
          />

          {/* Industry Protected Portal */}
          <Route
            path="/industry/dashboard"
            element={
              <ProtectedRoute allowedRoles={['INDUSTRY', 'ADMIN']}>
                <IndustryDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/industry/candidates"
            element={
              <ProtectedRoute allowedRoles={['INDUSTRY', 'FACULTY', 'INSTITUTION', 'ADMIN']}>
                <CandidateDiscoveryPage />
              </ProtectedRoute>
            }
          />

          {/* Institution Protected Portal */}
          <Route
            path="/institution/dashboard"
            element={
              <ProtectedRoute allowedRoles={['INSTITUTION', 'ADMIN']}>
                <InstitutionDashboard />
              </ProtectedRoute>
            }
          />

          {/* Super Admin Protected Portal */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 Catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Global AI Career Copilot Floating Drawer */}
      <AICareerCopilot
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
