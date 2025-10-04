import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ 
        success: false, 
        message: 'Yetkilendirme token\'ı bulunamadı' 
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Geçersiz veya süresi dolmuş token' 
    });
  }
};

export const isSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== 'super_admin') {
    res.status(403).json({ 
      success: false, 
      message: 'Bu işlem için süper admin yetkisi gerekli' 
    });
    return;
  }
  next();
};

export const isRestaurantAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== 'restaurant_admin' && req.user?.role !== 'super_admin') {
    res.status(403).json({ 
      success: false, 
      message: 'Bu işlem için restoran admin yetkisi gerekli' 
    });
    return;
  }
  next();
};

export const checkRestaurantAccess = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Route'dan id parametresini al (req.params.id)
  const restaurantId = parseInt(req.params.id || req.params.restaurantId || req.body.restaurant_id);
  
  if (req.user?.role === 'super_admin') {
    next();
    return;
  }
  
  if (req.user?.role === 'restaurant_admin' && req.user.restaurant_id === restaurantId) {
    next();
    return;
  }
  
  res.status(403).json({ 
    success: false, 
    message: 'Bu restorana erişim yetkiniz yok' 
  });
};
