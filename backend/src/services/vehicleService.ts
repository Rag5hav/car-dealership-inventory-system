import Vehicle, { IVehicle } from '../models/Vehicle';

export interface CreateVehicleDTO {
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
}

export interface SearchVehicleQuery {
  make?: string;
  model?: string;
  category?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
}

export class VehicleService {
  static async createVehicle(dto: CreateVehicleDTO): Promise<IVehicle> {
    return Vehicle.create(dto);
  }

  static async getAllVehicles(): Promise<IVehicle[]> {
    return Vehicle.find().sort({ createdAt: -1 });
  }

  static async searchVehicles(query: SearchVehicleQuery): Promise<IVehicle[]> {
    const filter: any = {};

    if (query.make) {
      filter.make = { $regex: query.make, $options: 'i' };
    }
    if (query.model) {
      filter.model = { $regex: query.model, $options: 'i' };
    }
    if (query.category) {
      filter.category = { $regex: query.category, $options: 'i' };
    }
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      filter.price = {};
      if (query.minPrice !== undefined && query.minPrice !== '') {
        filter.price.$gte = Number(query.minPrice);
      }
      if (query.maxPrice !== undefined && query.maxPrice !== '') {
        filter.price.$lte = Number(query.maxPrice);
      }
    }

    return Vehicle.find(filter).sort({ createdAt: -1 });
  }

  static async getVehicleById(id: string): Promise<IVehicle | null> {
    return Vehicle.findById(id);
  }

  static async updateVehicle(id: string, updateData: Partial<CreateVehicleDTO>): Promise<IVehicle | null> {
    return Vehicle.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  static async deleteVehicle(id: string): Promise<boolean> {
    const deleted = await Vehicle.findByIdAndDelete(id);
    return !!deleted;
  }

  static async purchaseVehicle(id: string): Promise<IVehicle> {
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    if (vehicle.quantity <= 0) {
      throw new Error('Vehicle is out of stock');
    }

    vehicle.quantity -= 1;
    await vehicle.save();
    return vehicle;
  }

  static async restockVehicle(id: string, amount: number): Promise<IVehicle> {
    if (!amount || amount <= 0 || !Number.isInteger(amount)) {
      throw new Error('Restock quantity must be a positive integer');
    }

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    vehicle.quantity += amount;
    await vehicle.save();
    return vehicle;
  }
}
