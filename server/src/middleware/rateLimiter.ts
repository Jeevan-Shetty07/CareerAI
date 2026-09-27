import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

export const rateLimiter = (maxRequests: number = 100, windowMinutes: number = 15) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const windowMs = windowMinutes * 60 * 1000;

    let record = rateLimitMap.get(ip);
    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs,
      };
      rateLimitMap.set(ip, record);
    } else {
      record.count += 1;
    }

    if (record.count > maxRequests) {
      res.status(429).json({
        success: false,
        message: `Too many requests from this IP. Please try again after ${Math.ceil((record.resetTime - now) / 60000)} minutes.`,
      });
      return;
    }

    next();
  };
};
