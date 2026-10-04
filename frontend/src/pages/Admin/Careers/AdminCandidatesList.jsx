import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../../layouts/AdminLayout';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminCandidatesList() {
  const [candidates, setCandidates] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadCandidates = async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('kwt_candidate_token');
      const params = new URLSearchParams({ page, limit: 15 });
      if (searchQuery.trim()) params.append('q', searchQuery.trim());

      const res = await fetch(`${API_BASE_URL}/admin/candidates?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setCandidates(data.candidates || []);
        if (data.pagination) setPagination(data.pagination);
      }
    } catch (err) {
      console.error('Error fetching candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates(1);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadCandidates(1);
  };

  return (
    <AdminLayout breadcrumbs={[{ label: 'CAREERS', link: '/admin/careers' }, { label: 'CANDIDATES' }]}>
      {/* HEADER */}
      <div className="admin-header-row">
        <div className="admin-header-title-wrap">
          <h1>Candidate Talent Pool</h1>
          <p>
            Inspect registered candidate profiles, verified skill stacks, attached resumes, and historical application records.
          </p>
        </div>
      </div>

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
            placeholder="Search candidate name, email, skills, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div style={{ color: '#8A8A8A', fontSize: '13px' }}>
          Total registered candidates: <strong style={{ color: '#FFFFFF' }}>{pagination.total}</strong>
        </div>
      </div>

      {/* TABLE */}
      <div className="admin-table-container">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#8A8A8A' }}>
            Loading candidate pool...
          </div>
        ) : candidates.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#8A8A8A' }}>
            No candidate profiles found.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Candidate Name</th>
                <th>Contact Info</th>
                <th>Location</th>
                <th>Key Skills</th>
                <th>Experience / Role</th>
                <th>Applications</th>
                <th>Joined</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((cand) => (
                <tr key={cand.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{cand.name}</div>
                    {cand.college && (
                      <span style={{ fontSize: '11px', color: '#8A8A8A' }}>{cand.college}</span>
                    )}
                  </td>
                  <td>
                    <div style={{ color: '#D1D5DB' }}>{cand.email}</div>
                    <span style={{ fontSize: '11px', color: '#6B7280', fontFamily: "'JetBrains Mono', monospace" }}>
                      {cand.phone || 'No phone'}
                    </span>
                  </td>
                  <td>{cand.location || 'Not set'}</td>
                  <td>
                    {cand.skills ? (
                      <span style={{
                        color: '#60A5FA',
                        fontSize: '12px',
                        display: 'inline-block',
                        maxWidth: '220px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {cand.skills}
                      </span>
                    ) : (
                      <span style={{ color: '#6B7280', fontSize: '12px' }}>Profile pending</span>
                    )}
                  </td>
                  <td>{cand.experience || 'Applicant'}</td>
                  <td>
                    <span style={{
                      fontWeight: 600,
                      color: cand.applications_count > 0 ? '#60A5FA' : '#9CA3AF',
                    }}>
                      {cand.applications_count}
                    </span>
                  </td>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11.5px', color: '#9CA3AF' }}>
                    {cand.created_at ? new Date(cand.created_at).toLocaleDateString() : '—'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link
                      to={`/admin/careers/candidates/${cand.id}`}
                      className="btn-kwt-secondary"
                      style={{ padding: '5px 12px', fontSize: '11px' }}
                    >
                      Dossier
                    </Link>
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
          <div>Showing {candidates.length} of {pagination.total} candidates</div>
          <div className="admin-pagination-controls">
            <button
              type="button"
              className="admin-page-btn"
              disabled={pagination.page <= 1}
              onClick={() => loadCandidates(pagination.page - 1)}
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
              onClick={() => loadCandidates(pagination.page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
