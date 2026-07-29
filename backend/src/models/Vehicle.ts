import mongoose, { Schema, Document } from 'mongoose';

export interface IVehicle extends Document {
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const VehicleSchema: Schema = new Schema(
  {
    make: {
      type: String,
      required: [true, 'Make is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: 'Quantity must be an integer',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound & Single Field Database Indexes for O(log N) Query Speed
VehicleSchema.index({ make: 1, category: 1, price: 1 });
VehicleSchema.index({ price: 1 });
VehicleSchema.index({ quantity: 1 });

export default mongoose.model<IVehicle>('Vehicle', VehicleSchema);
