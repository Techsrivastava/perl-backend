const Expense = require('../models/Expense');

class ExpenseService {
  // Get all expenses with filters
  async getAllExpenses(filters = {}) {
    const { page = 1, limit = 10, search, category, status, startDate, endDate } = filters;

    const query = {};

    // Search filter
    if (search) {
      query.$or = [
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter
    if (category) query.category = category;

    // Status filter
    if (status) query.status = status;

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(query)
      .populate('verifiedBy', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Expense.countDocuments(query);

    return {
      expenses,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
      },
    };
  }

  // Get single expense by ID
  async getExpenseById(id) {
    const expense = await Expense.findById(id).populate('verifiedBy', 'name email');
    if (!expense) {
      throw new Error('Expense not found');
    }
    return expense;
  }

  // Create new expense
  async createExpense(expenseData) {
    const expense = new Expense(expenseData);
    return await expense.save();
  }

  // Update expense
  async updateExpense(id, updateData, userId) {
    const expense = await Expense.findByIdAndUpdate(
      id,
      {
        ...updateData,
        ...(updateData.status === 'verified' && {
          verifiedBy: userId,
          verifiedAt: new Date(),
        }),
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate('verifiedBy', 'name email');

    if (!expense) {
      throw new Error('Expense not found');
    }

    return expense;
  }

  // Delete expense
  async deleteExpense(id) {
    const expense = await Expense.findByIdAndDelete(id);
    if (!expense) {
      throw new Error('Expense not found');
    }
    return expense;
  }

  // Get expense statistics
  async getExpenseStats() {
    const stats = await Expense.aggregate([
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { totalAmount: -1 },
      },
    ]);

    const totalExpenses = await Expense.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          pending: {
            $sum: {
              $cond: [{ $eq: ['$status', 'pending'] }, '$amount', 0],
            },
          },
          verified: {
            $sum: {
              $cond: [{ $eq: ['$status', 'verified'] }, '$amount', 0],
            },
          },
        },
      },
    ]);

    return {
      byCategory: stats,
      summary: totalExpenses[0] || { total: 0, pending: 0, verified: 0 },
    };
  }
}

module.exports = new ExpenseService();
