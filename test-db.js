#!/usr/bin/env node

// Test MongoDB connection directly
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load .env file explicitly
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('🧪 MongoDB Connection Test\n');

// Check environment variables
console.log('Environment variables:');
console.log(`- NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`- MONGODB_URI: ${process.env.MONGODB_URI ? 'Present' : 'Missing'}`);
console.log(`- JWT_SECRET: ${process.env.JWT_SECRET ? 'Present' : 'Missing'}`);

if (!process.env.MONGODB_URI) {
  console.error('\n❌ MONGODB_URI is not set!');
  console.log('💡 Make sure your .env file contains:');
  console.log('   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname');
  process.exit(1);
}

console.log('\n🔄 Attempting MongoDB connection...');

// Test connection
const testConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
    });

    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📍 Connected to: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);

    // Close connection
    await mongoose.disconnect();
    console.log('✅ Connection closed successfully');

    console.log('\n🎉 MongoDB connection test PASSED!');
    console.log('💡 Your backend should work now. Try: npm start');

  } catch (error) {
    console.error('\n❌ MongoDB Connection FAILED!');
    console.error(`Error: ${error.message}`);

    if (error.message.includes('authentication failed')) {
      console.log('\n💡 Possible solutions:');
      console.log('1. Check your MongoDB Atlas username/password');
      console.log('2. Verify IP whitelist in MongoDB Atlas');
      console.log('3. Make sure the database user has read/write permissions');
    } else if (error.message.includes('getaddrinfo ENOTFOUND')) {
      console.log('\n💡 Possible solutions:');
      console.log('1. Check your internet connection');
      console.log('2. Verify the cluster URL is correct');
      console.log('3. Make sure MongoDB Atlas cluster is running');
    } else if (error.message.includes('bad auth')) {
      console.log('\n💡 Possible solutions:');
      console.log('1. Double-check username and password');
      console.log('2. Ensure the password doesn\'t contain special characters that need URL encoding');
    }

    process.exit(1);
  }
};

testConnection();
