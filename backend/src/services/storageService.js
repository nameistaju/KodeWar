import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const LOCAL_UPLOADS_DIR = path.resolve(__dirname, '../../uploads/resumes');

// Ensure upload directory exists
if (!fs.existsSync(LOCAL_UPLOADS_DIR)) {
  fs.mkdirSync(LOCAL_UPLOADS_DIR, { recursive: true });
}

export const storageService = {
  /**
   * Determine whether storage is operating in local or remote cloud mode
   */
  getProvider() {
    if (process.env.STORAGE_PROVIDER === 'supabase' && process.env.SUPABASE_URL) {
      return 'supabase';
    }
    return 'local';
  },

  getSupabaseConfig() {
    return {
      url: (process.env.SUPABASE_URL || '').replace(/\/$/, ''),
      key: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
      bucket: process.env.SUPABASE_STORAGE_BUCKET || 'resumes',
    };
  },

  buildObjectKey(file, scope = 'general') {
    const safeName = this.sanitizeFilename(file?.originalname || file?.filename || 'resume.pdf');
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    return `${scope}/${unique}-${safeName}`;
  },

  async persistUploadedResume(file, scope = 'general') {
    if (!file) throw new Error('No uploaded file supplied.');

    if (this.getProvider() !== 'supabase') {
      return {
        storagePath: file.path,
        filename: file.originalname,
        size: file.size,
        provider: 'local',
      };
    }

    const { url, key, bucket } = this.getSupabaseConfig();
    if (!url || !key || !bucket) {
      throw new Error('Supabase storage is not fully configured.');
    }

    const objectKey = this.buildObjectKey(file, scope);
    const uploadUrl = `${url}/storage/v1/object/${encodeURIComponent(bucket)}/${objectKey}`;
    const fileBuffer = fs.readFileSync(file.path);
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${key}`,
        apikey: key,
        'Content-Type': file.mimetype || 'application/octet-stream',
        'x-upsert': 'false',
      },
      body: fileBuffer,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`Supabase resume upload failed (${response.status}): ${errorText || 'Unknown error'}`);
    }

    try {
      fs.unlinkSync(file.path);
    } catch {
      // Local temp cleanup is best-effort only.
    }

    return {
      storagePath: objectKey,
      filename: file.originalname,
      size: file.size,
      provider: 'supabase',
    };
  },

  /**
   * Validates storage path against Path Traversal (CWE-22)
   * Ensures target path is strictly confined within LOCAL_UPLOADS_DIR and exists on disk.
   */
  validateStoragePath(filePath) {
    if (!filePath || typeof filePath !== 'string') return false;
    try {
      const resolved = path.resolve(filePath);
      const resolvedBase = path.resolve(LOCAL_UPLOADS_DIR);
      // Path must start with uploads directory and must exist
      if (!resolved.startsWith(resolvedBase)) {
        console.warn(`[SECURITY ALERT] Path traversal blocked: ${filePath}`);
        return false;
      }
      return fs.existsSync(resolved);
    } catch {
      return false;
    }
  },

  /**
   * Check if a resume exists on storage
   */
  exists(storagePath) {
    if (!storagePath) return false;
    try {
      if (this.getProvider() === 'local') {
        return this.validateStoragePath(storagePath);
      }
      return typeof storagePath === 'string' && storagePath.length > 0 && !storagePath.includes('..');
    } catch {
      return false;
    }
  },

  /**
   * Stream a resume file for download
   */
  createReadStream(storagePath) {
    if (!this.validateStoragePath(storagePath)) {
      throw new Error('Resume file not found or invalid path.');
    }
    return fs.createReadStream(storagePath);
  },

  async sendDownload(res, storagePath, filename = 'resume.pdf') {
    if (this.getProvider() === 'local') {
      if (!this.validateStoragePath(storagePath)) {
        throw new Error('Resume file not found or invalid path.');
      }
      return res.download(storagePath, filename);
    }

    if (!this.exists(storagePath)) {
      throw new Error('Resume file not found or invalid path.');
    }

    const { url, key, bucket } = this.getSupabaseConfig();
    if (!url || !key || !bucket) {
      throw new Error('Supabase storage is not fully configured.');
    }

    const objectUrl = `${url}/storage/v1/object/${encodeURIComponent(bucket)}/${storagePath}`;
    const response = await fetch(objectUrl, {
      headers: {
        Authorization: `Bearer ${key}`,
        apikey: key,
      },
    });

    if (!response.ok || !response.body) {
      throw new Error('Resume file not found or could not be read from storage.');
    }

    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${this.sanitizeFilename(filename)}"`);
    return Readable.fromWeb(response.body).pipe(res);
  },

  /**
   * Safe file deletion
   */
  async deleteFile(storagePath) {
    if (!storagePath) return false;
    try {
      if (this.getProvider() === 'local') {
        if (this.validateStoragePath(storagePath)) {
          fs.unlinkSync(storagePath);
          return true;
        }
      }
      if (this.getProvider() === 'supabase' && this.exists(storagePath)) {
        const { url, key, bucket } = this.getSupabaseConfig();
        const objectUrl = `${url}/storage/v1/object/${encodeURIComponent(bucket)}/${storagePath}`;
        const response = await fetch(objectUrl, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${key}`,
            apikey: key,
          },
        });
        return response.ok;
      }
      return false;
    } catch (err) {
      console.error('[STORAGE SERVICE] Error deleting file:', err);
      return false;
    }
  },

  /**
   * Sanitizes candidate file metadata
   */
  sanitizeFilename(rawFilename = 'resume.pdf') {
    const ext = path.extname(rawFilename).toLowerCase();
    const base = path
      .basename(rawFilename, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 40);
    return `${base}${ext}`;
  },
};
