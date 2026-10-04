import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { INITIAL_SEED_JOBS, INITIAL_SEED_TRAINING, INITIAL_SEED_TESTIMONIALS } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'kodewar.db.json');
const SCHEMA_FILE = path.join(__dirname, 'schema.sql');
const IS_PROD = process.env.NODE_ENV === 'production';
const DATABASE_URL = process.env.DATABASE_URL || '';

const COLLECTIONS = new Set([
  'users',
  'candidate_profiles',
  'applications',
  'jobs',
  'training_programs',
  'testimonials',
  'promotions',
  'audit_logs',
]);

const INITIAL_DB = {
  users: [],
  candidate_profiles: [],
  applications: [],
  jobs: [],
  training_programs: [],
  testimonials: [],
  promotions: [],
  audit_logs: [],
};

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function assertCollection(collection) {
  if (!COLLECTIONS.has(collection)) {
    throw new Error(`Unknown database collection: ${collection}`);
  }
}

function normalizeJsonRecord(record) {
  if (!record || typeof record !== 'object') return record;
  return { ...record };
}

function normalizeDbRow(row) {
  if (!row || typeof row !== 'object') return row;
  const copy = { ...row };

  if (typeof copy.skills === 'string') {
    copy.skills = copy.skills
      ? copy.skills.split(',').map((item) => item.trim()).filter(Boolean)
      : [];
  }

  if (copy.years_experience && !copy.experience) copy.experience = copy.years_experience;
  if (copy.linkedin_url && !copy.linkedin) copy.linkedin = copy.linkedin_url;
  if (copy.github_url && !copy.github) copy.github = copy.github_url;
  if (copy.portfolio_url && !copy.portfolio) copy.portfolio = copy.portfolio_url;
  if (copy.applicant_name && !copy.candidate_name) copy.candidate_name = copy.applicant_name;
  if (copy.applicant_email && !copy.candidate_email) copy.candidate_email = copy.applicant_email;
  if (copy.applicant_phone && !copy.candidate_phone) copy.candidate_phone = copy.applicant_phone;
  if (copy.cover_letter && !copy.cover_message) copy.cover_message = copy.cover_letter;

  return copy;
}

function serializeValue(key, value) {
  if (value === undefined) return undefined;
  if (key === 'skills' && Array.isArray(value)) return value.join(', ');
  if (key === 'metadata' || key === 'status_history') return value || (key === 'metadata' ? {} : []);
  return value;
}

function seedAdminIfMissing(data) {
  if (!data.users) data.users = [];
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@kodewar.com').trim().toLowerCase();
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || '';
  const adminExists = data.users.some((u) => u.email === adminEmail || u.role === 'ADMIN');
  if (!adminExists) {
    if (!adminPassword) {
      console.warn('[KODEWAR DB] ADMIN_INITIAL_PASSWORD is required to seed the first admin account.');
      return false;
    }
    const passwordHash = bcrypt.hashSync(adminPassword, bcrypt.genSaltSync(10));
    data.users.push({
      id: 'admin_kodewar_default_01',
      name: 'KODEWAR Admin',
      email: adminEmail,
      password_hash: passwordHash,
      role: 'ADMIN',
      auth_provider: 'local',
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    console.log(`[KODEWAR DB] Seeded initial admin account: ${adminEmail}`);
    return true;
  }
  return false;
}

function seedCareerDataIfMissing(data) {
  let modified = false;
  for (const collection of COLLECTIONS) {
    if (!data[collection]) {
      data[collection] = [];
      modified = true;
    }
  }

  const timestamp = new Date().toISOString();
  if (!data.jobs.length) {
    data.jobs = INITIAL_SEED_JOBS.map((item) => ({ ...item, created_at: timestamp, updated_at: timestamp }));
    modified = true;
  }
  if (!data.training_programs.length) {
    data.training_programs = INITIAL_SEED_TRAINING.map((item) => ({ ...item, created_at: timestamp, updated_at: timestamp }));
    modified = true;
  }
  if (!data.testimonials.length) {
    data.testimonials = INITIAL_SEED_TESTIMONIALS.map((item) => ({ ...item, created_at: timestamp, updated_at: timestamp }));
    modified = true;
  }

  return modified;
}

function createJsonAdapter() {
  let memoryCache = null;

  function save(data) {
    memoryCache = data;
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  }

  function load() {
    if (memoryCache) return memoryCache;

    if (!fs.existsSync(DB_FILE)) {
      const initial = structuredClone(INITIAL_DB);
      seedAdminIfMissing(initial);
      seedCareerDataIfMissing(initial);
      save(initial);
      return memoryCache;
    }

    try {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      const seededAdmin = seedAdminIfMissing(data);
      const seededCareerData = seedCareerDataIfMissing(data);
      if (seededAdmin || seededCareerData) save(data);
      memoryCache = data;
      return memoryCache;
    } catch (err) {
      console.error('[KODEWAR DB] Error reading database file, initializing fresh:', err);
      const initial = structuredClone(INITIAL_DB);
      save(initial);
      return memoryCache;
    }
  }

  return {
    provider: 'json',
    async initialize() {
      load();
    },
    async reload() {
      memoryCache = null;
      return load();
    },
    async get(collection) {
      assertCollection(collection);
      return (load()[collection] || []).map(normalizeJsonRecord);
    },
    async find(collection, predicate) {
      return (await this.get(collection)).find(predicate) || null;
    },
    async filter(collection, predicate) {
      return (await this.get(collection)).filter(predicate);
    },
    async insert(collection, item) {
      assertCollection(collection);
      const data = load();
      if (!data[collection]) data[collection] = [];
      const timestamp = new Date().toISOString();
      const record = { ...item, created_at: item.created_at || timestamp, updated_at: item.updated_at || timestamp };
      data[collection].push(record);
      save(data);
      return normalizeJsonRecord(record);
    },
    async update(collection, predicate, updates) {
      assertCollection(collection);
      const data = load();
      const list = data[collection] || [];
      const index = list.findIndex(predicate);
      if (index === -1) return null;
      const updated = { ...list[index], ...updates, updated_at: new Date().toISOString() };
      list[index] = updated;
      save(data);
      return normalizeJsonRecord(updated);
    },
    async delete(collection, predicate) {
      assertCollection(collection);
      const data = load();
      const list = data[collection] || [];
      data[collection] = list.filter((item) => !predicate(item));
      save(data);
      return true;
    },
  };
}

function createPostgresAdapter() {
  if (!DATABASE_URL) {
    throw new Error('[FATAL DATABASE CONFIGURATION] NODE_ENV=production requires DATABASE_URL. JSON database fallback is disabled in production.');
  }

  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: process.env.PGSSLMODE === 'disable' ? false : { rejectUnauthorized: false },
  });
  const columnCache = new Map();

  async function columnsFor(collection) {
    assertCollection(collection);
    if (columnCache.has(collection)) return columnCache.get(collection);
    const result = await pool.query(
      `SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1`,
      [collection]
    );
    const columns = new Set(result.rows.map((row) => row.column_name));
    columnCache.set(collection, columns);
    return columns;
  }

  async function seedIfEmpty(collection, rows) {
    const count = await pool.query(`SELECT COUNT(*)::int AS count FROM "${collection}"`);
    if (count.rows[0]?.count > 0) return;
    for (const row of rows) {
      await adapter.insert(collection, row);
    }
  }

  const adapter = {
    provider: 'postgres',
    async initialize() {
      const schema = fs.readFileSync(SCHEMA_FILE, 'utf-8');
      await pool.query(schema);
      const timestamp = new Date().toISOString();
      await seedIfEmpty('jobs', INITIAL_SEED_JOBS.map((item) => ({ ...item, created_at: timestamp, updated_at: timestamp })));
      await seedIfEmpty('training_programs', INITIAL_SEED_TRAINING.map((item) => ({ ...item, created_at: timestamp, updated_at: timestamp })));
      await seedIfEmpty('testimonials', INITIAL_SEED_TESTIMONIALS.map((item) => ({ ...item, created_at: timestamp, updated_at: timestamp })));
      console.log('[KODEWAR DB] PostgreSQL schema initialized.');
    },
    async reload() {
      return null;
    },
    async get(collection) {
      assertCollection(collection);
      const result = await pool.query(`SELECT * FROM "${collection}"`);
      return result.rows.map(normalizeDbRow);
    },
    async find(collection, predicate) {
      return (await this.get(collection)).find(predicate) || null;
    },
    async filter(collection, predicate) {
      return (await this.get(collection)).filter(predicate);
    },
    async insert(collection, item) {
      assertCollection(collection);
      const columns = await columnsFor(collection);
      const timestamp = new Date().toISOString();
      const record = { ...item, created_at: item.created_at || timestamp, updated_at: item.updated_at || timestamp };
      const entries = Object.entries(record)
        .map(([key, value]) => [key, serializeValue(key, value)])
        .filter(([key, value]) => columns.has(key) && value !== undefined);

      if (!entries.length) {
        throw new Error(`No valid columns supplied for ${collection}.`);
      }

      const names = entries.map(([key]) => `"${key}"`);
      const placeholders = entries.map((_, index) => `$${index + 1}`);
      const values = entries.map(([, value]) => value);
      const result = await pool.query(
        `INSERT INTO "${collection}" (${names.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`,
        values
      );
      return normalizeDbRow(result.rows[0]);
    },
    async update(collection, predicate, updates) {
      assertCollection(collection);
      const existing = (await this.get(collection)).find(predicate);
      if (!existing) return null;

      const columns = await columnsFor(collection);
      const patch = { ...updates, updated_at: new Date().toISOString() };
      const entries = Object.entries(patch)
        .map(([key, value]) => [key, serializeValue(key, value)])
        .filter(([key, value]) => columns.has(key) && value !== undefined);

      if (!entries.length) return existing;

      const assignments = entries.map(([key], index) => `"${key}" = $${index + 1}`);
      const values = entries.map(([, value]) => value);
      values.push(existing.id);
      const result = await pool.query(
        `UPDATE "${collection}" SET ${assignments.join(', ')} WHERE id = $${values.length} RETURNING *`,
        values
      );
      return normalizeDbRow(result.rows[0] || null);
    },
    async delete(collection, predicate) {
      assertCollection(collection);
      const targets = (await this.get(collection)).filter(predicate);
      for (const item of targets) {
        await pool.query(`DELETE FROM "${collection}" WHERE id = $1`, [item.id]);
      }
      return true;
    },
  };

  return adapter;
}

let activeAdapter = null;

function getAdapter() {
  if (!activeAdapter) {
    activeAdapter = IS_PROD ? createPostgresAdapter() : createJsonAdapter();
  }
  return activeAdapter;
}

export const db = {
  get provider() {
    return getAdapter().provider;
  },
  async initialize() {
    return getAdapter().initialize();
  },
  async reload() {
    return getAdapter().reload();
  },
  async get(collection) {
    return getAdapter().get(collection);
  },
  async find(collection, predicate) {
    return getAdapter().find(collection, predicate);
  },
  async filter(collection, predicate) {
    return getAdapter().filter(collection, predicate);
  },
  async insert(collection, item) {
    return getAdapter().insert(collection, item);
  },
  async update(collection, predicate, updates) {
    return getAdapter().update(collection, predicate, updates);
  },
  async delete(collection, predicate) {
    return getAdapter().delete(collection, predicate);
  },
};

export async function initializeDatabase() {
  if (IS_PROD && !DATABASE_URL) {
    throw new Error('[FATAL DATABASE CONFIGURATION] NODE_ENV=production requires DATABASE_URL. JSON database fallback is disabled in production.');
  }
  await db.initialize();
}
