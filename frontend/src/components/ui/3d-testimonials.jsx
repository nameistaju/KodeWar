"use client";

import React from 'react';
import { reviewsData } from '@/data/reviews';
import './3d-testimonials.css';

function StarSvg() {
  return (
    <svg viewBox="0 0 20 20" width="13" height="13" fill="#FFD600">
      <path d="M10 1l2.6 6.2 6.7.5-5.1 4.4 1.6 6.5L10 15.2 4.2 18.6l1.6-6.5L.7 7.7l6.7-.5z" />
    </svg>
  );
}

function getInitials(name) {
  if (!name) return 'KW';
  return name.replace('.', '').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

function TestimonialCard({ name, category, text }) {
  return (
    <div className="testimonial-card-3d">
      <div className="testimonial-card-header">
        <div className="testimonial-card-user">
          <div className="testimonial-card-avatar">
            {getInitials(name)}
          </div>
          <div>
            <h4 className="testimonial-card-name">{name}</h4>
            <span className="testimonial-card-category">{category}</span>
          </div>
        </div>
        <div className="testimonial-card-stars">
          <StarSvg />
          <StarSvg />
          <StarSvg />
          <StarSvg />
          <StarSvg />
        </div>
      </div>
      <p className="testimonial-card-body">
        "{text}"
      </p>
    </div>
  );
}

export function ThreeDTestimonials() {
  // Distribute 12 reviews across 6 distinct columns
  const col1 = reviewsData.slice(0, 2);
  const col2 = reviewsData.slice(2, 4);
  const col3 = reviewsData.slice(4, 6);
  const col4 = reviewsData.slice(6, 8);
  const col5 = reviewsData.slice(8, 10);
  const col6 = reviewsData.slice(10, 12);

  // Repeat for continuous infinite vertical loop
  const c1 = [...col1, ...col1, ...col1];
  const c2 = [...col2, ...col2, ...col2];
  const c3 = [...col3, ...col3, ...col3];
  const c4 = [...col4, ...col4, ...col4];
  const c5 = [...col5, ...col5, ...col5];
  const c6 = [...col6, ...col6, ...col6];

  return (
    <div className="testimonials-3d-stage">
      {/* Top & Bottom Gradient Overlay Masks */}
      <div className="testimonials-mask-top" />
      <div className="testimonials-mask-bottom" />

      {/* Full-Width 3D Tilted Isometric Grid */}
      <div className="testimonials-3d-grid">
        {/* Column 1 (Scrolling Down) */}
        <div className="marquee-col marquee-col-down" style={{ '--duration': '36s' }}>
          {c1.map((review, i) => (
            <TestimonialCard key={`c1-${i}`} {...review} />
          ))}
        </div>

        {/* Column 2 (Scrolling Up) */}
        <div className="marquee-col marquee-col-up" style={{ '--duration': '30s' }}>
          {c2.map((review, i) => (
            <TestimonialCard key={`c2-${i}`} {...review} />
          ))}
        </div>

        {/* Column 3 (Scrolling Down) */}
        <div className="marquee-col marquee-col-down" style={{ '--duration': '42s' }}>
          {c3.map((review, i) => (
            <TestimonialCard key={`c3-${i}`} {...review} />
          ))}
        </div>

        {/* Column 4 (Scrolling Up) */}
        <div className="marquee-col marquee-col-up" style={{ '--duration': '32s' }}>
          {c4.map((review, i) => (
            <TestimonialCard key={`c4-${i}`} {...review} />
          ))}
        </div>

        {/* Column 5 (Scrolling Down) */}
        <div className="marquee-col marquee-col-down" style={{ '--duration': '38s' }}>
          {c5.map((review, i) => (
            <TestimonialCard key={`c5-${i}`} {...review} />
          ))}
        </div>

        {/* Column 6 (Scrolling Up) */}
        <div className="marquee-col marquee-col-up" style={{ '--duration': '34s' }}>
          {c6.map((review, i) => (
            <TestimonialCard key={`c6-${i}`} {...review} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ThreeDTestimonials;
