const mongoose = require('mongoose');

const walletTransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  reference: {
    type: String,
  },
  notes: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const walletSchema = new mongoose.Schema(
  {
    ownerType: {
      type: String,
      enum: ['university', 'consultancy', 'agent'],
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'ownerType',
    },
    balance: {
      type: Number,
      default: 0,
    },
    transactions: [walletTransactionSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for unique wallet per owner
walletSchema.index({ ownerType: 1, owner: 1 }, { unique: true });

module.exports = mongoose.model('Wallet', walletSchema);
