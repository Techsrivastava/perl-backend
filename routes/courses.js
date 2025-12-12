const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// @route   GET /api/courses
// @desc    Get all courses
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      universityId,
      degreeType,
      status,
      isActive,
      department,
    } = req.query;

    const query = {};
    const andFilters = [];

    // Filters
    if (search) {
      andFilters.push({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } },
          { department: { $regex: search, $options: 'i' } },
        ],
      });
    }

    if (universityId) {
      andFilters.push({ $or: [{ universityId }, { universityIds: universityId }] });
    }
    if (degreeType) andFilters.push({ degreeType });
    if (status) andFilters.push({ status });
    if (department) andFilters.push({ department });
    if (isActive !== undefined) andFilters.push({ isActive: isActive === 'true' });

    if (andFilters.length) query.$and = andFilters;

    const courses = await Course.find(query)
      .populate('universityId', 'name abbreviation')
      .populate('universityIds', 'name abbreviation')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Course.countDocuments(query);

    res.json({
      success: true,
      data: courses,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/courses/:id
// @desc    Get single course
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('universityId')
      .populate('universityIds');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Get associated streams
    const Stream = require('../models/Stream');
    const streams = await Stream.find({ courseId: course._id });

    res.json({
      success: true,
      data: {
        ...course.toObject(),
        streams,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/courses
// @desc    Create course
// @access  Private (University)
router.post(
  '/',
  protect,
  authorize('university', 'superadmin'),
  [
    body('name').notEmpty().withMessage('Course name is required'),
    body('code').notEmpty().withMessage('Course code is required'),
  ],
  validate,
  async (req, res, next) => {
    try {
      // Check if university owns this course
      if (req.user.role === 'university') {
        req.body.universityId = req.body.universityId || req.user.universityId;
        req.body.universityIds = Array.isArray(req.body.universityIds) ? req.body.universityIds : [];
        if (!req.body.universityIds.map(String).includes(String(req.user.universityId))) {
          req.body.universityIds.push(req.user.universityId);
        }
      }

      const course = await Course.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Course created successfully',
        data: course,
      });
    } catch (error) {
      next(error);
    }
  }
);

// @route   PUT /api/courses/:id
// @desc    Update course
// @access  Private (University owner)
router.put('/:id', protect, authorize('university', 'superadmin'), async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check ownership
    if (
      req.user.role === 'university' &&
      !(
        (course.universityId && course.universityId.toString() === req.user.universityId.toString()) ||
        (Array.isArray(course.universityIds) &&
          course.universityIds.map(String).includes(String(req.user.universityId)))
      )
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course',
      });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: course,
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/courses/:id/publish
// @desc    Publish course
// @access  Private (University owner)
router.put('/:id/publish', protect, authorize('university', 'superadmin'), async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check ownership
    if (
      req.user.role === 'university' &&
      !(
        (course.universityId && course.universityId.toString() === req.user.universityId.toString()) ||
        (Array.isArray(course.universityIds) &&
          course.universityIds.map(String).includes(String(req.user.universityId)))
      )
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to publish this course',
      });
    }

    course.status = 'published';
    await course.save();

    res.json({
      success: true,
      message: 'Course published successfully',
      data: course,
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete course
// @access  Private (University owner or Superadmin)
router.delete('/:id', protect, authorize('university', 'superadmin'), async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check ownership
    if (
      req.user.role === 'university' &&
      !(
        (course.universityId && course.universityId.toString() === req.user.universityId.toString()) ||
        (Array.isArray(course.universityIds) &&
          course.universityIds.map(String).includes(String(req.user.universityId)))
      )
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course',
      });
    }

    await course.deleteOne();

    res.json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
