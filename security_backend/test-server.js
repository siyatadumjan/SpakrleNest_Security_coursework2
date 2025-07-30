// Simple test to check if server can start
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// dotenv Configuration
dotenv.config();

console.log('Environment variables loaded:');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_LOCAL:', process.env.MONGODB_LOCAL);
console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Set' : 'Not set');

// Test MongoDB connection
console.log('\nTesting MongoDB connection...');
mongoose.connect(process.env.MONGODB_LOCAL)
    .then(() => {
        console.log('✅ Database connection successful!');
        mongoose.disconnect();
    })
    .catch((error) => {
        console.error('❌ Database connection failed:', error.message);
    });

// Test basic server
const app = express();
app.use(express.json());

app.get('/test', (req, res) => {
    res.json({ success: true, message: 'Server is working!' });
});

const PORT = process.env.PORT || 5000;

// Test HTTP server (without HTTPS for testing)
app.listen(PORT, () => {
    console.log(`✅ HTTP test server running on port ${PORT}`);
    console.log(`Test URL: http://localhost:${PORT}/test`);
});
