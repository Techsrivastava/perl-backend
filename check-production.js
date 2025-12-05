#!/usr/bin/env node

// Production Environment Setup Script
console.log('🔧 Production Environment Setup\n');

// Check current environment
console.log('Current Environment:');
console.log(`- Directory: ${process.cwd()}`);
console.log(`- NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log(`- Platform: ${process.platform}`);
console.log('');

// Check if running in production-like environment
const isProduction = process.env.NODE_ENV === 'production' ||
                    process.cwd().startsWith('/app') ||
                    process.env.RAILWAY_ENVIRONMENT ||
                    process.env.RENDER ||
                    process.env.VERCEL;

console.log('Environment Detection:');
console.log(`- Production-like environment: ${isProduction ? '✅ Yes' : '❌ No'}`);
console.log('');

// Required variables check
const requiredVars = ['MONGODB_URI', 'JWT_SECRET'];
console.log('Required Environment Variables:');

let allPresent = true;
requiredVars.forEach(varName => {
  const exists = !!process.env[varName];
  console.log(`- ${varName}: ${exists ? '✅ Present' : '❌ Missing'}`);
  if (!exists) allPresent = false;
});

console.log('');

// Optional variables
console.log('Optional Environment Variables:');
const optionalVars = {
  'PORT': process.env.PORT || '5000 (default)',
  'JWT_EXPIRE': process.env.JWT_EXPIRE || '7d (default)',
  'MAX_FILE_SIZE': process.env.MAX_FILE_SIZE || '5242880 (default)',
  'OTP_EXPIRY_MINUTES': process.env.OTP_EXPIRY_MINUTES || '10 (default)'
};

Object.entries(optionalVars).forEach(([key, value]) => {
  console.log(`- ${key}: ${value}`);
});

console.log('');

if (allPresent) {
  console.log('🎉 Environment setup complete!');
  console.log('💡 Your backend should start successfully.');
  console.log('💡 Test with: curl http://localhost:5000/health (if running locally)');
} else {
  console.log('❌ Missing required environment variables!');
  console.log('\n📋 Setup Instructions:');
  console.log('');

  if (isProduction) {
    console.log('🌐 For Cloud Platforms (Heroku, Railway, Render, etc.):');
    console.log('1. Go to your platform\'s environment variables section');
    console.log('2. Add these variables:');
    console.log('   MONGODB_URI = your_mongodb_atlas_connection_string');
    console.log('   JWT_SECRET = your_secure_random_jwt_secret');
    console.log('   NODE_ENV = production');
    console.log('3. Redeploy your application');
  } else {
    console.log('💻 For Local Development:');
    console.log('1. Create a .env file in your project root:');
    console.log('   cp .env.example .env');
    console.log('2. Edit .env and add:');
    console.log('   MONGODB_URI=your_mongodb_connection_string');
    console.log('   JWT_SECRET=your_secure_jwt_secret');
    console.log('   NODE_ENV=production');
    console.log('3. Run: npm start');
  }

  console.log('');
  console.log('🔐 Security Tips:');
  console.log('- JWT_SECRET should be at least 32 characters long');
  console.log('- Use MongoDB Atlas for production database');
  console.log('- Never commit .env files to version control');

  process.exit(1);
}
