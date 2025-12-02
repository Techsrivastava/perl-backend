const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    admission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admission',
      required: [true, 'Admission is required'],
    },
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: 0,
    },
    method: {
      type: String,
      enum: ['UPI', 'Bank Transfer', 'Cheque', 'NEFT', 'Cash'],
      required: [true, 'Payment method is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    reference: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    proofDocument: {
      type: String, // URL to uploaded proof
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for searching
paymentSchema.index({ studentName: 'text', reference: 'text' });

module.exports = mongoose.model('Payment', paymentSchema);
