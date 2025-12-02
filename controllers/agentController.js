const agentService = require('../services/agentService');

class AgentController {
  // @desc    Get all agents
  // @route   GET /api/agents
  // @access  Private (Superadmin)
  async getAllAgents(req, res, next) {
    try {
      const result = await agentService.getAllAgents(req.query);

      res.json({
        success: true,
        data: result.agents,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get single agent
  // @route   GET /api/agents/:id
  // @access  Private (Superadmin)
  async getAgentById(req, res, next) {
    try {
      const agent = await agentService.getAgentById(req.params.id);

      res.json({
        success: true,
        data: agent,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Create agent
  // @route   POST /api/agents
  // @access  Private (Superadmin)
  async createAgent(req, res, next) {
    try {
      const agent = await agentService.createAgent(req.body);

      res.status(201).json({
        success: true,
        message: 'Agent created successfully',
        data: agent,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Update agent
  // @route   PUT /api/agents/:id
  // @access  Private (Superadmin)
  async updateAgent(req, res, next) {
    try {
      const agent = await agentService.updateAgent(req.params.id, req.body);

      res.json({
        success: true,
        message: 'Agent updated successfully',
        data: agent,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Delete agent
  // @route   DELETE /api/agents/:id
  // @access  Private (Superadmin)
  async deleteAgent(req, res, next) {
    try {
      await agentService.deleteAgent(req.params.id);

      res.json({
        success: true,
        message: 'Agent deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get agents by consultancy
  // @route   GET /api/agents/consultancy/:consultancyId
  // @access  Private (Superadmin)
  async getAgentsByConsultancy(req, res, next) {
    try {
      const agents = await agentService.getAgentsByConsultancy(req.params.consultancyId);

      res.json({
        success: true,
        data: agents,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AgentController();
