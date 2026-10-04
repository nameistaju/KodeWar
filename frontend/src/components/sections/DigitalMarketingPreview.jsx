import React from 'react';
import { Link } from 'react-router-dom';

export default function DigitalMarketingPreview() {
  const pillars = [
    {
      num: "01",
      title: "Search & Visibility",
      desc: "Architecting high-intent organic search authority and technical SEO that compounds over time."
    },
    {
      num: "02",
      title: "Paid Acquisition",
      desc: "Targeted advertising funnels across Google, Meta, and LinkedIn built with strict ROI accountability."
    },
    {
      num: "03",
      title: "Content & Social Media",
      desc: "Editorial storytelling, thought leadership, and digital assets designed to convert attention into trust."
    },
    {
      num: "04",
      title: "Conversion Optimization",
      desc: "Fine-tuning user journeys, landing architectures, and checkout flow to maximize visitor yield."
    }
  ];

  return (
    <section id="marketing-preview" className="marketing-preview-section">
      <div className="marketing-preview-inner">
        <div className="marketing-grid">
          <div className="marketing-text">
            <div className="eyebrow reveal" style={{ marginBottom: '22px' }}>Digital Marketing</div>
            <h2 className="reveal marketing-headline">
              YOUR BUSINESS DESERVES<br />TO BE SEEN.
            </h2>
            <p className="reveal marketing-desc">
              We help businesses reach the right people through strategy, content, search, social media, advertising and conversion-focused digital experiences.
            </p>

            <div className="reveal" style={{ marginTop: '36px' }}>
              <Link to="/digital-marketing" className="btn-primary">
                Explore Digital Marketing
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="marketing-pillars">
            {pillars.map((pillar, idx) => (
              <div key={idx} className="marketing-pillar-card">
                <span className="pillar-num">{pillar.num}</span>
                <h4 className="pillar-title">{pillar.title}</h4>
                <p className="pillar-desc">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
