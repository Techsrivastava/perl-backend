const walletService = require('../services/walletService');

class WalletController {
  // @desc    Get all wallets
  // @route   GET /api/wallets
  // @access  Private (Superadmin)
  async getAllWallets(req, res, next) {
    try {
      const result = await walletService.getAllWallets(req.query);

      res.json({
        success: true,
        data: result.wallets,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get wallet by owner
  // @route   GET /api/wallets/:ownerType/:ownerId
  // @access  Private (Superadmin, Owner)
  async getWalletByOwner(req, res, next) {
    try {
      const { ownerType, ownerId } = req.params;
      const wallet = await walletService.getWalletByOwner(ownerType, ownerId);

      res.json({
        success: true,
        data: wallet,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get wallet balance
  // @route   GET /api/wallets/:ownerType/:ownerId/balance
  // @access  Private (Superadmin, Owner)
  async getWalletBalance(req, res, next) {
    try {
      const { ownerType, ownerId } = req.params;
      const balance = await walletService.getWalletBalance(ownerType, ownerId);

      res.json({
        success: true,
        data: { balance },
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Adjust wallet balance
  // @route   POST /api/wallets/:ownerType/:ownerId/adjust
  // @access  Private (Superadmin)
  async adjustWallet(req, res, next) {
    try {
      const { ownerType, ownerId } = req.params;
      const wallet = await walletService.adjustWallet(ownerType, ownerId, req.body, req.user.id);

      res.json({
        success: true,
        message: 'Wallet adjusted successfully',
        data: wallet,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get wallet transactions
  // @route   GET /api/wallets/:ownerType/:ownerId/transactions
  // @access  Private (Superadmin, Owner)
  async getWalletTransactions(req, res, next) {
    try {
      const { ownerType, ownerId } = req.params;
      const result = await walletService.getWalletTransactions(ownerType, ownerId, req.query);

      res.json({
        success: true,
        data: result.transactions,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Transfer funds between wallets
  // @route   POST /api/wallets/transfer
  // @access  Private (Superadmin)
  async transferFunds(req, res, next) {
    try {
      const { fromType, fromId, toType, toId, amount, reason, notes } = req.body;

      const result = await walletService.transferFunds(fromType, fromId, toType, toId, amount, reason, notes);

      res.json({
        success: true,
        message: 'Funds transferred successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WalletController();
