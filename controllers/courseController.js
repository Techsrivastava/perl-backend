const courseService = require('../services/courseService');

class CourseController {
  // @desc    Get all courses
  // @route   GET /api/courses
  // @access  Public
  async getAllCourses(req, res, next) {
    try {
      const result = await courseService.getAllCourses(req.query);

      res.json({
        success: true,
        data: result.courses,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get single course
  // @route   GET /api/courses/:id
  // @access  Public
  async getCourseById(req, res, next) {
    try {
      const course = await courseService.getCourseById(req.params.id);

      res.json({
        success: true,
        data: course,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Create course
  // @route   POST /api/courses
  // @access  Private (University, Superadmin)
  async createCourse(req, res, next) {
    try {
      const course = await courseService.createCourse(req.body, req.user);

      res.status(201).json({
        success: true,
        message: 'Course created successfully',
        data: course,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Update course
  // @route   PUT /api/courses/:id
  // @access  Private (University owner, Superadmin)
  async updateCourse(req, res, next) {
    try {
      const course = await courseService.updateCourse(
        req.params.id,
        req.body,
        req.user
      );

      res.json({
        success: true,
        message: 'Course updated successfully',
        data: course,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Publish course
  // @route   PUT /api/courses/:id/publish
  // @access  Private (University owner, Superadmin)
  async publishCourse(req, res, next) {
    try {
      const course = await courseService.publishCourse(req.params.id, req.user);

      res.json({
        success: true,
        message: 'Course published successfully',
        data: course,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Delete course
  // @route   DELETE /api/courses/:id
  // @access  Private (University owner, Superadmin)
  async deleteCourse(req, res, next) {
    try {
      await courseService.deleteCourse(req.params.id, req.user);

      res.json({
        success: true,
        message: 'Course deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CourseController();
