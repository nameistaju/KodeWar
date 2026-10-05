import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

/**
 * Bump this key whenever the default promotion poster changes.
 * Changing the key forces every browser — including first-time and returning
 * visitors — to discard any old localStorage data and re-seed from
 * DEFAULT_PROMOTIONS, which references the newest hashed asset URL.
 *
 * History:
 *  kodewar_promotions_v1 — original launch
 *  kodewar_promotions_v2 — first digital-growth poster
 *  kodewar_promotions_v3 — switched to hashed/versioned WebP (digital-growth-b4ca5d92.webp)
 */
const STORAGE_KEY = 'kodewar_promotions_v3';

/**
 * Default promotional offers to seed when localStorage is empty.
 * Uses content-hashed filenames inside /public/offers/ so that the
 * asset URL changes automatically whenever the image content changes,
 * busting CDN/browser cache without requiring a manual cache-clear.
 */
const DEFAULT_PROMOTIONS = [
  {
    id: 'promo-dussehra',
    title: 'Dussehra Special Offer',
    image: '/offers/dussehra-special.svg',
    imageName: 'dussehra-special.svg',
    destinationUrl: '/contact',
    openInNewTab: false,
    homepageBanner: false,
    popup: true,
    enabled: true,
    startDate: '',
    endDate: '',
    popupDelay: 3,
    popupFrequency: 'session', // 'session' | 'day' | 'always'
    autoClose: false,
    autoCloseDuration: 8,
    priority: 1,
    createdAt: '2026-10-01T10:00:00.000Z',
    updatedAt: '2026-10-01T10:00:00.000Z',
  },
  {
    id: 'promo-digital-growth',
    title: 'Digital Marketing Growth Campaign',
    // Content-hashed filename — update hash + copy file when poster changes.
    image: '/offers/digital-growth-b4ca5d92.webp',
    imageName: 'digital-growth-b4ca5d92.webp',
    destinationUrl: '/digital-marketing',
    openInNewTab: false,
    homepageBanner: true,
    popup: false,
    enabled: true,
    startDate: '',
    endDate: '',
    popupDelay: 4,
    popupFrequency: 'session',
    autoClose: false,
    autoCloseDuration: 8,
    priority: 1,
    createdAt: '2026-10-01T11:00:00.000Z',
    updatedAt: '2026-10-05T08:25:00.000Z',
  },
];

/**
 * Calculates dynamic promotion status based on enabled state and dates.
 * Returns: 'ACTIVE' | 'SCHEDULED' | 'EXPIRED' | 'DISABLED' | 'DRAFT'
 */
export function getPromotionStatus(promo, now = new Date()) {
  if (!promo || !promo.image) return 'DRAFT';
  if (!promo.enabled) return 'DISABLED';

  const currentTime = now.getTime();

  if (promo.startDate && promo.startDate.trim() !== '') {
    const start = new Date(promo.startDate).getTime();
    if (!isNaN(start) && currentTime < start) {
      return 'SCHEDULED';
    }
  }

  if (promo.endDate && promo.endDate.trim() !== '') {
    const end = new Date(promo.endDate).getTime();
    if (!isNaN(end) && currentTime > end) {
      return 'EXPIRED';
    }
  }

  return 'ACTIVE';
}

const PromotionContext = createContext(null);

export function PromotionProvider({ children }) {
  const [promotions, setPromotions] = useState(() => {
    // Clean up stale keys from previous versions so their data never resurfaces.
    try {
      localStorage.removeItem('kodewar_promotions_v1');
      localStorage.removeItem('kodewar_promotions_v2');
    } catch (_) { /* ignore */ }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load promotions from localStorage', e);
    }
    return DEFAULT_PROMOTIONS;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(promotions));
    } catch (e) {
      console.error('Failed to save promotions to localStorage', e);
    }
  }, [promotions]);

  // Promotions enriched with computed status
  const enrichedPromotions = useMemo(() => {
    const now = new Date();
    return promotions.map((p) => ({
      ...p,
      computedStatus: getPromotionStatus(p, now),
    }));
  }, [promotions]);

  // Active Homepage Banner Promotion:
  // Must have computedStatus === 'ACTIVE' and homepageBanner === true.
  // Sorted by priority (ascending 1..100) then updatedAt desc.
  const activeBannerPromotion = useMemo(() => {
    const bannerPromos = enrichedPromotions.filter(
      (p) => p.computedStatus === 'ACTIVE' && p.homepageBanner
    );
    if (bannerPromos.length === 0) return null;

    return [...bannerPromos].sort((a, b) => {
      const pDiff = (a.priority || 1) - (b.priority || 1);
      if (pDiff !== 0) return pDiff;
      return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
    })[0];
  }, [enrichedPromotions]);

  // Active Popup Promotion:
  // Must have computedStatus === 'ACTIVE' and popup === true.
  // Sorted by priority (ascending 1..100) then updatedAt desc.
  const activePopupPromotion = useMemo(() => {
    const popupPromos = enrichedPromotions.filter(
      (p) => p.computedStatus === 'ACTIVE' && p.popup
    );
    if (popupPromos.length === 0) return null;

    return [...popupPromos].sort((a, b) => {
      const pDiff = (a.priority || 1) - (b.priority || 1);
      if (pDiff !== 0) return pDiff;
      return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
    })[0];
  }, [enrichedPromotions]);

  // CRUD Actions
  const createPromotion = useCallback((promoData) => {
    const now = new Date().toISOString();
    const newPromo = {
      id: 'promo-' + Date.now(),
      title: promoData.title || 'Untitled Promotion',
      image: promoData.image || '',
      imageName: promoData.imageName || '',
      destinationUrl: promoData.destinationUrl || '',
      openInNewTab: Boolean(promoData.openInNewTab),
      homepageBanner: Boolean(promoData.homepageBanner),
      popup: promoData.popup !== undefined ? Boolean(promoData.popup) : true,
      enabled: promoData.enabled !== undefined ? Boolean(promoData.enabled) : true,
      startDate: promoData.startDate || '',
      endDate: promoData.endDate || '',
      popupDelay: Number(promoData.popupDelay) || 3,
      popupFrequency: promoData.popupFrequency || 'session',
      autoClose: Boolean(promoData.autoClose),
      autoCloseDuration: Number(promoData.autoCloseDuration) || 5,
      priority: Number(promoData.priority) || 1,
      createdAt: now,
      updatedAt: now,
    };

    setPromotions((prev) => [newPromo, ...prev]);
    return newPromo;
  }, []);

  const updatePromotion = useCallback((id, updatedFields) => {
    setPromotions((prev) =>
      prev.map((promo) => {
        if (promo.id === id) {
          return {
            ...promo,
            ...updatedFields,
            updatedAt: new Date().toISOString(),
          };
        }
        return promo;
      })
    );
  }, []);

  const deletePromotion = useCallback((id) => {
    setPromotions((prev) => prev.filter((promo) => promo.id !== id));
  }, []);

  const togglePromotionEnabled = useCallback((id) => {
    setPromotions((prev) =>
      prev.map((promo) => {
        if (promo.id === id) {
          return {
            ...promo,
            enabled: !promo.enabled,
            updatedAt: new Date().toISOString(),
          };
        }
        return promo;
      })
    );
  }, []);

  const duplicatePromotion = useCallback((id) => {
    setPromotions((prev) => {
      const source = prev.find((p) => p.id === id);
      if (!source) return prev;
      const now = new Date().toISOString();
      const duplicate = {
        ...source,
        id: 'promo-' + Date.now(),
        title: `${source.title} (Copy)`,
        createdAt: now,
        updatedAt: now,
      };
      return [duplicate, ...prev];
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    setPromotions(DEFAULT_PROMOTIONS);
  }, []);

  const value = useMemo(
    () => ({
      promotions: enrichedPromotions,
      activeBannerPromotion,
      activePopupPromotion,
      createPromotion,
      updatePromotion,
      deletePromotion,
      togglePromotionEnabled,
      duplicatePromotion,
      resetToDefaults,
    }),
    [
      enrichedPromotions,
      activeBannerPromotion,
      activePopupPromotion,
      createPromotion,
      updatePromotion,
      deletePromotion,
      togglePromotionEnabled,
      duplicatePromotion,
      resetToDefaults,
    ]
  );

  return (
    <PromotionContext.Provider value={value}>
      {children}
    </PromotionContext.Provider>
  );
}

export function usePromotions() {
  const context = useContext(PromotionContext);
  if (!context) {
    throw new Error('usePromotions must be used within a PromotionProvider');
  }
  return context;
}
