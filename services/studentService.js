const Student = require('../models/Student');
const Course = require('../models/Course');
const Consultancy = require('../models/Consultancy');

class StudentService {
  // Get all students with filters
  async getAllStudents(filters = {}, user) {
    const { page = 1, limit = 10, search, status, consultancyId, courseId, universityId } = filters;

    const query = {};

    // Role-based filtering
    if (user.role === 'consultant') {
      query.consultancyId = user.consultancyId;
    } else if (user.role === 'university') {
      query.universityId = user.universityId;
    }

    // Additional filters
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) query.status = status;
    if (consultancyId) query.consultancyId = consultancyId;
    if (courseId) query.courseId = courseId;
    if (universityId) query.universityId = universityId;

    const students = await Student.find(query)
      .populate('courseId', 'name code fees')
      .populate('consultancyId', 'name email')
      .populate('universityId', 'name abbreviation')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Student.countDocuments(query);

    return {
      students,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
      },
    };
  }

  // Get single student by ID
  async getStudentById(id, user) {
    const student = await Student.findById(id)
      .populate('courseId')
      .populate('consultancyId')
      .populate('universityId');

    if (!student) {
      throw new Error('Student not found');
    }

    // Check access
    if (
      user.role === 'consultant' &&
      student.consultancyId._id.toString() !== user.consultancyId.toString()
    ) {
      throw new Error('Not authorized to access this student');
    }

    if (
      user.role === 'university' &&
      student.universityId._id.toString() !== user.universityId.toString()
    ) {
      throw new Error('Not authorized to access this student');
    }

    return student;
  }

  // Create new student
  async createStudent(studentData) {
    // Get course and consultancy names for denormalization
    const [course, consultancy] = await Promise.all([
      Course.findById(studentData.courseId),
      Consultancy.findById(studentData.consultancyId),
    ]);

    const data = {
      ...studentData,
      courseName: course?.name || '',
      consultancyName: consultancy?.name || '',
    };

    const student = await Student.create(data);

    // Update consultancy student count
    await Consultancy.findByIdAndUpdate(studentData.consultancyId, {
      $inc: { studentsCount: 1 },
    });

    return student;
  }

  // Update student
  async updateStudent(id, studentData, user) {
    let student = await Student.findById(id);

    if (!student) {
      throw new Error('Student not found');
    }

    // Check access
    if (
      user.role === 'consultant' &&
      student.consultancyId.toString() !== user.consultancyId.toString()
    ) {
      throw new Error('Not authorized to update this student');
    }

    student = await Student.findByIdAndUpdate(id, studentData, {
      new: true,
      runValidators: true,
    });

    return student;
  }

  // Update student status
  async updateStudentStatus(id, status) {
    const validStatuses = ['Pending', 'Approved', 'Rejected', 'Enrolled', 'Completed'];
    
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    const student = await Student.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!student) {
      throw new Error('Student not found');
    }

    return student;
  }

  // Delete student
  async deleteStudent(id) {
    const student = await Student.findById(id);

    if (!student) {
      throw new Error('Student not found');
    }

    await student.deleteOne();
    return true;
  }
}

module.exports = new StudentService();
