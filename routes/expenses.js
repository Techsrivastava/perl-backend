const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const expenseController = require('../controllers/expenseController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// @route   GET /api/expenses
// @desc    Get all expenses
// @access  Private (Superadmin)
router.get('/', protect, authorize('superadmin'), expenseController.getAllExpenses);

// @route   GET /api/expenses/:id
// @desc    Get single expense
// @access  Private (Superadmin)
router.get('/:id', protect, authorize('superadmin'), expenseController.getExpenseById);

// @route   POST /api/expenses
// @desc    Create expense
// @access  Private (Superadmin)
router.post(
  '/',
  protect,
  authorize('superadmin'),
  [
    body('category').isIn([
      'Office Rent',
      'Utilities',
      'Marketing',
      'Software',
      'Travel',
      'Training',
      'Legal',
      'Insurance',
      'Equipment',
      'Miscellaneous',
      'Salaries',
      'Commissions'
    ]).withMessage('Invalid category'),
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('description').notEmpty().withMessage('Description is required'),
  ],
  validate,
  expenseController.createExpense
);

// @route   PUT /api/expenses/:id
// @desc    Update expense
// @access  Private (Superadmin)
router.put(
  '/:id',
  protect,
  authorize('superadmin'),
  [
    body('amount').optional().isNumeric().withMessage('Amount must be a number'),
    body('status').optional().isIn(['pending', 'verified', 'rejected']).withMessage('Invalid status'),
  ],
  validate,
  expenseController.updateExpense
);

// @route   DELETE /api/expenses/:id
// @desc    Delete expense
// @access  Private (Superadmin)
router.delete('/:id', protect, authorize('superadmin'), expenseController.deleteExpense);

// @route   GET /api/expenses/stats/summary
// @desc    Get expense statistics
// @access  Private (Superadmin)
router.get('/stats/summary', protect, authorize('superadmin'), expenseController.getExpenseStats);

module.exports = router;
