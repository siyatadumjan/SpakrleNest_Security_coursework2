const rateLimit = require('express-rate-limit');

// General rate limiting middleware
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_GENERAL_MAX || 100, // Configurable limit
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: '15 minutes'
    });
  }
});

// Strict rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_AUTH_MAX || 5, // Configurable limit
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many authentication attempts, please try again later.',
      retryAfter: '15 minutes'
    });
  }
});

// Payment rate limiting
const paymentLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: process.env.RATE_LIMIT_PAYMENT_MAX || 3, // Configurable limit
  message: {
    success: false,
    error: 'Too many payment attempts, please try again later.',
    retryAfter: '5 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many payment attempts, please try again later.',
      retryAfter: '5 minutes'
    });
  }
});

// Password reset rate limiting
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: process.env.RATE_LIMIT_PASSWORD_RESET_MAX || 3, // Configurable limit
  message: {
    success: false,
    error: 'Too many password reset attempts, please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many password reset attempts, please try again later.',
      retryAfter: '1 hour'
    });
  }
});

// Registration rate limiting
const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: process.env.RATE_LIMIT_REGISTRATION_MAX || 5, // Configurable limit
  message: {
    success: false,
    error: 'Too many registration attempts, please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many registration attempts, please try again later.',
      retryAfter: '1 hour'
    });
  }
});

// API rate limiting for search and browse
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: process.env.RATE_LIMIT_API_MAX || 60, // Configurable limit
  message: {
    success: false,
    error: 'Too many API requests, please slow down.',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many API requests, please slow down.',
      retryAfter: '1 minute'
    });
  }
});

// Create a logging function for rate limit hits
const logRateLimitHit = (req, rateLimitType) => {
  console.log(`Rate limit hit: ${rateLimitType} - IP: ${req.ip} - Time: ${new Date().toISOString()}`);
};

module.exports = {
  generalLimiter,
  authLimiter,
  paymentLimiter,
  passwordResetLimiter,
  registrationLimiter,
  apiLimiter,
  logRateLimitHit
};
