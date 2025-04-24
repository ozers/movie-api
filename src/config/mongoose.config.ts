import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoHost = process.env.MONGO_HOST || 'localhost';
    const mongoPort = process.env.MONGO_PORT || '27017';
    const mongoDatabase = process.env.MONGO_DATABASE || 'movie-db';
    
    const connectionString = `mongodb://${mongoHost}:${mongoPort}/${mongoDatabase}`;
    
    console.log(`Connecting to MongoDB at ${connectionString}`);
    await mongoose.connect(connectionString);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1)
  }
};

export default connectDB