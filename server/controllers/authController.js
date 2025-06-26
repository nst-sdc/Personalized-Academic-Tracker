const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, dob, countryCode, phone, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.emailExists(email);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
        }
        
        // Check if phone number already exists
        const existingPhone = await User.phoneExists(phone, countryCode);
        if (existingPhone) {
            return res.status(409).json({
                success: false,
                message: 'User with this phone number already exists'
            });
        }
        
        // Create new user
        const newUser = new User({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.toLowerCase().trim(),
            dob: new Date(dob),
            countryCode,
            phone: phone.replace(/\s+/g, ''), // Remove spaces from phone
            password
        });
        
        // Save user to database
        await newUser.save();
        
        // Generate JWT token
        const token = generateToken(newUser._id);
        
        // Return success response with token
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: newUser
        });
        
    } catch (error) {
        console.error('Signup error:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = {};
            Object.keys(error.errors).forEach(key => {
                validationErrors[key] = error.errors[key].message;
            });
            
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationErrors
            });
        }
        
        // Handle duplicate key error
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(409).json({
                success: false,
                message: `${field} already exists`
            });
        }
        
        // Generic server error
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }
        
        // Find user and include password for comparison
        const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        
        // Check if password matches
        const isPasswordCorrect = await user.comparePassword(password);
        
        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        
        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Account is deactivated. Please contact support.'
            });
        }
        
        // Generate JWT token
        const token = generateToken(user._id);
        
        // Update last login (optional)
        user.lastLogin = new Date();
        await user.save();
        
        // Return success response with token
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: user, // Password is automatically excluded by toJSON method
            expiresIn: process.env.JWT_EXPIRE || '7d'
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile/:id
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.status(200).json({
            success: true,
            user: user
        });
        
    } catch (error) {
        console.error('Get profile error:', error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile/:id
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, phone, countryCode } = req.body;
        
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Update allowed fields
        if (firstName) user.firstName = firstName.trim();
        if (lastName) user.lastName = lastName.trim();
        if (phone) user.phone = phone.replace(/\s+/g, '');
        if (countryCode) user.countryCode = countryCode;
        
        await user.save();
        
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: user
        });
        
    } catch (error) {
        console.error('Update profile error:', error);
        
        if (error.name === 'ValidationError') {
            const validationErrors = {};
            Object.keys(error.errors).forEach(key => {
                validationErrors[key] = error.errors[key].message;
            });
            
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationErrors
            });
        }
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// @desc    Verify JWT token
// @route   GET /api/auth/verify
// @access  Private
const verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token or user not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Token is valid',
            user: user
        });
        
    } catch (error) {
        console.error('Token verification error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    signup,
    login,
    getUserProfile,
    updateUserProfile,
    verifyToken
};