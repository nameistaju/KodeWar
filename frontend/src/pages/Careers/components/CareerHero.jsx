import React, { useState, useEffect } from 'react';

export default function CareerHero({
  searchTerm = '',
  setSearchTerm = () => {},
  selectedLocation = 'All Locations',
  setSelectedLocation = () => {},
  selectedCategory = 'All',
  setSelectedCategory = () => {},
}) {
  const [lang, setLang] = useState('en'); // 'en' = English, 'te' = Telugu

  useEffect(() => {
    // Respect user's motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // Transition smoothly between English and Telugu every 5.5s
    const timer = setInterval(() => {
      setLang((prev) => (prev === 'en' ? 'te' : 'en'));
    }, 5500);

    return () => clearInterval(timer);
  }, []);

  const handleScrollToRoles = (e) => {
    e.preventDefault();
    const elem = document.getElementById('open-roles') || document.getElementById('job-search');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToTraining = (e) => {
    e.preventDefault();
    const elem = document.getElementById('training-placement');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const elem = document.getElementById('open-roles') || document.getElementById('job-search');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="career-hero-section">
      <div className="career-hero-vignette" />

      {/* Main Two-Column Container */}
      <div className="career-hero-container">
        {/* LEFT COLUMN — Content & Actions */}
        <div className="career-hero-col-text">
          
          {/* Seamless Animated Bilingual Headline Block */}
          <div className="career-headline-bilingual-wrapper">
            <div className="career-headline-stack">
              {/* ENGLISH VERSION */}
              <h1
                className={`career-hero-find-title english-title ${lang === 'en' ? 'is-active' : 'is-hidden-up'}`}
                lang="en"
                aria-hidden={lang !== 'en'}
              >
                <span>
                  Find Your <span className="career-title-pill-arrow">⟶</span>
                </span>
                <span>Dream Job Here</span>
                <span>In One Place</span>
              </h1>

              {/* TELUGU VERSION */}
              <h1
                className={`career-hero-find-title telugu-title ${lang === 'te' ? 'is-active' : 'is-hidden-down'}`}
                lang="te"
                aria-hidden={lang !== 'te'}
              >
                <span>
                  మీ కలల ఉద్యోగాన్ని <span className="career-title-pill-arrow">⟶</span>
                </span>
                <span>ఒకే చోట కనుగొనండి</span>
              </h1>
            </div>
          </div>

          {/* Subtitle */}
          <p className="career-hero-find-desc">
            Explore active engineering squad openings, apply to hands-on 12-week student incubator tracks, and build production systems with KODEWAR.
          </p>

          {/* Responsive Search Bar */}
          <form onSubmit={handleSearchSubmit} className="career-search-pill-bar">
            {/* Job Title / Keyword Input */}
            <div className="search-pill-field">
              <input
                type="text"
                placeholder="Job Title or Keyword"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-pill-input"
              />
            </div>

            {/* Vertical Divider */}
            <div className="search-pill-divider" />

            {/* Location Selector */}
            <div className="search-pill-field location-field">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="search-pill-input"
                style={{ cursor: 'pointer' }}
              >
                <option value="All Locations">All Locations</option>
                <option value="Hyderabad, India">Hyderabad</option>
                <option value="Bengaluru, India">Bengaluru</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            {/* Submit Search Icon Button */}
            <button
              type="submit"
              aria-label="Search jobs"
              className="search-pill-circle-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </form>

          {/* Action Buttons Row */}
          <div className="career-hero-ctas">
            <a
              href="#open-roles"
              onClick={handleScrollToRoles}
              className="btn-career-primary"
            >
              <span>VIEW OPEN ROLES</span>
              <span>→</span>
            </a>

            <a
              href="#training-placement"
              onClick={handleScrollToTraining}
              className="btn-career-secondary"
            >
              <span>EXPLORE INCUBATOR</span>
            </a>
          </div>
        </div>

        {/* RIGHT COLUMN — Modern Job Search Illustration */}
        <div className="career-hero-visual-pure">
          <img
            src="/Modern Job Search Illustration.png"
            alt="Modern Job Search Illustration"
            className="career-hero-illustration-pure"
            width="540"
            height="420"
          />
        </div>
      </div>
    </section>
  );
}
