import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in the environment variables');
    }

    await mongoose.connect(mongoUri);
    console.log(`MongoDB connected... ${mongoUri}`);
  } catch (err) {
    const error = err as Error;
    console.error(error.message);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;