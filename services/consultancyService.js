const Consultancy = require('../models/Consultancy');
const Student = require('../models/Student');
const CommissionTransaction = require('../models/Commission');
const mongoose = require('mongoose');

class ConsultancyService {
  // Get all consultancies with filters
  async getAllConsultancies(filters = {}) {
    const { page = 1, limit = 10, search, status } = filters;

    const query = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Status filter
    if (status) query.status = status;

    const consultancies = await Consultancy.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Consultancy.countDocuments(query);

    return {
      consultancies,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
      },
    };
  }

  // Get single consultancy by ID
  async getConsultancyById(id) {
    const consultancy = await Consultancy.findById(id);

    if (!consultancy) {
      throw new Error('Consultancy not found');
    }

    return consultancy;
  }

  // Create new consultancy
  async createConsultancy(consultancyData) {
    const consultancy = await Consultancy.create(consultancyData);
    return consultancy;
  }

  // Update consultancy
  async updateConsultancy(id, consultancyData, user) {
    let consultancy = await Consultancy.findById(id);

    if (!consultancy) {
      throw new Error('Consultancy not found');
    }

    // Check ownership
    if (user.role === 'consultant' && consultancy._id.toString() !== user.consultancyId.toString()) {
      throw new Error('Not authorized to update this consultancy');
    }

    consultancy = await Consultancy.findByIdAndUpdate(id, consultancyData, {
      new: true,
      runValidators: true,
    });

    return consultancy;
  }

  // Delete consultancy
  async deleteConsultancy(id) {
    const consultancy = await Consultancy.findById(id);

    if (!consultancy) {
      throw new Error('Consultancy not found');
    }

    await consultancy.deleteOne();
    return true;
  }

  // Get consultancy statistics
  async getConsultancyStats(id) {
    const [studentsCount, pendingCommission, paidCommission] = await Promise.all([
      Student.countDocuments({ consultancyId: id }),
      CommissionTransaction.aggregate([
        { $match: { consultancyId: mongoose.Types.ObjectId(id), status: 'Pending' } },
        { $group: { _id: null, total: { $sum: '$calculatedCommission' } } },
      ]),
      CommissionTransaction.aggregate([
        { $match: { consultancyId: mongoose.Types.ObjectId(id), status: 'Paid' } },
        { $group: { _id: null, total: { $sum: '$calculatedCommission' } } },
      ]),
    ]);

    return {
      studentsCount,
      pendingCommission: pendingCommission[0]?.total || 0,
      paidCommission: paidCommission[0]?.total || 0,
    };
  }
}

module.exports = new ConsultancyService();
