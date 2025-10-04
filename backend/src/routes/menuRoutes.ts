import { Router } from 'express';
import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} from '../controllers/menuController';
import { authMiddleware, isRestaurantAdmin, checkRestaurantAccess } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Menü ürünlerini listele
router.get('/:restaurantId', authMiddleware, checkRestaurantAccess, getMenuItems);

// Menü ürünü oluştur
router.post('/', authMiddleware, isRestaurantAdmin, upload.single('image'), createMenuItem);

// Menü ürünü güncelle
router.put('/:id', authMiddleware, isRestaurantAdmin, upload.single('image'), updateMenuItem);

// Menü ürünü sil
router.delete('/:id', authMiddleware, isRestaurantAdmin, deleteMenuItem);

export default router;
