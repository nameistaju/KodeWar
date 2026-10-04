import React, { useState, useEffect } from 'react';
import { TRAINING_PROGRAMS } from '../data/careerJobsData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function TrainingPlacement({ onFilterInternships }) {
  const [programs, setPrograms] = useState(TRAINING_PROGRAMS);

  useEffect(() => {
    let isMounted = true;
    const fetchPrograms = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/training`);
        if (res.ok) {
          const data = await res.json();
          if (data.training_programs && data.training_programs.length > 0 && isMounted) {
            setPrograms(data.training_programs);
          }
        }
      } catch (err) {
        console.warn('Using static training fallback:', err);
      }
    };
    fetchPrograms();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleScrollToRoles = (e) => {
    e.preventDefault();
    if (onFilterInternships) onFilterInternships();
    const elem = document.getElementById('open-roles');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="career-training-section" id="training-placement">
      <div className="career-training-inner">
        <div className="career-search-heading-row">
          <div>
            <h2 className="career-section-title">INDUSTRY TRAINING &amp; PLACEMENT.</h2>
          </div>
          <p className="career-section-desc">
            Bridge academic theory and production software engineering through immersive studio apprenticeships, verified client projects, and dedicated placement assistance.
          </p>
        </div>

        {/* Program Cards */}
        <div className="career-training-grid">
          {programs.map((prog) => {
            const skillsList = Array.isArray(prog.skills)
              ? prog.skills
              : typeof prog.skills === 'string'
              ? prog.skills.split(',').map((s) => s.trim()).filter(Boolean)
              : [];

            const highlightsList = Array.isArray(prog.highlights)
              ? prog.highlights
              : typeof prog.highlights === 'string'
              ? prog.highlights.split('\n').map((h) => h.trim()).filter(Boolean)
              : [
                  '100% production codebases, zero toy todo apps',
                  'Daily standups, peer code reviews, and Git collaboration',
                  'Comprehensive placement assistance & portfolio audit',
                  'Direct consideration for open KODEWAR engineering roles',
                ];

            return (
              <div key={prog.id} className="career-training-card">
                <div className="training-card-tag">{prog.badge || 'APPRENTICESHIP'}</div>
                <h3 className="training-card-title">{prog.title || prog.name}</h3>

                <div style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap',
                  margin: '8px 0 16px',
                  fontSize: '12px',
                  fontFamily: "'JetBrains Mono', monospace",
                  color: '#60A5FA',
                }}>
                  <span>⏱ {prog.duration}</span>
                  <span>•</span>
                  <span>📍 {prog.mode}</span>
                </div>

                <p className="training-card-desc">{prog.summary || prog.description}</p>

                {/* Skills Covered */}
                {skillsList.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '11px',
                      color: '#8A8A8A',
                      textTransform: 'uppercase',
                      marginBottom: '8px',
                      letterSpacing: '0.08em',
                    }}>
                      Skills Covered:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {skillsList.map((skill, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '11px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            padding: '3px 8px',
                            borderRadius: '3px',
                            color: '#E5E7EB',
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Eligibility / Who Can Apply */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '4px',
                  padding: '12px 14px',
                  fontSize: '12.5px',
                  color: '#9CA3AF',
                  marginBottom: '20px',
                }}>
                  <strong style={{ color: '#F3F4F6' }}>Eligibility: </strong>
                  {prog.whoCanApply || prog.eligibility || 'Students & aspiring practitioners seeking practical career preparation.'}
                </div>

                {/* Highlights */}
                <ul className="training-card-features">
                  {highlightsList.map((h, idx) => (
                    <li key={idx}>{h}</li>
                  ))}
                </ul>

                <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
                  <a
                    href="#open-roles"
                    onClick={handleScrollToRoles}
                    className="btn-career-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <span>APPLY FOR PROGRAM →</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
