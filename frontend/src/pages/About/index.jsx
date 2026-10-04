import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/about.css';
import { HorizonGlowHero } from '@/components/ui/horizon-glow-hero';
import { ImageTrail, ImageTrailItem } from '@/components/ui/image-trail';
import { AnimatedCTASection } from '@/components/ui/animated-background-lines';

const MISSION_TRAIL_IMAGES = [
  { src: '/speed.png', label: 'Speed' },
  { src: '/transparency.png', label: 'Transparency' },
  { src: '/innovation.png', label: 'Innovation' },
  { src: '/commitment.png', label: 'Commitment' },
  { src: '/fun.png', label: 'Fun' },
  { src: '/hardwork.png', label: 'Hard Work' },
];

const METRICS = [
  { value: '15,000+', label: 'Audience & Client Reach' },
  { value: '300+', label: 'Projects Delivered' },
  { value: '300+', label: 'Campaigns & Systems Shipped' },
  { value: '2,988+', label: 'Cups of Coffee & Counting' },
];

const TEAM_IMAGES = [
  {
    name: 'Aarefa — Full Stack Developer',
    src: '/about/Aarefa — Full Stack Developer.png',
  },
  {
    name: 'Bhagya Lakshmi — AI Engineer',
    src: '/about/Bhagya Lakshmi — AI Engineer Profile.png',
  },
  {
    name: 'Kiran — Full Stack Developer',
    src: '/about/Kiran Full Stack Developer Profile.png',
  },
  {
    name: 'Manibala — Modern Monochrome Portrait',
    src: '/about/Modern Monochrome Corporate Portrait.png',
  },
  {
    name: 'Surya — Web Developer',
    src: '/about/Monochrome Corporate Profile_ Surya, Web Developer.png',
  },
  {
    name: 'Srinivas — Monochrome Team Profile',
    src: '/about/Monochrome Corporate Team Profile.png',
  },
  {
    name: 'Nisha — Web Developer',
    src: '/about/Nisha Web Developer Profile Card.png',
  },
  {
    name: 'Rizwana — Web Developer Spotlight',
    src: '/about/Rizwana — Web Developer Spotlight.png',
  },
  {
    name: 'Shanawaz — Digital Marketer',
    src: '/about/Shanawaz Digital Marketer Profile Poster.png',
  },
];

export default function AboutPage() {
  useEffect(() => {
    document.title = 'About Us | KODEWAR Technologies';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page">
      {/* 01. HORIZON GLOW HERO SECTION */}
      <HorizonGlowHero
        title="We work for you."
      >
        <div className="horizon-actions">
          <Link to="/contact" className="horizon-btn-primary">
            <span>Start a Project</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <a href="#team" className="horizon-btn-secondary">
            <span>Meet Our Team</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </HorizonGlowHero>

      {/* 02. OUR STORY & ETHOS */}
      <section className="about-story-section">
        <div className="about-story-grid">
          <div className="about-story-left">
            <h2 className="about-story-heading">
              What can we do to solve problems for businesses using our experience, ideas, creativity, and passion?
            </h2>
            <p className="about-story-text">
              After intensive brainstorming, meditating, and coffee-fueled sessions, we came together with a singular purpose: <strong>YOU MATTER TO US</strong>.
            </p>
            <p className="about-story-text">
              Everything that you believe, you’ve worked for, and you ought to create out there in the world — it matters to us more than anything else. From the very beginning, we have aligned our goals to our clients', and the results have been remarkable.
            </p>
            <p className="about-story-text">
              Here we are: to strategize your marketing activities, plan your digital presence, architect your web platforms, and make your brand story unforgettable with passion, precision, and compassion.
            </p>
          </div>

          <div className="about-story-photos">
            <div className="about-story-photo-main">
              <img
                src="/about/photo-of-people-using-laptop-3194519-2.jpg"
                alt="Kodewar Team Collaboration"
                loading="lazy"
              />
            </div>
            <div className="about-story-photo-sub">
              <img
                src="/about/apple-applications-apps-cell-phone-607812-e1587374075217.jpg"
                alt="Digital Platform Engineering"
                loading="lazy"
              />
            </div>
            <div className="about-story-photo-sub">
              <img
                src="/about/adult-blur-camera-casual-598917-e1588579788252.jpg"
                alt="Creative Media and Photography"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 03. MISSION SECTION WITH INTERACTIVE IMAGE TRAIL */}
      <section className="about-mission-section">
        {/* Subtle Background Grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Interactive Image Trail (speed, transparency, innovation, commitment, fun, hardwork) */}
        <ImageTrail
          className="absolute inset-0"
          threshold={75}
          intensity={0.25}
          repeatChildren={8}
          keyframes={{
            scale: [0.35, 1, 1, 0.35],
            rotate: [-6, 0, 5, 0],
            opacity: [0, 1, 1, 0],
          }}
          keyframesOptions={{
            duration: 1.25,
            times: [0, 0.06, 0.85, 1],
            ease: 'easeOut',
          }}
          trailElementAnimationKeyframes={{
            x: { duration: 0.35, type: 'tween', ease: 'easeOut' },
            y: { duration: 0.35, type: 'tween', ease: 'easeOut' },
          }}
        >
          {MISSION_TRAIL_IMAGES.map((img, index) => (
            <ImageTrailItem key={index}>
              <img
                src={img.src}
                alt={img.label}
                className="image-trail-img"
              />
            </ImageTrailItem>
          ))}
        </ImageTrail>

        {/* Centered Mission Statement */}
        <div className="about-mission-inner">
          <div className="about-mission-header">
            <h2 className="about-mission-title">
              We strive to create leading brand and technology stories by aligning our client's goals with ours.
            </h2>
          </div>
        </div>
      </section>

      {/* 04. IMPACT BY THE NUMBERS */}
      <section className="about-numbers-section">
        <div className="about-numbers-grid">
          {METRICS.map((metric, idx) => (
            <div key={idx} className="about-number-item">
              <span className="about-number-value">{metric.value}</span>
              <span className="about-number-label">{metric.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 05. MEET OUR TEAM */}
      <section className="about-team-section" id="team">
        <div className="about-team-inner">
          <div className="about-team-header">
            <h2 className="about-team-title">Meet Our Team</h2>
            <p className="about-team-subtitle">
              A collective of passionate designers, strategists, developers, video artists, and storytellers who bring ideas to life.
            </p>
          </div>

          <div className="about-team-grid">
            {TEAM_IMAGES.map((member, idx) => (
              <div key={idx} className="about-team-card">
                <img
                  src={member.src}
                  alt={member.name}
                  className="about-team-img"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 06. CLOSING CTA */}
      <AnimatedCTASection
        title={
          <>
            Ready to make your idea
            <br />
            <span className="abl-gradient-text">the next big thing?</span>
          </>
        }
        subtitle="We were waiting for you. Let's partner to engineer high-standard digital products and amplify your market presence."
      >
        <Link to="/contact" className="abl-btn-primary">
          <span>Start a Project</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
        <Link to="/careers" className="abl-btn-secondary">
          <span>Join Our Team</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </AnimatedCTASection>
    </div>
  );
}
