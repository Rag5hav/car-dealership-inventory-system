import { Router } from 'express';
import {
  createVehicle,
  getVehicles,
  searchVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
} from '../controllers/vehicleController';
import { protect, adminOnly } from '../middlewares/authMiddleware';

const router = Router();

// Public / General routes
router.get('/', getVehicles);
router.get('/search', searchVehicles);
router.get('/:id', getVehicleById);

// Protected routes (User or Admin)
router.post('/:id/purchase', protect, purchaseVehicle);

// Admin-only protected routes
router.post('/', protect, adminOnly, createVehicle);
router.put('/:id', protect, adminOnly, updateVehicle);
router.delete('/:id', protect, adminOnly, deleteVehicle);
router.post('/:id/restock', protect, adminOnly, restockVehicle);

export default router;
