const Log = require("../models/logModel");

const logRequest = async (req, res, next) => {
  // Store original response methods to capture status
  const originalSend = res.send;
  const originalJson = res.json;
  const originalStatus = res.status;
  
  let responseBody = null;
  let statusCode = 200; // Default status

  // Override res.status to capture status code
  res.status = function(code) {
    statusCode = code;
    return originalStatus.call(this, code);
  };

  // Override res.send to capture when response is sent
  res.send = function(body) {
    responseBody = body;
    logActivity();
    return originalSend.call(this, body);
  };

  // Override res.json to capture when JSON response is sent
  res.json = function(body) {
    responseBody = body;
    logActivity();
    return originalJson.call(this, body);
  };

  const logActivity = async () => {
    try {
      // Check if req.user exists and get the username or email
      const username = req.user ? req.user.userName || req.user.email || "Guest" : "Guest";
      const userRole = req.user?.isAdmin ? "Admin" : (req.user ? "User" : "Guest");

      // Get client IP address (handle proxy headers)
      const getClientIP = (req) => {
        return req.headers['x-forwarded-for']?.split(',')[0] || 
               req.headers['x-real-ip'] || 
               req.connection?.remoteAddress || 
               req.socket?.remoteAddress || 
               req.ip || 
               'Unknown';
      };

      // Extract device info from user agent
      const getUserAgent = (userAgent) => {
        if (!userAgent) return 'Unknown Device';
        
        if (userAgent.includes('Mobile')) return 'Mobile Device';
        if (userAgent.includes('Tablet')) return 'Tablet';
        if (userAgent.includes('Chrome')) return 'Chrome Browser';
        if (userAgent.includes('Firefox')) return 'Firefox Browser';
        if (userAgent.includes('Safari')) return 'Safari Browser';
        if (userAgent.includes('Edge')) return 'Edge Browser';
        return 'Desktop Browser';
      };

      // Log entry details
      const logEntry = new Log({
        username: username,
        url: req.originalUrl,
        method: req.method,
        role: userRole,
        status: statusCode.toString(),
        time: new Date(),
        headers: {
          userAgent: req.headers["user-agent"],
          authorization: req.headers.authorization ? "Bearer ***" : "None",
          contentType: req.headers["content-type"] || "None"
        },
        device: getUserAgent(req.headers["user-agent"]),
        ipAddress: getClientIP(req)
      });

      await logEntry.save();
      console.log(`Activity logged: ${username} - ${req.method} ${req.originalUrl} - ${statusCode}`);
    } catch (error) {
      console.error("Error logging request:", error.message);
    }
  };

  next();
};

module.exports = {
  logRequest
};
