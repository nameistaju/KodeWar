import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../../../layouts/AdminLayout';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const DEPARTMENTS = [
  'Software Development',
  'UI/UX & Design',
  'Digital Marketing',
  'AI & Automation',
  'Content',
  'Internship',
];

const EMPLOYMENT_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship (3–6 Months)',
];

const WORKPLACE_TYPES = ['In-Studio', 'Hybrid', 'Remote'];

export default function AdminJobForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    department: 'Software Development',
    location: 'Hyderabad, India',
    employment_type: 'Full-time',
    workplace_type: 'Hybrid',
    experience_level: '1–3 Years',
    salary_range: '',
    summary: '',
    about_role: '',
    responsibilities: '',
    requirements: '',
    skills: '',
    benefits: '',
    deadline: '',
    featured: false,
    status: 'DRAFT',
  });

  useEffect(() => {
    if (isEdit) {
      const fetchJob = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem('kwt_candidate_token');
          const res = await fetch(`${API_BASE_URL}/admin/jobs/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            if (data.job) {
              setFormData({
                title: data.job.title || '',
                department: data.job.department || 'Software Development',
                location: data.job.location || 'Hyderabad, India',
                employment_type: data.job.employment_type || 'Full-time',
                workplace_type: data.job.workplace_type || 'Hybrid',
                experience_level: data.job.experience_level || '1–3 Years',
                salary_range: data.job.salary_range || '',
                summary: data.job.summary || '',
                about_role: data.job.about_role || '',
                responsibilities: data.job.responsibilities || '',
                requirements: data.job.requirements || '',
                skills: data.job.skills || '',
                benefits: data.job.benefits || '',
                deadline: data.job.deadline || '',
                featured: Boolean(data.job.featured),
                status: data.job.status || 'DRAFT',
              });
            }
          } else {
            setError('Failed to load job details.');
          }
        } catch (err) {
          console.error('Error loading job details:', err);
          setError('Network error while retrieving job.');
        } finally {
          setLoading(false);
        }
      };
      fetchJob();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (targetStatus) => {
    setError('');
    setSuccessMsg('');

    // Validation
    if (!formData.title.trim()) {
      setError('Job title is required.');
      return;
    }
    if (!formData.summary.trim()) {
      setError('Short summary is required.');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('kwt_candidate_token');
      const payload = {
        ...formData,
        status: targetStatus,
      };

      const url = isEdit ? `${API_BASE_URL}/admin/jobs/${id}` : `${API_BASE_URL}/admin/jobs`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(`Job successfully ${targetStatus === 'PUBLISHED' ? 'published' : 'saved as draft'}.`);
        setTimeout(() => {
          navigate('/admin/careers/jobs');
        }, 1200);
      } else {
        setError(data.message || 'Error saving job.');
      }
    } catch (err) {
      console.error('Error saving job:', err);
      setError('Server connection error.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout breadcrumbs={[{ label: 'CAREERS', link: '/admin/careers' }, { label: 'JOBS', link: '/admin/careers/jobs' }, { label: 'EDIT' }]}>
        <div style={{ padding: '60px', textAlign: 'center', color: '#8A8A8A' }}>Loading job data...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout breadcrumbs={[
      { label: 'CAREERS', link: '/admin/careers' },
      { label: 'JOBS', link: '/admin/careers/jobs' },
      { label: isEdit ? 'EDIT JOB' : 'NEW JOB' }
    ]}>
      {/* HEADER */}
      <div className="admin-header-row">
        <div className="admin-header-title-wrap">
          <h1>{isEdit ? `Edit Job: ${formData.title}` : 'Create New Job Listing'}</h1>
          <p>
            Configure job specifications, candidate qualifications, and deployment status.
          </p>
        </div>

        <div className="admin-header-actions">
          <Link to="/admin/careers/jobs" className="btn-kwt-secondary">
            Cancel
          </Link>
          <button
            type="button"
            className="btn-kwt-secondary"
            disabled={submitting}
            onClick={() => handleSubmit('DRAFT')}
          >
            Save Draft
          </button>
          <button
            type="button"
            className="btn-kwt-primary"
            disabled={submitting}
            onClick={() => handleSubmit('PUBLISHED')}
          >
            {submitting ? 'Saving...' : 'Publish Job'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          padding: '12px 16px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '6px',
          color: '#F87171',
          fontSize: '13px',
          marginBottom: '20px',
        }}>
          {error}
        </div>
      )}

      {successMsg && (
        <div style={{
          padding: '12px 16px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '6px',
          color: '#34D399',
          fontSize: '13px',
          marginBottom: '20px',
        }}>
          {successMsg}
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="admin-card-section">
          <div className="admin-card-section-title">
            <span>01. Role Classification</span>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Job Title *</label>
            <input
              type="text"
              name="title"
              className="admin-form-input"
              placeholder="e.g. Senior Full Stack Engineer"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Department *</label>
              <select
                name="department"
                className="admin-form-select"
                value={formData.department}
                onChange={handleChange}
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Employment Type *</label>
              <select
                name="employment_type"
                className="admin-form-select"
                value={formData.employment_type}
                onChange={handleChange}
              >
                {EMPLOYMENT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Workplace Mode *</label>
              <select
                name="workplace_type"
                className="admin-form-select"
                value={formData.workplace_type}
                onChange={handleChange}
              >
                {WORKPLACE_TYPES.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Location</label>
              <input
                type="text"
                name="location"
                className="admin-form-input"
                placeholder="e.g. Hyderabad / Remote"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Experience Level</label>
              <input
                type="text"
                name="experience_level"
                className="admin-form-input"
                placeholder="e.g. 2–4 Years"
                value={formData.experience_level}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Salary Range (Optional)</label>
              <input
                type="text"
                name="salary_range"
                className="admin-form-input"
                placeholder="e.g. ₹8,00,000 – ₹14,00,000 / year"
                value={formData.salary_range}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Application Deadline</label>
              <input
                type="date"
                name="deadline"
                className="admin-form-input"
                value={formData.deadline}
                onChange={handleChange}
              />
              <span style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px', display: 'block' }}>
                Jobs automatically close when the deadline passes.
              </span>
            </div>

            <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', paddingTop: '28px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#E5E7EB', fontSize: '13px' }}>
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  style={{ width: '16px', height: '16px' }}
                />
                <span>Featured Position (Highlights on Career Hero &amp; Listings)</span>
              </label>
            </div>
          </div>
        </div>

        <div className="admin-card-section">
          <div className="admin-card-section-title">
            <span>02. Role Narrative &amp; Qualifications</span>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Short Summary *</label>
            <textarea
              name="summary"
              className="admin-form-textarea"
              placeholder="High-level 1–2 sentence description of the impact of this role..."
              value={formData.summary}
              onChange={handleChange}
              rows={2}
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">About The Role</label>
            <textarea
              name="about_role"
              className="admin-form-textarea"
              placeholder="In-depth explanation of team context, studio challenges, and day-to-day focus..."
              value={formData.about_role}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Key Responsibilities (One per line)</label>
              <textarea
                name="responsibilities"
                className="admin-form-textarea"
                placeholder="Architect resilient backend services&#10;Design optimized database schemas&#10;Review peer pull requests"
                value={formData.responsibilities}
                onChange={handleChange}
                rows={5}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Requirements &amp; Experience (One per line)</label>
              <textarea
                name="requirements"
                className="admin-form-textarea"
                placeholder="Demonstrated experience with React &amp; Node.js&#10;Strong understanding of RESTful APIs&#10;Active GitHub profile"
                value={formData.requirements}
                onChange={handleChange}
                rows={5}
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Key Skills (Comma separated)</label>
              <input
                type="text"
                name="skills"
                className="admin-form-input"
                placeholder="React, Node.js, TypeScript, PostgreSQL"
                value={formData.skills}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">What KODEWAR Offers (One per line)</label>
              <textarea
                name="benefits"
                className="admin-form-textarea"
                placeholder="Production ownership&#10;Hardware &amp; learning stipend&#10;Mentorship from senior architects"
                value={formData.benefits}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          <Link to="/admin/careers/jobs" className="btn-kwt-secondary">
            Cancel
          </Link>
          <button
            type="button"
            className="btn-kwt-secondary"
            disabled={submitting}
            onClick={() => handleSubmit('DRAFT')}
          >
            Save as Draft
          </button>
          <button
            type="button"
            className="btn-kwt-primary"
            disabled={submitting}
            onClick={() => handleSubmit('PUBLISHED')}
          >
            {submitting ? 'Saving...' : 'Publish Job'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
