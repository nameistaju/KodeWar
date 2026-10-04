import React, { useState } from 'react';

const SERVICES_DATA = [
  {
    num: '01',
    name: 'DIGITAL STRATEGY',
    desc: 'Market intelligence, audience segmentation, multi-channel positioning and sustainable unit economics.',
    preview: '/Digital Strategy Growth Dashboard.png',
  },
  {
    num: '02',
    name: 'SOCIAL MEDIA',
    desc: 'Editorial short-form content, creator partnerships, high-retention reels, and community flywheel management.',
    preview: '/Social Media Analytics Badge.png',
  },
  {
    num: '03',
    name: 'PERFORMANCE MARKETING',
    desc: 'Targeted acquisition across Meta, Google Ads, LinkedIn, and programmatic inventory with rigorous CAC discipline.',
    preview: '/Performance Marketing Growth Dashboard.png',
  },
  {
    num: '04',
    name: 'SEO & ORGANIC VISIBILITY',
    desc: 'Technical site architecture, programmatic search infrastructure, and domain authority acceleration.',
    preview: '/SEO and Organic Visibility.png',
  },
  {
    num: '05',
    name: 'BRANDING & IDENTITY',
    desc: 'Visual language, typographical frameworks, digital guidelines, and cohesive cross-platform brand systems.',
    preview: '/Vibrant 3D Branding Identity Showcase.png',
  },
  {
    num: '06',
    name: 'CONTENT & CREATIVE',
    desc: 'High-production motion design, commercial video assets, editorial copywriting, and conversion-engineered scripts.',
    preview: '/Content & Creative Marketing Collage.png',
  },
  {
    num: '07',
    name: 'WEB & E-COMMERCE',
    desc: 'Lightning-fast Next.js and React digital flagships engineered for trust, readability, and continuous conversion.',
    preview: '/Neon Web Design Development Showcase.png',
  },
  {
    num: '08',
    name: 'LEAD GENERATION & CRM',
    desc: 'Automated conversion funnels, qualification routing, WhatsApp business integrations, and pipeline nurturing.',
    preview: '/Lead Generation & CRM Dashboard.png',
  },
];

export default function DMServicesList() {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setCoords({ x: e.clientX, y: e.clientY });
  };

  return (
    <section id="services" className="dm-services-section" onMouseMove={handleMouseMove}>
      <div className="dm-section-head">
        <div>
          <div className="dm-hero-eyebrow" style={{ marginBottom: '14px' }}>
            <span className="dm-hero-dot" />
            <span>Capabilities</span>
          </div>
          <h2>SERVICES &amp; DISCIPLINES</h2>
        </div>
        <p>
          Integrated creative, technical, and media capabilities operating as one unified growth engine.
        </p>
      </div>

      <div className="dm-services-list">
        {SERVICES_DATA.map((srv, idx) => (
          <div
            key={srv.num}
            className="dm-service-row"
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <span className="dm-service-num">{srv.num}</span>
            <div className="dm-service-title-wrap">
              <span className="dm-service-name">{srv.name}</span>
            </div>
            <span className="dm-service-desc">{srv.desc}</span>
            <span className="dm-service-arrow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </div>
        ))}
      </div>

      {/* Dynamic Cursor-Following Floating Preview */}
      <div
        className={`dm-service-float-preview ${hoveredIdx !== null ? 'is-visible' : ''}`}
        style={{
          left: `${coords.x + 24}px`,
          top: `${coords.y - 110}px`,
        }}
      >
        {hoveredIdx !== null && (
          <div className="dm-service-preview-inner">
            <img
              src={SERVICES_DATA[hoveredIdx].preview}
              alt={SERVICES_DATA[hoveredIdx].name}
              loading="lazy"
            />
          </div>
        )}
      </div>
    </section>
  );
}
