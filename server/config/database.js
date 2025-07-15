const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Atlas connected successfully');
        
        if (process.env.NODE_ENV === 'development') {
            console.log(`Connected to database: ${mongoose.connection.name}`);
            console.log(`Database host: ${mongoose.connection.host}`);
        }
        
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        
        process.exit(1);
    }
};

module.exports = connectDB;