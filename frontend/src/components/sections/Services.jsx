import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { servicesData } from '../../data/services';

export default function Services() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section id="services">
      <div className="sec-head" style={{ marginBottom: '48px' }}>
        <div>
          <div className="eyebrow reveal" style={{ marginBottom: '14px' }}>Capabilities</div>
          <h2 className="reveal">Services built for scale.</h2>
        </div>
        <p className="reveal">
          Full-spectrum practices combining digital growth, high-craft engineering, and intelligent automation systems.
        </p>
      </div>

      <div className="svc-list">
        {servicesData.map((svc, idx) => {
          const isHovered = hoveredIndex === idx;
          return (
            <Link
              key={idx}
              to={svc.link}
              className={`svc-row ${isHovered ? 'is-hovered' : ''}`}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              aria-label={`Explore ${svc.name}`}
            >
              <div className="svc-card-float">
                <img src={svc.img} alt={`${svc.name} Preview`} className="svc-card-img" loading="lazy" />
              </div>
              <div className="svc">
                <div className="svc-num">{svc.num}</div>
                <div>
                  <div className="svc-name">{svc.name}</div>
                  <div className="svc-tags">
                    {svc.tags.map((tag, tIdx) => (
                      <span key={tIdx}>{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="svc-desc">{svc.desc}</div>
                <div className="svc-arrow">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
                    <path d="M7 17L17 7M7 7h10v10" />
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
