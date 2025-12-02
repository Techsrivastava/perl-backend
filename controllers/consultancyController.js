const consultancyService = require('../services/consultancyService');

class ConsultancyController {
  // @desc    Get all consultancies
  // @route   GET /api/consultancies
  // @access  Private (University, Superadmin)
  async getAllConsultancies(req, res, next) {
    try {
      const result = await consultancyService.getAllConsultancies(req.query);

      res.json({
        success: true,
        data: result.consultancies,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get single consultancy
  // @route   GET /api/consultancies/:id
  // @access  Private
  async getConsultancyById(req, res, next) {
    try {
      const consultancy = await consultancyService.getConsultancyById(req.params.id);

      res.json({
        success: true,
        data: consultancy,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Create consultancy
  // @route   POST /api/consultancies
  // @access  Private (Superadmin)
  async createConsultancy(req, res, next) {
    try {
      const consultancy = await consultancyService.createConsultancy(req.body);

      res.status(201).json({
        success: true,
        message: 'Consultancy created successfully',
        data: consultancy,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Update consultancy
  // @route   PUT /api/consultancies/:id
  // @access  Private (Consultant owner, Superadmin)
  async updateConsultancy(req, res, next) {
    try {
      const consultancy = await consultancyService.updateConsultancy(
        req.params.id,
        req.body,
        req.user
      );

      res.json({
        success: true,
        message: 'Consultancy updated successfully',
        data: consultancy,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Delete consultancy
  // @route   DELETE /api/consultancies/:id
  // @access  Private (Superadmin)
  async deleteConsultancy(req, res, next) {
    try {
      await consultancyService.deleteConsultancy(req.params.id);

      res.json({
        success: true,
        message: 'Consultancy deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get consultancy statistics
  // @route   GET /api/consultancies/:id/stats
  // @access  Private
  async getConsultancyStats(req, res, next) {
    try {
      const stats = await consultancyService.getConsultancyStats(req.params.id);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ConsultancyController();
