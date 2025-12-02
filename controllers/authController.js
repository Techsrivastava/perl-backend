const authService = require('../services/authService');

class AuthController {
  // @desc    Register new user
  // @route   POST /api/auth/register
  // @access  Public
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Login user
  // @route   POST /api/auth/login
  // @access  Public
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      res.json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get current user
  // @route   GET /api/auth/me
  // @access  Private
  async getCurrentUser(req, res, next) {
    try {
      const userData = await authService.getCurrentUser(req.user._id);

      res.json({
        success: true,
        data: userData,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Update password
  // @route   PUT /api/auth/update-password
  // @access  Private
  async updatePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      await authService.updatePassword(req.user._id, currentPassword, newPassword);

      res.json({
        success: true,
        message: 'Password updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
