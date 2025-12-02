const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const paymentController = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// @route   GET /api/payments
// @desc    Get all payments
// @access  Private (Superadmin)
router.get('/', protect, authorize('superadmin'), paymentController.getAllPayments);

// @route   GET /api/payments/:id
// @desc    Get single payment
// @access  Private (Superadmin)
router.get('/:id', protect, authorize('superadmin'), paymentController.getPaymentById);

// @route   POST /api/payments
// @desc    Create payment
// @access  Private (Superadmin, Agent)
router.post(
  '/',
  protect,
  authorize('superadmin', 'agent'),
  [
    body('admission').isMongoId().withMessage('Valid admission ID is required'),
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('method').isIn(['UPI', 'Bank Transfer', 'Cheque', 'NEFT', 'Cash']).withMessage('Invalid payment method'),
  ],
  validate,
  paymentController.createPayment
);

// @route   PUT /api/payments/:id
// @desc    Update payment
// @access  Private (Superadmin)
router.put(
  '/:id',
  protect,
  authorize('superadmin'),
  [
    body('amount').optional().isNumeric().withMessage('Amount must be a number'),
    body('status').optional().isIn(['pending', 'completed', 'failed']).withMessage('Invalid status'),
  ],
  validate,
  paymentController.updatePayment
);

// @route   DELETE /api/payments/:id
// @desc    Delete payment
// @access  Private (Superadmin)
router.delete('/:id', protect, authorize('superadmin'), paymentController.deletePayment);

// @route   GET /api/payments/admission/:admissionId
// @desc    Get payments by admission
// @access  Private (Superadmin)
router.get('/admission/:admissionId', protect, authorize('superadmin'), paymentController.getPaymentsByAdmission);

module.exports = router;
