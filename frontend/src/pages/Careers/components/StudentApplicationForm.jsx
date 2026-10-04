import React, { useState, useRef } from 'react';
import { ArrowRight, ArrowLeft, Check, Upload, FileText, X } from 'lucide-react';
import '@/components/ui/kodewar-3d-form.css';

const CURRENT_STATUS_OPTIONS = [
  'Student',
  'Recent Graduate',
  'Working Professional',
  'Other',
];

const ROLE_OPTIONS = [
  'UI/UX Design',
  'Frontend Development',
  'Backend Development',
  'Full Stack',
  'Digital Marketing',
  'Graphic Design',
  'Data / AI',
  'Business / Sales',
  'Other',
];

const EXPERIENCE_OPTIONS = [
  'No experience',
  'Internship',
  '0–1 year',
  '1–3 years',
  '3+ years',
];

const TOTAL_STEPS = 6;

export default function StudentApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    education: '',
    portfolioUrl: '',
    coverNote: '',
  });

  const [selectedStatus, setSelectedStatus] = useState('Student');
  const [selectedRole, setSelectedRole] = useState('Full Stack');
  const [selectedExperience, setSelectedExperience] = useState('0–1 year');
  const [resumeFile, setResumeFile] = useState(null);

  const fileInputRef = useRef(null);

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setResumeFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required.';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Enter a valid email address.';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required.';
      } else if (formData.phone.replace(/\D/g, '').length < 6) {
        newErrors.phone = 'Enter a valid phone number.';
      }
    } else if (step === 2) {
      if (!formData.education.trim()) {
        newErrors.education = 'Education / Degree is required.';
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
      email: '',
      phone: '',
      education: '',
      portfolioUrl: '',
      coverNote: '',
    });
    setSelectedStatus('Student');
    setSelectedRole('Full Stack');
    setSelectedExperience('0–1 year');
    setResumeFile(null);
    setCurrentStep(1);
    setErrors({});
    setSubmitted(false);
  };

  const stepLabels = [
    'Personal',
    'Background',
    'Role Track',
    'Experience',
    'Resume',
    'Submit',
  ];

  return (
    <section className="kw-form-section" id="student-portal">
      <div className="kw-form-container">
        {/* Section Header */}
        <div className="kw-form-header">
          <h2 className="kw-form-title">JOIN THE KODEWAR INCUBATOR</h2>
          <p className="kw-form-subtitle">
            Connect directly with KODEWAR's engineering squad mentors and talent incubator to work on production platforms.
          </p>
        </div>

        {/* Main Flat Aesthetic Card Surface */}
        <div className="kw-card-surface">
          {submitted ? (
            <div className="kw-success-card">
              <span className="kw-success-badge">[ TRANSMISSION CONFIRMED ]</span>
              <h3 className="kw-success-title">APPLICATION SUBMITTED</h3>
              <p className="kw-success-text">
                Welcome, <strong>{formData.fullName || 'Candidate'}</strong>! We have logged your application in our talent registry for the{' '}
                <strong>{selectedRole}</strong> track. Our engineering mentors will evaluate your details and reach out via email with next steps.
              </p>
              <button type="button" onClick={handleReset} className="kw-btn-reset">
                SUBMIT ANOTHER APPLICATION →
              </button>
            </div>
          ) : (
            <form onSubmit={(e) => e.preventDefault()} onKeyDown={handleKeyDown}>
              {/* Horizontal Step Wizard Header */}
              <div className="kw-horizontal-step-bar">
                {stepLabels.map((label, idx) => {
                  const stepNum = idx + 1;
                  const isCurrent = currentStep === stepNum;
                  const isCompleted = currentStep > stepNum;

                  return (
                    <React.Fragment key={stepNum}>
                      <div
                        className={`kw-step-node ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''}`}
                        onClick={() => {
                          if (isCompleted) setCurrentStep(stepNum);
                        }}
                      >
                        <div className="kw-step-circle">
                          {isCompleted ? <Check size={14} strokeWidth={3} /> : stepNum}
                        </div>
                        <span className="kw-step-node-label">{label}</span>
                      </div>
                      {idx < stepLabels.length - 1 && (
                        <div className={`kw-step-connector ${isCompleted ? 'active' : ''}`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* STEP 01 — ABOUT YOU */}
              {currentStep === 1 && (
                <div className="kw-step-content" key="step-1">
                  <h3 className="kw-step-heading">TELL US WHO YOU ARE.</h3>
                  <p className="kw-step-desc">
                    Enter your primary contact details so our recruitment team can reach you directly.
                  </p>

                  <div className="kw-grid-1">
                    <div className="kw-field-group">
                      <label className="kw-label" htmlFor="std-fullName">
                        Full Name <span className="kw-label-required">*Required</span>
                      </label>
                      <input
                        id="std-fullName"
                        name="fullName"
                        type="text"
                        autoFocus
                        placeholder="e.g. Sneha Priya"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`kw-input ${errors.fullName ? 'error' : ''}`}
                      />
                      {errors.fullName && <span className="kw-field-error">{errors.fullName}</span>}
                    </div>

                    <div className="kw-grid-2" style={{ marginBottom: 0 }}>
                      <div className="kw-field-group">
                        <label className="kw-label" htmlFor="std-email">
                          Email Address <span className="kw-label-required">*Required</span>
                        </label>
                        <input
                          id="std-email"
                          name="email"
                          type="email"
                          placeholder="sneha@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`kw-input ${errors.email ? 'error' : ''}`}
                        />
                        {errors.email && <span className="kw-field-error">{errors.email}</span>}
                      </div>

                      <div className="kw-field-group">
                        <label className="kw-label" htmlFor="std-phone">
                          Phone / WhatsApp <span className="kw-label-required">*Required</span>
                        </label>
                        <input
                          id="std-phone"
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

              {/* STEP 02 — YOUR BACKGROUND */}
              {currentStep === 2 && (
                <div className="kw-step-content" key="step-2">
                  <h3 className="kw-step-heading">WHAT'S YOUR CURRENT BACKGROUND?</h3>
                  <p className="kw-step-desc">
                    Let us know your educational track and your current professional status.
                  </p>

                  <div className="kw-grid-1">
                    <div className="kw-field-group">
                      <label className="kw-label" htmlFor="std-education">
                        Degree / College / Specialization <span className="kw-label-required">*Required</span>
                      </label>
                      <input
                        id="std-education"
                        name="education"
                        type="text"
                        autoFocus
                        placeholder="e.g. B.Tech Computer Science / JNTU Hyderabad"
                        value={formData.education}
                        onChange={handleInputChange}
                        className={`kw-input ${errors.education ? 'error' : ''}`}
                      />
                      {errors.education && <span className="kw-field-error">{errors.education}</span>}
                    </div>

                    <div className="kw-field-group">
                      <label className="kw-label">Current Status</label>
                      <div className="kw-tiles-grid" style={{ marginBottom: 0, marginTop: '0.25rem' }}>
                        {CURRENT_STATUS_OPTIONS.map((status) => {
                          const active = selectedStatus === status;
                          return (
                            <button
                              key={status}
                              type="button"
                              onClick={() => setSelectedStatus(status)}
                              className={`kw-tile ${active ? 'active' : ''}`}
                            >
                              <span>{status}</span>
                              <div className="kw-tile-indicator">
                                {active && <Check size={11} strokeWidth={3} />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 03 — WHAT DO YOU WANT TO DO? */}
              {currentStep === 3 && (
                <div className="kw-step-content" key="step-3">
                  <h3 className="kw-step-heading">WHAT ROLE DO YOU WANT TO PURSUE?</h3>
                  <p className="kw-step-desc">
                    Select your primary focus area or domain track at KODEWAR.
                  </p>

                  <div className="kw-tiles-grid">
                    {ROLE_OPTIONS.map((role) => {
                      const active = selectedRole === role;
                      return (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setSelectedRole(role)}
                          className={`kw-tile ${active ? 'active' : ''}`}
                        >
                          <span>{role}</span>
                          <div className="kw-tile-indicator">
                            {active && <Check size={11} strokeWidth={3} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 04 — EXPERIENCE */}
              {currentStep === 4 && (
                <div className="kw-step-content" key="step-4">
                  <h3 className="kw-step-heading">WHAT IS YOUR EXPERIENCE LEVEL?</h3>
                  <p className="kw-step-desc">
                    Whether you're writing your first lines of code or building production systems, we have tracks for all levels.
                  </p>

                  <div className="kw-tiles-grid">
                    {EXPERIENCE_OPTIONS.map((exp) => {
                      const active = selectedExperience === exp;
                      return (
                        <button
                          key={exp}
                          type="button"
                          onClick={() => setSelectedExperience(exp)}
                          className={`kw-tile ${active ? 'active' : ''}`}
                        >
                          <span>{exp}</span>
                          <div className="kw-tile-indicator">
                            {active && <Check size={11} strokeWidth={3} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 05 — PORTFOLIO & RESUME */}
              {currentStep === 5 && (
                <div className="kw-step-content" key="step-5">
                  <h3 className="kw-step-heading">SHOWCASE YOUR CRAFT.</h3>
                  <p className="kw-step-desc">
                    Provide a link to your work or upload your resume (PDF/DOC, max 5MB).
                  </p>

                  <div className="kw-grid-1">
                    <div className="kw-field-group">
                      <label className="kw-label" htmlFor="std-portfolioUrl">
                        Portfolio / GitHub / LinkedIn URL <span className="kw-label-optional">[Optional]</span>
                      </label>
                      <input
                        id="std-portfolioUrl"
                        name="portfolioUrl"
                        type="url"
                        autoFocus
                        placeholder="https://github.com/username or https://linkedin.com/in/username"
                        value={formData.portfolioUrl}
                        onChange={handleInputChange}
                        className="kw-input"
                      />
                    </div>

                    <div className="kw-field-group">
                      <label className="kw-label">
                        Resume Document <span className="kw-label-optional">[Optional]</span>
                      </label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        style={{ display: 'none' }}
                      />

                      {resumeFile ? (
                        <div className="kw-file-drop has-file">
                          <FileText size={24} className="text-white" />
                          <div className="kw-file-title">{resumeFile.name}</div>
                          <div className="kw-file-hint">
                            {(resumeFile.size / 1024).toFixed(1)} KB • Attached
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="kw-file-remove"
                          >
                            <X size={12} style={{ display: 'inline', marginRight: 4 }} /> Remove File
                          </button>
                        </div>
                      ) : (
                        <div
                          className="kw-file-drop"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload size={24} style={{ color: '#8A8A8A' }} />
                          <div className="kw-file-title">Click to browse or drop your resume</div>
                          <div className="kw-file-hint">PDF, DOC, DOCX up to 5MB</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 06 — FINAL NOTE */}
              {currentStep === 6 && (
                <div className="kw-step-content" key="step-6">
                  <h3 className="kw-step-heading">ANYTHING YOU'D LIKE US TO KNOW?</h3>
                  <p className="kw-step-desc">
                    Tell us about your aspirations, passion projects, or what excites you about building at KODEWAR (optional).
                  </p>

                  <div className="kw-field-group">
                    <label className="kw-label" htmlFor="std-coverNote">
                      Personal Note <span className="kw-label-optional">[Optional]</span>
                    </label>
                    <textarea
                      id="std-coverNote"
                      name="coverNote"
                      autoFocus
                      placeholder="e.g. I have built full stack apps with React and Node.js, and I'm eager to work on production-scale systems..."
                      value={formData.coverNote}
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
                    'SUBMITTING...'
                  ) : currentStep === TOTAL_STEPS ? (
                    <>
                      SUBMIT APPLICATION <ArrowRight size={14} />
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
    </section>
  );
}
