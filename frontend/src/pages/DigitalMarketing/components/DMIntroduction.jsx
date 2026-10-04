import React, { useState, useEffect, useRef } from 'react';

export default function DMIntroduction() {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleScrollToContact = (e) => {
    e.preventDefault();
    const contactElem = document.getElementById('dm-contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="dm-intro-section" ref={sectionRef} id="philosophy">
      <div className="dm-intro-container">
        {/* Left Column: Telugu Headline -> English Subtitle -> Supporting Copy -> CTA */}
        <div className="dm-intro-left">

          {/* Primary Telugu Message */}
          <h2 className={`dm-intro-telugu ${inView ? 'is-revealed' : ''}`}>
            <span>మీ బిజినెస్</span>
            <span>గ్రో చేయాలి</span>
            <span>అనుకుంటున్నారా?</span>
          </h2>

          {/* Subtle English Translation */}
          <div className={`dm-intro-english ${inView ? 'is-revealed' : ''}`}>
            Want to grow your business?
          </div>

          {/* Supporting Short Copy */}
          <p className={`dm-intro-copy ${inView ? 'is-revealed' : ''}`}>
            We build the strategy, creative, technology and digital systems that help businesses become more visible, reach the right people and turn attention into growth.
          </p>

          {/* Small CTA Button */}
          <div className={`dm-intro-cta-wrap ${inView ? 'is-revealed' : ''}`}>
            <a
              href="#dm-contact"
              onClick={handleScrollToContact}
              className="btn-dm-intro-cta"
            >
              <span>LET'S GROW</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </div>

        {/* Right Column: Floating element2.png with Transparent Background */}
        <div className={`dm-intro-right ${inView ? 'is-revealed' : ''}`}>
          <div className="dm-intro-element-wrap">
            <img
              src="/element2.png"
              alt="KODEWAR Digital Growth"
              className="dm-intro-element-img"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
