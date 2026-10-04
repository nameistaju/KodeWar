import React from 'react';
import {
  Hero,
  Marquee,
  Manifesto,
  TwoPaths,
  Services,
  SelectedWork,
  HowWeWork,
  TechStack,
  Team,
  Studio,
  Reviews,
  FAQ,
  ContactCTA,
} from '../../components/sections';
import { OfferTicker, OfferPopup, PromotionBanner } from '../../components/offers';

export default function HomePage() {
  return (
    <>
      {/* 2. HERO */}
      <Hero />

      {/* Marquee ticker transition */}
      <Marquee />

      {/* 3. KODEWAR INTRODUCTION / PHILOSOPHY */}
      <Manifesto />

      {/* HOMEPAGE PROMOTIONAL BANNER (Dedicated advertising slot) */}
      <PromotionBanner />

      {/* 4. BUSINESS / CAREER PATHS: "Engineered for growth. Built for people." */}
      <TwoPaths />

      {/* 5. SERVICES */}
      <Services />

      {/* 6. SELECTED WORK / PROJECTS */}
      <SelectedWork />

      {/* 8. THE STANDARD BEHIND OUR WORK: "Process, disciplined." */}
      <HowWeWork />

      {/* 9. TECH STACK: "The stack behind the standard." with colorful logos in orbital layout */}
      <TechStack />

      {/* 10. OUR TEAM: "BUILT BY PEOPLE WHO CARE ABOUT THE WORK." */}
      <Team />

      {/* 11. THE STUDIO: "WHERE THE WORK TAKES SHAPE." */}
      <Studio />

      {/* 12. TESTIMONIALS */}
      <Reviews />

      {/* 13. FREQUENTLY ASKED QUESTIONS */}
      <FAQ />

      {/* 14. FINAL CTA */}
      <ContactCTA />

      {/* PROMOTIONAL CAMPAIGN POPUP */}
      <OfferPopup />
    </>
  );
}
