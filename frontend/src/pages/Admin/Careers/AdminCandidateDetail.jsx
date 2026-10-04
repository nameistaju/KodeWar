import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '../../../layouts/AdminLayout';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminCandidateDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCandidate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('kwt_candidate_token');
      const res = await fetch(`${API_BASE_URL}/admin/candidates/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setData(json.candidate);
      }
    } catch (err) {
      console.error('Error loading candidate detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidate();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout breadcrumbs={[{ label: 'CAREERS', link: '/admin/careers' }, { label: 'CANDIDATES', link: '/admin/careers/candidates' }, { label: 'DOSSIER' }]}>
        <div style={{ padding: '60px', textAlign: 'center', color: '#8A8A8A' }}>Loading candidate record...</div>
      </AdminLayout>
    );
  }

  if (!data) {
    return (
      <AdminLayout breadcrumbs={[{ label: 'CAREERS', link: '/admin/careers' }, { label: 'CANDIDATES', link: '/admin/careers/candidates' }, { label: 'NOT FOUND' }]}>
        <div style={{ padding: '60px', textAlign: 'center', color: '#8A8A8A' }}>Candidate not found.</div>
      </AdminLayout>
    );
  }

  const prof = data.profile || {};
  const candName = prof.full_name || data.name || 'Candidate';
  const apps = data.applications || [];

  return (
    <AdminLayout breadcrumbs={[
      { label: 'CAREERS', link: '/admin/careers' },
      { label: 'CANDIDATES', link: '/admin/careers/candidates' },
      { label: candName }
    ]}>
      {/* HEADER */}
      <div className="admin-header-row">
        <div className="admin-header-title-wrap">
          <h1>{candName}</h1>
          <p>
            Candidate profile registered on{' '}
            {data.created_at ? new Date(data.created_at).toLocaleDateString() : 'KODEWAR Network'}
          </p>
        </div>

        <div className="admin-header-actions">
          <Link to="/admin/careers/candidates" className="btn-kwt-secondary">
            &larr; Back to Candidates
          </Link>
        </div>
      </div>

      <div className="admin-dossier-grid">
        {/* LEFT COLUMN: PROFILE DATA */}
        <div>
          {/* PERSONAL INFO */}
          <div className="admin-card-section">
            <div className="admin-card-section-title">
              <span>Personal Details</span>
            </div>
            <div className="admin-detail-keyval">
              <span className="admin-detail-key">Email</span>
              <span className="admin-detail-val">{data.email}</span>
            </div>
            <div className="admin-detail-keyval">
              <span className="admin-detail-key">Phone</span>
              <span className="admin-detail-val">{prof.phone || 'Not provided'}</span>
            </div>
            <div className="admin-detail-keyval">
              <span className="admin-detail-key">Location</span>
              <span className="admin-detail-val">{prof.location || 'Not provided'}</span>
            </div>
          </div>

          {/* ACADEMICS */}
          <div className="admin-card-section">
            <div className="admin-card-section-title">
              <span>Education</span>
            </div>
            <div className="admin-detail-keyval">
              <span className="admin-detail-key">Institution</span>
              <span className="admin-detail-val">{prof.college || 'Not specified'}</span>
            </div>
            <div className="admin-detail-keyval">
              <span className="admin-detail-key">Degree</span>
              <span className="admin-detail-val">{prof.degree || 'Not specified'}</span>
            </div>
            <div className="admin-detail-keyval">
              <span className="admin-detail-key">Graduation Year</span>
              <span className="admin-detail-val">{prof.graduation_year || 'Not specified'}</span>
            </div>
          </div>

          {/* PROFESSIONAL */}
          <div className="admin-card-section">
            <div className="admin-card-section-title">
              <span>Skills &amp; Track Record</span>
            </div>
            <div className="admin-detail-keyval">
              <span className="admin-detail-key">Role / Company</span>
              <span className="admin-detail-val">{prof.current_role || 'Candidate'}</span>
            </div>
            <div className="admin-detail-keyval">
              <span className="admin-detail-key">Experience</span>
              <span className="admin-detail-val">{prof.experience || 'Not specified'}</span>
            </div>
            <div className="admin-detail-keyval">
              <span className="admin-detail-key">Skills</span>
              <span className="admin-detail-val" style={{ color: '#60A5FA' }}>
                {prof.skills || 'Not specified'}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: APPLICATIONS & RESUME */}
        <div>
          {/* ATTACHED RESUME */}
          <div className="admin-card-section">
            <div className="admin-card-section-title">
              <span>Profile Resume</span>
            </div>

            {prof.resume_filename ? (
              <div>
                <div style={{
                  padding: '12px',
                  background: '#070709',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px',
                  marginBottom: '12px',
                }}>
                  <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '13px' }}>
                    {prof.resume_filename}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6B7280', fontFamily: "'JetBrains Mono', monospace", marginTop: '2px' }}>
                    Uploaded {prof.resume_uploaded_at ? new Date(prof.resume_uploaded_at).toLocaleDateString() : ''}
                  </div>
                </div>
              </div>
            ) : (
              <p style={{ color: '#6B7280', fontSize: '13px', margin: 0 }}>
                Candidate has not attached a global profile resume.
              </p>
            )}
          </div>

          {/* APPLICATIONS SUBMITTED BY CANDIDATE */}
          <div className="admin-card-section">
            <div className="admin-card-section-title">
              <span>Submitted Applications ({apps.length})</span>
            </div>

            {apps.length === 0 ? (
              <p style={{ color: '#6B7280', fontSize: '13px', margin: 0 }}>
                No job applications submitted yet.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {apps.map((app) => (
                  <div
                    key={app.id}
                    style={{
                      padding: '12px',
                      background: '#070709',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '13px', marginBottom: '2px' }}>
                        {app.job_title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#8A8A8A', fontFamily: "'JetBrains Mono', monospace" }}>
                        {new Date(app.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`status-pill ${app.status.toLowerCase()}`}>
                        {app.status.replace('_', ' ')}
                      </span>
                      <Link
                        to={`/admin/careers/applications/${app.id}`}
                        className="btn-kwt-secondary"
                        style={{ padding: '4px 8px', fontSize: '10.5px' }}
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
