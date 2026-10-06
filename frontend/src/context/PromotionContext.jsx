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

function getAuthHeaders() {
  const token = localStorage.getItem('kwt_candidate_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function PromotionProvider({ children }) {
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // Purge obsolete localStorage promotion caches on startup
  useEffect(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('kodewar_promotions_v1');
      localStorage.removeItem('kodewar_promotions_v2');
      localStorage.removeItem('kodewar_promotions_v3');
    } catch (_) { /* ignore */ }
  }, []);

  // Fetch promotions from authoritative backend API
  const fetchPromotions = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/promotions?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache',
        },
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.success && Array.isArray(data.promotions)) {
        setPromotions(data.promotions);
      } else {
        throw new Error(data.message || 'Invalid promotions payload received');
      }
    } catch (err) {
      console.error('[PromotionContext] Failed to fetch promotions from API:', err);
      setApiError('Unable to connect to the KODEWAR server.');

      // Development-only fallback: only show starter posters in local development mode
      if (import.meta.env.DEV) {
        console.warn('[PromotionContext] DEV fallback: Using default starter templates.');
        setPromotions(DEFAULT_PROMOTIONS);
      } else {
        // In production: NEVER silently overwrite with hardcoded defaults.
        setPromotions([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

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

  // CRUD Actions — Persisted through Backend API
  const createPromotion = useCallback(async (promoData) => {
    const res = await fetch(`${API_BASE_URL}/admin/promotions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(promoData),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Promotion could not be saved to server.');
    }

    const created = data.promotion;
    setPromotions((prev) => [created, ...prev.filter((p) => p.id !== created.id)]);
    return created;
  }, []);

  const updatePromotion = useCallback(async (id, updatedFields) => {
    const res = await fetch(`${API_BASE_URL}/admin/promotions/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updatedFields),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Promotion could not be updated on server.');
    }

    const updated = data.promotion;
    setPromotions((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  }, []);

  const deletePromotion = useCallback(async (id) => {
    const res = await fetch(`${API_BASE_URL}/admin/promotions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to delete promotion on server.');
    }

    setPromotions((prev) => prev.filter((promo) => promo.id !== id));
    return true;
  }, []);

  const togglePromotionEnabled = useCallback(async (id) => {
    const current = promotions.find((p) => p.id === id);
    if (!current) return;
    return updatePromotion(id, { enabled: !current.enabled });
  }, [promotions, updatePromotion]);

  const duplicatePromotion = useCallback(async (id) => {
    const source = promotions.find((p) => p.id === id);
    if (!source) return;
    const duplicatePayload = {
      ...source,
      id: undefined,
      title: `${source.title} (Copy)`,
    };
    return createPromotion(duplicatePayload);
  }, [promotions, createPromotion]);

  const refreshPromotions = useCallback(() => {
    return fetchPromotions();
  }, [fetchPromotions]);

  const resetToDefaults = useCallback(() => {
    setPromotions(DEFAULT_PROMOTIONS);
  }, []);

  const value = useMemo(
    () => ({
      promotions: enrichedPromotions,
      activeBannerPromotion,
      activePopupPromotion,
      isLoading,
      apiError,
      createPromotion,
      updatePromotion,
      deletePromotion,
      togglePromotionEnabled,
      duplicatePromotion,
      refreshPromotions,
      resetToDefaults,
      setPromotions,
    }),
    [
      enrichedPromotions,
      activeBannerPromotion,
      activePopupPromotion,
      isLoading,
      apiError,
      createPromotion,
      updatePromotion,
      deletePromotion,
      togglePromotionEnabled,
      duplicatePromotion,
      refreshPromotions,
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
