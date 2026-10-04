import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ACTION_FILTERS = [
  'ALL',
  'USER_LOGIN',
  'ADMIN_LOGIN',
  'USER_SIGNUP',
  'GOOGLE_LOGIN',
  'PROFILE_UPDATED',
  'RESUME_UPLOADED',
  'RESUME_DOWNLOADED',
  'APPLICATION_CREATED',
  'APPLICATION_VIEWED',
  'ADMIN_VIEWED_APPLICATION',
  'ADMIN_DOWNLOADED_RESUME',
  'ADMIN_CHANGED_APPLICATION_STATUS',
  'PASSWORD_RESET_REQUESTED',
];

function formatAction(action = '') {
  return action.replaceAll('_', ' ');
}

function formatMetadata(metadata = {}) {
  const entries = Object.entries(metadata || {});
  if (entries.length === 0) return 'No metadata';
  return entries
    .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : String(value)}`)
    .join(' | ');
}

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState('ALL');
  const [query, setQuery] = useState('');
  const [actor, setActor] = useState('');
  const [entity, setEntity] = useState('');

  const loadLogs = async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('kwt_candidate_token');
      const params = new URLSearchParams({ page, limit: 25 });
      if (action !== 'ALL') params.set('action', action);
      if (query.trim()) params.set('q', query.trim());
      if (actor.trim()) params.set('actor', actor.trim());
      if (entity.trim()) params.set('entity', entity.trim());

      const res = await fetch(`${API_BASE_URL}/admin/audit-logs?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setLogs(data.audit_logs || []);
        setPagination(data.pagination || { page, limit: 25, total: 0, totalPages: 1 });
      }
    } catch (err) {
      console.error('Error loading audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs(1);
  }, [action]);

  const handleSubmit = (e) => {
    e.preventDefault();
    loadLogs(1);
  };

  return (
    <AdminLayout breadcrumbs={[{ label: 'AUDIT LOGS' }]}>
      <div className="admin-header-row">
        <div className="admin-header-title-wrap">
          <h1>Audit Logs</h1>
          <p>
            Review authentication, resume access, profile updates, and administrator actions in newest-first order.
          </p>
        </div>
      </div>

      <form className="admin-toolbar-card" onSubmit={handleSubmit}>
        <div className="admin-search-input-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search action, actor, entity, metadata..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <input
          type="text"
          className="admin-form-input"
          placeholder="Actor email or ID"
          value={actor}
          onChange={(e) => setActor(e.target.value)}
          style={{ maxWidth: '220px' }}
        />

        <input
          type="text"
          className="admin-form-input"
          placeholder="Entity type or ID"
          value={entity}
          onChange={(e) => setEntity(e.target.value)}
          style={{ maxWidth: '220px' }}
        />

        <select
          className="admin-form-select"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          style={{ maxWidth: '260px' }}
        >
          {ACTION_FILTERS.map((item) => (
            <option key={item} value={item}>
              {formatAction(item)}
            </option>
          ))}
        </select>

        <button type="submit" className="btn-kwt-primary">
          Apply
        </button>
      </form>

      <div className="admin-table-container">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#8A8A8A' }}>
            Loading audit logs...
          </div>
        ) : logs.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#8A8A8A' }}>
            No audit records found for the selected criteria.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Metadata</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11.5px', color: '#9CA3AF' }}>
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#FFFFFF' }}>
                      {log.actor_email || 'System'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6B7280', fontFamily: "'JetBrains Mono', monospace" }}>
                      {log.actor_role || 'UNKNOWN'}
                    </div>
                  </td>
                  <td>
                    <span className="status-pill applied">{formatAction(log.action)}</span>
                  </td>
                  <td>
                    <div style={{ color: '#FFFFFF', fontWeight: 500 }}>{log.entity_type || '-'}</div>
                    <div style={{ color: '#8A8A8A', fontSize: '12px', fontFamily: "'JetBrains Mono', monospace" }}>
                      {log.entity_id || '-'}
                    </div>
                  </td>
                  <td style={{ maxWidth: '420px', color: '#D1D5DB', fontSize: '12px' }}>
                    {formatMetadata(log.metadata)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="admin-pagination-bar">
          <div>
            Showing {logs.length} of {pagination.total} audit records
          </div>
          <div className="admin-pagination-controls">
            <button
              type="button"
              className="admin-page-btn"
              disabled={pagination.page <= 1}
              onClick={() => loadLogs(pagination.page - 1)}
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
              onClick={() => loadLogs(pagination.page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
