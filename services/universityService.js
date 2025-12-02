const University = require('../models/University');
const Course = require('../models/Course');
const Student = require('../models/Student');

class UniversityService {
  // Get all universities with filters
  async getAllUniversities(filters = {}) {
    const { page = 1, limit = 10, search, type, isActive } = filters;

    const query = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { abbreviation: { $regex: search, $options: 'i' } },
      ];
    }

    // Type filter
    if (type) query.type = type;

    // Active filter
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const universities = await University.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await University.countDocuments(query);

    return {
      universities,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
      },
    };
  }

  // Get single university by ID
  async getUniversityById(id) {
    const university = await University.findById(id);
    if (!university) {
      throw new Error('University not found');
    }
    return university;
  }

  // Create new university
  async createUniversity(universityData) {
    const university = await University.create(universityData);
    return university;
  }

  // Update university
  async updateUniversity(id, universityData, user) {
    let university = await University.findById(id);
    
    if (!university) {
      throw new Error('University not found');
    }

    // Check ownership
    if (user.role === 'university' && university._id.toString() !== user.universityId.toString()) {
      throw new Error('Not authorized to update this university');
    }

    university = await University.findByIdAndUpdate(id, universityData, {
      new: true,
      runValidators: true,
    });

    return university;
  }

  // Delete university
  async deleteUniversity(id) {
    const university = await University.findById(id);
    
    if (!university) {
      throw new Error('University not found');
    }

    await university.deleteOne();
    return true;
  }

  // Get university statistics
  async getUniversityStats(id) {
    const [coursesCount, studentsCount, activeCoursesCount] = await Promise.all([
      Course.countDocuments({ universityId: id }),
      Student.countDocuments({ universityId: id }),
      Course.countDocuments({ universityId: id, isActive: true }),
    ]);

    return {
      coursesCount,
      studentsCount,
      activeCoursesCount,
    };
  }
}

module.exports = new UniversityService();
