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
                return res.status(409).json({
                    success: false,
                    message: 'User with this email already exists and is verified.'
                });
            }
        } else {
            // Check if phone number already exists
            const existingPhone = await User.phoneExists(phone, countryCode);
            if (existingPhone) {
                return res.status(409).json({
                    success: false,
                    message: 'User with this phone number already exists'
                });
            }
            // Create new user
            user = new User({ firstName, lastName, email, dob, countryCode, phone, password });
        }

        const verificationToken = user.generateVerificationToken();
        await user.save();

        // Construct verification URL to point to the frontend
        const verificationUrl = `${process.env.CLIENT_URL}/email-verified/${verificationToken}`;
        const message = `Thank you for registering with us! Please verify your email by clicking the link below:\n\n${verificationUrl}\n\nThis link will expire in 15 minutes.\n\nIf you didn't create an account, you can safely ignore this email.`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Email Verification - Your App',
                message, // Plain text fallback
                verificationUrl, // Pass URL for HTML template
                userName: `${user.firstName} ${user.lastName}`
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
            Object.keys(error.errors).forEach(key => {
                validationErrors[key] = error.errors[key].message;
            });
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationErrors
            });
        }

        if (error.code === 11000) {
            // Handle duplicate key error
            const field = Object.keys(error.keyValue)[0];
            return res.status(409).json({
                success: false,
                message: `${field} already exists. Please use a different ${field}.`
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// @desc    Verify user email
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Verification token is required.'
            });
        }

        // Hash the token to match what's stored in database
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            verificationToken: hashedToken,
            verificationTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Token is invalid or has expired. Please register again.'
            });
        }

        // Mark user as verified and clear verification token
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        user.emailVerifiedAt = new Date();
        await user.save({ validateBeforeSave: false });

        // Optionally send welcome email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Welcome to Your App!',
                message: `Hi ${user.firstName},\n\nWelcome to Your App! Your email has been successfully verified.\n\nYou can now log in to your account and start using our services.\n\nThank you for joining us!`,
                userName: `${user.firstName} ${user.lastName}`,
                isWelcomeEmail: true
            });
        } catch (emailError) {
            console.error('Welcome email error:', emailError);
            // Don't fail the verification if welcome email fails
        }

        res.status(200).json({
            success: true,
            message: 'Email verified successfully! You can now log in.'
        });

    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({
            success: false,
            message: 'An internal server error occurred.'
        });
    }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'Email is already verified'
            });
        }

        // Generate new verification token
        const verificationToken = user.generateVerificationToken();
        await user.save({ validateBeforeSave: false });

        const verificationUrl = `${process.env.CLIENT_URL}/email-verified/${verificationToken}`;
        const message = `Here's your new verification link:\n\n${verificationUrl}\n\nThis link will expire in 15 minutes.`;

        await sendEmail({
            email: user.email,
            subject: 'Email Verification - Resent',
            message,
            verificationUrl,
            userName: `${user.firstName} ${user.lastName}`
        });

        res.status(200).json({
            success: true,
            message: 'Verification email has been resent. Please check your inbox.'
        });

    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to resend verification email'
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: 'Account not verified. Please check your email for verification link.'
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Account is deactivated. Please contact support.'
            });
        }

        const token = generateToken(user._id);

        // Update last login time
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });

        // Remove password from response
        user.password = undefined;

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: user,
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
      const { firstName, lastName } = req.body;
  
      // Validate that the user is updating their own profile
      if (req.user.id !== id && req.user._id.toString() !== id) {
        return res.status(403).json({
          success: false,
          message: 'You can only update your own profile'
        });
      }
  
      // Validate required fields
      if (!firstName || !lastName) {
        return res.status(400).json({
          success: false,
          message: 'First name and last name are required'
        });
      }
  
      // Validate field lengths
      if (firstName.trim().length < 2 || lastName.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'First name and last name must be at least 2 characters long'
        });
      }
  
      // Find and update user
      const user = await User.findByIdAndUpdate(
        id,
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          updatedAt: new Date()
        },
        {
          new: true,
          runValidators: true
        }
      ).select('-password');
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isVerified: user.isVerified
        }
      });
  
    } catch (error) {
      console.error('Error updating profile:', error);
      
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: Object.values(error.errors).map(err => err.message)
        });
      }
  
      res.status(500).json({
        success: false,
        message: 'Server error occurred while updating profile'
      });
    }
  };

// @desc    Verify JWT token (used for session persistence)
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

        if (!user || !user.isActive || !user.isVerified) {
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
        // Don't log expected errors like expired tokens as server errors
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }
        console.error('Token verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// @desc    Logout user (invalidate token on client side)
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
    try {
        // In a stateless JWT implementation, logout is handled client-side
        // by removing the token from storage
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    signup,
    login,
    verifyEmail,
    resendVerificationEmail,
    getUserProfile,
    updateUserProfile,
    verifyToken,
    logout
};