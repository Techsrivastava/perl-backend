#!/usr/bin/env node

// Quick fix for MongoDB connection issues
const fs = require('fs');
const path = require('path');

console.log('🔧 MongoDB Connection Fix Script\n');

// Check current .env file
const envPath = path.join(__dirname, '.env');

try {
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found. Creating a new .env...');
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
    fs.writeFileSync(envPath, defaultEnv, { encoding: 'utf8' });
    console.log('✅ Created .env file');
  }

  // Read and validate .env content
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('📄 Current .env content:');
  console.log(envContent);

  // Check for required variables
  const requiredVars = ['MONGODB_URI', 'JWT_SECRET'];
  let missingVars = [];

  requiredVars.forEach(varName => {
    if (!envContent.includes(`${varName}=`)) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.log(`\n❌ Missing required variables: ${missingVars.join(', ')}`);
    console.log('💡 Please add these variables to your .env file');
  } else {
    console.log('\n✅ All required variables found in .env');
  }

  // Test environment loading
  console.log('\n🔍 Testing environment loading...');
  require('dotenv').config({ path: envPath });

  console.log('Environment variables loaded:');
  console.log(`- MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Present' : '❌ Missing'}`);
  console.log(`- JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Present' : '❌ Missing'}`);
  console.log(`- NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);

  if (process.env.MONGODB_URI && process.env.JWT_SECRET) {
    console.log('\n🎉 Environment setup looks good!');
    console.log('💡 Try running: npm run troubleshoot');
  } else {
    console.log('\n❌ Environment variables not loading properly.');
    console.log('💡 Make sure your .env file has the correct format:');
    console.log('   VARIABLE_NAME=value');
    console.log('   (no spaces around =, no quotes unless needed)');
  }

} catch (error) {
  console.error('❌ Error reading .env file:', error.message);
}
