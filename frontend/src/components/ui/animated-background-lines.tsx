import React from 'react';
import './animated-background-lines.css';

export interface AnimatedCTAProps {
  title?: React.ReactNode;
  highlightText?: string;
  subtitle?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  children?: React.ReactNode;
  className?: string;
}

const lineWrapperTops = ['10%', '30%', '50%', '70%', '90%'];

export const AnimatedCTASection: React.FC<AnimatedCTAProps> = ({
  title,
  highlightText,
  subtitle,
  primaryButtonText = "Start building",
  primaryButtonHref = "#",
  secondaryButtonText,
  secondaryButtonHref,
  children,
  className = "",
}) => {
  return (
    <section className={`abl-section ${className}`}>
      {/* Grid Background */}
      <div className="abl-grid-bg" />

      {/* Ambient Glow */}
      <div className="abl-ambient-glow" />

      {/* Animated Background Lines */}
      <div className="abl-lines-container">
        {lineWrapperTops.map((topPos, index) => (
          <div
            key={index}
            className="abl-line-wrapper"
            style={{ top: topPos }}
          >
            <div className="abl-line-track">
              <div
                className={`abl-line-beam ${index % 2 !== 0 ? 'abl-line-reverse' : ''}`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Corner Lines */}
      <div className="abl-corner-lines-box">
        <svg
          className="abl-corner-svg-left"
          viewBox="0 0 120 60"
        >
          <path d="M120 0 L20 0 Q0 0 0 20 L0 60" />
        </svg>
        <svg
          className="abl-corner-svg-right"
          viewBox="0 0 120 60"
        >
          <path d="M120 0 L20 0 Q0 0 0 20 L0 60" />
        </svg>
      </div>

      {/* Main Content */}
      <div className="abl-content">
        <h2 className="abl-title">
          {title || (
            <>
              Ready to build
              <br />
              <span className="abl-gradient-text">
                {highlightText || "the software of the future?"}
              </span>
            </>
          )}
        </h2>

        {subtitle && (
          <p className="abl-subtitle">
            {subtitle}
          </p>
        )}

        {children ? (
          <div className="abl-actions">
            {children}
          </div>
        ) : (
          <div className="abl-actions">
            <a
              href={primaryButtonHref}
              className="abl-btn-primary"
            >
              <span>{primaryButtonText}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            {secondaryButtonText && (
              <a
                href={secondaryButtonHref || '#'}
                className="abl-btn-secondary"
              >
                <span>{secondaryButtonText}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default function CtaPage() {
  return (
    <div className="bg-black w-full">
      <AnimatedCTASection />
    </div>
  );
}
