"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./timeline.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const topStages = [
  {
    id: "stage-01",
    num: "01 STAGE",
    title: "CREATE YOUR PROFILE",
    content: "Share your background, GitHub repositories, Figma portfolios, and primary area of engineering or creative focus.",
  },
  {
    id: "stage-03",
    num: "03 ENGAGE",
    title: "APPLY & SOLVE",
    content: "Participate in a practical, real-world coding or design evaluation. Zero algorithmic tricks—only realistic craft.",
  },
];

const bottomStages = [
  {
    id: "stage-02",
    num: "02 DISCOVER",
    title: "DISCOVER OPPORTUNITIES",
    content: "Explore active engineering squad openings or apply directly to our hands-on 12-week student incubator tracks.",
  },
  {
    id: "stage-04",
    num: "04 SHIP",
    title: "GROW WITH KODEWAR",
    content: "Join a high-velocity production squad, contribute to live platforms, and compound your career value daily.",
  },
];

export default function Timeline({
  title = "HOW IT WORKS.",
  subtitle = "A transparent, merit-driven evaluation designed to identify builders who take pride in production excellence.",
  periodLabel = "STAGE 01 — 04",
  activeColor = "#FFD600",
  backgroundColor = "#030304",
  imageUrl = "/phase1.png",
  imageAlt = "Kodewar Onboarding Process",
}) {
  const sectionRef = useRef(null);
  const sliderRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const slider = sliderRef.current;
    if (!section || !slider) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1025px)", () => {
      const getDistance = () => {
        return Math.max(1600, slider.scrollWidth - window.innerWidth + 300);
      };

      // Set initial hidden states for stems and dots
      ["stage-01", "stage-02", "stage-03", "stage-04"].forEach((id, idx) => {
        const isTop = idx % 2 === 0;
        gsap.set(`.jl-${id}`, {
          scaleY: 0,
          transformOrigin: isTop ? "bottom center" : "top center",
        });
        gsap.set(`.jd-${id}`, { scale: 0 });
      });

      // 1. Single Master GSAP Timeline with ONE pinned ScrollTrigger
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getDistance()}`,
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 2. Horizontal track motion across duration 1.0
      masterTl.to(
        slider,
        {
          x: () => -(slider.scrollWidth - window.innerWidth + 200),
          ease: "none",
          duration: 1.0,
        },
        0
      );

      // 3. Central Gold Progress Line expansion across duration 1.0
      masterTl.fromTo(
        ".journey-progress-line",
        { width: "0%" },
        { width: "100%", ease: "none", duration: 1.0 },
        0
      );

      // 4. Sequenced reveal of stems and dots along progress
      // Stage 01 (~15% scroll)
      masterTl
        .to(".jl-stage-01", { scaleY: 1, duration: 0.1, ease: "power1.out" }, 0.12)
        .to(".jd-stage-01", { scale: 1, duration: 0.08, ease: "back.out(1.7)" }, 0.14);

      // Stage 02 (~35% scroll)
      masterTl
        .to(".jl-stage-02", { scaleY: 1, duration: 0.1, ease: "power1.out" }, 0.35)
        .to(".jd-stage-02", { scale: 1, duration: 0.08, ease: "back.out(1.7)" }, 0.37);

      // Stage 03 (~58% scroll)
      masterTl
        .to(".jl-stage-03", { scaleY: 1, duration: 0.1, ease: "power1.out" }, 0.58)
        .to(".jd-stage-03", { scale: 1, duration: 0.08, ease: "back.out(1.7)" }, 0.60);

      // Stage 04 (~80% scroll)
      masterTl
        .to(".jl-stage-04", { scaleY: 1, duration: 0.1, ease: "power1.out" }, 0.80)
        .to(".jd-stage-04", { scale: 1, duration: 0.08, ease: "back.out(1.7)" }, 0.82);

      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);

      return () => clearTimeout(timer);
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="onboarding-journey"
      className="onboarding-timeline-section"
      style={{ backgroundColor }}
    >
      <div className="onboarding-sticky-viewport">
        <div ref={sliderRef} className="onboarding-slider-track">
          {/* Cover Image Card */}
          <div className="onboarding-cover-card">
            <img
              src={imageUrl}
              alt={imageAlt}
              className="onboarding-cover-img"
            />
            <div className="onboarding-cover-overlay" />
            <div className="onboarding-cover-caption">
              <span
                className="onboarding-cover-tag"
                style={{ color: activeColor }}
              >
                {periodLabel}
              </span>
              <h3 className="onboarding-cover-title">Evaluation Process</h3>
            </div>
          </div>

          {/* Main Grid Track Container */}
          <div className="onboarding-grid-track">
            {/* Background Gray Central Line */}
            <div className="onboarding-central-line-bg" />

            {/* Active Gold Progress Central Line */}
            <div
              className="journey-progress-line"
              style={{ backgroundColor: activeColor }}
            />

            {/* TOP ROW: Header Block + Stage 01 + Stage 03 */}
            <div className="onboarding-row-top">
              {/* Header Intro */}
              <div className="onboarding-header-block">
                <div
                  className="onboarding-header-tag"
                  style={{ color: activeColor }}
                >
                  ONBOARDING
                </div>
                <h2 className="onboarding-header-title">{title}</h2>
                <p className="onboarding-header-sub">{subtitle}</p>
              </div>

              {/* Top Stage Cards */}
              <div className="onboarding-stages-group-top">
                {topStages.map((stage) => (
                  <div key={stage.id} className="onboarding-stage-top">
                    {/* Vertical Stem Line */}
                    <div
                      className={`onboarding-stem-top jl-${stage.id}`}
                      style={{ backgroundColor: activeColor }}
                    />
                    {/* Central Gold Dot */}
                    <div
                      className={`onboarding-dot-top jd-${stage.id}`}
                      style={{ backgroundColor: activeColor }}
                    />
                    {/* Content Block */}
                    <div className="onboarding-stage-content">
                      <div
                        className="onboarding-stage-num"
                        style={{ color: activeColor }}
                      >
                        {stage.num}
                      </div>
                      <h4 className="onboarding-stage-title">{stage.title}</h4>
                      <p className="onboarding-stage-text">{stage.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BOTTOM ROW: Period Label + Stage 02 + Stage 04 */}
            <div className="onboarding-row-bottom">
              {/* Period Label Block */}
              <div className="onboarding-period-block">{periodLabel}</div>

              {/* Bottom Stage Cards */}
              <div className="onboarding-stages-group-bottom">
                {bottomStages.map((stage) => (
                  <div key={stage.id} className="onboarding-stage-bottom">
                    {/* Central Gold Dot */}
                    <div
                      className={`onboarding-dot-bottom jd-${stage.id}`}
                      style={{ backgroundColor: activeColor }}
                    />
                    {/* Vertical Stem Line */}
                    <div
                      className={`onboarding-stem-bottom jl-${stage.id}`}
                      style={{ backgroundColor: activeColor }}
                    />
                    {/* Content Block */}
                    <div className="onboarding-stage-content">
                      <div
                        className="onboarding-stage-num"
                        style={{ color: activeColor }}
                      >
                        {stage.num}
                      </div>
                      <h4 className="onboarding-stage-title">{stage.title}</h4>
                      <p className="onboarding-stage-text">{stage.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
