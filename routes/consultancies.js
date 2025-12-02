const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Consultancy = require('../models/Consultancy');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// @route   GET /api/consultancies
// @desc    Get all consultancies
// @access  Private (University, Superadmin)
router.get('/', protect, authorize('university', 'superadmin'), async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;

    const query = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    const consultancies = await Consultancy.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Consultancy.countDocuments(query);

    res.json({
      success: true,
      data: consultancies,
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

// @route   GET /api/consultancies/:id
// @desc    Get single consultancy
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const consultancy = await Consultancy.findById(req.params.id);

    if (!consultancy) {
      return res.status(404).json({
        success: false,
        message: 'Consultancy not found',
      });
    }

    res.json({
      success: true,
      data: consultancy,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/consultancies
// @desc    Create consultancy
// @access  Private (Superadmin)
router.post(
  '/',
  protect,
  authorize('superadmin'),
  [
    body('name').notEmpty().withMessage('Consultancy name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('commissionType').isIn(['percentage', 'flat', 'oneTime']).withMessage('Invalid commission type'),
    body('commissionValue').isNumeric().withMessage('Commission value must be a number'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const consultancy = await Consultancy.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Consultancy created successfully',
        data: consultancy,
      });
    } catch (error) {
      next(error);
    }
  }
);

// @route   PUT /api/consultancies/:id
// @desc    Update consultancy
// @access  Private (Consultant owner or Superadmin)
router.put('/:id', protect, async (req, res, next) => {
  try {
    let consultancy = await Consultancy.findById(req.params.id);

    if (!consultancy) {
      return res.status(404).json({
        success: false,
        message: 'Consultancy not found',
      });
    }

    // Check ownership
    if (req.user.role === 'consultant' && consultancy._id.toString() !== req.user.consultancyId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this consultancy',
      });
    }

    consultancy = await Consultancy.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Consultancy updated successfully',
      data: consultancy,
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/consultancies/:id
// @desc    Delete consultancy
// @access  Private (Superadmin)
router.delete('/:id', protect, authorize('superadmin'), async (req, res, next) => {
  try {
    const consultancy = await Consultancy.findById(req.params.id);

    if (!consultancy) {
      return res.status(404).json({
        success: false,
        message: 'Consultancy not found',
      });
    }

    await consultancy.deleteOne();

    res.json({
      success: true,
      message: 'Consultancy deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/consultancies/:id/stats
// @desc    Get consultancy statistics
// @access  Private
router.get('/:id/stats', protect, async (req, res, next) => {
  try {
    const Student = require('../models/Student');
    const CommissionTransaction = require('../models/Commission');

    const [studentsCount, pendingCommission, paidCommission] = await Promise.all([
      Student.countDocuments({ consultancyId: req.params.id }),
      CommissionTransaction.aggregate([
        { $match: { consultancyId: mongoose.Types.ObjectId(req.params.id), status: 'Pending' } },
        { $group: { _id: null, total: { $sum: '$calculatedCommission' } } },
      ]),
      CommissionTransaction.aggregate([
        { $match: { consultancyId: mongoose.Types.ObjectId(req.params.id), status: 'Paid' } },
        { $group: { _id: null, total: { $sum: '$calculatedCommission' } } },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        studentsCount,
        pendingCommission: pendingCommission[0]?.total || 0,
        paidCommission: paidCommission[0]?.total || 0,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
