import React, { useState, useEffect, useRef } from 'react';

const CARDS_DATA = [
  {
    id: 'video',
    name: 'Video Production',
    src: '/Video Production Sticker Card.png',
    className: 'dm-cluster-card dm-card-video',
    baseRotate: -3,
  },
  {
    id: 'social',
    name: 'Social Media Strategy',
    src: '/Social Media Strategy Card.png',
    className: 'dm-cluster-card dm-card-social',
    baseRotate: -6,
  },
  {
    id: 'partners',
    name: 'With Partners',
    src: '/With Partners Pastel Sticker Card.png',
    className: 'dm-cluster-card dm-card-partners',
    baseRotate: 5,
  },
  {
    id: 'activations',
    name: 'Activations',
    src: '/Activations Sticker Card.png',
    className: 'dm-cluster-card dm-card-activations',
    baseRotate: 3,
  },
  {
    id: 'brand',
    name: 'Brand Strategy',
    src: '/Tilted Green Brand Strategy Card.png',
    className: 'dm-cluster-card dm-card-brand',
    baseRotate: -4,
  },
];

export default function DMCreativeCards() {
  const [inView, setInView] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);
  const clusterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e) => {
    if (!clusterRef.current) return;
    const rect = clusterRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 16;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
    setHoveredCard(null);
  };

  const handleScrollToServices = (e) => {
    e.preventDefault();
    const servicesElem = document.getElementById('services');
    if (servicesElem) {
      servicesElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="dm-cards-section" ref={sectionRef} id="what-we-do">
      <div className="dm-cards-container">
        {/* Left Column: Editorial Headline & Copy */}
        <div className="dm-cards-left">

          <h2 className={`dm-cards-headline ${inView ? 'is-revealed' : ''}`}>
            <span>EVERYTHING</span>
            <span>YOUR BUSINESS</span>
            <span>NEEDS TO GROW.</span>
          </h2>

          <p className={`dm-cards-desc ${inView ? 'is-revealed' : ''}`}>
            From strategy to content, campaigns and digital experiences, we bring the pieces together to move your business forward.
          </p>

          <div className={`dm-cards-cta-wrap ${inView ? 'is-revealed' : ''}`}>
            <a
              href="#services"
              onClick={handleScrollToServices}
              className="btn-dm-cards-cta"
            >
              <span>EXPLORE SERVICES</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </div>

        {/* Right Column: Floating Creative Service Cards Cluster */}
        <div className="dm-cards-right">
          <div
            className={`dm-cards-cluster-stage ${inView ? 'is-revealed' : ''}`}
            ref={clusterRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `translate3d(${mouseOffset.x * 0.4}px, ${mouseOffset.y * 0.4}px, 0)`,
            }}
          >
            {CARDS_DATA.map((card, idx) => {
              const isHovered = hoveredCard === card.id;
              const hasHover = hoveredCard !== null;
              const isOther = hasHover && !isHovered;

              return (
                <div
                  key={card.id}
                  className={`${card.className} ${inView ? 'card-entered' : ''} ${
                    isHovered ? 'is-hovered' : ''
                  } ${isOther ? 'is-dimmed' : ''}`}
                  style={{
                    '--enter-delay': `${0.12 + idx * 0.1}s`,
                    '--base-rotate': `${card.baseRotate}deg`,
                  }}
                  onMouseEnter={() => setHoveredCard(card.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <img
                    src={card.src}
                    alt={card.name}
                    className="dm-cluster-card-img"
                    loading="lazy"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
