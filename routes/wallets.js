const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const walletController = require('../controllers/walletController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// @route   GET /api/wallets
// @desc    Get all wallets
// @access  Private (Superadmin)
router.get('/', protect, authorize('superadmin'), walletController.getAllWallets);

// @route   GET /api/wallets/:ownerType/:ownerId
// @desc    Get wallet by owner
// @access  Private (Superadmin, Owner)
router.get('/:ownerType/:ownerId', protect, authorize('superadmin'), walletController.getWalletByOwner);

// @route   GET /api/wallets/:ownerType/:ownerId/balance
// @desc    Get wallet balance
// @access  Private (Superadmin, Owner)
router.get('/:ownerType/:ownerId/balance', protect, authorize('superadmin'), walletController.getWalletBalance);

// @route   POST /api/wallets/:ownerType/:ownerId/adjust
// @desc    Adjust wallet balance
// @access  Private (Superadmin)
router.post(
  '/:ownerType/:ownerId/adjust',
  protect,
  authorize('superadmin'),
  [
    body('type').isIn(['credit', 'debit']).withMessage('Type must be credit or debit'),
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('reason').notEmpty().withMessage('Reason is required'),
  ],
  validate,
  walletController.adjustWallet
);

// @route   GET /api/wallets/:ownerType/:ownerId/transactions
// @desc    Get wallet transactions
// @access  Private (Superadmin, Owner)
router.get('/:ownerType/:ownerId/transactions', protect, authorize('superadmin'), walletController.getWalletTransactions);

// @route   POST /api/wallets/transfer
// @desc    Transfer funds between wallets
// @access  Private (Superadmin)
router.post(
  '/transfer',
  protect,
  authorize('superadmin'),
  [
    body('fromType').isIn(['university', 'consultancy', 'agent']).withMessage('Invalid from type'),
    body('fromId').isMongoId().withMessage('Invalid from ID'),
    body('toType').isIn(['university', 'consultancy', 'agent']).withMessage('Invalid to type'),
    body('toId').isMongoId().withMessage('Invalid to ID'),
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('reason').notEmpty().withMessage('Reason is required'),
  ],
  validate,
  walletController.transferFunds
);

module.exports = router;
