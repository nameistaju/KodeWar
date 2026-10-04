import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../../layouts/AdminLayout';
import AdminConfirmModal from '../../../components/admin/AdminConfirmModal';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminJobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, job: null, action: null });
  const [actionMessage, setActionMessage] = useState('');

  const loadJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('kwt_candidate_token');
      const res = await fetch(`${API_BASE_URL}/admin/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error('Error fetching admin jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleTogglePublish = async (job) => {
    const nextStatus = job.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const token = localStorage.getItem('kwt_candidate_token');
      const res = await fetch(`${API_BASE_URL}/admin/jobs/${job.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setJobs((prev) =>
          prev.map((j) => (j.id === job.id ? { ...j, status: nextStatus } : j))
        );
        setActionMessage(`Job successfully marked as ${nextStatus}.`);
        setTimeout(() => setActionMessage(''), 3500);
      }
    } catch (err) {
      console.error('Error toggling publish status:', err);
    }
  };

  const handleCloseJob = async (job) => {
    try {
      const token = localStorage.getItem('kwt_candidate_token');
      const res = await fetch(`${API_BASE_URL}/admin/jobs/${job.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'CLOSED' }),
      });
      if (res.ok) {
        setJobs((prev) =>
          prev.map((j) => (j.id === job.id ? { ...j, status: 'CLOSED' } : j))
        );
        setActionMessage('Position closed.');
        setTimeout(() => setActionMessage(''), 3500);
      }
    } catch (err) {
      console.error('Error closing job:', err);
    }
  };

  const confirmDeleteOrArchive = (job) => {
    const hasApps = (job.applications_count || 0) > 0;
    setConfirmModal({
      isOpen: true,
      job,
      action: hasApps ? 'ARCHIVE' : 'DELETE',
    });
  };

  const executeDeleteOrArchive = async () => {
    const { job } = confirmModal;
    if (!job) return;

    try {
      const token = localStorage.getItem('kwt_candidate_token');
      const res = await fetch(`${API_BASE_URL}/admin/jobs/${job.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        if (data.action === 'ARCHIVED') {
          setJobs((prev) =>
            prev.map((j) => (j.id === job.id ? { ...j, status: 'ARCHIVED' } : j))
          );
          setActionMessage('Job archived to preserve application history.');
        } else {
          setJobs((prev) => prev.filter((j) => j.id !== job.id));
          setActionMessage('Job deleted.');
        }
        setTimeout(() => setActionMessage(''), 3500);
      }
    } catch (err) {
      console.error('Error deleting/archiving job:', err);
    } finally {
      setConfirmModal({ isOpen: false, job: null, action: null });
    }
  };

  const filteredJobs = jobs.filter((job) => {
    if (activeTab !== 'ALL' && job.status !== activeTab) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        job.title?.toLowerCase().includes(q) ||
        job.department?.toLowerCase().includes(q) ||
        job.location?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <AdminLayout breadcrumbs={[{ label: 'CAREERS', link: '/admin/careers' }, { label: 'JOBS' }]}>
      {/* HEADER */}
      <div className="admin-header-row">
        <div className="admin-header-title-wrap">
          <h1>Job Positions Management</h1>
          <p>
            Create, publish, edit, and archive roles across engineering, design, marketing, and internships.
          </p>
        </div>

        <div className="admin-header-actions">
          <Link to="/admin/careers/jobs/new" className="btn-kwt-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Create New Job</span>
          </Link>
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

      {/* TOOLBAR: SEARCH + STATUS TABS */}
      <div className="admin-toolbar-card">
        <div className="admin-search-input-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search by title, department, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="admin-filter-tabs">
          {['ALL', 'PUBLISHED', 'DRAFT', 'CLOSED', 'ARCHIVED'].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`admin-tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* JOBS TABLE */}
      <div className="admin-table-container">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#8A8A8A' }}>
            Loading job listings...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#8A8A8A' }}>
            No jobs match the specified criteria.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Department</th>
                <th>Location / Mode</th>
                <th>Type</th>
                <th>Experience</th>
                <th>Applications</th>
                <th>Status</th>
                <th>Deadline</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job) => (
                <tr key={job.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{job.title}</div>
                    {job.featured && (
                      <span style={{
                        fontSize: '9.5px',
                        fontFamily: "'JetBrains Mono', monospace",
                        color: '#F59E0B',
                        textTransform: 'uppercase',
                      }}>
                        ★ Featured
                      </span>
                    )}
                  </td>
                  <td>{job.department}</td>
                  <td>
                    <div>{job.location}</div>
                    <span style={{ fontSize: '11px', color: '#6B7280' }}>{job.workplace_type}</span>
                  </td>
                  <td>{job.employment_type}</td>
                  <td>{job.experience_level}</td>
                  <td>
                    <Link
                      to={`/admin/careers/applications?q=${encodeURIComponent(job.title)}`}
                      style={{ color: '#60A5FA', textDecoration: 'none', fontWeight: 600 }}
                    >
                      {job.applications_count || 0}
                    </Link>
                  </td>
                  <td>
                    <span className={`status-pill ${job.status.toLowerCase()}`}>
                      {job.status}
                    </span>
                  </td>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}>
                    {job.deadline || 'Ongoing'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                      <Link
                        to={`/admin/careers/jobs/${job.id}/edit`}
                        className="btn-kwt-secondary"
                        style={{ padding: '5px 10px', fontSize: '11px' }}
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        className="btn-kwt-secondary"
                        style={{ padding: '5px 10px', fontSize: '11px' }}
                        onClick={() => handleTogglePublish(job)}
                        title={job.status === 'PUBLISHED' ? 'Unpublish to draft' : 'Publish publicly'}
                      >
                        {job.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                      </button>

                      {job.status !== 'CLOSED' && job.status !== 'ARCHIVED' && (
                        <button
                          type="button"
                          className="btn-kwt-secondary"
                          style={{ padding: '5px 10px', fontSize: '11px' }}
                          onClick={() => handleCloseJob(job)}
                        >
                          Close
                        </button>
                      )}

                      <button
                        type="button"
                        className="btn-kwt-danger"
                        style={{ padding: '5px 8px' }}
                        onClick={() => confirmDeleteOrArchive(job)}
                        title="Delete or Archive"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* CONFIRMATION MODAL (Section 21) */}
      <AdminConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.action === 'ARCHIVE' ? 'Archive This Job?' : 'Delete Job Listing?'}
        message={
          confirmModal.action === 'ARCHIVE'
            ? `This job "${confirmModal.job?.title}" has ${confirmModal.job?.applications_count} candidate application(s). It will be archived and hidden from public view, and all candidate records will be preserved.`
            : `Are you sure you want to delete the job "${confirmModal.job?.title}"? This cannot be undone.`
        }
        confirmLabel={confirmModal.action === 'ARCHIVE' ? 'Archive Job' : 'Delete Forever'}
        isDanger={true}
        onConfirm={executeDeleteOrArchive}
        onCancel={() => setConfirmModal({ isOpen: false, job: null, action: null })}
      />
    </AdminLayout>
  );
}
