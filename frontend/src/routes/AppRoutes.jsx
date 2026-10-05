import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/Home';
import PlaceholderPage from '../pages/Placeholder/PlaceholderPage';
import EmployeePage from '../pages/Employee/EmployeePage';
import DigitalMarketingPage from '../pages/DigitalMarketing';
import CareersPage from '../pages/Careers';
import WorkPage from '../pages/Work';
import AboutPage from '../pages/About';
import ContactPage from '../pages/Contact';
import ServicesPage from '../pages/Services';
import AdminPortal from '../pages/Admin/AdminPortal';
import { AdminPromotionsList, AdminPromotionForm } from '../pages/Admin/Promotions';

// Candidate Portal (Phase 6B)
import CareerLogin from '../pages/Careers/Auth/CareerLogin';
import CareerSignup from '../pages/Careers/Auth/CareerSignup';
import CareerForgotPassword from '../pages/Careers/Auth/CareerForgotPassword';
import CandidateDashboard from '../pages/Careers/Dashboard/CandidateDashboard';
import CandidateProfile from '../pages/Careers/Dashboard/CandidateProfile';
import ApplicationDetails from '../pages/Careers/Dashboard/ApplicationDetails';

// Admin Career Management (Phase 6C)
import {
  CareerOverview,
  AdminJobsList,
  AdminJobForm,
  AdminApplicationsList,
  AdminApplicationDetail,
  AdminCandidatesList,
  AdminCandidateDetail,
  AdminTrainingList,
  AdminTestimonialsList,
  AdminAuditLogs,
} from '../pages/Admin/Careers';


// Auth & Route Protection Guards
import { ProtectedRoute, AdminRoute } from '../components/auth/ProtectedRoute';
import NotFoundPage from '../components/ui/page-not-found';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      {/* Unified Admin Portal */}
      <Route path="/admin" element={<AdminRoute><AdminPortal /></AdminRoute>} />

      {/* Admin Promotions Control Panel (Protected Admin Route) */}
      <Route path="/admin/promotions" element={<AdminRoute><AdminPromotionsList /></AdminRoute>} />
      <Route path="/admin/promotions/new" element={<AdminRoute><AdminPromotionForm /></AdminRoute>} />
      <Route path="/admin/promotions/edit/:id" element={<AdminRoute><AdminPromotionForm /></AdminRoute>} />

      <Route path="/services" element={<ServicesPage />} />

      <Route path="/digital-marketing" element={<DigitalMarketingPage />} />

      <Route
        path="/business"
        element={
          <PlaceholderPage
            title="Business Solutions"
            category="ENTERPRISE & GROWTH"
            subtitle="Custom Technology & Digital Presence for Forward-Thinking Companies."
            description="From bespoke platforms to high-impact marketing systems, Kodewar provides the strategic leverage modern businesses need to scale efficiently."
          />
        }
      />

      <Route path="/work" element={<WorkPage />} />

      <Route path="/careers" element={<CareersPage />} />
      <Route path="/careers/jobs" element={<CareersPage />} />
      <Route path="/careers/jobs/:id" element={<CareersPage />} />
      <Route path="/careers/training" element={<CareersPage />} />

      {/* Candidate Auth & Dashboard (Protected Routes) */}
      <Route path="/careers/login" element={<CareerLogin />} />
      <Route path="/careers/signup" element={<CareerSignup />} />
      <Route path="/careers/forgot-password" element={<CareerForgotPassword />} />
      <Route path="/careers/dashboard" element={<ProtectedRoute><CandidateDashboard /></ProtectedRoute>} />
      <Route path="/careers/profile" element={<ProtectedRoute><CandidateProfile /></ProtectedRoute>} />
      <Route path="/careers/applications/:id" element={<ProtectedRoute><ApplicationDetails /></ProtectedRoute>} />

      {/* Unified Admin Career Management (Protected Admin Routes) */}
      <Route path="/admin/careers" element={<AdminRoute><CareerOverview /></AdminRoute>} />
      <Route path="/admin/careers/jobs" element={<AdminRoute><AdminJobsList /></AdminRoute>} />
      <Route path="/admin/careers/jobs/new" element={<AdminRoute><AdminJobForm /></AdminRoute>} />
      <Route path="/admin/careers/jobs/:id/edit" element={<AdminRoute><AdminJobForm /></AdminRoute>} />
      <Route path="/admin/careers/applications" element={<AdminRoute><AdminApplicationsList /></AdminRoute>} />
      <Route path="/admin/careers/applications/:id" element={<AdminRoute><AdminApplicationDetail /></AdminRoute>} />
      <Route path="/admin/careers/candidates" element={<AdminRoute><AdminCandidatesList /></AdminRoute>} />
      <Route path="/admin/careers/candidates/:id" element={<AdminRoute><AdminCandidateDetail /></AdminRoute>} />
      <Route path="/admin/careers/training" element={<AdminRoute><AdminTrainingList /></AdminRoute>} />
      <Route path="/admin/careers/testimonials" element={<AdminRoute><AdminTestimonialsList /></AdminRoute>} />
      <Route path="/admin/audit-logs" element={<AdminRoute><AdminAuditLogs /></AdminRoute>} />



      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />

      <Route path="/employee" element={<EmployeePage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
