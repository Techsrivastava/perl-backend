const paymentService = require('../services/paymentService');

class PaymentController {
  // @desc    Get all payments
  // @route   GET /api/payments
  // @access  Private (Superadmin)
  async getAllPayments(req, res, next) {
    try {
      const result = await paymentService.getAllPayments(req.query);

      res.json({
        success: true,
        data: result.payments,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get single payment
  // @route   GET /api/payments/:id
  // @access  Private (Superadmin)
  async getPaymentById(req, res, next) {
    try {
      const payment = await paymentService.getPaymentById(req.params.id);

      res.json({
        success: true,
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Create payment
  // @route   POST /api/payments
  // @access  Private (Superadmin, Agent)
  async createPayment(req, res, next) {
    try {
      const payment = await paymentService.createPayment(req.body);

      res.status(201).json({
        success: true,
        message: 'Payment created successfully',
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Update payment
  // @route   PUT /api/payments/:id
  // @access  Private (Superadmin)
  async updatePayment(req, res, next) {
    try {
      const payment = await paymentService.updatePayment(req.params.id, req.body, req.user.id);

      res.json({
        success: true,
        message: 'Payment updated successfully',
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Delete payment
  // @route   DELETE /api/payments/:id
  // @access  Private (Superadmin)
  async deletePayment(req, res, next) {
    try {
      await paymentService.deletePayment(req.params.id);

      res.json({
        success: true,
        message: 'Payment deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get payments by admission
  // @route   GET /api/payments/admission/:admissionId
  // @access  Private (Superadmin)
  async getPaymentsByAdmission(req, res, next) {
    try {
      const payments = await paymentService.getPaymentsByAdmission(req.params.admissionId);

      res.json({
        success: true,
        data: payments,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PaymentController();
