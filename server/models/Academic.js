const mongoose = require('mongoose');

const academicSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    instituteName: {
        type: String,
        required: [true, 'Institute name is required'],
        trim: true,
        minlength: [3, 'Institute name must be at least 3 characters long'],
        maxlength: [100, 'Institute name cannot exceed 100 characters']
    },
    branch: {
        type: String,
        required: [true, 'Branch/Department is required'],
        trim: true,
        minlength: [3, 'Branch must be at least 3 characters long'],
        maxlength: [100, 'Branch cannot exceed 100 characters']
    },
    urnNumber: {
        type: String,
        required: [true, 'URN/Roll Number is required'],
        trim: true,
        unique: true,
        minlength: [5, 'URN must be at least 5 characters long'],
        maxlength: [30, 'URN cannot exceed 30 characters']
    },
    currentYear: {
        type: Number,
        required: [true, 'Current year is required'],
        min: [1, 'Year must be between 1 and 4'],
        max: [4, 'Year must be between 1 and 4']
    },
    currentSemester: {
        type: Number,
        required: [true, 'Current semester is required'],
        min: [1, 'Semester must be between 1 and 8'],
        max: [8, 'Semester must be between 1 and 8']
    },
    gradingSystem: {
        type: String,
        required: [true, 'Grading system is required'],
        enum: {
            values: ['cgpa', 'gpa', 'percentage'],
            message: 'Grading system must be either cgpa, gpa, or percentage'
        }
    },
    // Optional fields for additional academic information
    currentGPA: {
        type: Number,
        min: [0, 'GPA cannot be negative'],
        max: [10, 'GPA cannot exceed 10']
    },
    totalCredits: {
        type: Number,
        min: [0, 'Credits cannot be negative']
    },
    expectedGraduationDate: {
        type: Date
    },
    // Academic status
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for efficient queries
academicSchema.index({ userId: 1 });
academicSchema.index({ urnNumber: 1 });

// Virtual to get display name for grading system
academicSchema.virtual('gradingSystemDisplay').get(function() {
    switch (this.gradingSystem) {
        case 'cgpa':
            return 'CGPA (10 Point Scale)';
        case 'gpa':
            return 'GPA (4 Point Scale)';
        case 'percentage':
            return 'Percentage';
        default:
            return this.gradingSystem;
    }
});

// Method to validate URN uniqueness excluding current document
academicSchema.methods.isURNUnique = async function(urnNumber) {
    const existingAcademic = await this.constructor.findOne({
        urnNumber: urnNumber,
        _id: { $ne: this._id }
    });
    return !existingAcademic;
};

// Static method to find by user ID
academicSchema.statics.findByUserId = function(userId) {
    return this.findOne({ userId });
};

// Static method to check if URN exists
academicSchema.statics.urnExists = function(urnNumber, excludeId = null) {
    const query = { urnNumber };
    if (excludeId) {
        query._id = { $ne: excludeId };
    }
    return this.findOne(query).select('_id');
};

// Pre-save middleware for validation
academicSchema.pre('save', async function(next) {
    try {
        // Check URN uniqueness only if it's modified
        if (this.isModified('urnNumber')) {
            const existingURN = await this.constructor.urnExists(this.urnNumber, this._id);
            if (existingURN) {
                const error = new Error('URN/Roll Number already exists');
                error.name = 'ValidationError';
                return next(error);
            }
        }
        
        // Validate semester based on year (optional logic)
        if (this.currentYear && this.currentSemester) {
            const maxSemester = this.currentYear * 2;
            if (this.currentSemester > maxSemester) {
                const error = new Error(`Semester ${this.currentSemester} is not valid for year ${this.currentYear}`);
                error.name = 'ValidationError';
                return next(error);
            }
        }
        
        next();
    } catch (error) {
        next(error);
    }
});

// Transform output
academicSchema.methods.toJSON = function() {
    const academicObject = this.toObject();
    academicObject.gradingSystemDisplay = this.gradingSystemDisplay;
    return academicObject;
};

module.exports = mongoose.model('Academic', academicSchema);