import React from 'react';

export default function AdminConfirmModal({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDanger = false,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" onClick={onCancel} role="dialog" aria-modal="true">
      <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3>{title}</h3>
          <button
            type="button"
            className="admin-modal-close-btn"
            onClick={onCancel}
            aria-label="Close modal"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="admin-modal-body">
          <p style={{ margin: 0 }}>{message}</p>
        </div>

        <div className="admin-modal-actions">
          <button type="button" className="btn-kwt-secondary" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={isDanger ? 'btn-kwt-danger' : 'btn-kwt-primary'}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
