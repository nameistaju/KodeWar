import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import AdminConfirmModal from '../../../components/admin/AdminConfirmModal';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminTrainingList() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, item: null });

  const [form, setForm] = useState({
    name: '',
    description: '',
    duration: '10 Weeks',
    mode: 'In-Studio / Hybrid',
    skills: '',
    eligibility: '',
    instructions: 'Submit your candidate application through the KODEWAR Careers portal.',
    status: 'PUBLISHED',
  });

  const loadTraining = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('kwt_candidate_token');
      const res = await fetch(`${API_BASE_URL}/admin/training`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPrograms(data.training_programs || []);
      }
    } catch (err) {
      console.error('Error fetching training programs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTraining();
  }, []);

  const openCreateModal = () => {
    setEditingProgram(null);
    setForm({
      name: '',
      description: '',
      duration: '10 Weeks',
      mode: 'In-Studio / Hybrid',
      skills: '',
      eligibility: '',
      instructions: 'Submit your candidate application through the KODEWAR Careers portal.',
      status: 'PUBLISHED',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (prog) => {
    setEditingProgram(prog);
    setForm({
      name: prog.name || '',
      description: prog.description || '',
      duration: prog.duration || '10 Weeks',
      mode: prog.mode || 'In-Studio / Hybrid',
      skills: prog.skills || '',
      eligibility: prog.eligibility || '',
      instructions: prog.instructions || '',
      status: prog.status || 'PUBLISHED',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim()) {
      alert('Program name and description are required.');
      return;
    }

    try {
      const token = localStorage.getItem('kwt_candidate_token');
      const url = editingProgram
        ? `${API_BASE_URL}/admin/training/${editingProgram.id}`
        : `${API_BASE_URL}/admin/training`;
      const method = editingProgram ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setIsModalOpen(false);
        loadTraining();
        setActionMessage(editingProgram ? 'Training program updated.' : 'Training program created.');
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (err) {
      console.error('Error saving training program:', err);
    }
  };

  const handleToggleStatus = async (prog) => {
    const nextStatus = prog.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const token = localStorage.getItem('kwt_candidate_token');
      const res = await fetch(`${API_BASE_URL}/admin/training/${prog.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setPrograms((prev) =>
          prev.map((p) => (p.id === prog.id ? { ...p, status: nextStatus } : p))
        );
        setActionMessage(`Program status updated to ${nextStatus}.`);
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm.item) return;
    try {
      const token = localStorage.getItem('kwt_candidate_token');
      const res = await fetch(`${API_BASE_URL}/admin/training/${deleteConfirm.item.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setPrograms((prev) => prev.filter((p) => p.id !== deleteConfirm.item.id));
        setActionMessage('Training program removed.');
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (err) {
      console.error('Error deleting program:', err);
    } finally {
      setDeleteConfirm({ isOpen: false, item: null });
    }
  };

  return (
    <AdminLayout breadcrumbs={[{ label: 'CAREERS', link: '/admin/careers' }, { label: 'TRAINING' }]}>
      {/* HEADER */}
      <div className="admin-header-row">
        <div className="admin-header-title-wrap">
          <h1>Training &amp; Apprenticeship Management</h1>
          <p>
            Configure studio apprenticeship tracks, eligibility requirements, duration, and placement preparation curriculum.
          </p>
        </div>

        <div className="admin-header-actions">
          <button type="button" className="btn-kwt-primary" onClick={openCreateModal}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>New Training Track</span>
          </button>
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

      {/* TABLE */}
      <div className="admin-table-container">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#8A8A8A' }}>Loading tracks...</div>
        ) : programs.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#8A8A8A' }}>
            No training programs configured.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Program Track</th>
                <th>Duration</th>
                <th>Mode</th>
                <th>Skills Covered</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {programs.map((prog) => (
                <tr key={prog.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{prog.name}</div>
                    <div style={{ fontSize: '12px', color: '#8A8A8A', maxWidth: '320px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {prog.description}
                    </div>
                  </td>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}>
                    {prog.duration}
                  </td>
                  <td>{prog.mode}</td>
                  <td>
                    <span style={{ color: '#60A5FA', fontSize: '12px' }}>{prog.skills}</span>
                  </td>
                  <td>
                    <span className={`status-pill ${prog.status.toLowerCase()}`}>
                      {prog.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        type="button"
                        className="btn-kwt-secondary"
                        style={{ padding: '5px 10px', fontSize: '11px' }}
                        onClick={() => openEditModal(prog)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="btn-kwt-secondary"
                        style={{ padding: '5px 10px', fontSize: '11px' }}
                        onClick={() => handleToggleStatus(prog)}
                      >
                        {prog.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                      </button>

                      <button
                        type="button"
                        className="btn-kwt-danger"
                        style={{ padding: '5px 8px' }}
                        onClick={() => setDeleteConfirm({ isOpen: true, item: prog })}
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

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal-card" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingProgram ? 'Edit Training Program' : 'New Training Track'}</h3>
              <button
                type="button"
                className="admin-modal-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="admin-modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="admin-form-group">
                  <label className="admin-form-label">Program Name *</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. Full Stack Development"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Description *</label>
                  <textarea
                    className="admin-form-textarea"
                    placeholder="Detailed overview of the apprenticeship curriculum..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Duration</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="e.g. 12 Weeks (Immersive)"
                      value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Delivery Mode</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="e.g. In-Studio (Hyderabad) / Hybrid"
                      value={form.mode}
                      onChange={(e) => setForm({ ...form, mode: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Skills Covered (Comma separated)</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    placeholder="React, Node.js, Express, PostgreSQL, Docker"
                    value={form.skills}
                    onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Eligibility Criteria</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. Engineering students or aspiring developers with basic programming fundamentals"
                    value={form.eligibility}
                    onChange={(e) => setForm({ ...form, eligibility: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Status</label>
                  <select
                    className="admin-form-select"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="DRAFT">DRAFT</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="btn-kwt-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-kwt-primary">
                  {editingProgram ? 'Update Track' : 'Create Track'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <AdminConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Remove Training Track?"
        message={`Are you sure you want to remove the program "${deleteConfirm.item?.name}"?`}
        confirmLabel="Remove"
        isDanger={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, item: null })}
      />
    </AdminLayout>
  );
}
