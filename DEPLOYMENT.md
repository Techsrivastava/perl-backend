# 🚀 Production Deployment Guide

## Prerequisites

- Node.js v14+
- MongoDB Atlas account (or local MongoDB)
- Linux/Windows server

## Quick Start Commands

```bash
# 1. Navigate to backend directory
cd "d:\Flutter Projects\Projects\perl app\Perl_Backend"

# 2. Install dependencies
npm install

# 3. Run troubleshooting (recommended)
npm run troubleshoot

# 4. Start production server
npm start

# Alternative: Start development server
npm run dev
```

## Environment Configuration

Your `.env` file should look like this:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database (MongoDB Atlas recommended)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/university_management

# JWT Secret (CHANGE THIS!)
JWT_SECRET=your_super_secure_jwt_secret_key_here

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

## Troubleshooting Common Issues

### Issue: "npm warn config production Use `--omit=dev` instead"
**Solution**: This is just a warning, doesn't affect functionality. The app will still work.

### Issue: "MongoDB Connection Error"
**Solutions**:
1. Check your `MONGODB_URI` in `.env`
2. Ensure MongoDB Atlas IP whitelist includes your IP
3. Verify username/password in connection string

### Issue: "Port already in use"
**Solution**:
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### Issue: "Missing environment variables"
**Solution**:
```bash
# Run environment check
npm run check-env

# Edit .env file with proper values
```

## Production Checklist

- [ ] `NODE_ENV=production` in `.env`
- [ ] Strong `JWT_SECRET` set
- [ ] MongoDB Atlas connection working
- [ ] Port 5000 available
- [ ] `uploads/` directory exists
- [ ] All dependencies installed (`npm install`)

## API Testing

Once server is running, test these endpoints:

```bash
# Health check
curl http://localhost:5000/health

# API info
curl http://localhost:5000/

# Test OTP send (replace with real email)
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## Logs and Monitoring

- Server logs appear in console
- OTP codes logged in development mode
- Health endpoint: `GET /health`
- Environment info in startup logs

## Security Notes

- JWT tokens expire in 7 days
- OTP codes valid for 10 minutes
- Passwords hashed with bcrypt
- Helmet security headers enabled
- CORS configured for production

## Performance Tips

- Use MongoDB Atlas for production
- Enable compression (already configured)
- Set up PM2 for process management (optional)
- Monitor memory usage
- Set up log rotation

---

**🎉 Your production backend is ready!**
