import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [ip: string]: {
    count: number;
    resetTime: number;
  };
}

export const createRateLimiter = (windowMs: number = 15 * 60 * 1000, maxRequests: number = 100) => {
  const store: RateLimitStore = {};

  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
    const now = Date.now();

    if (!store[ip] || now > store[ip].resetTime) {
      store[ip] = {
        count: 1,
        resetTime: now + windowMs,
      };
      return next();
    }

    store[ip].count += 1;

    if (store[ip].count > maxRequests) {
      res.status(429).json({
        error: 'Too many requests from this IP. Please try again later.',
      });
      return;
    }

    next();
  };
};

export const authRateLimiter = createRateLimiter(15 * 60 * 1000, 20); // 20 requests per 15 mins for auth
export const apiRateLimiter = createRateLimiter(15 * 60 * 1000, 100); // 100 requests per 15 mins for general API
