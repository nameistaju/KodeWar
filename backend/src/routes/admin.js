import express from 'express';
import fs from 'fs';
import path from 'path';
import { db } from '../config/db.js';
import { authenticateUser, requireAdmin } from '../middleware/auth.js';
import { storageService } from '../services/storageService.js';
import { queryAuditLogs, writeAuditLog } from '../services/auditService.js';

const router = express.Router();

// Apply admin authentication to all routes in this router
router.use(authenticateUser);
router.use(requireAdmin);

// ==================================================
// 0. AUDIT LOGS
// GET /api/admin/audit-logs
// ==================================================
router.get('/audit-logs', async (req, res) => {
  try {
    const result = await queryAuditLogs(req.query);
    return res.json({
      success: true,
      audit_logs: result.logs,
      pagination: result.pagination,
    });
  } catch (err) {
    console.error('Admin audit logs error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving audit logs.' });
  }
});

// ==================================================
// 1. OVERVIEW METRICS
// GET /api/admin/overview
// ==================================================
router.get('/overview', async (req, res) => {
  try {
    const jobs = await db.get('jobs') || [];
    const applications = await db.get('applications') || [];
    const profiles = await db.get('candidate_profiles') || [];
    const training = await db.get('training_programs') || [];
    const users = await db.get('users') || [];

    const now = new Date();

    // 1. Open Jobs: published and deadline hasn't passed
    const openJobs = jobs.filter((j) => {
      if (j.status !== 'PUBLISHED') return false;
      if (j.deadline) {
        const d = new Date(j.deadline);
        if (!isNaN(d.getTime()) && d < now) return false;
      }
      return true;
    });

    // 2. Applications Counts
    const totalApplications = applications.length;
    const newApplications = applications.filter((a) => a.status === 'APPLIED').length;

    // 3. Unique Candidates count
    const candidateUsers = users.filter((u) => u.role === 'CANDIDATE');
    const totalCandidates = candidateUsers.length;

    // 4. Training Programs count
    const activeTraining = training.filter((t) => t.status === 'PUBLISHED').length;

    // 5. Recent Applications (Latest 5, enriched with profile & job)
    const recentApplications = [...applications]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5)
      .map((app) => {
        const prof = profiles.find((p) => p.user_id === app.candidate_id);
        const job = jobs.find((j) => j.id === app.job_id);
        return {
          ...app,
          candidate_name: app.applicant_name || prof?.full_name || 'Candidate',
          candidate_email: app.applicant_email || prof?.email || '',
          job_title: app.job_title || job?.title || 'Open Role',
        };
      });

    // 6. Active Jobs (with real application count)
    const activeJobsList = openJobs.map((job) => {
      const appCount = applications.filter((a) => a.job_id === job.id).length;
      return {
        id: job.id,
        title: job.title,
        department: job.department,
        status: job.status,
        deadline: job.deadline || 'Ongoing',
        applications_count: appCount,
      };
    });

    return res.json({
      success: true,
      metrics: {
        open_jobs_count: openJobs.length,
        total_applications_count: totalApplications,
        new_applications_count: newApplications,
        candidates_count: totalCandidates,
        training_programs_count: activeTraining,
      },
      recent_applications: recentApplications,
      active_jobs: activeJobsList,
    });
  } catch (err) {
    console.error('Admin overview error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving overview metrics.' });
  }
});

// ==================================================
// 2. JOB MANAGEMENT
// ==================================================

// GET /api/admin/jobs
router.get('/jobs', async (req, res) => {
  try {
    const { status, department, location, q } = req.query;
    let list = await db.get('jobs') || [];
    const applications = await db.get('applications') || [];
    const now = new Date();

    // Map each job with computed fields
    list = list.map((job) => {
      const isExpired = job.deadline ? new Date(job.deadline) < now : false;
      const appCount = applications.filter((a) => a.job_id === job.id).length;
      let displayStatus = job.status;
      if (job.status === 'PUBLISHED' && isExpired) {
        displayStatus = 'CLOSED'; // automatically treat expired as closed
      }
      return {
        ...job,
        is_expired: isExpired,
        display_status: displayStatus,
        applications_count: appCount,
      };
    });

    // Filtering
    if (status && status !== 'ALL') {
      list = list.filter((j) => j.status === status || j.display_status === status);
    }
    if (department && department !== 'ALL') {
      list = list.filter((j) => j.department?.toLowerCase() === department.toLowerCase());
    }
    if (location && location !== 'ALL') {
      list = list.filter((j) => j.location?.toLowerCase().includes(location.toLowerCase()));
    }
    if (q) {
      const query = q.toLowerCase().trim();
      list = list.filter(
        (j) =>
          j.title?.toLowerCase().includes(query) ||
          j.department?.toLowerCase().includes(query) ||
          j.skills?.toLowerCase?.().includes(query)
      );
    }

    // Sort by created_at desc
    list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return res.json({
      success: true,
      jobs: list,
      total: list.length,
    });
  } catch (err) {
    console.error('Admin fetch jobs error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving jobs.' });
  }
});

// GET /api/admin/jobs/:id
router.get('/jobs/:id', async (req, res) => {
  try {
    const job = await db.find('jobs', (j) => j.id === req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }
    const applications = await db.filter('applications', (a) => a.job_id === job.id);
    return res.json({
      success: true,
      job: {
        ...job,
        applications_count: applications.length,
      },
    });
  } catch (err) {
    console.error('Admin get single job error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving job.' });
  }
});

// POST /api/admin/jobs
router.post('/jobs', async (req, res) => {
  try {
    const {
      title,
      department,
      location,
      employment_type,
      workplace_type,
      experience_level,
      salary_range,
      summary,
      about_role,
      responsibilities,
      requirements,
      skills,
      benefits,
      deadline,
      status,
      featured,
    } = req.body;

    // Validate required fields
    if (!title || !department || !location || !employment_type || !summary) {
      return res.status(400).json({
        success: false,
        message: 'Job title, department, location, employment type, and short summary are required.',
      });
    }

    const validStatus = ['DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED'].includes(status)
      ? status
      : 'DRAFT';

    const slugId =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      Date.now().toString(36);

    const newJob = await db.insert('jobs', {
      id: slugId,
      title: title.trim(),
      department: department.trim(),
      location: location.trim(),
      employment_type: employment_type.trim(),
      workplace_type: workplace_type || 'Hybrid',
      experience_level: experience_level || '1–3 Years',
      salary_range: salary_range || '',
      summary: summary.trim(),
      about_role: about_role || '',
      responsibilities: responsibilities || '',
      requirements: requirements || '',
      skills: skills || '',
      benefits: benefits || '',
      deadline: deadline || '',
      status: validStatus,
      featured: !!featured,
    });

    return res.status(201).json({
      success: true,
      message: `Job ${validStatus === 'PUBLISHED' ? 'published' : 'saved as draft'} successfully.`,
      job: newJob,
    });
  } catch (err) {
    console.error('Admin create job error:', err);
    return res.status(500).json({ success: false, message: 'Server error creating job.' });
  }
});

// PUT /api/admin/jobs/:id
router.put('/jobs/:id', async (req, res) => {
  try {
    const existing = await db.find('jobs', (j) => j.id === req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    const {
      title,
      department,
      location,
      employment_type,
      workplace_type,
      experience_level,
      salary_range,
      summary,
      about_role,
      responsibilities,
      requirements,
      skills,
      benefits,
      deadline,
      status,
      featured,
    } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (department !== undefined) updates.department = department.trim();
    if (location !== undefined) updates.location = location.trim();
    if (employment_type !== undefined) updates.employment_type = employment_type.trim();
    if (workplace_type !== undefined) updates.workplace_type = workplace_type;
    if (experience_level !== undefined) updates.experience_level = experience_level;
    if (salary_range !== undefined) updates.salary_range = salary_range;
    if (summary !== undefined) updates.summary = summary.trim();
    if (about_role !== undefined) updates.about_role = about_role;
    if (responsibilities !== undefined) updates.responsibilities = responsibilities;
    if (requirements !== undefined) updates.requirements = requirements;
    if (skills !== undefined) updates.skills = skills;
    if (benefits !== undefined) updates.benefits = benefits;
    if (deadline !== undefined) updates.deadline = deadline;
    if (status !== undefined) updates.status = status;
    if (featured !== undefined) updates.featured = !!featured;

    const updated = await db.update('jobs', (j) => j.id === req.params.id, updates);

    return res.json({
      success: true,
      message: 'Job details updated successfully.',
      job: updated,
    });
  } catch (err) {
    console.error('Admin update job error:', err);
    return res.status(500).json({ success: false, message: 'Server error updating job.' });
  }
});

// PUT /api/admin/jobs/:id/status
router.put('/jobs/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid job status.' });
    }

    const updated = await db.update('jobs', (j) => j.id === req.params.id, { status });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    return res.json({
      success: true,
      message: `Job status transitioned to ${status}.`,
      job: updated,
    });
  } catch (err) {
    console.error('Admin job status update error:', err);
    return res.status(500).json({ success: false, message: 'Server error updating status.' });
  }
});

// DELETE /api/admin/jobs/:id (Safe archive / soft delete if applications exist)
router.delete('/jobs/:id', async (req, res) => {
  try {
    const existing = await db.find('jobs', (j) => j.id === req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    const linkedApps = await db.filter('applications', (a) => a.job_id === req.params.id);

    // If job has linked candidate applications, soft-delete by archiving to preserve history
    if (linkedApps.length > 0) {
      const archived = await db.update('jobs', (j) => j.id === req.params.id, {
        status: 'ARCHIVED',
        archived_at: new Date().toISOString(),
      });
      return res.json({
        success: true,
        message: `Job has ${linkedApps.length} active application(s). Archived to preserve candidate history.`,
        action: 'ARCHIVED',
        job: archived,
      });
    }

    // If zero applications, safe to remove completely
    await db.delete('jobs', (j) => j.id === req.params.id);
    return res.json({
      success: true,
      message: 'Job deleted successfully.',
      action: 'DELETED',
    });
  } catch (err) {
    console.error('Admin delete job error:', err);
    return res.status(500).json({ success: false, message: 'Server error deleting job.' });
  }
});

// ==================================================
// 3. APPLICATION MANAGEMENT
// ==================================================

// GET /api/admin/applications (with pagination, filters, search)
router.get('/applications', async (req, res) => {
  try {
    const { status, q, page = 1, limit = 20, sort = 'desc' } = req.query;
    const applications = await db.get('applications') || [];
    const profiles = await db.get('candidate_profiles') || [];
    const jobs = await db.get('jobs') || [];

    // Enrich applications with candidate profile & job data
    let enriched = applications.map((app) => {
      const prof = profiles.find((p) => p.user_id === app.candidate_id);
      const job = jobs.find((j) => j.id === app.job_id);
      return {
        ...app,
        candidate_name: app.applicant_name || prof?.full_name || 'Candidate',
        candidate_email: app.applicant_email || prof?.email || '',
        candidate_phone: app.applicant_phone || prof?.phone || '',
        candidate_location: prof?.location || '',
        candidate_skills: prof?.skills || '',
        candidate_experience: prof?.experience || app.years_experience || '',
        job_title: app.job_title || job?.title || 'Open Position',
        job_department: job?.department || '',
      };
    });

    // Status filter
    if (status && status !== 'ALL') {
      enriched = enriched.filter((a) => a.status === status);
    }

    // Search query
    if (q) {
      const query = q.toLowerCase().trim();
      enriched = enriched.filter(
        (a) =>
          a.candidate_name?.toLowerCase().includes(query) ||
          a.candidate_email?.toLowerCase().includes(query) ||
          a.job_title?.toLowerCase().includes(query) ||
          a.candidate_skills?.toLowerCase().includes(query)
      );
    }

    // Sorting
    enriched.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sort === 'asc' ? dateA - dateB : dateB - dateA;
    });

    const total = enriched.length;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = enriched.slice(startIndex, startIndex + limitNum);

    return res.json({
      success: true,
      applications: paginated,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (err) {
    console.error('Admin fetch applications error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving applications.' });
  }
});

// GET /api/admin/applications/:id (Detailed application dossier)
router.get('/applications/:id', async (req, res) => {
  try {
    const app = await db.find('applications', (a) => a.id === req.params.id);
    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    const prof = await db.find('candidate_profiles', (p) => p.user_id === app.candidate_id);
    const job = await db.find('jobs', (j) => j.id === app.job_id);

    await writeAuditLog(req, {
      action: 'ADMIN_VIEWED_APPLICATION',
      entityType: 'application',
      entityId: app.id,
      metadata: { job_id: app.job_id, candidate_id: app.candidate_id },
    });

    return res.json({
      success: true,
      application: {
        ...app,
        candidate_profile: prof || null,
        job_details: job || null,
      },
    });
  } catch (err) {
    console.error('Admin get application detail error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving application.' });
  }
});

// PUT /api/admin/applications/:id/status
const VALID_STATUSES = [
  'APPLIED',
  'UNDER_REVIEW',
  'SHORTLISTED',
  'INTERVIEW',
  'SELECTED',
  'REJECTED',
];

router.put('/applications/:id/status', async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${VALID_STATUSES.join(', ')}`,
      });
    }

    const existing = await db.find('applications', (a) => a.id === req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    const updates = {
      status,
      status_updated_at: new Date().toISOString(),
    };

    if (adminNotes !== undefined) {
      updates.admin_notes = adminNotes;
    }

    // Record status history trail if not existing
    const history = existing.status_history || [];
    history.push({
      status,
      updated_by: req.user.email || 'Admin',
      updated_at: new Date().toISOString(),
      notes: adminNotes || '',
    });
    updates.status_history = history;

    const updated = await db.update('applications', (a) => a.id === req.params.id, updates);

    await writeAuditLog(req, {
      action: 'ADMIN_CHANGED_APPLICATION_STATUS',
      entityType: 'application',
      entityId: existing.id,
      metadata: {
        from: existing.status,
        to: status,
        job_id: existing.job_id,
        candidate_id: existing.candidate_id,
        has_admin_notes: adminNotes !== undefined && Boolean(adminNotes),
      },
    });

    return res.json({
      success: true,
      message: `Status updated to ${status}.`,
      application: updated,
    });
  } catch (err) {
    console.error('Update status error:', err);
    return res.status(500).json({ success: false, message: 'Server error updating status.' });
  }
});

// PUT /api/admin/applications/:id/notes (Internal notes strictly hidden from candidate)
router.put('/applications/:id/notes', async (req, res) => {
  try {
    const { adminNotes } = req.body;
    const updated = await db.update(
      'applications',
      (a) => a.id === req.params.id,
      {
        admin_notes: adminNotes || '',
        notes_updated_at: new Date().toISOString(),
      }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    return res.json({
      success: true,
      message: 'Internal admin notes saved.',
      admin_notes: updated.admin_notes,
    });
  } catch (err) {
    console.error('Update admin notes error:', err);
    return res.status(500).json({ success: false, message: 'Server error updating notes.' });
  }
});

// GET /api/admin/applications/:id/resume (Secure resume stream for Admin)
router.get('/applications/:id/resume', async (req, res) => {
  try {
    const app = await db.find('applications', (a) => a.id === req.params.id);
    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    if (!storageService.exists(app.resume_storage_path)) {
      return res.status(404).json({ success: false, message: 'Resume file not found on disk.' });
    }

    await writeAuditLog(req, {
      action: 'ADMIN_DOWNLOADED_RESUME',
      entityType: 'application',
      entityId: app.id,
      metadata: { job_id: app.job_id, candidate_id: app.candidate_id, filename: app.resume_filename },
    });

    return storageService.sendDownload(res, app.resume_storage_path, app.resume_filename || 'Candidate_Resume.pdf');
  } catch (err) {
    console.error('Admin download resume error:', err);
    return res.status(500).json({ success: false, message: 'Server error streaming resume.' });
  }
});

// ==================================================
// 4. CANDIDATE MANAGEMENT
// ==================================================

// GET /api/admin/candidates
router.get('/candidates', async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    const users = await db.get('users') || [];
    const profiles = await db.get('candidate_profiles') || [];
    const applications = await db.get('applications') || [];

    // Filter only candidates
    const candidateUsers = users.filter((u) => u.role === 'CANDIDATE');

    let list = candidateUsers.map((user) => {
      const prof = profiles.find((p) => p.user_id === user.id);
      const userApps = applications.filter((a) => a.candidate_id === user.id);
      return {
        id: user.id,
        name: prof?.full_name || user.name || 'Candidate',
        email: user.email,
        phone: prof?.phone || '',
        location: prof?.location || '',
        skills: prof?.skills || '',
        experience: prof?.experience || prof?.current_role || '',
        college: prof?.college || '',
        has_resume: !!prof?.resume_storage_path,
        applications_count: userApps.length,
        created_at: user.created_at,
      };
    });

    if (q) {
      const query = q.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query) ||
          c.skills.toLowerCase().includes(query) ||
          c.location.toLowerCase().includes(query)
      );
    }

    list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const total = list.length;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = list.slice(startIndex, startIndex + limitNum);

    return res.json({
      success: true,
      candidates: paginated,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (err) {
    console.error('Admin fetch candidates error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving candidates.' });
  }
});

// GET /api/admin/candidates/:id (Detailed candidate profile & applications)
router.get('/candidates/:id', async (req, res) => {
  try {
    const user = await db.find('users', (u) => u.id === req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Candidate user not found.' });
    }

    const profile = await db.find('candidate_profiles', (p) => p.user_id === user.id);
    const applications = await db.filter('applications', (a) => a.candidate_id === user.id);

    return res.json({
      success: true,
      candidate: {
        id: user.id,
        name: profile?.full_name || user.name,
        email: user.email,
        created_at: user.created_at,
        profile: profile || null,
        applications: applications.map((a) => ({
          id: a.id,
          job_id: a.job_id,
          job_title: a.job_title,
          status: a.status,
          created_at: a.created_at,
        })),
      },
    });
  } catch (err) {
    console.error('Admin get single candidate error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving candidate.' });
  }
});

// ==================================================
// 5. TRAINING MANAGEMENT
// ==================================================

// GET /api/admin/training
router.get('/training', async (req, res) => {
  try {
    const list = await db.get('training_programs') || [];
    return res.json({
      success: true,
      training_programs: list,
      total: list.length,
    });
  } catch (err) {
    console.error('Admin fetch training error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving training.' });
  }
});

// POST /api/admin/training
router.post('/training', async (req, res) => {
  try {
    const { name, title, description, duration, mode, skills, eligibility, instructions, status, highlights } =
      req.body;

    const programName = name || title;
    if (!programName || !description) {
      return res.status(400).json({
        success: false,
        message: 'Program name and description are required.',
      });
    }

    const slugId =
      programName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      Date.now().toString(36);

    const newProgram = await db.insert('training_programs', {
      id: slugId,
      name: programName.trim(),
      description: description.trim(),
      duration: duration || '10 Weeks',
      mode: mode || 'In-Studio / Hybrid',
      skills: skills || '',
      eligibility: eligibility || '',
      instructions: instructions || 'Submit your candidate application through the KODEWAR Careers portal.',
      highlights: highlights || '',
      status: ['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status) ? status : 'PUBLISHED',
    });

    return res.status(201).json({
      success: true,
      message: 'Training program created successfully.',
      training_program: newProgram,
    });
  } catch (err) {
    console.error('Admin create training error:', err);
    return res.status(500).json({ success: false, message: 'Server error creating training program.' });
  }
});

// PUT /api/admin/training/:id
router.put('/training/:id', async (req, res) => {
  try {
    const { name, title, description, duration, mode, skills, eligibility, instructions, status, highlights } =
      req.body;

    const updates = {};
    if (name || title) updates.name = (name || title).trim();
    if (description !== undefined) updates.description = description.trim();
    if (duration !== undefined) updates.duration = duration;
    if (mode !== undefined) updates.mode = mode;
    if (skills !== undefined) updates.skills = skills;
    if (eligibility !== undefined) updates.eligibility = eligibility;
    if (instructions !== undefined) updates.instructions = instructions;
    if (highlights !== undefined) updates.highlights = highlights;
    if (status && ['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status)) {
      updates.status = status;
    }

    const updated = await db.update('training_programs', (t) => t.id === req.params.id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Training program not found.' });
    }

    return res.json({
      success: true,
      message: 'Training program updated successfully.',
      training_program: updated,
    });
  } catch (err) {
    console.error('Admin update training error:', err);
    return res.status(500).json({ success: false, message: 'Server error updating training program.' });
  }
});

// DELETE /api/admin/training/:id
router.delete('/training/:id', async (req, res) => {
  try {
    const deleted = await db.delete('training_programs', (t) => t.id === req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Training program not found.' });
    }
    return res.json({
      success: true,
      message: 'Training program removed.',
    });
  } catch (err) {
    console.error('Admin delete training error:', err);
    return res.status(500).json({ success: false, message: 'Server error deleting training program.' });
  }
});

// ==================================================
// 6. TESTIMONIAL MANAGEMENT
// ==================================================

// GET /api/admin/testimonials
router.get('/testimonials', async (req, res) => {
  try {
    const list = await db.get('testimonials') || [];
    return res.json({
      success: true,
      testimonials: list,
      total: list.length,
    });
  } catch (err) {
    console.error('Admin fetch testimonials error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving testimonials.' });
  }
});

// POST /api/admin/testimonials
router.post('/testimonials', async (req, res) => {
  try {
    const { name, role, program, quote, image_url, status } = req.body;
    if (!name || !quote) {
      return res.status(400).json({
        success: false,
        message: 'Candidate name and testimonial quote are required.',
      });
    }

    const newTestimonial = await db.insert('testimonials', {
      id: 'test-' + Date.now().toString(36),
      name: name.trim(),
      role: role || '',
      program: program || '',
      quote: quote.trim(),
      image_url: image_url || '',
      status: ['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status) ? status : 'PUBLISHED',
    });

    return res.status(201).json({
      success: true,
      message: 'Testimonial created successfully.',
      testimonial: newTestimonial,
    });
  } catch (err) {
    console.error('Admin create testimonial error:', err);
    return res.status(500).json({ success: false, message: 'Server error creating testimonial.' });
  }
});

// PUT /api/admin/testimonials/:id
router.put('/testimonials/:id', async (req, res) => {
  try {
    const { name, role, program, quote, image_url, status } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (role !== undefined) updates.role = role.trim();
    if (program !== undefined) updates.program = program.trim();
    if (quote !== undefined) updates.quote = quote.trim();
    if (image_url !== undefined) updates.image_url = image_url;
    if (status !== undefined) updates.status = status;

    const updated = await db.update('testimonials', (t) => t.id === req.params.id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Testimonial not found.' });
    }

    return res.json({
      success: true,
      message: 'Testimonial updated successfully.',
      testimonial: updated,
    });
  } catch (err) {
    console.error('Admin update testimonial error:', err);
    return res.status(500).json({ success: false, message: 'Server error updating testimonial.' });
  }
});

// DELETE /api/admin/testimonials/:id
router.delete('/testimonials/:id', async (req, res) => {
  try {
    const deleted = await db.delete('testimonials', (t) => t.id === req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Testimonial not found.' });
    }
    return res.json({
      success: true,
      message: 'Testimonial deleted successfully.',
    });
  } catch (err) {
    console.error('Admin delete testimonial error:', err);
    return res.status(500).json({ success: false, message: 'Server error deleting testimonial.' });
  }
});

export default router;
