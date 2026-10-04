import React from 'react';

export default function CareerTeam() {
  return (
    <section className="career-team-section" id="team">
      <div className="career-team-inner">
        <div className="career-team-header-row">
          <div className="career-team-header-left">
            <h2 className="career-team-main-title">
              Meet the team behind our success
            </h2>
          </div>
          <div className="career-team-header-right">
            <p className="career-team-header-desc">
              Our studio brings together ambitious engineers, designers, and problem-solvers dedicated to high-standard execution. From complex client engineering to incubating the next wave of tech talent, every breakthrough is driven by our collaborative culture.
            </p>
          </div>
        </div>

        <div className="career-team-banner-wrapper">
          <img
            src="/teamGroup.png"
            alt="KODEWAR Team - The people behind our success"
            className="career-team-banner-img"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
