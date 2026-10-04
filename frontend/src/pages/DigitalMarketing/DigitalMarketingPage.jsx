import React, { useState, useEffect } from 'react';
import '../../styles/digitalMarketing.css';

import DMHero from './components/DMHero';
import DMIntroduction from './components/DMIntroduction';
import DMCreativeCards from './components/DMCreativeCards';
import DMServicesList from './components/DMServicesList';
import DMPerformance from './components/DMPerformance';
import DMBranding from './components/DMBranding';
import DMCaseStudies from './components/DMCaseStudies';
import DMTestimonials from './components/DMTestimonials';
import DMPricing from './components/DMPricing';
import DMContactForm from './components/DMContactForm';
import DMFinalCTA from './components/DMFinalCTA';
import DMLeadModal from './components/DMLeadModal';

export default function DigitalMarketingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    document.title = 'Digital Marketing & Growth Systems | KODEWAR';
    window.scrollTo(0, 0);

    const dismissed = sessionStorage.getItem('dm_lead_dismissed');
    const submitted = sessionStorage.getItem('dm_lead_submitted');
    if (!dismissed && !submitted) {
      const timer = setTimeout(() => {
        setIsModalOpen(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    sessionStorage.setItem('dm_lead_dismissed', 'true');
  };

  return (
    <div className="dm-page-wrapper">
      {/* 01. Hero (Centered superhero, editorial typography, and moving ribbons) */}
      <DMHero />

      {/* 02. Philosophy / Telugu Section */}
      <DMIntroduction />

      {/* 03. Creative Service Cards Cluster ("Everything Your Business Needs to Grow") */}
      <DMCreativeCards />

      {/* 04. Creative Agency Editorial Services List (01-08) with cursor-hover preview */}
      <DMServicesList />

      {/* 05. Performance Marketing & Paid Acquisition Flow */}
      <DMPerformance />

      {/* 06. Branding & Design Studio Grid */}
      <DMBranding />

      {/* 07. Editorial Proof of Work & Case Studies */}
      <DMCaseStudies />

      {/* 08. Client Testimonials & Social Proof (Infinite 3-Column Marquee) */}
      <DMTestimonials />

      {/* 09. Engagement Tiers & Pricing Modes */}
      <DMPricing />

      {/* 09. High-Conversion Growth Lead Capture Form */}
      <DMContactForm />

      {/* 10. Final Impact CTA */}
      <DMFinalCTA />

      {/* Pop-up Lead Capture Form */}
      <DMLeadModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
