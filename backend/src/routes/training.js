import express from 'express';
import { db } from '../config/db.js';

const router = express.Router();

// --------------------------------------------------
// GET /api/training
// Publicly list published training programs
// --------------------------------------------------
router.get('/', async (req, res) => {
  try {
    const all = await db.get('training_programs') || [];
    const published = all.filter((p) => p.status === 'PUBLISHED');

    return res.json({
      success: true,
      training_programs: published,
      total: published.length,
    });
  } catch (err) {
    console.error('Fetch training programs error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving training programs.' });
  }
});

// --------------------------------------------------
// GET /api/training/:id
// Publicly view single training program
// --------------------------------------------------
router.get('/:id', async (req, res) => {
  try {
    const item = await db.find('training_programs', (p) => p.id === req.params.id);
    if (!item || item.status !== 'PUBLISHED') {
      return res.status(404).json({ success: false, message: 'Training program not found.' });
    }

    return res.json({
      success: true,
      training_program: item,
    });
  } catch (err) {
    console.error('Fetch single training program error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving training program.' });
  }
});

export default router;
