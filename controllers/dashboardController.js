const dashboardService = require('../services/dashboardService');

class DashboardController {
  // @desc    Get dashboard statistics
  // @route   GET /api/dashboard
  // @access  Private (Superadmin)
  async getDashboardStats(req, res, next) {
    try {
      const stats = await dashboardService.getDashboardStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
