import jwt from 'jsonwebtoken';

export interface TokenPayload {
  id: string;
  role: 'user' | 'admin';
}

export const generateToken = (id: string, role: 'user' | 'admin'): string => {
  const secret = process.env.JWT_SECRET || 'supersecretjwtkey_dealership_2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
  return jwt.sign({ id, role }, secret, { expiresIn });
};

export const verifyToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_SECRET || 'supersecretjwtkey_dealership_2026';
  return jwt.verify(token, secret) as TokenPayload;
};
