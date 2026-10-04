import React from 'react';

export default function Workspace() {
  const bentoItems = [
    {
      cls: 'c1',
      img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
      alt: 'Engineering workspace',
      label: 'WORKSPACE • COLLABORATION'
    },
    {
      cls: 'c2',
      img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
      alt: 'Code architecture',
      label: 'SYSTEMS • CODEBASE'
    },
    {
      cls: 'c3',
      img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop',
      alt: 'Hardware & Systems',
      label: 'HARDWARE • TELEMETRY'
    },
    {
      cls: 'c4',
      img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop',
      alt: 'Design & UX',
      label: 'INTERFACE • CRAFT'
    },
    {
      cls: 'c5',
      img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop',
      alt: 'Operations Center',
      label: 'OPERATIONS • 24/7'
    }
  ];

  return (
    <section id="workspace">
      <div className="sec-head">
        <div>
          <div className="eyebrow reveal" style={{ marginBottom: '14px' }}>Inside the Studio</div>
          <h2 className="reveal">Engineered for focus.</h2>
        </div>
        <p className="reveal">
          A look inside our development practice where architectural rigor meets high-craft software engineering.
        </p>
      </div>

      <div className="bento">
        {bentoItems.map((item, index) => (
          <div key={index} className={`cell ${item.cls}`}>
            <img src={item.img} alt={item.alt} loading="lazy" />
            <div className="cell-overlay">
              <span>{item.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
