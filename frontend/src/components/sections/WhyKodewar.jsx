import React from 'react';
import TechStack from './TechStack';

export default function WhyKodewar() {
  const reasons = [
    {
      num: "01",
      title: "Senior Architectural Discipline",
      desc: "Every project begins with rigorous systems mapping, API contracts, and schema design. We build for the next decade, not the next sprint."
    },
    {
      num: "02",
      title: "Technology + Marketing Convergence",
      desc: "Great technology is useless without visibility. We unite full-stack software engineering with high-performance digital marketing funnels."
    },
    {
      num: "03",
      title: "Production-Grounded Talent",
      desc: "Our career programs train engineers directly on live, scalable software architectures — creating job-ready professionals who understand real codebases."
    },
    {
      num: "04",
      title: "Deterministic Delivery Standard",
      desc: "50+ enterprise engagements delivered across 3 continents with 99.9% uptime compliance and full handover documentation."
    }
  ];

  return (
    <section id="why-kodewar" className="why-kodewar-section">
      <div className="why-inner">
        <div className="sec-head">
          <div>
            <div className="eyebrow reveal" style={{ marginBottom: '14px' }}>Why Kodewar</div>
            <h2 className="reveal">The standard behind our work.</h2>
          </div>
          <p className="reveal">
            Why leading enterprises, high-growth startups, and ambitious technology talent choose Kodewar as their partner.
          </p>
        </div>

        <div className="why-grid">
          {reasons.map((r, idx) => (
            <div key={idx} className="why-card">
              <span className="why-num">{r.num}</span>
              <h3 className="why-title">{r.title}</h3>
              <p className="why-desc">{r.desc}</p>
            </div>
          ))}
        </div>

        {/* Integrated Tech Ecosystem Orbit */}
        <div style={{ marginTop: '60px' }}>
          <TechStack />
        </div>
      </div>
    </section>
  );
}
