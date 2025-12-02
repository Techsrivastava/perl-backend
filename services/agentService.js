const Agent = require('../models/Agent');
const Consultancy = require('../models/Consultancy');

class AgentService {
  // Get all agents with filters
  async getAllAgents(filters = {}) {
    const { page = 1, limit = 10, search, consultancy, status, isActive } = filters;

    const query = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Consultancy filter
    if (consultancy) query.consultancy = consultancy;

    // Status filter
    if (status) query.status = status;

    // Active filter
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const agents = await Agent.find(query)
      .populate('consultancy', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Agent.countDocuments(query);

    return {
      agents,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
      },
    };
  }

  // Get single agent by ID
  async getAgentById(id) {
    const agent = await Agent.findById(id).populate('consultancy', 'name email');
    if (!agent) {
      throw new Error('Agent not found');
    }
    return agent;
  }

  // Create new agent
  async createAgent(agentData) {
    // Verify consultancy exists
    const consultancy = await Consultancy.findById(agentData.consultancy);
    if (!consultancy) {
      throw new Error('Consultancy not found');
    }

    const agent = new Agent(agentData);
    return await agent.save();
  }

  // Update agent
  async updateAgent(id, updateData) {
    const agent = await Agent.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('consultancy', 'name email');

    if (!agent) {
      throw new Error('Agent not found');
    }

    return agent;
  }

  // Delete agent
  async deleteAgent(id) {
    const agent = await Agent.findByIdAndDelete(id);
    if (!agent) {
      throw new Error('Agent not found');
    }
    return agent;
  }

  // Get agents by consultancy
  async getAgentsByConsultancy(consultancyId) {
    return await Agent.find({ consultancy: consultancyId, isActive: true })
      .populate('consultancy', 'name email')
      .sort({ name: 1 });
  }

  // Distribute commission to agents in a consultancy
  async distributeCommissionToAgents(consultancyId, totalCommission) {
    try {
      // Get all active agents for this consultancy
      const agents = await Agent.find({
        consultancy: consultancyId,
        status: 'active',
        isActive: true
      });

      if (agents.length === 0) {
        console.log('No active agents found for commission distribution');
        return;
      }

      // Distribute commission equally among agents
      const commissionPerAgent = totalCommission / agents.length;

      // Update each agent's wallet and total commission
      const updatePromises = agents.map(agent =>
        Agent.findByIdAndUpdate(agent._id, {
          $inc: {
            walletBalance: commissionPerAgent,
            totalCommissionEarned: commissionPerAgent
          }
        })
      );

      await Promise.all(updatePromises);

      console.log(`Commission of ₹${totalCommission} distributed to ${agents.length} agents (₹${commissionPerAgent} each)`);

      return {
        totalCommission,
        agentsCount: agents.length,
        commissionPerAgent,
        distributedTo: agents.map(agent => ({
          id: agent._id,
          name: agent.name,
          amount: commissionPerAgent
        }))
      };
    } catch (error) {
      console.error('Error distributing commission to agents:', error);
      throw new Error(`Failed to distribute commission: ${error.message}`);
    }
  }

  // Process agent commission payment (withdraw from wallet)
  async processAgentCommissionWithdrawal(agentId, amount, paymentMethod = {}) {
    try {
      const agent = await Agent.findById(agentId);

      if (!agent) {
        throw new Error('Agent not found');
      }

      if (agent.walletBalance < amount) {
        throw new Error('Insufficient wallet balance');
      }

      // Deduct from wallet balance
      agent.walletBalance -= amount;

      // Record the withdrawal (you might want to create a separate transaction log)
      // For now, we'll just update the balance
      await agent.save();

      return {
        agentId: agent._id,
        agentName: agent.name,
        withdrawnAmount: amount,
        remainingBalance: agent.walletBalance,
        paymentMethod
      };
    } catch (error) {
      throw new Error(`Failed to process commission withdrawal: ${error.message}`);
    }
  }

  // Get agent commission statistics
  async getAgentCommissionStats(agentId) {
    try {
      const agent = await Agent.findById(agentId);

      if (!agent) {
        throw new Error('Agent not found');
      }

      return {
        agentId: agent._id,
        agentName: agent.name,
        walletBalance: agent.walletBalance,
        totalCommissionEarned: agent.totalCommissionEarned,
        commissionRate: agent.commissionRate,
        status: agent.status,
        isActive: agent.isActive
      };
    } catch (error) {
      throw new Error(`Failed to get agent commission stats: ${error.message}`);
    }
  }

  // Get all agents' commission statistics for a consultancy
  async getConsultancyCommissionStats(consultancyId) {
    try {
      const agents = await Agent.find({
        consultancy: consultancyId,
        isActive: true
      }).select('name email walletBalance totalCommissionEarned commissionRate status');

      const stats = {
        totalAgents: agents.length,
        activeAgents: agents.filter(agent => agent.status === 'active').length,
        totalWalletBalance: agents.reduce((sum, agent) => sum + agent.walletBalance, 0),
        totalCommissionEarned: agents.reduce((sum, agent) => sum + agent.totalCommissionEarned, 0),
        agents: agents.map(agent => ({
          id: agent._id,
          name: agent.name,
          email: agent.email,
          walletBalance: agent.walletBalance,
          totalCommissionEarned: agent.totalCommissionEarned,
          commissionRate: agent.commissionRate,
          status: agent.status
        }))
      };

      return stats;
    } catch (error) {
      throw new Error(`Failed to get consultancy commission stats: ${error.message}`);
    }
  }
}

module.exports = AgentService;
