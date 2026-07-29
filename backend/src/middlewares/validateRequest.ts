import { Request, Response, NextFunction } from 'express';
import { validateVehicleInput, validateEmail } from '../utils/validation';

export const validateVehiclePayload = (req: Request, res: Response, next: NextFunction): void => {
  const result = validateVehicleInput(req.body);
  if (!result.isValid) {
    res.status(400).json({ error: result.error });
    return;
  }
  next();
};

export const validateRegistrationPayload = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password } = req.body;
  if (!email || !validateEmail(email)) {
    res.status(400).json({ error: 'Valid email address is required' });
    return;
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters long' });
    return;
  }
  next();
};
