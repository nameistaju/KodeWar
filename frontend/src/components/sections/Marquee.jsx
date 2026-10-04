import React from 'react';

export default function Marquee() {
  const items = [
    "DIGITAL MARKETING",
    "WEB & E-COMMERCE",
    "APP DEVELOPMENT",
    "AI & AUTOMATION",
    "BRANDING & UI/UX",
    "CAREER OPPORTUNITIES",
    "ENTERPRISE SOFTWARE"
  ];

  return (
    <div className="marquee-wrap" aria-hidden="true">
      <div className="marquee-track">
        {items.concat(items).map((item, idx) => (
          <span key={idx}>{item}</span>
        ))}
      </div>
    </div>
  );
}
