'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import Balancer from 'react-wrap-balancer';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Cta } from '@/components/ui/hero-08-utils/cta';
import './hero-08.css';

const variantStyles = {
  standard: {
    section: 'hero08-section-standard',
    title: 'hero08-title-standard',
    description: 'hero08-desc-standard',
    header: 'hero08-header-standard',
    content: 'hero08-content-standard',
    grid: 'hero08-grid-standard',
    card: 'hero08-card-standard',
    cardTitle: 'hero08-card-title-standard',
    cardBody: 'hero08-card-body-standard',
  },
  compact: {
    section: 'hero08-section-compact',
    title: 'hero08-title-compact',
    description: 'hero08-desc-compact',
    header: 'hero08-header-compact',
    content: 'hero08-content-compact',
    grid: 'hero08-grid-compact',
    card: 'hero08-card-compact',
    cardTitle: 'hero08-card-title-compact',
    cardBody: 'hero08-card-body-compact',
  },
};

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 12, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const mediaItem = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

function Reveal({ active, variants, className, children }) {
  if (!active) return <div className={className}>{children}</div>;

  return (
    <motion.div variants={variants ?? item} className={className}>
      {children}
    </motion.div>
  );
}

function FeatureCard({ card, vs }) {
  const titleClass = card.invert ? 'text-white' : 'text-neutral-100';
  const subtitleClass = card.invert ? 'text-neutral-300' : 'text-neutral-400';

  return (
    <div
      className={cn(
        'hero08-card relative isolate w-full overflow-hidden rounded-xl border border-white/10 bg-neutral-950',
        vs.card
      )}
    >
      {card.image && (
        <img
          src={card.image}
          alt={card.imageAlt ?? ''}
          decoding="async"
          className="hero08-card-img absolute inset-0 -z-10 size-full object-cover"
        />
      )}

      {card.invert && (
        <div
          aria-hidden
          className="hero08-card-overlay absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/55 to-black/30"
        />
      )}

      <div className={cn('hero08-card-body flex h-full flex-col items-start justify-end', vs.cardBody)}>
        {card.badge && (
          <span className="hero08-card-badge mb-3 font-mono text-[11px] tracking-widest text-neutral-400 uppercase">
            {card.badge}
          </span>
        )}
        <h3 className={cn('hero08-card-heading font-semibold tracking-tight text-2xl sm:text-3xl', vs.cardTitle, titleClass)}>
          <Balancer>{card.title}</Balancer>
        </h3>
        <p className={cn('hero08-card-sub mt-2 text-sm sm:text-base leading-relaxed', subtitleClass)}>
          {card.subtitle}
        </p>
        {card.cta?.ctaEnabled && (
          <div className="hero08-card-cta mt-6">
            <Cta cta={card.cta} invert={card.invert} />
          </div>
        )}
      </div>
    </div>
  );
}

export function Hero08({
  eyebrow,
  title,
  description,
  socialProof,
  avatars,
  cards,
  animation = 'none',
  variant = 'standard',
}) {
  const reduce = useReducedMotion();
  const animate = animation === 'subtle' && !reduce;
  const vs = variantStyles[variant] || variantStyles.standard;

  const titleElement = title && (
    <div className="hero08-title-group">
      {eyebrow && (
        <div className="hero08-eyebrow font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4">
          {eyebrow}
        </div>
      )}
      <h2
        className={cn(
          'hero08-title font-semibold tracking-tight text-balance text-white',
          vs.title
        )}
      >
        <Balancer>{title}</Balancer>
      </h2>
    </div>
  );

  const descriptionElement = description && (
    <p className={cn('hero08-desc text-neutral-400 max-w-md text-base leading-relaxed', vs.description)}>
      <Balancer>{description}</Balancer>
    </p>
  );

  const socialProofElement = (socialProof || avatars?.length) && (
    <div className="hero08-social-proof flex flex-col items-start gap-3">
      {socialProof && (
        <p className="hero08-social-text text-neutral-200 text-xs sm:text-sm font-medium tracking-wide">
          {socialProof}
        </p>
      )}
      {avatars?.length ? (
        <div className="hero08-avatars-row flex -space-x-2.5">
          {avatars.map((a, idx) => (
            <Avatar
              key={a.src || idx}
              className="size-9 ring-2 ring-black"
            >
              <AvatarImage src={a.src} alt="" />
              <AvatarFallback className="text-[11px] font-mono">{a.fallback}</AvatarFallback>
            </Avatar>
          ))}
        </div>
      ) : null}
    </div>
  );

  const cardsElement = cards?.length ? (
    <div className={cn('hero08-grid grid grid-cols-1 md:grid-cols-2', vs.grid)}>
      {cards.map((card) => (
        <FeatureCard key={card.title} card={card} vs={vs} />
      ))}
    </div>
  ) : null;

  return (
    <section className="hero08-wrap relative isolate w-full overflow-hidden">
      <motion.div
        className={cn(
          'hero08-inner relative z-10 mx-auto flex max-w-7xl flex-col',
          vs.section,
          vs.content
        )}
        variants={animate ? container : undefined}
        initial={animate ? 'hidden' : false}
        whileInView={animate ? 'visible' : undefined}
        viewport={{ once: true, margin: '-80px' }}
      >
        <Reveal
          active={animate}
          className={cn(
            'hero08-header grid grid-cols-1 items-end lg:grid-cols-2',
            vs.header
          )}
        >
          {titleElement}
          <div className="hero08-header-right flex flex-col items-start gap-5">
            {descriptionElement}
            {socialProofElement}
          </div>
        </Reveal>

        <Reveal active={animate} variants={mediaItem} className="w-full">
          {cardsElement}
        </Reveal>
      </motion.div>
    </section>
  );
}

export default Hero08;
