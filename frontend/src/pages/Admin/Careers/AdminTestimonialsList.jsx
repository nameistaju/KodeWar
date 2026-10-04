import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import AdminConfirmModal from '../../../components/admin/AdminConfirmModal';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminTestimonialsList() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, item: null });

  const [form, setForm] = useState({
    name: '',
    role: '',
    program: '',
    quote: '',
    image_url: '',
    status: 'PUBLISHED',
  });

  const loadTestimonials = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('kwt_candidate_token');
      const res = await fetch(`${API_BASE_URL}/admin/testimonials`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data.testimonials || []);
      }
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setForm({
      name: '',
      role: '',
      program: '',
      quote: '',
      image_url: '',
      status: 'PUBLISHED',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name || '',
      role: item.role || '',
      program: item.program || '',
      quote: item.quote || '',
      image_url: item.image_url || '',
      status: item.status || 'PUBLISHED',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.quote.trim()) {
      alert('Candidate name and testimonial quote are required.');
      return;
    }

    try {
      const token = localStorage.getItem('kwt_candidate_token');
      const url = editingItem
        ? `${API_BASE_URL}/admin/testimonials/${editingItem.id}`
        : `${API_BASE_URL}/admin/testimonials`;
      const method = editingItem ? 'PUT' : 'POST';

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
        loadTestimonials();
        setActionMessage(editingItem ? 'Testimonial updated.' : 'Testimonial created.');
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (err) {
      console.error('Error saving testimonial:', err);
    }
  };

  const handleToggleStatus = async (item) => {
    const nextStatus = item.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const token = localStorage.getItem('kwt_candidate_token');
      const res = await fetch(`${API_BASE_URL}/admin/testimonials/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setTestimonials((prev) =>
          prev.map((t) => (t.id === item.id ? { ...t, status: nextStatus } : t))
        );
        setActionMessage(`Testimonial status marked as ${nextStatus}.`);
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
      const res = await fetch(`${API_BASE_URL}/admin/testimonials/${deleteConfirm.item.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setTestimonials((prev) => prev.filter((t) => t.id !== deleteConfirm.item.id));
        setActionMessage('Testimonial removed.');
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (err) {
      console.error('Error deleting testimonial:', err);
    } finally {
      setDeleteConfirm({ isOpen: false, item: null });
    }
  };

  return (
    <AdminLayout breadcrumbs={[{ label: 'CAREERS', link: '/admin/careers' }, { label: 'TESTIMONIALS' }]}>
      {/* HEADER */}
      <div className="admin-header-row">
        <div className="admin-header-title-wrap">
          <h1>Candidate Testimonials Management</h1>
          <p>
            Curate authentic feedback and alumni stories from apprentices and candidates placed into technology roles.
          </p>
        </div>

        <div className="admin-header-actions">
          <button type="button" className="btn-kwt-primary" onClick={openCreateModal}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add Testimonial</span>
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
          <div style={{ padding: '40px', textAlign: 'center', color: '#8A8A8A' }}>Loading testimonials...</div>
        ) : testimonials.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#8A8A8A' }}>
            No testimonials recorded yet.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Role / Company</th>
                <th>Program / Cohort</th>
                <th>Quote Preview</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{item.name}</div>
                  </td>
                  <td>{item.role || 'Alumnus'}</td>
                  <td>{item.program || 'Engineering Track'}</td>
                  <td>
                    <div style={{
                      fontSize: '12.5px',
                      color: '#9CA3AF',
                      maxWidth: '340px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      "{item.quote}"
                    </div>
                  </td>
                  <td>
                    <span className={`status-pill ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        type="button"
                        className="btn-kwt-secondary"
                        style={{ padding: '5px 10px', fontSize: '11px' }}
                        onClick={() => openEditModal(item)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="btn-kwt-secondary"
                        style={{ padding: '5px 10px', fontSize: '11px' }}
                        onClick={() => handleToggleStatus(item)}
                      >
                        {item.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                      </button>

                      <button
                        type="button"
                        className="btn-kwt-danger"
                        style={{ padding: '5px 8px' }}
                        onClick={() => setDeleteConfirm({ isOpen: true, item })}
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
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingItem ? 'Edit Testimonial' : 'Add Candidate Testimonial'}</h3>
              <button
                type="button"
                className="admin-modal-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-form-label">Candidate Name *</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. Surya Narayana"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Role / Title</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="e.g. Full Stack Engineer at KODEWAR"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Program / Relationship</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="e.g. Engineering Apprenticeship"
                      value={form.program}
                      onChange={(e) => setForm({ ...form, program: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Testimonial Quote *</label>
                  <textarea
                    className="admin-form-textarea"
                    placeholder="Authentic candidate experience and career growth feedback..."
                    value={form.quote}
                    onChange={(e) => setForm({ ...form, quote: e.target.value })}
                    rows={4}
                    required
                  />
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Avatar Image URL (Optional)</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="e.g. /team/profile1.png"
                      value={form.image_url}
                      onChange={(e) => setForm({ ...form, image_url: e.target.value })}
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
                    </select>
                  </div>
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
                  {editingItem ? 'Update Testimonial' : 'Save Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <AdminConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Delete Testimonial?"
        message={`Are you sure you want to delete the testimonial from "${deleteConfirm.item?.name}"?`}
        confirmLabel="Delete"
        isDanger={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, item: null })}
      />
    </AdminLayout>
  );
}
