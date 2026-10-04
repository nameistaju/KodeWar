import React from 'react';

const BRANDING_CAPABILITIES = [
  {
    title: 'Brand Identity',
    image: '/Bold Brand Identity Poster.png',
  },
  {
    title: 'Logo Systems',
    image: '/Vibrant Logo Systems Workstation.png',
  },
  {
    title: 'Packaging',
    image: '/Packaging Design Brand Showcase.png',
  },
  {
    title: 'Creative Direction',
    image: '/Creative Direction Idea Board.png',
  },
  {
    title: 'Design Systems',
    image: '/Design Systems Studio Workspace.png',
  },
  {
    title: 'Social Templates',
    image: '/Social Templates Marketing Poster.png',
  },
];

export default function DMBranding() {
  return (
    <section className="dm-branding-section" id="dm-branding">
      <div className="dm-branding-inner">
        <div className="dm-section-head">
          <div>
            <h2>LOOK LIKE THE BUSINESS YOU WANT TO BECOME.</h2>
          </div>
          <p>
            Perception dictates pricing power. We craft uncompromising visual identities that establish premium market positioning from day one.
          </p>
        </div>

        <div className="dm-branding-grid">
          {BRANDING_CAPABILITIES.map((item, idx) => (
            <div key={idx} className="dm-branding-item">
              <img
                src={item.image}
                alt={item.title}
                className="dm-branding-img"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
