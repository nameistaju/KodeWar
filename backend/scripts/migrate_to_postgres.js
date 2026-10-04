import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.resolve(__dirname, '../data/kodewar.db.json');
const OUTPUT_SQL = path.resolve(__dirname, '../src/config/seed_export.sql');

function escapeSql(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (typeof val === 'number') return val.toString();
  if (typeof val === 'object') {
    return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
  }
  return `'${String(val).replace(/'/g, "''")}'`;
}

function generatePostgresMigration() {
  console.log('====================================================');
  console.log('GENERATING IDEMPOTENT POSTGRESQL IMPORT SCRIPT');
  console.log('====================================================');

  if (!fs.existsSync(DB_FILE)) {
    console.error(`[ERROR] Database file not found at: ${DB_FILE}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(DB_FILE, 'utf8');
  const data = JSON.parse(raw);

  const sqlStatements = [
    '-- ==============================================================',
    '-- KODEWAR TALENT — POSTGRESQL / SUPABASE SEED MIGRATION',
    `-- Generated At: ${new Date().toISOString()}`,
    '-- Strategy: Idempotent INSERT ... ON CONFLICT (id) DO NOTHING',
    '-- Safe: Never overwrites or deletes existing production records',
    '-- ==============================================================',
    'BEGIN;',
    '',
  ];

  // 1. Users
  const users = data.users || [];
  if (users.length > 0) {
    sqlStatements.push('-- 1. USERS');
    for (const u of users) {
      sqlStatements.push(
        `INSERT INTO users (id, name, email, password_hash, role, auth_provider, google_sub, avatar_url, created_at, updated_at) ` +
        `VALUES (${escapeSql(u.id)}, ${escapeSql(u.name || 'Candidate')}, ${escapeSql(u.email)}, ${escapeSql(u.password_hash)}, ${escapeSql(u.role || 'CANDIDATE')}, ${escapeSql(u.auth_provider || 'local')}, ${escapeSql(u.google_sub || null)}, ${escapeSql(u.avatar_url || null)}, ${escapeSql(u.created_at || new Date().toISOString())}, ${escapeSql(u.updated_at || new Date().toISOString())}) ` +
        `ON CONFLICT (id) DO NOTHING;`
      );
    }
    sqlStatements.push('');
  }

  // 2. Candidate Profiles
  const profiles = data.candidate_profiles || [];
  if (profiles.length > 0) {
    sqlStatements.push('-- 2. CANDIDATE PROFILES');
    for (const p of profiles) {
      sqlStatements.push(
        `INSERT INTO candidate_profiles (id, user_id, full_name, email, phone, location, college, degree, field, graduation_year, skills, experience, current_role, linkedin, github, portfolio, resume_storage_path, resume_filename, resume_size, resume_uploaded_at, created_at, updated_at) ` +
        `VALUES (${escapeSql(p.id)}, ${escapeSql(p.user_id)}, ${escapeSql(p.full_name || '')}, ${escapeSql(p.email || '')}, ${escapeSql(p.phone || '')}, ${escapeSql(p.location || '')}, ${escapeSql(p.college || '')}, ${escapeSql(p.degree || '')}, ${escapeSql(p.field || '')}, ${escapeSql(p.graduation_year || '')}, ${escapeSql(Array.isArray(p.skills) ? p.skills.join(', ') : p.skills || '')}, ${escapeSql(p.experience || '')}, ${escapeSql(p.current_role || '')}, ${escapeSql(p.linkedin || '')}, ${escapeSql(p.github || '')}, ${escapeSql(p.portfolio || '')}, ${escapeSql(p.resume_storage_path || '')}, ${escapeSql(p.resume_filename || '')}, ${escapeSql(p.resume_size || 0)}, ${escapeSql(p.resume_uploaded_at || null)}, ${escapeSql(p.created_at || new Date().toISOString())}, ${escapeSql(p.updated_at || new Date().toISOString())}) ` +
        `ON CONFLICT (id) DO NOTHING;`
      );
    }
    sqlStatements.push('');
  }

  // 3. Jobs
  const jobs = data.jobs || [];
  if (jobs.length > 0) {
    sqlStatements.push('-- 3. JOBS');
    for (const j of jobs) {
      sqlStatements.push(
        `INSERT INTO jobs (id, title, department, employment_type, workplace_type, location, experience_level, salary_range, featured, skills, summary, about_role, responsibilities, requirements, benefits, deadline, status, created_at, updated_at) ` +
        `VALUES (${escapeSql(j.id)}, ${escapeSql(j.title)}, ${escapeSql(j.department)}, ${escapeSql(j.employment_type || 'Full-time')}, ${escapeSql(j.workplace_type || 'Hybrid')}, ${escapeSql(j.location)}, ${escapeSql(j.experience_level)}, ${escapeSql(j.salary_range || '')}, ${escapeSql(!!j.featured)}, ${escapeSql(Array.isArray(j.skills) ? j.skills.join(', ') : j.skills || '')}, ${escapeSql(j.summary)}, ${escapeSql(j.about_role || '')}, ${escapeSql(j.responsibilities || '')}, ${escapeSql(j.requirements || '')}, ${escapeSql(j.benefits || '')}, ${escapeSql(j.deadline || '')}, ${escapeSql(j.status || 'DRAFT')}, ${escapeSql(j.created_at || new Date().toISOString())}, ${escapeSql(j.updated_at || new Date().toISOString())}) ` +
        `ON CONFLICT (id) DO NOTHING;`
      );
    }
    sqlStatements.push('');
  }

  // 4. Applications
  const apps = data.applications || [];
  if (apps.length > 0) {
    sqlStatements.push('-- 4. APPLICATIONS');
    for (const a of apps) {
      sqlStatements.push(
        `INSERT INTO applications (id, candidate_id, job_id, job_title, department, applicant_name, applicant_email, applicant_phone, location, college, education, graduation_year, skills, years_experience, linkedin_url, github_url, portfolio_url, cover_letter, resume_storage_path, resume_filename, status, admin_notes, status_history, created_at, updated_at) ` +
        `VALUES (${escapeSql(a.id)}, ${escapeSql(a.candidate_id)}, ${escapeSql(a.job_id)}, ${escapeSql(a.job_title)}, ${escapeSql(a.department || '')}, ${escapeSql(a.applicant_name || '')}, ${escapeSql(a.applicant_email || '')}, ${escapeSql(a.applicant_phone || '')}, ${escapeSql(a.location || '')}, ${escapeSql(a.college || '')}, ${escapeSql(a.education || '')}, ${escapeSql(a.graduation_year || '')}, ${escapeSql(a.skills || '')}, ${escapeSql(a.years_experience || '')}, ${escapeSql(a.linkedin_url || '')}, ${escapeSql(a.github_url || '')}, ${escapeSql(a.portfolio_url || '')}, ${escapeSql(a.cover_letter || '')}, ${escapeSql(a.resume_storage_path || '')}, ${escapeSql(a.resume_filename || '')}, ${escapeSql(a.status || 'APPLIED')}, ${escapeSql(a.admin_notes || '')}, ${escapeSql(a.status_history || [])}, ${escapeSql(a.created_at || new Date().toISOString())}, ${escapeSql(a.updated_at || new Date().toISOString())}) ` +
        `ON CONFLICT (id) DO NOTHING;`
      );
    }
    sqlStatements.push('');
  }

  // 5. Training Programs
  const training = data.training_programs || [];
  if (training.length > 0) {
    sqlStatements.push('-- 5. TRAINING PROGRAMS');
    for (const t of training) {
      sqlStatements.push(
        `INSERT INTO training_programs (id, name, description, duration, mode, skills, eligibility, instructions, highlights, status, created_at, updated_at) ` +
        `VALUES (${escapeSql(t.id)}, ${escapeSql(t.name)}, ${escapeSql(t.description)}, ${escapeSql(t.duration)}, ${escapeSql(t.mode)}, ${escapeSql(Array.isArray(t.skills) ? t.skills.join(', ') : t.skills || '')}, ${escapeSql(t.eligibility || '')}, ${escapeSql(t.instructions || '')}, ${escapeSql(t.highlights || '')}, ${escapeSql(t.status || 'PUBLISHED')}, ${escapeSql(t.created_at || new Date().toISOString())}, ${escapeSql(t.updated_at || new Date().toISOString())}) ` +
        `ON CONFLICT (id) DO NOTHING;`
      );
    }
    sqlStatements.push('');
  }

  // 6. Testimonials
  const testimonials = data.testimonials || [];
  if (testimonials.length > 0) {
    sqlStatements.push('-- 6. TESTIMONIALS');
    for (const tm of testimonials) {
      sqlStatements.push(
        `INSERT INTO testimonials (id, name, role, program, cohort, quote, image_url, status, created_at, updated_at) ` +
        `VALUES (${escapeSql(tm.id)}, ${escapeSql(tm.name)}, ${escapeSql(tm.role || '')}, ${escapeSql(tm.program || '')}, ${escapeSql(tm.cohort || '')}, ${escapeSql(tm.quote)}, ${escapeSql(tm.image_url || '')}, ${escapeSql(tm.status || 'PUBLISHED')}, ${escapeSql(tm.created_at || new Date().toISOString())}, ${escapeSql(tm.updated_at || new Date().toISOString())}) ` +
        `ON CONFLICT (id) DO NOTHING;`
      );
    }
    sqlStatements.push('');
  }

  // 7. Audit Logs
  const auditLogs = data.audit_logs || [];
  if (auditLogs.length > 0) {
    sqlStatements.push('-- 7. AUDIT LOGS');
    for (const log of auditLogs) {
      sqlStatements.push(
        `INSERT INTO audit_logs (id, actor_user_id, actor_email, actor_role, action, entity_type, entity_id, metadata, ip_address, user_agent, created_at) ` +
        `VALUES (${escapeSql(log.id)}, ${escapeSql(log.actor_user_id || null)}, ${escapeSql(log.actor_email || null)}, ${escapeSql(log.actor_role || null)}, ${escapeSql(log.action)}, ${escapeSql(log.entity_type || '')}, ${escapeSql(log.entity_id || '')}, ${escapeSql(log.metadata || {})}, ${escapeSql(log.ip_address || '')}, ${escapeSql(log.user_agent || '')}, ${escapeSql(log.created_at || new Date().toISOString())}) ` +
        `ON CONFLICT (id) DO NOTHING;`
      );
    }
    sqlStatements.push('');
  }

  sqlStatements.push('COMMIT;');

  const finalSql = sqlStatements.join('\n');
  fs.writeFileSync(OUTPUT_SQL, finalSql, 'utf8');

  console.log(`[SUCCESS] PostgreSQL migration script generated: ${OUTPUT_SQL}`);
  console.log(`[STATS] Processed: ${users.length} Users, ${profiles.length} Profiles, ${jobs.length} Jobs, ${apps.length} Applications, ${training.length} Training, ${testimonials.length} Testimonials, ${auditLogs.length} Audit Logs.`);
}

generatePostgresMigration();
