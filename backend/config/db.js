const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;

        if (!uri) {
            throw new Error('MONGODB_URI not set in environment');
        }

        if (mongoose.connection.readyState === 1) {
            return mongoose.connection;
        }

        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
        });
        return conn;
    } catch (error) {
        console.error('Database connection failed:', error.message);
        // Don't call process.exit() - let server.js handle the error and continue serving API routes
        throw error;
    }
};

module.exports = { connectDB, mongoose };
