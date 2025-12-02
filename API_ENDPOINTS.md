# 📋 API Endpoints Reference

Quick reference for all available API endpoints.

Base URL: `http://localhost:5000/api`

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

**Quick Tip**: Import `POSTMAN_COLLECTION.json` into Postman for easy testing!
