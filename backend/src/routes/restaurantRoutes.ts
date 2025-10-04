import { Router } from 'express';
import {
  getAllRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  regenerateQRCode
} from '../controllers/restaurantController';
import { authMiddleware, isSuperAdmin, checkRestaurantAccess } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Süper admin için tüm restoranlar
router.get('/', authMiddleware, getAllRestaurants);

// Restoran detayı
router.get('/:id', authMiddleware, getRestaurant);

// Restoran oluştur (sadece süper admin)
router.post('/', authMiddleware, isSuperAdmin, upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'cover_image', maxCount: 1 }
]), createRestaurant);

// Restoran güncelle (süper admin veya restoran admini)
router.put(
  '/:id',
  authMiddleware,
  checkRestaurantAccess,
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'cover_image', maxCount: 1 }
  ]),
  updateRestaurant
);

// Restoran sil (sadece süper admin)
router.delete('/:id', authMiddleware, isSuperAdmin, deleteRestaurant);

// QR kod yenile
router.post('/:id/regenerate-qr', authMiddleware, checkRestaurantAccess, regenerateQRCode);

export default router;
