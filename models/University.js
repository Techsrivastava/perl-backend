const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'University name is required'],
      trim: true,
    },
    abbreviation: {
      type: String,
      required: [true, 'Abbreviation is required'],
      trim: true,
      uppercase: true,
    },
    establishedYear: {
      type: Number,
      required: [true, 'Established year is required'],
    },
    type: {
      type: String,
      enum: ['Government', 'Private', 'Deemed', 'Autonomous'],
      required: true,
    },
    facilities: [{
      type: String,
    }],
    documents: [{
      type: String,
    }],
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    contactEmail: {
      type: String,
      required: [true, 'Contact email is required'],
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    contactPhone: {
      type: String,
      required: [true, 'Contact phone is required'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    // Bank Details
    bankName: String,
    accountNumber: String,
    ifscCode: String,
    branch: String,
    // Status
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
universitySchema.index({ name: 'text', abbreviation: 'text' });

module.exports = mongoose.model('University', universitySchema);
