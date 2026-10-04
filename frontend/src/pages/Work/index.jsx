import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/work.css';

const WORK_SLIDES = [
  { id: 1, title: 'Social 101 Creative Network', img: '/work/Social-101-Website-Work.jpg' },
  { id: 2, title: 'Avant-Garde Brand Systems', img: '/work/4.jpg' },
  { id: 3, title: 'Omnichannel Product Packaging', img: '/work/3.jpg' },
  { id: 4, title: 'High-Conversion Commerce Engine', img: '/work/5.jpg' },
  { id: 5, title: 'Editorial Creative & Visual Campaign', img: '/work/6.jpg' },
  { id: 6, title: 'Performance Marketing Architecture', img: '/work/10.jpg' },
  { id: 7, title: 'Next-Gen Mobile & Web Interfaces', img: '/work/11.jpg' },
  { id: 8, title: 'Modern Print & Physical Collateral', img: '/work/8.jpg' },
  { id: 9, title: 'Cinematic Storytelling & Production', img: '/work/7.jpg' },
];

export default function WorkPage() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    document.title = 'Work Speaks For Our Talent | KODEWAR Technologies';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const sectionIds = [
      'section-0',
      ...WORK_SLIDES.map((_, i) => `section-${i + 1}`),
      'section-10',
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionIds.indexOf(entry.target.id);
            if (index !== -1) {
              setActiveIndex(index);
            }
          }
        });
      },
      {
        threshold: 0.45,
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (index) => {
    const el = document.getElementById(`section-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="work-page">
      {/* VERTICAL DOT NAVIGATION (Fixed on the right side) */}
      <aside className="work-dots-nav" aria-label="Page Sections Navigation">
        {Array.from({ length: WORK_SLIDES.length + 2 }).map((_, i) => (
          <button
            key={i}
            type="button"
            className={`work-dot-btn ${activeIndex === i ? 'active' : ''}`}
            onClick={() => scrollToSection(i)}
            aria-label={`Jump to section ${i + 1}`}
          >
            <span className="work-dot-circle" />
          </button>
        ))}
      </aside>

      {/* 0. HERO SECTION */}
      <section id="section-0" className="work-fullpage-hero">
        <div className="work-hero-bg-wrap">
          <img
            src="/work/1.jpg"
            alt="KODEWAR Creative Workspace"
            className="work-hero-bg-img"
          />
          <div className="work-hero-dim-overlay" />
        </div>

        <div className="work-hero-content">
          <h1 className="work-hero-headline">WORK SPEAKS FOR OUR TALENT!</h1>
          <button
            type="button"
            className="work-hero-scroll-btn"
            onClick={() => scrollToSection(1)}
            aria-label="Scroll down to work portfolio"
          >
            <span>Scroll Down</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </section>

      {/* 1..9 FULL-WIDTH WORK IMAGES */}
      {WORK_SLIDES.map((slide, idx) => (
        <section
          key={slide.id}
          id={`section-${idx + 1}`}
          className="work-fullpage-slide"
        >
          <img
            src={slide.img}
            alt={slide.title}
            className="work-slide-img"
            loading="lazy"
          />
        </section>
      ))}

      {/* 10. CLOSING CONTACT SECTION */}
      <section id="section-10" className="work-fullpage-contact">
        <div className="work-contact-inner">
          <h2 className="work-contact-headline">Let’s Work Together.</h2>
          <div className="work-contact-email">
            <a href="mailto:kodewartechnologies@gmail.com">
              kodewartechnologies@gmail.com
            </a>
          </div>

          <div className="work-contact-actions">
            <Link to="/contact" className="work-cta-primary-btn">
              <span>Start a Project</span>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <a
              href="mailto:kodewartechnologies@gmail.com?subject=Project%20Inquiry%20from%20Work%20Page"
              className="work-cta-secondary-btn"
            >
              <span>Email Studio Directly</span>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
