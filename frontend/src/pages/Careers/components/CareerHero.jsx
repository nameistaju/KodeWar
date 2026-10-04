import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export default function CareerHero({
  searchTerm = '',
  setSearchTerm = () => {},
  selectedLocation = 'All Locations',
  setSelectedLocation = () => {},
  selectedCategory = 'All',
  setSelectedCategory = () => {},
}) {
  const { user } = useAuth();

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
    <section
      className="career-hero-section"
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#030304',
        color: '#ffffff',
        paddingTop: '130px',
        paddingBottom: '60px',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        boxSizing: 'border-box'
      }}
    >
      {/* Main Two-Column Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1320px',
          margin: '0 auto',
          padding: '0 32px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '48px'
        }}
      >
        {/* LEFT COLUMN — Content & Actions */}
        <div
          style={{
            flex: '1 1 540px',
            maxWidth: '640px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            textAlign: 'left'
          }}
        >
          {/* Reference-style Headline */}
          <h1
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'clamp(38px, 4.8vw, 68px)',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              margin: '0 0 20px 0'
            }}
          >
            Find Your{' '}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px 20px',
                borderRadius: '9999px',
                border: '1px solid rgba(255, 214, 0, 0.4)',
                backgroundColor: 'rgba(255, 214, 0, 0.1)',
                color: '#FFD600',
                fontSize: '0.55em',
                verticalAlign: 'middle',
                margin: '0 6px'
              }}
            >
              ⟶
            </span>
            <br />
            Dream Job Here<br />
            In One Place
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '16px',
              color: '#94A3B8',
              lineHeight: 1.6,
              margin: '0 0 32px 0',
              maxWidth: '520px'
            }}
          >
            Explore active engineering squad openings, apply to hands-on 12-week student incubator tracks, and build production systems with KODEWAR.
          </p>

          {/* Reference-style Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              maxWidth: '540px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '9999px',
              padding: '6px 8px 6px 24px',
              marginBottom: '28px',
              boxSizing: 'border-box'
            }}
          >
            {/* Job Title / Keyword Input */}
            <input
              type="text"
              placeholder="Job Title or Keyword"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#ffffff',
                fontSize: '14px',
                fontFamily: "'Inter', sans-serif"
              }}
            />

            {/* Vertical Divider */}
            <div
              style={{
                width: '1px',
                height: '24px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                margin: '0 12px'
              }}
            />

            {/* Location Selector */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#94A3B8',
                fontSize: '13px',
                fontFamily: "'Inter', sans-serif",
                cursor: 'pointer',
                marginRight: '12px'
              }}
            >
              <option value="All Locations" style={{ background: '#08080a', color: '#fff' }}>All Locations</option>
              <option value="Hyderabad, India" style={{ background: '#08080a', color: '#fff' }}>Hyderabad</option>
              <option value="Bengaluru, India" style={{ background: '#08080a', color: '#fff' }}>Bengaluru</option>
              <option value="Remote" style={{ background: '#08080a', color: '#fff' }}>Remote</option>
            </select>

            {/* Submit Search Icon Button */}
            <button
              type="submit"
              aria-label="Search jobs"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: '#FFD600',
                color: '#000000',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'transform 0.2s ease'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </form>

          {/* Action Buttons Row with Candidate Portal */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <a
              href="#open-roles"
              onClick={handleScrollToRoles}
              style={{
                padding: '12px 24px',
                borderRadius: '9999px',
                backgroundColor: '#FFD600',
                color: '#000000',
                fontWeight: 700,
                fontSize: '13px',
                fontFamily: "'Inter', sans-serif",
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <span>VIEW OPEN ROLES</span>
              <span>→</span>
            </a>

            <a
              href="#training-placement"
              onClick={handleScrollToTraining}
              style={{
                padding: '12px 24px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '13px',
                fontFamily: "'Inter', sans-serif",
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <span>EXPLORE INCUBATOR</span>
            </a>

            {user ? (
              <Link
                to="/careers/dashboard"
                style={{
                  padding: '12px 24px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  border: '1px solid rgba(96, 165, 250, 0.4)',
                  color: '#93c5fd',
                  fontWeight: 600,
                  fontSize: '13px',
                  fontFamily: "'Inter', sans-serif",
                  textDecoration: 'none'
                }}
              >
                <span>MY DASHBOARD ↗</span>
              </Link>
            ) : (
              <Link
                to="/careers/login"
                style={{
                  padding: '12px 24px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '13px',
                  fontFamily: "'Inter', sans-serif",
                  textDecoration: 'none'
                }}
              >
                <span>CANDIDATE PORTAL ↗</span>
              </Link>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN — Raw Modern Job Search Illustration (NO borders, NO effects) */}
        <div
          style={{
            flex: '1 1 500px',
            maxWidth: '600px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <img
            src="/Modern Job Search Illustration.png"
            alt="Modern Job Search Illustration"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '520px',
              objectFit: 'contain',
              display: 'block'
            }}
          />
        </div>
      </div>
    </section>
  );
}
