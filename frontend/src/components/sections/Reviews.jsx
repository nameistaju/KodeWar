"use client";

import React from 'react';
import ThreeDTestimonials from '../ui/3d-testimonials';

export default function Reviews() {
  return (
    <section
      id="reviews"
      style={{
        position: 'relative',
        backgroundColor: '#030304',
        color: '#ffffff',
        paddingTop: '80px',
        paddingBottom: '20px',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        boxSizing: 'border-box',
        width: '100%'
      }}
    >
      {/* Header Info */}
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto 40px auto',
          padding: '0 24px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 20
        }}
      >
        <h2
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(32px, 4.5vw, 54px)',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            margin: '0 0 12px 0',
            lineHeight: 1.1
          }}
        >
          Trusted by Enterprise Leaders
        </h2>

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(14px, 1.6vw, 16px)',
            color: 'rgba(255, 255, 255, 0.7)',
            lineHeight: 1.6,
            maxWidth: '640px',
            margin: '0 auto'
          }}
        >
          What founders, engineering executives, and operations heads say about building with KODEWAR.
        </p>
      </div>

      <ThreeDTestimonials />
    </section>
  );
}
