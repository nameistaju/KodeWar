import express from 'express';
import { db } from '../config/db.js';

const router = express.Router();

// --------------------------------------------------
// GET /api/jobs
// Publicly available jobs: status === 'PUBLISHED' and deadline has not passed
// --------------------------------------------------
router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const allJobs = await db.get('jobs') || [];

    const publishedJobs = allJobs.filter((job) => {
      if (job.status !== 'PUBLISHED') return false;
      if (job.deadline) {
        const deadlineDate = new Date(job.deadline);
        // If deadline is valid date and has passed, exclude from public listing
        if (!isNaN(deadlineDate.getTime()) && deadlineDate < now) {
          return false;
        }
      }
      return true;
    });

    return res.json({
      success: true,
      jobs: publishedJobs,
      total: publishedJobs.length,
    });
  } catch (err) {
    console.error('Fetch public jobs error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving jobs.' });
  }
});

// --------------------------------------------------
// GET /api/jobs/:id
// Publicly view single job details
// --------------------------------------------------
router.get('/:id', async (req, res) => {
  try {
    const job = await db.find('jobs', (j) => j.id === req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    const now = new Date();
    const isExpired = job.deadline ? new Date(job.deadline) < now : false;

    // Check if published
    if (job.status !== 'PUBLISHED' || isExpired) {
      return res.status(404).json({
        success: false,
        message: isExpired ? 'This position has closed.' : 'Job listing is no longer active.',
        job: { ...job, isClosed: true },
      });
    }

    return res.json({
      success: true,
      job,
    });
  } catch (err) {
    console.error('Fetch single job error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving job.' });
  }
});

export default router;
