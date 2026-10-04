import React from 'react';

export default function Awards() {
  const awardsData = [
    { num: "01", title: "50+ Enterprise Platforms", subtitle: "Shipped across industries" },
    { num: "02", title: "99.9% Uptime Delivered", subtitle: "Across mission-critical production" },
    { num: "03", title: "Zero-Defect Standard", subtitle: "Rigorous CI/CD & testing" },
    { num: "04", title: "3 Continents", subtitle: "Global client delivery reach" }
  ];

  return (
    <section id="awards">
      <div className="eyebrow reveal">Track Record</div>
      <div className="awards-grid">
        {awardsData.map((item, idx) => (
          <div key={idx} className="award">
            <span className="a-num">{item.num}</span>
            <h4>{item.title}</h4>
            <span>{item.subtitle}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
