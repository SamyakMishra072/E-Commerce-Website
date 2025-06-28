const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/authController');
const { sendVerificationCode, verifyCode } = require('../controllers/verificationController');
const { getCurrentUser } = require('../controllers/profileController'); // ✅ make sure this is correct
const { protect } = require('../middleware/authMiddleware'); // ✅ must import this

// Auth Routes
router.post('/send-code', sendVerificationCode);
router.post('/verify-code', verifyCode);
router.post('/register', register);
router.post('/login', login);

// ✅ This line is causing your error because protect or getCurrentUser is missing or not imported correctly
router.get('/me', protect, getCurrentUser); // FIXED now

module.exports = router;
