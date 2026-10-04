"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import StackingCards, { StackingCardItem } from "./stacking-cards";
import "./services-stack.css";

// SVG Illustration 1: Growth & Marketing (Exact match to reference diagram)
const GrowthMarketingIllustration = () => (
  <svg
    viewBox="0 0 600 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full max-h-[160px]"
  >
    {/* Left 2x2 Grid Matrix */}
    <g transform="translate(40, 10)">
      <line x1="10" y1="70" x2="130" y2="70" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="70" y1="10" x2="70" y2="130" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
      <text x="70" y="8" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">premium</text>
      <text x="70" y="142" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">budget</text>
      <text x="0" y="73" textAnchor="end" fill="#94a3b8" fontSize="10" fontFamily="monospace">simple</text>
      <text x="140" y="73" textAnchor="start" fill="#94a3b8" fontSize="10" fontFamily="monospace">expert</text>

      {/* Target Dot 'you' */}
      <circle cx="95" cy="40" r="14" fill="#3b82f6" fillOpacity="0.15" />
      <circle cx="95" cy="40" r="5" fill="#1d4ed8" />
      <text x="95" y="24" textAnchor="middle" fill="#1e293b" fontSize="11" fontWeight="600">you</text>
      
      {/* Scattered background dots */}
      <circle cx="35" cy="45" r="2.5" fill="#cbd5e1" />
      <circle cx="45" cy="100" r="2.5" fill="#cbd5e1" />
      <circle cx="110" cy="90" r="2.5" fill="#cbd5e1" />
      <circle cx="120" cy="115" r="2.5" fill="#cbd5e1" />
    </g>

    {/* Center Nodes & Cards */}
    <g transform="translate(220, 20)">
      {/* Main Focal Hub Icon */}
      <rect x="0" y="20" width="44" height="44" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
      <circle cx="22" cy="42" r="12" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
      <circle cx="22" cy="42" r="4" fill="#1d4ed8" />
      <circle cx="14" cy="74" r="3" fill="#1d4ed8" />
      <circle cx="22" cy="74" r="3" fill="#cbd5e1" />
      <circle cx="30" cy="74" r="3" fill="#cbd5e1" />

      {/* Connection lines to channels */}
      <path d="M 44 42 C 70 42, 60 12, 85 12" fill="none" stroke="#93c5fd" strokeWidth="1.5" />
      <path d="M 44 42 C 70 42, 60 42, 85 42" fill="none" stroke="#93c5fd" strokeWidth="1.5" />
      <path d="M 44 42 C 70 42, 60 72, 85 72" fill="none" stroke="#93c5fd" strokeWidth="1.5" />

      {/* Channel Cards (Search, Video, Email) */}
      {/* 1. Search */}
      <g transform="translate(85, 0)">
        <rect x="0" y="0" width="56" height="24" rx="5" fill="#ffffff" stroke="#e2e8f0" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="#64748b" strokeWidth="1.5" />
        <line x1="15" y1="15" x2="18" y2="18" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="24" y1="10" x2="48" y2="10" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
        <line x1="24" y1="15" x2="40" y2="15" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
      </g>
      {/* 2. Video */}
      <g transform="translate(85, 30)">
        <rect x="0" y="0" width="56" height="24" rx="5" fill="#ffffff" stroke="#e2e8f0" />
        <polygon points="12,8 12,16 18,12" fill="#3b82f6" />
        <line x1="24" y1="10" x2="48" y2="10" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
        <line x1="24" y1="15" x2="38" y2="15" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
      </g>
      {/* 3. Email */}
      <g transform="translate(85, 60)">
        <rect x="0" y="0" width="56" height="24" rx="5" fill="#ffffff" stroke="#e2e8f0" />
        <rect x="8" y="7" width="12" height="10" rx="2" fill="none" stroke="#64748b" strokeWidth="1.2" />
        <path d="M 8 7 L 14 12 L 20 7" fill="none" stroke="#64748b" strokeWidth="1.2" />
        <line x1="24" y1="10" x2="48" y2="10" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
        <line x1="24" y1="15" x2="42" y2="15" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Output lines to Funnel */}
      <line x1="141" y1="12" x2="165" y2="35" stroke="#93c5fd" strokeWidth="1.5" />
      <line x1="141" y1="42" x2="165" y2="42" stroke="#93c5fd" strokeWidth="1.5" />
      <line x1="141" y1="72" x2="165" y2="49" stroke="#93c5fd" strokeWidth="1.5" />
    </g>

    {/* Right Funnel & Lead Flow */}
    <g transform="translate(410, 15)">
      {/* Funnel SVG */}
      <path d="M 0 10 L 60 10 L 38 65 L 22 65 Z" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" strokeLinejoin="round" />
      <text x="68" y="38" fill="#64748b" fontSize="10" fontFamily="monospace">12 leads</text>

      {/* Retention Arc & User Avatars */}
      <g transform="translate(-10, 75)">
        <ellipse cx="40" cy="20" rx="42" ry="12" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
        <text x="-25" y="0" fill="#64748b" fontSize="10" fontFamily="monospace">Retention</text>
        
        {/* User Heads */}
        {[0, 15, 30, 45, 60, 75].map((xOffset, i) => (
          <g key={i} transform={`translate(${xOffset}, 12)`}>
            <circle cx="4" cy="4" r="3" fill={i === 4 ? "#1d4ed8" : "#94a3b8"} />
            <path d="M 0 11 C 0 8, 8 8, 8 11" fill="none" stroke={i === 4 ? "#1d4ed8" : "#94a3b8"} strokeWidth="1.2" />
          </g>
        ))}
      </g>
    </g>
  </svg>
);

// SVG Illustration 2: Engineering & Architecture
const ArchitectureIllustration = () => (
  <svg viewBox="0 0 600 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-h-[160px]">
    <g transform="translate(40, 20)">
      {/* Edge / Gateway Node */}
      <rect x="0" y="35" width="80" height="50" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
      <text x="40" y="58" textAnchor="middle" fill="#1e293b" fontSize="11" fontWeight="700">API Gateway</text>
      <text x="40" y="73" textAnchor="middle" fill="#2563eb" fontSize="9" fontFamily="monospace">v2.4 / HTTPS</text>

      {/* Flow arrows */}
      <path d="M 80 60 L 140 60" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />

      {/* Load Balancer */}
      <rect x="140" y="25" width="90" height="70" rx="10" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
      <text x="185" y="55" textAnchor="middle" fill="#1e3a8a" fontSize="12" fontWeight="700">Load Balancer</text>
      <text x="185" y="72" textAnchor="middle" fill="#2563eb" fontSize="10" fontFamily="monospace">99.999% SLA</text>

      {/* Microservice Micro-Nodes */}
      <g transform="translate(260, 0)">
        {/* Node A */}
        <rect x="0" y="0" width="100" height="36" rx="6" fill="#ffffff" stroke="#cbd5e1" />
        <circle cx="14" cy="18" r="4" fill="#22c55e" />
        <text x="26" y="22" fill="#0f172a" fontSize="11" fontWeight="600">Auth Service</text>

        {/* Node B */}
        <rect x="0" y="44" width="100" height="36" rx="6" fill="#ffffff" stroke="#cbd5e1" />
        <circle cx="14" cy="62" r="4" fill="#22c55e" />
        <text x="26" y="66" fill="#0f172a" fontSize="11" fontWeight="600">Core Engine</text>

        {/* Node C */}
        <rect x="0" y="88" width="100" height="36" rx="6" fill="#ffffff" stroke="#cbd5e1" />
        <circle cx="14" cy="106" r="4" fill="#22c55e" />
        <text x="26" y="110" fill="#0f172a" fontSize="11" fontWeight="600">Event Stream</text>
      </g>

      {/* Database Cluster Node */}
      <g transform="translate(400, 20)">
        <rect x="0" y="0" width="110" height="80" rx="10" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
        <path d="M 20 20 C 20 15, 90 15, 90 20 C 90 25, 20 25, 20 20 Z" fill="#dbeafe" stroke="#2563eb" />
        <path d="M 20 20 L 20 60 C 20 65, 90 65, 90 60 L 90 20" fill="none" stroke="#2563eb" strokeWidth="1.5" />
        <text x="55" y="48" textAnchor="middle" fill="#1e293b" fontSize="11" fontWeight="700">Postgres Cluster</text>
        <text x="55" y="62" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">Distributed DB</text>
      </g>
    </g>
  </svg>
);

// SVG Illustration 3: Discovery & Product Strategy
const DiscoveryIllustration = () => (
  <svg viewBox="0 0 600 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-h-[160px]">
    <g transform="translate(40, 15)">
      {/* Wireframe Board */}
      <rect x="0" y="0" width="220" height="130" rx="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
      <rect x="12" y="12" width="196" height="20" rx="4" fill="#eff6ff" />
      <circle cx="24" cy="22" r="3" fill="#3b82f6" />
      <circle cx="34" cy="22" r="3" fill="#93c5fd" />
      <circle cx="44" cy="22" r="3" fill="#93c5fd" />
      <line x1="60" y1="22" x2="120" y2="22" stroke="#bfdbfe" strokeWidth="3" strokeLinecap="round" />

      <rect x="12" y="42" width="90" height="76" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
      <line x1="22" y1="56" x2="82" y2="56" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
      <line x1="22" y1="68" x2="70" y2="68" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="78" x2="60" y2="78" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
      <rect x="22" y="88" width="40" height="18" rx="4" fill="#2563eb" />

      <rect x="112" y="42" width="96" height="76" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
      <circle cx="160" cy="70" r="16" fill="#dbeafe" stroke="#3b82f6" />
      <line x1="130" y1="98" x2="190" y2="98" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />

      {/* Connecting Flow Lines to Milestones */}
      <path d="M 220 65 L 280 65" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3 3" />

      {/* Discovery Roadmap Nodes */}
      <g transform="translate(280, 10)">
        <rect x="0" y="0" width="220" height="110" rx="10" fill="#ffffff" stroke="#cbd5e1" />
        
        {/* Step 1 */}
        <circle cx="20" cy="25" r="8" fill="#dbeafe" stroke="#2563eb" />
        <text x="20" y="28" textAnchor="middle" fill="#1d4ed8" fontSize="10" fontWeight="700">1</text>
        <text x="36" y="28" fill="#0f172a" fontSize="12" fontWeight="600">Audit & Scope Mapping</text>

        {/* Step 2 */}
        <circle cx="20" cy="55" r="8" fill="#dbeafe" stroke="#2563eb" />
        <text x="20" y="58" textAnchor="middle" fill="#1d4ed8" fontSize="10" fontWeight="700">2</text>
        <text x="36" y="58" fill="#0f172a" fontSize="12" fontWeight="600">Technical Spec Definition</text>

        {/* Step 3 */}
        <circle cx="20" cy="85" r="8" fill="#2563eb" />
        <text x="20" y="88" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="700">3</text>
        <text x="36" y="88" fill="#0f172a" fontSize="12" fontWeight="700">Production Sprint Roadmap</text>
      </g>
    </g>
  </svg>
);

// SVG Illustration 4: Launch & Quality Assurance
const LaunchIllustration = () => (
  <svg viewBox="0 0 600 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-h-[160px]">
    <g transform="translate(40, 20)">
      {/* CI/CD Pipeline Gauge */}
      <rect x="0" y="10" width="160" height="100" rx="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
      <text x="16" y="32" fill="#64748b" fontSize="10" fontFamily="monospace">CI/CD DEPLOYMENT</text>
      <rect x="16" y="44" width="128" height="10" rx="5" fill="#e2e8f0" />
      <rect x="16" y="44" width="128" height="10" rx="5" fill="#22c55e" />
      <text x="16" y="74" fill="#0f172a" fontSize="12" fontWeight="700">Status: Deployed</text>
      <text x="16" y="92" fill="#16a34a" fontSize="10" fontFamily="monospace">Zero-Downtime Rollout</text>

      {/* Automated Tests Badge */}
      <g transform="translate(190, 10)">
        <rect x="0" y="0" width="150" height="100" rx="12" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
        <circle cx="30" cy="35" r="12" fill="#22c55e" />
        <path d="M 24 35 L 28 39 L 36 30" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        <text x="50" y="38" fill="#1e3a8a" fontSize="14" fontWeight="800">100% Pass</text>
        <text x="16" y="68" fill="#1e293b" fontSize="11" fontWeight="600">Unit, Integration & E2E</text>
        <text x="16" y="86" fill="#2563eb" fontSize="10" fontFamily="monospace">Automated Gateways</text>
      </g>

      {/* Uptime Badge */}
      <g transform="translate(360, 10)">
        <rect x="0" y="0" width="140" height="100" rx="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <text x="20" y="34" fill="#64748b" fontSize="10" fontFamily="monospace">SLA GUARANTEE</text>
        <text x="20" y="65" fill="#0f172a" fontSize="24" fontWeight="800">99.99%</text>
        <text x="20" y="85" fill="#64748b" fontSize="10" fontFamily="monospace">Active Monitoring</text>
      </g>
    </g>
  </svg>
);

const servicesData = [
  {
    phase: "PHASE 01: GROWTH & MARKETING",
    activeTitle: "Growth & Marketing",
    desc: "How you're found, understood and remembered, turning attention into customers who come back and bring others. Positioning first, then demand: we don't spend to grow before the story is proven.",
    illustration: <GrowthMarketingIllustration />,
    chips: [
      "Positioning",
      "Branding",
      "Marketing",
      "Content creation",
      "Demand generation",
      "Retention",
    ],
  },
  {
    phase: "PHASE 02: ARCHITECTURE & SYSTEMS",
    activeTitle: "Engineering & Platform",
    desc: "Blueprints designed for decade-long scale. Data schemas, API boundaries, and resilient cloud infrastructure built to support millions of requests with zero friction.",
    illustration: <ArchitectureIllustration />,
    chips: [
      "Microservices",
      "API Design",
      "Cloud Infrastructure",
      "Database Optimization",
      "Security & Auth",
      "DevOps & CI/CD",
    ],
  },
  {
    phase: "PHASE 03: DISCOVERY & STRATEGY",
    activeTitle: "Discovery & Map",
    desc: "We audit the core before writing a line of code. System mapping, user journey alignment, risk identification, and strict scope definitions ensure we build high-impact solutions.",
    illustration: <DiscoveryIllustration />,
    chips: [
      "System Auditing",
      "Scope Definition",
      "User Research",
      "Technical Spec",
      "Architecture Map",
      "Risk Analysis",
    ],
  },
  {
    phase: "PHASE 04: LAUNCH & RELIABILITY",
    activeTitle: "Launch & Reliability",
    desc: "Zero-downtime deploys and long-term care. Production rollout with full monitoring, failover redundancy, handover documentation, and ongoing platform health assurance.",
    illustration: <LaunchIllustration />,
    chips: [
      "Zero-Downtime Deploy",
      "24/7 Monitoring",
      "Performance Audits",
      "SLA Guarantee",
      "Automated Backups",
      "Codebase Handover",
    ],
  },
];

export default function ServicesStack() {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const numCards = servicesData.length;
    const idx = Math.min(Math.floor(latest * numCards), numCards - 1);
    setActiveIndex(idx);
  });

  return (
    <section className="services-stack-section">
      <div className="services-stack-grid-bg" />
      <div className="services-stack-container">
        <div className="services-stack-grid" ref={containerRef}>
          {/* Left Column: Sticky Section Header */}
          <div className="services-stack-left">
            <div className="services-stack-sticky-title">
              <div className="services-stack-subtitle">
                UNDER ONE ROOF WE BUILD
              </div>
              <h2 className="services-stack-main-heading">
                Under one roof, we run
                <span className="services-stack-active-heading">
                  {servicesData[activeIndex]?.activeTitle}
                </span>
              </h2>

              {/* Phase selector pills */}
              <div className="services-stack-phase-indicator">
                {servicesData.map((item, idx) => (
                  <div
                    key={idx}
                    className={`services-stack-phase-pill ${
                      idx === activeIndex ? "active" : ""
                    }`}
                  >
                    <span className="dot" />
                    <span>{item.phase.split("//")[1] || item.phase}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Stacked White Cards */}
          <div className="services-stack-cards-wrapper">
            <StackingCards totalCards={servicesData.length} scaleMultiplier={0.025}>
              {servicesData.map((card, idx) => (
                <StackingCardItem
                  key={idx}
                  index={idx}
                  topPosition={`calc(100px + ${idx * 20}px)`}
                  className="mb-[20vh] last:mb-0"
                >
                  <div className="services-stack-card">
                    {/* Top Illustration Diagram */}
                    <div className="services-stack-illustration-box">
                      {card.illustration}
                    </div>

                    {/* Middle Text Paragraph */}
                    <p className="services-stack-description">
                      {card.desc}
                    </p>

                    {/* Bottom "WHAT THAT COVERS" Grid */}
                    <div>
                      <div className="services-stack-covers-header">
                        WHAT THAT COVERS
                      </div>
                      <div className="services-stack-chips-grid">
                        {card.chips.map((chip, cIdx) => (
                          <div key={cIdx} className="services-stack-chip">
                            <span className="services-stack-chip-dot" />
                            <span>{chip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </StackingCardItem>
              ))}
            </StackingCards>
          </div>
        </div>
      </div>
    </section>
  );
}
