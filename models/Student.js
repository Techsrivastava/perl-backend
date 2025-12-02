const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    consultancyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Consultancy',
      required: true,
    },
    universityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Enrolled', 'Completed'],
      default: 'Pending',
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    documents: [{
      name: String,
      url: String,
      uploadedAt: Date,
    }],
    // Additional Info
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },
    address: String,
    city: String,
    state: String,
    pincode: String,
    fatherName: String,
    motherName: String,
    guardianPhone: String,
    // Academic Info
    previousQualification: String,
    previousPercentage: Number,
    previousInstitution: String,
    yearOfPassing: Number,
    // Admission Details
    admissionFeesPaid: {
      type: Boolean,
      default: false,
    },
    admissionDate: Date,
    rollNumber: String,
    studentId: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
studentSchema.index({ email: 1 });
studentSchema.index({ consultancyId: 1 });
studentSchema.index({ courseId: 1 });
studentSchema.index({ universityId: 1 });
studentSchema.index({ name: 'text', email: 'text' });

module.exports = mongoose.model('Student', studentSchema);
