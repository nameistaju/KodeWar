import React from 'react';

export default function DMPerformance() {
  const steps = [
    {
      stage: '01',
      title: 'ATTENTION',
      metric: 'REACH & IMPRESSIONS',
      desc: 'Precision algorithmic targeting isolating in-market buyers.',
    },
    {
      stage: '02',
      title: 'CLICK',
      metric: 'HIGH CTR & LOW CPC',
      desc: 'Psychological ad creative provoking deliberate engagement.',
    },
    {
      stage: '03',
      title: 'LANDING PAGE',
      metric: 'TRAFFIC QUALITY & TIME',
      desc: 'Sub-second loading architecture eliminating friction.',
    },
    {
      stage: '04',
      title: 'LEAD',
      metric: 'VERIFIED INBOUND DATA',
      desc: 'High-intent capture forms and automated qualification.',
    },
    {
      stage: '05',
      title: 'CUSTOMER',
      metric: 'REVENUE & ROAS',
      desc: 'Closed deals and predictable unit economics at scale.',
    },
  ];

  return (
    <section className="dm-perf-section">
      <div className="dm-perf-inner">
        <div className="dm-section-head">
          <div>
            <div className="dm-hero-eyebrow" style={{ marginBottom: '14px' }}>
              <span className="dm-hero-dot" />
              <span>Unit Economics</span>
            </div>
            <h2>DON'T JUST SPEND.<br />PERFORM.</h2>
          </div>
          <p>
            Paid media without conversion architecture is just donated revenue. We engineer closed-loop acquisition funnels where every rupee invested is attributed to pipeline velocity.
          </p>
        </div>

        <div className="dm-perf-flow">
          {steps.map((st) => (
            <div key={st.stage} className="dm-flow-step">
              <span className="dm-flow-step-tag">STAGE {st.stage}</span>
              <h3 className="dm-flow-step-title">{st.title}</h3>
              <p style={{ fontSize: '13px', color: '#8A8A8A', lineHeight: 1.5 }}>{st.desc}</p>
              <div className="dm-flow-step-metric">{st.metric}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
