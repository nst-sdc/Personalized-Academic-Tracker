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
// Add this to your validation middleware file
// Or create a new validation function

const validateProfileUpdate = (req, res, next) => {
    const { firstName, lastName } = req.body;
    const errors = [];
  
    // Check if required fields are provided
    if (!firstName || typeof firstName !== 'string' || firstName.trim().length === 0) {
      errors.push('First name is required');
    } else if (firstName.trim().length < 2) {
      errors.push('First name must be at least 2 characters long');
    } else if (firstName.trim().length > 50) {
      errors.push('First name cannot exceed 50 characters');
    }
  
    if (!lastName || typeof lastName !== 'string' || lastName.trim().length === 0) {
      errors.push('Last name is required');
    } else if (lastName.trim().length < 2) {
      errors.push('Last name must be at least 2 characters long');
    } else if (lastName.trim().length > 50) {
      errors.push('Last name cannot exceed 50 characters');
    }
  
    // Check for invalid characters (only letters, spaces, hyphens, apostrophes)
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    if (firstName && !nameRegex.test(firstName.trim())) {
      errors.push('First name contains invalid characters');
    }
    if (lastName && !nameRegex.test(lastName.trim())) {
      errors.push('Last name contains invalid characters');
    }
  
    // If there are validation errors, return them
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }
  
    // Sanitize the input
    req.body.firstName = firstName.trim();
    req.body.lastName = lastName.trim();
  
    next();
  };

module.exports = {
    validateSignupData,
    validateLoginData,
    validateProfileUpdate
};