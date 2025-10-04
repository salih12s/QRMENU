import { Router } from 'express';
import { getRestaurantStats, getAllRestaurantsStats } from '../controllers/reportController';
import { authMiddleware, isSuperAdmin, checkRestaurantAccess } from '../middleware/auth';

const router = Router();

// Restoran bazlı istatistikler
router.get('/restaurant/:restaurantId', authMiddleware, checkRestaurantAccess, getRestaurantStats);

// Tüm restoranların istatistikleri (sadece süper admin)
router.get('/all', authMiddleware, isSuperAdmin, getAllRestaurantsStats);

export default router;
