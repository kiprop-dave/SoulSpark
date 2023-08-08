import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/webToken';
import { verify } from 'jsonwebtoken';
import { env } from '../lib/env';

export function verifyAccessTokenMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized' });
  } else {
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    } else {
      const payload = verifyAccessToken<{ userId: string }>(token);
      if (!payload) {
        return res.status(401).json({ message: 'Unauthorized' });
      } else {
        res.locals.userId = payload.userId;
        next();
      }
    }
  }
}
