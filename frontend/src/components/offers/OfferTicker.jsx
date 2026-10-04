import React from 'react';
import { Link } from 'react-router-dom';
import { getActiveTickerData } from '../../data/offerData';
import './offers.css';

export default function OfferTicker() {
  const tickerData = getActiveTickerData();

  if (!tickerData) return null;

  const isExternal = tickerData.ctaUrl.startsWith('http') || tickerData.ctaUrl.startsWith('mailto:') || tickerData.ctaUrl.startsWith('tel:');

  const content = (
    <div className="offer-ticker-track" aria-hidden="true">
      {/* Repeating segments for smooth continuous marquee loop */}
      {[0, 1, 2, 3].map((idx) => (
        <span key={idx} className="offer-ticker-segment">
          <span className="offer-ticker-badge">SPECIAL</span>
          <span>DUSSEHRA SPECIAL</span>
          <span className="offer-ticker-bullet">•</span>
          <span>DIGITAL GROWTH PACKAGES</span>
          <span className="offer-ticker-bullet">•</span>
          <span>LIMITED-TIME COMMISSIONS</span>
          <span className="offer-ticker-bullet">•</span>
          <span className="offer-ticker-arrow">START A PROJECT →</span>
        </span>
      ))}
    </div>
  );

  if (isExternal) {
    return (
      <aside aria-label="Promotional Announcement">
        <a
          href={tickerData.ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="offer-ticker-strip"
        >
          {content}
        </a>
      </aside>
    );
  }

  return (
    <aside aria-label="Promotional Announcement">
      <Link to={tickerData.ctaUrl} className="offer-ticker-strip">
        {content}
      </Link>
    </aside>
  );
}
