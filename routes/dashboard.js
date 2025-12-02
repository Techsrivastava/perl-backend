const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/dashboard
// @desc    Get dashboard statistics
// @access  Private (Superadmin)
router.get('/', protect, authorize('superadmin'), dashboardController.getDashboardStats);

module.exports = router;
