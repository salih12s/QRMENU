const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');
const { authenticateToken, requireSuperAdmin, requireRestaurantAdmin } = require('../middleware/auth');

// Restaurant admin routes
router.get('/restaurant/:restaurantId', authenticateToken, requireRestaurantAdmin, reportsController.getRestaurantReports);

// Super admin routes
router.get('/admin/system', authenticateToken, requireSuperAdmin, reportsController.getSuperAdminReports);

module.exports = router;