// Importing packages
const express = require('express');
const mongoose = require('mongoose');
const connectDatabase = require('./database/database');
const dotenv = require('dotenv');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const mongoSanitize = require("express-mongo-sanitize");
const https = require('https');

// Import rate limiting middleware
const { 
  generalLimiter, 
  authLimiter, 
  paymentLimiter, 
  passwordResetLimiter, 
  registrationLimiter, 
  apiLimiter 
} = require('./middleware/rateLimiter');

// Import security logging middleware
const {
  rateLimitLogger,
  suspiciousActivityDetector,
  authFailureLogger
} = require('./middleware/securityLogger');

// Creating an express app
const app = express();

// dotenv Configuration
dotenv.config();

// Security middleware (applied early in the stack)
app.use(rateLimitLogger);
app.use(suspiciousActivityDetector);
app.use(authFailureLogger);

// Apply general rate limiting to all requests
app.use(generalLimiter);

// Configure Cors policy with more permissive settings for development
const corsOptions = {
    origin: [
        'https://localhost:3000', 
        'http://localhost:3000',
        'http://localhost:3001',  // In case React runs on different port
        'https://localhost:3001'
    ], 
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    preflightContinue: false
};

// SSL/TLS options for HTTPS
const options = {
  key: fs.readFileSync(path.resolve(__dirname, './certificate/server.key')), // Path to your private key
  cert: fs.readFileSync(path.resolve(__dirname, './certificate/server.crt')), // Path to your certificate
  // Add these for better SSL handling
  requestCert: false,
  rejectUnauthorized: false
};



app.use(mongoSanitize());

// Add preflight CORS handler
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

// Add request logging middleware for debugging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    console.log('Headers:', req.headers);
    
    // Don't try to read the body here - let express.json() handle it
    next();
});

// Express JSON and file upload configuration with error handling
app.use(express.json({
    limit: '10mb',
    verify: (req, res, buf) => {
        try {
            JSON.parse(buf);
        } catch (e) {
            console.error('Invalid JSON received:', buf.toString());
            throw new Error('Invalid JSON format');
        }
    }
}));
app.use(fileUpload());

// Log parsed body for debugging (after JSON parsing)
app.use((req, res, next) => {
    if (req.method === 'POST' && req.body) {
        console.log('Parsed body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

// Add JSON error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        console.error('JSON Parse Error:', error.message);
        return res.status(400).json({
            success: false,
            message: 'Invalid JSON format in request body',
            error: 'Please check your request format'
        });
    }
    next(error);
});

// Serve static files
app.use(express.static('./public'));

// Connecting to database
connectDatabase();

// Defining the port
const PORT = process.env.PORT || 5000;

// Starting the server with HTTPS
const server = https.createServer(options, app);

server.listen(PORT, () => {
    console.log(`Server is running on HTTPS port ${PORT}!`);
    console.log(`Test URL: https://localhost:${PORT}/test`);
});

server.on('error', (error) => {
    console.error('HTTPS Server error:', error);
    if (error.code === 'ENOENT') {
        console.error('SSL Certificate files not found. Please check certificate paths.');
        console.log('Starting HTTP server as fallback...');
        
        // Fallback to HTTP server
        app.listen(PORT + 1, () => {
            console.log(`HTTP fallback server running on port ${PORT + 1}`);
            console.log(`HTTP Test URL: http://localhost:${PORT + 1}/test`);
        });
    }
});

// Also start HTTP server on port 5001 as backup
const httpServer = app.listen(5001, () => {
    console.log(`HTTP server running on port 5001`);
    console.log(`HTTP Test URL: http://localhost:5001/test`);
});

httpServer.on('error', (error) => {
    console.error('HTTP Server error:', error);
});

// Test endpoint
app.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Test API is working!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Debug endpoint to check all services
app.get('/debug', async (req, res) => {
    try {
        const dbStatus = mongoose.connection.readyState;
        const dbStates = {
            0: 'disconnected',
            1: 'connected', 
            2: 'connecting',
            3: 'disconnecting'
        };

        res.json({
            success: true,
            services: {
                server: 'running',
                database: dbStates[dbStatus],
                environment: process.env.NODE_ENV || 'development',
                port: PORT,
                timestamp: new Date().toISOString()
            },
            config: {
                mongoUri: process.env.MONGODB_LOCAL,
                emailConfigured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD),
                recaptchaConfigured: !!process.env.RECAPTCHA_SECRET_KEY
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Configuring routes with specific rate limiters
app.use('/api/user', authLimiter, require('./routes/userRoutes')); // Authentication routes with strict limiting
app.use('/api/product', apiLimiter, require('./routes/productRoutes')); // Product API with standard limiting
app.use('/api/cart', apiLimiter, require('./routes/cartRoutes')); // Cart operations
app.use('/api/wishlist', apiLimiter, require('./routes/wishlistRoutes')); // Wishlist operations
app.use('/api/review', apiLimiter, require('./routes/ratingRoutes')); // Review operations
app.use('/api/order', apiLimiter, require('./routes/orderRoutes')); // Order operations
app.use("/api/khalti", paymentLimiter, require('./routes/paymentRoutes')); // Payment with strict limiting
app.use("/api/logs", apiLimiter, require('./routes/activityRoutes')); // Activity logs

// Rate limiting status endpoint
app.get('/api/status/rate-limits', (req, res) => {
  res.json({
    success: true,
    message: 'Rate limiting is active',
    limits: {
      general: `${process.env.RATE_LIMIT_GENERAL_MAX || 100} requests per 15 minutes`,
      auth: `${process.env.RATE_LIMIT_AUTH_MAX || 5} attempts per 15 minutes`,
      payment: `${process.env.RATE_LIMIT_PAYMENT_MAX || 3} attempts per 5 minutes`,
      passwordReset: `${process.env.RATE_LIMIT_PASSWORD_RESET_MAX || 3} attempts per hour`,
      registration: `${process.env.RATE_LIMIT_REGISTRATION_MAX || 5} attempts per hour`,
      api: `${process.env.RATE_LIMIT_API_MAX || 60} requests per minute`
    },
    timestamp: new Date().toISOString()
  });
});


// Starting the server
// app.listen(PORT, () => {
//     console.log(`Server is Running on port ${PORT}!`);
// });


module.exports = app;