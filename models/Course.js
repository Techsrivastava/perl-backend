const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    universityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true,
    },
    abbreviation: {
      type: String,
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Course code is required'],
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    department: String,
    degreeType: {
      type: String,
      enum: ['UG', 'PG', 'Diploma', 'Certificate', 'PhD'],
    },
    duration: String,
    modeOfStudy: {
      type: String,
      enum: ['Regular', 'Distance', 'Online', 'Part-time'],
      default: 'Regular',
    },
    level: String,
    fees: {
      type: Number,
      min: 0,
    },
    totalSeats: {
      type: Number,
      min: 0,
    },
    availableSeats: {
      type: Number,
      min: 0,
    },
    description: String,
    eligibility: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
    scholarshipAvailable: {
      type: Boolean,
      default: false,
    },
    placementSupport: {
      type: Boolean,
      default: false,
    },
    // Indian Education System Specific
    specialization: String,
    accreditation: String,
    approvedBy: String,
    semesterCount: Number,
    mediumOfInstruction: String,
    entranceExam: String,
    cutoffPercentage: Number,
    careerOptions: [String],
    affiliatedUniversity: String,
    internshipIncluded: Boolean,
    industryTieups: Boolean,
    labFacilities: String,
    researchOpportunities: String,
    recognizedBy: String,
    universityType: String,
    courseType: String,
    yearOfEstablishment: Number,
    state: String,
    city: String,
    averagePackage: Number,
    highestPackage: Number,
    placementPercentage: Number,
    topRecruiters: [String],
    hostelFacility: String,
    hostelFees: Number,
    transportFacility: String,
    libraryFacility: String,
    sportsFacilities: String,
    medicalFacilities: String,
    extracurricularActivities: [String],
    nbaAccreditationValidity: String,
    naacGrade: String,
    nirfRanking: Number,
    autonomousStatus: String,
    courseHighlights: [String],
    admissionProcess: String,
    documentsRequired: [String],
    reservationPolicy: String,
    feeStructure: String,
    scholarships: [String],
    loanFacility: String,
    alumniNetwork: String,
    facultyCount: Number,
    facultyQualification: String,
    studentFacultyRatio: Number,
    infrastructureRating: String,
    collaborations: [String],
    exchangePrograms: String,
    industryVisits: Boolean,
    guestLectures: Boolean,
    workshops: Boolean,
    seminars: Boolean,
    projectWork: String,
    examPattern: String,
    gradingSystem: String,
    attendanceRequirement: String,
    courseOutcomes: [String],
    jobProspects: String,
    higherStudyOptions: String,
    certifications: [String],
  },
  {
    timestamps: true,
  }
);

// Index for searching
courseSchema.index({ name: 'text', code: 'text', department: 'text' });
courseSchema.index({ universityId: 1 });

module.exports = mongoose.model('Course', courseSchema);
