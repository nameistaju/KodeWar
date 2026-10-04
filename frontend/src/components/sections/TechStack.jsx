import React, { useRef, useEffect } from 'react';
import { TECH_ECOSYSTEM } from '../../data/techLogos';

export default function TechStack() {
  const orbitRef = useRef(null);

  useEffect(() => {
    const orbit = orbitRef.current;
    if (!orbit) return;

    const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion:reduce)');

    const handlePointerMove = (e) => {
      if (!finePointer.matches || reducedMotion.matches) return;
      const box = orbit.getBoundingClientRect();
      const x = (e.clientX - box.left) / box.width - 0.5;
      const y = (e.clientY - box.top) / box.height - 0.5;
      orbit.style.setProperty('--orbit-parallax-x', `${x * 10}px`);
      orbit.style.setProperty('--orbit-parallax-y', `${y * 10}px`);
    };

    const handlePointerLeave = () => {
      orbit.style.setProperty('--orbit-parallax-x', '0px');
      orbit.style.setProperty('--orbit-parallax-y', '0px');
    };

    orbit.addEventListener('pointermove', handlePointerMove);
    orbit.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      orbit.removeEventListener('pointermove', handlePointerMove);
      orbit.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  return (
    <section id="tech" className="tech-stack-section">
      <div className="sec-head">
        <div className="eyebrow reveal">Technology Ecosystem</div>
        <h2 className="reveal" style={{ marginTop: '20px' }}>
          The stack behind<br />the standard.
        </h2>
        <p className="reveal" style={{ marginTop: '16px', maxWidth: '560px', color: 'var(--chrome-2)' }}>
          Battle-tested frameworks, distributed systems, and intelligent tooling powering our enterprise-grade client deliverables.
        </p>
      </div>

      <div
        className="orbit-wrap tech-orbit"
        id="tech-orbit"
        ref={orbitRef}
        aria-label="Kodewar technology ecosystem"
      >
        <div className="orbit-ring o1"></div>
        <div className="orbit-ring o2"></div>
        <div className="orbit-ring o3"></div>

        {/* Central KODEWAR Core Logo */}
        <div className="orbit-core" title="KODEWAR Technologies Core">
          <img
            src="/whitelogo_notext.png"
            alt="Kodewar Core"
            className="orbit-core-img"
          />
        </div>

        <div id="orbit-chips">
          {TECH_ECOSYSTEM.map(({ ring, items }) => (
            <div key={ring} className={`tech-orbit-ring tech-orbit-ring--${ring}`}>
              <div className="tech-orbit-rotor">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="tech-orbit-node"
                    style={{ '--x': `${item.x}%`, '--y': `${item.y}%` }}
                  >
                    <span className="tech-orbit-upright">
                      <button
                        className="tech-pill"
                        type="button"
                        aria-label={`${item.name}, ${item.category}`}
                        style={{
                          '--tech-brand-color': item.brandColor,
                          '--tech-brand-glow': item.brandGlow
                        }}
                      >
                        <span className="tech-pill-icon" aria-hidden="true">
                          {item.icon}
                        </span>
                        <span className="tech-pill-name">{item.name}</span>
                        <span className="tech-tooltip">{item.category}</span>
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
