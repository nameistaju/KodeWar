import React, { useState, useEffect, useRef } from 'react';
import { usePromotions } from '../../context/PromotionContext';
import './offers.css';

/**
 * OfferPopup — Pure Digital Poster Viewer Modal
 *
 * Displays ONLY the uploaded promotional poster with its exact aspect ratio.
 * Controlled by PromotionContext (admin settings: delay, frequency, auto-close).
 * The only UI element added by the website is a small close "X" button in top-right.
 */
export default function OfferPopup() {
  const { activePopupPromotion } = usePromotions();
  const [isOpen, setIsOpen] = useState(false);
  const [hasDismissedThisVisit, setHasDismissedThisVisit] = useState(false);
  const previousActiveElement = useRef(null);
  const closeButtonRef = useRef(null);
  const autoCloseTimerRef = useRef(null);

  // Check frequency rules & trigger delayed opening
  useEffect(() => {
    if (!activePopupPromotion || !activePopupPromotion.image || hasDismissedThisVisit) {
      return;
    }

    const { id, popupFrequency = 'session', popupDelay = 3 } = activePopupPromotion;

    // Evaluate frequency
    try {
      if (popupFrequency === 'session') {
        const isDismissed = sessionStorage.getItem(`kwt_promo_${id}_dismissed`);
        if (isDismissed === 'true') {
          return;
        }
      } else if (popupFrequency === 'day') {
        const lastDismissedTime = localStorage.getItem(`kwt_promo_${id}_day`);
        if (lastDismissedTime) {
          const elapsed = Date.now() - parseInt(lastDismissedTime, 10);
          const oneDayMs = 24 * 60 * 60 * 1000;
          if (elapsed < oneDayMs) {
            return;
          }
        }
      }
    } catch {
      // Gracefully handle private browsing or storage exceptions
    }

    // Schedule appearance
    const delayMs = Math.max(1, Math.min(10, popupDelay)) * 1000;
    const timer = setTimeout(() => {
      previousActiveElement.current = document.activeElement;
      setIsOpen(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [activePopupPromotion, hasDismissedThisVisit]);

  // Handle auto-close timer when popup opens
  useEffect(() => {
    if (!isOpen || !activePopupPromotion) return;

    if (activePopupPromotion.autoClose) {
      const autoCloseMs = Math.max(3, Math.min(30, activePopupPromotion.autoCloseDuration || 5)) * 1000;
      autoCloseTimerRef.current = setTimeout(() => {
        handleClose();
      }, autoCloseMs);
    }

    return () => {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
    };
  }, [isOpen, activePopupPromotion]);

  // Handle body scroll locking and keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setHasDismissedThisVisit(true);

    if (!activePopupPromotion) return;

    const { id, popupFrequency = 'session' } = activePopupPromotion;
    try {
      if (popupFrequency === 'session') {
        sessionStorage.setItem(`kwt_promo_${id}_dismissed`, 'true');
      } else if (popupFrequency === 'day') {
        localStorage.setItem(`kwt_promo_${id}_day`, Date.now().toString());
      }
    } catch {
      // Ignore storage errors in private browsing
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen || !activePopupPromotion || !activePopupPromotion.image) {
    return null;
  }

  const { image, title, destinationUrl, openInNewTab } = activePopupPromotion;

  return (
    <div
      className="offer-popup-backdrop"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        className="offer-popup-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Promotional Poster'}
      >
        {/* Minimal Close "X" Button in top-right corner */}
        <button
          ref={closeButtonRef}
          type="button"
          className="offer-popup-close-btn"
          onClick={handleClose}
          aria-label="Close promotion"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Uploaded poster displayed EXACTLY as provided — NO text, NO buttons, NO cropping */}
        {destinationUrl ? (
          <a
            href={destinationUrl}
            target={openInNewTab ? '_blank' : '_self'}
            rel={openInNewTab ? 'noopener noreferrer' : undefined}
            className="offer-popup-link"
          >
            <img
              src={image}
              alt={title || 'Promotional Poster'}
              className="offer-poster-img"
            />
          </a>
        ) : (
          <img
            src={image}
            alt={title || 'Promotional Poster'}
            className="offer-poster-img"
          />
        )}
      </div>
    </div>
  );
}
