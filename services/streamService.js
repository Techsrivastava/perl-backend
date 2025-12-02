const Stream = require('../models/Stream');
const Course = require('../models/Course');

class StreamService {
  // Get all streams with filters and pagination
  static async getStreams(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const query = { ...filters };

      const streams = await Stream.find(query)
        .populate('courseId', 'name code')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

      const count = await Stream.countDocuments(query);

      return {
        streams,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit),
        }
      };
    } catch (error) {
      throw new Error(`Failed to get streams: ${error.message}`);
    }
  }

  // Get stream by ID
  static async getStreamById(id) {
    try {
      const stream = await Stream.findById(id).populate('courseId', 'name code');

      if (!stream) {
        throw new Error('Stream not found');
      }

      return stream;
    } catch (error) {
      throw new Error(`Failed to get stream: ${error.message}`);
    }
  }

  // Create new stream
  static async createStream(data) {
    try {
      const { name, code, courseId, description, duration, isActive = true } = data;

      // Check if course exists
      const course = await Course.findById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      // Check if stream code already exists for this course
      const existingStream = await Stream.findOne({ code, courseId });
      if (existingStream) {
        throw new Error('Stream code already exists for this course');
      }

      const stream = new Stream({
        name,
        code,
        courseId,
        description,
        duration,
        isActive
      });

      await stream.save();

      return await this.getStreamById(stream._id);
    } catch (error) {
      throw new Error(`Failed to create stream: ${error.message}`);
    }
  }

  // Update stream
  static async updateStream(id, data) {
    try {
      const { name, code, courseId, description, duration, isActive } = data;

      const stream = await Stream.findById(id);
      if (!stream) {
        throw new Error('Stream not found');
      }

      // Check if updating to a code that already exists for this course
      if (code && code !== stream.code) {
        const existingStream = await Stream.findOne({
          code,
          courseId: courseId || stream.courseId,
          _id: { $ne: id }
        });
        if (existingStream) {
          throw new Error('Stream code already exists for this course');
        }
      }

      // Check if course exists if courseId is being updated
      if (courseId) {
        const course = await Course.findById(courseId);
        if (!course) {
          throw new Error('Course not found');
        }
      }

      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (code !== undefined) updateData.code = code;
      if (courseId !== undefined) updateData.courseId = courseId;
      if (description !== undefined) updateData.description = description;
      if (duration !== undefined) updateData.duration = duration;
      if (isActive !== undefined) updateData.isActive = isActive;

      const updatedStream = await Stream.findByIdAndUpdate(id, updateData, { new: true })
        .populate('courseId', 'name code');

      return updatedStream;
    } catch (error) {
      throw new Error(`Failed to update stream: ${error.message}`);
    }
  }

  // Delete stream
  static async deleteStream(id) {
    try {
      const stream = await Stream.findByIdAndDelete(id);

      if (!stream) {
        throw new Error('Stream not found');
      }

      return stream;
    } catch (error) {
      throw new Error(`Failed to delete stream: ${error.message}`);
    }
  }

  // Get streams by course
  static async getStreamsByCourse(courseId, filters = {}) {
    try {
      const query = { courseId, ...filters };

      const result = await this.getStreams(query);
      return result;
    } catch (error) {
      throw new Error(`Failed to get streams by course: ${error.message}`);
    }
  }

  // Toggle stream active status
  static async toggleStreamStatus(id) {
    try {
      const stream = await Stream.findById(id);
      if (!stream) {
        throw new Error('Stream not found');
      }

      stream.isActive = !stream.isActive;
      await stream.save();

      return await this.getStreamById(id);
    } catch (error) {
      throw new Error(`Failed to toggle stream status: ${error.message}`);
    }
  }

  // Get stream statistics
  static async getStreamStatistics() {
    try {
      const stats = await Stream.aggregate([
        {
          $group: {
            _id: null,
            totalStreams: { $sum: 1 },
            activeStreams: {
              $sum: {
                $cond: [{ $eq: ['$isActive', true] }, 1, 0]
              }
            },
            inactiveStreams: {
              $sum: {
                $cond: [{ $eq: ['$isActive', false] }, 1, 0]
              }
            }
          }
        }
      ]);

      return stats[0] || {
        totalStreams: 0,
        activeStreams: 0,
        inactiveStreams: 0
      };
    } catch (error) {
      throw new Error(`Failed to get stream statistics: ${error.message}`);
    }
  }
}

module.exports = StreamService;
