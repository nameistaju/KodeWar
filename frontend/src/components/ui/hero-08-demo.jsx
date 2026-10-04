import React from 'react';
import { Hero08 } from '@/components/ui/hero-08';

const demoValues = {
  title: 'Learn the craft behind every great design',
  description:
    'Hands-on courses taught by working designers, built to fit around your schedule.',
  socialProof: 'Join 40,000+ Makers Learning With Us',
  avatars: [
    {
      src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      fallback: 'JD',
    },
    {
      src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      fallback: 'SL',
    },
    {
      src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
      fallback: 'MV',
    },
  ],
  cards: [
    {
      title: 'Design Fundamentals',
      subtitle: 'Starting at $ 29 per month',
      image:
        'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1200&auto=format&fit=crop',
      imageAlt: 'Designers collaborating at a shared desk',
      invert: true,
      cta: {
        ctaEnabled: true,
        text: 'Get Started',
        link: '',
        size: 'default',
      },
    },
    {
      title: 'Advanced Motion',
      subtitle: 'Starting at $ 29 per month',
      image:
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
      imageAlt: 'Designer working on a laptop in a studio',
      invert: true,
      cta: {
        ctaEnabled: true,
        text: 'Get Started',
        link: '',
        size: 'default',
      },
    },
  ],
  animation: 'subtle',
};

export default function Hero08Demo() {
  return <Hero08 {...demoValues} />;
}
