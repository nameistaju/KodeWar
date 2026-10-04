import React from 'react';

export default function Studio() {
  const studioSpaces = [
    {
      id: 'main-lab',
      label: 'WORKSPACE • ENGINEERING LAB',
      caption: 'High-focus workstation environment with dual-display multi-service telemetry.',
      img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop',
      alt: 'Kodewar primary development space'
    },
    {
      id: 'systems-station',
      label: 'SYSTEMS • CODEBASE SPRINT',
      caption: 'Continuous deployment review & integration station.',
      img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
      alt: 'Code architecture and development screens'
    },
    {
      id: 'design-bench',
      label: 'INTERFACE • CRAFT & RESEARCH',
      caption: 'Design systems, prototyping and user experience benchmarking.',
      img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop',
      alt: 'Hardware and systems engineering testing'
    },
    {
      id: 'collab-zone',
      label: 'COLLABORATION • SYNCHRONOUS REVIEW',
      caption: 'Open collaborative space for architectural mapping and sprint planning.',
      img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1000&auto=format&fit=crop',
      alt: 'Operations and collaborative studio space'
    }
  ];

  return (
    <section id="studio" className="studio-gallery-section">
      <div className="studio-container">
        {/* Section Header */}
        <div className="sec-head">
          <div>
            <div className="eyebrow reveal" style={{ marginBottom: '14px' }}>
              THE STUDIO.
            </div>
            <h2 className="reveal">
              WHERE THE WORK<br />
              TAKES SHAPE.
            </h2>
          </div>
          <p className="reveal">
            A space for ideas, design, technology and the people building what comes next.
          </p>
        </div>

        {/* Editorial Asymmetric Studio Gallery */}
        <div className="studio-editorial-gallery">
          {/* Hero Wide Panorama */}
          <div className="studio-hero-pane">
            <div className="studio-frame">
              <img
                src={studioSpaces[0].img}
                alt={studioSpaces[0].alt}
                loading="lazy"
                className="studio-img"
              />
              <div className="studio-scrim"></div>
              <div className="studio-badge-bottom">
                <span className="studio-indicator-dot"></span>
                <span className="studio-tag">{studioSpaces[0].label}</span>
                <span className="studio-desc">{studioSpaces[0].caption}</span>
              </div>
            </div>
          </div>

          {/* Tri-Pane Supporting Asymmetric Grid */}
          <div className="studio-trio-grid">
            {studioSpaces.slice(1).map((space, idx) => (
              <div key={space.id} className={`studio-trio-pane pane-${idx + 1}`}>
                <div className="studio-frame">
                  <img
                    src={space.img}
                    alt={space.alt}
                    loading="lazy"
                    className="studio-img"
                  />
                  <div className="studio-scrim"></div>
                  <div className="studio-badge-bottom compact">
                    <span className="studio-indicator-dot"></span>
                    <span className="studio-tag">{space.label}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
