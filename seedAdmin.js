const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected to MongoDB');

    // Check if superadmin already exists
    const existingSuperAdmin = await User.findOne({ role: 'superadmin' });

    if (existingSuperAdmin) {
      console.log('ℹ️ Superadmin user already exists');
      process.exit(0);
    }

    // Create superadmin user
    const superAdmin = new User({
      email: 'admin@university.edu',
      password: 'admin123',
      role: 'superadmin',
      name: 'Super Administrator',
      phone: '+91 9876543210',
    });

    await superAdmin.save();
    console.log('✅ Superadmin user created successfully');
    console.log('📧 Email: admin@university.edu');
    console.log('🔒 Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding superadmin:', error);
    process.exit(1);
  }
};

seedSuperAdmin();
