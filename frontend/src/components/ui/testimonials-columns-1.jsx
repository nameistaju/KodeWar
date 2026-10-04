'use client';

import React from 'react';
import { motion } from 'motion/react';
import './testimonials-columns-1.css';

export const testimonials = [
  {
    text: 'As a seasoned designer always on the lookout for innovative tools, KODEWAR instantly grabbed my attention. The velocity of execution and clean aesthetic is unrivaled.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    name: 'Jamie Rivera',
    role: 'Full Stack Developer',
    rating: 5,
  },
  {
    text: "Our team's acquisition efficiency skyrocketed after migrating to KODEWAR's digital marketing and paid funnels. We scaled our pipeline with 3.4x ROAS.",
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    name: 'Josh Smith',
    role: 'Marketing Manager',
    rating: 5,
  },
  {
    text: 'This system completely transformed how we build and ship digital products. The engineering standards and code quality are unmatched.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    name: 'Morgan Lee',
    role: 'Growth Marketer',
    rating: 5,
  },
  {
    text: 'I was amazed at how quickly we were able to launch multi-channel growth experiments. Zero friction, total transparency, and rock-solid tracking.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    name: 'Casey Jordan',
    role: 'Engineering Director',
    rating: 5,
  },
  {
    text: 'Planning and executing scale campaigns has never been easier. The dashboard clarity and deep analytics keep everyone aligned across sprints.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    name: 'Taylor Kim',
    role: 'Product Designer',
    rating: 5,
  },
  {
    text: 'The customizability, speed, and modern architectural elegance are on another level. Highly recommended for any serious business.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
    name: 'Riley Smith',
    role: 'Founder & CEO',
    rating: 5,
  },
  {
    text: 'Adopting their growth framework was a breeze. Creative testing became systematic and CAC dropped by over 38% in the first quarter.',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150',
    name: 'Jordan Patels',
    role: 'Creative Director',
    rating: 5,
  },
  {
    text: 'With KODEWAR, we can easily track every dollar spent and optimize conversions with pinpoint precision. Phenomenal performance.',
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150',
    name: 'Sam Dawson',
    role: 'E-Commerce Head',
    rating: 5,
  },
  {
    text: 'Its user-friendly interface and robust technical foundation support our high-traffic campaigns seamlessly. A true partnership in growth.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150',
    name: 'Casey Harper',
    role: 'Brand Strategist',
    rating: 5,
  },
];

export const TestimonialsColumn = ({
  className = '',
  testimonials: items = [],
  duration = 15,
}) => {
  return (
    <div className={`testimonials-column-container ${className}`}>
      <motion.div
        animate={{
          translateY: '-50%',
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
        className="testimonials-column-inner"
      >
        {[...new Array(2)].fill(0).map((_, groupIndex) => (
          <React.Fragment key={groupIndex}>
            {items.map((item, i) => {
              const quoteText = item.text || item.quote;
              const authorImage = item.image || item.avatar;
              const authorName = item.name;
              const authorRole = item.role;
              const rating = item.rating || 5;

              return (
                <div
                  className="testimonials-card"
                  key={`${groupIndex}-${i}`}
                >
                  {/* Star Rating */}
                  <div className="testimonials-card-stars" aria-label={`${rating} out of 5 stars`}>
                    {[...Array(rating)].map((_, s) => (
                      <svg
                        key={s}
                        className="testimonials-star-icon"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Testimonial Quote */}
                  <div className="testimonials-card-quote">
                    "{quoteText}"
                  </div>

                  {/* Author Meta */}
                  <div className="testimonials-card-author">
                    <div className="testimonials-card-avatar-wrap">
                      <img
                        width={44}
                        height={44}
                        src={authorImage}
                        alt={authorName}
                        className="testimonials-card-avatar"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          if (e.currentTarget.nextElementSibling) {
                            e.currentTarget.nextElementSibling.style.display = 'flex';
                          }
                        }}
                      />
                      <div
                        className="testimonials-card-avatar-fallback"
                        style={{ display: 'none' }}
                      >
                        {authorName ? authorName.charAt(0) : 'K'}
                      </div>
                    </div>

                    <div className="testimonials-card-meta">
                      <div className="testimonials-card-name">
                        {authorName}
                      </div>
                      <div className="testimonials-card-role">
                        {authorRole}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};

export const Testimonials = ({
  testimonials: customTestimonials,
  firstColumn: customFirst,
  secondColumn: customSecond,
  thirdColumn: customThird,
  eyebrow = null,
  title = 'What Our Clients & Partners Say',
  description = 'From intuitive design systems to scale marketing and career growth, hear directly from the people building with KODEWAR.',
  className = '',
  id,
}) => {
  const source = customTestimonials || testimonials;
  const col1 = customFirst || source.slice(0, Math.ceil(source.length / 3));
  const col2 = customSecond || source.slice(Math.ceil(source.length / 3), Math.ceil((source.length / 3) * 2));
  const col3 = customThird || source.slice(Math.ceil((source.length / 3) * 2));

  return (
    <section className={`testimonials-section ${className}`} id={id}>
      <div className="testimonials-container">
        <div className="testimonials-header">
          {eyebrow && (
            <div>
              <span className="testimonials-pill-tag">{eyebrow}</span>
            </div>
          )}
          {title && <h2 className="testimonials-title">{title}</h2>}
          {description && <p className="testimonials-description">{description}</p>}
        </div>

        <div className="testimonials-columns-wrapper">
          <TestimonialsColumn testimonials={col1} duration={15} />
          <TestimonialsColumn
            testimonials={col2}
            className="testimonials-col-2"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={col3}
            className="testimonials-col-3"
            duration={17}
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
