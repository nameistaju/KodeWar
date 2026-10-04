import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';

export const DEV_DEFAULT_SECRET = 'kodewar_secret_jwt_key_2026_dev_env';

/**
 * Validates JWT configuration and fails fast in production if the secret is missing or insecure.
 */
export function validateJwtConfig() {
  const secret = process.env.JWT_SECRET;
  const isProd = process.env.NODE_ENV === 'production';

  if (isProd) {
    if (!secret || secret === DEV_DEFAULT_SECRET || secret.trim().length < 32) {
      const errMsg =
        '[FATAL SECURITY CONFIGURATION] NODE_ENV is "production" but JWT_SECRET is missing, default, or fewer than 32 characters. Production deployment aborted.';
      console.error('================================================================');
      console.error(errMsg);
      console.error('Generate a secure secret: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
      console.error('================================================================');

      if (process.env.TEST_NO_EXIT !== '1') {
        process.exit(1);
      }
      throw new Error(errMsg);
    }
  } else if (!secret) {
    console.warn('[SECURITY WARNING] Using default development JWT_SECRET. Do NOT use this key in production.');
  }
}

// Run validation upon import
validateJwtConfig();

export function getJwtSecret() {
  return process.env.JWT_SECRET || DEV_DEFAULT_SECRET;
}

export const JWT_SECRET = getJwtSecret();

export async function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please sign in.',
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    const user = await db.find('users', (u) => u.id === decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User session expired or account not found.',
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session token. Please log in again.',
    });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Administrator privileges required.',
    });
  }
  next();
}
