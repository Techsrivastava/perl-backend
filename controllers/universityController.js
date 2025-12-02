const universityService = require('../services/universityService');

class UniversityController {
  // @desc    Get all universities
  // @route   GET /api/universities
  // @access  Public
  async getAllUniversities(req, res, next) {
    try {
      const result = await universityService.getAllUniversities(req.query);

      res.json({
        success: true,
        data: result.universities,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get single university
  // @route   GET /api/universities/:id
  // @access  Public
  async getUniversityById(req, res, next) {
    try {
      const university = await universityService.getUniversityById(req.params.id);

      res.json({
        success: true,
        data: university,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Create university
  // @route   POST /api/universities
  // @access  Private (University, Superadmin)
  async createUniversity(req, res, next) {
    try {
      const university = await universityService.createUniversity(req.body);

      res.status(201).json({
        success: true,
        message: 'University created successfully',
        data: university,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Update university
  // @route   PUT /api/universities/:id
  // @access  Private (University owner or Superadmin)
  async updateUniversity(req, res, next) {
    try {
      const university = await universityService.updateUniversity(
        req.params.id,
        req.body,
        req.user
      );

      res.json({
        success: true,
        message: 'University updated successfully',
        data: university,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Delete university
  // @route   DELETE /api/universities/:id
  // @access  Private (Superadmin)
  async deleteUniversity(req, res, next) {
    try {
      await universityService.deleteUniversity(req.params.id);

      res.json({
        success: true,
        message: 'University deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get university statistics
  // @route   GET /api/universities/:id/stats
  // @access  Private
  async getUniversityStats(req, res, next) {
    try {
      const stats = await universityService.getUniversityStats(req.params.id);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UniversityController();
