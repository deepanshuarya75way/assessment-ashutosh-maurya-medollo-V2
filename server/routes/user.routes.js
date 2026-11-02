const express = require('express');
const { updateProfile, changePassword, getUsers, deleteAccount } = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// Protected routes
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.delete('/delete-account', protect, deleteAccount);

// Admin routes
router.get('/', protect, authorize('admin'), getUsers);

module.exports = router;