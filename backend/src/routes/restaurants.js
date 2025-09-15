const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const { authenticateToken, requireSuperAdmin, requireRestaurantAdmin } = require('../middleware/auth');

// Super admin routes
router.get('/', authenticateToken, requireSuperAdmin, restaurantController.getAllRestaurants);
router.post('/', authenticateToken, requireSuperAdmin, restaurantController.createRestaurant);
router.delete('/:id', authenticateToken, requireSuperAdmin, restaurantController.deleteRestaurant);

// Both super admin and restaurant admin routes
router.get('/:id', authenticateToken, requireRestaurantAdmin, restaurantController.getRestaurant);
router.put('/:id', authenticateToken, requireRestaurantAdmin, restaurantController.updateRestaurant);
router.get('/:id/qr', authenticateToken, requireRestaurantAdmin, restaurantController.generateQRCode);

module.exports = router;