import React from 'react';

const CATEGORIES = [
  'All',
  'Software Development',
  'UI/UX',
  'Digital Marketing',
  'AI & Automation',
  'Sales',
  'Business Development',
  'Operations',
  'Content',
  'Internship',
];

const LOCATIONS = [
  'All Locations',
  'Hyderabad',
  'Remote',
  'Hybrid',
];

export default function JobSearch({
  searchTerm,
  setSearchTerm,
  selectedLocation,
  setSelectedLocation,
  selectedCategory,
  setSelectedCategory,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const elem = document.getElementById('open-roles');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="career-search-section" id="job-search">
      <div className="career-search-inner">
        <div className="career-search-heading-row">
          <div>
            <h2 className="career-section-title">EXPLORE CAREER OPPORTUNITIES.</h2>
          </div>
          <p className="career-section-desc">
            Filter by technical domain, workplace location mode, or discover student apprenticeship tracks.
          </p>
        </div>

        {/* Search Bar Form */}
        <form className="career-search-box" onSubmit={handleSubmit}>
          <div className="career-input-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by role, skills, or tech stack (e.g. React, Python, Marketing)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="career-input-wrap" style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-search-submit">
            Search Jobs →
          </button>
        </form>

        {/* Quick Filter Categories */}
        <div className="career-filter-pills">
          <span style={{ fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: '#8A8A8A', marginRight: '6px' }}>
            DEPARTMENTS:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`career-filter-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
