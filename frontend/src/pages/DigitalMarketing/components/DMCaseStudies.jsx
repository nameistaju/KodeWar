import React from 'react';

const CASE_STUDIES = [
  {
    category: 'FULL-FUNNEL GROWTH • SAAS & TECH',
    title: '340% Qualified Inbound Pipeline Growth in 90 Days',
    desc: 'Redesigned acquisition landing pages, deployed high-intent search campaigns, and established automated retargeting loops across meta and search channels.',
    metric: '+340% LEADS • 4.6X ROAS',
    image: '/Aerial View of a Lush Tech Campus.png'
  },
  {
    category: 'PERFORMANCE MARKETING • B2B COMMERCE',
    title: '₹2.8Cr Inbound Revenue Generated via Paid Acquisition',
    desc: 'Structured high-precision conversion funnels with algorithmic bidding and dynamic creative testing, cutting CAC by 42% while scaling monthly spend 5x.',
    metric: '₹2.8CR PIPELINE • -42% CAC',
    image: '/Digital Marketing Strategy Brainstorm.png'
  },
  {
    category: 'BRAND REPOSITIONING • ENTERPRISE INFRA',
    title: 'From Legacy Provider to High-Tech Market Authority',
    desc: 'Executed a complete visual overhaul, bespoke design system, corporate motion identity, and multi-channel content strategy that secured tier-1 clients.',
    metric: '12X ENGAGEMENT • TIER-1 WINS',
    image: '/Electric Scooter Assembly Line.png'
  },
  {
    category: 'LOCAL DOMINANCE • OMNICHANNEL RETAIL',
    title: 'Top 3 Map Ranking & 520% Surge in Store Direction Queries',
    desc: 'Optimized local Google Business presence, automated review management workflows, and targeted geo-fenced mobile campaigns that filled physical locations.',
    metric: '+520% FOOTFALL • #1 LOCAL RANK',
    image: '/Vault 26 Nighttime Boutique Facade.png'
  }
];

export default function DMCaseStudies() {
  return (
    <section className="dm-cases-section" id="dm-cases">
      <div className="dm-cases-inner">
        <div className="dm-section-head">
          <div>
            <h2>WORK THAT MOVES BUSINESS.</h2>
          </div>
          <p>
            Real commercial outcomes engineered through obsessive attention to funnel metrics, creative excellence, and technical precision.
          </p>
        </div>

        <div className="dm-cases-grid">
          {CASE_STUDIES.map((project, idx) => (
            <div key={idx} className="dm-case-card">
              <div className="dm-case-media">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                />
              </div>
              <div className="dm-case-info">
                <div className="dm-case-meta">{project.category}</div>
                <h3 className="dm-case-title">{project.title}</h3>
                <p className="dm-case-desc">{project.desc}</p>
                <div style={{
                  marginTop: '20px',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '11.5px',
                  letterSpacing: '0.12em',
                  color: '#ffffff',
                  fontWeight: 600
                }}>
                  {project.metric}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
