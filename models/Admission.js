const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema(
  {
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
    consultancyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Consultancy',
      required: true,
    },
    applicationNumber: {
      type: String,
      unique: true,
      required: true,
    },
    status: {
      type: String,
      enum: ['Applied', 'Under Review', 'Shortlisted', 'Accepted', 'Rejected', 'Waitlisted'],
      default: 'Applied',
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    reviewDate: Date,
    decisionDate: Date,
    enrollmentDate: Date,
    // Fees Details
    totalFees: Number,
    feesPaid: {
      type: Number,
      default: 0,
    },
    feesBalance: Number,
    // Documents Status
    documentsVerified: {
      type: Boolean,
      default: false,
    },
    documentsRemark: String,
    // Interview/Test
    interviewScheduled: Boolean,
    interviewDate: Date,
    interviewStatus: String,
    testScore: Number,
    // Additional
    remarks: String,
    assignedCounsellor: String,
  },
  {
    timestamps: true,
  }
);

// Auto-generate application number
admissionSchema.pre('save', async function (next) {
  if (!this.applicationNumber) {
    const count = await this.constructor.countDocuments();
    this.applicationNumber = `ADM${Date.now()}${count + 1}`;
  }
  next();
});

// Indexes
admissionSchema.index({ studentId: 1 });
admissionSchema.index({ courseId: 1 });
admissionSchema.index({ universityId: 1 });
admissionSchema.index({ consultancyId: 1 });
admissionSchema.index({ status: 1 });

module.exports = mongoose.model('Admission', admissionSchema);
