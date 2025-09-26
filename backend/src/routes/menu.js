const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { authenticateToken, requireRestaurantAdmin } = require('../middleware/auth');

// Public route - QR kod ile menü görüntüleme
router.get('/qr/:qrCode', menuController.getMenuByQR);
router.post('/view/:qrCode', menuController.trackView);

// Protected routes - Admin paneli için
router.get('/restaurant/:restaurantId', authenticateToken, requireRestaurantAdmin, menuController.getRestaurantMenu);

// Category routes
router.post('/restaurant/:restaurantId/categories', authenticateToken, requireRestaurantAdmin, menuController.createCategory);
router.put('/categories/:categoryId', authenticateToken, requireRestaurantAdmin, menuController.updateCategory);
router.delete('/categories/:categoryId', authenticateToken, requireRestaurantAdmin, menuController.deleteCategory);

// Menu item routes
router.post('/categories/:categoryId/items', authenticateToken, requireRestaurantAdmin, menuController.createMenuItem);
router.put('/items/:menuItemId', authenticateToken, requireRestaurantAdmin, menuController.updateMenuItem);
router.delete('/items/:menuItemId', authenticateToken, requireRestaurantAdmin, menuController.deleteMenuItem);

module.exports = router;