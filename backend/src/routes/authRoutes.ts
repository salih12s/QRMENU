import { Router } from 'express';
import { login, getMe, createUser, getAllUsers, deleteUser } from '../controllers/authController';
import { authMiddleware, isSuperAdmin } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.post('/register', authMiddleware, isSuperAdmin, createUser);
router.get('/users', authMiddleware, isSuperAdmin, getAllUsers);
router.delete('/users/:id', authMiddleware, isSuperAdmin, deleteUser);

export default router;
