import request from 'supertest';
import express, { Response } from 'express';
import { protect, adminOnly, AuthenticatedRequest } from '../src/middlewares/authMiddleware';
import { generateToken } from '../src/utils/jwt';

const app = express();
app.use(express.json());

app.get('/protected-route', protect, (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({ message: 'Access granted', user: req.user });
});

app.get('/admin-route', protect, adminOnly, (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({ message: 'Admin access granted', user: req.user });
});

describe('Authentication Middleware (TDD)', () => {
  const userToken = generateToken('user123', 'user');
  const adminToken = generateToken('admin123', 'admin');

  describe('protect middleware', () => {
    it('should deny access if Authorization header is missing', async () => {
      const res = await request(app).get('/protected-route');
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Access denied. No token provided');
    });

    it('should deny access if token is invalid', async () => {
      const res = await request(app)
        .get('/protected-route')
        .set('Authorization', 'Bearer invalidtoken123');
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Invalid or expired token');
    });

    it('should grant access if valid JWT token is provided', async () => {
      const res = await request(app)
        .get('/protected-route')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body.user).toMatchObject({ id: 'user123', role: 'user' });
    });
  });

  describe('adminOnly middleware', () => {
    it('should block non-admin user from accessing admin route', async () => {
      const res = await request(app)
        .get('/admin-route')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('error', 'Access denied. Admin role required');
    });

    it('should allow admin user to access admin route', async () => {
      const res = await request(app)
        .get('/admin-route')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.user).toMatchObject({ id: 'admin123', role: 'admin' });
    });
  });
});
