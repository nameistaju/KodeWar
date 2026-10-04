import express from 'express';
import { db } from '../config/db.js';
import { authenticateUser } from '../middleware/auth.js';
import { uploadResume, validateUploadedResumeFile } from '../middleware/upload.js';
import { writeAuditLog } from '../services/auditService.js';
import { storageService } from '../services/storageService.js';

const router = express.Router();

// --------------------------------------------------
// POST /api/applications
// Submit new application with optional custom resume file
// --------------------------------------------------
async function handleApplicationSubmit(req, res) {
  try {
    const jobId = req.body.jobId || req.body.job_id;
    const requestedJobTitle = req.body.jobTitle || req.body.job_title;
    const requestedDepartment = req.body.department || '';
    const fullName = req.body.fullName || req.body.applicant_name || req.body.name || '';
    const email = req.body.email || req.body.applicant_email || '';
    const phone = req.body.phone || req.body.applicant_phone || '';
    const location = req.body.location || '';
    const education = req.body.education || '';
    const college = req.body.college || '';
    const gradYear = req.body.gradYear || req.body.graduation_year || '';
    const skills = req.body.skills || '';
    const experience = req.body.experience || req.body.years_experience || '';
    const linkedin = req.body.linkedin || req.body.linkedin_url || '';
    const github = req.body.github || req.body.github_url || '';
    const portfolio = req.body.portfolio || req.body.portfolio_url || '';
    const coverMessage = req.body.coverMessage || req.body.cover_letter || '';
    const useProfileResume = req.body.useProfileResume !== false;
      // 1. Validation

      if (!jobId) {
        return res.status(400).json({
          success: false,
          message: 'Target Job ID is required.',
        });
      }

      const job = await db.find('jobs', (j) => j.id === jobId);
      const isExpired = job?.deadline ? new Date(job.deadline) < new Date() : false;
      if (!job || job.status !== 'PUBLISHED' || isExpired) {
        return res.status(404).json({
          success: false,
          message: isExpired ? 'This position has closed.' : 'Job listing is no longer active.',
        });
      }

      const jobTitle = job.title || requestedJobTitle;
      const department = job.department || requestedDepartment || 'Technology';

      if (!fullName || !email || !phone) {
        return res.status(400).json({
          success: false,
          message: 'Full name, email, and phone number are required.',
        });
      }

      // 2. Prevent duplicate applications
      const existingApp = await db.find(
        'applications',
        (a) => a.candidate_id === req.user.id && a.job_id === jobId
      );

      if (existingApp) {
        return res.status(409).json({
          success: false,
          message: 'You have already submitted an application for this role.',
          applicationId: existingApp.id,
        });
      }

      // 3. Resolve resume
      const profile = await db.find('candidate_profiles', (p) => p.user_id === req.user.id);
      let resume_storage_path = '';
      let resume_filename = '';

      if (req.file) {
        // Candidate uploaded a dedicated resume for this application
        const storedResume = await storageService.persistUploadedResume(
          req.file,
          `applications/${req.user.id}/${jobId}`
        );
        resume_storage_path = storedResume.storagePath;
        resume_filename = req.file.originalname;

        // If candidate didn't have a profile resume yet, auto-set it
        if (!profile?.resume_storage_path) {
          await db.update('candidate_profiles', (p) => p.user_id === req.user.id, {
            resume_storage_path: storedResume.storagePath,
            resume_filename: req.file.originalname,
            resume_size: req.file.size,
            resume_uploaded_at: new Date().toISOString(),
          });
        }
      } else if (profile?.resume_storage_path) {
        resume_storage_path = profile.resume_storage_path;
        resume_filename = profile.resume_filename || 'profile_resume.pdf';
      } else {
        resume_filename = `${fullName.replace(/\s+/g, '_')}_Application_Profile.pdf`;
      }

      // 4. Create application record
      const applicationId = 'app_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
      const newApplication = await db.insert('applications', {
        id: applicationId,
        candidate_id: req.user.id,
        job_id: jobId,
        job_title: jobTitle,
        department,
        applicant_name: fullName.trim(),
        applicant_email: email.trim().toLowerCase(),
        applicant_phone: phone.trim(),
        candidate_name: fullName.trim(),
        candidate_email: email.trim().toLowerCase(),
        candidate_phone: phone.trim(),
        location: location || '',
        college: college || '',
        education: education || '',
        graduation_year: gradYear || '',
        skills: skills ? (typeof skills === 'string' ? skills.split(',').map((s) => s.trim()) : skills) : [],
        experience: experience || '',
        linkedin: linkedin || '',
        linkedin_url: linkedin || '',
        github: github || '',
        github_url: github || '',
        portfolio: portfolio || '',
        portfolio_url: portfolio || '',
        resume_storage_path,
        resume_filename,
        cover_letter: coverMessage || '',
        cover_message: coverMessage || '',
        status: 'APPLIED',
        applied_at: new Date().toISOString(),
      });

      await writeAuditLog(req, {
        action: 'APPLICATION_CREATED',
        entityType: 'application',
        entityId: newApplication.id,
        metadata: {
          job_id: jobId,
          job_title: jobTitle,
          resume_snapshot: Boolean(resume_storage_path),
        },
      });

      // Also update candidate profile details if profile was empty
      if (profile) {
        await db.update('candidate_profiles', (p) => p.user_id === req.user.id, {
          full_name: profile.full_name || fullName.trim(),
          phone: profile.phone || phone.trim(),
          location: profile.location || location,
          college: profile.college || college,
          graduation_year: profile.graduation_year || gradYear,
          linkedin: profile.linkedin || linkedin,
          github: profile.github || github,
          portfolio: profile.portfolio || portfolio,
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Application received successfully.',
        application: newApplication,
      });
    } catch (createErr) {
      console.error('Error submitting application:', createErr);
      return res.status(500).json({
        success: false,
        message: 'Failed to process application. Please try again.',
      });
    }
}

// Route definition
router.post('/', authenticateUser, async (req, res) => {
  if (req.is('multipart/form-data')) {
    uploadResume.single('resume')(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || 'Resume upload failed (Max 10MB, PDF/DOC/DOCX).',
        });
      }
      if (req.file) {
        const signature = validateUploadedResumeFile(req.file);
        if (!signature.ok) {
          return res.status(400).json({
            success: false,
            message: signature.message,
          });
        }
      }
      handleApplicationSubmit(req, res);
    });
  } else {
    handleApplicationSubmit(req, res);
  }
});


// --------------------------------------------------
// GET /api/applications
// List all applications for current candidate
// --------------------------------------------------
router.get('/', authenticateUser, async (req, res) => {
  try {
    const list = await db.filter('applications', (a) => a.candidate_id === req.user.id);
    const sanitized = list.map((a) => {
      const copy = { ...a };
      if (req.user.role !== 'ADMIN') delete copy.admin_notes;
      return copy;
    });
    return res.json({
      success: true,
      applications: sanitized,
    });
  } catch (err) {
    console.error('Fetch applications error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving applications.' });
  }
});

// --------------------------------------------------
// GET /api/applications/:id
// Get single application details
// --------------------------------------------------
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const app = await db.find('applications', (a) => a.id === req.params.id);
    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    // Security: Only candidate who owns it OR admin can access
    if (app.candidate_id !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const sanitized = { ...app };
    if (req.user.role !== 'ADMIN') {
      delete sanitized.admin_notes;
    }

    await writeAuditLog(req, {
      action: 'APPLICATION_VIEWED',
      entityType: 'application',
      entityId: app.id,
      metadata: { job_id: app.job_id },
    });

    return res.json({
      success: true,
      application: sanitized,
    });
  } catch (err) {
    console.error('Fetch single application error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving application.' });
  }
});


// --------------------------------------------------
// GET /api/applications/:id/resume
// Stream download of resume used for this specific application
// --------------------------------------------------
router.get('/:id/resume', authenticateUser, async (req, res) => {
  try {
    const app = await db.find('applications', (a) => a.id === req.params.id);
    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    // Security check
    if (app.candidate_id !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    if (!storageService.exists(app.resume_storage_path)) {
      return res.status(404).json({
        success: false,
        message: 'Resume document not available on server.',
      });
    }

    await writeAuditLog(req, {
      action: 'RESUME_DOWNLOADED',
      entityType: 'application',
      entityId: app.id,
      metadata: { job_id: app.job_id, filename: app.resume_filename },
    });

    return storageService.sendDownload(res, app.resume_storage_path, app.resume_filename || 'resume.pdf');
  } catch (err) {
    console.error('Download application resume error:', err);
    return res.status(500).json({ success: false, message: 'Server error downloading resume.' });
  }
});

export default router;
