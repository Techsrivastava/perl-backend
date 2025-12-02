const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const universityController = require('../controllers/universityController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// @route   GET /api/universities
// @desc    Get all universities
// @access  Public
router.get('/', universityController.getAllUniversities);

// @route   GET /api/universities/:id
// @desc    Get single university
// @access  Public
router.get('/:id', universityController.getUniversityById);

// @route   POST /api/universities
// @desc    Create university
// @access  Private (Superadmin only)
router.post(
  '/',
  protect,
  authorize('superadmin', 'university'),
  [
    body('name').notEmpty().withMessage('University name is required'),
    body('abbreviation').notEmpty().withMessage('Abbreviation is required'),
    body('establishedYear').isNumeric().withMessage('Established year must be a number'),
    body('type').isIn(['Government', 'Private', 'Deemed', 'Autonomous']).withMessage('Invalid university type'),
    body('contactEmail').isEmail().withMessage('Valid contact email is required'),
    body('contactPhone').notEmpty().withMessage('Contact phone is required'),
    body('address').notEmpty().withMessage('Address is required'),
  ],
  validate,
  universityController.createUniversity
);

// @route   PUT /api/universities/:id
// @desc    Update university
// @access  Private (University owner or Superadmin)
router.put('/:id', protect, authorize('superadmin', 'university'), universityController.updateUniversity);

// @route   DELETE /api/universities/:id
// @desc    Delete university
// @access  Private (Superadmin only)
router.delete('/:id', protect, authorize('superadmin'), universityController.deleteUniversity);

// @route   GET /api/universities/:id/stats
// @desc    Get university statistics
// @access  Private
router.get('/:id/stats', protect, universityController.getUniversityStats);

module.exports = router;
