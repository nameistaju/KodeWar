import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../../layouts/AdminLayout';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function CareerOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOverview = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('kwt_candidate_token');
      const res = await fetch(`${API_BASE_URL}/admin/overview`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        setError('Unable to load career overview. Please ensure you are logged in as Admin.');
      }
    } catch (err) {
      console.error('Error fetching admin overview:', err);
      setError('Connection to backend failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  const metrics = data?.metrics || {
    open_jobs_count: 0,
    total_applications_count: 0,
    new_applications_count: 0,
    candidates_count: 0,
    training_programs_count: 0,
  };

  const recentApps = data?.recent_applications || [];
  const activeJobs = data?.active_jobs || [];

  return (
    <AdminLayout breadcrumbs={[{ label: 'CAREERS', link: '/admin/careers' }, { label: 'OVERVIEW' }]}>
      {/* HEADER */}
      <div className="admin-header-row">
        <div className="admin-header-title-wrap">
          <h1>Career &amp; Talent Overview</h1>
          <p>
            Real-time pipeline metrics, incoming applications, open studio positions, and candidate activity across KODEWAR.
          </p>
        </div>

        <div className="admin-header-actions">
          <Link to="/admin/careers/jobs/new" className="btn-kwt-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Post New Job</span>
          </Link>
          <Link to="/admin/careers/applications" className="btn-kwt-secondary">
            <span>Review Applications</span>
          </Link>
        </div>
      </div>

      {error && (
        <div style={{
          padding: '12px 16px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '6px',
          color: '#F87171',
          fontSize: '13px',
          marginBottom: '24px',
        }}>
          {error}
        </div>
      )}

      {/* METRICS GRID (Section 3 Requirement) */}
      <section className="admin-metrics-grid">
        {/* OPEN JOBS */}
        <div className="admin-metric-card">
          <span className="admin-metric-label">Open Jobs</span>
          <div className="admin-metric-val">{loading ? '...' : metrics.open_jobs_count}</div>
          <span className="admin-metric-sub">Published &amp; accepting applications</span>
        </div>

        {/* TOTAL APPLICATIONS */}
        <div className="admin-metric-card">
          <span className="admin-metric-label">Total Applications</span>
          <div className="admin-metric-val">{loading ? '...' : metrics.total_applications_count}</div>
          <span className="admin-metric-sub">Cumulative submissions</span>
        </div>

        {/* NEW APPLICATIONS */}
        <div className="admin-metric-card">
          <span className="admin-metric-label">New Applications</span>
          <div className="admin-metric-val" style={{ color: metrics.new_applications_count > 0 ? '#60A5FA' : '#FFFFFF' }}>
            {loading ? '...' : metrics.new_applications_count}
          </div>
          <span className="admin-metric-sub">Awaiting review</span>
        </div>

        {/* CANDIDATES */}
        <div className="admin-metric-card">
          <span className="admin-metric-label">Candidates</span>
          <div className="admin-metric-val">{loading ? '...' : metrics.candidates_count}</div>
          <span className="admin-metric-sub">Registered candidate profiles</span>
        </div>

        {/* TRAINING PROGRAMS */}
        <div className="admin-metric-card">
          <span className="admin-metric-label">Training Programs</span>
          <div className="admin-metric-val">{loading ? '...' : metrics.training_programs_count}</div>
          <span className="admin-metric-sub">Active apprenticeships</span>
        </div>
      </section>

      {/* 2-COLUMN VIEW: RECENT APPLICATIONS & ACTIVE JOBS */}
      <div className="admin-dossier-grid">
        {/* RECENT APPLICATIONS */}
        <div className="admin-card-section">
          <div className="admin-card-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span>Recent Applications</span>
          </div>

          {recentApps.length === 0 ? (
            <p style={{ color: '#6B7280', fontSize: '13.5px', margin: '20px 0' }}>
              No candidate applications received yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentApps.map((app) => (
                <div
                  key={app.id}
                  style={{
                    padding: '14px 16px',
                    background: '#070709',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '14px', marginBottom: '4px' }}>
                      {app.job_title}
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#8A8A8A' }}>
                      {app.candidate_name} &bull; <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}>
                        {new Date(app.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className={`status-pill ${app.status.toLowerCase()}`}>
                      {app.status.replace('_', ' ')}
                    </span>
                    <Link
                      to={`/admin/careers/applications/${app.id}`}
                      className="btn-kwt-secondary"
                      style={{ padding: '5px 10px', fontSize: '11px' }}
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: '16px', textAlign: 'right' }}>
            <Link to="/admin/careers/applications" className="admin-return-link" style={{ margin: 0 }}>
              <span>View all applications &rarr;</span>
            </Link>
          </div>
        </div>

        {/* ACTIVE JOBS */}
        <div className="admin-card-section">
          <div className="admin-card-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            <span>Active Jobs</span>
          </div>

          {activeJobs.length === 0 ? (
            <p style={{ color: '#6B7280', fontSize: '13.5px', margin: '20px 0' }}>
              No active jobs currently published.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activeJobs.map((job) => (
                <div
                  key={job.id}
                  style={{
                    padding: '14px 16px',
                    background: '#070709',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '13.5px', marginBottom: '4px' }}>
                      {job.title}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#6B7280', fontFamily: "'JetBrains Mono', monospace" }}>
                      {job.department} &bull; Deadline: {job.deadline}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#60A5FA' }}>
                      {job.applications_count}
                    </div>
                    <div style={{ fontSize: '10px', color: '#8A8A8A', textTransform: 'uppercase' }}>
                      Applicants
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: '16px', textAlign: 'right' }}>
            <Link to="/admin/careers/jobs" className="admin-return-link" style={{ margin: 0 }}>
              <span>Manage all jobs &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
