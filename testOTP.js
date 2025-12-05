const mongoose = require('mongoose');
const authService = require('./services/authService');
require('dotenv').config();

// Test OTP integration
async function testOTPIntegration() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Test data - use an existing user email from your database
    const testEmail = 'test@example.com'; // Replace with actual test email

    console.log('\n📧 Testing OTP Send...');
    try {
      const sendResult = await authService.sendOTP(testEmail);
      console.log('✅ OTP Send Result:', sendResult);
    } catch (error) {
      console.log('❌ OTP Send Error:', error.message);
    }

    console.log('\n🔍 Testing OTP Verification...');
    // Note: You'll need the actual OTP from logs to test verification
    const testOTP = '1234'; // Replace with actual OTP from console
    try {
      const verifyResult = await authService.verifyOTP(testEmail, testOTP);
      console.log('✅ OTP Verification Result:', verifyResult);
    } catch (error) {
      console.log('❌ OTP Verification Error:', error.message);
    }

    console.log('\n🎉 OTP Integration Test Complete!');
  } catch (error) {
    console.error('❌ Test Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run test if called directly
if (require.main === module) {
  testOTPIntegration();
}

module.exports = { testOTPIntegration };
