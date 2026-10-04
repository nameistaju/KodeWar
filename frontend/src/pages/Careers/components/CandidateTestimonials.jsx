import React from 'react';
import { Testimonials } from '@/components/ui/testimonials-columns-1';

const STUDENT_REVIEWS = [
  {
    id: 1,
    name: 'Naveen Reddy',
    role: 'React Developer • Placed at TechCorp',
    text: 'The project-based curriculum at KODEWAR changed everything for me. Instead of just passive tutorials, we built high-traffic web applications with real code reviews and automated testing.',
    rating: 5,
    avatar: '/imgi_61_image.webp',
  },
  {
    id: 2,
    name: 'Sneha Priya',
    role: 'Python Backend Engineer • Placed at Infosys',
    text: 'Transitioning from non-CS to backend engineering felt daunting until I joined KODEWAR. The direct 1-on-1 mentorship on databases, REST APIs, and system design was second to none.',
    rating: 5,
    avatar: '/imgi_85_image.webp',
  },
  {
    id: 3,
    name: 'Harish Varma',
    role: 'MERN Stack Developer • Placed at CloudScale',
    text: 'The hands-on architecture sprints simulated real agile workflows. By the time I sat for technical interviews, explaining state management and live debugging felt completely natural.',
    rating: 5,
    avatar: '/imgi_258_image.webp',
  },
  {
    id: 4,
    name: 'Ayesha Sultana',
    role: 'UI/UX & Frontend Engineer • Placed at StudioX',
    text: "KODEWAR's emphasis on clean design systems, typography, and frontend responsiveness gave my portfolio a massive edge over other candidates during recruitment rounds.",
    rating: 5,
    avatar: '/imgi_236_image.webp',
  },
  {
    id: 5,
    name: 'P. Srinivas',
    role: 'Java & Cloud Associate • Placed at Enterprise Labs',
    text: 'The depth of engineering patterns taught here—from microservices to CI/CD pipelines—is rare in typical training institutes. Highly recommended for anyone serious about engineering.',
    rating: 5,
    avatar: '/imgi_110_image.webp',
  },
  {
    id: 6,
    name: 'M. Manibala',
    role: 'Full Stack Developer • Placed at InnovateSoft',
    text: 'From day one, the focus is strictly on production-ready engineering standards. Working alongside senior devs gave me the confidence to crack multiple offers within weeks.',
    rating: 5,
    avatar: '/imgi_117_image.webp',
  },
  {
    id: 7,
    name: 'Sai Krishna',
    role: 'Software Engineer • Placed at GlobalLogic',
    text: 'The placement team took personal interest in our mock interviews, algorithmic problem solving, and resume refining. I secured a dream starting package with great mentorship.',
    rating: 5,
    avatar: '/imgi_61_image.webp',
  },
  {
    id: 8,
    name: 'Shanawaz Khan',
    role: 'Digital Marketing & Growth Lead • Placed at AdVentures',
    text: 'The practical exposure to multi-channel analytics, performance advertising, and organic growth strategies gave me instant industry-ready skills that companies fight for.',
    rating: 5,
    avatar: '/imgi_85_image.webp',
  },
  {
    id: 9,
    name: 'Divya Teja',
    role: 'Associate Frontend Engineer • Placed at HexaCode',
    text: 'The culture here breeds excellence. The code review rigor and peer coding sessions made me fall in love with software development. Truly life changing experience!',
    rating: 5,
    avatar: '/imgi_258_image.webp',
  },
];

const firstColumn = STUDENT_REVIEWS.slice(0, 3);
const secondColumn = STUDENT_REVIEWS.slice(3, 6);
const thirdColumn = STUDENT_REVIEWS.slice(6, 9);

export default function CandidateTestimonials() {
  return (
    <Testimonials
      id="student-reviews"
      title="What Our Students Say"
      description="Hear from our graduates and apprentice engineers who transformed their careers through KODEWAR's training & placement incubator."
      testimonials={STUDENT_REVIEWS}
      firstColumn={firstColumn}
      secondColumn={secondColumn}
      thirdColumn={thirdColumn}
    />
  );
}
