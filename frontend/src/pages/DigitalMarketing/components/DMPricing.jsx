import React from 'react';
import { Pricing } from '@/components/ui/pricing';

const DIGITAL_MARKETING_PLANS = [
  {
    name: 'FOUNDATION',
    price: '2999',
    yearlyPrice: '2399',
    period: 'month',
    features: [
      'Social media management (12 curated posts/mo)',
      'Google Business Profile & local map optimization',
      'Core technical & on-page search engine SEO',
      'Bi-weekly performance & telemetry report',
      'Creative copywriting & brand alignment',
    ],
    description: 'For businesses establishing a solid digital foothold',
    buttonText: 'SELECT FOUNDATION',
    href: '#dm-contact',
    isPopular: false,
  },
  {
    name: 'GROWTH',
    price: '5999',
    yearlyPrice: '4799',
    period: 'month',
    features: [
      'Everything included in Foundation',
      'Meta Ads & Google Ads end-to-end management',
      '20 high-impact creative pieces (Reels, motion)',
      'High-converting landing page design & A/B testing',
      'Direct WhatsApp conversion funnel integration',
      'Bi-weekly executive growth strategy calls',
    ],
    description: 'For ambitious brands ready to scale acquisition',
    buttonText: 'START SCALING NOW',
    href: '#dm-contact',
    isPopular: true,
  },
  {
    name: 'DOMINATION',
    price: '9999',
    yearlyPrice: '7999',
    period: 'month',
    features: [
      'Full-funnel growth architecture & continuous testing',
      'Unlimited bespoke creative & video production',
      'Custom web engineering & conversion rate optimization',
      'Dedicated squad (Strategist, Designer, Copywriter)',
      'Real-time automated telemetry & revenue reporting',
      'Priority 24/7 dedicated communications channel',
    ],
    description: 'For market leaders demanding full-spectrum dominance',
    buttonText: 'TALK TO GROWTH TEAM',
    href: '#dm-contact',
    isPopular: false,
  },
];

export default function DMPricing() {
  return (
    <section className="dm-pricing-section" id="dm-pricing">
      <Pricing
        plans={DIGITAL_MARKETING_PLANS}
        title="CHOOSE YOUR GROWTH MODE."
        description="Transparent, high-velocity engagements built around tangible unit economics and verifiable business growth."
      />
    </section>
  );
}
