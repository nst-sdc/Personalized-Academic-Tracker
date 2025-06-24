// Validation middleware for signup
const validateSignupData = (req, res, next) => {
    const { firstName, lastName, email, dob, countryCode, phone, password } = req.body;
    
    // Check if all required fields are present
    if (!firstName || !lastName || !email || !dob || !countryCode || !phone || !password) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required',
            missingFields: {
                firstName: !firstName,
                lastName: !lastName,
                email: !email,
                dob: !dob,
                countryCode: !countryCode,
                phone: !phone,
                password: !password
            }
        });
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid email address'
        });
    }
    
    // Basic phone validation
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid phone number (10-15 digits)'
        });
    }
    
    // Password strength validation
    if (password.length < 8) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 8 characters long'
        });
    }
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            success: false,
            message: 'Password must contain at least one uppercase letter, lowercase letter, number, and special character'
        });
    }
    
    // Age validation
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 13) {
        return res.status(400).json({
            success: false,
            message: 'You must be at least 13 years old to sign up'
        });
    }
    
    next();
};

// Validation middleware for login
const validateLoginData = (req, res, next) => {
    const { email, password } = req.body;
    
    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required',
            missingFields: {
                email: !email,
                password: !password
            }
        });
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid email address'
        });
    }
    
    next();
};

// Validation middleware for profile update
const validateProfileUpdate = (req, res, next) => {
    const { firstName, lastName, phone, countryCode } = req.body;
    
    // Check if at least one field is provided for update
    if (!firstName && !lastName && !phone && !countryCode) {
        return res.status(400).json({
            success: false,
            message: 'At least one field is required for update'
        });
    }
    
    // Validate phone if provided
    if (phone) {
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid phone number (10-15 digits)'
            });
        }
    }
    
    // Validate name fields if provided
    if (firstName && (firstName.trim().length < 2 || firstName.trim().length > 50)) {
        return res.status(400).json({
            success: false,
            message: 'First name must be between 2 and 50 characters'
        });
    }
    
    if (lastName && (lastName.trim().length < 2 || lastName.trim().length > 50)) {
        return res.status(400).json({
            success: false,
            message: 'Last name must be between 2 and 50 characters'
        });
    }
    
    // Validate country code if provided
    if (countryCode && !['+91', '+1', '+44', '+41'].includes(countryCode)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid country code'
        });
    }
    
    next();
};

module.exports = {
    validateSignupData,
    validateLoginData,
    validateProfileUpdate
};