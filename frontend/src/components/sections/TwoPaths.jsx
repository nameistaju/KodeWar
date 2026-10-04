import React from 'react';
import { Hero08 } from '@/components/ui/hero-08';

export default function TwoPaths() {
  const twoDirectionsData = {
    eyebrow: 'Two Directions',
    title: 'Engineered for growth. Built for people.',
    description:
      'We partner with businesses to scale digital systems and mentor emerging professionals to build lasting engineering careers.',
    socialProof: '50+ Enterprise Clients // 500+ Engineers Trained',
    avatars: [
      {
        src: '/1.jpg',
        fallback: '01',
      },
      {
        src: '/2.jpg',
        fallback: '02',
      },
      {
        src: '/3.jpg',
        fallback: '03',
      },
      {
        src: '/4.jpg',
        fallback: '04',
      },
      {
        src: '/5.jpg',
        fallback: '05',
      },
    ],
    cards: [
      {
        badge: 'FOR BUSINESSES',
        title: 'Build your digital presence.',
        subtitle:
          'From enterprise platforms and e-commerce architectures to revenue-generating digital marketing, we engineer solutions that deliver true business leverage.',
        image: '/Industrial Engineer with Holographic Social Media Workspace.png',
        imageAlt: 'Enterprise software architecture and digital systems',
        invert: true,
        cta: {
          ctaEnabled: true,
          text: 'Explore Business →',
          link: '/business',
          size: 'default',
        },
      },
      {
        badge: 'FOR CAREERS',
        title: 'Build your next opportunity.',
        subtitle:
          'Gain real production experience, train under senior engineers, and unlock career opportunities with verified industry placement assistance.',
        image: '/AR Overlays (1).png',
        imageAlt: 'Hands-on engineering training and career placement',
        invert: true,
        cta: {
          ctaEnabled: true,
          text: 'Explore Careers →',
          link: '/careers',
          size: 'default',
        },
      },
    ],
    animation: 'subtle',
    variant: 'standard',
  };

  return (
    <section id="two-paths" aria-label="Two Directions: Business and Careers">
      <Hero08 {...twoDirectionsData} />
    </section>
  );
}
