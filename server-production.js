#!/usr/bin/env node

// Production startup script with enhanced error handling
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');

// Load environment variables with explicit path
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Debug environment loading
console.log('🔧 Environment Loading Debug:');
console.log(`  Current Directory: ${__dirname}`);
console.log(`  NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`  MONGODB_URI exists: ${!!process.env.MONGODB_URI}`);
console.log(`  JWT_SECRET exists: ${!!process.env.JWT_SECRET}`);

// Validate critical environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  console.error('💡 Make sure your .env file exists and contains the required variables.');
  console.error('💡 Copy .env.example to .env and fill in your values.');
  process.exit(1);
}

console.log('✅ All required environment variables found');
console.log('🚀 Starting University Management System API...');
console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`🔌 Port: ${process.env.PORT || 5000}`);

try {
  // Import routes
  const authRoutes = require('./routes/auth');
  const universityRoutes = require('./routes/universities');
  const consultancyRoutes = require('./routes/consultancies');
  const studentRoutes = require('./routes/students');
  const courseRoutes = require('./routes/courses');
  const streamRoutes = require('./routes/streams');
  const commissionRoutes = require('./routes/commissions');
  const admissionRoutes = require('./routes/admissions');
  const agentRoutes = require('./routes/agents');
  const paymentRoutes = require('./routes/payments');
  const walletRoutes = require('./routes/wallets');
  const expenseRoutes = require('./routes/expenses');
  const dashboardRoutes = require('./routes/dashboard');

  // Import middleware
  const errorHandler = require('./middleware/errorHandler');

  // Initialize app
  const app = express();

  // Security & Performance Middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for API
    crossOriginEmbedderPolicy: false
  }));
  app.use(compression());
  app.use(cors({
    origin: process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_URL || false
      : true,
    credentials: true
  }));

  // Logging
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined'));
  }

  // Body Parser
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Static files for uploads
  app.use('/uploads', express.static('uploads'));

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      uptime: process.uptime()
    });
  });

  // Main API endpoint
  app.get('/', (req, res) => {
    res.json({
      message: '🎓 University Management System API',
      version: '1.0.0',
      status: 'Running',
      environment: process.env.NODE_ENV,
      endpoints: {
        auth: '/api/auth',
        universities: '/api/universities',
        consultancies: '/api/consultancies',
        students: '/api/students',
        courses: '/api/courses',
        streams: '/api/streams',
        commissions: '/api/commissions',
        admissions: '/api/admissions',
        agents: '/api/agents',
        payments: '/api/payments',
        wallets: '/api/wallets',
        expenses: '/api/expenses',
        dashboard: '/api/dashboard',
      },
    });
  });

  // Database Connection with retry logic
  const connectDB = async (retries = 5) => {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
      console.error(`❌ MongoDB Connection Error: ${error.message}`);
      if (retries > 0) {
        console.log(`🔄 Retrying connection... (${retries} attempts left)`);
        setTimeout(() => connectDB(retries - 1), 5000);
      } else {
        console.error('❌ Failed to connect to MongoDB after multiple attempts');
        process.exit(1);
      }
    }
  };

  connectDB();

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/universities', universityRoutes);
  app.use('/api/consultancies', consultancyRoutes);
  app.use('/api/students', studentRoutes);
  app.use('/api/courses', courseRoutes);
  app.use('/api/streams', streamRoutes);
  app.use('/api/commissions', commissionRoutes);
  app.use('/api/admissions', admissionRoutes);
  app.use('/api/agents', agentRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/wallets', walletRoutes);
  app.use('/api/expenses', expenseRoutes);
  app.use('/api/dashboard', dashboardRoutes);

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found'
    });
  });

  // Error Handler (must be last)
  app.use(errorHandler);

  // Start Server
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('📴 SIGTERM received, shutting down gracefully');
    server.close(() => {
      mongoose.connection.close(false, () => {
        console.log('✅ Process terminated');
        process.exit(0);
      });
    });
  });

  process.on('SIGINT', () => {
    console.log('📴 SIGINT received, shutting down gracefully');
    server.close(() => {
      mongoose.connection.close(false, () => {
        console.log('✅ Process terminated');
        process.exit(0);
      });
    });
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err.message);
    server.close(() => {
      mongoose.connection.close(false, () => {
        process.exit(1);
      });
    });
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err.message);
    server.close(() => {
      mongoose.connection.close(false, () => {
        process.exit(1);
      });
    });
  });

} catch (error) {
  console.error('❌ Fatal Error during startup:', error.message);
  process.exit(1);
}
