const jwt = require('jsonwebtoken');
const User = require('../models/User');
const University = require('../models/University');
const Consultancy = require('../models/Consultancy');

class AuthService {
  // Generate JWT Token
  generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    });
  }

  // Register new user
  async register(userData) {
    const { email, password, name, phone, role, ...otherData } = userData;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    let roleId = null;

    // Create role-specific data
    if (role === 'university') {
      const university = await University.create({
        name,
        contactEmail: email,
        contactPhone: phone,
        ...otherData,
      });
      roleId = university._id;
    } else if (role === 'consultant') {
      const consultancy = await Consultancy.create({
        name,
        email,
        phone,
        ...otherData,
      });
      roleId = consultancy._id;
    }

    // Create user
    const user = await User.create({
      email,
      password,
      name,
      phone,
      role,
      ...(role === 'university' && { universityId: roleId }),
      ...(role === 'consultant' && { consultancyId: roleId }),
    });

    const token = this.generateToken(user._id);

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  // Login user
  async login(email, password) {
    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    const token = this.generateToken(user._id);

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        universityId: user.universityId,
        consultancyId: user.consultancyId,
      },
    };
  }

  // Get current user details
  async getCurrentUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    let userData = {
      id: user._id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
    };

    // Get role-specific data
    if (user.role === 'university' && user.universityId) {
      const university = await University.findById(user.universityId);
      userData.university = university;
    } else if (user.role === 'consultant' && user.consultancyId) {
      const consultancy = await Consultancy.findById(user.consultancyId);
      userData.consultancy = consultancy;
    }

    return userData;
  }

  // Update password
  async updatePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return true;
  }

  // Send OTP for email verification
  async sendOTP(email) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found with this email');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Generate OTP
    const otp = user.generateOTP();
    await user.save();

    // TODO: Send OTP via email service
    // For now, we'll log it (in production, integrate with email service)
    console.log(`OTP for ${email}: ${otp}`);

    return {
      message: 'OTP sent successfully',
      email: email,
    };
  }

  // Verify OTP and login
  async verifyOTP(email, otp) {
    const user = await User.findOne({ email }).select('+otp +otpExpires');
    if (!user) {
      throw new Error('User not found with this email');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Verify OTP
    if (!user.verifyOTP(otp)) {
      throw new Error('Invalid or expired OTP');
    }

    // Clear OTP after successful verification
    user.otp = undefined;
    user.otpExpires = undefined;
    user.lastLogin = Date.now();
    await user.save();

    const token = this.generateToken(user._id);

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        universityId: user.universityId,
        consultancyId: user.consultancyId,
      },
    };
  }
}

module.exports = new AuthService();
