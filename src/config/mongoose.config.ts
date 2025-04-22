   import mongoose from 'mongoose';

   const connectDB = async (): Promise<void> => {
     try {
       await mongoose.connect('mongodb://mongo:27017/movie-db');
       console.log('Connected to MongoDB');
     } catch (err) {
       console.error('Error connecting to MongoDB:', err);
       process.exit(1);
     }
   };

   export default connectDB;