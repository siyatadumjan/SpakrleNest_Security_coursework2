# ✨ SparkleNest - Premium Jwellery E-commerce Platform

**Where beauty meets luxury.** Discover our curated collection of premium c## 🎯 Latest FeaturAPI endpoints will be accessible for frontend integration.

## 🔐 Authentication System

### Login & Registration
- **Secure Login** - JWT-based authentication with encrypted passwords
- **User Registration** - Account creation with input validation and security checks
- **Session Management** - Secure token-based session handling

### Password Reset Flow
1. **Email Verification** - User enters email address for password reset
2. **OTP Generation** - System generates 6-digit OTP with 10-minute expiry
3. **Email Delivery** - OTP sent to user's registered email address
4. **OTP Verification** - User enters OTP to verify identity
5. **Password History Check** - New password validated against previous passwords
6. **Password Update** - Secure password reset with bcrypt encryption

### Security Features
- **Password History** - Prevents reuse of last 5 passwords
- **OTP Expiry** - Time-limited verification codes for security
- **Input Sanitization** - All inputs validated and sanitized
- **Error Handling** - Secure error messages without information leakage
- **Rate Limiting** - Comprehensive request limiting to prevent abuse
- **Security Monitoring** - Real-time logging of suspicious activities

## 🎯 Latest Features (2025 Update)

### 🛡️ Advanced Security System
- **Comprehensive Rate Limiting** - Multi-tier protection against abuse and attacks
  - General API: 100 requests per 15 minutes
  - Authentication: 5 attempts per 15 minutes
  - Payment Processing: 3 attempts per 5 minutes
  - Password Reset: 3 attempts per hour
  - Registration: 5 attempts per hour
- **Security Monitoring** - Real-time threat detection and logging
  - SQL injection pattern detection
  - XSS (Cross-Site Scripting) protection
  - Path traversal attack prevention
  - Command injection defense
- **Advanced Logging** - Comprehensive security event tracking
  - Rate limit violation logs
  - Authentication failure tracking
  - Suspicious activity detection
  - Security log file generation
- **Live Khalti Payment Integration** - Production-ready payment gateway
  - Live API keys integration
  - Enhanced error handling and validation
  - Payment attempt rate limiting
  - Transaction security monitoring

### 🔔 Smart Notification System
- **Real-time Alerts** - Instant notifications for new orders and system events
- **Inventory Management** - Automated low stock and out-of-stock alerts
- **Admin Dashboard Integration** - Live notification feed with glassmorphism design
- **Interactive UI** - Mark as read, delete, and refresh functionality
- **Backend Integration** - Dynamic notifications from real order and product data

### 🔐 Enhanced Security Features
- **Advanced Password Reset** - Modern two-step verification system
- **Email OTP Verification** - 6-digit OTP sent to user's email with 10-minute expiry
- **Password History Protection** - Prevents reuse of previous passwords using bcrypt comparison
- **Secure Reset Flow** - Email validation → OTP verification → Password reset with history check
- **Modern UI Design** - Glassmorphism design matching login page aesthetics

### 🎨 Enhanced UI/UX
- **Modern Design** - Updated glassmorphism effects and animations
- **Responsive Notifications** - Mobile-optimized notification dropdown
- **Loading States** - Professional loading spinners and transitions
- **Error Handling** - Graceful fallbacks and user feedback
- **Consistent Styling** - Unified design language across all pagescare essentials, and beauty treasures designed to enhance your natural radiance.

## 🚀 Project Overview

SparkleNest is a full-stack e-commerce platform built with modern web technologies, featuring a beautiful and intuitive user interface for cosmetics and beauty products. The platform includes a comprehensive admin dashboard with real-time notifications, inventory management, advanced analytics, and a robust security system with modern password reset functionality.

### 🎨 Frontend Features
- **Premium Boarding Page** - Elegant glassmorphism design with animations
- **Sleek Navigation** - Modern navbar with React icons and responsive design
- **User Authentication** - Secure login and registration system
- **Password Reset System** - Modern two-step verification with email OTP and password history validation
- **Product Catalog** - Beautiful product display with search and filtering
- **Shopping Cart** - Intuitive cart management and wishlist functionality
- **Smart Notifications** - Real-time notification system with order alerts and inventory warnings
- **Admin Dashboard** - Comprehensive admin panel with live notifications and analytics
- **Responsive Design** - Optimized for all devices with premium visual effects

### 🔧 Backend Features
- **Secure Authentication** - JWT-based user authentication and authorization
- **Password Security** - Advanced password reset with OTP verification and reuse prevention
- **Product Management** - CRUD operations for products with image upload
- **Order Processing** - Complete order management system with real-time notifications
- **User Management** - User profiles, preferences, and account management
- **Payment Integration** - Secure payment processing with live Khalti integration
- **Smart Notifications** - Automated notification system for orders and inventory
- **Activity Logging** - Comprehensive system activity monitoring
- **API Security** - SSL certificates and comprehensive error handling
- **Rate Limiting System** - Multi-tier protection against abuse and DDoS attacks
- **Security Monitoring** - Real-time threat detection and automated logging

## 🛠️ Technology Stack

### Frontend (`security_frontend/`)
- **React.js** - Modern UI library with hooks and context
- **CSS3** - Custom styling with glassmorphism effects and animations
- **React Icons** - Beautiful icon components
- **Real-time Updates** - Dynamic notification system
- **Responsive Design** - Mobile-first approach with modern UX

### Backend (`security_backend/`)
- **Node.js** - Runtime environment
- **Express.js** - Web application framework with rate limiting
- **MongoDB** - Database for data storage
- **JWT** - Authentication tokens
- **Multer** - File upload handling
- **Khalti API** - Live payment gateway integration
- **SSL** - Secure communication
- **Express Rate Limit** - Advanced request throttling
- **Security Middleware** - Threat detection and logging

## 📁 Project Structure

```
SparkleNest/
├── security_frontend/          # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Application pages
│   │   │   └── admin/         # Admin dashboard with notifications
│   │   ├── apis/              # API integration layer
│   │   ├── context/           # React context providers
│   │   └── assets/            # Static assets and images
│   └── public/                # Public assets
└── security_backend/           # Node.js backend application
    ├── controllers/           # Business logic controllers
    ├── models/               # MongoDB database models
    ├── routes/               # Express API routes
    ├── middleware/           # Custom middleware (auth, logging, rate limiting, security)
    ├── service/              # External service integrations
    ├── logs/                 # Security and activity logs
    └── certificate/          # SSL certificates for security
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aayushGhimire321/SparkleNest.git
   cd SparkleNest
   ```

2. **Setup Backend**
   ```bash
   cd security_backend
   npm install
   # Configure your .env file with database and JWT secrets
   npm start
   ```

3. **Setup Frontend**
   ```bash
   cd security_frontend
   npm install
   npm start
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Admin Dashboard: http://localhost:3000/admin (with admin credentials)
   - Password Reset: http://localhost:3000/forgotpassword
   - Rate Limit Status: http://localhost:5000/api/status/rate-limits

## 🛡️ Security Configuration

### Environment Variables (.env)
Create a `.env` file in the `security_backend/` directory with the following configuration:

```env
# Server Configuration
PORT=5000
BACKEND_URI="https://localhost:5000"

# Database Configuration
MONGODB_LOCAL='mongodb://localhost:27017/cosmocare'

# Security Configuration
JWT_SECRET=your_jwt_secret_here

# Khalti Payment Gateway (Live)
KHALTI_GATEWAY_URL="https://a.khalti.com"
KHALTI_PUBLIC_KEY="your_khalti_public_key"
KHALTI_SECRET_KEY="your_khalti_secret_key"

# Rate Limiting Configuration
RATE_LIMIT_GENERAL_MAX=100        # General requests per 15 minutes
RATE_LIMIT_AUTH_MAX=5            # Authentication attempts per 15 minutes
RATE_LIMIT_PAYMENT_MAX=3         # Payment attempts per 5 minutes
RATE_LIMIT_PASSWORD_RESET_MAX=3  # Password reset attempts per hour
RATE_LIMIT_REGISTRATION_MAX=5    # Registration attempts per hour
RATE_LIMIT_API_MAX=60           # API requests per minute

# Email Configuration
EMAIL_USER="your_email@gmail.com"
EMAIL_PASSWORD="your_app_password"

# Additional Security
SMS_API_KEY="your_sms_api_key"
RECAPTCHA_SECRET_KEY="your_recaptcha_secret"
```

### Security Monitoring
- **Security Logs**: Located in `security_backend/logs/security.log`
- **Real-time Monitoring**: Console output during development
- **Rate Limit Headers**: Automatic rate limit information in API responses
- **Status Endpoint**: `/api/status/rate-limits` for monitoring current limits

### SSL Certificates
The application uses SSL certificates located in `security_backend/certificate/`:
- `server.crt` - SSL certificate
- `server.key` - Private key
- Common Name: "Siyata Dumjan" (customized for the project)

## 📋 Available Scripts

### Frontend Development

### `npm start`

Runs the frontend app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### Backend Development

Navigate to `security_backend/` directory:

### `npm start`

Runs the backend server in development mode.\
Server will be available at [http://localhost:5000](http://localhost:5000).

API endpoints will be accessible for frontend integration.

## 🔗 API Endpoints

### Security & Monitoring
- `GET /api/status/rate-limits` - Check current rate limiting configuration
- `GET /api/khalti/test-khalti` - Test Khalti payment configuration
- `POST /api/khalti/test-payment-direct` - Direct payment API testing
- `POST /api/khalti/debug-khalti` - Debug Khalti integration

### Authentication (Rate Limited: 5 attempts/15min)
- `POST /api/user/create` - User registration (5 attempts/hour)
- `POST /api/user/login` - User login
- `POST /api/user/forgot_password` - Password reset (3 attempts/hour)
- `POST /api/user/verify_otp` - OTP verification
- `GET /api/user/current` - Get current user

### E-commerce (Rate Limited: 60 requests/minute)
- `GET /api/product` - Get all products
- `POST /api/product` - Create product (Admin)
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `GET /api/order` - Get orders
- `POST /api/order` - Place order

### Payment (Rate Limited: 3 attempts/5min)
- `POST /api/khalti/initialize-khalti` - Initialize payment
- `GET /api/khalti/complete-khalti-payment` - Complete payment
- `POST /api/khalti/initialize-khalti-simple` - Simplified payment testing

## � Latest Features (2025 Update)

### 🔔 Smart Notification System
- **Real-time Alerts** - Instant notifications for new orders and system events
- **Inventory Management** - Automated low stock and out-of-stock alerts
- **Admin Dashboard Integration** - Live notification feed with glassmorphism design
- **Interactive UI** - Mark as read, delete, and refresh functionality
- **Backend Integration** - Dynamic notifications from real order and product data

### 🎨 Enhanced UI/UX
- **Modern Design** - Updated glassmorphism effects and animations
- **Responsive Notifications** - Mobile-optimized notification dropdown
- **Loading States** - Professional loading spinners and transitions
- **Error Handling** - Graceful fallbacks and user feedback

## �🌟 Key Features

### 🎭 Premium UI/UX
- **Glassmorphism Effects** - Modern transparent design elements
- **Smooth Animations** - Engaging micro-interactions
- **Dark Theme Support** - Elegant color schemes
- **Mobile Responsive** - Perfect experience on all devices

### 🛒 E-commerce Functionality
- **Product Browsing** - Category-wise product exploration
- **Search & Filter** - Advanced product discovery
- **Shopping Cart** - Seamless cart management
- **Wishlist** - Save favorite products
- **Order Tracking** - Complete order lifecycle

### 🔐 Security Features
- **Encrypted Passwords** - Secure user data with bcrypt hashing
- **JWT Authentication** - Stateless authentication with secure tokens
- **Password Reset Security** - Two-factor verification with OTP and history validation
- **SSL Certificates** - Encrypted communication between client and server
- **Input Validation** - Comprehensive data validation and sanitization
- **Password History Tracking** - Prevents password reuse for enhanced security
- **Advanced Rate Limiting** - Multi-tier protection system
  - General API protection (100 req/15min)
  - Authentication throttling (5 attempts/15min)
  - Payment security (3 attempts/5min)
  - Registration limits (5 attempts/hour)
  - Password reset protection (3 attempts/hour)
- **Real-time Security Monitoring** - Automated threat detection
  - SQL injection prevention
  - XSS attack protection
  - Path traversal defense
  - Command injection blocking
- **Security Logging** - Comprehensive audit trails
  - Rate limit violations
  - Authentication failures
  - Suspicious activity detection
  - Security event timestamps

### 👨‍💼 Admin Panel
- **Dashboard Analytics** - Business insights with real-time data
- **Smart Notifications** - Live order alerts and inventory warnings
- **Product Management** - Add, edit, delete products with image upload
- **Order Management** - Process and track orders with status updates
- **User Management** - Customer administration and profile management
- **Activity Logs** - System monitoring and audit trails
- **Inventory Alerts** - Low stock and out-of-stock notifications



# 🧹 Project Hygiene & Best Practices

### .gitignore Usage
Your project includes a comprehensive `.gitignore` file to keep your repository clean and secure. This file ensures that sensitive environment variables, build outputs, logs, and IDE-specific files are not tracked by Git.

**Common entries:**
- `node_modules/` - Node.js dependencies
- `.env` and related files - Environment variables
- `/build`, `/dist` - Build output directories
- `*.log`, `*.tmp` - Log and temporary files
- `.vscode/`, `.idea/` - IDE/editor settings

**Tip:** Regularly review and update your `.gitignore` to match your project's needs and avoid accidentally committing sensitive or unnecessary files.

## 🔧 Troubleshooting

### Rate Limiting Issues
If you encounter rate limiting errors:
1. **Check Current Limits**: Visit `/api/status/rate-limits` to see current configuration
2. **Review Logs**: Check `security_backend/logs/security.log` for rate limit violations
3. **Adjust Limits**: Modify environment variables in `.env` file if needed
4. **Clear Cache**: Restart the server to reset rate limit counters

### Payment Gateway Issues
For Khalti payment problems:
1. **Test Configuration**: Use `/api/khalti/test-khalti` endpoint
2. **Debug Mode**: Use `/api/khalti/debug-khalti` for detailed error information
3. **Check Credentials**: Verify live Khalti keys in `.env` file
4. **Rate Limits**: Ensure payment attempts don't exceed 3 per 5 minutes

### Security Monitoring
To monitor security events:
1. **Console Output**: Watch real-time security logs during development
2. **Log Files**: Review `security_backend/logs/security.log` for detailed audit trails
3. **Suspicious Activity**: Check for SQL injection, XSS, and other attack patterns
4. **Authentication Failures**: Monitor failed login attempts and patterns

### SSL Certificate Issues
If HTTPS doesn't work:
1. **Certificate Location**: Verify certificates exist in `security_backend/certificate/`
2. **Common Name**: Ensure certificates are generated for correct domain
3. **Browser Trust**: Accept self-signed certificates in development
4. **Port Configuration**: Confirm HTTPS runs on port 5000

## 🤝 Contributing

We welcome contributions to SparkleNest! Please feel free to submit issues, feature requests, and pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Developer

**Siyata Dumjan**
- GitHub: [@siyatadumjan](https://github.com/siyatadumjan)
- Project: [SparkleNest](https://github.com/siyatadumjan/SpakrleNest_Security_coursework2)

## 🙏 Acknowledgments

- Thanks to all contributors and testers
- Inspired by modern e-commerce platforms
- Built with love for the beauty and cosmetics industry

---

**✨ SparkleNest - Where beauty meets technology ✨**
