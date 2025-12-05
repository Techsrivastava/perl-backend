# 🚀 Deployment Guide

## Environment Variables Setup

Your application needs these environment variables to run:

### Required Variables
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_super_secure_jwt_secret_key_here_minimum_32_characters
```

### Optional Variables (with defaults)
```bash
PORT=5000
NODE_ENV=production
JWT_EXPIRE=7d
MAX_FILE_SIZE=5242880
OTP_EXPIRY_MINUTES=10
```

## Deployment Options

### 1. Local Development
```bash
# Copy environment file
cp .env.example .env

# Edit .env with your values
# MONGODB_URI=your_mongodb_uri
# JWT_SECRET=your_jwt_secret

# Start development server
npm run dev
```

### 2. Local Production
```bash
# Set environment variables
export MONGODB_URI="your_mongodb_uri"
export JWT_SECRET="your_jwt_secret"
export NODE_ENV=production

# Start production server
npm start
```

### 3. Docker Deployment
```bash
# Build Docker image
npm run docker:build

# Run with environment file
npm run docker:run

# Or use docker-compose (includes MongoDB)
docker-compose up -d
```

### 4. Cloud Platforms

#### Heroku
```bash
# Set environment variables in Heroku dashboard:
# MONGODB_URI → your MongoDB Atlas URI
# JWT_SECRET → your secure JWT secret
# NODE_ENV → production

# Deploy
git push heroku main
```

#### Railway
```bash
# Set environment variables in Railway dashboard
# MONGODB_URI = your_mongodb_uri
# JWT_SECRET = your_jwt_secret
# NODE_ENV = production

# Deploy from GitHub
```

#### Render
```bash
# Set environment variables in Render dashboard
# MONGODB_URI = mongodb+srv://...
# JWT_SECRET = your_secure_secret
# NODE_ENV = production

# Build Command: npm install
# Start Command: npm start
```

#### DigitalOcean App Platform
```bash
# Set environment variables in DO dashboard
# Same variables as above

# Deploy from GitHub
```

#### AWS EC2
```bash
# On your EC2 instance:
sudo apt update
sudo apt install nodejs npm

# Clone your repo
git clone your-repo-url
cd university-backend

# Install PM2 for production
sudo npm install -g pm2

# Set environment variables
sudo nano .env
# Add your variables

# Start with PM2
pm2 start ecosystem.config.js
```

#### Vercel (Serverless)
```bash
# Set environment variables in Vercel dashboard
# MONGODB_URI = your_mongodb_uri
# JWT_SECRET = your_jwt_secret

# Create vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "server-production.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server-production.js"
    }
  ]
}
```

## Health Check

Once deployed, verify your deployment:

```bash
# Health endpoint
curl https://your-domain.com/health

# API root
curl https://your-domain.com/

# Test OTP endpoint
curl -X POST https://your-domain.com/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## Troubleshooting

### Environment Variables Not Loading
```bash
# Check if variables are set
npm run deploy:check

# Test database connection
npm run test-db
```

### MongoDB Connection Issues
- Verify MongoDB Atlas IP whitelist
- Check username/password
- Ensure cluster is running
- Test connection with `npm run test-db`

### Port Issues
- Default port is 5000
- Change with `PORT` environment variable
- Ensure port is not blocked by firewall

### Memory Issues
- Monitor with `pm2 monit`
- Increase server memory if needed
- Use `--max-old-space-size=4096` for Node.js

## Security Checklist

- [ ] JWT_SECRET is long and random
- [ ] MongoDB URI uses secure connection (mongodb+srv://)
- [ ] IP whitelist configured in MongoDB Atlas
- [ ] Environment variables not logged
- [ ] HTTPS enabled in production
- [ ] Rate limiting configured (optional)
- [ ] CORS properly configured

## Monitoring

- Health check endpoint: `GET /health`
- Logs: Check platform logs or PM2 logs
- Database: Monitor MongoDB Atlas dashboard
- Performance: Use PM2 monitoring

## Backup Strategy

1. **Database**: MongoDB Atlas automatic backups
2. **Code**: Git version control
3. **Environment**: Document all environment variables
4. **Assets**: Backup uploaded files regularly

---

**🎉 Your backend is now deployment-ready!**
