const express = require('express');
const { signup, login, getUserProfile, updateUserProfile, verifyToken } = require('../controllers/authController');
const { validateSignupData, validateLoginData, validateProfileUpdate } = require('../middleware/validation');
const { protect, authorize } = require('../middleware/JWTauthentication');

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register new user
// @access  Public
router.post('/signup', validateSignupData, signup);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateLoginData, login);

// @route   GET /api/auth/verify
// @desc    Verify JWT token
// @access  Private
router.get('/verify', verifyToken);

// @route   GET /api/auth/profile/:id
// @desc    Get user profile
// @access  Private
router.get('/profile/:id', protect, getUserProfile);

// @route   PUT /api/auth/profile/:id
// @desc    Update user profile
// @access  Private
router.put('/profile/:id', protect, validateProfileUpdate, updateUserProfile);

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
});

// Admin only routes (examples)
// @route   GET /api/auth/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/users', protect, authorize('admin'), async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;