import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'kodewar.db.json');
const BACKUP_DIR = path.resolve(__dirname, '../backups');

function createBackup() {
  if (!fs.existsSync(DB_FILE)) {
    console.error('[BACKUP] Database file not found at:', DB_FILE);
    process.exit(1);
  }

  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const raw = fs.readFileSync(DB_FILE, 'utf-8');
  const data = JSON.parse(raw);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFileName = `kodewar_backup_${timestamp}.json`;
  const backupPath = path.join(BACKUP_DIR, backupFileName);

  // Create sanitized snapshot (safe for offsite archiving)
  const sanitized = {
    metadata: {
      timestamp: new Date().toISOString(),
      counts: {
        users: data.users?.length || 0,
        candidate_profiles: data.candidate_profiles?.length || 0,
        jobs: data.jobs?.length || 0,
        applications: data.applications?.length || 0,
        training_programs: data.training_programs?.length || 0,
        testimonials: data.testimonials?.length || 0,
      },
    },
    users: (data.users || []).map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      auth_provider: u.auth_provider,
      created_at: u.created_at,
      updated_at: u.updated_at,
      // Passwords are redacted in public/shared backups
      password_hash: '[PROTECTED_HASH]',
    })),
    candidate_profiles: data.candidate_profiles || [],
    jobs: data.jobs || [],
    applications: data.applications || [],
    training_programs: data.training_programs || [],
    testimonials: data.testimonials || [],
  };

  fs.writeFileSync(backupPath, JSON.stringify(sanitized, null, 2), 'utf-8');
  console.log(`[BACKUP SUCCESS] Backup snapshot saved to: ${backupPath}`);
  console.log(`[BACKUP SUMMARY] Users: ${sanitized.metadata.counts.users} | Jobs: ${sanitized.metadata.counts.jobs} | Applications: ${sanitized.metadata.counts.applications}`);
}

createBackup();
