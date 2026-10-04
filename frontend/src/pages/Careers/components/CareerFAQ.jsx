import React from 'react';
import { FAQ } from '@/components/ui/faq-tabs';

const categories = {
  all: 'All Questions',
  training: 'Training & Curriculum',
  placements: 'Placements & Careers',
  eligibility: 'Eligibility & Format',
};

const allCareerFaqs = [
  {
    question: 'What is the KODEWAR Training & Placement Incubator?',
    answer:
      'The KODEWAR Incubator is an intensive, studio-driven program where developers and designers train directly on production-grade systems. Rather than simulated exercises, you work with modern stacks (React, Node, Python, Cloud) and receive hands-on code reviews from senior engineers.',
  },
  {
    question: 'Do I need prior professional coding experience to join?',
    answer:
      'No prior professional experience is required. We evaluate applicants based on problem-solving aptitude, curiosity, and commitment to learning. We have foundation tracks for beginners and accelerated tracks for graduates with basic programming knowledge.',
  },
  {
    question: 'Are the projects based on real-world client applications?',
    answer:
      'Yes, 100%. You will contribute to live architectures, building responsive interfaces, integrating REST/GraphQL APIs, setting up database schemas, and practicing automated testing within real agile sprints.',
  },
  {
    question: 'How does the placement assistance process work?',
    answer:
      'Our dedicated placement wing conducts weekly mock technical interviews, algorithmic problem-solving drills, resume engineering, and portfolio audits. We partner with top tech companies and provide direct interview referrals upon cohort completion.',
  },
  {
    question: 'Is the training program online, hybrid, or in-studio?',
    answer:
      'We offer flexible modes including full-time in-studio immersion at our Hyderabad facility, as well as live interactive hybrid/remote tracks with daily standups and dedicated mentor hours.',
  },
  {
    question: 'Can top performers get absorbed into KODEWAR full-time?',
    answer:
      'Absolutely. High-performing apprentice candidates who demonstrate exemplary code quality and ownership during their cohort are directly offered full-time associate developer and designer positions at KODEWAR Technologies.',
  },
];

const faqData = {
  all: allCareerFaqs,
  training: [
    allCareerFaqs[0], // What is Incubator
    allCareerFaqs[2], // Real-world projects
  ],
  placements: [
    allCareerFaqs[3], // Placement assistance
    allCareerFaqs[5], // Full-time absorption
  ],
  eligibility: [
    allCareerFaqs[1], // Experience needed
    allCareerFaqs[4], // Online/hybrid/in-studio
  ],
};

export default function CareerFAQ() {
  return (
    <div id="faqs" style={{ position: 'relative' }}>
      <FAQ
        subtitle="HAVE QUESTIONS ABOUT OUR COHORTS?"
        title="Frequently Asked Questions"
        categories={categories}
        faqData={faqData}
        className="career-faq-wrapper"
      />
      <div style={{
        textAlign: 'center',
        paddingBottom: '60px',
        backgroundColor: '#050507',
        marginTop: '-30px',
        position: 'relative',
        zIndex: 10
      }}>
        <p style={{
          color: '#8E929E',
          fontSize: '0.9rem',
          marginBottom: '16px'
        }}>
          Have a question that isn't answered here?
        </p>
        <a
          href="mailto:careers@kodewar.com?subject=Inquiry%20about%20KODEWAR%20Careers%20%26%20Training"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#FFFFFF',
            fontSize: '0.9rem',
            fontWeight: 600,
            textDecoration: 'none',
            borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
            paddingBottom: '2px'
          }}
        >
          <span>Email our careers team at careers@kodewar.com</span>
          <span>→</span>
        </a>
      </div>
    </div>
  );
}
