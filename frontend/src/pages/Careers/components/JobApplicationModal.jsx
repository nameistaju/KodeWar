import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useApplications } from '../../../context/ApplicationContext';

const ensureArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return val.split('\n').flatMap((s) => s.split(',')).map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
};

export default function JobApplicationModal({ job, onClose }) {
  const navigate = useNavigate();
  const { user, profile, isAuthenticated } = useAuth();
  const { submitApplication } = useApplications();

  const [showApplyForm, setShowApplyForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    college: '',
    gradYear: '',
    education: '',
    linkedin: '',
    github: '',
    portfolio: '',
    coverMessage: '',
  });

  const [useProfileResume, setUseProfileResume] = useState(true);
  const [customResumeFile, setCustomResumeFile] = useState(null);
  const [submittedApp, setSubmittedApp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Pre-fill fields from profile when authenticated
  useEffect(() => {
    if (isAuthenticated && profile) {
      setFormData({
        fullName: profile.full_name || '',
        email: user?.email || profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        college: profile.college || '',
        gradYear: profile.graduation_year || '',
        education: profile.degree ? `${profile.degree} - ${profile.field}` : '',
        linkedin: profile.linkedin || '',
        github: profile.github || '',
        portfolio: profile.portfolio || '',
        coverMessage: '',
      });
      setUseProfileResume(Boolean(profile.resume_storage_path));
    }
  }, [isAuthenticated, profile, user]);

  if (!job) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomResumeChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage('Resume file size exceeds 10MB limit.');
        return;
      }
      setCustomResumeFile(file);
      setErrorMessage('');
    }
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      // Save current job path and redirect to login
      onClose();
      navigate('/careers/login', { state: { from: `/careers/jobs/${job.id}` } });
    } else {
      setShowApplyForm(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const payload = {
        jobId: job.id,
        jobTitle: job.title,
        department: job.department,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        college: formData.college,
        gradYear: formData.gradYear,
        education: formData.education,
        linkedin: formData.linkedin,
        github: formData.github,
        portfolio: formData.portfolio,
        coverMessage: formData.coverMessage,
        useProfileResume: useProfileResume && profile?.resume_storage_path ? 'true' : 'false',
      };

      const result = await submitApplication(payload, customResumeFile);
      setSubmittedApp(result);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="career-modal-backdrop" onClick={onClose}>
      <div className="career-modal-window" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="career-modal-close"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="career-modal-header">
          <div className="career-modal-dept">
            {job.department} // {job.type}
          </div>
          <h2 className="career-modal-title">{job.title}</h2>
          <div className="career-modal-meta-row">
            <span>📍 {job.location}</span>
            <span>💼 {job.experience}</span>
            <span>⚡ {job.salary}</span>
          </div>
        </div>

        {submittedApp ? (
          /* Application Submitted View */
          <div style={{
            background: '#050505',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '8px',
            padding: '44px 24px',
            textAlign: 'center',
            marginTop: '20px',
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              letterSpacing: '0.15em',
              color: '#10B981',
              marginBottom: '12px',
            }}>
              [ STATUS: APPLICATION RECEIVED ]
            </div>
            <h3 style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: '24px',
              color: '#FFFFFF',
              marginBottom: '10px',
            }}>
              Thank you, {formData.fullName || 'Candidate'}.
            </h3>
            <p style={{
              fontSize: '14.5px',
              color: '#9CA3AF',
              maxWidth: '480px',
              margin: '0 auto 18px auto',
              lineHeight: 1.6,
            }}>
              Your application for <strong>{job.title}</strong> has been received by our squad leads. Reference ID:{' '}
              <code style={{ color: '#60A5FA' }}>{submittedApp.id}</code>.
            </p>
            <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '28px' }}>
              You can monitor the live review and interview status anytime in your Candidate Dashboard.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                className="btn-career-secondary"
                onClick={onClose}
              >
                Close
              </button>
              <Link
                to="/careers/dashboard"
                onClick={onClose}
                className="btn-career-primary"
              >
                Go to Candidate Dashboard →
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Job Details Section */}
            <div>
              <h4 className="career-modal-section-title">About The Role</h4>
              <p style={{ fontSize: '14.5px', color: '#C9CDD5', lineHeight: 1.65, marginTop: '6px' }}>
                {job.summary}
              </p>

              <h4 className="career-modal-section-title">Key Responsibilities</h4>
              <ul className="career-modal-list">
                {ensureArray(job?.responsibilities).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>

              <h4 className="career-modal-section-title">Requirements &amp; Qualifications</h4>
              <ul className="career-modal-list">
                {ensureArray(job?.requirements).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>

              <h4 className="career-modal-section-title">Required Skills</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '10px 0 20px' }}>
                {ensureArray(job?.skills).map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '12px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      color: '#E5E7EB',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {ensureArray(job?.whatWeOffer).length > 0 && (
                <>
                  <h4 className="career-modal-section-title">What KODEWAR Offers</h4>
                  <ul className="career-modal-list">
                    {ensureArray(job?.whatWeOffer).map((offer, idx) => (
                      <li key={idx}>{offer}</li>
                    ))}
                  </ul>
                </>
              )}

              {/* Action Trigger */}
              {!showApplyForm ? (
                <div style={{ marginTop: '32px', textAlign: 'center' }}>
                  <button
                    type="button"
                    className="btn-career-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '16px 24px', fontSize: '14px' }}
                    onClick={handleApplyClick}
                  >
                    <span>
                      {isAuthenticated ? 'Apply for this role →' : 'Sign in to Apply for this role →'}
                    </span>
                  </button>
                  {!isAuthenticated && (
                    <div style={{ fontSize: '12px', color: '#8A8A8A', marginTop: '10px' }}>
                      Candidates authenticate once to create persistent profiles and track application status.
                    </div>
                  )}
                </div>
              ) : (
                /* Authenticated Application Form */
                <form
                  className="career-modal-form"
                  onSubmit={handleSubmit}
                  style={{ marginTop: '32px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '28px' }}
                >
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontFamily: "'Sora', sans-serif", fontSize: '18px', color: '#FFFFFF', margin: 0 }}>
                        Candidate Application Form
                      </h4>
                      <span style={{ fontSize: '12px', color: '#10B981', fontFamily: 'monospace' }}>
                        ✓ Pre-filled from profile
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#8A8A8A', margin: '4px 0 0' }}>
                      Review your credentials and select your resume below.
                    </p>
                  </div>

                  {errorMessage && (
                    <div style={{
                      gridColumn: 'span 2',
                      padding: '12px 16px',
                      background: 'rgba(239, 68, 68, 0.12)',
                      border: '1px solid rgba(239, 68, 68, 0.35)',
                      borderRadius: '4px',
                      color: '#F87171',
                      fontSize: '13px',
                    }}>
                      {errorMessage}
                      {errorMessage.includes('already submitted') && (
                        <div style={{ marginTop: '8px' }}>
                          <Link to="/careers/dashboard" onClick={onClose} style={{ color: '#FFFFFF', fontWeight: 600 }}>
                            View in Candidate Dashboard →
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="form-group">
                    <label className="career-form-label" htmlFor="app-fullName">Full Name *</label>
                    <input
                      id="app-fullName"
                      name="fullName"
                      type="text"
                      required
                      className="career-form-input"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="career-form-label" htmlFor="app-email">Email Address *</label>
                    <input
                      id="app-email"
                      name="email"
                      type="email"
                      required
                      className="career-form-input"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="career-form-label" htmlFor="app-phone">Phone / WhatsApp *</label>
                    <input
                      id="app-phone"
                      name="phone"
                      type="tel"
                      required
                      className="career-form-input"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="career-form-label" htmlFor="app-location">Current Location *</label>
                    <input
                      id="app-location"
                      name="location"
                      type="text"
                      required
                      className="career-form-input"
                      placeholder="e.g. Hyderabad, Remote"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="career-form-label" htmlFor="app-college">College / University</label>
                    <input
                      id="app-college"
                      name="college"
                      type="text"
                      className="career-form-input"
                      value={formData.college}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="career-form-label" htmlFor="app-gradYear">Graduation Year</label>
                    <input
                      id="app-gradYear"
                      name="gradYear"
                      type="text"
                      className="career-form-input"
                      value={formData.gradYear}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="career-form-label" htmlFor="app-linkedin">LinkedIn Profile URL</label>
                    <input
                      id="app-linkedin"
                      name="linkedin"
                      type="url"
                      className="career-form-input"
                      value={formData.linkedin}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="career-form-label" htmlFor="app-github">GitHub / Portfolio URL</label>
                    <input
                      id="app-github"
                      name="github"
                      type="url"
                      className="career-form-input"
                      value={formData.github}
                      onChange={handleChange}
                    />
                  </div>

                  {/* RESUME SELECTION */}
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="career-form-label">Resume Document *</label>

                    {profile?.resume_storage_path && (
                      <div style={{
                        background: '#111217',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                        padding: '12px 16px',
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', margin: 0 }}>
                          <input
                            type="radio"
                            name="resumeSelection"
                            checked={useProfileResume}
                            onChange={() => setUseProfileResume(true)}
                            style={{ accentColor: '#0066FF' }}
                          />
                          <span style={{ fontSize: '13px', color: '#FFFFFF' }}>
                            Use profile resume: <strong>{profile.resume_filename}</strong>
                          </span>
                        </label>
                      </div>
                    )}

                    <div style={{
                      background: '#111217',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      padding: '12px 16px',
                    }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', margin: 0 }}>
                        {profile?.resume_storage_path && (
                          <input
                            type="radio"
                            name="resumeSelection"
                            checked={!useProfileResume}
                            onChange={() => setUseProfileResume(false)}
                            style={{ accentColor: '#0066FF' }}
                          />
                        )}
                        <span style={{ fontSize: '13px', color: '#FFFFFF' }}>
                          Upload a {profile?.resume_storage_path ? 'different' : ''} resume for this role (PDF, DOC, DOCX up to 10MB)
                        </span>
                      </label>

                      {(!useProfileResume || !profile?.resume_storage_path) && (
                        <div style={{ marginTop: '12px', paddingLeft: profile?.resume_storage_path ? '24px' : 0 }}>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleCustomResumeChange}
                            required={!profile?.resume_storage_path}
                            style={{ color: '#8A8A8A', fontSize: '12px' }}
                          />
                          {customResumeFile && (
                            <span style={{ fontSize: '12px', color: '#10B981', display: 'block', marginTop: '4px' }}>
                              ✓ Attached: {customResumeFile.name} ({(customResumeFile.size / 1024).toFixed(0)} KB)
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cover Message */}
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="career-form-label" htmlFor="app-coverMessage">
                      Cover Message / Candidate Notes (Optional)
                    </label>
                    <textarea
                      id="app-coverMessage"
                      name="coverMessage"
                      rows={3}
                      className="career-form-input"
                      placeholder="Share relevant project experience, technical highlights, or why you want to build with KODEWAR..."
                      value={formData.coverMessage}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: 'span 2', marginTop: '12px' }}>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-career-primary"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      <span>{loading ? 'SUBMITTING APPLICATION...' : 'SUBMIT APPLICATION →'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
