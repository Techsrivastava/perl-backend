const mongoose = require('mongoose');

const commissionTransactionSchema = new mongoose.Schema(
  {
    consultancyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Consultancy',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    universityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: true,
    },
    commissionType: {
      type: String,
      enum: ['percentage', 'flat', 'oneTime'],
      required: true,
    },
    commissionValue: {
      type: Number,
      required: true,
      min: 0,
    },
    courseFees: {
      type: Number,
      required: true,
      min: 0,
    },
    calculatedCommission: {
      type: Number,
      required: true,
      min: 0,
    },
    transactionDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Paid', 'Rejected'],
      default: 'Pending',
    },
    paymentDate: Date,
    paymentReference: String,
    remarks: String,
    // Denormalized fields for quick access
    studentName: String,
    courseName: String,
    consultancyName: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
commissionTransactionSchema.index({ consultancyId: 1 });
commissionTransactionSchema.index({ studentId: 1 });
commissionTransactionSchema.index({ universityId: 1 });
commissionTransactionSchema.index({ status: 1 });

module.exports = mongoose.model('CommissionTransaction', commissionTransactionSchema);
