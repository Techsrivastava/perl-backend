#!/usr/bin/env node

// Production Troubleshooting Script
console.log('🔍 Production Backend Troubleshooting...\n');

// Check Node.js version
const nodeVersion = process.version;
console.log(`📦 Node.js Version: ${nodeVersion}`);

// Check if we're in production mode
const isProduction = process.env.NODE_ENV === 'production';
console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'} ${isProduction ? '(Production Mode)' : '(Development Mode)'}`);

// Check critical environment variables
console.log('\n🔧 Environment Variables Check:');
const requiredVars = ['MONGODB_URI', 'JWT_SECRET', 'PORT'];
requiredVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✅ Set' : '❌ Missing';
  console.log(`  ${varName}: ${status}`);
  if (!value) {
    console.log(`    💡 Please set ${varName} in your .env file`);
  }
});

// Check MongoDB connection
console.log('\n🗄️  Database Connection Test:');
const mongoose = require('mongoose');

const testDBConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
    });
    console.log('  ✅ MongoDB Connected Successfully');
    await mongoose.disconnect();
    console.log('  ✅ MongoDB Disconnected Successfully');
  } catch (error) {
    console.log('  ❌ MongoDB Connection Failed');
    console.log(`     Error: ${error.message}`);

    if (error.message.includes('authentication failed')) {
      console.log('     💡 Check your MongoDB credentials in MONGODB_URI');
    } else if (error.message.includes('getaddrinfo ENOTFOUND')) {
      console.log('     💡 Check your MongoDB connection string/URL');
    }
  }
};

// Check file system
console.log('\n📁 File System Check:');
const fs = require('fs');
const path = require('path');

const checkDirectories = ['uploads', 'middleware', 'models', 'routes', 'controllers', 'services'];

checkDirectories.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  try {
    const stats = fs.statSync(dirPath);
    if (stats.isDirectory()) {
      console.log(`  ✅ ${dir}/ directory exists`);
    } else {
      console.log(`  ❌ ${dir} is not a directory`);
    }
  } catch (error) {
    console.log(`  ❌ ${dir}/ directory missing`);
  }
});

// Check critical files
console.log('\n📄 Critical Files Check:');
const criticalFiles = ['server-production.js', 'server.js', 'package.json'];

criticalFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  try {
    fs.accessSync(filePath, fs.constants.R_OK);
    console.log(`  ✅ ${file} exists and is readable`);
  } catch (error) {
    console.log(`  ❌ ${file} missing or not readable`);
  }
});

// Check dependencies
console.log('\n📦 Dependencies Check:');
try {
  const packageJson = require('./package.json');
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

  const criticalDeps = ['express', 'mongoose', 'dotenv', 'jsonwebtoken', 'bcryptjs'];
  criticalDeps.forEach(dep => {
    if (deps[dep]) {
      console.log(`  ✅ ${dep} is listed in package.json`);
    } else {
      console.log(`  ❌ ${dep} is missing from package.json`);
    }
  });
} catch (error) {
  console.log('  ❌ Cannot read package.json');
}

// Port check
console.log('\n🔌 Port Availability Check:');
const net = require('net');
const port = process.env.PORT || 5000;

const checkPort = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close();
      resolve(true);
    });
    server.on('error', () => {
      resolve(false);
    });
  });
};

checkPort(port).then(available => {
  if (available) {
    console.log(`  ✅ Port ${port} is available`);
  } else {
    console.log(`  ❌ Port ${port} is already in use`);
  }

  // Run database test
  testDBConnection().then(() => {
    console.log('\n🎯 Troubleshooting Complete!');
    console.log('\n📋 Quick Fix Commands:');
    console.log('  1. Install dependencies: npm install');
    console.log('  2. Start development server: npm run dev');
    console.log('  3. Start production server: npm start');
    console.log('  4. Check server health: curl http://localhost:5000/health');

    if (!isProduction) {
      console.log('\n⚠️  Note: You are in development mode. For production, set NODE_ENV=production');
    }
  });
});
