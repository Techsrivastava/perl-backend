#!/usr/bin/env node

// Quick Health Check Test
console.log('🏥 Testing Health Endpoint\n');

// Simulate the health endpoint response
const healthResponse = {
  status: 'OK',
  timestamp: new Date().toISOString(),
  environment: process.env.NODE_ENV || 'development',
  uptime: process.uptime()
};

console.log('Expected /health response:');
console.log(JSON.stringify(healthResponse, null, 2));

console.log('\n✅ Health endpoint should return this JSON when working correctly.');
console.log('💡 Test with: curl http://localhost:5000/health');

console.log('\n🔧 To start server:');
console.log('- Development: npm run dev');
console.log('- Production: npm start');

console.log('\n📋 Environment Status:');
console.log(`- NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log(`- MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Set' : '❌ Missing'}`);
console.log(`- JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Set' : '❌ Missing'}`);
console.log(`- PORT: ${process.env.PORT || '5000 (default)'}`);
