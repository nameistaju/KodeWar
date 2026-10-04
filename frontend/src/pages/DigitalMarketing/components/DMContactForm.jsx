import React, { useState, useRef } from 'react';
import { ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';
import CyberFormBackdrop from '@/components/ui/CyberFormBackdrop';
import '@/components/ui/kodewar-3d-form.css';

const SERVICES_OPTIONS = [
  'Website',
  'SEO',
  'Social Media',
  'Paid Ads',
  'Branding',
  'Content',
  'Lead Generation',
  'Full Digital Marketing',
  'Not sure yet',
];

const GOAL_OPTIONS = [
  'Get more leads',
  'Increase sales',
  'Build a stronger brand',
  'Improve online presence',
  'Launch a new business',
  'Other',
];

const BUDGET_OPTIONS = [
  '₹3K–₹10K',
  '₹10K–₹25K',
  '₹25K–₹50K',
  '₹50K+',
  'Not sure yet',
];

const TOTAL_STEPS = 6;

export default function DMContactForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    phone: '',
    companyName: '',
    websiteUrl: '',
    projectDetails: '',
  });

  const [selectedServices, setSelectedServices] = useState(['Lead Generation', 'Paid Ads']);
  const [selectedGoal, setSelectedGoal] = useState('Get more leads');
  const [selectedBudget, setSelectedBudget] = useState('₹10K–₹25K');

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // 3D Tilt state & handler
  const [tilt, setTilt] = useState({ x: 0, y: 0, mx: 50, my: 50 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotX = (y - 0.5) * -4.5; // -2.25 to 2.25 deg
    const rotY = (x - 0.5) * 4.5;
    setTilt({ x: rotX, y: rotY, mx: Math.round(x * 100), my: Math.round(y * 100) });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, mx: 50, my: 50 });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const toggleService = (item) => {
    setSelectedServices((prev) => {
      if (item === 'Not sure yet') return ['Not sure yet'];
      const filtered = prev.filter((s) => s !== 'Not sure yet');
      return filtered.includes(item)
        ? filtered.filter((s) => s !== item)
        : [...filtered, item];
    });
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required.';
      }
      if (!formData.workEmail.trim()) {
        newErrors.workEmail = 'Work email is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.workEmail)) {
        newErrors.workEmail = 'Enter a valid email address.';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required.';
      } else if (formData.phone.replace(/\D/g, '').length < 6) {
        newErrors.phone = 'Enter a valid phone number.';
      }
    } else if (step === 2) {
      if (!formData.companyName.trim()) {
        newErrors.companyName = 'Company name is required.';
      }
    } else if (step === 3) {
      if (selectedServices.length === 0) {
        newErrors.services = 'Select at least one service.';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep((prev) => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      handleNext();
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      workEmail: '',
      phone: '',
      companyName: '',
      websiteUrl: '',
      projectDetails: '',
    });
    setSelectedServices(['Lead Generation', 'Paid Ads']);
    setSelectedGoal('Get more leads');
    setSelectedBudget('₹10K–₹25K');
    setCurrentStep(1);
    setErrors({});
    setSubmitted(false);
  };

  const stepLabels = [
    'About You',
    'Your Business',
    'Services Needed',
    'Primary Goal',
    'Budget Scope',
    'Project Details',
  ];

  return (
    <section className="kw-form-section" id="dm-contact">
      {/* Subtle Atmosphere Backdrop */}
      <CyberFormBackdrop />

      <div className="kw-form-container">
        {/* Section Header */}
        <div className="kw-form-header">
          <h2 className="kw-form-title">SCALE YOUR REVENUE FLYWHEEL</h2>
          <p className="kw-form-subtitle">
            Tell us about your business. Our senior growth engineers will deliver a tailored acquisition blueprint within 24 hours.
          </p>
        </div>

        {/* 3D Scene Wrapper */}
        <div
          className="kw-3d-scene"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Physical 3D Extrusion Slab */}
          <div
            className="kw-3d-depth-slab"
            style={{
              transform: `translate(12px, 12px) translate3d(${tilt.y * 1.5}px, ${-tilt.x * 1.5}px, 0)`,
            }}
          />

          {/* Main 3D Card Surface */}
          <div
            ref={cardRef}
            className="kw-3d-card"
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              '--mouse-x': `${tilt.mx}%`,
              '--mouse-y': `${tilt.my}%`,
            }}
          >
            {submitted ? (
              <div className="kw-success-card">
                <span className="kw-success-badge">[ TRANSMISSION RECEIVED ]</span>
                <h3 className="kw-success-title">PROJECT REQUEST RECEIVED</h3>
                <p className="kw-success-text">
                  Thank you, <strong className="text-white">{formData.fullName || 'Partner'}</strong>. We have logged your inquiry for{' '}
                  <strong className="text-white">{formData.companyName || 'your business'}</strong>. Our growth team will review your requirements and reach out via{' '}
                  <strong className="text-[#FFD600]">{formData.phone || formData.workEmail}</strong> shortly.
                </p>
                <button type="button" onClick={handleReset} className="kw-btn-reset">
                  SUBMIT ANOTHER INQUIRY →
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => e.preventDefault()} onKeyDown={handleKeyDown}>
                {/* Step Tracker */}
                <div className="kw-step-tracker">
                  <span className="kw-step-counter">
                    0{currentStep} / 0{TOTAL_STEPS}
                  </span>
                  <span className="kw-step-tag">
                    STEP {currentStep}: {stepLabels[currentStep - 1]}
                  </span>
                </div>

                {/* Thin Progress Fill Line */}
                <div className="kw-progress-line-track">
                  <div
                    className="kw-progress-line-fill"
                    style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
                  />
                </div>

                {/* STEP 01 — ABOUT YOU */}
                {currentStep === 1 && (
                  <div className="kw-step-content" key="step-1">
                    <h3 className="kw-step-heading">WHO SHOULD WE DELIVER YOUR BLUEPRINT TO?</h3>
                    <p className="kw-step-desc">
                      Enter your primary contact details so we can coordinate your strategy consultation.
                    </p>

                    <div className="kw-grid-1">
                      <div className="kw-field-group">
                        <label className="kw-label" htmlFor="dm-fullName">
                          Full Name <span className="kw-label-required">*Required</span>
                        </label>
                        <input
                          id="dm-fullName"
                          name="fullName"
                          type="text"
                          autoFocus
                          placeholder="e.g. Vikram Sharma"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className={`kw-input ${errors.fullName ? 'error' : ''}`}
                        />
                        {errors.fullName && <span className="kw-field-error">{errors.fullName}</span>}
                      </div>

                      <div className="kw-grid-2" style={{ marginBottom: 0 }}>
                        <div className="kw-field-group">
                          <label className="kw-label" htmlFor="dm-workEmail">
                            Work Email <span className="kw-label-required">*Required</span>
                          </label>
                          <input
                            id="dm-workEmail"
                            name="workEmail"
                            type="email"
                            placeholder="vikram@brand.com"
                            value={formData.workEmail}
                            onChange={handleInputChange}
                            className={`kw-input ${errors.workEmail ? 'error' : ''}`}
                          />
                          {errors.workEmail && <span className="kw-field-error">{errors.workEmail}</span>}
                        </div>

                        <div className="kw-field-group">
                          <label className="kw-label" htmlFor="dm-phone">
                            Phone / WhatsApp <span className="kw-label-required">*Required</span>
                          </label>
                          <input
                            id="dm-phone"
                            name="phone"
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={`kw-input ${errors.phone ? 'error' : ''}`}
                          />
                          {errors.phone && <span className="kw-field-error">{errors.phone}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 02 — YOUR BUSINESS */}
                {currentStep === 2 && (
                  <div className="kw-step-content" key="step-2">
                    <h3 className="kw-step-heading">TELL US ABOUT YOUR COMPANY.</h3>
                    <p className="kw-step-desc">
                      Let us know your brand identity and where to find your current digital presence.
                    </p>

                    <div className="kw-grid-1">
                      <div className="kw-field-group">
                        <label className="kw-label" htmlFor="dm-companyName">
                          Company / Brand Name <span className="kw-label-required">*Required</span>
                        </label>
                        <input
                          id="dm-companyName"
                          name="companyName"
                          type="text"
                          autoFocus
                          placeholder="e.g. Acme Retail or HyperScale Tech"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          className={`kw-input ${errors.companyName ? 'error' : ''}`}
                        />
                        {errors.companyName && (
                          <span className="kw-field-error">{errors.companyName}</span>
                        )}
                      </div>

                      <div className="kw-field-group">
                        <label className="kw-label" htmlFor="dm-websiteUrl">
                          Website URL <span className="kw-label-optional">[Optional]</span>
                        </label>
                        <input
                          id="dm-websiteUrl"
                          name="websiteUrl"
                          type="url"
                          placeholder="https://yourbrand.com"
                          value={formData.websiteUrl}
                          onChange={handleInputChange}
                          className="kw-input"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 03 — WHAT DO YOU NEED? */}
                {currentStep === 3 && (
                  <div className="kw-step-content" key="step-3">
                    <h3 className="kw-step-heading">WHAT ARE YOU LOOKING TO BUILD OR SCALE?</h3>
                    <p className="kw-step-desc">
                      Select all services that apply to your growth roadmap.
                    </p>

                    <div className="kw-tiles-grid">
                      {SERVICES_OPTIONS.map((srv) => {
                        const active = selectedServices.includes(srv);
                        return (
                          <button
                            key={srv}
                            type="button"
                            onClick={() => toggleService(srv)}
                            className={`kw-tile ${active ? 'active' : ''}`}
                          >
                            <span>{srv}</span>
                            <div className="kw-tile-indicator">
                              {active && <Check size={11} strokeWidth={3} />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {errors.services && <span className="kw-field-error">{errors.services}</span>}
                  </div>
                )}

                {/* STEP 04 — YOUR GOAL */}
                {currentStep === 4 && (
                  <div className="kw-step-content" key="step-4">
                    <h3 className="kw-step-heading">WHAT IS YOUR PRIMARY OBJECTIVE?</h3>
                    <p className="kw-step-desc">
                      What is the single most important metric for your business in the next 90 days?
                    </p>

                    <div className="kw-tiles-grid">
                      {GOAL_OPTIONS.map((goal) => {
                        const active = selectedGoal === goal;
                        return (
                          <button
                            key={goal}
                            type="button"
                            onClick={() => setSelectedGoal(goal)}
                            className={`kw-tile ${active ? 'active' : ''}`}
                          >
                            <span>{goal}</span>
                            <div className="kw-tile-indicator">
                              {active && <Check size={11} strokeWidth={3} />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 05 — BUDGET */}
                {currentStep === 5 && (
                  <div className="kw-step-content" key="step-5">
                    <h3 className="kw-step-heading">WHAT IS YOUR ESTIMATED MONTHLY BUDGET?</h3>
                    <p className="kw-step-desc">
                      This allows us to calibrate our media allocation and scope the right execution tier.
                    </p>

                    <div className="kw-tiles-grid">
                      {BUDGET_OPTIONS.map((budget) => {
                        const active = selectedBudget === budget;
                        return (
                          <button
                            key={budget}
                            type="button"
                            onClick={() => setSelectedBudget(budget)}
                            className={`kw-tile ${active ? 'active' : ''}`}
                          >
                            <span>{budget}</span>
                            <div className="kw-tile-indicator">
                              {active && <Check size={11} strokeWidth={3} />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 06 — FINAL MESSAGE */}
                {currentStep === 6 && (
                  <div className="kw-step-content" key="step-6">
                    <h3 className="kw-step-heading">TELL US A LITTLE ABOUT YOUR PROJECT.</h3>
                    <p className="kw-step-desc">
                      Share any details about your target audience, current customer acquisition cost, or timeline (optional).
                    </p>

                    <div className="kw-field-group">
                      <label className="kw-label" htmlFor="dm-projectDetails">
                        Project Overview <span className="kw-label-optional">[Optional]</span>
                      </label>
                      <textarea
                        id="dm-projectDetails"
                        name="projectDetails"
                        autoFocus
                        placeholder="e.g. We are an e-commerce brand selling premium footwear looking to scale Meta & Google Ads profitably with a CAC under ₹450..."
                        value={formData.projectDetails}
                        onChange={handleInputChange}
                        className="kw-textarea"
                      />
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="kw-form-actions">
                  {currentStep > 1 ? (
                    <button type="button" onClick={handleBack} className="kw-btn-back">
                      <ArrowLeft size={14} /> Back
                    </button>
                  ) : (
                    <div />
                  )}

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={loading}
                    className="kw-btn-primary"
                  >
                    {loading ? (
                      'TRANSMITTING...'
                    ) : currentStep === TOTAL_STEPS ? (
                      <>
                        START MY PROJECT <ArrowRight size={14} />
                      </>
                    ) : (
                      <>
                        CONTINUE <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
