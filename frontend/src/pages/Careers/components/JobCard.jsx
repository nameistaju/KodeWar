import React from 'react';

export default function JobCard({ job, onSelectRole }) {
  const empType = job.employment_type || job.type || 'Full Time';
  const locationText = job.location || 'Hyderabad, IN';
  const salaryText = job.salary || 'Competitive';

  return (
    <div
      className="career-job-card"
      onClick={() => onSelectRole(job)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectRole(job);
        }
      }}
      aria-label={`View role details for ${job.title}`}
    >
      {/* Top Header Row: Title & Type on Left, Circle Arrow on Right */}
      <div className="job-card-header">
        <div className="job-card-title-group">
          <h3 className="job-card-title">{job.title}</h3>
          <span className="job-card-type">{empType}</span>
        </div>

        <div className="job-card-arrow-circle" aria-hidden="true">
          <svg
            className="job-card-arrow-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="15"
            height="15"
          >
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </div>
      </div>

      {/* Middle Description Paragraph (2-line clamp) */}
      <p className="job-card-summary">{job.summary}</p>

      {/* Bottom Meta Row: Location and Salary / Compensation */}
      <div className="job-card-footer">
        <span className="job-card-meta-item">
          <svg
            className="job-card-meta-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="14"
            height="14"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1-18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{locationText}</span>
        </span>

        <span className="job-card-meta-item">
          <svg
            className="job-card-meta-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="14"
            height="14"
          >
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
          <span>{salaryText}</span>
        </span>
      </div>
    </div>
  );
}
