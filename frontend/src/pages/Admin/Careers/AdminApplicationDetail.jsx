import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../../layouts/AdminLayout';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const STATUS_OPTIONS = [
  'APPLIED',
  'UNDER_REVIEW',
  'SHORTLISTED',
  'INTERVIEW',
  'SELECTED',
  'REJECTED',
];

export default function AdminApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusVal, setStatusVal] = useState('APPLIED');
  const [adminNotes, setAdminNotes] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState('');
  const [notesFeedback, setNotesFeedback] = useState('');

  const loadApplication = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('kwt_candidate_token');
      const res = await fetch(`${API_BASE_URL}/admin/applications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setApplication(data.application);
        setStatusVal(data.application.status || 'APPLIED');
        setAdminNotes(data.application.admin_notes || '');
      }
    } catch (err) {
      console.error('Error loading application details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplication();
  }, [id]);

  const handleSaveStatus = async () => {
    setSavingStatus(true);
    setStatusFeedback('');
    try {
      const token = localStorage.getItem('kwt_candidate_token');
      const res = await fetch(`${API_BASE_URL}/admin/applications/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: statusVal, adminNotes }),
      });
      if (res.ok) {
        setStatusFeedback('Status updated successfully.');
        setTimeout(() => setStatusFeedback(''), 3000);
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setSavingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    setNotesFeedback('');
    try {
      const token = localStorage.getItem('kwt_candidate_token');
      const res = await fetch(`${API_BASE_URL}/admin/applications/${id}/notes`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ adminNotes }),
      });
      if (res.ok) {
        setNotesFeedback('Internal notes saved.');
        setTimeout(() => setNotesFeedback(''), 3000);
      }
    } catch (err) {
      console.error('Error saving notes:', err);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDownloadResume = async () => {
    try {
      const token = localStorage.getItem('kwt_candidate_token');
      const res = await fetch(`${API_BASE_URL}/admin/applications/${id}/resume`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Resume file not found on server.');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = application?.resume_filename || 'Candidate_Resume.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message || 'Error downloading resume.');
    }
  };

  if (loading) {
    return (
      <AdminLayout breadcrumbs={[{ label: 'CAREERS', link: '/admin/careers' }, { label: 'APPLICATIONS', link: '/admin/careers/applications' }, { label: 'DETAILS' }]}>
        <div style={{ padding: '60px', textAlign: 'center', color: '#8A8A8A' }}>Loading application dossier...</div>
      </AdminLayout>
    );
  }

  if (!application) {
    return (
      <AdminLayout breadcrumbs={[{ label: 'CAREERS', link: '/admin/careers' }, { label: 'APPLICATIONS', link: '/admin/careers/applications' }, { label: 'NOT FOUND' }]}>
        <div style={{ padding: '60px', textAlign: 'center', color: '#8A8A8A' }}>Application not found.</div>
      </AdminLayout>
    );
  }

  const prof = application.candidate_profile || {};
  const candName = application.applicant_name || prof.full_name || 'Candidate';
  const candEmail = application.applicant_email || prof.email;
  const candPhone = application.applicant_phone || prof.phone || 'Not provided';
  const candLocation = prof.location || 'Not provided';

  return (
    <AdminLayout breadcrumbs={[
      { label: 'CAREERS', link: '/admin/careers' },
      { label: 'APPLICATIONS', link: '/admin/careers/applications' },
      { label: candName }
    ]}>
      {/* HEADER */}
      <div className="admin-header-row">
        <div className="admin-header-title-wrap">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h1 style={{ margin: 0 }}>{candName}</h1>
            <span className={`status-pill ${application.status.toLowerCase()}`}>
              {application.status.replace('_', ' ')}
            </span>
          </div>
          <p>
            Applied for <strong style={{ color: '#FFFFFF' }}>{application.job_title}</strong> on{' '}
            {new Date(application.created_at).toLocaleDateString()} at{' '}
            {new Date(application.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <div className="admin-header-actions">
          <Link to="/admin/careers/applications" className="btn-kwt-secondary">
            &larr; Back to Applications
          </Link>
          {application.resume_storage_path && (
            <button
              type="button"
              className="btn-kwt-primary"
              onClick={handleDownloadResume}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Download Resume</span>
            </button>
          )}
        </div>
      </div>

      <div className="admin-dossier-grid">
        {/* LEFT COLUMN: CANDIDATE DOSSIER */}
        <div>
          {/* 1. CANDIDATE PROFILE */}
          <div className="admin-card-section">
            <div className="admin-card-section-title">
              <span>Candidate Profile</span>
            </div>
            <div className="admin-detail-keyval">
              <span className="admin-detail-key">Full Name</span>
              <span className="admin-detail-val" style={{ fontWeight: 600, color: '#FFFFFF' }}>{candName}</span>
            </div>
            <div className="admin-detail-keyval">
              <span className="admin-detail-key">Email</span>
              <span className="admin-detail-val">
                <a href={`mailto:${candEmail}`} style={{ color: '#60A5FA', textDecoration: 'none' }}>
                  {candEmail}
                </a>
              </span>
            </div>
            <div className="admin-detail-keyval">
              <span className="admin-detail-key">Phone</span>
              <span className="admin-detail-val">{candPhone}</span>
            </div>
            <div className="admin-detail-keyval">
              <span className="admin-detail-key">Location</span>
              <span className="admin-detail-val">{candLocation}</span>
            </div>
          </div>

          {/* 2. EDUCATION */}
          <div className="admin-card-section">
            <div className="admin-card-section-title">
              <span>Academic Background</span>
            </div>
            <div className="admin-detail-keyval">
              <span className="admin-detail-key">College / Univ</span>
              <span className="admin-detail-val">{prof.college || 'Not specified'}</span>
            </div>
            <div className="admin-detail-keyval">
              <span className="admin-detail-key">Degree &amp; Field</span>
              <span className="admin-detail-val">
                {prof.degree ? `${prof.degree} ${prof.field ? `in ${prof.field}` : ''}` : 'Not specified'}
              </span>
            </div>
            <div className="admin-detail-keyval">
              <span className="admin-detail-key">Graduation Year</span>
              <span className="admin-detail-val">{prof.graduation_year || 'Not specified'}</span>
            </div>
          </div>

          {/* 3. PROFESSIONAL & SKILLS */}
          <div className="admin-card-section">
            <div className="admin-card-section-title">
              <span>Professional Experience</span>
            </div>
            <div className="admin-detail-keyval">
              <span className="admin-detail-key">Current Role</span>
              <span className="admin-detail-val">{prof.current_role || 'Candidate'}</span>
            </div>
            <div className="admin-detail-keyval">
              <span className="admin-detail-key">Experience</span>
              <span className="admin-detail-val">{application.years_experience || prof.experience || 'Not specified'}</span>
            </div>
            <div className="admin-detail-keyval">
              <span className="admin-detail-key">Skills</span>
              <span className="admin-detail-val" style={{ color: '#60A5FA' }}>
                {prof.skills || 'Not specified'}
              </span>
            </div>
          </div>

          {/* 4. LINKS */}
          <div className="admin-card-section">
            <div className="admin-card-section-title">
              <span>Candidate Links</span>
            </div>
            <div className="admin-detail-keyval">
              <span className="admin-detail-key">LinkedIn</span>
              <span className="admin-detail-val">
                {application.linkedin_url || prof.linkedin ? (
                  <a
                    href={application.linkedin_url || prof.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#60A5FA' }}
                  >
                    {application.linkedin_url || prof.linkedin} &nearr;
                  </a>
                ) : 'None provided'}
              </span>
            </div>
            <div className="admin-detail-keyval">
              <span className="admin-detail-key">GitHub</span>
              <span className="admin-detail-val">
                {application.github_url || prof.github ? (
                  <a
                    href={application.github_url || prof.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#60A5FA' }}
                  >
                    {application.github_url || prof.github} &nearr;
                  </a>
                ) : 'None provided'}
              </span>
            </div>
            <div className="admin-detail-keyval">
              <span className="admin-detail-key">Portfolio</span>
              <span className="admin-detail-val">
                {application.portfolio_url || prof.portfolio ? (
                  <a
                    href={application.portfolio_url || prof.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#60A5FA' }}
                  >
                    {application.portfolio_url || prof.portfolio} &nearr;
                  </a>
                ) : 'None provided'}
              </span>
            </div>
          </div>

          {/* 5. COVER MESSAGE */}
          {application.cover_letter && (
            <div className="admin-card-section">
              <div className="admin-card-section-title">
                <span>Cover Message</span>
              </div>
              <p style={{ color: '#D1D5DB', fontSize: '13.5px', lineHeight: 1.6, whiteSpace: 'pre-line', margin: 0 }}>
                {application.cover_letter}
              </p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: STATUS PIPELINE, NOTES & RESUME */}
        <div>
          {/* STATUS CONTROLLER (Section 10) */}
          <div className="admin-card-section">
            <div className="admin-card-section-title">
              <span>Application Status</span>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="admin-form-label">Workflow Stage</label>
              <select
                className="admin-form-select"
                value={statusVal}
                onChange={(e) => setStatusVal(e.target.value)}
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>{st.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            {statusFeedback && (
              <div style={{ fontSize: '12px', color: '#34D399', marginBottom: '12px' }}>
                ✓ {statusFeedback}
              </div>
            )}

            <button
              type="button"
              className="btn-kwt-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={savingStatus}
              onClick={handleSaveStatus}
            >
              {savingStatus ? 'Saving...' : 'Save Status'}
            </button>
          </div>

          {/* RESUME CARD (Section 9 & 17) */}
          <div className="admin-card-section">
            <div className="admin-card-section-title">
              <span>Resume Attachment</span>
            </div>

            {application.resume_storage_path ? (
              <div>
                <div style={{
                  padding: '12px',
                  background: '#070709',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px',
                  marginBottom: '14px',
                }}>
                  <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '13px', marginBottom: '4px' }}>
                    {application.resume_filename || 'Candidate_Resume.pdf'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6B7280', fontFamily: "'JetBrains Mono', monospace" }}>
                    Protected local storage snapshot
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-kwt-secondary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={handleDownloadResume}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Download Resume PDF</span>
                </button>
              </div>
            ) : (
              <p style={{ color: '#6B7280', fontSize: '13px', margin: 0 }}>
                No resume attached for this candidate submission.
              </p>
            )}
          </div>

          {/* INTERNAL NOTES (Section 11) */}
          <div className="admin-notes-card">
            <div className="admin-notes-eyebrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Internal Admin Notes</span>
            </div>

            <p style={{ fontSize: '11.5px', color: '#C7D2FE', margin: '0 0 12px', lineHeight: 1.4 }}>
              Confidential internal hiring team notes. <strong>Never visible to candidate.</strong>
            </p>

            <textarea
              className="admin-form-textarea"
              placeholder="e.g. Strong React experience. Schedule technical interview for next Tuesday..."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={4}
              style={{ background: '#07070B', borderColor: 'rgba(99, 102, 241, 0.4)' }}
            />

            {notesFeedback && (
              <div style={{ fontSize: '12px', color: '#A5B4FC', margin: '8px 0' }}>
                ✓ {notesFeedback}
              </div>
            )}

            <button
              type="button"
              className="btn-kwt-secondary"
              style={{
                width: '100%',
                justifyContent: 'center',
                marginTop: '12px',
                borderColor: 'rgba(99, 102, 241, 0.5)',
                color: '#E0E7FF',
              }}
              disabled={savingNotes}
              onClick={handleSaveNotes}
            >
              {savingNotes ? 'Saving...' : 'Save Internal Notes'}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
