const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const AdmissionController = require('../controllers/admissionController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// @route   GET /api/admissions
// @desc    Get all admissions
// @access  Private
router.get('/', protect, AdmissionController.getAdmissions);

// @route   GET /api/admissions/:id
// @desc    Get single admission
// @access  Private
router.get('/:id', protect, AdmissionController.getAdmission);

// @route   POST /api/admissions
// @desc    Create admission
// @access  Private (University, Superadmin)
router.post('/',
  protect,
  authorize('university', 'superadmin'),
  [
    body('studentId').isMongoId().withMessage('Valid student ID is required'),
    body('courseId').isMongoId().withMessage('Valid course ID is required'),
    body('universityId').isMongoId().withMessage('Valid university ID is required'),
    body('consultancyId').isMongoId().withMessage('Valid consultancy ID is required'),
    body('status').optional().isIn(['pending', 'approved', 'enrolled', 'rejected']).withMessage('Invalid status'),
    body('applicationFee').optional().isNumeric().withMessage('Application fee must be numeric'),
    body('tuitionFee').optional().isNumeric().withMessage('Tuition fee must be numeric')
  ],
  validate,
  AdmissionController.createAdmission
);

// @route   PUT /api/admissions/:id
// @desc    Update admission
// @access  Private (University, Superadmin)
router.put('/:id',
  protect,
  authorize('university', 'superadmin'),
  AdmissionController.updateAdmission
);

// @route   DELETE /api/admissions/:id
// @desc    Delete admission
// @access  Private (Superadmin)
router.delete('/:id',
  protect,
  authorize('superadmin'),
  AdmissionController.deleteAdmission
);

// @route   GET /api/admissions/student/:studentId
// @desc    Get admissions by student
// @access  Private
router.get('/student/:studentId', protect, AdmissionController.getAdmissionsByStudent);

// @route   GET /api/admissions/university/:universityId
// @desc    Get admissions by university
// @access  Private
router.get('/university/:universityId', protect, AdmissionController.getAdmissionsByUniversity);

// @route   GET /api/admissions/consultancy/:consultancyId
// @desc    Get admissions by consultancy
// @access  Private
router.get('/consultancy/:consultancyId', protect, AdmissionController.getAdmissionsByConsultancy);

// @route   GET /api/admissions/statistics
// @desc    Get admission statistics
// @access  Private
router.get('/statistics', protect, AdmissionController.getAdmissionStatistics);

module.exports = router;
