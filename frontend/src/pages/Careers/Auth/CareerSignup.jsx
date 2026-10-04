import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import CloudWatchFace from './components/CloudWatchFace';
import '../../../styles/careerAuth.css';

export default function CareerSignup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup, loginWithGoogle, isAuthenticated } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from || '/careers/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your password entry.');
      return;
    }

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      await signup(fullName, email, password, confirmPassword);
      const from = location.state?.from || '/careers/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    if (!document.getElementById('google-gsi-script')) {
      const script = document.createElement('script');
      script.id = 'google-gsi-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google?.accounts?.id) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response) => {
              if (response.credential) {
                setLoading(true);
                try {
                  await loginWithGoogle({ credential: response.credential });
                  const from = location.state?.from || '/careers/dashboard';
                  navigate(from, { replace: true });
                } catch (err) {
                  setError(err.message || 'Google registration failed.');
                } finally {
                  setLoading(false);
                }
              }
            },
          });
        }
      };
      document.body.appendChild(script);
    }
  }, [loginWithGoogle, location.state, navigate]);

  const handleGoogleAuth = async () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (clientId && window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
      return;
    }

    if (!clientId) {
      setError('Google Sign-In is not configured yet. Please sign up with your email and password.');
      return;
    }

    setError('Google Sign-In is still loading. Please try again in a moment.');
  };

  return (
    <div className="career-auth-page">
      <div className="career-auth-card horizontal-layout">
        {/* Left Pane: Cloud Watch Mascot & Editorial */}
        <div className="career-auth-hero-pane">
          <CloudWatchFace isTyping={isTyping} />

          <div className="career-auth-hero-content">
            <div className="career-auth-eyebrow">CAREER PORTAL REGISTRATION</div>
            <h1 className="career-auth-title">CREATE YOUR KODEWAR PROFILE</h1>
            <p className="career-auth-desc">
              Register to build a verified candidate profile, store your technical credentials, and apply directly to studio squads.
            </p>
          </div>
        </div>

        {/* Right Pane: Direct Registration Form */}
        <div className="career-auth-form-pane">
          {error && <div className="auth-error-banner">{error}</div>}

          {/* Continue with Google */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="btn-google-auth"
            disabled={loading}
          >
            <svg viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="auth-divider">
            <span>OR WITH EMAIL</span>
          </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label className="auth-form-label" htmlFor="signup-name">
              Full Name *
            </label>
            <input
              id="signup-name"
              type="text"
              required
              className="auth-form-input"
              placeholder="e.g. Alex Morgan"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-form-label" htmlFor="signup-email">
              Email Address *
            </label>
            <input
              id="signup-email"
              type="email"
              required
              className="auth-form-input"
              placeholder="alex@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-form-label" htmlFor="signup-password">
              Password (Min 8 Characters) *
            </label>
            <div className="auth-input-wrapper">
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                required
                className="auth-form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="auth-form-group">
            <label className="auth-form-label" htmlFor="signup-confirm-password">
              Confirm Password *
            </label>
            <div className="auth-input-wrapper">
              <input
                id="signup-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                className="auth-form-input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-career-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
            disabled={loading}
          >
            <span>{loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}</span>
          </button>
        </form>

        <div className="auth-footer-links" style={{ justifyContent: 'center', marginTop: '20px' }}>
          <span>Already have an account?</span>
          <Link to="/careers/login">Log in</Link>
        </div>
      </div>
    </div>
  </div>
);
}
