import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface CtaProps {
  ctaEnabled?: boolean;
  text?: string;
  link?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function Cta({ cta, invert = false }: { cta: CtaProps; invert?: boolean }) {
  if (!cta || !cta.ctaEnabled) return null;

  const isExternal = cta.link && (cta.link.startsWith('http') || cta.link.startsWith('mailto:'));
  const text = cta.text || 'Explore';

  const buttonClasses = cn(
    'inline-flex items-center gap-2 font-mono text-xs tracking-wider uppercase transition-all duration-300',
    invert
      ? 'bg-white text-black hover:bg-neutral-200 shadow-md'
      : 'bg-neutral-900 border border-white/20 text-white hover:bg-neutral-800'
  );

  const icon = (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );

  if (isExternal) {
    return (
      <Button asChild size={cta.size || 'default'} className={buttonClasses}>
        <a href={cta.link} target="_blank" rel="noopener noreferrer">
          <span>{text}</span>
          {icon}
        </a>
      </Button>
    );
  }

  return (
    <Button asChild size={cta.size || 'default'} className={buttonClasses}>
      <Link to={cta.link || '#'}>
        <span>{text}</span>
        {icon}
      </Link>
    </Button>
  );
}

export default Cta;
