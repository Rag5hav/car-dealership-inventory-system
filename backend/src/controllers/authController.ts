import { Request, Response } from 'express';
import { AuthService } from '../services/authService.js';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }
    const result = await AuthService.register({ email, password, role });
    res.status(201).json(result);
  } catch (error: any) {
    if (error.message === 'User already exists with this email') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message || 'Registration failed' });
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }
    const result = await AuthService.login({ email, password });
    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === 'Invalid email or password') {
      res.status(401).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message || 'Login failed' });
    }
  }
};
