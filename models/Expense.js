const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: [
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
      ],
      required: [true, 'Category is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: 0,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    receiptUrl: {
      type: String,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    verifiedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for searching
expenseSchema.index({ description: 'text', category: 'text' });

module.exports = mongoose.model('Expense', expenseSchema);
