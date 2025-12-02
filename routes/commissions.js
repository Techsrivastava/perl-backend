const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const CommissionController = require('../controllers/commissionController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// @route   GET /api/commissions
// @desc    Get all commission transactions
// @access  Private
router.get('/', protect, CommissionController.getCommissionTransactions);

// @route   GET /api/commissions/:id
// @desc    Get single commission transaction
// @access  Private
router.get('/:id', protect, CommissionController.getCommissionTransaction);

// @route   POST /api/commissions
// @desc    Create commission transaction
// @access  Private (University, Superadmin)
router.post('/',
  protect,
  authorize('university', 'superadmin'),
  [
    body('consultancyId').isMongoId().withMessage('Valid consultancy ID is required'),
    body('studentId').isMongoId().withMessage('Valid student ID is required'),
    body('courseId').isMongoId().withMessage('Valid course ID is required'),
    body('universityId').isMongoId().withMessage('Valid university ID is required'),
    body('commissionType').isIn(['percentage', 'flat', 'oneTime']).withMessage('Valid commission type required'),
    body('commissionValue').isNumeric().withMessage('Commission value must be numeric'),
    body('courseFees').isNumeric().withMessage('Course fees must be numeric')
  ],
  validate,
  CommissionController.createCommissionTransaction
);

// @route   PUT /api/commissions/:id
// @desc    Update commission transaction
// @access  Private (University, Superadmin)
router.put('/:id',
  protect,
  authorize('university', 'superadmin'),
  CommissionController.updateCommissionTransaction
);

// @route   PUT /api/commissions/:id/status
// @desc    Update commission status
// @access  Private (Superadmin)
router.put('/:id/status',
  protect,
  authorize('superadmin'),
  [
    body('status').isIn(['Pending', 'Approved', 'Paid', 'Rejected']).withMessage('Valid status required')
  ],
  validate,
  CommissionController.updateCommissionStatus
);

// @route   DELETE /api/commissions/:id
// @desc    Delete commission transaction
// @access  Private (Superadmin)
router.delete('/:id',
  protect,
  authorize('superadmin'),
  CommissionController.deleteCommissionTransaction
);

// @route   GET /api/commissions/statistics
// @desc    Get commission statistics
// @access  Private
router.get('/statistics',
  protect,
  CommissionController.getCommissionStatistics
);

// @route   GET /api/commissions/consultancy/:consultancyId
// @desc    Get commissions by consultancy
// @access  Private
router.get('/consultancy/:consultancyId',
  protect,
  CommissionController.getCommissionsByConsultancy
);

// @route   GET /api/commissions/university/:universityId
// @desc    Get commissions by university
// @access  Private
router.get('/university/:universityId',
  protect,
  CommissionController.getCommissionsByUniversity
);

module.exports = router;
