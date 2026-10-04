import React from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';

const adminAreas = [
  {
    title: 'Promotions & Offers',
    description: 'Manage homepage banners, popup posters, schedules, and campaign placement.',
    path: '/admin/promotions',
    action: 'Open Promotions',
    accent: '#FBBF24',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 11l18-5v12L3 14v-3z" />
        <path d="M11.6 16.8a3 3 0 0 1-5.8-1.6" />
      </svg>
    ),
  },
  {
    title: 'Careers & Talent',
    description: 'Manage jobs, applications, candidates, training programs, and testimonials.',
    path: '/admin/careers',
    action: 'Open Careers',
    accent: '#60A5FA',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    title: 'Audit Logs',
    description: 'Review authentication events, resume access, application changes, and admin activity.',
    path: '/admin/audit-logs',
    action: 'Open Audit Logs',
    accent: '#34D399',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
];

export default function AdminPortal() {
  return (
    <AdminLayout breadcrumbs={[{ label: 'HOME' }]}>
      <div className="admin-header-row">
        <div className="admin-header-title-wrap">
          <h1>Admin Portal</h1>
          <p>
            Choose the management area you need. Promotions and Careers now share one admin navigation shell.
          </p>
        </div>
      </div>

      <section className="admin-portal-grid" aria-label="Admin management areas">
        {adminAreas.map((area) => (
          <Link
            key={area.path}
            to={area.path}
            className="admin-portal-card"
            style={{ '--admin-area-accent': area.accent }}
          >
            <span className="admin-portal-card-icon">{area.icon}</span>
            <span className="admin-portal-card-copy">
              <span className="admin-portal-card-title">{area.title}</span>
              <span className="admin-portal-card-desc">{area.description}</span>
            </span>
            <span className="admin-portal-card-action">{area.action}</span>
          </Link>
        ))}
      </section>
    </AdminLayout>
  );
}
