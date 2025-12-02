const Payment = require('../models/Payment');
const Admission = require('../models/Admission');

class PaymentService {
  // Get all payments with filters
  async getAllPayments(filters = {}) {
    const { page = 1, limit = 10, search, status, method, admission } = filters;

    const query = {};

    // Search filter
    if (search) {
      query.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { reference: { $regex: search, $options: 'i' } },
      ];
    }

    // Status filter
    if (status) query.status = status;

    // Method filter
    if (method) query.method = method;

    // Admission filter
    if (admission) query.admission = admission;

    const payments = await Payment.find(query)
      .populate('admission', 'studentName course totalFee feeReceived status')
      .populate('approvedBy', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Payment.countDocuments(query);

    return {
      payments,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
      },
    };
  }

  // Get single payment by ID
  async getPaymentById(id) {
    const payment = await Payment.findById(id)
      .populate('admission', 'studentName course totalFee feeReceived status')
      .populate('approvedBy', 'name email');

    if (!payment) {
      throw new Error('Payment not found');
    }
    return payment;
  }

  // Create new payment
  async createPayment(paymentData) {
    // Verify admission exists
    const admission = await Admission.findById(paymentData.admission);
    if (!admission) {
      throw new Error('Admission not found');
    }

    const payment = new Payment({
      ...paymentData,
      studentName: admission.studentName,
    });

    return await payment.save();
  }

  // Update payment
  async updatePayment(id, updateData, userId) {
    const payment = await Payment.findByIdAndUpdate(
      id,
      {
        ...updateData,
        ...(updateData.status === 'completed' && {
          approvedBy: userId,
          approvedAt: new Date(),
        }),
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate('admission', 'studentName course totalFee feeReceived status')
      .populate('approvedBy', 'name email');

    if (!payment) {
      throw new Error('Payment not found');
    }

    return payment;
  }

  // Delete payment
  async deletePayment(id) {
    const payment = await Payment.findByIdAndDelete(id);
    if (!payment) {
      throw new Error('Payment not found');
    }
    return payment;
  }

  // Get payments by admission
  async getPaymentsByAdmission(admissionId) {
    return await Payment.find({ admission: admissionId })
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });
  }
}

module.exports = new PaymentService();
