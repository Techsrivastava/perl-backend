# 🚀 Quick Start Guide

Get your University Management System backend up and running in 5 minutes!

## Prerequisites

Before you begin, ensure you have:
- ✅ Node.js (v14+) installed
- ✅ MongoDB installed (local or Atlas account)
- ✅ npm or yarn installed

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd "d:\Flutter Projects\Projects\perl app\Perl_Backend"
npm install
```

### 2. Configure Environment

Create a `.env` file:

```bash
# Create .env in project root and add variables
```

Edit `.env` and update these values:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/university_management
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=7d
```

#### Using MongoDB Atlas (Cloud)?

Replace `MONGODB_URI` with:
```
mongodb+srv://username:password@cluster.mongodb.net/university_management
```

### 3. Start MongoDB (if using local)

```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

### 4. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

### 5. Verify Installation

Open your browser or use curl:

```bash
curl http://localhost:5000
```

You should see:
```json
{
  "message": "🎓 University Management System API",
  "version": "1.0.0",
  "status": "Running"
}
```

## 🎯 Quick API Test

### 1. Register a University

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "university@example.com",
    "password": "password123",
    "name": "Sample University",
    "phone": "+91 9876543210",
    "role": "university",
    "abbreviation": "SU",
    "establishedYear": 2000,
    "type": "Private",
    "description": "Sample description",
    "address": "123 Main St"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "university@example.com",
    "password": "password123"
  }'
```

Save the token from the response!

### 3. Get Current User

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📦 What's Included?

✅ **8 Models**: User, University, Consultancy, Course, Stream, Student, Commission, Admission  
✅ **8 Route Files**: Complete CRUD operations  
✅ **3 Middleware**: Auth, Validation, Error Handling  
✅ **Security**: JWT, bcrypt, helmet, CORS  
✅ **Documentation**: README, API docs, Postman collection  

## 🛠 Common Issues

### Port Already in Use
```bash
# Change PORT in .env file
PORT=5001
```

### MongoDB Connection Failed
- Check if MongoDB is running
- Verify MONGODB_URI in .env
- For Atlas: check network access and credentials

### JWT Secret Not Set
- Make sure JWT_SECRET is set in .env
- Use a strong, random string

## 📚 Next Steps

1. **Read the Full Documentation**: Check `README.md`
2. **Import Postman Collection**: Use `POSTMAN_COLLECTION.json`
3. **Test All Endpoints**: Try CRUD operations
4. **Connect Flutter App**: Update API URLs in Flutter app
5. **Add Custom Features**: Extend models and routes

## 🔗 Important URLs

- **API Base**: `http://localhost:5000/api`
- **Health Check**: `http://localhost:5000`
- **Auth**: `http://localhost:5000/api/auth`
- **Universities**: `http://localhost:5000/api/universities`
- **Courses**: `http://localhost:5000/api/courses`
- **Students**: `http://localhost:5000/api/students`

## 💡 Tips

- Use Postman or Thunder Client for testing
- Check server logs for debugging
- Start with authentication endpoints first
- Test with different user roles (university, consultant)
- Enable CORS if connecting from Flutter web

## 🆘 Need Help?

1. Check the logs in the terminal
2. Read the full `README.md`
3. Verify `.env` configuration
4. Ensure MongoDB is running
5. Check firewall settings

---

**Happy Coding! 🎉**
