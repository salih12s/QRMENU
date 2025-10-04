import { Router } from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController';
import { authMiddleware, isRestaurantAdmin, checkRestaurantAccess } from '../middleware/auth';

const router = Router();

// Kategorileri listele
router.get('/:restaurantId', authMiddleware, checkRestaurantAccess, getCategories);

// Kategori oluştur
router.post('/', authMiddleware, isRestaurantAdmin, createCategory);

// Kategori güncelle
router.put('/:id', authMiddleware, isRestaurantAdmin, updateCategory);

// Kategori sil
router.delete('/:id', authMiddleware, isRestaurantAdmin, deleteCategory);

export default router;
