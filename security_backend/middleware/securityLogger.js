// Security monitoring and logging middleware
const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const securityLogFile = path.join(logsDir, 'security.log');

// Log security events
const logSecurityEvent = (event, req, details = {}) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event: event,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    url: req.originalUrl,
    method: req.method,
    details: details
  };

  const logLine = JSON.stringify(logEntry) + '\n';
  
  // Log to console for development
  console.log(`🛡️  Security Event: ${event} - IP: ${logEntry.ip} - URL: ${logEntry.url}`);
  
  // Log to file
  fs.appendFile(securityLogFile, logLine, (err) => {
    if (err) {
      console.error('Error writing to security log:', err);
    }
  });
};

// Rate limit logging middleware
const rateLimitLogger = (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    // Check if this is a rate limit response
    if (res.statusCode === 429) {
      logSecurityEvent('RATE_LIMIT_EXCEEDED', req, {
        statusCode: 429,
        responseData: typeof data === 'string' ? JSON.parse(data) : data
      });
    }
    
    originalSend.call(this, data);
  };
  
  next();
};

// Suspicious activity detector
const suspiciousActivityDetector = (req, res, next) => {
  const suspiciousPatterns = [
    /sql|select|union|insert|update|delete|drop|create|alter/i, // SQL injection patterns
    /<script|javascript:|vbscript:|onload|onerror/i, // XSS patterns
    /\.\.\/|\.\.\\|\.\.\//i, // Path traversal
    /\||\&|\;|\$|\`/i // Command injection patterns
  ];

  const userInput = JSON.stringify(req.body) + req.query + req.params;
  
  for (let pattern of suspiciousPatterns) {
    if (pattern.test(userInput)) {
      logSecurityEvent('SUSPICIOUS_INPUT_DETECTED', req, {
        pattern: pattern.toString(),
        input: userInput.substring(0, 500) // Log first 500 chars
      });
      break;
    }
  }
  
  next();
};

// Failed authentication logger
const authFailureLogger = (req, res, next) => {
  const originalJson = res.json;
  
  res.json = function(data) {
    // Check for authentication failures
    if (data && !data.success && req.path.includes('/login')) {
      logSecurityEvent('AUTHENTICATION_FAILURE', req, {
        reason: data.message || 'Unknown',
        attempts: req.headers['x-forwarded-for'] ? 'proxy' : 'direct'
      });
    }
    
    originalJson.call(this, data);
  };
  
  next();
};

module.exports = {
  logSecurityEvent,
  rateLimitLogger,
  suspiciousActivityDetector,
  authFailureLogger
};
