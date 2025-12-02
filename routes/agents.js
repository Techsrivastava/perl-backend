const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const agentController = require('../controllers/agentController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// @route   GET /api/agents
// @desc    Get all agents
// @access  Private (Superadmin)
router.get('/', protect, authorize('superadmin'), agentController.getAllAgents);

// @route   GET /api/agents/:id
// @desc    Get single agent
// @access  Private (Superadmin)
router.get('/:id', protect, authorize('superadmin'), agentController.getAgentById);

// @route   POST /api/agents
// @desc    Create agent
// @access  Private (Superadmin)
router.post(
  '/',
  protect,
  authorize('superadmin'),
  [
    body('name').notEmpty().withMessage('Agent name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('consultancy').isMongoId().withMessage('Valid consultancy ID is required'),
    body('commissionRate').isNumeric().withMessage('Commission rate must be a number'),
  ],
  validate,
  agentController.createAgent
);

// @route   PUT /api/agents/:id
// @desc    Update agent
// @access  Private (Superadmin)
router.put(
  '/:id',
  protect,
  authorize('superadmin'),
  [
    body('commissionRate').optional().isNumeric().withMessage('Commission rate must be a number'),
  ],
  validate,
  agentController.updateAgent
);

// @route   DELETE /api/agents/:id
// @desc    Delete agent
// @access  Private (Superadmin)
router.delete('/:id', protect, authorize('superadmin'), agentController.deleteAgent);

// @route   GET /api/agents/consultancy/:consultancyId
// @desc    Get agents by consultancy
// @access  Private (Superadmin)
router.get('/consultancy/:consultancyId', protect, authorize('superadmin'), agentController.getAgentsByConsultancy);

module.exports = router;
