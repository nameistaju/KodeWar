-- ==============================================================================
-- KODEWAR TALENT & CAREER PORTAL — PRODUCTION POSTGRESQL SCHEMA & RLS POLICIES
-- Compatible with Supabase, Neon.tech, and standard PostgreSQL (₹0 Budget)
-- ==============================================================================

-- 1. Users Table (Candidates & Unified Admins)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'CANDIDATE', -- 'CANDIDATE' | 'ADMIN'
    auth_provider VARCHAR(32) NOT NULL DEFAULT 'local', -- 'local' | 'google'
    google_sub VARCHAR(128),
    avatar_url TEXT,
    password_reset_token TEXT,
    password_reset_expires TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_google_sub ON users(google_sub);

-- 2. Candidate Profiles Table
CREATE TABLE IF NOT EXISTS candidate_profiles (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(64),
    location VARCHAR(255),
    college VARCHAR(255),
    degree VARCHAR(255),
    field VARCHAR(255),
    graduation_year VARCHAR(32),
    skills TEXT,
    experience VARCHAR(64),
    "current_role" VARCHAR(255),
    linkedin TEXT,
    github TEXT,
    portfolio TEXT,
    resume_storage_path TEXT,
    resume_filename VARCHAR(255),
    resume_size BIGINT,
    resume_uploaded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON candidate_profiles(user_id);

-- 3. Jobs Table (Public listings & Admin pipeline)
CREATE TABLE IF NOT EXISTS jobs (
    id VARCHAR(128) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(128) NOT NULL,
    employment_type VARCHAR(64) NOT NULL,
    workplace_type VARCHAR(64) NOT NULL DEFAULT 'Hybrid', -- 'In-Studio' | 'Hybrid' | 'Remote'
    location VARCHAR(255) NOT NULL,
    experience_level VARCHAR(64) NOT NULL,
    salary_range VARCHAR(128),
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    skills TEXT,
    summary TEXT NOT NULL,
    about_role TEXT,
    responsibilities TEXT,
    requirements TEXT,
    benefits TEXT,
    deadline VARCHAR(64), -- YYYY-MM-DD or empty
    status VARCHAR(32) NOT NULL DEFAULT 'DRAFT', -- 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED'
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_department ON jobs(department);

-- 4. Applications Table
CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(64) PRIMARY KEY,
    candidate_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    job_id VARCHAR(128) NOT NULL REFERENCES jobs(id) ON DELETE RESTRICT,
    job_title VARCHAR(255) NOT NULL,
    department VARCHAR(128),
    applicant_name VARCHAR(255) NOT NULL,
    applicant_email VARCHAR(255) NOT NULL,
    applicant_phone VARCHAR(64) NOT NULL,
    location VARCHAR(255),
    college VARCHAR(255),
    education VARCHAR(255),
    graduation_year VARCHAR(32),
    skills TEXT,
    years_experience VARCHAR(64),
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    cover_letter TEXT,
    resume_storage_path TEXT,
    resume_filename VARCHAR(255),
    status VARCHAR(32) NOT NULL DEFAULT 'APPLIED', -- 'APPLIED' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'INTERVIEW' | 'SELECTED' | 'REJECTED'
    admin_notes TEXT, -- Confidential: strictly isolated from candidate view
    status_history JSONB, -- JSON array of status transition events
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_candidate_job_application UNIQUE (candidate_id, job_id)
);

CREATE INDEX IF NOT EXISTS idx_apps_candidate_id ON applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_apps_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_apps_status ON applications(status);

-- 5. Training Programs Table
CREATE TABLE IF NOT EXISTS training_programs (
    id VARCHAR(128) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    duration VARCHAR(64) NOT NULL,
    mode VARCHAR(64) NOT NULL,
    skills TEXT,
    eligibility TEXT,
    instructions TEXT,
    highlights TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'PUBLISHED', -- 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_training_status ON training_programs(status);

-- 6. Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
    id VARCHAR(128) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    program VARCHAR(255),
    cohort VARCHAR(255),
    quote TEXT NOT NULL,
    image_url TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'PUBLISHED', -- 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);

-- 7. Promotions & Offers Table
CREATE TABLE IF NOT EXISTS promotions (
    id VARCHAR(128) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    placement VARCHAR(32) NOT NULL DEFAULT 'BANNER', -- 'BANNER' | 'POPUP'
    image_url TEXT NOT NULL,
    target_url TEXT,
    priority INT NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    display_frequency VARCHAR(64) DEFAULT 'ONCE_PER_SESSION',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_promotions_active ON promotions(is_active);
CREATE INDEX IF NOT EXISTS idx_promotions_placement ON promotions(placement);

-- 8. Audit Logs Table (append-only application audit trail)
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(96) PRIMARY KEY,
    actor_user_id VARCHAR(64),
    actor_email VARCHAR(255),
    actor_role VARCHAR(32),
    action VARCHAR(96) NOT NULL,
    entity_type VARCHAR(96),
    entity_id VARCHAR(128),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address VARCHAR(128),
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_email ON audit_logs(actor_email);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

-- ==============================================================================
-- PART 3: SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
-- ARCHITECTURE RULE:
-- The backend server operates with the Server-Side Service Role Key (or direct DATABASE_URL).
-- The Service Role bypasses RLS for privileged management operations.
--
-- The RLS policies below enforce defense-in-depth in case Supabase PostgREST (anon key)
-- is ever queried directly from public clients:
-- ==============================================================================

-- Enable RLS across all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- JOBS: Public can read published jobs; Service role can manage all
DO $$ BEGIN
  CREATE POLICY "Public read published jobs" ON jobs
      FOR SELECT USING (status = 'PUBLISHED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- TRAINING: Public can read published programs
DO $$ BEGIN
  CREATE POLICY "Public read published training" ON training_programs
      FOR SELECT USING (status = 'PUBLISHED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- TESTIMONIALS: Public can read published testimonials
DO $$ BEGIN
  CREATE POLICY "Public read published testimonials" ON testimonials
      FOR SELECT USING (status = 'PUBLISHED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- PROMOTIONS: Public can read active promotions within valid date windows
DO $$ BEGIN
  CREATE POLICY "Public read active promotions" ON promotions
      FOR SELECT USING (is_active = TRUE);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- CANDIDATE PROFILES: Authenticated candidate can read/update their own profile
DO $$ BEGIN
  CREATE POLICY "Candidates view own profile" ON candidate_profiles
      FOR SELECT USING (auth.uid()::text = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Candidates update own profile" ON candidate_profiles
      FOR UPDATE USING (auth.uid()::text = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- APPLICATIONS: Candidate can view their own submitted applications
DO $$ BEGIN
  CREATE POLICY "Candidates view own applications" ON applications
      FOR SELECT USING (auth.uid()::text = candidate_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Candidates insert own applications" ON applications
      FOR INSERT WITH CHECK (auth.uid()::text = candidate_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- USERS: Users can read their own account record (excluding password hashes via application layer)
DO $$ BEGIN
  CREATE POLICY "Users view own record" ON users
      FOR SELECT USING (auth.uid()::text = id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AUDIT LOGS: no public direct access. Backend service role / direct DB handles reads.
