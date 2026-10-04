import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function WhyKodewar() {
  return (
    <section className="career-why-section" id="why-kodewar">
      <div className="career-why-inner">
        {/* 2-Column Studio Philosophy Showcase */}
        <div className="career-philosophy-showcase" style={{ marginBottom: 0 }}>
          <div className="career-philosophy-visual-wrap">
            <div className="career-philosophy-visual-backdrop" />
            <img
              src="/illus11.png"
              alt="Work Smarter, Together - Team Collaboration at Kodewar"
              className="career-philosophy-img"
              loading="lazy"
            />
          </div>

          <div className="career-philosophy-content">
            <h2 className="career-philosophy-title">
              Work Smarter, Together.
            </h2>
            <p className="career-philosophy-desc">
              Collaborate, write production code, and solve real engineering challenges alongside experienced engineers and product leaders. At KODEWAR, we believe in hands-on building, pair programming, and shipping high-impact software from day one.
            </p>

            <div className="career-philosophy-actions">
              <a href="#student-portal" className="btn-philosophy-primary">
                <span>Join the Incubator</span>
                <ArrowRight size={16} />
              </a>
              <a href="#open-roles" className="btn-philosophy-secondary">
                <span>Explore Open Roles</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
