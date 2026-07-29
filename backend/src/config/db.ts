import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../models/User';
import Vehicle from '../models/Vehicle';

export const seedInitialData = async (): Promise<void> => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.create({
        email: 'user@dealership.com',
        password: 'password123',
        role: 'user',
      });
      await User.create({
        email: 'admin@dealership.com',
        password: 'password123',
        role: 'admin',
      });
      console.log('Seeded initial demo users (user@dealership.com & admin@dealership.com)');
    }

    const vehicleCount = await Vehicle.countDocuments();
    if (vehicleCount === 0) {
      await Vehicle.insertMany([
        { make: 'Toyota', model: 'Camry Hybrid', category: 'Sedan', price: 28500, quantity: 5 },
        { make: 'Tesla', model: 'Model 3 Performance', category: 'Electric', price: 44000, quantity: 4 },
        { make: 'Honda', model: 'CR-V Touring', category: 'SUV', price: 34500, quantity: 3 },
        { make: 'Ford', model: 'Mustang GT Premium', category: 'Coupe', price: 47500, quantity: 2 },
        { make: 'BMW', model: 'X5 xDrive40i', category: 'SUV', price: 65000, quantity: 3 },
        { make: 'Porsche', model: 'Taycan 4S', category: 'Electric', price: 104000, quantity: 1 },
        { make: 'Chevrolet', model: 'Corvette Z06', category: 'Coupe', price: 112000, quantity: 0 },
      ]);
      console.log('Seeded initial dealership inventory fleet');
    }
  } catch (error) {
    console.error('Error seeding initial data:', error);
  }
};

export const connectDB = async (mongoUri?: string): Promise<void> => {
  const uri = mongoUri || process.env.MONGO_URI || 'mongodb://localhost:27017/car_dealership';
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    if (process.env.NODE_ENV !== 'test') {
      console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    }
    await seedInitialData();
  } catch (error) {
    console.warn('Local MongoDB connection failed. Launching isolated MongoMemoryServer for instant execution...');
    try {
      const mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`In-Memory MongoDB Connected successfully at ${memoryUri}`);
      await seedInitialData();
    } catch (memError) {
      console.error('Fatal error initializing MongoDB:', memError);
      process.exit(1);
    }
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
  }
};
