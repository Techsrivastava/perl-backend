# 🎓 University Management System - Backend API

Complete Node.js + Express + MongoDB backend for the University Management System.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Models](#models)
- [Running the Server](#running-the-server)

---

## ✨ Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (University, Consultant, Superadmin)
  - Secure password hashing with bcrypt

- **University Management**
  - CRUD operations for universities
  - Course and stream management
  - Student application tracking

- **Consultancy Management**
  - Consultant profiles
  - Commission tracking (percentage, flat, one-time)
  - Student referral management

- **Student Management**
  - Student profiles and applications
  - Document uploads
  - Admission status tracking

- **Commission System**
  - Automated commission calculation
  - Transaction tracking
  - Payment status management

- **Advanced Features**
  - Pagination and filtering
  - Search functionality
  - Error handling
  - Input validation
  - Security middleware (Helmet, CORS)

---

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Security**: 
  - bcryptjs (password hashing)
  - helmet (security headers)
  - cors (cross-origin resource sharing)
- **Dev Tools**: nodemon

---

## 📁 Project Structure

```
Perl_Backend/
├── models/              # Mongoose schemas
│   ├── User.js
│   ├── University.js
│   ├── Consultancy.js
│   ├── Course.js
│   ├── Stream.js
│   ├── Student.js
│   ├── Commission.js
│   └── Admission.js
├── routes/              # API routes
│   ├── auth.js
│   ├── universities.js
│   ├── consultancies.js
│   ├── students.js
│   ├── courses.js
│   ├── streams.js
│   ├── commissions.js
│   └── admissions.js
├── middleware/          # Custom middleware
│   ├── auth.js
│   ├── errorHandler.js
│   └── validation.js
├── uploads/            # File uploads directory
├── .env.example        # Environment variables template
├── .gitignore
├── package.json
├── server.js           # Entry point
└── README.md
```

---

## 🚀 Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Steps

1. **Navigate to backend directory**
   ```bash
   cd "d:\Flutter Projects\Projects\perl app\Perl_Backend"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see Configuration section)

5. **Start MongoDB** (if using local instance)
   ```bash
   mongod
   ```

6. **Run the server**
   ```bash
   npm run dev
   ```

---

## ⚙️ Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/university_management
# Or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/university_management

# JWT Configuration
JWT_SECRET=your_secret_key_here_change_in_production
JWT_EXPIRE=7d

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

### Environment Variables Explained

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment (development/production) | development |
| `MONGODB_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | Secret key for JWT | Required |
| `JWT_EXPIRE` | JWT expiration time | 7d |

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Response Format

All API responses follow this format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

---

## 🔐 Authentication

The system supports both traditional password-based login and modern OTP-based authentication.

### Register

**POST** `/api/auth/register`

```json
{
  "email": "university@example.com",
  "password": "password123",
  "name": "Sample University",
  "phone": "+91 9876543210",
  "role": "university",
  "abbreviation": "SU",
  "establishedYear": 2000,
  "type": "Private",
  "description": "Sample university description",
  "address": "123 Main St, City"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "email": "university@example.com",
      "name": "Sample University",
      "role": "university"
    }
  }
}
```

### Send OTP (Email Verification)

**POST** `/api/auth/send-otp`

Send a 4-digit OTP to the user's email for verification.

```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

**Notes:**
- OTP is valid for 10 minutes
- Check server console for OTP value (in development)
- In production, integrate with email service (SendGrid, Nodemailer, etc.)

### Verify OTP & Login

**POST** `/api/auth/verify-otp`

Verify the OTP and authenticate the user.

```json
{
  "email": "user@example.com",
  "otp": "1234"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "email": "user@example.com",
      "name": "User Name",
      "role": "university",
      "universityId": "...",
      "consultancyId": "..."
    }
  }
}
```

### Traditional Login

**POST** `/api/auth/login`

```json
{
  "email": "university@example.com",
  "password": "password123"
}
```

### Get Current User

**GET** `/api/auth/me`

Headers:
```
Authorization: Bearer <token>
```

### Update Password

**PUT** `/api/auth/update-password`

```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

### OTP Authentication Flow

```mermaid
graph TD
    A[User enters email] --> B[App calls /auth/send-otp]
    B --> C[Backend generates 4-digit OTP]
    C --> D[OTP stored in database with expiry]
    D --> E[OTP sent to user's email]
    E --> F[User receives OTP]
    F --> G[User enters OTP in app]
    G --> H[App calls /auth/verify-otp]
    H --> I{OTP Valid?}
    I -->|Yes| J[JWT Token generated]
    I -->|No| K[Error: Invalid/Expired OTP]
    J --> L[User authenticated]
    K --> M[Retry or Resend OTP]
```

---

## 🔧 Micro-Level Integration Details

### Backend Architecture Flow

#### 1. User Model Extensions
```javascript
// models/User.js - OTP Fields Added
{
  otp: {
    type: String,
    select: false, // Hidden by default
  },
  otpExpires: {
    type: Date,
    select: false, // Hidden by default
  }
}

// Instance Methods Added
userSchema.methods.generateOTP() // Returns 4-digit OTP
userSchema.methods.verifyOTP(otp) // Returns boolean
```

#### 2. Service Layer (authService.js)
```javascript
// OTP Generation & Verification Logic
async sendOTP(email) {
  // 1. Find user
  // 2. Generate OTP using user.generateOTP()
  // 3. Save to database
  // 4. Log OTP (development) / Send email (production)
  // 5. Return success response
}

async verifyOTP(email, otp) {
  // 1. Find user with OTP fields selected
  // 2. Verify OTP using user.verifyOTP(otp)
  // 3. Clear OTP fields after successful verification
  // 4. Generate JWT token
  // 5. Return token and user data
}
```

#### 3. Controller Layer (authController.js)
```javascript
// Request/Response Handling
async sendOTP(req, res, next) {
  const { email } = req.body;
  const result = await authService.sendOTP(email);
  res.json({ success: true, message: result.message });
}

async verifyOTP(req, res, next) {
  const { email, otp } = req.body;
  const result = await authService.verifyOTP(email, otp);
  res.json({
    success: true,
    message: 'OTP verified successfully',
    data: result
  });
}
```

#### 4. Route Layer (auth.js)
```javascript
// Validation & Routing
router.post('/send-otp', [
  body('email').isEmail().withMessage('Valid email required'),
], validate, authController.sendOTP);

router.post('/verify-otp', [
  body('email').isEmail().withMessage('Valid email required'),
  body('otp').isLength({ min: 4, max: 4 }).withMessage('OTP must be 4 digits'),
], validate, authController.verifyOTP);
```

### Frontend Integration Points

#### 1. API Service (api_service.dart)
```dart
// Base Configuration
const String baseUrl = 'http://localhost:5000/api';

// HTTP Methods
Future<Map<String, dynamic>> post(String endpoint, Map<String, dynamic> data)
Future<Map<String, dynamic>> get(String endpoint)
```

#### 2. Auth Service (auth_api_service.dart)
```dart
// OTP Methods
Future<Map<String, dynamic>> sendOTP(String email) async {
  return await ApiService.post('/auth/send-otp', {'email': email});
}

Future<Map<String, dynamic>> verifyOTP(String email, String otp) async {
  return await ApiService.post('/auth/verify-otp', {'email': email, 'otp': otp});
}
```

#### 3. UI Integration (login_screen.dart & verification_screen.dart)
```dart
// Login Screen
void _handleLogin() async {
  final result = await AuthApiService.sendOTP(email);
  if (result['success']) {
    Navigator.push(context, MaterialPageRoute(
      builder: (context) => VerificationScreen(email: email),
    ));
  }
}

// Verification Screen
void _handleVerification() async {
  final result = await AuthApiService.verifyOTP(widget.email, otp);
  if (result['success']) {
    // Navigate to main app with JWT token
    final token = result['data']['token'];
    await ApiService.setToken(token);
  }
}
```

### Database Schema Updates

#### User Collection Changes
```javascript
// Before OTP Integration
{
  email: "user@example.com",
  password: "hashed_password",
  role: "university",
  // ... other fields
}

// After OTP Integration
{
  email: "user@example.com",
  password: "hashed_password",
  role: "university",
  otp: "1234",           // 4-digit code (hidden by default)
  otpExpires: ISODate(), // Expiry timestamp (hidden by default)
  // ... other fields
}
```

### Security Considerations

#### 1. OTP Security Features
- **4-digit numeric codes**: Easy to enter, hard to guess
- **10-minute expiry**: Prevents replay attacks
- **One-time use**: OTP cleared after verification
- **Database encryption**: OTP fields are hidden by default
- **Rate limiting**: Consider implementing request limits

#### 2. JWT Token Security
- **Secure storage**: Tokens stored in SharedPreferences
- **Auto-inclusion**: All API calls include Bearer token
- **Expiration handling**: 7-day token expiry
- **Role-based access**: Different permissions per user type

### Error Handling Flow

#### Backend Error Responses
```javascript
// Validation Errors
{ success: false, message: "Please provide a valid email" }

// User Not Found
{ success: false, message: "User not found with this email" }

// Invalid OTP
{ success: false, message: "Invalid or expired OTP" }

// Account Issues
{ success: false, message: "Account is deactivated" }
```

#### Frontend Error Handling
```dart
try {
  final result = await AuthApiService.sendOTP(email);
  if (result['success']) {
    // Success flow
  } else {
    // Handle API error
    _showError(result['message']);
  }
} catch (e) {
  // Handle network/server errors
  _showError('Network error: $e');
}
```

### Testing Integration

#### 1. Backend Testing Scripts
```bash
# Run OTP integration test
node testCompleteOTPIntegration.js

# Run Flutter simulation test
node testFlutterIntegration.js

# Run basic OTP test
node testOTP.js
```

#### 2. Manual Testing Steps
1. **Start Backend**: `npm run dev`
2. **Register User**: POST `/api/auth/register`
3. **Send OTP**: POST `/api/auth/send-otp`
4. **Check Console**: Copy OTP from server logs
5. **Verify OTP**: POST `/api/auth/verify-otp`
6. **Check Token**: Verify JWT token received

### Production Deployment Checklist

#### 1. Email Service Integration
```javascript
// Replace console.log with email service
const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send OTP email
await transporter.sendMail({
  to: email,
  subject: 'Your OTP Code',
  text: `Your verification code is: ${otp}`
});
```

#### 2. Environment Variables
```env
# Add to .env
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Security
OTP_EXPIRY_MINUTES=10
MAX_OTP_ATTEMPTS=5
```

#### 3. Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

// OTP rate limiting
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 OTP requests per windowMs
  message: 'Too many OTP requests, please try again later'
});

app.use('/api/auth/send-otp', otpLimiter);
```

### Performance Optimizations

#### 1. Database Indexing
```javascript
// Ensure email index exists
User.collection.createIndex({ email: 1 }, { unique: true });

// OTP expiry index for cleanup
User.collection.createIndex(
  { otpExpires: 1 },
  { expireAfterSeconds: 0 } // TTL index
);
```

#### 2. Caching Strategy
- **OTP Storage**: MongoDB with TTL index
- **User Sessions**: Redis (future enhancement)
- **Email Templates**: Pre-compiled templates

### Monitoring & Logging

#### 1. OTP Events Logging
```javascript
// Log OTP events
logger.info(`OTP sent to ${email}: ${otp}`);
logger.info(`OTP verified for ${email}`);
logger.warn(`Failed OTP attempt for ${email}`);
```

#### 2. Metrics to Track
- OTP generation success rate
- OTP verification success rate
- Average OTP verification time
- Failed attempt patterns

---

## 🔧 Environment Setup & Troubleshooting

### Quick Setup

```bash
# 1. Install dependencies
npm install

# 2. Setup environment file
npm run fix-env
# OR manually: cp .env.example .env

# 3. Edit .env with your actual values
# (Required: MONGODB_URI, JWT_SECRET)

# 4. Test database connection
npm run test-db

# 5. Run troubleshooting
npm run troubleshoot

# 6. Start server
npm run dev  # development
npm start    # production
```

### Environment Variables

**Required Variables:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_super_secure_jwt_secret_here
```

**Optional Variables:**
```env
PORT=5000
NODE_ENV=development
MAX_FILE_SIZE=5242880
OTP_EXPIRY_MINUTES=10
```

### Common Issues & Solutions

#### ❌ "MongoDB Connection Error: The `uri` parameter must be a string, got 'undefined'"

**Solutions:**
1. **Check .env file exists:**
   ```bash
   npm run fix-env
   ```

2. **Verify MONGODB_URI format:**
   ```bash
   npm run test-db
   ```

3. **Manual .env setup:**
   ```bash
   # Copy example file
   cp .env.example .env

   # Edit with your values
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
   ```

#### ❌ "npm warn config production Use `--omit=dev` instead"

**Solution:** This is just a warning, doesn't affect functionality. The app will work fine.

#### ❌ "Authentication failed" (MongoDB)

**Solutions:**
- Check username/password in MongoDB Atlas
- Verify IP whitelist includes your IP
- Ensure database user has read/write permissions

#### ❌ "getaddrinfo ENOTFOUND"

**Solutions:**
- Check internet connection
- Verify MongoDB Atlas cluster URL
- Ensure cluster is running

### GitHub Setup

**Important:** Never commit sensitive data to GitHub!

1. **.env is already in .gitignore** ✅
2. **Use .env.example as template:**
   ```bash
   # Copy to .env and fill with real values
   cp .env.example .env
   ```
3. **Before pushing to GitHub:**
   - Ensure .env is not tracked: `git status`
   - If accidentally added: `git rm --cached .env`

### Available Scripts

```bash
npm run setup        # Install deps and setup instructions
npm run dev          # Start development server (nodemon)
npm start            # Start production server
npm run test-db      # Test MongoDB connection
npm run troubleshoot # Full system check
npm run fix-env      # Create/fix .env file
npm run check-env    # Check NODE_ENV setting
npm run prod:check   # Check production environment setup
npm run docker:build # Build Docker image
npm run docker:run   # Run Docker container
npm run docker:up    # Start with docker-compose
npm run docker:logs  # View Docker logs
```

### Production Deployment

```bash
# 1. Set production environment
echo "NODE_ENV=production" >> .env

# 2. Use production MongoDB URI
# Edit .env with production database URL

# 3. Start production server
npm start
```

### Health Check

Once server is running, check health:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "environment": "production",
  "uptime": 123.456
}
```

---

## 🧪 Testing Scripts

```bash
# Complete integration test
node testCompleteOTPIntegration.js

# Flutter API simulation
node testFlutterIntegration.js

# Basic OTP functionality
node testOTP.js
```

All tests validate the complete flow from database operations to API responses.

### Get All Universities

**GET** `/api/universities`

Query Parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search by name or abbreviation
- `type` - Filter by type (Government, Private, Deemed, Autonomous)
- `isActive` - Filter by active status (true/false)

### Get Single University

**GET** `/api/universities/:id`

### Create University

**POST** `/api/universities`

🔒 Auth Required: `university` or `superadmin`

```json
{
  "name": "University Name",
  "abbreviation": "UN",
  "establishedYear": 2000,
  "type": "Private",
  "contactEmail": "contact@university.com",
  "contactPhone": "+91 9876543210",
  "address": "123 Main St",
  "description": "University description",
  "facilities": ["Library", "Labs", "Hostel"],
  "bankName": "Bank Name",
  "accountNumber": "1234567890",
  "ifscCode": "BANK0001234",
  "branch": "Main Branch"
}
```

### Update University

**PUT** `/api/universities/:id`

🔒 Auth Required: `university` or `superadmin`

### Delete University

**DELETE** `/api/universities/:id`

🔒 Auth Required: `superadmin`

### Get University Statistics

**GET** `/api/universities/:id/stats`

🔒 Auth Required

---

## 👨‍💼 Consultancies API

### Get All Consultancies

**GET** `/api/consultancies`

🔒 Auth Required: `university` or `superadmin`

### Get Single Consultancy

**GET** `/api/consultancies/:id`

🔒 Auth Required

### Create Consultancy

**POST** `/api/consultancies`

🔒 Auth Required: `superadmin`

```json
{
  "name": "Consultancy Name",
  "email": "consultant@example.com",
  "phone": "+91 9876543210",
  "commissionType": "percentage",
  "commissionValue": 10,
  "status": "Active",
  "address": "123 Street",
  "city": "City",
  "state": "State"
}
```

**Commission Types:**
- `percentage` - Percentage of course fees
- `flat` - Fixed amount per student
- `oneTime` - One-time payment

### Update Consultancy

**PUT** `/api/consultancies/:id`

🔒 Auth Required: `consultant` (owner) or `superadmin`

### Get Consultancy Statistics

**GET** `/api/consultancies/:id/stats`

🔒 Auth Required

---

## 👨‍🎓 Students API

### Get All Students

**GET** `/api/students`

🔒 Auth Required

Query Parameters:
- `page`, `limit` - Pagination
- `search` - Search by name, email, phone
- `status` - Filter by status
- `consultancyId` - Filter by consultancy
- `courseId` - Filter by course
- `universityId` - Filter by university

### Get Single Student

**GET** `/api/students/:id`

🔒 Auth Required

### Create Student

**POST** `/api/students`

🔒 Auth Required: `consultant`, `university`, or `superadmin`

```json
{
  "name": "Student Name",
  "email": "student@example.com",
  "phone": "+91 9876543210",
  "courseId": "course_id",
  "consultancyId": "consultancy_id",
  "universityId": "university_id",
  "dateOfBirth": "2000-01-01",
  "gender": "Male",
  "address": "123 Street",
  "city": "City",
  "state": "State",
  "pincode": "123456"
}
```

### Update Student

**PUT** `/api/students/:id`

🔒 Auth Required

### Update Student Status

**PUT** `/api/students/:id/status`

🔒 Auth Required: `university` or `superadmin`

```json
{
  "status": "Approved"
}
```

**Status Options:**
- `Pending`
- `Approved`
- `Rejected`
- `Enrolled`
- `Completed`

---

## 📚 Courses API

### Get All Courses

**GET** `/api/courses`

Query Parameters:
- `page`, `limit` - Pagination
- `search` - Search by name, code, department
- `universityId` - Filter by university
- `degreeType` - Filter by degree type (UG, PG, Diploma, etc.)
- `status` - Filter by status (draft, published)
- `department` - Filter by department

### Get Single Course

**GET** `/api/courses/:id`

### Create Course

**POST** `/api/courses`

🔒 Auth Required: `university` or `superadmin`

```json
{
  "name": "Bachelor of Technology",
  "abbreviation": "B.Tech",
  "code": "BTECH2024",
  "universityId": "university_id",
  "department": "Engineering",
  "degreeType": "UG",
  "duration": "4 Years",
  "fees": 200000,
  "totalSeats": 120,
  "availableSeats": 120,
  "description": "Course description",
  "eligibility": ["12th Pass", "60% minimum"],
  "scholarshipAvailable": true,
  "placementSupport": true
}
```

### Update Course

**PUT** `/api/courses/:id`

🔒 Auth Required: `university` or `superadmin`

### Publish Course

**PUT** `/api/courses/:id/publish`

🔒 Auth Required: `university` or `superadmin`

### Delete Course

**DELETE** `/api/courses/:id`

🔒 Auth Required: `university` or `superadmin`

---

## 🌊 Streams API

### Get All Streams

**GET** `/api/streams`

Query Parameters:
- `courseId` - Filter by course
- `search` - Search by name

### Get Single Stream

**GET** `/api/streams/:id`

### Create Stream

**POST** `/api/streams`

🔒 Auth Required: `university` or `superadmin`

```json
{
  "courseId": "course_id",
  "name": "Computer Science",
  "description": "Stream description",
  "fees": 50000,
  "duration": "4 Years",
  "totalSeats": 60,
  "availableSeats": 60
}
```

### Update Stream

**PUT** `/api/streams/:id`

🔒 Auth Required: `university` or `superadmin`

### Delete Stream

**DELETE** `/api/streams/:id`

🔒 Auth Required: `university` or `superadmin`

---

## 💰 Commissions API

### Get All Commissions

**GET** `/api/commissions`

🔒 Auth Required

Query Parameters:
- `consultancyId` - Filter by consultancy
- `status` - Filter by status
- `universityId` - Filter by university

### Get Single Commission

**GET** `/api/commissions/:id`

🔒 Auth Required

### Create Commission Transaction

**POST** `/api/commissions`

🔒 Auth Required: `university` or `superadmin`

```json
{
  "consultancyId": "consultancy_id",
  "studentId": "student_id",
  "courseId": "course_id",
  "courseFees": 200000
}
```

*Commission is automatically calculated based on consultancy settings*

### Update Commission Status

**PUT** `/api/commissions/:id/status`

🔒 Auth Required: `university` or `superadmin`

```json
{
  "status": "Paid",
  "paymentReference": "TXN123456",
  "remarks": "Payment completed"
}
```

**Status Options:**
- `Pending`
- `Approved`
- `Paid`
- `Rejected`

### Get Commission Summary

**GET** `/api/commissions/consultancy/:consultancyId/summary`

🔒 Auth Required

---

## 🎓 Admissions API

### Get All Admissions

**GET** `/api/admissions`

🔒 Auth Required

### Get Single Admission

**GET** `/api/admissions/:id`

🔒 Auth Required

### Create Admission

**POST** `/api/admissions`

🔒 Auth Required: `consultant` or `superadmin`

```json
{
  "studentId": "student_id",
  "courseId": "course_id",
  "universityId": "university_id",
  "consultancyId": "consultancy_id",
  "totalFees": 200000
}
```

### Update Admission

**PUT** `/api/admissions/:id`

🔒 Auth Required

### Update Admission Status

**PUT** `/api/admissions/:id/status`

🔒 Auth Required: `university` or `superadmin`

```json
{
  "status": "Accepted",
  "remarks": "Application accepted"
}
```

**Status Options:**
- `Applied`
- `Under Review`
- `Shortlisted`
- `Accepted`
- `Rejected`
- `Waitlisted`

---

## 📊 Models

### User
- email, password, role, name, phone
- universityId / consultancyId (reference)
- isActive, lastLogin

### University
- name, abbreviation, establishedYear, type
- contactEmail, contactPhone, address
- facilities, documents, description
- bankName, accountNumber, ifscCode, branch

### Consultancy
- name, email, phone
- commissionType, commissionValue
- status, studentsCount, totalCommission

### Course
- universityId, name, code, status
- department, degreeType, duration, fees
- totalSeats, availableSeats
- (+ 50+ Indian education-specific fields)

### Stream
- courseId, name, description
- fees, duration, totalSeats

### Student
- name, email, phone
- courseId, consultancyId, universityId
- status, appliedDate, documents
- (+ personal and academic details)

### Commission Transaction
- consultancyId, studentId, courseId, universityId
- commissionType, commissionValue
- courseFees, calculatedCommission
- status, paymentDate, paymentReference

### Admission
- studentId, courseId, universityId, consultancyId
- applicationNumber, status
- totalFees, feesPaid, feesBalance
- documentsVerified, interviewScheduled

---

## 🏃‍♂️ Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Server runs on
```
http://localhost:5000
```

### Test the API
```bash
curl http://localhost:5000
```

**Response:**
```json
{
  "message": "🎓 University Management System API",
  "version": "1.0.0",
  "status": "Running",
  "endpoints": { ... }
}
```

---

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Helmet**: Security headers
- **CORS**: Controlled cross-origin access
- **Input Validation**: express-validator
- **Role-Based Access**: Authorization middleware
- **Error Handling**: Centralized error handler

---

## 🧪 Testing

Use tools like:
- **Postman** - API testing
- **Thunder Client** - VS Code extension
- **curl** - Command line

---

## 📝 Notes

- MongoDB must be running before starting the server
- Change JWT_SECRET in production
- Create `.env` from `.env.example`
- Default port is 5000
- All dates are in ISO 8601 format
- Pagination defaults: page=1, limit=10

---

## 🚀 Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Use strong JWT_SECRET
3. Configure MongoDB Atlas connection
4. Set appropriate CORS origins

### Recommended Platforms
- **Heroku**
- **AWS EC2**
- **DigitalOcean**
- **Render**
- **Railway**

---

## 📞 Support

For issues or questions, contact the development team.

---

## 📄 License

ISC

---

**Built with ❤️ using Node.js, Express, and MongoDB**
