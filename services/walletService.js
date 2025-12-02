const Wallet = require('../models/Wallet');

class WalletService {
  // Get wallet by owner
  async getWalletByOwner(ownerType, ownerId) {
    let wallet = await Wallet.findOne({ ownerType, owner: ownerId });

    if (!wallet) {
      // Create wallet if it doesn't exist
      wallet = new Wallet({
        ownerType,
        owner: ownerId,
        balance: 0,
        transactions: [],
      });
      await wallet.save();
    }

    return wallet;
  }

  // Get all wallets with filters
  async getAllWallets(filters = {}) {
    const { page = 1, limit = 10, ownerType, owner } = filters;

    const query = {};

    if (ownerType) query.ownerType = ownerType;
    if (owner) query.owner = owner;

    const wallets = await Wallet.find(query)
      .populate(ownerType === 'university' ? 'owner' :
               ownerType === 'consultancy' ? 'owner' :
               'owner', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Wallet.countDocuments(query);

    return {
      wallets,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
      },
    };
  }

  // Adjust wallet balance
  async adjustWallet(ownerType, ownerId, adjustmentData, userId) {
    const { type, amount, reason, reference, notes } = adjustmentData;

    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    let wallet = await this.getWalletByOwner(ownerType, ownerId);

    // Calculate new balance
    const adjustmentAmount = type === 'credit' ? amount : -amount;
    const newBalance = wallet.balance + adjustmentAmount;

    if (newBalance < 0) {
      throw new Error('Insufficient wallet balance');
    }

    // Add transaction
    wallet.transactions.push({
      type,
      amount,
      reason,
      reference,
      notes,
      date: new Date(),
    });

    wallet.balance = newBalance;
    await wallet.save();

    return wallet;
  }

  // Get wallet balance
  async getWalletBalance(ownerType, ownerId) {
    const wallet = await this.getWalletByOwner(ownerType, ownerId);
    return wallet.balance;
  }

  // Get wallet transactions
  async getWalletTransactions(ownerType, ownerId, filters = {}) {
    const { page = 1, limit = 10 } = filters;

    const wallet = await Wallet.findOne({ ownerType, owner: ownerId });

    if (!wallet) {
      return { transactions: [], pagination: { total: 0, page: 1, pages: 0 } };
    }

    const transactions = wallet.transactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice((page - 1) * limit, page * limit);

    return {
      transactions,
      pagination: {
        total: wallet.transactions.length,
        page: parseInt(page),
        pages: Math.ceil(wallet.transactions.length / limit),
      },
    };
  }

  // Transfer between wallets
  async transferFunds(fromType, fromId, toType, toId, amount, reason, notes) {
    if (amount <= 0) {
      throw new Error('Transfer amount must be positive');
    }

    const fromWallet = await this.getWalletByOwner(fromType, fromId);
    const toWallet = await this.getWalletByOwner(toType, toId);

    if (fromWallet.balance < amount) {
      throw new Error('Insufficient balance for transfer');
    }

    // Debit from sender
    fromWallet.balance -= amount;
    fromWallet.transactions.push({
      type: 'debit',
      amount,
      reason: `Transfer to ${toType}: ${reason}`,
      notes,
      date: new Date(),
    });

    // Credit to receiver
    toWallet.balance += amount;
    toWallet.transactions.push({
      type: 'credit',
      amount,
      reason: `Transfer from ${fromType}: ${reason}`,
      notes,
      date: new Date(),
    });

    await Promise.all([fromWallet.save(), toWallet.save()]);

    return { fromWallet, toWallet };
  }
}

module.exports = new WalletService();
