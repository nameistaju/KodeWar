"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./how-we-work.css";

const phasesData = [
  {
    phase: "PHASE 01: DISCOVERY & MAP",
    shortName: "01. DISCOVERY & MAP",
    leftTitle: "Under one roof, we audit & map core systems.",
    leftSub: "Every project starts with system mapping, risk identification, and aligning on strict delivery boundaries.",
    cardTitle: "We audit the core before writing a line.",
    cardDesc: "System mapping, risk identification, and strict scope boundaries established prior to development.",
    img: "/phase1.png",
  },
  {
    phase: "PHASE 02: ARCHITECTURE",
    shortName: "02. ARCHITECTURE",
    leftTitle: "Under one roof, we architect for decade scale.",
    leftSub: "Data schemas, API boundaries, and resilient cloud infrastructure designed before product code begins.",
    cardTitle: "Blueprints designed for decade-long scale.",
    cardDesc: "Data schemas, API boundaries, and infrastructure definitions built to support high-velocity growth.",
    img: "/phase2.png",
  },
  {
    phase: "PHASE 03: ENGINEERING",
    shortName: "03. ENGINEERING",
    leftTitle: "Under one roof, we execute with precision.",
    leftSub: "Our engineering pairs work in focused sprints with continuous integration, automated testing, and zero fluff.",
    cardTitle: "Precision execution. Zero fluff.",
    cardDesc: "Focused engineering sprints with automated testing, continuous integration, and transparent milestones.",
    img: "/phase3.png",
  },
  {
    phase: "PHASE 04: LAUNCH & GROWTH",
    shortName: "04. LAUNCH & GROWTH",
    leftTitle: "Under one roof, we deploy & evolve products.",
    leftSub: "Zero-downtime deploys, continuous monitoring, complete documentation handover, and platform assurance.",
    cardTitle: "Built to perform. Designed to evolve.",
    cardDesc: "Production rollout with zero downtime, full monitoring, handover documentation, and ongoing health care.",
    img: "/phase4.png",
  },
];

export default function HowWeWork() {
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToCard = (index) => {
    setActiveIndex(index);
    const element = document.getElementById(`phase-card-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section className="hww-section" style={{ backgroundColor: '#050505', borderRadius: '0px', overflow: 'visible' }}>
      {/* Subtle Background Grid */}
      <div className="hww-grid-bg" />

      <div className="hww-container" style={{ overflow: 'visible' }}>
        <div className="hww-grid" style={{ alignItems: 'stretch', overflow: 'visible' }}>
          
          {/* Left Column: Sticky Dynamic Editorial Header (Stays Fixed Throughout Section Scroll) */}
          <div className="hww-left-col" style={{ height: '100%', position: 'relative', overflow: 'visible' }}>
            <div className="hww-left-sticky" style={{ position: 'sticky', top: '130px', zIndex: 60, borderRadius: '0px' }}>
              <div className="hww-tag" style={{ borderRadius: '0px' }}>
                <span className="hww-tag-dot" style={{ borderRadius: '0px' }} />
                HOW WE WORK
              </div>

              {/* Dynamic Animated Left Title */}
              <div className="hww-heading-wrap">
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={activeIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="hww-heading"
                  >
                    {phasesData[activeIndex].leftTitle}
                  </motion.h2>
                </AnimatePresence>
              </div>

              {/* Dynamic Animated Left Subtitle */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="hww-description"
                >
                  {phasesData[activeIndex].leftSub}
                </motion.p>
              </AnimatePresence>

              {/* Phase Navigation Pills (Sharp 0px Radius) */}
              <div className="hww-phase-nav">
                {phasesData.map((item, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => scrollToCard(idx)}
                      className={`hww-nav-pill ${isActive ? "active" : ""}`}
                      style={{ borderRadius: '0px' }}
                    >
                      <div className="hww-nav-dot" style={{ borderRadius: '0px' }} />
                      <span>{item.shortName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Compact Sticky Stacking Phase Cards */}
          <div className="hww-right-col" style={{ overflow: 'visible' }}>
            {phasesData.map((item, idx) => (
              <motion.div
                key={idx}
                id={`phase-card-${idx}`}
                onViewportEnter={() => setActiveIndex(idx)}
                viewport={{ amount: 0.35 }}
                className="hww-sticky-card"
                style={{
                  position: 'sticky',
                  top: `${115 + idx * 18}px`,
                  zIndex: 10 + idx * 10,
                  borderRadius: '0px',
                  marginBottom: idx === phasesData.length - 1 ? '0px' : '180px',
                }}
              >
                {/* Header Info */}
                <div className="hww-card-header">
                  <div className="hww-card-top-bar">
                    <span className="hww-card-badge" style={{ borderRadius: '0px' }}>
                      {item.phase}
                    </span>
                    <span className="hww-card-num">
                      PHASE 0{idx + 1}
                    </span>
                  </div>

                  <h3 className="hww-card-title">
                    {item.cardTitle}
                  </h3>

                  <p className="hww-card-desc">
                    {item.cardDesc}
                  </p>
                </div>

                {/* Compact Sharp Image Viewport Container (170px-190px Height for 100% Full Visibility) */}
                <div 
                  className="hww-image-box" 
                  style={{ 
                    borderRadius: '0px', 
                    height: '190px', 
                    maxHeight: '200px', 
                    overflow: 'hidden', 
                    position: 'relative', 
                    background: '#050507' 
                  }}
                >
                  <img
                    src={item.img}
                    alt={item.phase}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover', 
                      objectPosition: 'center', 
                      borderRadius: '0px', 
                      display: 'block' 
                    }}
                    loading="lazy"
                  />
                  <div className="hww-image-overlay" />
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
