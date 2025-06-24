// backend/routes/authRoutes.js
const express = require('express');
const { register, login } = require('../controllers/authController');
const { sendVerificationCode, verifyCode } = require('../controllers/verificationController');
const router = express.Router();

// New endpoints:
router.post('/send-code', sendVerificationCode);
router.post('/verify-code', verifyCode);

// Old register & login
router.post('/register', register);
router.post('/login', login);

module.exports = router;
