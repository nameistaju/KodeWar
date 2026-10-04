import React from 'react';
import { Link } from 'react-router-dom';

export default function CareersPreview() {
  const tracks = [
    {
      num: "01",
      title: "Engineering Jobs",
      desc: "Full-time roles across software engineering, AI systems, cloud infrastructure, and product design."
    },
    {
      num: "02",
      title: "Industry Internships",
      desc: "Structured, hands-on internships solving real client challenges inside live production environments."
    },
    {
      num: "03",
      title: "Intensive Training",
      desc: "Practical engineering curriculum focusing on architectural discipline, clean code, and modern tech stacks."
    },
    {
      num: "04",
      title: "Placement Assistance",
      desc: "Direct hiring pipelines connecting trained graduates and professionals to leading technology partners."
    }
  ];

  return (
    <section id="careers-preview" className="careers-preview-section">
      <div className="careers-preview-inner">
        <div className="careers-grid">
          <div className="careers-text">
            <div className="eyebrow reveal" style={{ marginBottom: '22px' }}>Careers & Talent</div>
            <h2 className="reveal careers-headline">
              BUILD YOUR CAREER<br />WITH KODEWAR.
            </h2>
            <p className="reveal careers-desc">
              Explore jobs, internships, training and placement opportunities.
            </p>
            <p className="reveal careers-sub">
              We cultivate engineering talent by bridging the gap between theory and high-scale production systems.
            </p>

            <div className="reveal" style={{ marginTop: '36px' }}>
              <Link to="/careers" className="btn-primary">
                Explore Careers
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="careers-tracks">
            {tracks.map((track, idx) => (
              <div key={idx} className="career-track-card">
                <span className="track-num">{track.num}</span>
                <h4 className="track-title">{track.title}</h4>
                <p className="track-desc">{track.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
