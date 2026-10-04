import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RESUMES_DIR = path.resolve(__dirname, '../../uploads/resumes');
if (!fs.existsSync(RESUMES_DIR)) {
  fs.mkdirSync(RESUMES_DIR, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, RESUMES_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitizedBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, `resume_${sanitizedBase}_${uniqueSuffix}${ext}`);
  },
});

// File filter validation
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext) || !ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new Error('Invalid file type. Only PDF, DOC, and DOCX documents are allowed.'),
      false
    );
  }
  cb(null, true);
}

// 10 MB limit
export const uploadResume = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

export function validateUploadedResumeFile(file) {
  if (!file?.path) {
    return { ok: false, message: 'No resume file provided.' };
  }

  const ext = path.extname(file.originalname).toLowerCase();
  const header = fs.readFileSync(file.path).subarray(0, 8);
  const startsWith = (...bytes) => bytes.every((byte, index) => header[index] === byte);

  const isPdf = ext === '.pdf' && startsWith(0x25, 0x50, 0x44, 0x46); // %PDF
  const isDoc = ext === '.doc' && startsWith(0xd0, 0xcf, 0x11, 0xe0); // OLE compound document
  const isDocx = ext === '.docx' && startsWith(0x50, 0x4b, 0x03, 0x04); // ZIP container

  if (!isPdf && !isDoc && !isDocx) {
    try {
      fs.unlinkSync(file.path);
    } catch {
      // Best-effort cleanup only.
    }
    return {
      ok: false,
      message: 'Invalid resume file contents. Only valid PDF, DOC, and DOCX documents are allowed.',
    };
  }

  return { ok: true };
}
