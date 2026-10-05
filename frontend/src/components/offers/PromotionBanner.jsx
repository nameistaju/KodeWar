import React from 'react';
import { usePromotions } from '../../context/PromotionContext';
import './offers.css';

/**
 * PromotionBanner — Dedicated Homepage Advertising Slot
 *
 * Displays ONLY the uploaded promotional poster without distortion,
 * cropping, text overlays, or synthetic CTA buttons.
 * Renders null when no banner promotion is active.
 */
export default function PromotionBanner() {
  const { activeBannerPromotion } = usePromotions();

  if (!activeBannerPromotion || !activeBannerPromotion.image) {
    return null;
  }

  const { image, title, destinationUrl, openInNewTab } = activeBannerPromotion;

  const imageUrl = image || activeBannerPromotion.imageUrl;

  const content = (
    <img
      src={imageUrl}
      alt={title || 'Promotional Announcement'}
      className="promotion-banner-poster"
      decoding="async"
      loading="eager"
      fetchPriority="high"
      width="1672"
      height="941"
      style={{ aspectRatio: '1672 / 941' }}
    />
  );

  return (
    <section className="promotion-banner-section" aria-label="Featured Announcement">
      <div className="promotion-banner-inner">
        {destinationUrl ? (
          <a
            href={destinationUrl}
            target={openInNewTab ? '_blank' : '_self'}
            rel={openInNewTab ? 'noopener noreferrer' : undefined}
            className="promotion-banner-link"
            aria-label={title || 'View Promotion'}
          >
            {content}
          </a>
        ) : (
          <div className="promotion-banner-static">
            {content}
          </div>
        )}
      </div>
    </section>
  );
}
