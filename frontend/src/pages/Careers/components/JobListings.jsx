import React, { useState, useEffect, useMemo } from 'react';
import JobCard from './JobCard';
import { CAREER_JOBS } from '../data/careerJobsData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function JobListings({
  searchTerm,
  selectedLocation,
  selectedCategory,
  onResetFilters,
  onSelectRole,
}) {
  const [jobs, setJobs] = useState(CAREER_JOBS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchPublishedJobs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/jobs`);
        if (res.ok) {
          const data = await res.json();
          if (data.jobs && data.jobs.length > 0 && isMounted) {
            setJobs(data.jobs);
          }
        }
      } catch (err) {
        console.warn('Using static job fallback:', err);
      }
    };
    fetchPublishedJobs();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Category filter
      if (selectedCategory !== 'All' && job.department !== selectedCategory) {
        return false;
      }

      // Location filter
      if (selectedLocation !== 'All Locations') {
        if (!job.location?.toLowerCase().includes(selectedLocation.toLowerCase())) {
          return false;
        }
      }

      // Keyword search
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesTitle = job.title?.toLowerCase().includes(query);
        const matchesSummary = job.summary?.toLowerCase().includes(query);
        const skillsText = Array.isArray(job.skills)
          ? job.skills.join(' ')
          : String(job.skills || '');
        const matchesSkill = skillsText.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSummary && !matchesSkill) {
          return false;
        }
      }

      return true;
    });
  }, [jobs, searchTerm, selectedLocation, selectedCategory]);

  return (
    <section className="career-roles-section" id="open-roles">
      <div className="career-open-roles-header">
        <h2 className="career-open-roles-title">
          Currently open positions
        </h2>
        <p className="career-open-roles-subtitle">
          Find your place at KODEWAR. Work on live production platforms, high-velocity campaigns, and enterprise technology.
        </p>
        <div className="career-roles-count-pill">
          SHOWING {filteredJobs.length} OF {jobs.length} POSITIONS
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div style={{
          background: '#0B0B0D',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '48px 24px',
          textAlign: 'center',
        }}>
          <h3 style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: '20px',
            color: '#FFFFFF',
            marginBottom: '8px',
          }}>
            No open roles match your current filter.
          </h3>
          <p style={{ fontSize: '14px', color: '#8A8A8A', marginBottom: '24px' }}>
            Try clearing your search terms or expanding your selected location.
          </p>
          <button
            type="button"
            className="btn-career-secondary"
            onClick={onResetFilters}
            style={{ display: 'inline-flex' }}
          >
            RESET ALL FILTERS
          </button>
        </div>
      ) : (
        <div className="career-roles-list">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} onSelectRole={onSelectRole} />
          ))}
        </div>
      )}
    </section>
  );
}
