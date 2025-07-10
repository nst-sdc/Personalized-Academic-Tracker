const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    start: {
        type: Date,
        required: [true, 'Start time is required']
    },
    end: {
        type: Date,
        required: [true, 'End time is required'],
        validate: {
            validator: function(value) {
                return value > this.start;
            },
            message: 'End time must be after start time'
        }
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Class', 'Assignment', 'Meeting', 'Masterclass', 'Quiz', 'Contest', 'Practice', 'Other']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for faster querying
eventSchema.index({ user: 1 });
eventSchema.index({ start: 1 });
eventSchema.index({ end: 1 });

// Virtual for duration (in minutes)
eventSchema.virtual('duration').get(function() {
    return (this.end - this.start) / (1000 * 60);
});

module.exports = mongoose.model('Event', eventSchema);