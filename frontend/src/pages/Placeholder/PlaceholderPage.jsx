import React from 'react';
import { Link } from 'react-router-dom';

export default function PlaceholderPage({
  title,
  category = "PHASE 2 • ROUTE PLACEHOLDER",
  subtitle,
  description,
  badge = "COMING IN UPCOMING PHASE",
  actionText = "Return to Homepage",
  actionLink = "/"
}) {
  return (
    <section className="placeholder-section">
      <div className="placeholder-inner">
        <div className="eyebrow" style={{ marginBottom: '24px' }}>
          {category}
        </div>

        <div className="placeholder-badge">
          <span className="badge-dot"></span>
          <span>{badge}</span>
        </div>

        <h1 className="placeholder-title">{title}</h1>

        {subtitle && <p className="placeholder-sub">{subtitle}</p>}
        {description && <p className="placeholder-desc">{description}</p>}

        <div className="placeholder-actions">
          <Link to={actionLink} className="btn-primary">
            {actionText}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>

          <a href="mailto:kodewartechnologies@gmail.com" className="btn-secondary-link">
            <span>Contact Studio</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
