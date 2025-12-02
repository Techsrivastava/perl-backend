const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const studentController = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// @route   GET /api/students
// @desc    Get all students
// @access  Private
router.get('/', protect, studentController.getAllStudents);

// @route   GET /api/students/:id
// @desc    Get single student
// @access  Private
router.get('/:id', protect, studentController.getStudentById);

// @route   POST /api/students
// @desc    Create student
// @access  Private (Consultant)
router.post(
  '/',
  protect,
  authorize('consultant', 'university', 'superadmin'),
  [
    body('name').notEmpty().withMessage('Student name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('courseId').notEmpty().withMessage('Course is required'),
    body('consultancyId').notEmpty().withMessage('Consultancy is required'),
    body('universityId').notEmpty().withMessage('University is required'),
  ],
  validate,
  studentController.createStudent
);

// @route   PUT /api/students/:id
// @desc    Update student
// @access  Private
router.put('/:id', protect, studentController.updateStudent);

// @route   PUT /api/students/:id/status
// @desc    Update student status
// @access  Private (University)
router.put('/:id/status', protect, authorize('university', 'superadmin'), studentController.updateStudentStatus);

// @route   DELETE /api/students/:id
// @desc    Delete student
// @access  Private (Superadmin)
router.delete('/:id', protect, authorize('superadmin'), studentController.deleteStudent);

module.exports = router;
