import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const isAdmin = Boolean(
    user && (
      user.role === 'ADMIN' ||
      user.role === 'admin' ||
      user.is_admin ||
      user.isAdmin ||
      user.email === 'admin@kodewar.com'
    )
  );

  const profileDestination = !isAuthenticated
    ? '/careers/login'
    : isAdmin
    ? '/admin'
    : '/careers/dashboard';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isMobileOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen]);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const closeMenu = () => setIsMobileOpen(false);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className={`site-nav ${isScrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="nav-logo" onClick={closeMenu} aria-label="Kodewar Home">
          <img
            src="/whitelogo_notext.png"
            alt="Kodewar Logo"
            width="36"
            height="32"
          />
          <span>KODEWAR</span>
        </Link>

        {/* Public Navigation */}
        <div className="nav-center">
          <div className="nav-links">
            <Link to="/services" className={isActive('/services') ? 'active' : ''}>
              Services
            </Link>
            <Link to="/digital-marketing" className={isActive('/digital-marketing') ? 'active' : ''}>
              Digital Marketing
            </Link>
            <Link to="/work" className={isActive('/work') ? 'active' : ''}>
              Work
            </Link>
            <Link to="/careers" className={isActive('/careers') ? 'active' : ''}>
              Careers
            </Link>
            <Link to="/about" className={isActive('/about') ? 'active' : ''}>
              About
            </Link>
            <Link to="/contact" className={isActive('/contact') ? 'active' : ''}>
              Contact
            </Link>
          </div>
        </div>

        {/* Actions: Separated Employee Portal & Start a Project CTA */}
        <div className="nav-actions">
          <div className="nav-separator"></div>

          <a
            href="https://portal.kodewar.com"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-portal-link"
            title="Employee Management Portal"
          >
            <img src="/employeeportal_logo.png" alt="" className="nav-portal-icon" />
            <span>Employee Portal</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          </a>

          <Link
            to={profileDestination}
            className="nav-cta-btn"
            title={isAuthenticated ? (isAdmin ? 'Admin Portal' : 'Candidate Profile') : 'Login / Profile'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Profile</span>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="nav-mobile-toggle"
          aria-label={isMobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileOpen}
          aria-controls="mobile-nav-drawer"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div
        id="mobile-nav-drawer"
        className={`mobile-nav-overlay ${isMobileOpen ? 'open' : ''}`}
        aria-hidden={!isMobileOpen}
      >
        {/* Mobile Header with Logo & Close X Button */}
        <div className="mobile-nav-header">
          <Link to="/" onClick={closeMenu} className="nav-logo">
            <img src="/whitelogo_notext.png" alt="Kodewar Logo" />
            <span>KODEWAR</span>
          </Link>
          <button
            type="button"
            className="mobile-nav-close-btn"
            onClick={closeMenu}
            aria-label="Close navigation menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mobile-nav-links">
          <Link to="/" onClick={closeMenu} className={isActive('/') ? 'active' : ''}>
            Home
          </Link>
          <Link to="/services" onClick={closeMenu} className={isActive('/services') ? 'active' : ''}>
            Services
          </Link>
          <Link to="/digital-marketing" onClick={closeMenu} className={isActive('/digital-marketing') ? 'active' : ''}>
            Digital Marketing
          </Link>
          <Link to="/work" onClick={closeMenu} className={isActive('/work') ? 'active' : ''}>
            Work
          </Link>
          <Link to="/careers" onClick={closeMenu} className={isActive('/careers') ? 'active' : ''}>
            Careers
          </Link>
          <Link to="/about" onClick={closeMenu} className={isActive('/about') ? 'active' : ''}>
            About
          </Link>
          <Link to="/contact" onClick={closeMenu} className={isActive('/contact') ? 'active' : ''}>
            Contact
          </Link>
        </div>

        <div className="mobile-nav-divider"></div>

        <div className="mobile-nav-actions">
          <a
            href="https://portal.kodewar.com"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-portal-link"
            onClick={closeMenu}
          >
            <img src="/employeeportal_logo.png" alt="" className="nav-portal-icon" />
            <span>Employee Portal</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          </a>

          <Link
            to={profileDestination}
            className="nav-cta-btn"
            onClick={closeMenu}
            title={isAuthenticated ? (isAdmin ? 'Admin Portal' : 'Candidate Profile') : 'Login / Profile'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Profile</span>
          </Link>
        </div>
      </div>
    </>
  );
}
