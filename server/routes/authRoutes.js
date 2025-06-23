const express = require('express');
const { signup, login, getUserProfile, updateUserProfile } = require('../controllers/authController');
const { validateSignupData, validateLoginData } = require('../middleware/validation');

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register new user
// @access  Public
router.post('/signup', validateSignupData, signup);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateLoginData, login);

// @route   GET /api/auth/profile/:id
// @desc    Get user profile
// @access  Private (add auth middleware later)
router.get('/profile/:id', getUserProfile);

// @route   PUT /api/auth/profile/:id
// @desc    Update user profile
// @access  Private (add auth middleware later)
router.put('/profile/:id', updateUserProfile);

module.exports = router;