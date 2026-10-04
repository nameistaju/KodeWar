/**
 * KODEWAR — PROMOTIONAL OFFER DATA & API ABSTRACTION
 * 
 * Digital Poster Viewer Specification:
 * The future admin panel only manages:
 * - image (uploaded poster)
 * - active (boolean status)
 * - startDate (optional ISO string)
 * - endDate (optional ISO string)
 * - displayDelay (milliseconds before showing)
 *
 * All promotional text, titles, discounts, and visual elements are inside
 * the uploaded poster itself.
 */

export const INITIAL_OFFERS = [
  {
    id: "poster-001",
    image: "/offers/dussehra-special.svg", // Portrait poster example (800 x 1000)
    active: true,
    startDate: "", // Empty string means always available
    endDate: "",
    displayDelay: 5000 // 5 seconds
  },
  {
    id: "poster-002",
    image: "/offers/digital-growth.png", // Landscape poster example (1672 x 941)
    active: true,
    startDate: "",
    endDate: "",
    displayDelay: 5000
  }
];

/**
 * Validates if an offer is currently active based on:
 * 1. active === true
 * 2. currentDate >= startDate (if startDate provided)
 * 3. currentDate <= endDate (if endDate provided)
 */
export function isOfferActive(offer, referenceDate = new Date()) {
  if (!offer || !offer.active || !offer.image) return false;

  const now = referenceDate.getTime();

  if (offer.startDate && offer.startDate.trim() !== '') {
    const start = new Date(offer.startDate).getTime();
    if (!isNaN(start) && now < start) return false;
  }

  if (offer.endDate && offer.endDate.trim() !== '') {
    const end = new Date(offer.endDate).getTime();
    if (!isNaN(end) && now > end) return false;
  }

  return true;
}

/**
 * Returns all currently valid and active promotional offers.
 * Future admin enhancement: replace with fetch('/api/offers')
 */
export function getActiveOffers(offers = INITIAL_OFFERS) {
  return offers.filter(offer => isOfferActive(offer));
}

/**
 * Randomly selects one offer from active offers for session display.
 * Returns null if no active offers exist.
 */
export function getRandomActiveOffer(offers = INITIAL_OFFERS) {
  const active = getActiveOffers(offers);
  if (!active || active.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * active.length);
  return active[randomIndex];
}

/**
 * Announcement ticker configuration
 */
export function getActiveTickerData() {
  return {
    ctaUrl: "/contact"
  };
}
