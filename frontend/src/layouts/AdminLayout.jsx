import React, { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/adminCareers.css';

export default function AdminLayout({ children, breadcrumbs = [] }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/careers/login');
  };

  const isCareerRoute = location.pathname.startsWith('/admin/careers');

  return (
    <div className="admin-layout-wrapper">
      {/* 1. ADMIN SIDEBAR */}
      <aside className={`admin-sidebar ${isMobileOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <Link to="/admin" className="admin-brand-link" onClick={() => setIsMobileOpen(false)}>
            <img src="/whitelogo_notext.png" alt="Kodewar" className="admin-brand-logo" />
            <span className="admin-brand-title">KODEWAR</span>
            <span className="admin-brand-badge">ADMIN</span>
          </Link>
          <Link to="/" className="admin-return-link" target="_blank" rel="noopener noreferrer">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Public Website</span>
          </Link>
        </div>

        <nav className="admin-sidebar-nav">
          <div className="admin-nav-section-title">Admin Home</div>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setIsMobileOpen(false)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 10.5 12 3l9 7.5" />
              <path d="M5 10v10h14V10" />
              <path d="M9 20v-6h6v6" />
            </svg>
            <span>Admin Portal</span>
          </NavLink>

          {/* PROMOTIONS SECTION */}
          <div className="admin-nav-section-title">Commercial</div>
          <NavLink
            to="/admin/promotions"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setIsMobileOpen(false)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Promotions &amp; Offers</span>
          </NavLink>

          {/* CAREERS SECTION */}
          <div className="admin-nav-section-title">Talent &amp; Studio</div>
          <div className={`admin-nav-item admin-nav-group ${isCareerRoute ? 'active' : ''}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            <span>Careers</span>
          </div>

          {/* CAREERS SUBMENU */}
          <div className="admin-nav-submenu">
            <NavLink
              to="/admin/careers"
              end
              className={({ isActive }) => `admin-nav-subitem ${isActive ? 'active' : ''}`}
              onClick={() => setIsMobileOpen(false)}
            >
              <span>Overview</span>
            </NavLink>

            <NavLink
              to="/admin/careers/jobs"
              className={({ isActive }) => `admin-nav-subitem ${isActive ? 'active' : ''}`}
              onClick={() => setIsMobileOpen(false)}
            >
              <span>Jobs</span>
            </NavLink>

            <NavLink
              to="/admin/careers/applications"
              className={({ isActive }) => `admin-nav-subitem ${isActive ? 'active' : ''}`}
              onClick={() => setIsMobileOpen(false)}
            >
              <span>Applications</span>
            </NavLink>

            <NavLink
              to="/admin/careers/candidates"
              className={({ isActive }) => `admin-nav-subitem ${isActive ? 'active' : ''}`}
              onClick={() => setIsMobileOpen(false)}
            >
              <span>Candidates</span>
            </NavLink>

            <NavLink
              to="/admin/careers/training"
              className={({ isActive }) => `admin-nav-subitem ${isActive ? 'active' : ''}`}
              onClick={() => setIsMobileOpen(false)}
            >
              <span>Training</span>
            </NavLink>

            <NavLink
              to="/admin/careers/testimonials"
              className={({ isActive }) => `admin-nav-subitem ${isActive ? 'active' : ''}`}
              onClick={() => setIsMobileOpen(false)}
            >
              <span>Testimonials</span>
            </NavLink>
          </div>

          <div className="admin-nav-section-title">Security</div>
          <NavLink
            to="/admin/audit-logs"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setIsMobileOpen(false)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <span>Audit Logs</span>
          </NavLink>
        </nav>

        {/* SIDEBAR FOOTER */}
        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="admin-user-meta">
              <span className="admin-user-name">{user?.name || 'KODEWAR Admin'}</span>
              <span className="admin-user-role">{user?.email || 'admin@kodewar.com'}</span>
            </div>
          </div>

          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleLogout}
            title="Log out of Admin"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </aside>

      {/* 2. MAIN VIEWPORT */}
      <div className="admin-main-viewport">
        {/* TOPBAR */}
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              type="button"
              className="admin-mobile-toggle"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label="Toggle Navigation"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <nav className="admin-breadcrumbs" aria-label="Breadcrumb">
              <Link to="/">KODEWAR</Link>
              <span className="sep">/</span>
              <span>ADMIN</span>
              {breadcrumbs.map((b, i) => (
                <React.Fragment key={i}>
                  <span className="sep">/</span>
                  {b.link ? (
                    <Link to={b.link}>{b.label}</Link>
                  ) : (
                    <span className="current">{b.label}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>

          <div className="admin-topbar-actions">
            <div className="admin-live-pill">
              <span className="admin-live-dot" />
              <span>LIVE API</span>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="admin-page-body">
          {children}
        </main>
      </div>
    </div>
  );
}
