import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './services-page.css';

const SERVICES_DATA = [
  {
    id: '01',
    title: 'BRANDING',
    description:
      'If you need branding, we will customize a creative roadmap and visual identity system tailored for your audience. We build brand platforms and assets that accelerate recognition and position your business for long-term growth.',
    deliverables: ['Brand Strategy', 'Visual Identity Systems', 'Brand Guidelines', 'Typography & Tokens', 'Verbal Tone & Positioning'],
  },
  {
    id: '02',
    title: 'SOCIAL MEDIA MARKETING',
    description:
      'We create top-tier custom social media campaigns, multi-channel growth strategies, and high-converting creative assets that engage your target audience and amplify reach across digital channels.',
    deliverables: ['Multi-Platform Campaign Strategy', 'Content Production', 'Audience Analytics & Growth Engine', 'Paid Performance Ads'],
  },
  {
    id: '03',
    title: 'WEBSITE DESIGN & DEVELOPMENT',
    description:
      'We design and build bespoke, high-performance web applications, marketing sites, and scalable enterprise portals with clean code, lightning-fast speed, and intuitive UI/UX design.',
    deliverables: ['Custom Frontend & Backend Architecture', 'High-Performance Web Apps', 'E-Commerce Systems', 'CMS Integration', 'UI/UX Prototyping'],
  },
  {
    id: '04',
    title: 'CONTENT MARKETING',
    description:
      'We produce standard-setting copy, editorial content, and multi-format visual assets that establish industry authority, drive organic visibility, and nurture prospects through every stage of the funnel.',
    deliverables: ['Editorial & Copywriting', 'SEO Strategy', 'Technical Documentation', 'Video Scriptwriting', 'Lead Generation Assets'],
  },
  {
    id: '05',
    title: 'STRATEGIC CONSULTING',
    description:
      'From market penetration to scaling existing business operations, we provide data-driven technical and growth consulting that optimizes workflow efficiency, product roadmap, and revenue models.',
    deliverables: ['Product Architecture Consulting', 'Technical Audit & Modernization', 'Growth Roadmap', 'Cloud Strategy', 'Digital Transformation'],
  },
  {
    id: '06',
    title: 'VIDEO MARKETING',
    description:
      'We produce high-impact video advertisements, motion graphics, and product walkthrough clips that capture viewer attention, communicate brand narrative, and boost conversion metrics across campaigns.',
    deliverables: ['Commercial Production', 'Motion Design & Animation', 'Product Demos', 'Video Ad Creatives', 'Post-Production Editing'],
  },
  {
    id: '07',
    title: 'CUSTOM SOFTWARE & CLOUD',
    description:
      'We architect secure cloud infrastructure, automated deployment pipelines, and custom software systems tailored to solve complex operational challenges and guarantee high availability.',
    deliverables: ['Enterprise Web Apps', 'Cloud Architecture (AWS/GCP)', 'API & Microservices', 'CI/CD Pipelines', 'Security Audits'],
  },
  {
    id: '08',
    title: 'AI & AUTOMATION',
    description:
      'We build custom AI integrations, intelligent workflow automation tools, and automated customer engagement pipelines that streamline business operations and reduce manual overhead.',
    deliverables: ['LLM & GenAI Integration', 'Workflow Automation', 'Custom AI Agents', 'Data Ingestion Pipelines', 'Predictive Analytics'],
  },
];

export default function ServicesPage() {
  useEffect(() => {
    document.title = 'Services & Capabilities | KODEWAR Technologies';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="services-page-container">
      {/* 1. HERO BANNER */}
      <section className="services-hero">
        <div className="services-hero-eyebrow">WHAT WE DO &amp; HOW WE DO IT</div>
        <h1 className="services-hero-title">SERVICES</h1>

        <div className="services-scroll-stem">
          <span>SCROLL</span>
          <div className="services-scroll-line" />
        </div>
      </section>

      {/* 2. SUB-HEADER / INTRO SECTION */}
      <section className="services-intro-section">
        <h2 className="services-intro-title">
          OUR <span className="services-underline-accent">SERVICES</span>
        </h2>
        <div className="services-intro-eyebrow">TAILORED TO YOUR ENTERPRISE</div>
        <p className="services-intro-desc">
          We offer services which baseline standard growth and push your enterprise forward with cutting-edge design, high-performance software engineering, and strategic execution tailored for modern market leaders.
        </p>
      </section>

      {/* 3. VERTICAL SERVICES LIST (Reference Layout) */}
      <section className="services-list-container">
        {SERVICES_DATA.map((service) => (
          <div key={service.id} className="services-row-item">
            <div className="services-item-index">{service.id}</div>
            <div className="services-item-title-wrap">
              <h3 className="services-item-title">{service.title}</h3>
            </div>
            <div className="services-item-body">
              <p className="services-item-description">{service.description}</p>
              <div className="services-deliverables-wrap">
                {service.deliverables.map((item, idx) => (
                  <span key={idx} className="services-deliverable-tag">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 4. MONOCHROME TESTIMONIAL / HIGHLIGHT BANNER */}
      <section className="services-quote-banner">
        <div className="services-quote-inner">
          <blockquote className="services-quote-text">
            &ldquo;KODEWAR AND THE ENTIRE TEAM SEEM VERY CREATIVE AND ENTHUSIASTIC. WE AS A TEAM APPRECIATE THE GENUINE INPUT TIME AND AGAIN, CONSIDERATION OF FEEDBACK AND VARIOUS CREATIVE SOLUTIONS TO ENGAGE AUDIENCES &amp; CLIENTS. HOPE TO CONTINUE THE BOND AND APPRECIATION FOR CONSTANT COMMUNICATIVE PROGRESSIVE WORKING PATTERNS AS AN AGENCY.&rdquo;
          </blockquote>
          <div className="services-quote-author">
            <span className="services-author-name">EXECUTIVE DIRECTOR</span>
            <span className="services-author-role">ENTERPRISE GROWTH &amp; DIGITAL STRATEGY</span>
          </div>
        </div>
      </section>

      {/* 5. DUAL CTA BLOCKS SECTION */}
      <section className="services-cta-section">
        <div className="services-cta-grid">
          <Link to="/careers" className="services-cta-card">
            <div className="services-cta-eyebrow">AWAITING YOUR PROJECT?</div>
            <h3 className="services-cta-title">
              LET&apos;S TALK ABOUT YOU
              <span className="services-cta-arrow">&rarr;</span>
            </h3>
          </Link>

          <Link to="/work" className="services-cta-card">
            <div className="services-cta-eyebrow">SEE OUR EXPERIENCE</div>
            <h3 className="services-cta-title">
              OUR WORK
              <span className="services-cta-arrow">&rarr;</span>
            </h3>
          </Link>
        </div>
      </section>
    </div>
  );
}
