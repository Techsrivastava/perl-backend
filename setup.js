#!/usr/bin/env node

// Setup script for easy project initialization
const fs = require('fs');
const path = require('path');

console.log('🚀 University Management System - Setup Script\n');

// Check if .env already exists
const envPath = path.join(__dirname, '.env');

if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists. Skipping creation.');
  console.log('💡 If you want to reset, delete .env and run this script again.\n');
} else {
  try {
    const defaultEnv = [
      'PORT=5000',
      'NODE_ENV=development',
      'MONGODB_URI=',
      'JWT_SECRET=',
      'JWT_EXPIRE=7d',
      'MAX_FILE_SIZE=5242880',
      'OTP_EXPIRY_MINUTES=10',
      ''
    ].join('\n');

    fs.writeFileSync(envPath, defaultEnv, { encoding: 'utf8', flag: 'wx' });
    console.log('✅ Created .env file');
    console.log('⚠️  IMPORTANT: Please edit .env file and add your actual values!\n');
    console.log('Required configurations:');
    console.log('  - MONGODB_URI: Your MongoDB connection string');
    console.log('  - JWT_SECRET: A secure random string for JWT signing');
    console.log('  - Other optional settings as needed\n');
  } catch (error) {
    if (error && error.code === 'EEXIST') {
      console.log('⚠️  .env file already exists. Skipping creation.');
    } else {
      console.error('❌ Failed to create .env file:', error.message);
    }
  }
}

// Check if uploads directory exists
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  try {
    fs.mkdirSync(uploadsPath, { recursive: true });
    console.log('✅ Created uploads directory');
  } catch (error) {
    console.error('❌ Failed to create uploads directory:', error.message);
  }
} else {
  console.log('✅ uploads directory already exists');
}

// Final instructions
console.log('\n🎯 Setup Complete! Next steps:');
console.log('1. Edit .env file with your actual configuration');
console.log('2. Run: npm run troubleshoot (to check setup)');
console.log('3. Run: npm run dev (for development)');
console.log('4. Run: npm start (for production)');
console.log('\n📚 For more info, check DEPLOYMENT.md\n');
