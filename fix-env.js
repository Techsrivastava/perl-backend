#!/usr/bin/env node

// Quick fix for MongoDB connection issues
const fs = require('fs');
const path = require('path');

console.log('🔧 MongoDB Connection Fix Script\n');

// Check current .env file
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

try {
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found. Creating from .env.example...');
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      console.log('✅ Created .env file');
    } else {
      console.error('❌ .env.example not found. Please create .env manually.');
      process.exit(1);
    }
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
