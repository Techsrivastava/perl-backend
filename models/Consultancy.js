const mongoose = require('mongoose');

const consultancySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Consultancy name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    commissionType: {
      type: String,
      enum: ['percentage', 'flat', 'oneTime'],
      required: true,
      default: 'percentage',
    },
    commissionValue: {
      type: Number,
      required: [true, 'Commission value is required'],
      min: 0,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Suspended'],
      default: 'Active',
    },
    studentsCount: {
      type: Number,
      default: 0,
    },
    totalCommission: {
      type: Number,
      default: 0,
    },
    // Additional Fields
    address: String,
    city: String,
    state: String,
    pincode: String,
    // Documents
    documents: [{
      name: String,
      url: String,
      uploadedAt: Date,
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for searching
consultancySchema.index({ name: 'text', email: 'text' });

module.exports = mongoose.model('Consultancy', consultancySchema);
