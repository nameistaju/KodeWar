import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import '../../../styles/careerAuth.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function CandidateProfile() {
  const navigate = useNavigate();
  const { user, profile, updateProfile, uploadResume, isAuthenticated, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    location: '',
    college: '',
    degree: '',
    field: '',
    graduation_year: '',
    skills: '',
    experience: '',
    current_role: '',
    linkedin: '',
    github: '',
    portfolio: '',
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/careers/login', { replace: true, state: { from: '/careers/profile' } });
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        location: profile.location || '',
        college: profile.college || '',
        degree: profile.degree || '',
        field: profile.field || '',
        graduation_year: profile.graduation_year || '',
        skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : profile.skills || '',
        experience: profile.experience || '',
        current_role: profile.current_role || '',
        linkedin: profile.linkedin || '',
        github: profile.github || '',
        portfolio: profile.portfolio || '',
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const skillsArray = formData.skills
        ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      await updateProfile({
        ...formData,
        skills: skillsArray,
      });

      setSuccessMsg('Profile updated successfully.');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save profile changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Resume file size exceeds 10MB limit.');
      return;
    }

    setResumeUploading(true);
    setErrorMsg('');
    try {
      await uploadResume(file);
      setSuccessMsg('Resume uploaded and attached to profile.');
    } catch (err) {
      setErrorMsg(err.message || 'Resume upload failed.');
    } finally {
      setResumeUploading(false);
    }
  };

  const handleDownloadResume = async () => {
    const token = localStorage.getItem('kwt_candidate_token');
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/profile/resume`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error('Resume file not available on server.');
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = profile?.resume_filename || 'Candidate_Resume.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setErrorMsg(err.message || 'Error downloading resume.');
    }
  };

  return (
    <div className="candidate-dash-page">
      <div className="candidate-dash-container" style={{ maxWidth: '960px' }}>
        <header className="dash-header-row">
          <div className="dash-header-title">
            <div className="career-auth-eyebrow">
              <Link to="/careers/dashboard" style={{ color: '#8A8A8A', textDecoration: 'none' }}>
                DASHBOARD
              </Link>{' '}
              / CANDIDATE PROFILE
            </div>
            <h1>Edit Candidate Profile</h1>
            <p>Your profile information pre-fills new job and apprenticeship applications automatically.</p>
          </div>

          <Link to="/careers/dashboard" className="btn-career-secondary">
            ← Back to Dashboard
          </Link>
        </header>

        {successMsg && (
          <div style={{
            padding: '12px 16px',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '4px',
            color: '#10B981',
            fontSize: '13px',
            marginBottom: '20px',
          }}>
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="auth-error-banner">{errorMsg}</div>
        )}

        {/* RESUME MANAGEMENT CARD */}
        <section style={{
          background: '#0B0B0D',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '24px',
          marginBottom: '28px',
        }}>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: '18px', color: '#FFFFFF', margin: '0 0 4px' }}>
            Primary Resume Document
          </h2>
          <p style={{ color: '#8A8A8A', fontSize: '13px', margin: '0 0 16px' }}>
            Attached document used by default when applying for KODEWAR positions.
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            background: '#111217',
            padding: '16px 20px',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            flexWrap: 'wrap',
          }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF' }}>
                {profile?.resume_filename ? profile.resume_filename : 'No resume attached'}
              </div>
              <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '3px' }}>
                {profile?.resume_uploaded_at
                  ? `Uploaded on ${new Date(profile.resume_uploaded_at).toLocaleDateString()}`
                  : 'Formats: PDF, DOC, DOCX up to 10MB'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {profile?.resume_storage_path && (
                <button
                  type="button"
                  onClick={handleDownloadResume}
                  className="btn-career-secondary"
                  style={{ padding: '8px 16px', fontSize: '12px' }}
                >
                  Download Current
                </button>
              )}

              <label
                className="btn-career-primary"
                style={{ padding: '8px 16px', fontSize: '12px', cursor: 'pointer', margin: 0 }}
              >
                <span>{resumeUploading ? 'UPLOADING...' : profile?.resume_filename ? 'Replace Resume' : 'Upload Resume'}</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  style={{ display: 'none' }}
                  disabled={resumeUploading}
                />
              </label>
            </div>
          </div>
        </section>

        {/* PROFILE FIELDS FORM */}
        <form onSubmit={handleSubmit} style={{
          background: '#0B0B0D',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '32px',
        }}>
          {/* 1. Personal Information */}
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: '18px', color: '#FFFFFF', margin: '0 0 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px' }}>
            1. Personal Information
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            <div className="auth-form-group">
              <label className="auth-form-label">Full Name *</label>
              <input
                name="full_name"
                type="text"
                required
                className="auth-form-input"
                value={formData.full_name}
                onChange={handleChange}
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label">Email (Account)</label>
              <input
                type="email"
                disabled
                className="auth-form-input"
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
                value={user?.email || ''}
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label">Phone / WhatsApp</label>
              <input
                name="phone"
                type="tel"
                className="auth-form-input"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label">Location (City / State)</label>
              <input
                name="location"
                type="text"
                className="auth-form-input"
                placeholder="e.g. Hyderabad, Telangana"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* 2. Education */}
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: '18px', color: '#FFFFFF', margin: '0 0 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px' }}>
            2. Education
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            <div className="auth-form-group">
              <label className="auth-form-label">College / University</label>
              <input
                name="college"
                type="text"
                className="auth-form-input"
                placeholder="e.g. JNTU Hyderabad"
                value={formData.college}
                onChange={handleChange}
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label">Degree</label>
              <input
                name="degree"
                type="text"
                className="auth-form-input"
                placeholder="e.g. B.Tech / B.E. / BCA / Degree"
                value={formData.degree}
                onChange={handleChange}
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label">Field of Study</label>
              <input
                name="field"
                type="text"
                className="auth-form-input"
                placeholder="e.g. Computer Science, IT, Electronics"
                value={formData.field}
                onChange={handleChange}
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label">Graduation Year</label>
              <input
                name="graduation_year"
                type="text"
                className="auth-form-input"
                placeholder="e.g. 2024, 2025, 2026"
                value={formData.graduation_year}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* 3. Professional Information */}
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: '18px', color: '#FFFFFF', margin: '0 0 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px' }}>
            3. Professional Information
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '28px' }}>
            <div className="auth-form-group">
              <label className="auth-form-label">Skills (Comma-separated)</label>
              <input
                name="skills"
                type="text"
                className="auth-form-input"
                placeholder="e.g. React, Next.js, Node.js, Python, Figma, Tailwind CSS"
                value={formData.skills}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="auth-form-group">
                <label className="auth-form-label">Experience Level</label>
                <select
                  name="experience"
                  className="auth-form-input"
                  value={formData.experience}
                  onChange={handleChange}
                >
                  <option value="">Select Experience Level</option>
                  <option value="Student / Fresher">Student / Fresher</option>
                  <option value="0–1 Year">0–1 Year</option>
                  <option value="1–3 Years">1–3 Years</option>
                  <option value="3–5 Years">3–5 Years</option>
                  <option value="5+ Years">5+ Years</option>
                </select>
              </div>

              <div className="auth-form-group">
                <label className="auth-form-label">Current Role / Status</label>
                <input
                  name="current_role"
                  type="text"
                  className="auth-form-input"
                  placeholder="e.g. Final Year Student, Frontend Dev"
                  value={formData.current_role}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* 4. Links */}
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: '18px', color: '#FFFFFF', margin: '0 0 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px' }}>
            4. Portfolios &amp; Public Links
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            <div className="auth-form-group">
              <label className="auth-form-label">LinkedIn Profile URL</label>
              <input
                name="linkedin"
                type="url"
                className="auth-form-input"
                placeholder="https://linkedin.com/in/username"
                value={formData.linkedin}
                onChange={handleChange}
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label">GitHub Profile URL</label>
              <input
                name="github"
                type="url"
                className="auth-form-input"
                placeholder="https://github.com/username"
                value={formData.github}
                onChange={handleChange}
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label">Portfolio Website URL</label>
              <input
                name="portfolio"
                type="url"
                className="auth-form-input"
                placeholder="https://yourportfolio.dev"
                value={formData.portfolio}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Link to="/careers/dashboard" className="btn-career-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn-career-primary" disabled={saving}>
              <span>{saving ? 'SAVING CHANGES...' : 'SAVE CANDIDATE PROFILE'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
