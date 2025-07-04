const Event = require('../models/Event');
const { protect } = require('../middleware/JWTauthentication');

// @desc    Get all events for a user
// @route   GET /api/events
// @access  Private
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find({ user: req.user.id })
            .sort({ start: 1 })
            .lean();

        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
exports.createEvent = async (req, res) => {
    try {
        const { title, description, start, end, category } = req.body;

        // Basic validation
        if (!title || !start || !end || !category) {
            return res.status(400).json({
                success: false,
                message: 'Title, start time, end time, and category are required'
            });
        }

        if (new Date(end) <= new Date(start)) {
            return res.status(400).json({
                success: false,
                message: 'End time must be after start time'
            });
        }

        const event = await Event.create({
            title,
            description,
            start,
            end,
            category,
            user: req.user.id
        });

        res.status(201).json({
            success: true,
            data: event
        });
    } catch (error) {
        console.error('Create event error:', error);
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private
exports.updateEvent = async (req, res) => {
    try {
        let event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Make sure user owns the event
        if (event.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to update this event'
            });
        }

        event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        console.error('Update event error:', error);
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private
exports.deleteEvent = async (req, res) => {
    try {
        console.log('Delete request received for event ID:', req.params.id);
        console.log('User ID:', req.user?.id);
        
        // Validate ObjectId format
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            console.log('Invalid ObjectId format:', req.params.id);
            return res.status(400).json({
                success: false,
                message: 'Invalid event ID format'
            });
        }

        const event = await Event.findById(req.params.id);
        console.log('Event found:', event ? 'Yes' : 'No');

        if (!event) {
            console.log('Event not found in database');
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        console.log('Event user ID:', event.user.toString());
        console.log('Request user ID:', req.user.id);

        // Make sure user owns the event
        if (event.user.toString() !== req.user.id) {
            console.log('User not authorized to delete this event');
            return res.status(401).json({
                success: false,
                message: 'Not authorized to delete this event'
            });
        }

        // Try multiple deletion methods to ensure compatibility
        try {
            // Method 1: findByIdAndDelete (recommended)
            await Event.findByIdAndDelete(req.params.id);
            console.log('Event deleted successfully using findByIdAndDelete');
        } catch (deleteError) {
            console.log('findByIdAndDelete failed, trying deleteOne:', deleteError.message);
            try {
                // Method 2: deleteOne
                await Event.deleteOne({ _id: req.params.id });
                console.log('Event deleted successfully using deleteOne');
            } catch (deleteOneError) {
                console.log('deleteOne failed, trying remove:', deleteOneError.message);
                // Method 3: remove (deprecated but might still work)
                await event.remove();
                console.log('Event deleted successfully using remove');
            }
        }

        res.status(200).json({
            success: true,
            data: {},
            message: 'Event deleted successfully'
        });
    } catch (error) {
        console.error('Delete event error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Server error: ' + error.message
        });
    }
};