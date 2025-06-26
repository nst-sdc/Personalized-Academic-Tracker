const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

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
        let user = await User.findOne({ email: email.toLowerCase().trim() });
        if (user) {
            // If user exists but is not verified, allow re-registration to resend email
            if (!user.isVerified) {
                // Update user details in case they changed and generate a new password hash
                user.set({ ...req.body, password }); 
            } else {
                return res.status(409).json({ success: false, message: 'User with this email already exists and is verified.' });
            }
        } else {
            // Check if phone number already exists
            const existingPhone = await User.phoneExists(phone, countryCode);
            if (existingPhone) {
                return res.status(409).json({ success: false, message: 'User with this phone number already exists' });
            }
            // Create new user
            user = new User({ firstName, lastName, email, dob, countryCode, phone, password });
        }
        
        const verificationToken = user.generateVerificationToken();
        await user.save();
        
        // Construct verification URL to point to the frontend
        const verificationUrl = `${process.env.CLIENT_URL}/email-verified/${verificationToken}`; 
        const message = `Thank you for registering. Please verify your email by clicking this link:\n\n${verificationUrl}\n\nThis link will expire in 15 minutes.`;
        
        try {
            await sendEmail({
                email: user.email,
                subject: 'Email Verification',
                message
            });
            
            res.status(201).json({
                success: true,
                message: 'Registration successful! Please check your email to verify your account.'
            });
            
        } catch (emailError) {
            console.error('Email sending error:', emailError);
            // If email fails, we should undo the user creation to allow them to try again
            await User.deleteOne({ _id: user._id });
            
            return res.status(500).json({
                success: false,
                message: 'Failed to send verification email. Please try signing up again.'
            });
        }
        
    } catch (error) {
        console.error('Signup error:', error);
        
        if (error.name === 'ValidationError') {
            const validationErrors = {};
            Object.keys(error.errors).forEach(key => validationErrors[key] = error.errors[key].message);
            return res.status(400).json({ success: false, message: 'Validation failed', errors: validationErrors });
        }
        
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// @desc    Verify user email
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
             return res.status(400).json({ success: false, message: 'Verification token is required.' });
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            verificationToken: hashedToken,
            verificationTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Token is invalid or has expired. Please register again.' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({ success: true, message: 'Email verified successfully! You can now log in.' });
        
    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }
        
        const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
        
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
        
        if (!user.isVerified) {
            return res.status(403).json({ success: false, message: 'Account not verified. Please check your email.' });
        }
        
        if (!user.isActive) {
            return res.status(403).json({ success: false, message: 'Account is deactivated. Please contact support.' });
        }
        
        const token = generateToken(user._id);
        
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });
        
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: user,
            expiresIn: process.env.JWT_EXPIRE || '7d'
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
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
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        res.status(200).json({ success: true, user: user });
        
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
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
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        if (firstName) user.firstName = firstName.trim();
        if (lastName) user.lastName = lastName.trim();
        if (phone) user.phone = phone.replace(/\s+/g, '');
        if (countryCode) user.countryCode = countryCode;
        
        await user.save();
        
        res.status(200).json({ success: true, message: 'Profile updated successfully', user: user });
        
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// @desc    Verify JWT token (used for session persistence)
// @route   GET /api/auth/verify
// @access  Private
const verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (!user || !user.isActive) {
            return res.status(401).json({ success: false, message: 'Invalid token or user not found' });
        }
        
        res.status(200).json({ success: true, message: 'Token is valid', user: user });
        
    } catch (error) {
        // Don't log expected errors like expired tokens as server errors
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
             return res.status(401).json({ success: false, message: 'Invalid or expired token' });
        }
        console.error('Token verification error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = {
    signup,
    login,
    verifyEmail,
    getUserProfile,
    updateUserProfile,
    verifyToken
};
