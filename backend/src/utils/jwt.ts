import jwt from 'jsonwebtoken';

export interface TokenPayload {
  id: string;
  role: 'user' | 'admin';
}

export const generateToken = (id: string, role: 'user' | 'admin'): string => {
  const secret = process.env.JWT_SECRET || 'supersecretjwtkey_dealership_2026';
  return jwt.sign({ id, role }, secret, { expiresIn: '1d' });
};

export const verifyToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_SECRET || 'supersecretjwtkey_dealership_2026';
  return jwt.verify(token, secret) as TokenPayload;
};
