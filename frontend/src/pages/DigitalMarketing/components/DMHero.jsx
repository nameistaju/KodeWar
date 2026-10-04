import React from 'react';

export default function DMHero() {
  const handleScrollToContact = (e) => {
    e.preventDefault();
    const contactElem = document.getElementById('dm-contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const tapeItems1 = [
    'BRANDING',
    'SEO',
    'ADVERTISING',
    'PLANNING',
    'CONTENT',
    'GROWTH',
    'PERFORMANCE',
    'BRANDING',
    'SEO',
    'ADVERTISING',
    'PLANNING',
    'CONTENT',
    'GROWTH',
    'PERFORMANCE'
  ];

  const tapeItems2 = [
    'ENGINEERED FOR SCALE',
    '4.6X AVERAGE ROAS',
    'FULL FUNNEL GROWTH',
    'ALGORITHMIC TARGETING',
    'DIGITAL SUPREMACY',
    'CONVERSION SYSTEMS',
    'ENGINEERED FOR SCALE',
    '4.6X AVERAGE ROAS',
    'FULL FUNNEL GROWTH',
    'ALGORITHMIC TARGETING'
  ];

  return (
    <section className="dm-hero-section-replica">
      {/* Background radial spotlight */}
      <div className="dm-replica-spotlight" />

      {/* Main hero composition container */}
      <div className="dm-replica-container">
        {/* Giant typography behind the character */}
        <div className="dm-replica-title-wrap">
          <h1 className="dm-replica-big-title">
            <span className="dm-replica-title-row">
              GROWTH
              {/* Decorative Cursor Pointer 1 */}
              <span className="dm-replica-cursor dm-cursor-top" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 4L11 20L14 13L21 10L4 4Z"
                    fill="#F5F5F5"
                    stroke="#0A0A0A"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </span>

            <span className="dm-replica-title-row">
              HACKING
              {/* Decorative Cursor Pointer 2 */}
              <span className="dm-replica-cursor dm-cursor-bottom" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 4L11 20L14 13L21 10L4 4Z"
                    fill="#CCCCCC"
                    stroke="#0A0A0A"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </span>
          </h1>
        </div>

        {/* Center Floating Character */}
        <div className="dm-replica-character-wrap">
          <img
            src="/digitalMarketing_herosection_element1.png"
            alt="KODEWAR Digital Marketing Growth Superhero"
            className="dm-replica-character-img"
          />
        </div>

        {/* Left Side Editorial Subtext */}
        <div className="dm-replica-left-text">
          <p>
            Our approach is rooted in digital marketing, and we use our expertise to create, differentiate and scale.
          </p>
        </div>

        {/* Right Side Pill CTA Button */}
        <div className="dm-replica-right-cta">
          <a
            href="#dm-contact"
            onClick={handleScrollToContact}
            className="dm-replica-pill-btn"
          >
            <span>START PROJECT</span>
            <span className="dm-replica-pill-icon">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </span>
          </a>
        </div>
      </div>

      {/* Angled Crossing Ribbon Tapes at bottom */}
      <div className="dm-replica-ribbons-wrapper">
        {/* Ribbon 2: Dark Charcoal Angle (+1.8deg) */}
        <div className="dm-replica-ribbon-dark">
          <div className="dm-replica-ribbon-track track-reverse">
            {tapeItems2.map((item, idx) => (
              <span key={idx} className="ribbon-item">
                {item} <span className="ribbon-bullet">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* Ribbon 1: High-Contrast Crisp White Ribbon (-3.2deg) */}
        <div className="dm-replica-ribbon-light">
          <div className="dm-replica-ribbon-track">
            {tapeItems1.map((item, idx) => (
              <span key={idx} className="ribbon-item">
                {item} <span className="ribbon-bullet">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
