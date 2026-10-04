import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useApplications } from '../../../context/ApplicationContext';
import '../../../styles/careerAuth.css';

const STATUS_STEPS = ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED'];

export default function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { getApplication, downloadApplicationResume } = useApplications();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/careers/login', { replace: true, state: { from: `/careers/applications/${id}` } });
    }
  }, [authLoading, isAuthenticated, navigate, id]);

  useEffect(() => {
    async function loadApp() {
      if (!id || !isAuthenticated) return;
      try {
        const data = await getApplication(id);
        setApplication(data);
      } catch (err) {
        setError(err.message || 'Application not found or unauthorized.');
      } finally {
        setLoading(false);
      }
    }

    loadApp();
  }, [id, isAuthenticated, getApplication]);

  const handleDownloadResume = async () => {
    if (!application) return;
    setDownloading(true);
    try {
      await downloadApplicationResume(application.id, application.resume_filename || 'application_resume.pdf');
    } catch (err) {
      alert('Could not download resume. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="candidate-dash-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'monospace', color: '#8A8A8A' }}>LOADING APPLICATION DETAILS...</div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="candidate-dash-page">
        <div className="candidate-dash-container" style={{ maxWidth: '800px', textAlign: 'center', padding: '60px 20px' }}>
          <h2 style={{ color: '#F87171' }}>Unable to load application</h2>
          <p style={{ color: '#8A8A8A', margin: '12px 0 24px' }}>{error || 'Application does not exist or you do not have permission to view it.'}</p>
          <Link to="/careers/dashboard" className="btn-career-primary">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const currentStepIdx = STATUS_STEPS.indexOf(application.status);
  const isRejected = application.status === 'REJECTED';

  return (
    <div className="candidate-dash-page">
      <div className="candidate-dash-container" style={{ maxWidth: '960px' }}>
        <header className="dash-header-row">
          <div className="dash-header-title">
            <div className="career-auth-eyebrow">
              <Link to="/careers/dashboard" style={{ color: '#8A8A8A', textDecoration: 'none' }}>
                DASHBOARD
              </Link>{' '}
              / APPLICATION DETAILS
            </div>
            <h1>{application.job_title}</h1>
            <p>
              Reference: <code style={{ color: '#60A5FA' }}>{application.id}</code> • Applied on{' '}
              {new Date(application.applied_at).toLocaleDateString()}
            </p>
          </div>

          <Link to="/careers/dashboard" className="btn-career-secondary">
            ← Back to Dashboard
          </Link>
        </header>

        {/* STATUS PIPELINE PROGRESSION */}
        <section style={{
          background: '#0B0B0D',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '28px',
          marginBottom: '28px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#8A8A8A', textTransform: 'uppercase' }}>
              Current Pipeline Status
            </span>
            <span className={`app-status-badge ${application.status}`}>
              {application.status.replace('_', ' ')}
            </span>
          </div>

          {/* Stepper Pipeline */}
          {!isRejected ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', textAlign: 'center' }}>
              {STATUS_STEPS.map((step, idx) => {
                const isPassed = currentStepIdx >= idx;
                const isCurrent = currentStepIdx === idx;
                return (
                  <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '100%',
                      height: '4px',
                      background: isPassed ? '#10B981' : 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '2px',
                    }} />
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '10px',
                      color: isCurrent ? '#10B981' : isPassed ? '#FFFFFF' : '#6B7280',
                      fontWeight: isCurrent ? 700 : 500,
                    }}>
                      {step.replace('_', ' ')}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{
              padding: '16px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '6px',
              color: '#F87171',
              fontSize: '13.5px',
            }}>
              Thank you for applying. After reviewing your submission against current squad priorities, we have decided not to move forward with this position at this time. We will keep your candidate profile on file for upcoming cohorts.
            </div>
          )}
        </section>

        {/* APPLICATION INFORMATION GRID */}
        <section style={{
          background: '#0B0B0D',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '32px',
        }}>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: '18px', color: '#FFFFFF', margin: '0 0 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px' }}>
            Application Submission Record
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
            <div>
              <span style={{ display: 'block', fontSize: '11px', fontFamily: 'monospace', color: '#8A8A8A', textTransform: 'uppercase', marginBottom: '4px' }}>
                Department
              </span>
              <span style={{ fontSize: '14px', color: '#FFFFFF', fontWeight: 600 }}>
                {application.department}
              </span>
            </div>

            <div>
              <span style={{ display: 'block', fontSize: '11px', fontFamily: 'monospace', color: '#8A8A8A', textTransform: 'uppercase', marginBottom: '4px' }}>
                Candidate Name
              </span>
              <span style={{ fontSize: '14px', color: '#FFFFFF' }}>
                {application.candidate_name}
              </span>
            </div>

            <div>
              <span style={{ display: 'block', fontSize: '11px', fontFamily: 'monospace', color: '#8A8A8A', textTransform: 'uppercase', marginBottom: '4px' }}>
                Contact Email
              </span>
              <span style={{ fontSize: '14px', color: '#FFFFFF' }}>
                {application.candidate_email}
              </span>
            </div>

            <div>
              <span style={{ display: 'block', fontSize: '11px', fontFamily: 'monospace', color: '#8A8A8A', textTransform: 'uppercase', marginBottom: '4px' }}>
                Contact Phone
              </span>
              <span style={{ fontSize: '14px', color: '#FFFFFF' }}>
                {application.candidate_phone}
              </span>
            </div>
          </div>

          {/* Resume Used for This Application */}
          <div style={{
            background: '#111217',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '6px',
            padding: '20px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}>
            <div>
              <span style={{ display: 'block', fontSize: '11px', fontFamily: 'monospace', color: '#8A8A8A', textTransform: 'uppercase', marginBottom: '4px' }}>
                Historical Resume Snapshot Used
              </span>
              <span style={{ fontSize: '14px', color: '#FFFFFF', fontWeight: 600 }}>
                📄 {application.resume_filename || 'Attached Resume'}
              </span>
              <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
                Preserved specifically for this submission record
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadResume}
              disabled={downloading}
              className="btn-career-primary"
              style={{ padding: '8px 16px', fontSize: '12px' }}
            >
              <span>{downloading ? 'DOWNLOADING...' : 'Download Resume File'}</span>
            </button>
          </div>

          {/* Cover Message */}
          {application.cover_message && (
            <div style={{ marginBottom: '20px' }}>
              <span style={{ display: 'block', fontSize: '11px', fontFamily: 'monospace', color: '#8A8A8A', textTransform: 'uppercase', marginBottom: '8px' }}>
                Cover Message / Candidate Notes
              </span>
              <div style={{
                background: '#111217',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '6px',
                padding: '16px',
                fontSize: '13.5px',
                color: '#D1D5DB',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
              }}>
                {application.cover_message}
              </div>
            </div>
          )}

          {/* Candidate Links */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
            {application.github && (
              <a
                href={application.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '12px', color: '#60A5FA', textDecoration: 'none' }}
              >
                GitHub Profile ↗
              </a>
            )}
            {application.linkedin && (
              <a
                href={application.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '12px', color: '#60A5FA', textDecoration: 'none' }}
              >
                LinkedIn Profile ↗
              </a>
            )}
            {application.portfolio && (
              <a
                href={application.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '12px', color: '#60A5FA', textDecoration: 'none' }}
              >
                Portfolio Website ↗
              </a>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
