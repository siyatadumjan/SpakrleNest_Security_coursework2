# ✨ SparkleNest - Premium Cosmetics E-commerce Platform

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

## 🎯 Latest Features (2025 Update)(2025 Update)

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
- **Payment Integration** - Secure payment processing with Khalti integration
- **Smart Notifications** - Automated notification system for orders and inventory
- **Activity Logging** - Comprehensive system activity monitoring
- **API Security** - SSL certificates and comprehensive error handling

## 🛠️ Technology Stack

### Frontend (`security_frontend/`)
- **React.js** - Modern UI library with hooks and context
- **CSS3** - Custom styling with glassmorphism effects and animations
- **React Icons** - Beautiful icon components
- **Real-time Updates** - Dynamic notification system
- **Responsive Design** - Mobile-first approach with modern UX

### Backend (`security_backend/`)
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - Database for data storage
- **JWT** - Authentication tokens
- **Multer** - File upload handling
- **Khalti API** - Payment gateway integration
- **SSL** - Secure communication

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
    ├── middleware/           # Custom middleware (auth, logging)
    ├── service/              # External service integrations
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
