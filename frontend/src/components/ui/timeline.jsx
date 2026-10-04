import React from 'react';
import './timeline.css';

const STAGES = [
  {
    id: 'stage-01',
    stepNum: '01',
    tag: 'STAGE 01 — PROFILE',
    title: 'Create Your Profile',
    desc: 'Share your background, GitHub repositories, Figma portfolios, and primary area of engineering or creative focus.',
  },
  {
    id: 'stage-02',
    stepNum: '02',
    tag: 'STAGE 02 — DISCOVER',
    title: 'Discover Opportunities',
    desc: 'Explore active engineering squad openings or apply directly to our hands-on 12-week student incubator tracks.',
  },
  {
    id: 'stage-03',
    stepNum: '03',
    tag: 'STAGE 03 — ENGAGE',
    title: 'Apply & Solve',
    desc: 'Participate in a practical, real-world coding or design evaluation. Zero algorithmic tricks—only realistic craft.',
  },
  {
    id: 'stage-04',
    stepNum: '04',
    tag: 'STAGE 04 — SHIP',
    title: 'Grow With KODEWAR',
    desc: 'Join a high-velocity production squad, contribute to live platforms, and compound your career value daily.',
  },
];

export default function Timeline({
  title = 'HOW IT WORKS.',
  subtitle = 'A transparent, merit-driven evaluation designed to identify builders who take pride in production excellence.',
  periodLabel = 'STAGE 01 — 04',
  activeColor = '#FFD600',
  backgroundColor = '#030304',
}) {
  return (
    <section
      id="how-it-works-section"
      className="how-it-works-section"
      style={{ backgroundColor }}
    >
      <div className="how-it-works-container">
        {/* Section Header */}
        <div className="how-it-works-header">
          <span className="how-it-works-badge" style={{ color: activeColor }}>
            {periodLabel}
          </span>
          <h2 className="how-it-works-title">{title}</h2>
          <p className="how-it-works-subtitle">{subtitle}</p>
        </div>

        {/* 4-Step Process Grid */}
        <div className="how-it-works-grid">
          {STAGES.map((stage, idx) => (
            <div key={stage.id} className="how-it-works-card">
              <div className="how-it-works-card-top">
                <span className="how-it-works-card-num" style={{ color: activeColor }}>
                  {stage.stepNum}
                </span>
                <div className="how-it-works-card-dot" style={{ backgroundColor: activeColor }} />
              </div>

              <div className="how-it-works-card-tag" style={{ color: activeColor }}>
                {stage.tag}
              </div>

              <h3 className="how-it-works-card-title">{stage.title}</h3>
              <p className="how-it-works-card-desc">{stage.desc}</p>

              {/* Progress Connector Indicator */}
              {idx < STAGES.length - 1 && (
                <div className="how-it-works-connector-line" style={{ '--active-accent': activeColor }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
