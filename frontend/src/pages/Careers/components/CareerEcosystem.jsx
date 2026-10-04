import React from 'react';

// SECTION 01: Institutional & Standards Bodies
// Ministry of Labour & Employment, DPIIT (#startupindia), AICTE, and Skill Incubators
export const INSTITUTIONAL_LOGOS = [
  {
    name: 'Ministry of Labour & Employment, Govt. of India',
    src: '/logos/imgi_3_image.webp',
    height: 48,
    width: 'auto',
  },
  {
    name: 'DPIIT #startupindia, Govt. of India',
    src: '/logos/imgi_5_image.webp',
    height: 48,
    width: 'auto',
  },
  {
    name: 'AICTE - All India Council for Technical Education',
    src: '/logos/imgi_89_image.webp',
    height: 52,
    width: 'auto',
  },
  {
    name: 'FD Talent Network',
    src: '/logos/imgi_96_image.webp',
    height: 44,
    width: 'auto',
  },
];

// SECTION 02: Industry Ecosystem
// Real platforms, enterprise systems, fintech, commerce & tech leaders
export const INDUSTRY_ECOSYSTEM_LOGOS = [
  {
    name: 'Tech Mahindra',
    src: '/logos/download (13).svg',
    height: 32,
  },
  {
    name: 'Aditya Birla Group',
    src: '/logos/download (12).svg',
    height: 32,
  },
  {
    name: 'BigBasket',
    src: '/logos/download (14).svg',
    height: 32,
  },
  {
    name: 'Tata AIA Life Insurance',
    src: '/logos/imgi_162_image.webp',
    height: 34,
  },
  {
    name: 'Bajaj Allianz',
    src: '/logos/imgi_6_image.webp',
    height: 30,
  },
  {
    name: 'HDFC Bank',
    src: '/logos/imgi_8_image.webp',
    height: 38,
  },
  {
    name: 'Kotak Life',
    src: '/logos/imgi_20_image.webp',
    height: 38,
  },
  {
    name: 'SBI Life Insurance',
    src: '/logos/imgi_31_image.webp',
    height: 36,
  },
  {
    name: 'LIC India',
    src: '/logos/imgi_29_image.webp',
    height: 38,
  },
  {
    name: 'Max Life Insurance',
    src: '/logos/imgi_26_image.webp',
    height: 38,
  },
  {
    name: 'Bharti AXA Life',
    src: '/logos/imgi_164_image.webp',
    height: 36,
  },
  {
    name: 'Flipkart',
    src: '/logos/imgi_201_image.webp',
    height: 36,
  },
  {
    name: 'Zepto',
    src: '/logos/imgi_21_image.webp',
    height: 30,
  },
  {
    name: 'Zomato',
    src: '/logos/imgi_95_image.webp',
    height: 36,
  },
  {
    name: 'Swiggy',
    src: '/logos/imgi_141_image.webp',
    height: 38,
  },
  {
    name: 'TeamLease',
    src: '/logos/imgi_27_image.webp',
    height: 32,
  },
  {
    name: 'OkayGo',
    src: '/logos/imgi_24_image.webp',
    height: 38,
  },
];

export default function CareerEcosystem() {
  // Infinite marquee requires a seamless doubled array
  const marqueeLogos = [...INDUSTRY_ECOSYSTEM_LOGOS, ...INDUSTRY_ECOSYSTEM_LOGOS];

  return (
    <section className="career-ecosystem-section" id="ecosystem" aria-label="Ecosystem and Industry Credibility">
      {/* ------------------------------------------------------------------
          SUB-SECTION 01: Institutional & Standards Support Row
          ------------------------------------------------------------------ */}
      <div className="career-ecosystem-container">
        <div className="career-ecosystem-header-row">
          <div className="career-ecosystem-header-left">
            <h2 className="career-ecosystem-heading">
              BUILT FOR THE<br />REAL WORLD.
            </h2>
          </div>
          <div className="career-ecosystem-header-right">
            <p className="career-ecosystem-desc">
              Learning, building and working with the platforms, standards and organizations that shape modern careers.
            </p>
          </div>
        </div>

        {/* Institutional Logos Banner / Shelf */}
        <div className="career-institutional-shelf">
          <div className="career-institutional-grid">
            {INSTITUTIONAL_LOGOS.map((inst, index) => (
              <div key={index} className="career-institutional-item" title={inst.name}>
                <img
                  src={inst.src}
                  alt={inst.name}
                  className="career-institutional-logo"
                  loading="lazy"
                  style={{ height: `${inst.height}px` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="career-ecosystem-divider" />

      {/* ------------------------------------------------------------------
          SUB-SECTION 02: Industry Ecosystem Marquee
          ------------------------------------------------------------------ */}
      <div className="career-ecosystem-container">
        <div className="career-ecosystem-header-row industry-header">
          <div className="career-ecosystem-header-left">
            <h3 className="career-ecosystem-heading-editorial">
              THE WORLD<br />WE BUILD FOR.
            </h3>
          </div>
          <div className="career-ecosystem-header-right">
            <p className="career-ecosystem-desc">
              Modern careers are shaped by real products, real platforms and real business environments.
            </p>
          </div>
        </div>
      </div>

      {/* Continuous Horizontal Ticker / Marquee */}
      <div className="career-marquee-wrapper" tabIndex={0} aria-label="Industry Ecosystem Partners Marquee">
        <div className="career-marquee-track">
          {marqueeLogos.map((logo, index) => (
            <div key={`${logo.name}-${index}`} className="career-marquee-item" title={logo.name}>
              <img
                src={logo.src}
                alt={logo.name}
                className="career-marquee-logo"
                loading="lazy"
                style={{ height: `${logo.height}px` }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
