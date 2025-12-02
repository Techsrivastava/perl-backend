const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    console.log('URI exists:', !!process.env.MONGODB_URI);

    if (!process.env.MONGODB_URI) {
      console.log('❌ MONGODB_URI not found in .env');
      return;
    }

    // Mask password for logging
    const maskedUri = process.env.MONGODB_URI.replace(/:([^:@]{4})[^:@]*@/, ':****@');
    console.log('Connecting to:', maskedUri);

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log('✅ Successfully connected to MongoDB!');
    await mongoose.disconnect();
    console.log('✅ Connection test completed');

  } catch (error) {
    console.error('❌ Connection failed:', error.message);

    if (error.message.includes('authentication failed')) {
      console.log('🔧 Check your username/password in the connection string');
    } else if (error.message.includes('getaddrinfo ENOTFOUND')) {
      console.log('🔧 Check your cluster URL - it might be wrong or the cluster might be paused');
    } else if (error.message.includes('connection timed out')) {
      console.log('🔧 Check network connectivity and MongoDB Atlas IP whitelist');
    } else {
      console.log('🔧 Unknown error - verify your connection string format');
    }
  }
};

testConnection();
