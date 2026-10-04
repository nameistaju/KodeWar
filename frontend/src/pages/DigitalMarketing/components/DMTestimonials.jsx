import React from 'react';
import { Testimonials } from '@/components/ui/testimonials-columns-1';

const DM_CLIENT_REVIEWS = [
  {
    id: 1,
    name: 'Vikram Singhania',
    role: 'Founder & CEO • Vault 26 Luxury',
    text: 'KODEWAR rebuilt our entire digital acquisition architecture from the ground up. In under 90 days, our blended CAC plummeted by 42% while monthly revenue grew 3.2x across Tier-1 metros.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 2,
    name: 'Ananya Deshmukh',
    role: 'Chief Marketing Officer • Zyro Mobility',
    text: 'Their data-first approach to performance creative testing is unlike any agency we’ve partnered with. We scaled our electric scooter pre-orders past 14,000 units with zero ad fatigue.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 3,
    name: 'Rahul K. Mehta',
    role: 'VP of Growth • Pulse Health Tech',
    text: 'The full-funnel attribution and automated lead-nurturing pipelines KODEWAR deployed gave our sales team a 28% increase in qualified consultation bookings month-over-month.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 4,
    name: 'Pooja Sundaram',
    role: 'Brand Director • Aurelia Organics',
    text: 'Beyond exceptional Meta and Google Ads performance, their content and visual design studio elevated our brand perception into a premium echelon. ROAS went from 1.9x to a consistent 4.4x.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 5,
    name: 'Karthik Raja',
    role: 'Co-Founder • Nexus FinTech',
    text: 'Scaling regulated financial products online is tricky, but KODEWAR solved our compliance and conversion bottlenecks with razor-sharp precision and rapid weekly creative sprints.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 6,
    name: 'Meera Nambiar',
    role: 'Head of E-Commerce • Stellar Living',
    text: 'Every rupee spent is tracked with crystal clarity. The live reporting dashboards and strategic weekly syncs keep our leadership team 100% aligned with marketing unit economics.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 7,
    name: 'Arjun Namboodiri',
    role: 'Managing Director • Skyline Estates',
    text: 'KODEWAR transformed our ultra-luxury residential project launches. Hyper-targeted campaigns delivered high-net-worth NRI leads and closed INR 45Cr in inventory within 60 days.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 8,
    name: 'Swati Sen',
    role: 'Head of Growth • OmniRetail Labs',
    text: 'The speed of execution is astonishing. When algorithmic updates hit, their media buyers and creative team pivoted our hooks within 24 hours, keeping our CAC rock-solid.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 9,
    name: 'David R. Vance',
    role: 'Operating Partner • Apex Ventures',
    text: 'We now mandate KODEWAR’s growth framework for all our early-stage consumer tech portfolio companies. They turn chaotic marketing budgets into predictable customer engines.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
  },
];

const firstColumn = DM_CLIENT_REVIEWS.slice(0, 3);
const secondColumn = DM_CLIENT_REVIEWS.slice(3, 6);
const thirdColumn = DM_CLIENT_REVIEWS.slice(6, 9);

export default function DMTestimonials() {
  return (
    <Testimonials
      id="dm-testimonials"
      title="Trusted by Fast-Growing Brands & Founders"
      description="Hear how high-growth businesses leverage KODEWAR's digital marketing engine, performance creative testing, and multi-channel scale systems."
      testimonials={DM_CLIENT_REVIEWS}
      firstColumn={firstColumn}
      secondColumn={secondColumn}
      thirdColumn={thirdColumn}
    />
  );
}
