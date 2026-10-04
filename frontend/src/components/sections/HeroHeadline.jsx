import React, { useState, useEffect } from 'react';

export default function HeroHeadline() {
  const [lang, setLang] = useState('te'); // 'te' = Telugu, 'en' = English

  useEffect(() => {
    // Cycle between Telugu and English automatically
    // Telugu displays for 4.2s -> transitions to English (displays for 6.0s) -> repeats
    let timeoutId;

    const scheduleNext = (current) => {
      const duration = current === 'te' ? 4200 : 6200;
      timeoutId = setTimeout(() => {
        setLang((prev) => (prev === 'te' ? 'en' : 'te'));
      }, duration);
    };

    scheduleNext(lang);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [lang]);

  return (
    <div className="hero-headline-container">
      <div className="hero-headline-stack">
        {/* TELUGU VERSION */}
        <h1
          className={`hero-headline-layer telugu-layer ${lang === 'te' ? 'is-active' : 'is-hidden-up'}`}
          lang="te"
          aria-hidden={lang !== 'te'}
        >
          <span className="headline-line te-line-1">మీ బిజినెస్</span>
          <span className="headline-line te-line-2">పెరగాలంటే...</span>
        </h1>

        {/* ENGLISH VERSION */}
        <h1
          className={`hero-headline-layer english-layer ${lang === 'en' ? 'is-active' : 'is-hidden-down'}`}
          lang="en"
          aria-hidden={lang !== 'en'}
        >
          <span className="headline-line en-line-1">YOUR BUSINESS</span>
          <span className="headline-line en-line-2">NEEDS TO GROW.</span>
        </h1>
      </div>
    </div>
  );
}
