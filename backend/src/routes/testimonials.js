import express from 'express';
import { db } from '../config/db.js';

const router = express.Router();

// --------------------------------------------------
// GET /api/testimonials
// Publicly list published candidate testimonials
// --------------------------------------------------
router.get('/', async (req, res) => {
  try {
    const all = await db.get('testimonials') || [];
    const published = all.filter((t) => t.status === 'PUBLISHED');

    return res.json({
      success: true,
      testimonials: published,
      total: published.length,
    });
  } catch (err) {
    console.error('Fetch testimonials error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving testimonials.' });
  }
});

export default router;
