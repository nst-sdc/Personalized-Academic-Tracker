const errorHandler = (err, req, res, next) => {
    console.error('Error Stack:', err.stack);
    
    let error = { ...err };
    error.message = err.message;
    
    if (err.name === 'CastError') {
        const message = 'Invalid ID format';
        error = {
            message,
            statusCode: 400
        };
    }
    
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `${field} already exists`;
        error = {
            message,
            statusCode: 409
        };
    }
    
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = {
            message,
            statusCode: 400
        };
    }
    
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = {
            message,
            statusCode: 401
        };
    }
    
    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = {
            message,
            statusCode: 401
        };
    }
    
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

const notFound = (req, res, next) => {
    const error = new Error(`Route not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

module.exports = {
    errorHandler,
    notFound
};