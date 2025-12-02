const StreamService = require('../services/streamService');

class StreamController {
  // Get all streams
  static async getStreams(req, res, next) {
    try {
      const { page, limit, courseId, search, isActive } = req.query;

      const filters = {};
      if (courseId) filters.courseId = courseId;
      if (search) filters.name = { $regex: search, $options: 'i' };
      if (isActive !== undefined) filters.isActive = isActive === 'true';

      const result = await StreamService.getStreams(filters, { page, limit });

      res.status(200).json({
        success: true,
        data: result.streams,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  // Get single stream
  static async getStream(req, res, next) {
    try {
      const stream = await StreamService.getStreamById(req.params.id);

      res.status(200).json({
        success: true,
        data: stream
      });
    } catch (error) {
      next(error);
    }
  }

  // Create stream
  static async createStream(req, res, next) {
    try {
      const stream = await StreamService.createStream(req.body);

      res.status(201).json({
        success: true,
        data: stream,
        message: 'Stream created successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Update stream
  static async updateStream(req, res, next) {
    try {
      const stream = await StreamService.updateStream(req.params.id, req.body);

      res.status(200).json({
        success: true,
        data: stream,
        message: 'Stream updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete stream
  static async deleteStream(req, res, next) {
    try {
      await StreamService.deleteStream(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Stream deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Get streams by course
  static async getStreamsByCourse(req, res, next) {
    try {
      const { courseId } = req.params;
      const { isActive } = req.query;

      const filters = {};
      if (isActive !== undefined) filters.isActive = isActive === 'true';

      const result = await StreamService.getStreamsByCourse(courseId, filters);

      res.status(200).json({
        success: true,
        data: result.streams,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  // Toggle stream status
  static async toggleStreamStatus(req, res, next) {
    try {
      const stream = await StreamService.toggleStreamStatus(req.params.id);

      res.status(200).json({
        success: true,
        data: stream,
        message: 'Stream status updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Get stream statistics
  static async getStreamStatistics(req, res, next) {
    try {
      const stats = await StreamService.getStreamStatistics();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = StreamController;
