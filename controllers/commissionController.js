const CommissionService = require('../services/commissionService');

class CommissionController {
  // Get all commission transactions
  static async getCommissionTransactions(req, res, next) {
    try {
      const { page, limit, consultancyId, status, universityId } = req.query;

      const filters = {};

      // Role-based filtering
      if (req.user.role === 'consultant') {
        filters.consultancyId = req.user.consultancyId;
      } else if (req.user.role === 'university') {
        filters.universityId = req.user.universityId;
      }

      // Additional filters
      if (consultancyId) filters.consultancyId = consultancyId;
      if (status) filters.status = status;
      if (universityId) filters.universityId = universityId;

      const result = await CommissionService.getCommissionTransactions(filters, { page, limit });

      res.status(200).json({
        success: true,
        data: result.transactions,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  // Get single commission transaction
  static async getCommissionTransaction(req, res, next) {
    try {
      const transaction = await CommissionService.getCommissionTransactionById(req.params.id);

      res.status(200).json({
        success: true,
        data: transaction
      });
    } catch (error) {
      next(error);
    }
  }

  // Create commission transaction
  static async createCommissionTransaction(req, res, next) {
    try {
      const transaction = await CommissionService.createCommissionTransaction(req.body);

      res.status(201).json({
        success: true,
        data: transaction,
        message: 'Commission transaction created successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Update commission transaction
  static async updateCommissionTransaction(req, res, next) {
    try {
      const transaction = await CommissionService.getCommissionTransactionById(req.params.id);

      // Update allowed fields
      const allowedFields = ['status', 'paymentDate', 'paymentReference', 'remarks'];
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          transaction[field] = req.body[field];
        }
      });

      if (req.body.status && req.body.status !== transaction.status) {
        await CommissionService.updateCommissionStatus(req.params.id, req.body.status, req.body);
      } else {
        await transaction.save();
      }

      const updatedTransaction = await CommissionService.getCommissionTransactionById(req.params.id);

      res.status(200).json({
        success: true,
        data: updatedTransaction,
        message: 'Commission transaction updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Update commission status
  static async updateCommissionStatus(req, res, next) {
    try {
      const { status, paymentDate, paymentReference } = req.body;

      const transaction = await CommissionService.updateCommissionStatus(
        req.params.id,
        status,
        { paymentDate, paymentReference }
      );

      res.status(200).json({
        success: true,
        data: transaction,
        message: 'Commission status updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete commission transaction
  static async deleteCommissionTransaction(req, res, next) {
    try {
      await CommissionService.deleteCommissionTransaction(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Commission transaction deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Get commission statistics
  static async getCommissionStatistics(req, res, next) {
    try {
      const filters = {};

      // Role-based filtering
      if (req.user.role === 'consultant') {
        filters.consultancyId = req.user.consultancyId;
      } else if (req.user.role === 'university') {
        filters.universityId = req.user.universityId;
      }

      const stats = await CommissionService.getCommissionStatistics(filters);

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  // Get commissions by consultancy
  static async getCommissionsByConsultancy(req, res, next) {
    try {
      const { consultancyId } = req.params;
      const { status } = req.query;

      const filters = {};
      if (status) filters.status = status;

      const result = await CommissionService.getCommissionsByConsultancy(consultancyId, filters);

      res.status(200).json({
        success: true,
        data: result.transactions,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  // Get commissions by university
  static async getCommissionsByUniversity(req, res, next) {
    try {
      const { universityId } = req.params;
      const { status } = req.query;

      const filters = {};
      if (status) filters.status = status;

      const result = await CommissionService.getCommissionsByUniversity(universityId, filters);

      res.status(200).json({
        success: true,
        data: result.transactions,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CommissionController;
