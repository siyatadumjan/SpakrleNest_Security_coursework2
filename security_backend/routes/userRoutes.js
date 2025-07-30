const router = require('express').Router();
const userController = require('../controllers/userControllers');
const { logRequest } = require('../middleware/ActivityLog');
const { authGuard, adminGuard } = require('../middleware/authGuard');
const { 
  registrationLimiter, 
  passwordResetLimiter, 
  authLimiter 
} = require('../middleware/rateLimiter');

// Creating user registration route (with registration rate limiter)
router.post('/create', registrationLimiter, logRequest, userController.createUser);

// Creating user login route (with auth rate limiter)
router.post('/login', authLimiter, logRequest, userController.verifyRecaptcha, userController.loginUser);

// Route to generate token
router.post('/token', authLimiter, logRequest, userController.getToken);

// Route to get current user
router.get('/current', authGuard, logRequest, userController.getCurrentUser);

// Password reset routes (with password reset rate limiter)
router.post('/forgot_password', passwordResetLimiter, logRequest, userController.forgotPassword);

router.post('/verify_otp', passwordResetLimiter, logRequest, userController.verifyOtpAndResetPassword)

// upload profile picture
router.post('/profile_picture', authGuard, logRequest, userController.uploadProfilePicture);

// update user details
router.put('/update', authGuard, logRequest, userController.editUserProfile);

//verify login otp (with auth rate limiter)
router.post('/verify_login_otp', authLimiter, logRequest, userController.loginOtp)

router.post('/resend_login_otp', authLimiter, userController.resendLoginOtp)

router.post('/verify_register_otp', registrationLimiter, userController.verifyRegisterOtp)

router.post(
    "/get-password-history",
    authGuard,
    userController.getPasswordHistory
  );



// Exporting the router
module.exports = router;
