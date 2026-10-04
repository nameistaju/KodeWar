import React from 'react';
import { Hero08, type Hero08Props } from '@/components/ui/hero-08';

const values: Hero08Props = {
  title: 'Learn the craft behind every great design',
  description:
    'Hands-on courses taught by working designers, built to fit around your schedule.',
  socialProof: 'Join 40,000+ Makers Learning With Us',
  avatars: [
    {
      src: 'https://cdn.21st.dev/assets/mirror/35/35e88d6df4352adfe86dbd6d4e74293990ddd3badd8b317aa098176c64df65bd.jpg',
      fallback: 'JD',
    },
    {
      src: 'https://cdn.21st.dev/assets/mirror/6d/6d76c261198390e80a6448b6dd6bf68179bda789fe2ec98ae29a8127b011334d.jpg',
      fallback: 'SL',
    },
    {
      src: 'https://cdn.21st.dev/assets/mirror/3b/3b8932f3a4d8063b129c8e624a531db16ea71cdcde0555425419aef2da5615d7.jpg',
      fallback: 'MV',
    },
  ],
  cards: [
    {
      title: 'Design Fundamentals',
      subtitle: 'Starting at $ 29 per month',
      image:
        'https://cdn.21st.dev/assets/mirror/83/839c9582581e0c20b8fbd2ad66e9c87c31206f709d28534d411674d10c913757.jpg',
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
        'https://cdn.21st.dev/assets/mirror/18/18129f9729d7e9fd5393c61d23efb785da4320478b3a878a3e6dd084d86a229d.jpg',
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
  return <Hero08 {...values} />;
}
