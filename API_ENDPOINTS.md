# 📋 API Endpoints Reference

Quick reference for all available API endpoints.

Base URL: `https://perl-backend-env.up.railway.app/api`

---

## 🔐 Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register new user |
| POST | `/auth/login` | No | User login |
| GET | `/auth/me` | Yes | Get current user |
| PUT | `/auth/update-password` | Yes | Update password |

---

## 🏫 Universities

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/universities` | No | - | Get all universities |
| GET | `/universities/:id` | No | - | Get single university |
| POST | `/universities` | Yes | University, Superadmin | Create university |
| PUT | `/universities/:id` | Yes | University, Superadmin | Update university |
| DELETE | `/universities/:id` | Yes | Superadmin | Delete university |
| GET | `/universities/:id/stats` | Yes | Any | Get university stats |

---

## 👨‍💼 Consultancies

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/consultancies` | Yes | University, Superadmin | Get all consultancies |
| GET | `/consultancies/:id` | Yes | Any | Get single consultancy |
| POST | `/consultancies` | Yes | Superadmin | Create consultancy |
| PUT | `/consultancies/:id` | Yes | Consultant, Superadmin | Update consultancy |
| DELETE | `/consultancies/:id` | Yes | Superadmin | Delete consultancy |
| GET | `/consultancies/:id/stats` | Yes | Any | Get consultancy stats |

---

## 👨‍🎓 Students

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/students` | Yes | Any | Get all students (filtered by role) |
| GET | `/students/:id` | Yes | Any | Get single student |
| POST | `/students` | Yes | Consultant, University, Superadmin | Create student |
| PUT | `/students/:id` | Yes | Any | Update student |
| PUT | `/students/:id/status` | Yes | University, Superadmin | Update student status |
| DELETE | `/students/:id` | Yes | Superadmin | Delete student |

---

## 📚 Courses

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/courses` | No | - | Get all courses |
| GET | `/courses/:id` | No | - | Get single course |
| POST | `/courses` | Yes | University, Superadmin | Create course |
| PUT | `/courses/:id` | Yes | University, Superadmin | Update course |
| PUT | `/courses/:id/publish` | Yes | University, Superadmin | Publish course |
| DELETE | `/courses/:id` | Yes | University, Superadmin | Delete course |

---

## 🌊 Streams

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/streams` | No | - | Get all streams |
| GET | `/streams/:id` | No | - | Get single stream |
| POST | `/streams` | Yes | University, Superadmin | Create stream |
| PUT | `/streams/:id` | Yes | University, Superadmin | Update stream |
| DELETE | `/streams/:id` | Yes | University, Superadmin | Delete stream |

---

## 💰 Commissions

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/commissions` | Yes | Any | Get all commissions (filtered by role) |
| GET | `/commissions/:id` | Yes | Any | Get single commission |
| POST | `/commissions` | Yes | University, Superadmin | Create commission |
| PUT | `/commissions/:id/status` | Yes | University, Superadmin | Update commission status |
| GET | `/commissions/consultancy/:id/summary` | Yes | Any | Get commission summary |

---

## 🎓 Admissions

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/admissions` | Yes | Any | Get all admissions (filtered by role) |
| GET | `/admissions/:id` | Yes | Any | Get single admission |
| POST | `/admissions` | Yes | Consultant, Superadmin | Create admission |
| PUT | `/admissions/:id` | Yes | Any | Update admission |
| PUT | `/admissions/:id/status` | Yes | University, Superadmin | Update admission status |
| DELETE | `/admissions/:id` | Yes | Superadmin | Delete admission |

---

## 📊 Query Parameters

### Pagination (All GET list endpoints)
```
?page=1&limit=10
```

### Universities
```
?search=name
?type=Government|Private|Deemed|Autonomous
?isActive=true|false
```

### Consultancies
```
?search=name
?status=Active|Inactive|Suspended
```

### Students
```
?search=name|email|phone
?status=Pending|Approved|Rejected|Enrolled|Completed
?consultancyId=id
?courseId=id
?universityId=id
```

### Courses
```
?search=name|code|department
?universityId=id
?degreeType=UG|PG|Diploma|Certificate|PhD
?status=draft|published
?isActive=true|false
?department=name
```

### Streams
```
?courseId=id
?search=name
?isActive=true|false
```

### Commissions
```
?consultancyId=id
?status=Pending|Approved|Paid|Rejected
?universityId=id
```

### Admissions
```
?status=Applied|Under Review|Shortlisted|Accepted|Rejected|Waitlisted
?universityId=id
?consultancyId=id
?studentId=id
```

---

## 🔑 Authentication Header

All protected routes require:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Success with Pagination
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "total": 100,
    "page": 1,
    "pages": 10
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

---

## 🎯 Status Enums

### Student Status
- `Pending`
- `Approved`
- `Rejected`
- `Enrolled`
- `Completed`

### Commission Status
- `Pending`
- `Approved`
- `Paid`
- `Rejected`

### Admission Status
- `Applied`
- `Under Review`
- `Shortlisted`
- `Accepted`
- `Rejected`
- `Waitlisted`

### Consultancy Status
- `Active`
- `Inactive`
- `Suspended`

### Course Status
- `draft`
- `published`

### User Roles
- `university`
- `consultant`
- `superadmin`

### Commission Types
- `percentage` - Percentage of course fees
- `flat` - Fixed amount per student
- `oneTime` - One-time payment

### Degree Types
- `UG` - Undergraduate
- `PG` - Postgraduate
- `Diploma`
- `Certificate`
- `PhD`

### University Types
- `Government`
- `Private`
- `Deemed`
- `Autonomous`

---

## 📌 Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (not logged in) |
| 403 | Forbidden (no permission) |
| 404 | Not Found |
| 500 | Server Error |

---

## 📚 Full API Documentation (Models + Endpoints)

Base URL: `http://localhost:5000/api`

### 🔑 Auth

Protected endpoints require:
```
Authorization: Bearer <token>
```

Supported roles:
- `superadmin`
- `university`
- `consultant`
- `agent` (used in routes, note: not included in `User` role enum currently)

---

## 🧩 Data Models (MongoDB / Mongoose)

### 1) User (`models/User.js`)

**Collection:** `users`

**Fields**
- `email` (String, required, unique, lowercase)
- `password` (String, required, min 6, `select: false`)
- `role` (String, required, enum: `university | consultant | superadmin`)
- `name` (String, required)
- `phone` (String, required)
- `isActive` (Boolean, default `true`)
- `lastLogin` (Date)
- `universityId` (ObjectId -> `University`)
- `consultancyId` (ObjectId -> `Consultancy`)
- `otp` (String, hidden)
- `otpExpires` (Date, hidden)

**Notes**
- Password hash: `pre('save')` bcrypt.
- OTP: 4 digits, 10 minutes expiry.

---

### 2) University (`models/University.js`)

**Fields (selected)**
- `name` (required)
- `abbreviation` (required, uppercase)
- `establishedYear` (required)
- `type` (required enum: `Government | Private | Deemed | Autonomous`)
- `facilities` (String[])
- `documents` (String[])
- `description` (required)
- `contactEmail` (required)
- `contactPhone` (required)
- `address` (required)
- Bank: `bankName`, `accountNumber`, `ifscCode`, `branch`
- `isActive` (Boolean, default `true`)

Indexes:
- Text index on `name`, `abbreviation`

---

### 3) Consultancy (`models/Consultancy.js`)

**Fields (selected)**
- `name` (required)
- `email` (required, unique)
- `phone` (required)
- `commissionType` (enum: `percentage | flat | oneTime`, default `percentage`)
- `commissionValue` (Number, required)
- `status` (enum: `Active | Inactive | Suspended`, default `Active`)
- `studentsCount` (Number, default `0`)
- `totalCommission` (Number, default `0`)
- Address: `address`, `city`, `state`, `pincode`
- `documents[]` objects: `{ name, url, uploadedAt }`
- `isActive` (Boolean, default `true`)

**File storage usage**
- `documents[].url` should store a URL returned by `POST /api/uploads`

Indexes:
- Text index on `name`, `email`

---

### 4) Course (`models/Course.js`)

**Relations**
- `universityId` (ObjectId -> `University`, optional)
- `universityIds[]` (ObjectId[] -> `University`, optional, supports multiple university mappings)

**Fields (selected)**
- `name` (required)
- `abbreviation`
- `code` (required, unique)
- `status` (enum: `draft | published`, default `draft`)
- `department`
- `degreeType` (enum: `UG | PG | Diploma | Certificate | PhD`)
- `duration`
- `modeOfStudy` (enum: `Regular | Distance | Online | Part-time`, default `Regular`)
- `fees`, `totalSeats`, `availableSeats`
- `isActive` (Boolean, default `true`)
- Many additional education-specific fields are present in schema.

Indexes:
- Text: `name`, `code`, `department`
- `universityId`
- `universityIds`

Notes:
- You can create a course without a university and later map it to one or multiple universities by setting `universityIds`.

---

### 5) Stream (`models/Stream.js`)

**Relations**
- `courseId` (ObjectId -> `Course`, required)

**Fields (selected)**
- `name` (required)
- `description`, `fees`, `duration`, `eligibility[]`
- `totalSeats`, `availableSeats`
- `specialization`
- `isActive` (default `true`)

---

### 6) Student (`models/Student.js`)

**Relations**
- `courseId` (ObjectId -> `Course`, required)
- `consultancyId` (ObjectId -> `Consultancy`, required)
- `universityId` (ObjectId -> `University`, required)

**Fields (selected)**
- `name`, `email`, `phone` (required)
- `status` (enum: `Pending | Approved | Rejected | Enrolled | Completed`, default `Pending`)
- `appliedDate` (default now)
- `documents[]` objects: `{ name, url, uploadedAt }`
- Personal/academic/admission related fields exist (DOB, gender, address, previousQualification, etc.)

**File storage usage**
- `documents[].url` should store a URL returned by `POST /api/uploads` (example: `/uploads/<filename>`)

---

### 7) Admission (`models/Admission.js`)

**Relations**
- `studentId` -> `Student` (required)
- `courseId` -> `Course` (required)
- `universityId` -> `University` (required)
- `consultancyId` -> `Consultancy` (required)

**Fields (selected)**
- `applicationNumber` (unique, auto-generated if missing)
- `status` (enum: `Applied | Under Review | Shortlisted | Accepted | Rejected | Waitlisted`)
- Dates: `applicationDate`, `reviewDate`, `decisionDate`, `enrollmentDate`
- Fees: `totalFees`, `feesPaid`, `feesBalance`
- Verification: `documentsVerified`, `documentsRemark`
- Interview/Test: `interviewScheduled`, `interviewDate`, `interviewStatus`, `testScore`
- `remarks`, `assignedCounsellor`

---

### 8) Commission Transaction (`models/Commission.js`)

**Model name:** `CommissionTransaction`

**Relations**
- `consultancyId` -> `Consultancy` (required)
- `studentId` -> `Student` (required)
- `courseId` -> `Course` (required)
- `universityId` -> `University` (required)

**Fields**
- `commissionType` (enum: `percentage | flat | oneTime`)
- `commissionValue` (Number)
- `courseFees` (Number)
- `calculatedCommission` (Number)
- `status` (enum: `Pending | Approved | Paid | Rejected`, default `Pending`)
- `paymentDate`, `paymentReference`, `remarks`
- Denormalized: `studentName`, `courseName`, `consultancyName`

---

### 9) Agent (`models/Agent.js`)

**Relations**
- `consultancy` -> `Consultancy` (required)

**Fields (selected)**
- `name`, `email` (unique), `phone` (required)
- `commissionRate` (0..100)
- `status` (enum: `active | inactive`)
- `walletBalance`, `totalCommissionEarned`
- `isActive` (default true)

---

### 10) Wallet (`models/Wallet.js`)

**Fields**
- `ownerType` (enum: `university | consultancy | agent`)
- `owner` (ObjectId, `refPath: ownerType`)
- `balance` (Number, default 0)
- `transactions[]`: `{ type: credit|debit, amount, reason, reference?, notes?, date }`
- `isActive` (default true)

Index:
- unique `{ ownerType, owner }`

---

### 11) Payment (`models/Payment.js`)

**Relations**
- `admission` -> `Admission` (required)
- `approvedBy` -> `User`

**Fields (selected)**
- `studentName` (required)
- `amount` (required)
- `method` (enum: `UPI | Bank Transfer | Cheque | NEFT | Cash`)
- `status` (enum: `pending | completed | failed`)
- `reference`, `notes`, `proofDocument`
- `approvedAt`

**File storage usage**
- `proofDocument` should store a URL returned by `POST /api/uploads` (example: `/uploads/<filename>`)

---

### 12) Expense (`models/Expense.js`)

**Relations**
- `verifiedBy` -> `User`

**Fields (selected)**
- `category` (enum: Office Rent, Utilities, Marketing, Software, Travel, Training, Legal, Insurance, Equipment, Miscellaneous, Salaries, Commissions)
- `amount` (required)
- `description` (required)
- `date` (default now)
- `status` (enum: `pending | verified | rejected`)
- `receiptUrl`, `verifiedAt`

**File storage usage**
- `receiptUrl` should store a URL returned by `POST /api/uploads`

---

## 🌐 API Modules (Detailed Endpoints)

### A) Authentication (`/auth`)

#### 1. Register
- **POST** `/auth/register`
- **Auth:** Public
- **Body**
  - `email` (required, email)
  - `password` (required, min 6)
  - `name` (required)
  - `phone` (required)
  - `role` (required: `university | consultant`)

**Success (201)**
```json
{ "success": true, "message": "Registration successful", "data": { "token": "...", "user": { "id": "..." } } }
```

#### 2. Login
- **POST** `/auth/login`
- **Auth:** Public
- **Body:** `email`, `password`

#### 3. Current User
- **GET** `/auth/me`
- **Auth:** Private

#### 4. Update Password
- **PUT** `/auth/update-password`
- **Auth:** Private
- **Body:** `currentPassword`, `newPassword`

#### 5. Send OTP
- **POST** `/auth/send-otp`
- **Auth:** Public
- **Body:** `email`

#### 6. Verify OTP
- **POST** `/auth/verify-otp`
- **Auth:** Public
- **Body:** `email`, `otp` (4 digits)

---

### B) Universities (`/universities`)

#### 1. List Universities
- **GET** `/universities`
- **Auth:** Public
- **Query:** `page`, `limit`, `search`, `type`, `isActive`

#### 2. Get University
- **GET** `/universities/:id`
- **Auth:** Public

#### 3. Create University
- **POST** `/universities`
- **Auth:** Private
- **Roles:** `superadmin`, `university`

#### 4. Update University
- **PUT** `/universities/:id`
- **Auth:** Private
- **Roles:** `superadmin`, `university`

#### 5. Delete University
- **DELETE** `/universities/:id`
- **Auth:** Private
- **Roles:** `superadmin`

#### 6. University Stats
- **GET** `/universities/:id/stats`
- **Auth:** Private

---

### C) Consultancies (`/consultancies`)

#### 1. List Consultancies
- **GET** `/consultancies`
- **Auth:** Private
- **Roles:** `university`, `superadmin`
- **Query:** `page`, `limit`, `search`, `status`

#### 2. Get Consultancy
- **GET** `/consultancies/:id`
- **Auth:** Private

#### 3. Create Consultancy
- **POST** `/consultancies`
- **Auth:** Private
- **Roles:** `superadmin`

#### 4. Update Consultancy
- **PUT** `/consultancies/:id`
- **Auth:** Private
- **Notes:** consultant ownership check exists.

#### 5. Delete Consultancy
- **DELETE** `/consultancies/:id`
- **Auth:** Private
- **Roles:** `superadmin`

#### 6. Consultancy Stats
- **GET** `/consultancies/:id/stats`
- **Auth:** Private

---

### D) Students (`/students`)

#### 1. List Students
- **GET** `/students`
- **Auth:** Private
- **Query:** `page`, `limit`, plus service-level filters.

#### 2. Get Student
- **GET** `/students/:id`
- **Auth:** Private

#### 3. Create Student
- **POST** `/students`
- **Auth:** Private
- **Roles:** `consultant`, `university`, `superadmin`

#### 4. Update Student
- **PUT** `/students/:id`
- **Auth:** Private

#### 5. Update Student Status
- **PUT** `/students/:id/status`
- **Auth:** Private
- **Roles:** `university`, `superadmin`
- **Body:** `status` (Student status enum)

#### 6. Delete Student
- **DELETE** `/students/:id`
- **Auth:** Private
- **Roles:** `superadmin`

---

### E) Courses (`/courses`)

#### 1. List Courses
- **GET** `/courses`
- **Auth:** Public
- **Query:** `page`, `limit`, `search`, `universityId`, `degreeType`, `status`, `isActive`, `department`

#### 2. Get Course
- **GET** `/courses/:id`
- **Auth:** Public
- **Response includes:** `streams` for the course.

#### 3. Create Course
- **POST** `/courses`
- **Auth:** Private
- **Roles:** `university`, `superadmin`

#### 4. Update Course
- **PUT** `/courses/:id`
- **Auth:** Private
- **Roles:** `university`, `superadmin`

#### 5. Publish Course
- **PUT** `/courses/:id/publish`
- **Auth:** Private
- **Roles:** `university`, `superadmin`

#### 6. Delete Course
- **DELETE** `/courses/:id`
- **Auth:** Private
- **Roles:** `university`, `superadmin`

---

### F) Streams (`/streams`)

#### 1. List Streams
- **GET** `/streams`
- **Auth:** Public
- **Query:** `page`, `limit`, `courseId`, `search`, `isActive`

#### 2. Get Stream
- **GET** `/streams/:id`
- **Auth:** Public

#### 3. Create Stream
- **POST** `/streams`
- **Auth:** Private
- **Roles:** `superadmin`

#### 4. Update Stream
- **PUT** `/streams/:id`
- **Auth:** Private
- **Roles:** `superadmin`

#### 5. Delete Stream
- **DELETE** `/streams/:id`
- **Auth:** Private
- **Roles:** `superadmin`

#### 6. Streams by Course
- **GET** `/streams/course/:courseId`
- **Auth:** Public

#### 7. Toggle Stream
- **PUT** `/streams/:id/toggle`
- **Auth:** Private
- **Roles:** `superadmin`

#### 8. Stream Statistics
- **GET** `/streams/statistics`
- **Auth:** Private
- **Roles:** `superadmin`

---

### G) Commissions (`/commissions`)

#### 1. List Commission Transactions
- **GET** `/commissions`
- **Auth:** Private
- **Query:** `page`, `limit`, `consultancyId`, `status`, `universityId`
- **Notes:** role-based filtering in controller.

#### 2. Get Commission Transaction
- **GET** `/commissions/:id`
- **Auth:** Private

#### 3. Create Commission Transaction
- **POST** `/commissions`
- **Auth:** Private
- **Roles:** `university`, `superadmin`

#### 4. Update Commission Transaction
- **PUT** `/commissions/:id`
- **Auth:** Private
- **Roles:** `university`, `superadmin`

#### 5. Update Commission Status
- **PUT** `/commissions/:id/status`
- **Auth:** Private
- **Roles:** `superadmin`

#### 6. Delete Commission
- **DELETE** `/commissions/:id`
- **Auth:** Private
- **Roles:** `superadmin`

#### 7. Commission Statistics
- **GET** `/commissions/statistics`
- **Auth:** Private

#### 8. By Consultancy
- **GET** `/commissions/consultancy/:consultancyId`
- **Auth:** Private

#### 9. By University
- **GET** `/commissions/university/:universityId`
- **Auth:** Private

---

### H) Admissions (`/admissions`)

#### 1. List Admissions
- **GET** `/admissions`
- **Auth:** Private
- **Query:** `page`, `limit`, `status`, `universityId`, `consultancyId`, `studentId`
- **Notes:** role-based filtering in controller.

#### 2. Get Admission
- **GET** `/admissions/:id`
- **Auth:** Private

#### 3. Create Admission
- **POST** `/admissions`
- **Auth:** Private
- **Roles:** `university`, `superadmin`

#### 4. Update Admission
- **PUT** `/admissions/:id`
- **Auth:** Private
- **Roles:** `university`, `superadmin`

#### 5. Delete Admission
- **DELETE** `/admissions/:id`
- **Auth:** Private
- **Roles:** `superadmin`

#### 6. Admissions by Student
- **GET** `/admissions/student/:studentId`
- **Auth:** Private

#### 7. Admissions by University
- **GET** `/admissions/university/:universityId`
- **Auth:** Private

#### 8. Admissions by Consultancy
- **GET** `/admissions/consultancy/:consultancyId`
- **Auth:** Private

#### 9. Admission Statistics
- **GET** `/admissions/statistics`
- **Auth:** Private

---

### I) Agents (`/agents`)

All endpoints are **Superadmin only** (as per routes).

- **GET** `/agents`
- **GET** `/agents/:id`
- **POST** `/agents`
- **PUT** `/agents/:id`
- **DELETE** `/agents/:id`
- **GET** `/agents/consultancy/:consultancyId`

---

### J) Wallets (`/wallets`)

- **GET** `/wallets` (Superadmin)
- **GET** `/wallets/:ownerType/:ownerId` (Superadmin)
- **GET** `/wallets/:ownerType/:ownerId/balance` (Superadmin)
- **GET** `/wallets/:ownerType/:ownerId/transactions` (Superadmin)
- **POST** `/wallets/:ownerType/:ownerId/adjust` (Superadmin)
- **POST** `/wallets/transfer` (Superadmin)

---

### K) Payments (`/payments`)

- **GET** `/payments` (Superadmin)
- **GET** `/payments/:id` (Superadmin)
- **POST** `/payments` (Superadmin, Agent)
- **PUT** `/payments/:id` (Superadmin)
- **DELETE** `/payments/:id` (Superadmin)
- **GET** `/payments/admission/:admissionId` (Superadmin)

---

### L) Expenses (`/expenses`)

- **GET** `/expenses` (Superadmin)
- **GET** `/expenses/:id` (Superadmin)
- **POST** `/expenses` (Superadmin)
- **PUT** `/expenses/:id` (Superadmin)
- **DELETE** `/expenses/:id` (Superadmin)
- **GET** `/expenses/stats/summary` (Superadmin)

---

### M) Dashboard (`/dashboard`)

- **GET** `/dashboard` (Superadmin)

---

### N) Uploads (Local Images/PDF) (`/uploads` + `/api/uploads`)

The backend serves local uploaded files via:
- `GET /uploads/<filename>`

#### Upload a file
- **POST** `/api/uploads`
- **Auth:** Public (you can add auth later if needed)
- **Content-Type:** `multipart/form-data`
- **Form field:** `file`
- **Allowed:** images (`image/*`) and PDFs (`application/pdf`)
- **Max size:** controlled by `MAX_FILE_SIZE` env (default 5MB)

**Request (multipart/form-data)**
- `file` (required): the image/pdf to upload

**Example (cURL)**
```bash
curl -X POST "http://localhost:5000/api/uploads" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@./document.pdf"
```

**Success (201)**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "filename": "1734020000000-123456789.pdf",
    "originalName": "document.pdf",
    "mimetype": "application/pdf",
    "size": 12345,
    "url": "/uploads/1734020000000-123456789.pdf"
  }
}
```

**Errors**

**Validation (400)**
```json
{
  "success": false,
  "message": "File is required (field name: file)"
}
```

**Invalid file type (500)**
```json
{
  "success": false,
  "message": "Only image files and PDF files are allowed"
}
```

#### View/download an uploaded file
- **GET** `/uploads/:filename`
- **Auth:** Public

Example:
```text
GET http://localhost:5000/uploads/1734020000000-123456789.pdf
```

**How to store in DB**
- Store `data.url` into your model fields:
  - `Student.documents[].url`
  - `Consultancy.documents[].url`
  - `Payment.proofDocument`
  - `Expense.receiptUrl`

**Quick Tip**: Import `POSTMAN_COLLECTION.json` into Postman for easy testing!
