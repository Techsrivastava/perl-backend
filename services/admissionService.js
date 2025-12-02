const Admission = require('../models/Admission');
const Student = require('../models/Student');
const Course = require('../models/Course');
const University = require('../models/University');
const Consultancy = require('../models/Consultancy');
const CommissionService = require('./commissionService');

class AdmissionService {
  // Get all admissions with filters and pagination
  static async getAdmissions(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const query = { ...filters };

      const admissions = await Admission.find(query)
        .populate('studentId', 'name email phone')
        .populate('courseId', 'name code fees')
        .populate('universityId', 'name abbreviation')
        .populate('consultancyId', 'name email')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

      const count = await Admission.countDocuments(query);

      return {
        admissions,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit),
        }
      };
    } catch (error) {
      throw new Error(`Failed to get admissions: ${error.message}`);
    }
  }

  // Get admission by ID
  static async getAdmissionById(id) {
    try {
      const admission = await Admission.findById(id)
        .populate('studentId', 'name email phone')
        .populate('courseId', 'name code fees')
        .populate('universityId', 'name abbreviation')
        .populate('consultancyId', 'name email');

      if (!admission) {
        throw new Error('Admission not found');
      }

      return admission;
    } catch (error) {
      throw new Error(`Failed to get admission: ${error.message}`);
    }
  }

  // Create new admission
  static async createAdmission(data) {
    try {
      const {
        studentId,
        courseId,
        universityId,
        consultancyId,
        admissionDate,
        status = 'pending',
        applicationFee,
        tuitionFee,
        remarks
      } = data;

      // Validate that all referenced entities exist
      const [student, course, university, consultancy] = await Promise.all([
        Student.findById(studentId),
        Course.findById(courseId),
        University.findById(universityId),
        Consultancy.findById(consultancyId)
      ]);

      if (!student) throw new Error('Student not found');
      if (!course) throw new Error('Course not found');
      if (!university) throw new Error('University not found');
      if (!consultancy) throw new Error('Consultancy not found');

      // Check if student is already admitted to this course at this university
      const existingAdmission = await Admission.findOne({
        studentId,
        courseId,
        universityId,
        status: { $in: ['approved', 'enrolled'] }
      });

      if (existingAdmission) {
        throw new Error('Student is already admitted to this course at this university');
      }

      const admission = new Admission({
        studentId,
        courseId,
        universityId,
        consultancyId,
        admissionDate: admissionDate || new Date(),
        status,
        applicationFee,
        tuitionFee,
        remarks
      });

      await admission.save();

      // If admission is approved, create commission transaction
      if (status === 'approved' || status === 'enrolled') {
        await this.createCommissionForAdmission(admission);
      }

      return await this.getAdmissionById(admission._id);
    } catch (error) {
      throw new Error(`Failed to create admission: ${error.message}`);
    }
  }

  // Create commission transaction when admission is approved
  static async createCommissionForAdmission(admission) {
    try {
      const course = await Course.findById(admission.courseId);
      const consultancy = await Consultancy.findById(admission.consultancyId);

      if (!course || !consultancy) return;

      // Get commission details from consultancy or use default
      const commissionType = consultancy.commissionType || 'percentage';
      const commissionValue = consultancy.commissionRate || 10; // Default 10%

      const courseFees = admission.tuitionFee || course.fees || 0;

      await CommissionService.createCommissionTransaction({
        consultancyId: admission.consultancyId,
        studentId: admission.studentId,
        courseId: admission.courseId,
        universityId: admission.universityId,
        commissionType,
        commissionValue,
        courseFees,
        status: 'Pending'
      });
    } catch (error) {
      console.error('Error creating commission for admission:', error);
    }
  }

  // Update admission
  static async updateAdmission(id, data) {
    try {
      const admission = await Admission.findById(id);
      if (!admission) {
        throw new Error('Admission not found');
      }

      const allowedFields = [
        'admissionDate', 'status', 'applicationFee', 'tuitionFee',
        'enrollmentDate', 'completionDate', 'remarks'
      ];

      allowedFields.forEach(field => {
        if (data[field] !== undefined) {
          admission[field] = data[field];
        }
      });

      // If status changed to approved/enrolled, create commission
      if ((data.status === 'approved' || data.status === 'enrolled') &&
          !['approved', 'enrolled'].includes(admission.status)) {
        await this.createCommissionForAdmission(admission);
      }

      await admission.save();

      return await this.getAdmissionById(id);
    } catch (error) {
      throw new Error(`Failed to update admission: ${error.message}`);
    }
  }

  // Delete admission
  static async deleteAdmission(id) {
    try {
      const admission = await Admission.findByIdAndDelete(id);

      if (!admission) {
        throw new Error('Admission not found');
      }

      return admission;
    } catch (error) {
      throw new Error(`Failed to delete admission: ${error.message}`);
    }
  }

  // Get admissions by student
  static async getAdmissionsByStudent(studentId, filters = {}) {
    try {
      const query = { studentId, ...filters };

      const result = await this.getAdmissions(query);
      return result;
    } catch (error) {
      throw new Error(`Failed to get admissions by student: ${error.message}`);
    }
  }

  // Get admissions by university
  static async getAdmissionsByUniversity(universityId, filters = {}) {
    try {
      const query = { universityId, ...filters };

      const result = await this.getAdmissions(query);
      return result;
    } catch (error) {
      throw new Error(`Failed to get admissions by university: ${error.message}`);
    }
  }

  // Get admissions by consultancy
  static async getAdmissionsByConsultancy(consultancyId, filters = {}) {
    try {
      const query = { consultancyId, ...filters };

      const result = await this.getAdmissions(query);
      return result;
    } catch (error) {
      throw new Error(`Failed to get admissions by consultancy: ${error.message}`);
    }
  }

  // Get admission statistics
  static async getAdmissionStatistics(filters = {}) {
    try {
      const query = { ...filters };

      const stats = await Admission.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            totalAdmissions: { $sum: 1 },
            pendingAdmissions: {
              $sum: {
                $cond: [{ $eq: ['$status', 'pending'] }, 1, 0]
              }
            },
            approvedAdmissions: {
              $sum: {
                $cond: [{ $eq: ['$status', 'approved'] }, 1, 0]
              }
            },
            enrolledAdmissions: {
              $sum: {
                $cond: [{ $eq: ['$status', 'enrolled'] }, 1, 0]
              }
            },
            rejectedAdmissions: {
              $sum: {
                $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0]
              }
            },
            totalApplicationFees: { $sum: { $ifNull: ['$applicationFee', 0] } },
            totalTuitionFees: { $sum: { $ifNull: ['$tuitionFee', 0] } }
          }
        }
      ]);

      return stats[0] || {
        totalAdmissions: 0,
        pendingAdmissions: 0,
        approvedAdmissions: 0,
        enrolledAdmissions: 0,
        rejectedAdmissions: 0,
        totalApplicationFees: 0,
        totalTuitionFees: 0
      };
    } catch (error) {
      throw new Error(`Failed to get admission statistics: ${error.message}`);
    }
  }
}

module.exports = AdmissionService;
