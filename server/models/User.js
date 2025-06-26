const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const crypto = require('crypto');

// User Schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        minlength: [2, 'First name must be at least 2 characters long'],
        maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        minlength: [2, 'Last name must be at least 2 characters long'],
        maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    dob: {
        type: Date,
        required: [true, 'Date of birth is required'],
        validate: {
            validator: function(value) {
                const today = new Date();
                const birthDate = new Date(value);
                const age = today.getFullYear() - birthDate.getFullYear();
                return age >= 13 && age <= 120; // Age validation
            },
            message: 'You must be at least 13 years old'
        }
    },
    countryCode: {
        type: String,
        required: [true, 'Country code is required'],
        enum: ['+91', '+1', '+44', '+41'] // Only allow these country codes
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        validate: {
            validator: function(value) {
                // Basic phone validation - adjust regex based on your needs
                return /^[0-9]{10,15}$/.test(value.replace(/\s+/g, ''));
            },
            message: 'Please provide a valid phone number'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        select: false, // Hide password by default
        validate: {
            validator: function(value) {
                // Password must contain at least one uppercase, one lowercase, one number, and one special character
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(value);
            },
            message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        }
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    isActive: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    lastLogin: {
        type: Date,
        default: null
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date,
        default: null
    }
}, {
    timestamps: true // This adds createdAt and updatedAt fields
});

// Virtual for checking if account is locked
userSchema.virtual('isLocked').get(function() {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get user without password and sensitive fields
userSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.loginAttempts;
    delete userObject.lockUntil;
    delete userObject.verificationToken;
    delete userObject.verificationTokenExpires;
    return userObject;
};

// New: Generate and hash verification token
userSchema.methods.generateVerificationToken = function() {
    const token = crypto.randomBytes(32).toString('hex');
    this.verificationToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
    this.verificationTokenExpires = Date.now() + 15 * 60 * 1000; // Token expires in 15 minutes
    return token;
};

// Instance method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
    // If we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $unset: {
                lockUntil: 1
            },
            $set: {
                loginAttempts: 1
            }
        });
    }
    
    const updates = { $inc: { loginAttempts: 1 } };
    
    // If we have reached max attempts and it's not locked already, lock it
    if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
        updates.$set = {
            lockUntil: Date.now() + 2 * 60 * 60 * 1000 // 2 hours
        };
    }
    
    return this.updateOne(updates);
};

// Instance method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
    return this.updateOne({
        $unset: {
            loginAttempts: 1,
            lockUntil: 1
        }
    });
};

// Static method to find user by email
userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email: email.toLowerCase() });
};

// Static method to check if email exists
userSchema.statics.emailExists = function(email) {
    return this.findOne({ email: email.toLowerCase() }).select('_id');
};

// Static method to check if phone exists
userSchema.statics.phoneExists = function(phone, countryCode) {
    return this.findOne({ phone, countryCode }).select('_id');
};

module.exports = mongoose.model('User', userSchema);