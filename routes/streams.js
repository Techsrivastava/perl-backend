const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const StreamController = require('../controllers/streamController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// @route   GET /api/streams
// @desc    Get all streams
// @access  Public
router.get('/', StreamController.getStreams);

// @route   GET /api/streams/:id
// @desc    Get single stream
// @access  Public
router.get('/:id', StreamController.getStream);

// @route   POST /api/streams
// @desc    Create stream
// @access  Private (Superadmin)
router.post('/',
  protect,
  authorize('superadmin'),
  [
    body('name').notEmpty().withMessage('Stream name is required'),
    body('code').notEmpty().withMessage('Stream code is required'),
    body('courseId').isMongoId().withMessage('Valid course ID is required'),
    body('duration').optional().isNumeric().withMessage('Duration must be numeric')
  ],
  validate,
  StreamController.createStream
);

// @route   PUT /api/streams/:id
// @desc    Update stream
// @access  Private (Superadmin)
router.put('/:id',
  protect,
  authorize('superadmin'),
  StreamController.updateStream
);

// @route   DELETE /api/streams/:id
// @desc    Delete stream
// @access  Private (Superadmin)
router.delete('/:id',
  protect,
  authorize('superadmin'),
  StreamController.deleteStream
);

// @route   GET /api/streams/course/:courseId
// @desc    Get streams by course
// @access  Public
router.get('/course/:courseId', StreamController.getStreamsByCourse);

// @route   PUT /api/streams/:id/toggle
// @desc    Toggle stream active status
// @access  Private (Superadmin)
router.put('/:id/toggle',
  protect,
  authorize('superadmin'),
  StreamController.toggleStreamStatus
);

// @route   GET /api/streams/statistics
// @desc    Get stream statistics
// @access  Private (Superadmin)
router.get('/statistics',
  protect,
  authorize('superadmin'),
  StreamController.getStreamStatistics
);

module.exports = router;
