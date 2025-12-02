const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Agent name is required'],
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
    consultancy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Consultancy',
      required: [true, 'Consultancy is required'],
    },
    commissionRate: {
      type: Number,
      required: [true, 'Commission rate is required'],
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    walletBalance: {
      type: Number,
      default: 0,
    },
    totalCommissionEarned: {
      type: Number,
      default: 0,
    },
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
agentSchema.index({ name: 'text', email: 'text' });

module.exports = mongoose.model('Agent', agentSchema);
