const express = require('express');
const { register, login, getMe, sendOTP, verifyOTP } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;