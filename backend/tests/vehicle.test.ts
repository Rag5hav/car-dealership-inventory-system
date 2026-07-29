import request from 'supertest';
import app from '../src/app';
import { connectTestDB, clearTestDB, closeTestDB } from './setup';
import { generateToken } from '../src/utils/jwt';
import Vehicle from '../src/models/Vehicle';

beforeAll(async () => {
  await connectTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

describe('Vehicle & Inventory Module (TDD)', () => {
  const userToken = generateToken('user_id_1', 'user');
  const adminToken = generateToken('admin_id_1', 'admin');

  const sampleVehicle = {
    make: 'Toyota',
    model: 'Camry',
    category: 'Sedan',
    price: 25000,
    quantity: 5,
  };

  describe('POST /api/vehicles (Admin Only)', () => {
    it('should allow admin to create a new vehicle', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sampleVehicle);

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject(sampleVehicle);
      expect(res.body).toHaveProperty('_id');
    });

    it('should deny non-admin users from creating a vehicle', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send(sampleVehicle);

      expect(res.status).toBe(403);
    });

    it('should deny unauthenticated requests', async () => {
      const res = await request(app).post('/api/vehicles').send(sampleVehicle);
      expect(res.status).toBe(401);
    });

    it('should fail validation when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ make: 'Toyota' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /api/vehicles', () => {
    it('should return list of all vehicles', async () => {
      await Vehicle.create(sampleVehicle);
      await Vehicle.create({
        make: 'Honda',
        model: 'CR-V',
        category: 'SUV',
        price: 30000,
        quantity: 3,
      });

      const res = await request(app).get('/api/vehicles');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });
  });

  describe('GET /api/vehicles/search', () => {
    beforeEach(async () => {
      await Vehicle.create({ make: 'Tesla', model: 'Model 3', category: 'Electric', price: 45000, quantity: 4 });
      await Vehicle.create({ make: 'Toyota', model: 'RAV4', category: 'SUV', price: 28000, quantity: 2 });
      await Vehicle.create({ make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 20000, quantity: 6 });
    });

    it('should search vehicles by make, category, minPrice, maxPrice', async () => {
      const res = await request(app)
        .get('/api/vehicles/search')
        .query({ make: 'Toyota', minPrice: 22000 });

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].model).toBe('RAV4');
    });
  });

  describe('GET /api/vehicles/:id', () => {
    it('should return vehicle details by ID', async () => {
      const vehicle = await Vehicle.create(sampleVehicle);
      const res = await request(app).get(`/api/vehicles/${vehicle._id}`);

      expect(res.status).toBe(200);
      expect(res.body.model).toBe('Camry');
    });

    it('should return 404 for non-existent vehicle ID', async () => {
      const res = await request(app).get('/api/vehicles/60f7b0f1a9b2c34d5e6f7a8b');
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/vehicles/:id (Admin Only)', () => {
    it('should allow admin to update vehicle details', async () => {
      const vehicle = await Vehicle.create(sampleVehicle);

      const res = await request(app)
        .put(`/api/vehicles/${vehicle._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 26000, quantity: 8 });

      expect(res.status).toBe(200);
      expect(res.body.price).toBe(26000);
      expect(res.body.quantity).toBe(8);
    });

    it('should deny non-admin users from updating vehicle', async () => {
      const vehicle = await Vehicle.create(sampleVehicle);

      const res = await request(app)
        .put(`/api/vehicles/${vehicle._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ price: 26000 });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/vehicles/:id (Admin Only)', () => {
    it('should allow admin to delete a vehicle', async () => {
      const vehicle = await Vehicle.create(sampleVehicle);

      const res = await request(app)
        .delete(`/api/vehicles/${vehicle._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Vehicle deleted successfully');

      const found = await Vehicle.findById(vehicle._id);
      expect(found).toBeNull();
    });

    it('should deny non-admin users from deleting vehicle', async () => {
      const vehicle = await Vehicle.create(sampleVehicle);

      const res = await request(app)
        .delete(`/api/vehicles/${vehicle._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/vehicles/:id/purchase', () => {
    it('should decrease quantity by 1 when purchased by authenticated user', async () => {
      const vehicle = await Vehicle.create({ ...sampleVehicle, quantity: 2 });

      const res = await request(app)
        .post(`/api/vehicles/${vehicle._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.vehicle.quantity).toBe(1);
      expect(res.body.message).toBe('Purchase successful');
    });

    it('should prevent purchase if vehicle quantity is zero', async () => {
      const vehicle = await Vehicle.create({ ...sampleVehicle, quantity: 0 });

      const res = await request(app)
        .post(`/api/vehicles/${vehicle._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Vehicle is out of stock');
    });
  });

  describe('POST /api/vehicles/:id/restock (Admin Only)', () => {
    it('should increase quantity based on request body when restocked by admin', async () => {
      const vehicle = await Vehicle.create({ ...sampleVehicle, quantity: 1 });

      const res = await request(app)
        .post(`/api/vehicles/${vehicle._id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 10 });

      expect(res.status).toBe(200);
      expect(res.body.vehicle.quantity).toBe(11);
      expect(res.body.message).toBe('Vehicle restocked successfully');
    });

    it('should deny non-admin users from restocking vehicle', async () => {
      const vehicle = await Vehicle.create(sampleVehicle);

      const res = await request(app)
        .post(`/api/vehicles/${vehicle._id}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 5 });

      expect(res.status).toBe(403);
    });
  });
});
