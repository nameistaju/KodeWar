import React from 'react';
import { BackgroundPaths } from '@/components/ui/background-paths';

export default function DMFinalCTA() {
  const handleScrollToContact = (e) => {
    e.preventDefault();
    const contactElem = document.getElementById('dm-contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="dm-final-cta-section" style={{ padding: 0, position: 'relative' }}>
      <BackgroundPaths
        title="YOUR NEXT MOVE STARTS HERE."
        subtitle="Stop leaving market share to competitors with inferior products. Partner with KODEWAR to engineer compounding digital distribution."
      >
        <div className="bg-paths-btn-wrap">
          <a
            href="#dm-contact"
            onClick={handleScrollToContact}
            className="bg-paths-btn-primary"
          >
            <span>START A PROJECT</span>
            <span className="bg-paths-btn-arrow">→</span>
          </a>
        </div>
        <a
          href="mailto:hello@kodewar.com"
          className="bg-paths-btn-secondary"
        >
          <span>hello@kodewar.com</span>
        </a>
      </BackgroundPaths>
    </section>
  );
}
