import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../../styles/careerAuth.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function CareerForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit password reset request.');
      }

      setSent(true);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="career-auth-page">
      <div className="career-auth-card">
        <div className="career-auth-eyebrow">ACCOUNT RECOVERY</div>
        <h1 className="career-auth-title">RESET PASSWORD</h1>
        <p className="career-auth-desc">
          Enter the email address registered with your KODEWAR candidate account.
        </p>

        {error && (
          <div className="career-auth-error" style={{ marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {sent ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ color: '#10B981', fontFamily: 'monospace', fontSize: '12px', marginBottom: '12px' }}>
              [ INSTRUCTIONS TRANSMITTED ]
            </div>
            <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
              If an account exists for <strong>{email}</strong>, password reset instructions have been issued. Please check your inbox.
            </p>
            <Link to="/careers/login" className="btn-career-primary" style={{ display: 'inline-flex' }}>
              RETURN TO LOGIN
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <label className="auth-form-label" htmlFor="reset-email">
                Email Address
              </label>
              <input
                id="reset-email"
                type="email"
                required
                className="auth-form-input"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn-career-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
              disabled={loading}
            >
              <span>{loading ? 'PROCESSING...' : 'SEND RESET INSTRUCTIONS'}</span>
            </button>
          </form>
        )}

        <div className="career-auth-footer">
          Remembered your credentials?{' '}
          <Link to="/careers/login" className="auth-link">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
