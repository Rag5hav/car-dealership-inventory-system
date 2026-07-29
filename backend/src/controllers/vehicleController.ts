import { Request, Response } from 'express';
import { VehicleService } from '../services/vehicleService';

export const createVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { make, model, category, price, quantity } = req.body;
    if (!make || !model || !category || price === undefined || quantity === undefined) {
      res.status(400).json({ error: 'All fields (make, model, category, price, quantity) are required' });
      return;
    }
    const vehicle = await VehicleService.createVehicle({ make, model, category, price, quantity });
    res.status(201).json(vehicle);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to create vehicle' });
  }
};

export const getVehicles = async (req: Request, res: Response): Promise<void> => {
  try {
    const vehicles = await VehicleService.getAllVehicles();
    res.status(200).json(vehicles);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
};

export const searchVehicles = async (req: Request, res: Response): Promise<void> => {
  try {
    const vehicles = await VehicleService.searchVehicles(req.query);
    res.status(200).json(vehicles);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to search vehicles' });
  }
};

export const getVehicleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const vehicle = await VehicleService.getVehicleById(req.params.id);
    if (!vehicle) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }
    res.status(200).json(vehicle);
  } catch (error: any) {
    res.status(404).json({ error: 'Vehicle not found' });
  }
};

export const updateVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const vehicle = await VehicleService.updateVehicle(req.params.id, req.body);
    if (!vehicle) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }
    res.status(200).json(vehicle);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to update vehicle' });
  }
};

export const deleteVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const success = await VehicleService.deleteVehicle(req.params.id);
    if (!success) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }
    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to delete vehicle' });
  }
};

export const purchaseVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const vehicle = await VehicleService.purchaseVehicle(req.params.id);
    res.status(200).json({ message: 'Purchase successful', vehicle });
  } catch (error: any) {
    if (error.message === 'Vehicle is out of stock') {
      res.status(400).json({ error: error.message });
    } else if (error.message === 'Vehicle not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message || 'Purchase failed' });
    }
  }
};

export const restockVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { quantity } = req.body;
    const vehicle = await VehicleService.restockVehicle(req.params.id, Number(quantity));
    res.status(200).json({ message: 'Vehicle restocked successfully', vehicle });
  } catch (error: any) {
    if (error.message === 'Vehicle not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message || 'Restock failed' });
    }
  }
};
