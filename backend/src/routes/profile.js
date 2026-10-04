import express from 'express';
import path from 'path';
import fs from 'fs';
import { db } from '../config/db.js';
import { authenticateUser } from '../middleware/auth.js';
import { uploadResume, validateUploadedResumeFile } from '../middleware/upload.js';
import { writeAuditLog } from '../services/auditService.js';
import { storageService } from '../services/storageService.js';

const router = express.Router();

// --------------------------------------------------
// GET /api/profile
// --------------------------------------------------
router.get('/', authenticateUser, async (req, res) => {
  try {
    const profile = await db.find('candidate_profiles', (p) => p.user_id === req.user.id);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found.',
      });
    }

    return res.json({
      success: true,
      profile,
    });
  } catch (err) {
    console.error('Fetch profile error:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching profile.' });
  }
});

// --------------------------------------------------
// PUT /api/profile
// --------------------------------------------------
router.put('/', authenticateUser, async (req, res) => {
  try {
    const allowedFields = [
      'full_name',
      'phone',
      'location',
      'college',
      'degree',
      'field',
      'graduation_year',
      'skills',
      'experience',
      'current_role',
      'linkedin',
      'github',
      'portfolio',
    ];

    const updates = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const updated = await db.update(
      'candidate_profiles',
      (p) => p.user_id === req.user.id,
      updates
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found.',
      });
    }

    await writeAuditLog(req, {
      action: 'PROFILE_UPDATED',
      entityType: 'candidate_profile',
      entityId: updated.id,
      metadata: { fields: Object.keys(updates) },
    });

    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      profile: updated,
    });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ success: false, message: 'Server error updating profile.' });
  }
});

// --------------------------------------------------
// POST /api/profile/resume
// Upload or replace candidate primary resume
// --------------------------------------------------
router.post('/resume', authenticateUser, async (req, res) => {
  uploadResume.single('resume')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload failed. Max size is 10MB (PDF, DOC, DOCX).',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No resume file provided.',
      });
    }

    const signature = validateUploadedResumeFile(req.file);
    if (!signature.ok) {
      return res.status(400).json({
        success: false,
        message: signature.message,
      });
    }

    try {
      const storedResume = await storageService.persistUploadedResume(req.file, `profiles/${req.user.id}`);
      
      // If candidate already had an old resume on file, we can keep historical files or clean up non-referenced ones
      const updated = await db.update(
        'candidate_profiles',
        (p) => p.user_id === req.user.id,
        {
          resume_storage_path: storedResume.storagePath,
          resume_filename: req.file.originalname,
          resume_size: req.file.size,
          resume_uploaded_at: new Date().toISOString(),
        }
      );

      await writeAuditLog(req, {
        action: 'RESUME_UPLOADED',
        entityType: 'candidate_profile',
        entityId: updated?.id || '',
        metadata: {
          filename: req.file.originalname,
          size: req.file.size,
          storage_provider: storedResume.provider,
        },
      });

      return res.json({
        success: true,
        message: 'Resume uploaded successfully.',
        resume: {
          filename: req.file.originalname,
          size: req.file.size,
          uploadedAt: new Date().toISOString(),
        },
        profile: updated,
      });
    } catch (dbErr) {
      console.error('DB error saving resume:', dbErr);
      return res.status(500).json({ success: false, message: 'Failed to record resume file.' });
    }
  });
});

// --------------------------------------------------
// GET /api/profile/resume
// Download candidate's own resume
// --------------------------------------------------
router.get('/resume', authenticateUser, async (req, res) => {
  try {
    const profile = await db.find('candidate_profiles', (p) => p.user_id === req.user.id);
    if (!profile || !profile.resume_storage_path) {
      return res.status(404).json({
        success: false,
        message: 'No resume on file.',
      });
    }

    if (!storageService.exists(profile.resume_storage_path)) {
      return res.status(404).json({
        success: false,
        message: 'Resume file not found on server.',
      });
    }

    await writeAuditLog(req, {
      action: 'RESUME_DOWNLOADED',
      entityType: 'candidate_profile',
      entityId: profile.id,
      metadata: { filename: profile.resume_filename },
    });

    return storageService.sendDownload(res, profile.resume_storage_path, profile.resume_filename || 'resume.pdf');
  } catch (err) {
    console.error('Download resume error:', err);
    return res.status(500).json({ success: false, message: 'Server error downloading resume.' });
  }
});

export default router;
