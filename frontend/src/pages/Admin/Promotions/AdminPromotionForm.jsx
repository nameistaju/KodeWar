import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePromotions } from '../../../context/PromotionContext';
import AdminLayout from '../../../layouts/AdminLayout';
import './adminPromotions.css';

export default function AdminPromotionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { promotions, createPromotion, updatePromotion } = usePromotions();

  const isEditing = Boolean(id);
  const existingPromo = isEditing ? promotions.find((p) => p.id === id) : null;

  // Form State
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [imageName, setImageName] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [openInNewTab, setOpenInNewTab] = useState(false);
  const [homepageBanner, setHomepageBanner] = useState(false);
  const [popup, setPopup] = useState(true);
  const [enabled, setEnabled] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [popupDelay, setPopupDelay] = useState(3);
  const [popupFrequency, setPopupFrequency] = useState('session');
  const [autoClose, setAutoClose] = useState(false);
  const [autoCloseDuration, setAutoCloseDuration] = useState(5);
  const [priority, setPriority] = useState(1);

  // UI state
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewAspect, setPreviewAspect] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [previewMode, setPreviewMode] = useState('popup'); // 'popup' | 'banner'

  const fileInputRef = useRef(null);

  // Populate existing data when editing
  useEffect(() => {
    if (isEditing && existingPromo) {
      setTitle(existingPromo.title || '');
      setImage(existingPromo.image || '');
      setImageName(existingPromo.imageName || '');
      setDestinationUrl(existingPromo.destinationUrl || '');
      setOpenInNewTab(Boolean(existingPromo.openInNewTab));
      setHomepageBanner(Boolean(existingPromo.homepageBanner));
      setPopup(existingPromo.popup !== undefined ? Boolean(existingPromo.popup) : true);
      setEnabled(existingPromo.enabled !== undefined ? Boolean(existingPromo.enabled) : true);
      setStartDate(existingPromo.startDate || '');
      setEndDate(existingPromo.endDate || '');
      setPopupDelay(existingPromo.popupDelay || 3);
      setPopupFrequency(existingPromo.popupFrequency || 'session');
      setAutoClose(Boolean(existingPromo.autoClose));
      setAutoCloseDuration(existingPromo.autoCloseDuration || 5);
      setPriority(existingPromo.priority || 1);
    }
  }, [isEditing, existingPromo]);

  // Compute aspect ratio whenever image changes
  useEffect(() => {
    if (!image) {
      setPreviewAspect('');
      return;
    }
    const imgObj = new Image();
    imgObj.src = image;
    imgObj.onload = () => {
      const w = imgObj.naturalWidth;
      const h = imgObj.naturalHeight;
      const ratio = (w / h).toFixed(2);
      let desc = 'Custom';
      if (Math.abs(ratio - 1) < 0.05) desc = '1:1 Square';
      else if (ratio < 0.9) desc = 'Portrait';
      else if (ratio > 1.2) desc = 'Landscape';
      setPreviewAspect(`${w} × ${h}px (${desc} • ${ratio}:1)`);
    };
  }, [image]);

  // Handle file reading
  const processFile = (file) => {
    if (!file) return;

    // Check size limit: 10MB
    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      setErrorMsg('Image file size exceeds 10MB limit. Please upload a smaller poster.');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|svg)$/i)) {
      setErrorMsg('Invalid file format. Please upload JPG, PNG, WEBP, or SVG.');
      return;
    }

    setErrorMsg('');
    setImageName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target.result);
      if (!title) {
        // Auto fill title from filename if empty
        const cleanName = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());
        setTitle(cleanName);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Please provide a campaign title for identification.');
      return;
    }

    if (!image) {
      setErrorMsg('Please upload a promotional poster image.');
      return;
    }

    if (!homepageBanner && !popup) {
      setErrorMsg('Please select at least one surface (Homepage Banner or Popup Modal).');
      return;
    }

    const payload = {
      title: title.trim(),
      image,
      imageName: imageName || 'uploaded-poster',
      destinationUrl: destinationUrl.trim(),
      openInNewTab,
      homepageBanner,
      popup,
      enabled,
      startDate,
      endDate,
      popupDelay: Number(popupDelay),
      popupFrequency,
      autoClose,
      autoCloseDuration: Number(autoCloseDuration),
      priority: Number(priority),
    };

    if (isEditing) {
      updatePromotion(id, payload);
    } else {
      createPromotion(payload);
    }

    navigate('/admin/promotions');
  };

  return (
    <AdminLayout breadcrumbs={[{ label: 'PROMOTIONS', link: '/admin/promotions' }, { label: isEditing ? 'EDIT' : 'NEW' }]}>
    <div className="admin-promo-page admin-promo-page-shell">
      <div className="admin-promo-container">
        {/* HEADER & BREADCRUMBS */}
        <header className="admin-promo-header">
          <div className="admin-promo-title-row">
            <div className="admin-promo-title-wrap">
              <h1>{isEditing ? `Edit: ${existingPromo?.title || 'Promotion'}` : 'Create Promotion'}</h1>
              <p>
                Upload promotional poster artwork and configure surface placement, scheduling, and popup delivery.
              </p>
            </div>

            <div className="admin-promo-actions-group">
              <Link to="/admin/promotions" className="btn-admin-secondary">
                Cancel
              </Link>
              <button type="button" onClick={handleSubmit} className="btn-admin-primary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {isEditing ? 'Update Promotion' : 'Publish Promotion'}
              </button>
            </div>
          </div>
        </header>

        {errorMsg && (
          <div
            style={{
              padding: '14px 20px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: '6px',
              color: '#f87171',
              fontSize: '13px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-form-grid">
          {/* LEFT COLUMN: FORM SETTINGS */}
          <div className="admin-form-left">
            {/* 1. CAMPAIGN DETAILS */}
            <div className="admin-form-card">
              <h2 className="admin-form-section-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                Campaign Details
              </h2>
              <p className="admin-form-section-desc">
                Internal campaign identification and click-through link destination.
              </p>

              <div className="form-group">
                <label className="form-label" htmlFor="promo-title">
                  Campaign Title *
                </label>
                <input
                  id="promo-title"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Dussehra Festival 2026 Special"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <div className="form-hint">Internal name for administrative reference.</div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="promo-url">
                  Destination URL (Optional)
                </label>
                <input
                  id="promo-url"
                  type="text"
                  className="form-input"
                  placeholder="e.g. /digital-marketing, /contact, or https://wa.me/..."
                  value={destinationUrl}
                  onChange={(e) => setDestinationUrl(e.target.value)}
                />
                <div className="form-hint">
                  If set, clicking the poster navigates to this URL. Leave empty for display-only poster.
                </div>
              </div>

              {destinationUrl && (
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#d1d5db' }}>
                    <input
                      type="checkbox"
                      checked={openInNewTab}
                      onChange={(e) => setOpenInNewTab(e.target.checked)}
                      style={{ accentColor: '#0066ff' }}
                    />
                    <span>Open link in a new tab (target="_blank")</span>
                  </label>
                </div>
              )}
            </div>

            {/* 2. PLACEMENT SURFACES */}
            <div className="admin-form-card">
              <h2 className="admin-form-section-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                Promotional Surfaces
              </h2>
              <p className="admin-form-section-desc">
                Select where this promotional poster should appear across KODEWAR.
              </p>

              <div className="surface-tiles-grid">
                <label className={`surface-tile ${homepageBanner ? 'active' : ''}`}>
                  <input
                    type="checkbox"
                    checked={homepageBanner}
                    onChange={(e) => setHomepageBanner(e.target.checked)}
                  />
                  <div>
                    <div className="surface-tile-title">Homepage Banner</div>
                    <div className="surface-tile-desc">
                      Dedicated advertising slot on the main homepage.
                    </div>
                  </div>
                </label>

                <label className={`surface-tile ${popup ? 'active' : ''}`}>
                  <input
                    type="checkbox"
                    checked={popup}
                    onChange={(e) => setPopup(e.target.checked)}
                  />
                  <div>
                    <div className="surface-tile-title">Promotional Popup</div>
                    <div className="surface-tile-desc">
                      Modal popup displaying pure poster with "X" close.
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* 3. SCHEDULE & STATUS */}
            <div className="admin-form-card">
              <h2 className="admin-form-section-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Scheduling &amp; Status
              </h2>
              <p className="admin-form-section-desc">
                Set active start and end dates. Leaves empty for immediate indefinite activation.
              </p>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="promo-start">
                    Start Date &amp; Time
                  </label>
                  <input
                    id="promo-start"
                    type="datetime-local"
                    className="form-input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="promo-end">
                    End Date &amp; Time
                  </label>
                  <input
                    id="promo-end"
                    type="datetime-local"
                    className="form-input"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row" style={{ marginTop: '16px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="promo-priority">
                    Priority Rank
                  </label>
                  <input
                    id="promo-priority"
                    type="number"
                    min="1"
                    max="100"
                    className="form-input"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  />
                  <div className="form-hint">1 = Highest priority when multiple are active.</div>
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <label className="form-label">Master Status</label>
                  <label className="admin-promo-switch-wrap" style={{ marginTop: '6px' }}>
                    <div className="switch">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => setEnabled(e.target.checked)}
                      />
                      <span className="slider" />
                    </div>
                    <span style={{ fontSize: '13px', color: enabled ? '#10b981' : '#9ca3af' }}>
                      {enabled ? 'Active / Enabled' : 'Disabled'}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* 4. POPUP BEHAVIOR (Conditional on popup checked) */}
            {popup && (
              <div className="admin-form-card">
                <h2 className="admin-form-section-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  Popup Delivery Controls
                </h2>
                <p className="admin-form-section-desc">
                  Fine-tune how and when the modal poster appears to site visitors.
                </p>

                {/* Display Delay Slider */}
                <div className="form-group">
                  <label className="form-label">
                    Display Delay (Seconds before showing)
                  </label>
                  <div className="slider-group">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={popupDelay}
                      onChange={(e) => setPopupDelay(Number(e.target.value))}
                    />
                    <span className="slider-val-badge">{popupDelay}s</span>
                  </div>
                  <div className="form-hint">Recommended: 3 to 5 seconds after page load.</div>
                </div>

                {/* Frequency Select */}
                <div className="form-group">
                  <label className="form-label" htmlFor="popup-frequency">
                    Display Frequency
                  </label>
                  <select
                    id="popup-frequency"
                    className="form-select"
                    value={popupFrequency}
                    onChange={(e) => setPopupFrequency(e.target.value)}
                  >
                    <option value="session">Once per browser session (Default)</option>
                    <option value="day">Once per day (24-hour interval)</option>
                    <option value="always">Every page visit (Testing only)</option>
                  </select>
                </div>

                {/* Auto-close Settings */}
                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#d1d5db', marginBottom: '12px' }}>
                    <input
                      type="checkbox"
                      checked={autoClose}
                      onChange={(e) => setAutoClose(e.target.checked)}
                      style={{ accentColor: '#0066ff' }}
                    />
                    <span>Auto-close popup automatically after duration</span>
                  </label>

                  {autoClose && (
                    <div className="slider-group" style={{ paddingLeft: '24px' }}>
                      <input
                        type="range"
                        min="3"
                        max="30"
                        step="1"
                        value={autoCloseDuration}
                        onChange={(e) => setAutoCloseDuration(Number(e.target.value))}
                      />
                      <span className="slider-val-badge">{autoCloseDuration}s</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: POSTER UPLOAD & PREVIEW */}
          <div className="admin-form-right">
            <div className="admin-form-card">
              <h2 className="admin-form-section-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                Promotional Poster Artwork
              </h2>
              <p className="admin-form-section-desc">
                The uploaded poster is the creative itself. It will be presented exactly as provided without cropping.
              </p>

              {/* Dropzone */}
              {!image ? (
                <div
                  className={`poster-dropzone ${isDragOver ? 'dragover' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg className="poster-dropzone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <div className="poster-dropzone-title">Upload Poster Image</div>
                  <div className="poster-dropzone-desc">
                    Drag and drop your poster file here, or click to browse computer.
                  </div>
                  <span className="btn-admin-secondary" style={{ pointerEvents: 'none' }}>
                    Browse Files
                  </span>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '12px' }}>
                    Supports JPG, PNG, WEBP, SVG • Max 10MB
                  </div>
                </div>
              ) : (
                /* Live Preview Container */
                <div>
                  <div className="live-preview-modes">
                    <button
                      type="button"
                      className={`live-preview-mode-btn ${previewMode === 'popup' ? 'active' : ''}`}
                      onClick={() => setPreviewMode('popup')}
                    >
                      Popup Preview
                    </button>
                    <button
                      type="button"
                      className={`live-preview-mode-btn ${previewMode === 'banner' ? 'active' : ''}`}
                      onClick={() => setPreviewMode('banner')}
                    >
                      Banner Preview
                    </button>
                  </div>

                  <div className="live-preview-box">
                    {previewMode === 'popup' ? (
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <div
                          style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: '#0d0d11',
                            border: '1px solid rgba(255,255,255,0.3)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                          }}
                        >
                          ✕
                        </div>
                        <img
                          src={image}
                          alt="Poster Preview"
                          className="live-preview-img"
                        />
                      </div>
                    ) : (
                      <div style={{ width: '100%', background: '#08080a', padding: '10px', borderRadius: '6px' }}>
                        <img
                          src={image}
                          alt="Banner Preview"
                          style={{
                            width: '100%',
                            maxHeight: '260px',
                            objectFit: 'contain',
                            display: 'block',
                            margin: '0 auto',
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {previewAspect && (
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#8a8a8a', textAlign: 'center', marginTop: '10px' }}>
                      {previewAspect}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '8px', marginTop: '14px', justifyContent: 'center' }}>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-admin-secondary"
                    >
                      Replace Poster
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImage('');
                        setImageName('');
                      }}
                      className="btn-admin-secondary btn-admin-danger"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
              />

              {/* Starter Presets */}
              <div style={{ marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: '#8a8a8a', textTransform: 'uppercase', marginBottom: '8px', textAlign: 'center' }}>
                  Quick Load Demo Posters
                </div>
                <div className="preset-pills-row">
                  <button
                    type="button"
                    className="preset-pill"
                    onClick={() => {
                      setImage('/offers/dussehra-special.svg');
                      setImageName('dussehra-special.svg');
                      if (!title) setTitle('Dussehra Festive Special');
                    }}
                  >
                    Dussehra Special (SVG)
                  </button>
                  <button
                    type="button"
                    className="preset-pill"
                    onClick={() => {
                      setImage('/offers/digital-growth.png');
                      setImageName('digital-growth.png');
                      if (!title) setTitle('Digital Growth Campaign');
                    }}
                  >
                    Digital Growth (PNG)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    </AdminLayout>
  );
}
