import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AdminLayout from '../../../layouts/AdminLayout';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const STATUS_OPTIONS = [
  'ALL',
  'APPLIED',
  'UNDER_REVIEW',
  'SHORTLISTED',
  'INTERVIEW',
  'SELECTED',
  'REJECTED',
];

export default function AdminApplicationsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [updatingId, setUpdatingId] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  const loadApplications = async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('kwt_candidate_token');
      const params = new URLSearchParams({
        page,
        limit: 15,
      });
      if (activeFilter !== 'ALL') params.append('status', activeFilter);
      if (searchQuery.trim()) params.append('q', searchQuery.trim());

      const res = await fetch(`${API_BASE_URL}/admin/applications?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
        if (data.pagination) setPagination(data.pagination);
      }
    } catch (err) {
      console.error('Error loading applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications(1);
  }, [activeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadApplications(1);
  };

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      const token = localStorage.getItem('kwt_candidate_token');
      const res = await fetch(`${API_BASE_URL}/admin/applications/${appId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setApplications((prev) =>
          prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
        );
        setActionMessage(`Application status updated to ${newStatus}.`);
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDownloadResume = async (app) => {
    try {
      const token = localStorage.getItem('kwt_candidate_token');
      const res = await fetch(`${API_BASE_URL}/admin/applications/${app.id}/resume`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Resume file not available.');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = app.resume_filename || `${app.candidate_name}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message || 'Error downloading resume.');
    }
  };

  return (
    <AdminLayout breadcrumbs={[{ label: 'CAREERS', link: '/admin/careers' }, { label: 'APPLICATIONS' }]}>
      {/* HEADER */}
      <div className="admin-header-row">
        <div className="admin-header-title-wrap">
          <h1>Candidate Applications</h1>
          <p>
            Track candidate pipeline progress, review qualifications, download resumes, and manage interview workflows.
          </p>
        </div>
      </div>

      {actionMessage && (
        <div style={{
          padding: '12px 16px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '6px',
          color: '#34D399',
          fontSize: '13px',
          marginBottom: '20px',
        }}>
          {actionMessage}
        </div>
      )}

      {/* TOOLBAR */}
      <div className="admin-toolbar-card">
        <form onSubmit={handleSearchSubmit} className="admin-search-input-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search candidate name, email, job title, skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className="admin-filter-tabs">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              type="button"
              className={`admin-tab-btn ${activeFilter === status ? 'active' : ''}`}
              onClick={() => setActiveFilter(status)}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* APPLICATIONS TABLE */}
      <div className="admin-table-container">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#8A8A8A' }}>
            Loading applications...
          </div>
        ) : applications.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#8A8A8A' }}>
            No candidate applications found for the selected criteria.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Target Job Position</th>
                <th>Applied Date</th>
                <th>Experience / Skills</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{app.candidate_name}</div>
                    <div style={{ fontSize: '12px', color: '#8A8A8A' }}>{app.candidate_email}</div>
                    {app.candidate_phone && (
                      <div style={{ fontSize: '11px', color: '#6B7280', fontFamily: "'JetBrains Mono', monospace" }}>
                        {app.candidate_phone}
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 500, color: '#FFFFFF' }}>{app.job_title}</div>
                    <span style={{ fontSize: '11px', color: '#6B7280' }}>
                      {app.job_department || 'Engineering'}
                    </span>
                  </td>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11.5px', color: '#9CA3AF' }}>
                    {new Date(app.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <div style={{ fontSize: '12.5px', color: '#D1D5DB' }}>
                      {app.candidate_experience ? `${app.candidate_experience} Exp` : 'Applicant'}
                    </div>
                    {app.candidate_skills && (
                      <div style={{
                        fontSize: '11px',
                        color: '#60A5FA',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '180px',
                      }}>
                        {app.candidate_skills}
                      </div>
                    )}
                  </td>
                  <td>
                    <select
                      className="admin-form-select"
                      style={{
                        padding: '4px 8px',
                        fontSize: '11px',
                        fontFamily: "'JetBrains Mono', monospace",
                        width: 'auto',
                      }}
                      value={app.status}
                      disabled={updatingId === app.id}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    >
                      <option value="APPLIED">APPLIED</option>
                      <option value="UNDER_REVIEW">UNDER REVIEW</option>
                      <option value="SHORTLISTED">SHORTLISTED</option>
                      <option value="INTERVIEW">INTERVIEW</option>
                      <option value="SELECTED">SELECTED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                      <Link
                        to={`/admin/careers/applications/${app.id}`}
                        className="btn-kwt-secondary"
                        style={{ padding: '5px 10px', fontSize: '11px' }}
                      >
                        Details
                      </Link>

                      {app.resume_storage_path && (
                        <button
                          type="button"
                          className="btn-kwt-secondary"
                          style={{ padding: '5px 10px', fontSize: '11px' }}
                          onClick={() => handleDownloadResume(app)}
                          title="Secure resume download"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                          <span>Resume</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINATION */}
      {pagination.totalPages > 1 && (
        <div className="admin-pagination-bar">
          <div>
            Showing {applications.length} of {pagination.total} applications
          </div>
          <div className="admin-pagination-controls">
            <button
              type="button"
              className="admin-page-btn"
              disabled={pagination.page <= 1}
              onClick={() => loadApplications(pagination.page - 1)}
            >
              Previous
            </button>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11.5px', color: '#FFFFFF', padding: '0 8px' }}>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              type="button"
              className="admin-page-btn"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => loadApplications(pagination.page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
