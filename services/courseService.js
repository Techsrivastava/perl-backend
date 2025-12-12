const Course = require('../models/Course');
const Stream = require('../models/Stream');

class CourseService {
  // Get all courses with filters
  async getAllCourses(filters = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      universityId,
      degreeType,
      status,
      isActive,
      department,
    } = filters;

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

    if (universityId) andFilters.push({ $or: [{ universityId }, { universityIds: universityId }] });
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

    return {
      courses,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
      },
    };
  }

  // Get single course by ID
  async getCourseById(id) {
    const course = await Course.findById(id).populate('universityId').populate('universityIds');

    if (!course) {
      throw new Error('Course not found');
    }

    // Get associated streams
    const streams = await Stream.find({ courseId: course._id });

    return {
      ...course.toObject(),
      streams,
    };
  }

  // Create new course
  async createCourse(courseData, user) {
    // Check if university owns this course
    if (user.role === 'university') {
      courseData.universityId = courseData.universityId || user.universityId;
      courseData.universityIds = Array.isArray(courseData.universityIds) ? courseData.universityIds : [];
      if (!courseData.universityIds.map(String).includes(String(user.universityId))) {
        courseData.universityIds.push(user.universityId);
      }
    }

    const course = await Course.create(courseData);
    return course;
  }

  // Update course
  async updateCourse(id, courseData, user) {
    let course = await Course.findById(id);

    if (!course) {
      throw new Error('Course not found');
    }

    // Check ownership
    if (
      user.role === 'university' &&
      !(
        (course.universityId && course.universityId.toString() === user.universityId.toString()) ||
        (Array.isArray(course.universityIds) &&
          course.universityIds.map(String).includes(String(user.universityId)))
      )
    ) {
      throw new Error('Not authorized to update this course');
    }

    course = await Course.findByIdAndUpdate(id, courseData, {
      new: true,
      runValidators: true,
    });

    return course;
  }

  // Publish course
  async publishCourse(id, user) {
    const course = await Course.findById(id);

    if (!course) {
      throw new Error('Course not found');
    }

    // Check ownership
    if (
      user.role === 'university' &&
      !(
        (course.universityId && course.universityId.toString() === user.universityId.toString()) ||
        (Array.isArray(course.universityIds) &&
          course.universityIds.map(String).includes(String(user.universityId)))
      )
    ) {
      throw new Error('Not authorized to publish this course');
    }

    course.status = 'published';
    await course.save();

    return course;
  }

  // Delete course
  async deleteCourse(id, user) {
    const course = await Course.findById(id);

    if (!course) {
      throw new Error('Course not found');
    }

    // Check ownership
    if (
      user.role === 'university' &&
      !(
        (course.universityId && course.universityId.toString() === user.universityId.toString()) ||
        (Array.isArray(course.universityIds) &&
          course.universityIds.map(String).includes(String(user.universityId)))
      )
    ) {
      throw new Error('Not authorized to delete this course');
    }

    await course.deleteOne();
    return true;
  }
}

module.exports = new CourseService();
