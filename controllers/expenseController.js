const expenseService = require('../services/expenseService');

class ExpenseController {
  // @desc    Get all expenses
  // @route   GET /api/expenses
  // @access  Private (Superadmin)
  async getAllExpenses(req, res, next) {
    try {
      const result = await expenseService.getAllExpenses(req.query);

      res.json({
        success: true,
        data: result.expenses,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get single expense
  // @route   GET /api/expenses/:id
  // @access  Private (Superadmin)
  async getExpenseById(req, res, next) {
    try {
      const expense = await expenseService.getExpenseById(req.params.id);

      res.json({
        success: true,
        data: expense,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Create expense
  // @route   POST /api/expenses
  // @access  Private (Superadmin)
  async createExpense(req, res, next) {
    try {
      const expense = await expenseService.createExpense(req.body);

      res.status(201).json({
        success: true,
        message: 'Expense created successfully',
        data: expense,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Update expense
  // @route   PUT /api/expenses/:id
  // @access  Private (Superadmin)
  async updateExpense(req, res, next) {
    try {
      const expense = await expenseService.updateExpense(req.params.id, req.body, req.user.id);

      res.json({
        success: true,
        message: 'Expense updated successfully',
        data: expense,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Delete expense
  // @route   DELETE /api/expenses/:id
  // @access  Private (Superadmin)
  async deleteExpense(req, res, next) {
    try {
      await expenseService.deleteExpense(req.params.id);

      res.json({
        success: true,
        message: 'Expense deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get expense statistics
  // @route   GET /api/expenses/stats/summary
  // @access  Private (Superadmin)
  async getExpenseStats(req, res, next) {
    try {
      const stats = await expenseService.getExpenseStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ExpenseController();
