import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import HeroHeadline from './HeroHeadline';
import GlobeVisual from './GlobeVisual';

export default function Hero() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  // 2D Canvas ambient particles (subtle stars / atmospheric dust)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animId = null;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.3 + 0.3,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      a: Math.random() * 0.45 + 0.1,
    }));

    let px = width / 2;
    let py = height / 2;

    const onMouseMove = (e) => {
      px = e.clientX;
      py = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        const dx = p.x - px;
        const dy = p.y - py;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const glow = dist < 200 ? (200 - dist) / 200 : 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + glow * 1.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.a + glow * 0.4})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section id="hero" className="hero-section">
      {/* Background cinematic video with low opacity */}
      <video
        ref={videoRef}
        className="hero-video"
        src="/herosection.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="hero-vignette"></div>
      <canvas ref={canvasRef} id="hero-canvas"></canvas>

      {/* Main Single-View 2-Column Composition */}
      <div className="hero-inner-container">
        <div className="hero-grid">
          {/* Left Column: Typography & Primary CTA */}
          <div className="hero-content-col">
            <HeroHeadline />

            <p className="hero-sub">
              We build websites, apps, digital experiences and marketing systems that help businesses grow.
            </p>

            <div className="hero-cta-group">
              <Link to="/contact" className="btn-hero-primary">
                <span>START A PROJECT</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>

            {/* Proud to Support Section */}
            <div className="hero-proud-support">
              <span className="hero-proud-title">Proud to Support</span>
              <div className="hero-proud-logos">
                <div className="hero-proud-logo-item">
                  <img
                    src="/logos/ministry-of-labour-and-employment-logo.webp"
                    alt="Ministry of Labour & Employment"
                    title="Ministry of Labour & Employment"
                  />
                </div>
                <div className="hero-proud-logo-item">
                  <img
                    src="/logos/imgi_89_image.webp"
                    alt="AICTE"
                    title="AICTE"
                  />
                </div>
                <div className="hero-proud-logo-item">
                  <img
                    src="/logos/DPIIT-header-new.webp"
                    alt="DPIIT #startupindia"
                    title="DPIIT #startupindia"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Prominent Globe Visual */}
          <div className="hero-visual-col">
            <GlobeVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
