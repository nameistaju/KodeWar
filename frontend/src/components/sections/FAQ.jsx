import React from 'react';
import { FAQ } from '@/components/ui/faq-tabs';

const categories = {
  all: 'All FAQs',
  services: 'Services & Scope',
  delivery: 'Process & Timeline',
  pricing: 'Pricing & Support',
};

const allFaqs = [
  {
    question: 'What services does KODEWAR provide?',
    answer:
      'We provide end-to-end digital solutions across five core capabilities: High-Performance Web & E-Commerce Engineering, Mobile App Development (iOS & Android), Performance Marketing & Growth Strategy, UI/UX & Brand Identity Systems, and Custom AI & Workflow Automation.',
  },
  {
    question: 'How does KODEWAR work with clients?',
    answer:
      'We operate on a collaborative, sprint-based delivery model. From initial architecture and rapid prototyping to production deployment and growth scaling, our senior engineers and designers work directly with your stakeholders with transparent milestones, bi-weekly reviews, and shared repositories.',
  },
  {
    question: 'What is the typical project timeline?',
    answer:
      'Timelines vary depending on scope and complexity. Focused digital marketing setups or high-converting landing pages take 1–3 weeks, custom web/mobile applications typically launch in 4–10 weeks, and enterprise digital transformations run in structured quarterly phases.',
  },
  {
    question: 'How much does a project typically cost?',
    answer:
      'We tailor our pricing to project requirements and scope. We offer fixed-scope sprints for well-defined deliverables and dedicated monthly retainers for ongoing engineering and growth marketing. Every engagement begins with a clear scope document and fixed milestone budgeting—no hidden costs.',
  },
  {
    question: 'Do you offer ongoing maintenance and support after launch?',
    answer:
      'Yes. We provide comprehensive post-launch support packages including 24/7 uptime monitoring, security patching, performance optimization, cloud infrastructure management, and continuous feature enhancements.',
  },
  {
    question: 'Can KODEWAR work with existing teams or codebases?',
    answer:
      'Absolutely. We frequently integrate alongside existing in-house engineering and marketing teams, conduct technical code audits, refactor legacy infrastructure, and execute modern stack migrations without disrupting live operations.',
  },
  {
    question: 'How do we get started with KODEWAR?',
    answer:
      'Reach out through our contact form, email us, or book a discovery call. We conduct a preliminary technical and business evaluation within 24 hours and deliver an actionable proposal, scope breakdown, and project roadmap within 2–3 business days.',
  },
  {
    question: 'What industries do you specialize in?',
    answer:
      'We specialize in high-growth technology startups, direct-to-consumer (D2C) and e-commerce brands, healthcare, fintech, educational technology, real estate, and B2B SaaS enterprises seeking scalable digital infrastructure and measurable acquisition.',
  },
];

const faqData = {
  all: allFaqs,
  services: [
    allFaqs[0], // What services
    allFaqs[7], // What industries
    allFaqs[6], // How to get started
  ],
  delivery: [
    allFaqs[1], // How does KODEWAR work
    allFaqs[2], // Typical project timeline
    allFaqs[5], // Can KODEWAR work with existing teams
  ],
  pricing: [
    allFaqs[3], // Project cost
    allFaqs[4], // Ongoing maintenance
  ],
};

export default function FAQSection() {
  return (
    <FAQ
      id="faq"
      subtitle="GOT QUESTIONS? WE HAVE ANSWERS."
      title="Frequently Asked Questions"
      categories={categories}
      faqData={faqData}
      className="home-faq-wrapper"
    />
  );
}
