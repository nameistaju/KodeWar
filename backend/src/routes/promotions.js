import express from 'express';
import { db } from '../config/db.js';

const router = express.Router();

// Helper to format promotion record for frontend consumption
export function formatPromotion(p) {
  if (!p) return null;
  return {
    id: p.id,
    title: p.title || '',
    image: p.image_url || p.image || '',
    imageUrl: p.image_url || p.image || '',
    cloudinaryPublicId: p.cloudinary_public_id || p.cloudinaryPublicId || '',
    destinationUrl: p.target_url || p.destinationUrl || '',
    openInNewTab: p.openInNewTab !== undefined ? Boolean(p.openInNewTab) : (p.open_in_new_tab !== undefined ? Boolean(p.open_in_new_tab) : false),
    homepageBanner: p.homepageBanner !== undefined ? Boolean(p.homepageBanner) : (p.placement === 'BANNER' || p.placement === 'BOTH' || p.homepage_banner),
    popup: p.popup !== undefined ? Boolean(p.popup) : (p.placement === 'POPUP' || p.placement === 'BOTH' || p.popup),
    enabled: p.is_active !== undefined ? Boolean(p.is_active) : (p.enabled !== undefined ? Boolean(p.enabled) : true),
    startDate: p.start_date || p.startDate || '',
    endDate: p.end_date || p.endDate || '',
    popupDelay: Number(p.popupDelay || p.popup_delay || 3),
    popupFrequency: p.display_frequency || p.popupFrequency || 'session',
    autoClose: Boolean(p.autoClose || p.auto_close),
    autoCloseDuration: Number(p.autoCloseDuration || p.auto_close_duration || 5),
    priority: Number(p.priority || 1),
    createdAt: p.created_at || p.createdAt || new Date().toISOString(),
    updatedAt: p.updated_at || p.updatedAt || new Date().toISOString(),
  };
}

// --------------------------------------------------
// GET /api/promotions
// Public endpoint for active promotions
// Cache-Control: strict no-cache/no-store to ensure immediate reflection
// --------------------------------------------------
router.get('/', async (req, res) => {
  // Prevent browser & CDN caching so newly updated promotions reflect instantly
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Surrogate-Control': 'no-store',
  });

  try {
    const list = (await db.get('promotions')) || [];
    const formatted = list
      .map(formatPromotion)
      .filter((p) => p && p.imageUrl)
      .sort((a, b) => {
        const pDiff = (a.priority || 1) - (b.priority || 1);
        if (pDiff !== 0) return pDiff;
        return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
      });

    return res.json({
      success: true,
      promotions: formatted,
    });
  } catch (err) {
    console.error('Fetch public promotions error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch promotions from server.',
    });
  }
});

export default router;
