import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { usePromotions } from '../../../context/PromotionContext';
import AdminLayout from '../../../layouts/AdminLayout';
import AdminConfirmModal from '../../../components/admin/AdminConfirmModal';
import './adminPromotions.css';

export default function AdminPromotionsList() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    promotions,
    activeBannerPromotion,
    activePopupPromotion,
    togglePromotionEnabled,
    deletePromotion,
    duplicatePromotion,
    resetToDefaults,
  } = usePromotions();

  const [activeTab, setActiveTab] = useState('ALL');
  const [previewPromo, setPreviewPromo] = useState(null);
  const [previewSurface, setPreviewSurface] = useState('popup'); // 'popup' | 'banner'

  // Modal and Toast state
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null, title: '' });
  const [resetConfirm, setResetConfirm] = useState(false);
  const [toast, setToast] = useState(null);

  const triggerToast = (toastObj) => {
    setToast(toastObj);
    setTimeout(() => {
      setToast((current) => (current?.id === toastObj.id ? null : current));
    }, 4000);
  };

  // Listen for navigation flash messages (e.g. from create/update)
  useEffect(() => {
    if (location.state?.flash) {
      triggerToast({
        id: Date.now(),
        type: 'success',
        title: 'Promotion Published',
        message: location.state.flash,
      });
      // Clear state so reload doesn't re-trigger
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  // Filter promotions by tab
  const filteredPromotions = promotions.filter((p) => {
    if (activeTab === 'ALL') return true;
    return p.computedStatus === activeTab;
  });

  const activeCount = promotions.filter((p) => p.computedStatus === 'ACTIVE').length;

  const handleDelete = (id, title) => {
    setDeleteConfirm({ isOpen: true, id, title });
  };

  const executeDelete = () => {
    if (!deleteConfirm.id) return;
    const titleToDelete = deleteConfirm.title;
    deletePromotion(deleteConfirm.id);
    setDeleteConfirm({ isOpen: false, id: null, title: '' });
    triggerToast({
      id: Date.now(),
      type: 'danger',
      title: 'Promotion Deleted',
      message: `"${titleToDelete}" has been permanently removed.`,
    });
  };

  const handleReset = () => {
    setResetConfirm(true);
  };

  const executeReset = () => {
    resetToDefaults();
    setResetConfirm(false);
    triggerToast({
      id: Date.now(),
      type: 'success',
      title: 'Defaults Restored',
      message: 'Promotional posters have been restored to default starters.',
    });
  };

  return (
    <AdminLayout breadcrumbs={[{ label: 'PROMOTIONS' }]}>
    <div className="admin-promo-page admin-promo-page-shell">
      <div className="admin-promo-container">
        {/* HEADER & BREADCRUMBS */}
        <header className="admin-promo-header">
          <div className="admin-promo-title-row">
            <div className="admin-promo-title-wrap">
              <h1>Promotions &amp; Offers</h1>
              <p>
                Centrally control promotional posters, delivery timing, and placement across Homepage Banner and Modal Popup surfaces.
              </p>
            </div>

            <div className="admin-promo-actions-group">
              <button
                type="button"
                onClick={handleReset}
                className="btn-admin-secondary"
                title="Restore default offer posters"
              >
                Reset Defaults
              </button>
              <Link to="/admin/promotions/new" className="btn-admin-primary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                New Promotion
              </Link>
            </div>
          </div>
        </header>

        {/* METRICS & STATUS OVERVIEW */}
        <section className="admin-promo-stats-grid">
          <div className="admin-promo-stat-card">
            <span className="admin-promo-stat-label">Total Campaigns</span>
            <div className="admin-promo-stat-val">{promotions.length}</div>
            <span className="admin-promo-stat-desc">Configured promotional items</span>
          </div>

          <div className="admin-promo-stat-card">
            <span className="admin-promo-stat-label">Active Right Now</span>
            <div className="admin-promo-stat-val">
              {activeCount > 0 && <span className="live-indicator" />}
              {activeCount}
            </div>
            <span className="admin-promo-stat-desc">Currently valid &amp; enabled</span>
          </div>

          <div className="admin-promo-stat-card">
            <span className="admin-promo-stat-label">Active Homepage Banner</span>
            <div className="admin-promo-stat-val" style={{ fontSize: '16px', fontWeight: 600 }}>
              {activeBannerPromotion ? (
                <span style={{ color: '#ffffff' }}>{activeBannerPromotion.title}</span>
              ) : (
                <span style={{ color: '#6b7280' }}>None Active</span>
              )}
            </div>
            <span className="admin-promo-stat-desc">
              {activeBannerPromotion ? 'Displayed on /' : 'Slot hidden from homepage'}
            </span>
          </div>

          <div className="admin-promo-stat-card">
            <span className="admin-promo-stat-label">Active Popup Poster</span>
            <div className="admin-promo-stat-val" style={{ fontSize: '16px', fontWeight: 600 }}>
              {activePopupPromotion ? (
                <span style={{ color: '#60a5fa' }}>{activePopupPromotion.title}</span>
              ) : (
                <span style={{ color: '#6b7280' }}>None Active</span>
              )}
            </div>
            <span className="admin-promo-stat-desc">
              {activePopupPromotion ? `${activePopupPromotion.popupDelay}s delay • ${activePopupPromotion.popupFrequency}` : 'Popup will not trigger'}
            </span>
          </div>
        </section>

        {/* FILTER TABS */}
        <div className="admin-promo-filters">
          <div className="admin-promo-tabs">
            {['ALL', 'ACTIVE', 'SCHEDULED', 'EXPIRED', 'DISABLED', 'DRAFT'].map((tab) => {
              const count = tab === 'ALL'
                ? promotions.length
                : promotions.filter((p) => p.computedStatus === tab).length;
              return (
                <button
                  key={tab}
                  type="button"
                  className={`admin-promo-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  <span className="admin-promo-tab-count">({count})</span>
                </button>
              );
            })}
          </div>

          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', color: '#8a8a8a' }}>
            Showing {filteredPromotions.length} of {promotions.length} promotions
          </div>
        </div>

        {/* PROMOTIONS GRID */}
        {filteredPromotions.length === 0 ? (
          <div className="admin-promo-empty">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <h3>No promotions found</h3>
            <p>No promotions match the current filter "{activeTab}". Create a new campaign or switch filters.</p>
            <Link to="/admin/promotions/new" className="btn-admin-primary">
              Create First Promotion
            </Link>
          </div>
        ) : (
          <div className="admin-promo-grid">
            {filteredPromotions.map((promo) => (
              <div
                key={promo.id}
                className={`admin-promo-card ${!promo.enabled ? 'disabled-card' : ''}`}
              >
                {/* Poster Thumbnail */}
                <div
                  className="admin-promo-card-thumb-wrap"
                  onClick={() => {
                    setPreviewPromo(promo);
                    setPreviewSurface(promo.popup ? 'popup' : 'banner');
                  }}
                  title="Click to preview"
                >
                  {promo.image ? (
                    <img
                      src={promo.image}
                      alt={promo.title}
                      className="admin-promo-card-thumb"
                    />
                  ) : (
                    <div style={{ color: '#6b7280', fontSize: '12px' }}>No Poster Uploaded</div>
                  )}
                  <div className="admin-promo-thumb-overlay">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <span>Click to Preview</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="admin-promo-card-content">
                  <div className="admin-promo-card-top-row">
                    <h3 className="admin-promo-card-title">{promo.title}</h3>
                    <span className={`promo-status-badge ${promo.computedStatus}`}>
                      {promo.computedStatus}
                    </span>
                  </div>

                  {/* Surface Pills */}
                  <div className="admin-promo-surfaces">
                    {promo.homepageBanner && (
                      <span className="promo-surface-pill banner">Homepage Banner</span>
                    )}
                    {promo.popup && (
                      <span className="promo-surface-pill popup">Popup Modal</span>
                    )}
                    <span
                      style={{
                        fontFamily: 'JetBrains Mono',
                        fontSize: '10px',
                        color: '#6b7280',
                        marginLeft: 'auto',
                      }}
                    >
                      Priority #{promo.priority || 1}
                    </span>
                  </div>

                  {/* Meta Details */}
                  <div className="admin-promo-meta-list">
                    <div className="admin-promo-meta-item">
                      <span className="label">Destination:</span>
                      <span className="val" title={promo.destinationUrl || 'None'}>
                        {promo.destinationUrl || 'None (Display only)'}
                      </span>
                    </div>

                    <div className="admin-promo-meta-item">
                      <span className="label">Schedule:</span>
                      <span className="val">
                        {promo.startDate || promo.endDate ? (
                          `${promo.startDate ? new Date(promo.startDate).toLocaleDateString() : 'Now'} → ${promo.endDate ? new Date(promo.endDate).toLocaleDateString() : 'Indefinite'}`
                        ) : (
                          'Always Active'
                        )}
                      </span>
                    </div>

                    {promo.popup && (
                      <div className="admin-promo-meta-item">
                        <span className="label">Popup Rules:</span>
                        <span className="val">
                          {promo.popupDelay}s delay • {promo.popupFrequency}
                          {promo.autoClose ? ` • Auto-close ${promo.autoCloseDuration}s` : ''}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Footer Controls */}
                  <div className="admin-promo-card-footer">
                    <label className="admin-promo-switch-wrap">
                      <div className="switch">
                        <input
                          type="checkbox"
                          checked={promo.enabled}
                          onChange={() => togglePromotionEnabled(promo.id)}
                        />
                        <span className="slider" />
                      </div>
                      <span>{promo.enabled ? 'Enabled' : 'Disabled'}</span>
                    </label>

                    <div className="admin-promo-card-btn-group">
                      <button
                        type="button"
                        className="btn-icon-admin"
                        title="Live Preview"
                        onClick={() => {
                          setPreviewPromo(promo);
                          setPreviewSurface(promo.popup ? 'popup' : 'banner');
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>

                      <Link
                        to={`/admin/promotions/edit/${promo.id}`}
                        className="btn-icon-admin"
                        title="Edit Promotion"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </Link>

                      <button
                        type="button"
                        className="btn-icon-admin"
                        title="Duplicate"
                        onClick={() => duplicatePromotion(promo.id)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        className="btn-icon-admin danger"
                        title="Delete Promotion"
                        onClick={() => handleDelete(promo.id, promo.title)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LIVE PREVIEW MODAL */}
        {previewPromo && (
          <div
            className="admin-preview-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setPreviewPromo(null);
            }}
          >
            <div className="admin-preview-modal-container">
              <div className="admin-preview-modal-header">
                <div>
                  <h3 style={{ margin: '0 0 4px', fontSize: '18px', color: '#ffffff' }}>
                    Preview: {previewPromo.title}
                  </h3>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#8a8a8a' }}>
                    Surface Mode: {previewSurface.toUpperCase()} • Pure Uploaded Poster
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    className={`live-preview-mode-btn ${previewSurface === 'popup' ? 'active' : ''}`}
                    onClick={() => setPreviewSurface('popup')}
                  >
                    Popup Modal
                  </button>
                  <button
                    type="button"
                    className={`live-preview-mode-btn ${previewSurface === 'banner' ? 'active' : ''}`}
                    onClick={() => setPreviewSurface('banner')}
                  >
                    Homepage Banner
                  </button>
                  <button
                    type="button"
                    className="btn-icon-admin"
                    onClick={() => setPreviewPromo(null)}
                    style={{ marginLeft: '12px' }}
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="admin-preview-modal-body">
                {previewSurface === 'popup' ? (
                  /* Popup Preview with close X button */
                  <div
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                      maxWidth: '85vw',
                      maxHeight: '75vh',
                      borderRadius: '6px',
                      boxShadow: '0 24px 60px rgba(0,0,0,0.95)',
                    }}
                  >
                    <button
                      type="button"
                      className="offer-popup-close-btn"
                      onClick={() => setPreviewPromo(null)}
                      title="Close Preview"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                    <img
                      src={previewPromo.image}
                      alt={previewPromo.title}
                      style={{
                        maxWidth: '85vw',
                        maxHeight: '75vh',
                        display: 'block',
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                ) : (
                  /* Banner Preview */
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '900px',
                      background: '#0b0b0d',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      padding: '8px',
                    }}
                  >
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: '#6b7280', marginBottom: '8px', textAlign: 'center' }}>
                      HOMEPAGE BANNER SLOT PREVIEW
                    </div>
                    <img
                      src={previewPromo.image}
                      alt={previewPromo.title}
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: '380px',
                        objectFit: 'contain',
                        display: 'block',
                        margin: '0 auto',
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        <AdminConfirmModal
          isOpen={deleteConfirm.isOpen}
          title="Delete Promotion?"
          message={`Are you sure you want to delete the promotion "${deleteConfirm.title}"? This campaign will be removed immediately from Homepage Banner and Popup slots.`}
          confirmLabel="Delete Forever"
          cancelLabel="Keep Promotion"
          isDanger={true}
          onConfirm={executeDelete}
          onCancel={() => setDeleteConfirm({ isOpen: false, id: null, title: '' })}
        />

        {/* RESET DEFAULTS CONFIRMATION MODAL */}
        <AdminConfirmModal
          isOpen={resetConfirm}
          title="Restore Default Starter Posters?"
          message="Are you sure you want to reset all promotions to the default starter offer posters? Any custom promotional campaigns will be replaced."
          confirmLabel="Reset Defaults"
          cancelLabel="Cancel"
          isDanger={true}
          onConfirm={executeReset}
          onCancel={() => setResetConfirm(false)}
        />

        {/* LUXURY TOAST NOTIFICATION */}
        {toast && (
          <div className="admin-toast-container">
            <div className={`admin-toast ${toast.type}`}>
              <div className="admin-toast-icon-wrap">
                {toast.type === 'danger' ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <div className="admin-toast-content">
                <div className="admin-toast-title">{toast.title}</div>
                <div className="admin-toast-message">{toast.message}</div>
              </div>
              <button
                type="button"
                className="admin-toast-close"
                onClick={() => setToast(null)}
                aria-label="Close notification"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </AdminLayout>
  );
}
