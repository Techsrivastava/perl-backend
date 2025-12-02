const University = require('../models/University');
const Consultancy = require('../models/Consultancy');
const Agent = require('../models/Agent');
const Course = require('../models/Course');
const Student = require('../models/Student');
const Admission = require('../models/Admission');
const Payment = require('../models/Payment');
const Wallet = require('../models/Wallet');
const Expense = require('../models/Expense');

class DashboardService {
  // Get dashboard statistics
  async getDashboardStats() {
    // Get counts
    const [
      totalUniversities,
      totalConsultancies,
      totalAgents,
      totalStudents,
      totalCourses,
      totalAdmissions,
      pendingAdmissions,
      approvedAdmissions,
      revertedAdmissions,
      totalPayments,
      completedPayments,
    ] = await Promise.all([
      University.countDocuments({ isActive: true }),
      Consultancy.countDocuments({ isActive: true }),
      Agent.countDocuments({ isActive: true }),
      Student.countDocuments(),
      Course.countDocuments(),
      Admission.countDocuments(),
      Admission.countDocuments({ status: 'pending' }),
      Admission.countDocuments({ status: 'approved' }),
      Admission.countDocuments({ status: 'reverted' }),
      Payment.countDocuments(),
      Payment.countDocuments({ status: 'completed' }),
    ]);

    // Calculate financial stats
    const paymentStats = await Payment.aggregate([
      {
        $match: { status: 'completed' },
      },
      {
        $group: {
          _id: null,
          totalCollected: { $sum: '$amount' },
        },
      },
    ]);

    const totalFeesCollected = paymentStats[0]?.totalCollected || 0;

    // Get wallet balances
    const walletStats = await Wallet.aggregate([
      {
        $group: {
          _id: '$ownerType',
          totalBalance: { $sum: '$balance' },
        },
      },
    ]);

    const walletSummary = {
      university_total: walletStats.find(w => w._id === 'university')?.totalBalance || 0,
      consultancy_total: walletStats.find(w => w._id === 'consultancy')?.totalBalance || 0,
      agent_total: walletStats.find(w => w._id === 'agent')?.totalBalance || 0,
      super_admin_total: 0, // This would be calculated separately based on profits
    };

    // Calculate pending payments (fees still owed)
    const admissionStats = await Admission.aggregate([
      {
        $group: {
          _id: null,
          totalFeeAgreed: { $sum: '$totalFee' },
          totalFeeReceived: { $sum: '$feeReceived' },
        },
      },
    ]);

    const totalFeeAgreed = admissionStats[0]?.totalFeeAgreed || 0;
    const totalFeeReceived = admissionStats[0]?.totalFeeReceived || 0;
    const pendingFees = totalFeeAgreed - totalFeeReceived;

    // Calculate expenses for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dailyExpenses = await Expense.aggregate([
      {
        $match: {
          date: { $gte: today, $lt: tomorrow },
          status: 'verified',
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    // Calculate profit distributions (simplified logic)
    const feesPaidToUniversities = totalFeesCollected * 0.7; // 70% to universities
    const agentCommissionsPaid = totalFeesCollected * 0.15; // 15% to agents
    const consultancyProfit = totalFeesCollected * 0.1; // 10% to consultancies
    const systemProfit = totalFeesCollected * 0.05; // 5% system profit

    return {
      total_universities: totalUniversities,
      total_consultancies: totalConsultancies,
      total_agents: totalAgents,
      total_students: totalStudents,
      total_courses: totalCourses,
      total_admissions: totalAdmissions,
      pending_admissions: pendingAdmissions,
      approved_admissions: approvedAdmissions,
      reverted_admissions: revertedAdmissions,
      total_fees_collected: totalFeesCollected,
      fees_paid_to_universities: feesPaidToUniversities,
      agent_commissions_paid: agentCommissionsPaid,
      consultancy_profit: consultancyProfit,
      system_profit: systemProfit,
      wallet_summary: walletSummary,
      pending_fees: {
        pending_university_payments: feesPaidToUniversities - walletSummary.university_total,
        pending_agent_commissions: agentCommissionsPaid - walletSummary.agent_total,
        pending_consultancy_earnings: consultancyProfit - walletSummary.consultancy_total,
      },
      daily_expenses: dailyExpenses[0]?.total || 0,
    };
  }
}

module.exports = new DashboardService();
