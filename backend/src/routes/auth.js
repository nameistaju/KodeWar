import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
import { authenticateUser, getJwtSecret } from '../middleware/auth.js';
import { writeAuditLog } from '../services/auditService.js';

const router = express.Router();

// Helper to generate JWT token (7-day validity)
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    getJwtSecret(),
    { expiresIn: '7d' }
  );
}

// --------------------------------------------------
// POST /api/auth/signup
// --------------------------------------------------
router.post('/signup', async (req, res) => {
  try {
    const rawFullName = req.body.fullName || req.body.name;
    const { email, password, confirmPassword } = req.body;
    const fullName = rawFullName ? rawFullName.trim() : '';

    // 1. Basic validation
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email, and password are required.',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long for production security.',
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match. Please re-enter.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    // 2. Check existing user
    const existing = await db.find('users', (u) => u.email === normalizedEmail);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
      });
    }

    // 3. Hash password & persist
    const password_hash = await bcrypt.hash(password, 10);
    const userId = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    const newUser = await db.insert('users', {
      id: userId,
      name: fullName.trim(),
      email: normalizedEmail,
      password_hash,
      role: 'CANDIDATE',
      auth_provider: 'local',
    });

    // 4. Create initial Candidate Profile
    const profileId = 'prof_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const newProfile = await db.insert('candidate_profiles', {
      id: profileId,
      user_id: userId,
      full_name: fullName.trim(),
      email: normalizedEmail,
      phone: req.body.phone || '',
      location: '',
      college: '',
      degree: '',
      field: '',
      graduation_year: '',
      skills: [],
      experience: '',
      current_role: '',
      linkedin: '',
      github: '',
      portfolio: '',
      resume_storage_path: '',
      resume_filename: '',
      resume_size: 0,
      resume_uploaded_at: null,
    });

    const token = generateToken(newUser);

    await writeAuditLog(req, {
      action: 'USER_SIGNUP',
      entityType: 'user',
      entityId: newUser.id,
      actor: newUser,
      metadata: { email: normalizedEmail, auth_provider: 'local' },
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
      profile: newProfile,
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create account. Please try again.',
    });
  }
});

// --------------------------------------------------
// POST /api/auth/login
// --------------------------------------------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await db.find('users', (u) => u.email === normalizedEmail);

    if (!user) {
      await writeAuditLog(req, {
        action: 'AUTH_LOGIN_FAILED',
        entityType: 'user',
        metadata: { email: normalizedEmail, reason: 'invalid_credentials' },
      });
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Users registered exclusively via OAuth have no local password
    if (!user.password_hash) {
      return res.status(400).json({
        success: false,
        message: 'This account was registered via Google Sign-In. Please click "Continue with Google".',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      await writeAuditLog(req, {
        action: 'AUTH_LOGIN_FAILED',
        entityType: 'user',
        entityId: user.id,
        actor: user,
        metadata: { email: normalizedEmail, reason: 'invalid_credentials' },
      });
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const profile = await db.find('candidate_profiles', (p) => p.user_id === user.id);
    const token = generateToken(user);

    await writeAuditLog(req, {
      action: user.role === 'ADMIN' ? 'ADMIN_LOGIN' : 'USER_LOGIN',
      entityType: 'user',
      entityId: user.id,
      actor: user,
      metadata: { email: normalizedEmail, auth_provider: user.auth_provider || 'local' },
    });

    return res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      profile: profile || null,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed. Please try again.',
    });
  }
});

// --------------------------------------------------
// POST /api/auth/google
// Production-Hardened Google OAuth Token Verification
// --------------------------------------------------
router.post('/google', async (req, res) => {
  try {
    const { credential, email, name, sub } = req.body;
    let verifiedEmail = null;
    let verifiedName = null;
    let verifiedSub = null;

    if (credential) {
      if (process.env.NODE_ENV === 'production' && !process.env.GOOGLE_CLIENT_ID) {
        return res.status(503).json({
          success: false,
          message: 'Google login is not configured for this deployment.',
        });
      }

      // Cryptographically verify Google ID token via Google tokeninfo endpoint
      try {
        const verifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`;
        const googleRes = await fetch(verifyUrl);
        if (!googleRes.ok) {
          return res.status(401).json({
            success: false,
            message: 'Invalid or expired Google OAuth credential token.',
          });
        }
        const tokenPayload = await googleRes.json();

        const expectedClientId = process.env.GOOGLE_CLIENT_ID;
        const allowedIssuers = new Set(['https://accounts.google.com', 'accounts.google.com']);
        const expiresAt = Number(tokenPayload.exp || 0) * 1000;

        if (!allowedIssuers.has(tokenPayload.iss)) {
          return res.status(401).json({
            success: false,
            message: 'Invalid Google token issuer.',
          });
        }

        if (!expiresAt || expiresAt <= Date.now()) {
          return res.status(401).json({
            success: false,
            message: 'Google credential token has expired.',
          });
        }

        if (expectedClientId && tokenPayload.aud !== expectedClientId) {
          return res.status(401).json({
            success: false,
            message: 'Google Client ID mismatch between token and server configuration.',
          });
        }

        if (!tokenPayload.email_verified || tokenPayload.email_verified === 'false') {
          return res.status(400).json({
            success: false,
            message: 'Google email address is not verified by Google.',
          });
        }

        verifiedEmail = tokenPayload.email;
        verifiedName = tokenPayload.name || tokenPayload.given_name || 'Candidate';
        verifiedSub = tokenPayload.sub;
      } catch (verifyErr) {
        console.error('Google token verification network failure:', verifyErr);
        return res.status(500).json({
          success: false,
          message: 'Unable to verify Google credential with Google identity servers.',
        });
      }
    } else {
      // In production mode, an authenticated Google token is strictly mandatory!
      if (process.env.NODE_ENV === 'production') {
        return res.status(503).json({
          success: false,
          message: 'Google login is not configured for this deployment.',
        });
      }

      // Development / Testing fallback
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Google credential token or development email required.',
        });
      }

      // CRITICAL PRIVILEGE ESCALATION SHIELD:
      // Never allow unverified development mock login into an ADMIN account!
      const targetUser = await db.find('users', (u) => u.email === email.trim().toLowerCase());
      if (targetUser && targetUser.role === 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Security policy: Administrator accounts cannot log in via unverified OAuth mock.',
        });
      }

      verifiedEmail = email;
      verifiedName = name || email.split('@')[0];
      verifiedSub = sub || 'dev_mock_' + Date.now();
    }

    const normalizedEmail = verifiedEmail.trim().toLowerCase();
    let user = await db.find('users', (u) => u.email === normalizedEmail);
    let createdUser = false;

    if (!user) {
      // Create user from verified Google Auth
      const userId = 'usr_g_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
      user = await db.insert('users', {
        id: userId,
        name: verifiedName || 'Candidate',
        email: normalizedEmail,
        password_hash: '', // No password for Google OAuth
        role: 'CANDIDATE',
        auth_provider: 'google',
        google_sub: verifiedSub || '',
      });
      createdUser = true;

      await db.insert('candidate_profiles', {
        id: 'prof_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        user_id: userId,
        full_name: verifiedName || 'Candidate',
        email: normalizedEmail,
        phone: '',
        location: '',
        college: '',
        degree: '',
        field: '',
        graduation_year: '',
        skills: [],
        experience: '',
        current_role: '',
        linkedin: '',
        github: '',
        portfolio: '',
        resume_storage_path: '',
        resume_filename: '',
        resume_size: 0,
        resume_uploaded_at: null,
      });
    } else {
      // Existing user: Link google_sub if not yet set
      if (!user.google_sub && verifiedSub) {
        user = await db.update('users', (u) => u.id === user.id, {
          google_sub: verifiedSub,
          auth_provider: 'google',
        });
      }
    }

    const profile = await db.find('candidate_profiles', (p) => p.user_id === user.id);
    const token = generateToken(user);

    await writeAuditLog(req, {
      action: 'GOOGLE_LOGIN',
      entityType: 'user',
      entityId: user.id,
      actor: user,
      metadata: {
        email: normalizedEmail,
        created: createdUser,
        auth_provider: 'google',
      },
    });

    return res.json({
      success: true,
      message: 'Google login successful.',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      profile,
    });
  } catch (err) {
    console.error('Google OAuth error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to process Google authentication.',
    });
  }
});

// --------------------------------------------------
// POST /api/auth/forgot-password
// --------------------------------------------------
router.post('/forgot-password', async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production' && process.env.PASSWORD_RESET_MODE !== 'email') {
      return res.status(503).json({
        success: false,
        message: 'Password reset email delivery is not configured for this deployment.',
      });
    }

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your account email address.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    const user = await db.find('users', (u) => u.email === normalizedEmail);

    // Uniform response to prevent email enumeration timing attacks
    if (user) {
      const resetToken = jwt.sign(
        { id: user.id, purpose: 'password_reset' },
        getJwtSecret(),
        { expiresIn: '1h' }
      );
      await db.update('users', (u) => u.id === user.id, {
        password_reset_token: resetToken,
        password_reset_expires: new Date(Date.now() + 3600000).toISOString(),
      });
      await writeAuditLog(req, {
        action: 'PASSWORD_RESET_REQUESTED',
        entityType: 'user',
        entityId: user.id,
        actor: user,
        metadata: { email: normalizedEmail },
      });
      console.log(`[PASSWORD RECOVERY] Reset instructions generated for user: ${normalizedEmail}`);
    }

    return res.json({
      success: true,
      message: 'If an account exists with this email address, password reset instructions have been issued.',
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to process password recovery request.',
    });
  }
});

// --------------------------------------------------
// GET /api/auth/me
// --------------------------------------------------
router.get('/me', authenticateUser, async (req, res) => {
  try {
    const user = await db.find('users', (u) => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const profile = await db.find('candidate_profiles', (p) => p.user_id === user.id);

    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      profile: profile || null,
    });
  } catch (err) {
    console.error('/me error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve session' });
  }
});

export default router;
