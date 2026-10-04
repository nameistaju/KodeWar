import React, { useEffect } from 'react';

export default function EmployeePage() {
  useEffect(() => {
    // Open or redirect to external employee portal
    window.location.href = 'https://portal.kodewar.com';
  }, []);

  return (
    <section className="placeholder-section">
      <div className="placeholder-inner">
        <div className="eyebrow" style={{ marginBottom: '24px' }}>
          EMPLOYEE ACCESS
        </div>

        <div className="placeholder-badge">
          <img src="/employeeportal_logo.png" alt="" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
          <span>Employee Portal</span>
        </div>

        <h1 className="placeholder-title">Redirecting to Employee Portal...</h1>
        <p className="placeholder-desc">
          You are being redirected to the secure Kodewar Technologies Employee Management Portal.
        </p>

        <div className="placeholder-actions" style={{ marginTop: '32px' }}>
          <a
            href="https://portal.kodewar.com"
            className="btn-primary"
          >
            Click here if not redirected
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
