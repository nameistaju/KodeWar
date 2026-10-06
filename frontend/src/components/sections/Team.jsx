import React, { useEffect, useRef } from 'react';
import ShapeGrid from '../ui/ShapeGrid';

const TEAM_MEMBERS = [
  {
    name: 'Aareefa',
    role: 'Frontend Developer',
    img: '/Aareefa-frontendDevloper.png',
  },
  {
    name: 'Bhagya',
    role: 'Developer',
    img: '/Bhagya-devloper.png',
  },
  {
    name: 'Kiran',
    role: 'MERN Stack Developer',
    img: '/Kiran-MERNStack Devloper.png',
  },
  {
    name: 'Koushik',
    role: 'GMB Specialist',
    img: '/Koushik-GMB.png',
  },
  {
    name: 'Nisha',
    role: 'Python Developer',
    img: '/Kumari-PythonDevloper.png',
  },
  {
    name: 'Manibala',
    role: 'Web Developer',
    img: '/Manibala_webDevloper.png',
  },
  {
    name: 'Rizwana',
    role: 'Web Developer',
    img: '/Rizwana_WebDevloper.png',
  },
  {
    name: 'Shanawaz',
    role: 'Digital Marketing Executive',
    img: '/Shanawaz-digitalMarketingExcutive.png',
  },
  {
    name: 'Srinivas',
    role: 'Java Developer',
    img: '/Srinivas-JavaDevloper.png',
  },
  {
    name: 'Surya',
    role: 'Full Stack Developer',
    img: '/Surya-FullStackDevloper.png',
  },
  {
    name: 'Varshini',
    role: 'Developer',
    img: '/Varshini- devloper.png',
  },
  {
    name: 'Srinivas',
    role: 'Manager',
    img: '/tillu-Manager.png',
  },
];

export default function Team() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = section.querySelectorAll('.team-member-item');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      cards.forEach((card) => card.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('is-revealed');
              }, index * 45);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="team" className="team-section" ref={sectionRef}>
      <div className="team-shapegrid-bg">
        <ShapeGrid 
          speed={0.5} 
          squareSize={40}
          direction="diagonal"
          borderColor="rgba(255, 255, 255, 0.08)"
          hoverFillColor="#222"
          shape="square"
          hoverTrailAmount={5}
        />
      </div>
      <div className="team-container">
        {/* Section Header */}
        <div className="sec-head">
          <div>
            <div className="eyebrow reveal" style={{ marginBottom: '16px' }}>
              THE TEAM
            </div>
            <h2 className="reveal">
              THE PEOPLE<br />
              BEHIND KODEWAR.
            </h2>
          </div>
          <p className="reveal">
            Designers, developers, marketers and problem-solvers building digital experiences together.
          </p>
        </div>

        {/* 4-Column Editorial People Grid */}
        <div className="team-editorial-grid">
          {TEAM_MEMBERS.map((member, idx) => (
            <div
              key={member.name}
              className={`team-member-item item-offset-${idx % 4}`}
            >
              {/* Cutout Portrait - Absolutely NO background shapes, frames, or cards */}
              <div className="team-portrait-slot">
                <img
                  src={encodeURI(member.img)}
                  alt={`${member.name} - ${member.role} at Kodewar`}
                  loading="lazy"
                  className="team-cutout-img"
                />
              </div>

              {/* Name & Role */}
              <div className="team-member-meta">
                <h3 className="team-member-name">{member.name}</h3>
                <span className="team-member-role">{member.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
