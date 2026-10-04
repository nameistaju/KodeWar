/**
 * In-Memory Rate Limiter Middleware for KODEWAR Backend (Zero external dependencies)
 * Suitable for ₹0 free-tier deployment and protects against brute-force attacks and abuse.
 */

export function createRateLimiter({
  windowMs = 15 * 60 * 1000, // 15 minutes default
  max = 100, // Limit each IP to 100 requests per windowMs
  message = 'Too many requests. Please try again later.',
  keyGenerator = (req) => {
    return (
      req.headers['x-forwarded-for']?.split(',')[0].trim() ||
      req.socket?.remoteAddress ||
      req.ip ||
      'anonymous'
    );
  },
} = {}) {
  // Map of ip -> array of timestamps
  const requests = new Map();

  // Periodic cleanup every 5 minutes to prevent memory leaks
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, timestamps] of requests.entries()) {
      const valid = timestamps.filter((t) => now - t < windowMs);
      if (valid.length === 0) {
        requests.delete(key);
      } else {
        requests.set(key, valid);
      }
    }
  }, 5 * 60 * 1000);

  // Unref interval so it does not block process exit
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }

  return function rateLimiterMiddleware(req, res, next) {
    // In test environment, allow bypassing with TEST_BYPASS_RATE_LIMIT=1 if specified
    if (process.env.TEST_BYPASS_RATE_LIMIT === '1') {
      return next();
    }

    const key = keyGenerator(req);
    const now = Date.now();
    const timestamps = requests.get(key) || [];

    // Filter out timestamps outside window
    const validTimestamps = timestamps.filter((t) => now - t < windowMs);

    if (validTimestamps.length >= max) {
      const oldestValid = validTimestamps[0];
      const resetTime = Math.ceil((oldestValid + windowMs - now) / 1000);

      res.setHeader('Retry-After', resetTime > 0 ? resetTime : 1);
      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('X-RateLimit-Reset', Math.ceil((oldestValid + windowMs) / 1000));

      return res.status(429).json({
        success: false,
        message: typeof message === 'function' ? message(resetTime) : message,
        retryAfterSeconds: resetTime > 0 ? resetTime : 1,
      });
    }

    validTimestamps.push(now);
    requests.set(key, validTimestamps);

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - validTimestamps.length));
    res.setHeader('X-RateLimit-Reset', Math.ceil((now + windowMs) / 1000));

    next();
  };
}

/**
 * Strict limiter for sensitive authentication endpoints:
 * Max 10 attempts per 15 minutes per IP.
 */
export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: (seconds) => `Too many login/signup attempts. Please try again in ${Math.ceil(seconds / 60)} minute(s).`,
});

/**
 * Upload limiter for resume and image uploads:
 * Max 30 uploads per 15 minutes per IP.
 */
export const uploadLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: 'Upload limit reached. Please wait a few minutes before uploading more documents.',
});

/**
 * General API Limiter:
 * Max 300 requests per 15 minutes per IP.
 */
export const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: 'Too many requests. Please slow down.',
});
