ikconst jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes middleware
const protect = async (req, res, next) => {
    try {
        let token;
        
        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        
        // Make sure token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route. No token provided.'
            });
        }
        
        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Get user from token
            const user = await User.findById(decoded.id);
            
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found. Token may be invalid.'
                });
            }
            
            // Check if user is active
            if (!user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'User account is deactivated.'
                });
            }
            
            // Add user to request object
            req.user = user;
            next();
            
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
            
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }
        
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error in authentication'
        });
    }
};

// Grant access to specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};

// Optional: Middleware to get user if token is present (for optional auth)
const optionalAuth = async (req, res, next) => {
    try {
        let token;
        
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.id);
                
                if (user && user.isActive) {
                    req.user = user;
                }
            } catch (error) {
                // Token invalid or expired, but we continue without user
                console.log('Optional auth failed:', error.message);
            }
        }
        
        next();
    } catch (error) {
        console.error('Optional auth middleware error:', error);
        next();
    }
};

module.exports = {
    protect,
    authorize,
    optionalAuth
};