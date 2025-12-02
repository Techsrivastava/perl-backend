# 🏗️ MVC Architecture Documentation

## Overview

The backend now follows a proper **MVC (Model-View-Controller) architecture** with an additional **Services** layer for better separation of concerns.

---

## 📐 Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENT                            │
│                  (Flutter App / API)                     │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ↓ HTTP Request
┌─────────────────────────────────────────────────────────┐
│                       ROUTES                             │
│   • Define endpoints                                      │
│   • Apply middleware (auth, validation)                   │
│   • Call controllers                                      │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────┐
│                    CONTROLLERS                           │
│   • Handle HTTP requests/responses                        │
│   • Input validation (via middleware)                     │
│   • Call service methods                                  │
│   • Format responses                                      │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────┐
│                     SERVICES                             │
│   • Business logic                                        │
│   • Data processing                                       │
│   • Interact with models                                  │
│   • Validation logic                                      │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────┐
│                      MODELS                              │
│   • Database schemas (Mongoose)                           │
│   • Data structure                                        │
│   • Validation rules                                      │
│   • Model methods                                         │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────┐
│                     DATABASE                             │
│                   (MongoDB)                              │
└─────────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
Perl_Backend/
├── models/              # Database Schemas
│   ├── User.js
│   ├── University.js
│   ├── Consultancy.js
│   ├── Course.js
│   ├── Stream.js
│   ├── Student.js
│   ├── Commission.js
│   └── Admission.js
│
├── services/            # Business Logic Layer (NEW)
│   ├── authService.js
│   ├── universityService.js
│   ├── consultancyService.js
│   ├── studentService.js
│   └── courseService.js
│
├── controllers/         # Request Handlers (NEW)
│   ├── authController.js
│   ├── universityController.js
│   ├── consultancyController.js
│   ├── studentController.js
│   └── courseController.js
│
├── routes/              # Route Definitions (REFACTORED)
│   ├── auth.js          ← Now just defines endpoints
│   ├── universities.js
│   ├── consultancies.js
│   ├── students.js
│   └── courses.js
│
├── middleware/          # Middleware Functions
│   ├── auth.js          ← JWT & authorization
│   ├── errorHandler.js
│   └── validation.js
│
└── server.js            # Application Entry Point
```

---

## 🎯 Layer Responsibilities

### 1️⃣ **Models** (Database Layer)

**Purpose**: Define data structure and interact with MongoDB

**Responsibilities**:
- Define Mongoose schemas
- Data validation rules
- Database methods (save, find, update, delete)
- Pre/post hooks
- Virtual fields

**Example** (`models/University.js`):
```javascript
const universitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'University name is required'],
    trim: true,
  },
  // ... more fields
});

module.exports = mongoose.model('University', universitySchema);
```

---

### 2️⃣ **Services** (Business Logic Layer)

**Purpose**: Handle all business logic and data processing

**Responsibilities**:
- Business logic implementation
- Data manipulation
- Complex queries
- Calculations and validations
- Interact with multiple models
- Return data to controllers

**Example** (`services/universityService.js`):
```javascript
class UniversityService {
  async getAllUniversities(filters = {}) {
    // Business logic for filtering
    const query = {};
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { abbreviation: { $regex: filters.search, $options: 'i' } },
      ];
    }
    
    const universities = await University.find(query);
    return { universities, pagination: {...} };
  }
}

module.exports = new UniversityService();
```

---

### 3️⃣ **Controllers** (Request/Response Handlers)

**Purpose**: Handle HTTP requests and responses

**Responsibilities**:
- Receive HTTP requests
- Extract request data (body, params, query)
- Call appropriate service methods
- Format and send responses
- Handle errors (pass to error middleware)
- **NO business logic here**

**Example** (`controllers/universityController.js`):
```javascript
class UniversityController {
  async getAllUniversities(req, res, next) {
    try {
      const result = await universityService.getAllUniversities(req.query);
      
      res.json({
        success: true,
        data: result.universities,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UniversityController();
```

---

### 4️⃣ **Routes** (Endpoint Definitions)

**Purpose**: Define API endpoints and apply middleware

**Responsibilities**:
- Define HTTP routes (GET, POST, PUT, DELETE)
- Apply authentication middleware
- Apply validation middleware
- Call controller methods
- **NO logic here** - just routing

**Example** (`routes/universities.js`):
```javascript
const router = express.Router();
const universityController = require('../controllers/universityController');
const { protect, authorize } = require('../middleware/auth');

// Clean and simple routing
router.get('/', universityController.getAllUniversities);
router.get('/:id', universityController.getUniversityById);
router.post('/', protect, authorize('superadmin'), universityController.createUniversity);
router.put('/:id', protect, universityController.updateUniversity);
router.delete('/:id', protect, authorize('superadmin'), universityController.deleteUniversity);

module.exports = router;
```

---

## 🔄 Request Flow Example

Let's trace a request: **GET /api/universities?search=MIT**

### Step 1: Route
```javascript
// routes/universities.js
router.get('/', universityController.getAllUniversities);
```
→ Route matches, calls controller

### Step 2: Controller
```javascript
// controllers/universityController.js
async getAllUniversities(req, res, next) {
  try {
    // Extract query parameters
    const result = await universityService.getAllUniversities(req.query);
    
    // Format response
    res.json({
      success: true,
      data: result.universities,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}
```
→ Controller extracts data, calls service, formats response

### Step 3: Service
```javascript
// services/universityService.js
async getAllUniversities(filters = {}) {
  const { search } = filters;
  
  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { abbreviation: { $regex: search, $options: 'i' } },
    ];
  }
  
  // Business logic
  const universities = await University.find(query);
  return { universities, pagination: {...} };
}
```
→ Service processes business logic, queries model

### Step 4: Model
```javascript
// models/University.js
const University = mongoose.model('University', universitySchema);
```
→ Model queries MongoDB and returns data

### Step 5: Response
```json
{
  "success": true,
  "data": [ {...universities...} ],
  "pagination": { "total": 10, "page": 1, "pages": 1 }
}
```

---

## ✅ Benefits of MVC + Services

### 1. **Separation of Concerns**
Each layer has a single responsibility

### 2. **Maintainability**
Easy to locate and modify code
- Need to change business logic? → Edit Service
- Need to change response format? → Edit Controller
- Need to change database schema? → Edit Model

### 3. **Testability**
Each layer can be tested independently
- Test services without HTTP
- Mock services in controller tests
- Test models with test database

### 4. **Reusability**
Services can be reused across different controllers
```javascript
// Reuse service in multiple places
await studentService.getAllStudents(filters, user);
```

### 5. **Scalability**
Easy to add new features
- New endpoint? Add route + controller method
- New business logic? Add service method
- New data? Add model

---

## 📝 Code Examples

### Creating a New Feature (Example: Add Agent Management)

#### 1. Create Model
```javascript
// models/Agent.js
const agentSchema = new mongoose.Schema({
  name: String,
  consultancyId: { type: ObjectId, ref: 'Consultancy' },
  // ...
});
module.exports = mongoose.model('Agent', agentSchema);
```

#### 2. Create Service
```javascript
// services/agentService.js
class AgentService {
  async getAllAgents(consultancyId) {
    return await Agent.find({ consultancyId });
  }
  
  async createAgent(agentData) {
    return await Agent.create(agentData);
  }
}
module.exports = new AgentService();
```

#### 3. Create Controller
```javascript
// controllers/agentController.js
class AgentController {
  async getAllAgents(req, res, next) {
    try {
      const agents = await agentService.getAllAgents(req.user.consultancyId);
      res.json({ success: true, data: agents });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new AgentController();
```

#### 4. Create Routes
```javascript
// routes/agents.js
router.get('/', protect, agentController.getAllAgents);
router.post('/', protect, agentController.createAgent);
```

#### 5. Register Routes
```javascript
// server.js
app.use('/api/agents', agentRoutes);
```

---

## 🎓 Best Practices

### Controllers Should:
✅ Extract data from requests  
✅ Call service methods  
✅ Format responses  
✅ Handle errors  

❌ **NOT** contain business logic  
❌ **NOT** query database directly  
❌ **NOT** do calculations  

### Services Should:
✅ Implement business logic  
✅ Query models  
✅ Process data  
✅ Perform calculations  
✅ Handle complex operations  

❌ **NOT** access req/res objects  
❌ **NOT** format HTTP responses  
❌ **NOT** handle HTTP errors  

### Models Should:
✅ Define schema  
✅ Add validation  
✅ Define indexes  
✅ Add model methods  

❌ **NOT** contain business logic  
❌ **NOT** know about HTTP  

---

## 🚀 Migration Guide

### Old Pattern (Routes with logic)
```javascript
// ❌ OLD - Logic in routes
router.get('/', async (req, res) => {
  const universities = await University.find({...});
  res.json({ data: universities });
});
```

### New Pattern (MVC + Services)
```javascript
// ✅ NEW - Separated concerns

// Route
router.get('/', universityController.getAllUniversities);

// Controller
async getAllUniversities(req, res, next) {
  try {
    const result = await universityService.getAllUniversities(req.query);
    res.json({ success: true, data: result.universities });
  } catch (error) {
    next(error);
  }
}

// Service
async getAllUniversities(filters) {
  const universities = await University.find({...});
  return { universities };
}
```

---

## 📊 Current Implementation Status

### ✅ Completed
- ✅ Auth (routes, controller, service)
- ✅ Universities (routes, controller, service)
- ✅ Students (routes, controller, service)
- ✅ Courses (routes, controller, service)
- ✅ Consultancies (routes, controller, service)

### 🔄 To Be Refactored (if needed)
- Streams
- Commissions
- Admissions

---

## 📚 Further Reading

- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Node.js Design Patterns](https://nodejs.org/en/docs/guides)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

**Your backend now follows industry-standard MVC + Services architecture! 🎉**
