const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

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
const uploadRoutes = require('./routes/uploads');
require('dotenv').config();

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Initialize app
const app = express();

// Security & Performance Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(morgan('dev'));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime()
  });
});

// Database Connection
const MONGODB_URI = 'mongodb+srv://adarsh00761_db_user:rx5cnAW82lYqryfm@cluster0.elgdwtk.mongodb.net/?appName=Cluster0';
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// Routes
app.get('/', (req, res) => {
  res.json({
    message: '🎓 University Management System API',
    version: '1.0.0',
    status: 'Running',
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
      uploads: '/api/uploads',
      expenses: '/api/expenses',
      dashboard: '/api/dashboard',
    },
  });
});

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
app.use('/api/uploads', uploadRoutes);

// Error Handler (must be last)
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  process.exit(1);
});
