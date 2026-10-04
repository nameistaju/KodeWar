import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import '../../styles/careers.css';

import CareerHero from './components/CareerHero';
import JobListings from './components/JobListings';
import JobApplicationModal from './components/JobApplicationModal';
import WhyKodewar from './components/WhyKodewar';
import TrainingPlacement from './components/TrainingPlacement';
import CareerTeam from './components/CareerTeam';
import CandidateTestimonials from './components/CandidateTestimonials';
import CareerFAQ from './components/CareerFAQ';
import StudentApplicationForm from './components/StudentApplicationForm';
import CareerCTA from './components/CareerCTA';
import CareerLeadModal from './components/CareerLeadModal';
import { CAREER_JOBS } from './data/careerJobsData';

export default function CareersPage() {
  const { id } = useParams();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRoleForModal, setSelectedRoleForModal] = useState(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  useEffect(() => {
    document.title = 'Careers & Talent Incubator | KODEWAR Technologies';

    const dismissed = sessionStorage.getItem('career_lead_dismissed');
    const submitted = sessionStorage.getItem('career_lead_submitted');
    if (!dismissed && !submitted && !id) {
      const timer = setTimeout(() => {
        setIsLeadModalOpen(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [id]);

  const handleCloseLeadModal = () => {
    setIsLeadModalOpen(false);
    sessionStorage.setItem('career_lead_dismissed', 'true');
  };

  useEffect(() => {
    // Check if a direct job ID is provided in URL
    if (id) {
      const match = CAREER_JOBS.find((j) => j.id === id);
      if (match) {
        setSelectedRoleForModal(match);
      }
    } else if (location.pathname.includes('/training')) {
      const elem = document.getElementById('training-placement');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    } else if (location.pathname.includes('/jobs')) {
      const elem = document.getElementById('open-roles');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  }, [id, location.pathname]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedLocation('All Locations');
    setSelectedCategory('All');
  };

  const handleFilterInternships = () => {
    setSelectedCategory('Internship');
  };

  return (
    <div className="careers-page">
      {/* 01. Career Hero (Find Your Dream Job + Modern Illustration + Popular Categories) */}
      <CareerHero
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* 02. Open Positions Listings */}
      <JobListings
        searchTerm={searchTerm}
        selectedLocation={selectedLocation}
        selectedCategory={selectedCategory}
        onResetFilters={handleResetFilters}
        onSelectRole={(job) => setSelectedRoleForModal(job)}
      />

      {/* 03. Why KODEWAR (5 Pillars) */}
      <WhyKodewar />

      {/* 04. Training + Placement (4 Programs with Placement Assistance) */}
      <TrainingPlacement onFilterInternships={handleFilterInternships} />

      {/* 05. The People Behind The Work (Real Team PNG Assets) */}
      <CareerTeam />

      {/* 06. Student Testimonials / Reviews */}
      <CandidateTestimonials />

      {/* 08. Frequently Asked Questions */}
      <CareerFAQ />

      {/* 09. Student Application & Talent Intake Portal */}
      <StudentApplicationForm />

      {/* 10. Interactive Job Application & Details Modal */}
      {selectedRoleForModal && (
        <JobApplicationModal
          job={selectedRoleForModal}
          onClose={() => setSelectedRoleForModal(null)}
        />
      )}

      {/* 11. Pop-up Talent Lead Capture Form */}
      <CareerLeadModal isOpen={isLeadModalOpen} onClose={handleCloseLeadModal} />
    </div>
  );
}
