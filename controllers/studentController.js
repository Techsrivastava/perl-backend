const studentService = require('../services/studentService');

class StudentController {
  // @desc    Get all students
  // @route   GET /api/students
  // @access  Private
  async getAllStudents(req, res, next) {
    try {
      const result = await studentService.getAllStudents(req.query, req.user);

      res.json({
        success: true,
        data: result.students,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get single student
  // @route   GET /api/students/:id
  // @access  Private
  async getStudentById(req, res, next) {
    try {
      const student = await studentService.getStudentById(req.params.id, req.user);

      res.json({
        success: true,
        data: student,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Create student
  // @route   POST /api/students
  // @access  Private (Consultant, University, Superadmin)
  async createStudent(req, res, next) {
    try {
      const student = await studentService.createStudent(req.body);

      res.status(201).json({
        success: true,
        message: 'Student created successfully',
        data: student,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Update student
  // @route   PUT /api/students/:id
  // @access  Private
  async updateStudent(req, res, next) {
    try {
      const student = await studentService.updateStudent(
        req.params.id,
        req.body,
        req.user
      );

      res.json({
        success: true,
        message: 'Student updated successfully',
        data: student,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Update student status
  // @route   PUT /api/students/:id/status
  // @access  Private (University, Superadmin)
  async updateStudentStatus(req, res, next) {
    try {
      const { status } = req.body;
      const student = await studentService.updateStudentStatus(req.params.id, status);

      res.json({
        success: true,
        message: 'Student status updated successfully',
        data: student,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Delete student
  // @route   DELETE /api/students/:id
  // @access  Private (Superadmin)
  async deleteStudent(req, res, next) {
    try {
      await studentService.deleteStudent(req.params.id);

      res.json({
        success: true,
        message: 'Student deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StudentController();
