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

### Login

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

---

## 🏫 Universities API

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
