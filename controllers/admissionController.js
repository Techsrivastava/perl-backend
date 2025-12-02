const AdmissionService = require('../services/admissionService');

class AdmissionController {
  // Get all admissions
  static async getAdmissions(req, res, next) {
    try {
      const { page, limit, status, universityId, consultancyId, studentId } = req.query;

      const filters = {};

      // Role-based filtering
      if (req.user.role === 'consultant') {
        filters.consultancyId = req.user.consultancyId;
      } else if (req.user.role === 'university') {
        filters.universityId = req.user.universityId;
      }

      // Additional filters
      if (status) filters.status = status;
      if (universityId) filters.universityId = universityId;
      if (consultancyId) filters.consultancyId = consultancyId;
      if (studentId) filters.studentId = studentId;

      const result = await AdmissionService.getAdmissions(filters, { page, limit });

      res.status(200).json({
        success: true,
        data: result.admissions,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  // Get single admission
  static async getAdmission(req, res, next) {
    try {
      const admission = await AdmissionService.getAdmissionById(req.params.id);

      res.status(200).json({
        success: true,
        data: admission
      });
    } catch (error) {
      next(error);
    }
  }

  // Create admission
  static async createAdmission(req, res, next) {
    try {
      const admission = await AdmissionService.createAdmission(req.body);

      res.status(201).json({
        success: true,
        data: admission,
        message: 'Admission created successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Update admission
  static async updateAdmission(req, res, next) {
    try {
      const admission = await AdmissionService.updateAdmission(req.params.id, req.body);

      res.status(200).json({
        success: true,
        data: admission,
        message: 'Admission updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete admission
  static async deleteAdmission(req, res, next) {
    try {
      await AdmissionService.deleteAdmission(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Admission deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Get admissions by student
  static async getAdmissionsByStudent(req, res, next) {
    try {
      const { studentId } = req.params;
      const { status } = req.query;

      const filters = {};
      if (status) filters.status = status;

      const result = await AdmissionService.getAdmissionsByStudent(studentId, filters);

      res.status(200).json({
        success: true,
        data: result.admissions,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  // Get admissions by university
  static async getAdmissionsByUniversity(req, res, next) {
    try {
      const { universityId } = req.params;
      const { status } = req.query;

      const filters = {};
      if (status) filters.status = status;

      const result = await AdmissionService.getAdmissionsByUniversity(universityId, filters);

      res.status(200).json({
        success: true,
        data: result.admissions,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  // Get admissions by consultancy
  static async getAdmissionsByConsultancy(req, res, next) {
    try {
      const { consultancyId } = req.params;
      const { status } = req.query;

      const filters = {};
      if (status) filters.status = status;

      const result = await AdmissionService.getAdmissionsByConsultancy(consultancyId, filters);

      res.status(200).json({
        success: true,
        data: result.admissions,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  // Get admission statistics
  static async getAdmissionStatistics(req, res, next) {
    try {
      const filters = {};

      // Role-based filtering
      if (req.user.role === 'consultant') {
        filters.consultancyId = req.user.consultancyId;
      } else if (req.user.role === 'university') {
        filters.universityId = req.user.universityId;
      }

      const stats = await AdmissionService.getAdmissionStatistics(filters);

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdmissionController;
