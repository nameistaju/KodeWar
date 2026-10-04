import React from 'react';
import { Link } from 'react-router-dom';

export default function SelectedWork() {
  const caseStudies = [
    {
      client: "Surya Informatics Solutions",
      category: "ENTERPRISE PLATFORM",
      title: "Core System Modernization & Cloud Migration",
      desc: "Replacing legacy monolith friction with microservices, modern frontends, and automated deployment pipelines.",
      img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
      tags: ["Cloud Migration", "Architecture", "Zero-Downtime"]
    },
    {
      client: "OneGene India",
      category: "GENOMICS & DEEP TECH",
      title: "High-Throughput Bioinformatics Dashboards",
      desc: "Architecting real-time genomic telemetry analysis, secure data pipelines, and precision data visualizations.",
      img: "https://images.unsplash.com/photo-1753715613434-9c7cb58876b9?q=80&w=1200&auto=format&fit=crop",
      tags: ["Bioinformatics", "Data Pipelines", "Telemetry"]
    },
    {
      client: "Witzenmann India",
      category: "INDUSTRIAL MANUFACTURING",
      title: "Manufacturing Systems & Plant Reporting",
      desc: "Custom industrial integration and automated production logging deployed directly to plant floor operations.",
      img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop",
      tags: ["Industrial IoT", "Automation", "Reporting"]
    }
  ];

  return (
    <section id="work" className="selected-work-section">
      <div className="work-inner">
        <div className="sec-head" style={{ marginBottom: '48px' }}>
          <div>
            <div className="eyebrow reveal" style={{ marginBottom: '14px' }}>Selected Work</div>
            <h2 className="reveal">Engineered for production.</h2>
          </div>
          <p className="reveal">
            A selection of verified delivery engagements across enterprise modernization, deep tech, and automated operations.
          </p>
        </div>

        <div className="case-studies-grid">
          {caseStudies.map((study, idx) => (
            <article key={idx} className="case-study-card">
              <div className="case-study-media">
                <img src={study.img} alt={study.title} loading="lazy" />
                <div className="case-study-badge">{study.category}</div>
              </div>
              <div className="case-study-content">
                <div className="case-study-client">{study.client}</div>
                <h3 className="case-study-title">{study.title}</h3>
                <p className="case-study-desc">{study.desc}</p>
                <div className="case-study-tags">
                  {study.tags.map((tag, tIdx) => (
                    <span key={tIdx}>{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="work-footer-cta">
          <Link to="/work" className="btn-secondary-link">
            <span>Explore All Work</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
