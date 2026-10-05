import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const STORAGE_KEY = 'kodewar_promotions_v4_cloudinary';

/**
 * Authoritative default Cloudinary promotional assets.
 * Zero dependency on local static assets in /public/offers/ or Vercel static files.
 */
const DEFAULT_PROMOTIONS = [
  {
    id: 'promo-dussehra-special-2026',
    title: 'Dussehra Festival Special Offer',
    image: 'https://res.cloudinary.com/dazbkmdcq/image/upload/f_auto,q_auto/v1791216612/kodewar/promotions/dussehra-special-2026.jpg',
    imageUrl: 'https://res.cloudinary.com/dazbkmdcq/image/upload/f_auto,q_auto/v1791216612/kodewar/promotions/dussehra-special-2026.jpg',
    cloudinaryPublicId: 'kodewar/promotions/dussehra-special-2026',
    destinationUrl: '/contact',
    openInNewTab: false,
    homepageBanner: false,
    popup: true,
    enabled: true,
    startDate: '',
    endDate: '',
    popupDelay: 3,
    popupFrequency: 'session',
    autoClose: false,
    autoCloseDuration: 8,
    priority: 1,
    createdAt: '2026-10-01T10:00:00.000Z',
    updatedAt: '2026-10-05T16:00:00.000Z',
  },
  {
    id: 'promo-digital-growth-2026',
    title: 'Digital Marketing Growth Campaign 2026',
    image: 'https://res.cloudinary.com/dazbkmdcq/image/upload/f_auto,q_auto/v1791216610/kodewar/promotions/digital-growth-2026.jpg',
    imageUrl: 'https://res.cloudinary.com/dazbkmdcq/image/upload/f_auto,q_auto/v1791216610/kodewar/promotions/digital-growth-2026.jpg',
    cloudinaryPublicId: 'kodewar/promotions/digital-growth-2026',
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
    updatedAt: '2026-10-05T16:00:00.000Z',
  },
];

export function getPromotionStatus(promo, now = new Date()) {
  if (!promo || (!promo.image && !promo.imageUrl)) return 'DRAFT';
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
    // Purge outdated storage keys
    try {
      localStorage.removeItem('kodewar_promotions_v1');
      localStorage.removeItem('kodewar_promotions_v2');
      localStorage.removeItem('kodewar_promotions_v3');
    } catch (_) { /* ignore */ }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Filter out any obsolete /offers/ local paths
          const validOnly = parsed.filter((p) => p.image && !p.image.startsWith('/offers/'));
          if (validOnly.length > 0) return validOnly;
        }
      }
    } catch (e) {
      console.warn('Failed to load promotions from localStorage', e);
    }
    return DEFAULT_PROMOTIONS;
  });

  // Fetch promotions from backend API on mount
  useEffect(() => {
    let isMounted = true;
    async function fetchApiPromotions() {
      try {
        const res = await fetch(`${API_BASE_URL}/promotions`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && Array.isArray(data.promotions) && data.promotions.length > 0) {
          if (isMounted) {
            setPromotions(data.promotions);
          }
        }
      } catch (err) {
        console.warn('[PromotionContext] Could not fetch promotions from API, using cached state:', err);
      }
    }

    fetchApiPromotions();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync state to localStorage
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
      image: p.image || p.imageUrl || '',
      computedStatus: getPromotionStatus(p, now),
    }));
  }, [promotions]);

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
      id: promoData.id || 'promo-' + Date.now(),
      title: promoData.title || 'Untitled Promotion',
      image: promoData.imageUrl || promoData.image || '',
      imageUrl: promoData.imageUrl || promoData.image || '',
      cloudinaryPublicId: promoData.cloudinaryPublicId || '',
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
          const img = updatedFields.imageUrl || updatedFields.image || promo.image || promo.imageUrl;
          return {
            ...promo,
            ...updatedFields,
            image: img,
            imageUrl: img,
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
      setPromotions,
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
