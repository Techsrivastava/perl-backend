const CommissionTransaction = require('../models/Commission');
const Consultancy = require('../models/Consultancy');
const Student = require('../models/Student');
const Course = require('../models/Course');
const University = require('../models/University');
const AgentService = require('./agentService');

class CommissionService {
  // Calculate commission based on course fees and commission type
  static calculateCommission(courseFees, commissionType, commissionValue) {
    switch (commissionType) {
      case 'percentage':
        return (courseFees * commissionValue) / 100;
      case 'flat':
        return commissionValue;
      case 'oneTime':
        return commissionValue;
      default:
        return 0;
    }
  }

  // Create commission transaction
  static async createCommissionTransaction(data) {
    try {
      const {
        consultancyId,
        studentId,
        courseId,
        universityId,
        commissionType,
        commissionValue,
        courseFees,
        status = 'Pending',
        remarks
      } = data;

      // Calculate commission amount
      const calculatedCommission = this.calculateCommission(courseFees, commissionType, commissionValue);

      // Get denormalized data for quick access
      const student = await Student.findById(studentId).select('name');
      const course = await Course.findById(courseId).select('name');
      const consultancy = await Consultancy.findById(consultancyId).select('name');

      const commissionTransaction = new CommissionTransaction({
        consultancyId,
        studentId,
        courseId,
        universityId,
        commissionType,
        commissionValue,
        courseFees,
        calculatedCommission,
        status,
        remarks,
        studentName: student?.name,
        courseName: course?.name,
        consultancyName: consultancy?.name
      });

      await commissionTransaction.save();

      // Update agent's total commission earned if status is Paid
      if (status === 'Paid') {
        await this.updateAgentCommission(consultancyId, calculatedCommission);
      }

      return commissionTransaction;
    } catch (error) {
      throw new Error(`Failed to create commission transaction: ${error.message}`);
    }
  }

  // Update agent commission when payment is made
  static async updateAgentCommission(consultancyId, commissionAmount) {
    try {
      const agentService = new AgentService();
      const result = await agentService.distributeCommissionToAgents(consultancyId, commissionAmount);

      if (result) {
        console.log(`Commission distributed:`, result);
      }

      return result;
    } catch (error) {
      console.error('Error updating agent commission:', error);
      throw new Error(`Failed to update agent commission: ${error.message}`);
    }
  }

  // Get all commission transactions with filters
  static async getCommissionTransactions(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const query = { ...filters };

      const transactions = await CommissionTransaction.find(query)
        .populate('consultancyId', 'name email')
        .populate('studentId', 'name email')
        .populate('courseId', 'name code')
        .populate('universityId', 'name abbreviation')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

      const count = await CommissionTransaction.countDocuments(query);

      return {
        transactions,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit),
        }
      };
    } catch (error) {
      throw new Error(`Failed to get commission transactions: ${error.message}`);
    }
  }

  // Get commission transaction by ID
  static async getCommissionTransactionById(id) {
    try {
      const transaction = await CommissionTransaction.findById(id)
        .populate('consultancyId', 'name email')
        .populate('studentId', 'name email phone')
        .populate('courseId', 'name code fees')
        .populate('universityId', 'name abbreviation');

      if (!transaction) {
        throw new Error('Commission transaction not found');
      }

      return transaction;
    } catch (error) {
      throw new Error(`Failed to get commission transaction: ${error.message}`);
    }
  }

  // Update commission transaction status
  static async updateCommissionStatus(id, status, paymentData = {}) {
    try {
      const updateData = { status };

      if (status === 'Paid' && paymentData.paymentDate) {
        updateData.paymentDate = paymentData.paymentDate;
        updateData.paymentReference = paymentData.paymentReference;
      }

      const transaction = await CommissionTransaction.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      ).populate('consultancyId', 'name');

      if (!transaction) {
        throw new Error('Commission transaction not found');
      }

      // Update agent commission if status changed to Paid
      if (status === 'Paid' && transaction.status !== 'Paid') {
        await this.updateAgentCommission(transaction.consultancyId._id, transaction.calculatedCommission);
      }

      return transaction;
    } catch (error) {
      throw new Error(`Failed to update commission status: ${error.message}`);
    }
  }

  // Get commission statistics
  static async getCommissionStatistics(filters = {}) {
    try {
      const query = { ...filters };

      const stats = await CommissionTransaction.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            totalCommissions: { $sum: '$calculatedCommission' },
            pendingCommissions: {
              $sum: {
                $cond: [{ $eq: ['$status', 'Pending'] }, '$calculatedCommission', 0]
              }
            },
            paidCommissions: {
              $sum: {
                $cond: [{ $eq: ['$status', 'Paid'] }, '$calculatedCommission', 0]
              }
            },
            totalTransactions: { $sum: 1 },
            pendingTransactions: {
              $sum: {
                $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0]
              }
            },
            paidTransactions: {
              $sum: {
                $cond: [{ $eq: ['$status', 'Paid'] }, 1, 0]
              }
            }
          }
        }
      ]);

      return stats[0] || {
        totalCommissions: 0,
        pendingCommissions: 0,
        paidCommissions: 0,
        totalTransactions: 0,
        pendingTransactions: 0,
        paidTransactions: 0
      };
    } catch (error) {
      throw new Error(`Failed to get commission statistics: ${error.message}`);
    }
  }

  // Get commissions by consultancy
  static async getCommissionsByConsultancy(consultancyId, filters = {}) {
    try {
      const query = { consultancyId, ...filters };

      return await this.getCommissionTransactions(query);
    } catch (error) {
      throw new Error(`Failed to get commissions by consultancy: ${error.message}`);
    }
  }

  // Get commissions by university
  static async getCommissionsByUniversity(universityId, filters = {}) {
    try {
      const query = { universityId, ...filters };

      return await this.getCommissionTransactions(query);
    } catch (error) {
      throw new Error(`Failed to get commissions by university: ${error.message}`);
    }
  }

  // Delete commission transaction
  static async deleteCommissionTransaction(id) {
    try {
      const transaction = await CommissionTransaction.findByIdAndDelete(id);

      if (!transaction) {
        throw new Error('Commission transaction not found');
      }

      return transaction;
    } catch (error) {
      throw new Error(`Failed to delete commission transaction: ${error.message}`);
    }
  }
}

module.exports = CommissionService;
