import React from 'react';

export default function DMServiceStrip() {
  const items = [
    'DIGITAL MARKETING',
    'SOCIAL MEDIA',
    'SEO',
    'PERFORMANCE',
    'BRANDING',
    'WEB DEVELOPMENT',
    'CONTENT',
    'GROWTH',
  ];

  return (
    <div className="dm-tape-strip" aria-hidden="true">
      <div className="dm-tape-track">
        {items.concat(items).concat(items).map((item, idx) => (
          <span key={idx}>{item}</span>
        ))}
      </div>
    </div>
  );
}
