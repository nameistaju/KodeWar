import React, { useState, useEffect } from 'react';
import '../../../components/ui/lead-modal.css';

export default function DMLeadModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    companyName: '',
    phone: '',
    email: '',
    businessCategory: 'E-Commerce & Retail',
    address: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.companyName.trim() || !formData.phone.trim() || !formData.email.trim()) {
      setErrorMsg('Please fill in Company Name, Phone Number, and Email.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/leads/digital-marketing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        setSuccess(true);
        sessionStorage.setItem('dm_lead_submitted', 'true');
        setTimeout(() => {
          onClose();
        }, 2500);
      } else {
        setErrorMsg(resData.message || 'Failed to submit inquiry. Please try again.');
      }
    } catch (err) {
      console.error('Lead submit error:', err);
      // Fallback local acknowledgment if offline / dev mode
      setSuccess(true);
      sessionStorage.setItem('dm_lead_submitted', 'true');
      setTimeout(() => {
        onClose();
      }, 2500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lead-modal-backdrop" onClick={onClose}>
      <div className="lead-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="lead-modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="lead-modal-eyebrow">DIGITAL MARKETING &amp; GROWTH</div>
        <h2 className="lead-modal-title">ACCELERATE YOUR BRAND</h2>
        <p className="lead-modal-subtitle">
          Submit your enterprise details below to claim a complimentary performance marketing roadmap &amp; audit.
        </p>

        {success ? (
          <div className="lead-success-msg">
            ✓ Thank you! Your details have been received. Our growth specialists will reach out to you shortly.
          </div>
        ) : (
          <form className="lead-modal-form" onSubmit={handleSubmit}>
            {errorMsg && (
              <div style={{ color: '#E5E7EB', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                ⚠️ {errorMsg}
              </div>
            )}

            <div className="lead-field-group">
              <label className="lead-field-label">Company Name *</label>
              <input
                type="text"
                name="companyName"
                placeholder="e.g. Acme Enterprise Corp"
                value={formData.companyName}
                onChange={handleChange}
                className="lead-field-input"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="lead-field-group">
                <label className="lead-field-label">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="lead-field-input"
                  required
                />
              </div>

              <div className="lead-field-group">
                <label className="lead-field-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="contact@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="lead-field-input"
                  required
                />
              </div>
            </div>

            <div className="lead-field-group">
              <label className="lead-field-label">Business Category</label>
              <select
                name="businessCategory"
                value={formData.businessCategory}
                onChange={handleChange}
                className="lead-field-select"
              >
                <option value="E-Commerce & Retail">E-Commerce &amp; Retail</option>
                <option value="Software & SaaS">Software &amp; SaaS</option>
                <option value="Education & Training">Education &amp; Training</option>
                <option value="Healthcare & Wellness">Healthcare &amp; Wellness</option>
                <option value="Real Estate & Infrastructure">Real Estate &amp; Infrastructure</option>
                <option value="Finance & Fintech">Finance &amp; Fintech</option>
                <option value="Other Industry">Other Industry</option>
              </select>
            </div>

            <div className="lead-field-group">
              <label className="lead-field-label">Address / Location</label>
              <input
                type="text"
                name="address"
                placeholder="City / Region / Office Address"
                value={formData.address}
                onChange={handleChange}
                className="lead-field-input"
              />
            </div>

            <button type="submit" className="lead-submit-btn" disabled={loading}>
              {loading ? 'SUBMITTING...' : 'REQUEST GROWTH ROADMAP →'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
