const mongoose = require('mongoose');

const streamSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Stream name is required'],
      trim: true,
    },
    description: String,
    fees: {
      type: Number,
      min: 0,
    },
    duration: String,
    eligibility: [String],
    totalSeats: {
      type: Number,
      min: 0,
    },
    availableSeats: {
      type: Number,
      min: 0,
    },
    specialization: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index
streamSchema.index({ courseId: 1 });
streamSchema.index({ name: 'text' });

module.exports = mongoose.model('Stream', streamSchema);
