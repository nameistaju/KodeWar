'use client';

import React from 'react';
import { motion } from 'framer-motion';
import './background-paths.css';

export function FloatingPaths({ position = 1 }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(255,255,255,${0.08 + i * 0.025})`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="bg-paths-svg-wrap">
      <svg
        className="bg-paths-svg"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.08 + path.id * 0.022}
            initial={{ pathLength: 0.3, opacity: 0.5 }}
            animate={{
              pathLength: 1,
              opacity: [0.25, 0.6, 0.25],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + (path.id % 10) * 1.2,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear',
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export function BackgroundPaths({
  title = 'Background Paths',
  badge = null,
  subtitle = null,
  children = null,
  primaryButton = null,
  secondaryButton = null,
  className = '',
}) {
  const words = title.split(' ');

  return (
    <div className={`bg-paths-wrapper ${className}`}>
      {/* Background Animated Curved Paths */}
      <div className="bg-paths-svg-wrap">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="bg-paths-ambient" />

      <div className="bg-paths-content">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.2 }}
          style={{ width: '100%' }}
        >
          {badge && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-paths-badge"
            >
              {badge}
            </motion.div>
          )}

          <h2 className="bg-paths-title">
            {words.map((word, wordIndex) => (
              <span key={wordIndex} className="bg-paths-word">
                {word.split('').map((letter, letterIndex) => (
                  <motion.span
                    key={`${wordIndex}-${letterIndex}`}
                    initial={{ y: 80, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      delay: wordIndex * 0.08 + letterIndex * 0.025,
                      type: 'spring',
                      stiffness: 150,
                      damping: 25,
                    }}
                    className="bg-paths-letter"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            ))}
          </h2>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="bg-paths-subtitle"
            >
              {subtitle}
            </motion.p>
          )}

          {children ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45, duration: 0.7 }}
              className="bg-paths-actions"
            >
              {children}
            </motion.div>
          ) : (primaryButton || secondaryButton) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45, duration: 0.7 }}
              className="bg-paths-actions"
            >
              {primaryButton && (
                <div className="bg-paths-btn-wrap">
                  <a
                    href={primaryButton.href || '#'}
                    onClick={primaryButton.onClick}
                    className="bg-paths-btn-primary"
                  >
                    <span>{primaryButton.text || 'Discover Excellence'}</span>
                    <span className="bg-paths-btn-arrow">→</span>
                  </a>
                </div>
              )}
              {secondaryButton && (
                <a
                  href={secondaryButton.href || '#'}
                  onClick={secondaryButton.onClick}
                  className="bg-paths-btn-secondary"
                >
                  <span>{secondaryButton.text}</span>
                </a>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default BackgroundPaths;
