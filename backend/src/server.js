import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

import { validateJwtConfig } from './middleware/auth.js';
import { authLimiter, apiLimiter } from './middleware/rateLimiter.js';
import { initializeDatabase } from './config/db.js';

import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import applicationsRoutes from './routes/applications.js';
import jobsRoutes from './routes/jobs.js';
import trainingRoutes from './routes/training.js';
import testimonialsRoutes from './routes/testimonials.js';
import adminRoutes from './routes/admin.js';

// Validate critical security environment variables on startup
validateJwtConfig();

function validateProductionConfig() {
  if (process.env.NODE_ENV !== 'production') return;

  const missing = [];
  if (!process.env.DATABASE_URL) missing.push('DATABASE_URL');
  if ((process.env.STORAGE_PROVIDER || '').toLowerCase() !== 'supabase') missing.push('STORAGE_PROVIDER=supabase');
  if (!process.env.SUPABASE_URL) missing.push('SUPABASE_URL');
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) missing.push('SUPABASE_SERVICE_ROLE_KEY');
  if (!process.env.SUPABASE_STORAGE_BUCKET) missing.push('SUPABASE_STORAGE_BUCKET');
  if (!process.env.CORS_ORIGIN && !process.env.FRONTEND_URL) missing.push('CORS_ORIGIN or FRONTEND_URL');

  const corsValue = process.env.CORS_ORIGIN || process.env.FRONTEND_URL || '';
  if (corsValue.split(',').map((origin) => origin.trim()).includes('*')) {
    missing.push('restricted CORS origin (wildcard "*" is not allowed in production)');
  }

  if (missing.length) {
    const message = `[FATAL PRODUCTION CONFIGURATION] Missing or unsafe production setting(s): ${missing.join(', ')}. JSON database/storage fallbacks are disabled in production.`;
    console.error(message);
    if (process.env.TEST_NO_EXIT !== '1') {
      process.exit(1);
    }
    throw new Error(message);
  }
}

validateProductionConfig();
await initializeDatabase();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const IS_PROD = process.env.NODE_ENV === 'production';

// Disable X-Powered-By to prevent fingerprinting
app.disable('x-powered-by');

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (IS_PROD || req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  next();
});

// Configure CORS Whitelist
const allowedOrigins = (process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:3000,http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server or tests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked: Origin ${origin} is not allowed.`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Payload size limits to mitigate DOS via large request bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// General Rate Limiting for all API routes
app.use('/api/', apiLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'kodewar-talent-backend',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  });
});

// API Routes (with strict auth rate limiting on sensitive auth endpoints)
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);
app.use('/api/auth/google', authLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  // Always log error internally
  console.error(`[SERVER ERROR] ${req.method} ${req.url}:`, err.message || err);

  // Handle CORS errors cleanly
  if (err.message && err.message.startsWith('CORS blocked:')) {
    return res.status(403).json({
      success: false,
      message: 'Access blocked by CORS policy.',
    });
  }

  // Handle Multer upload errors
  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`,
    });
  }

  const statusCode = err.status || err.statusCode || 500;

  // Never leak internal stack traces or internal server paths in production
  if (IS_PROD) {
    return res.status(statusCode).json({
      success: false,
      message: statusCode >= 500 ? 'Internal server error. Please try again later.' : err.message,
    });
  }

  // Development: Provide helpful diagnostic info
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error.',
    stack: err.stack,
  });
});

// Only listen if not imported as a test module
if (process.env.NODE_ENV !== 'test_runner') {
  app.listen(PORT, () => {
    console.log(`[KODEWAR BACKEND] Server running on http://localhost:${PORT}`);
    console.log(`[KODEWAR BACKEND] Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`[KODEWAR BACKEND] Allowed CORS Origins: ${allowedOrigins.join(', ')}`);
  });
}

export default app;
