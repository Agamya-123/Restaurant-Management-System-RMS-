import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/savoria_rms';

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('[MongoDB] Connected to Savoria RMS database.');
    } catch (err) {
        console.error('[MongoDB] Connection failed:', err.message);
        process.exit(1);
    }
};
