import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useApplications } from '../../../context/ApplicationContext';
import '../../../styles/careerAuth.css';

export default function CandidateDashboard() {
  const navigate = useNavigate();
  const { user, profile, logout, isAuthenticated, loading: authLoading } = useAuth();
  const { applications, fetchApplications, calculateProfileCompletion, loading: appsLoading } = useApplications();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/careers/login', { replace: true, state: { from: '/careers/dashboard' } });
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchApplications();
    }
  }, [isAuthenticated, fetchApplications]);

  if (authLoading || (!user && isAuthenticated)) {
    return (
      <div className="candidate-dash-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'monospace', color: '#8A8A8A' }}>LOADING CANDIDATE PROFILE...</div>
      </div>
    );
  }

  const completionScore = calculateProfileCompletion(profile);
  const totalApps = applications.length;
  const activeApps = applications.filter(
    (a) => a.status !== 'REJECTED' && a.status !== 'SELECTED'
  ).length;

  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'admin' || user.email === 'admin@kodewar.com');

  return (
    <div className="candidate-dash-page">
      <div className="candidate-dash-container">
        {/* Admin Quick Action Banner */}
        {isAdmin && (
          <div style={{
            background: 'linear-gradient(90deg, rgba(255, 214, 0, 0.12) 0%, rgba(255, 255, 255, 0.04) 100%)',
            border: '1px solid rgba(255, 214, 0, 0.35)',
            borderRadius: '14px',
            padding: '16px 24px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#FFD600', letterSpacing: '0.15em', fontWeight: 700 }}>
                ADMINISTRATOR SESSION ACTIVE
              </div>
              <div style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '15px', marginTop: '2px' }}>
                Manage Commercial Promotions, Job Postings &amp; Candidate Applications
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link
                to="/admin/promotions"
                className="btn-career-primary"
                style={{ backgroundColor: '#FFD600', color: '#000000', fontWeight: 700 }}
              >
                Promotions Admin →
              </Link>
              <Link
                to="/admin/careers"
                className="btn-career-secondary"
                style={{ borderColor: 'rgba(255, 214, 0, 0.5)', color: '#FFD600' }}
              >
                Careers Admin →
              </Link>
            </div>
          </div>
        )}

        {/* Header Row */}
        <header className="dash-header-row">
          <div className="dash-header-title">
            <div className="career-auth-eyebrow">CANDIDATE TALENT PORTAL</div>
            <h1>Hello, {profile?.full_name || user?.email?.split('@')[0] || 'Candidate'}</h1>
            <p>Track your submitted applications, technical assessments, and studio apprentice status.</p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            {isAdmin && (
              <Link
                to="/admin"
                className="btn-career-primary"
                style={{ backgroundColor: '#FFD600', color: '#000000', fontWeight: 700 }}
              >
                Admin Portal
              </Link>
            )}
            <Link to="/careers/profile" className="btn-career-secondary">
              Edit Profile
            </Link>
            <Link to="/careers#open-roles" className="btn-career-primary">
              Browse Open Roles
            </Link>
            <button
              type="button"
              onClick={logout}
              className="btn-career-secondary"
              style={{ color: '#F87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Overview Metric Cards */}
        <section className="dash-metrics-grid">
          {/* Profile Completion */}
          <div className="dash-metric-card">
            <span className="dash-metric-label">Profile Completion</span>
            <div className="dash-metric-val">{completionScore}%</div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${completionScore}%` }} />
            </div>
            <span style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>
              {completionScore < 100 ? (
                <Link to="/careers/profile" style={{ color: '#60A5FA', textDecoration: 'none' }}>
                  Complete remaining fields →
                </Link>
              ) : (
                'Profile 100% complete'
              )}
            </span>
          </div>

          {/* Total Applications */}
          <div className="dash-metric-card">
            <span className="dash-metric-label">Total Applications</span>
            <div className="dash-metric-val">{totalApps}</div>
            <span style={{ fontSize: '12px', color: '#6B7280' }}>Positions applied at KODEWAR</span>
          </div>

          {/* Active Pipeline */}
          <div className="dash-metric-card">
            <span className="dash-metric-label">Active Applications</span>
            <div className="dash-metric-val" style={{ color: activeApps > 0 ? '#10B981' : '#FFFFFF' }}>
              {activeApps}
            </div>
            <span style={{ fontSize: '12px', color: '#6B7280' }}>Currently in review / interview</span>
          </div>

          {/* Resume on File */}
          <div className="dash-metric-card">
            <span className="dash-metric-label">Primary Resume</span>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF', wordBreak: 'break-all' }}>
              {profile?.resume_filename || 'No resume uploaded'}
            </div>
            <span style={{ fontSize: '11px', color: '#6B7280', marginTop: 'auto' }}>
              <Link to="/careers/profile" style={{ color: '#60A5FA', textDecoration: 'none' }}>
                {profile?.resume_filename ? 'Manage or replace resume →' : 'Upload resume document →'}
              </Link>
            </span>
          </div>
        </section>

        {/* Applications List Section */}
        <section style={{ marginTop: '48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: '20px', color: '#FFFFFF', margin: 0 }}>
              Submitted Applications
            </h2>
            <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#8A8A8A' }}>
              {applications.length} TOTAL
            </span>
          </div>

          {appsLoading ? (
            <div style={{ padding: '36px', textAlign: 'center', color: '#8A8A8A', fontFamily: 'monospace' }}>
              REFRESHING SUBMISSIONS...
            </div>
          ) : applications.length === 0 ? (
            <div style={{
              background: '#0B0B0D',
              border: '1px dashed rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              padding: '48px 24px',
              textAlign: 'center',
            }}>
              <h3 style={{ fontSize: '18px', color: '#FFFFFF', margin: '0 0 8px' }}>No active applications</h3>
              <p style={{ color: '#8A8A8A', fontSize: '14px', maxWidth: '440px', margin: '0 auto 20px' }}>
                You have not submitted any job or apprenticeship applications yet. Explore our open squad roles to get started.
              </p>
              <Link to="/careers#open-roles" className="btn-career-primary" style={{ display: 'inline-flex' }}>
                Explore Open Positions
              </Link>
            </div>
          ) : (
            <div>
              {applications.map((app) => (
                <div key={app.id} className="dash-app-card">
                  <div className="dash-app-main">
                    <h3>{app.job_title}</h3>
                    <div className="dash-app-meta">
                      <span>🏷️ {app.department}</span>
                      <span>•</span>
                      <span>📅 Applied {new Date(app.applied_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>📄 {app.resume_filename || 'Attached Resume'}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span className={`app-status-badge ${app.status}`}>
                      {app.status.replace('_', ' ')}
                    </span>

                    <Link
                      to={`/careers/applications/${app.id}`}
                      className="btn-career-secondary"
                      style={{ padding: '8px 16px', fontSize: '12px' }}
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
