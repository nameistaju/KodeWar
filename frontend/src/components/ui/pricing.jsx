'use client';

import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import NumberFlow from '@number-flow/react';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import './pricing.css';

export function Pricing({
  plans = [],
  title = 'CHOOSE YOUR GROWTH MODE.',
  eyebrow = null,
  description = 'Transparent, high-velocity engagements built around tangible unit economics and verifiable business growth.',
}) {
  const [isMonthly, setIsMonthly] = useState(true);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const switchRef = useRef(null);

  const handleToggle = (checked) => {
    setIsMonthly(!checked);
    if (checked && switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      confetti({
        particleCount: 50,
        spread: 60,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
        colors: [
          '#FFD600',
          '#FF2B2B',
          '#ffffff',
        ],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ['circle'],
      });
    }
  };

  const handleCtaClick = (e, href) => {
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.getElementById(href.replace('#', ''));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="pricing-wrapper">
      <div className="pricing-header">
        {eyebrow && <div className="pricing-eyebrow">{eyebrow}</div>}
        <h2 className="pricing-headline">
          {title}
        </h2>
        <p className="pricing-description">
          {description}
        </p>
      </div>

      <div className="pricing-toggle-wrap">
        <label className="pricing-toggle-label cursor-pointer">
          <Label className="cursor-pointer mr-2">Monthly</Label>
          <Switch
            ref={switchRef}
            checked={!isMonthly}
            onCheckedChange={handleToggle}
          />
          <Label className="cursor-pointer ml-2">Annual</Label>
        </label>
        <span className="pricing-save-badge">
          (Save 20%)
        </span>
      </div>

      <div className="pricing-grid">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 1 }}
            whileInView={
              isDesktop
                ? {
                    y: plan.isPopular ? -20 : 0,
                    opacity: 1,
                    x: index === 2 ? -24 : index === 0 ? 24 : 0,
                    scale: index === 0 || index === 2 ? 0.95 : 1.0,
                  }
                : {}
            }
            viewport={{ once: true }}
            transition={{
              duration: 1.2,
              type: 'spring',
              stiffness: 100,
              damping: 30,
              delay: 0.15 * index,
            }}
            className={cn(
              'pricing-card',
              plan.isPopular && 'popular',
              index === 0 && 'origin-right',
              index === 2 && 'origin-left'
            )}
          >
            {plan.isPopular && (
              <div className="pricing-popular-badge">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span>Popular</span>
              </div>
            )}

            <div className="pricing-plan-name">
              {plan.name}
            </div>

            <div className="pricing-price-row">
              <span className="pricing-price-val">
                {isNaN(Number(plan.price)) ? (
                  plan.price
                ) : (
                  <NumberFlow
                    value={
                      isMonthly ? Number(plan.price) : Number(plan.yearlyPrice)
                    }
                    format={{
                      style: 'currency',
                      currency: 'INR',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }}
                    formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
                    transformTiming={{
                      duration: 500,
                      easing: 'ease-out',
                    }}
                    willChange
                  />
                )}
              </span>
              {plan.period && (
                <span className="pricing-period">
                  / {plan.period}
                </span>
              )}
            </div>

            <p className="pricing-billing-cycle">
              {isNaN(Number(plan.price))
                ? 'custom engagement'
                : isMonthly
                ? 'billed monthly'
                : 'billed annually'}
            </p>

            <ul className="pricing-features-list">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="pricing-feature-item">
                  <Check className="pricing-feature-icon" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <hr className="pricing-divider" />

            {plan.href && plan.href.startsWith('#') ? (
              <a
                href={plan.href}
                onClick={(e) => handleCtaClick(e, plan.href)}
                className="pricing-cta-btn"
              >
                {plan.buttonText || 'Get Started'}
              </a>
            ) : (
              <Link
                to={plan.href || '/contact'}
                className="pricing-cta-btn"
              >
                {plan.buttonText || 'Get Started'}
              </Link>
            )}

            {plan.description && (
              <p className="pricing-plan-desc">
                {plan.description}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Pricing;
