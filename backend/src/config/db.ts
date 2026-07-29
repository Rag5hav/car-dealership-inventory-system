import mongoose from 'mongoose';

export const connectDB = async (mongoUri?: string): Promise<void> => {
  try {
    const uri = mongoUri || process.env.MONGO_URI || 'mongodb://localhost:27017/car_dealership';
    await mongoose.connect(uri);
    if (process.env.NODE_ENV !== 'test') {
      console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
  }
};
