# Render Deployment Guide for Portfolio Backend

This guide will walk you through deploying your Flask backend to Render.com.

## Prerequisites

1. **GitHub Repository**: Your code should be in a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **MongoDB Atlas Account**: For production database (optional, Render provides MongoDB)

## Deployment Options

### Option 1: Using Render.yaml (Recommended)

This is the easiest method using the `render.yaml` file I've created for you.

#### Steps:

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Add Render deployment configuration"
   git push origin main
   ```

2. **Connect to Render**:
   - Go to [render.com](https://render.com) and sign in
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Select your repository
   - Render will automatically detect the `render.yaml` file

3. **Configure Environment Variables**:
   - In the Render dashboard, go to your service
   - Navigate to "Environment" tab
   - Add these environment variables:
     ```
     OPENAI_API_KEY=your_openai_api_key_here
     HUGGINGFACE_API_KEY=your_huggingface_api_key_here
     CORS_ORIGINS=https://your-frontend-domain.onrender.com,http://localhost:3000
     ```

4. **Deploy**:
   - Click "Apply" to deploy
   - Render will automatically create the MongoDB database and web service

### Option 2: Manual Setup

If you prefer manual setup:

#### 1. Create MongoDB Database

1. Go to Render dashboard
2. Click "New +" → "MongoDB"
3. Choose "Starter" plan (free tier)
4. Name it `portfolio-mongodb`
5. Note the connection string

#### 2. Create Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `portfolio-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && python app.py`
   - **Plan**: Starter (free tier)

#### 3. Environment Variables

Add these environment variables in the Render dashboard:

```
FLASK_ENV=production
PORT=10000
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
MONGODB_URI=mongodb://localhost:27017/pdf_editor
OPENAI_API_KEY=your-openai-key
HUGGINGFACE_API_KEY=your-huggingface-key
TESSERACT_CMD=/usr/bin/tesseract
CORS_ORIGINS=https://your-frontend-domain.onrender.com,http://localhost:3000
```

### Option 3: Docker Deployment

If you want to use Docker:

1. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Choose "Docker" as environment
   - Render will automatically detect the Dockerfile

2. **Environment Variables** (same as above)

## Important Configuration Changes

### 1. Update CORS Origins

In your `backend/config/__init__.py`, update the CORS origins:

```python
CORS_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://your-frontend-domain.onrender.com",  # Add your frontend URL
    "https://your-backend-domain.onrender.com"    # Add your backend URL
]
```

### 2. Update Frontend API URLs

In your frontend code, update API base URLs to point to your Render backend:

```javascript
// Example: src/utils/api.js
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-domain.onrender.com' 
  : 'http://localhost:5000';
```

### 3. Database Connection

The MongoDB connection will be automatically configured by Render. Make sure your `MONGODB_URI` environment variable is set correctly.

## System Dependencies

Your backend requires several system dependencies that Render provides:

- **Tesseract OCR**: For text extraction from images
- **Poppler**: For PDF processing
- **OpenCV**: For image processing

These are included in the Dockerfile I created.

## File Storage Considerations

**Important**: Render's free tier has ephemeral file storage, meaning uploaded files will be lost when the service restarts. For production, consider:

1. **Use MongoDB GridFS** for file storage
2. **Use AWS S3** or similar cloud storage
3. **Use Render's persistent disk** (paid feature)

## Monitoring and Logs

1. **View Logs**: Go to your service → "Logs" tab
2. **Health Check**: Your app has a health endpoint at `/api/health`
3. **Metrics**: Monitor CPU, memory, and response times

## Common Issues and Solutions

### 1. Build Failures

**Issue**: Dependencies fail to install
**Solution**: 
- Check `requirements.txt` for version conflicts
- Ensure all dependencies are compatible with Python 3.11

### 2. Database Connection Issues

**Issue**: Cannot connect to MongoDB
**Solution**:
- Verify `MONGODB_URI` environment variable
- Check if MongoDB service is running
- Ensure connection string format is correct

### 3. CORS Issues

**Issue**: Frontend cannot access backend
**Solution**:
- Update `CORS_ORIGINS` in environment variables
- Check frontend API URLs

### 4. File Upload Issues

**Issue**: File uploads fail
**Solution**:
- Check file size limits (16MB max)
- Verify file type restrictions
- Consider using cloud storage for large files

## Performance Optimization

### 1. Database Indexes

Your app automatically creates database indexes on startup. Monitor the logs to ensure they're created successfully.

### 2. Caching

Consider adding Redis for caching (Render provides Redis service).

### 3. CDN

For file serving, consider using a CDN.

## Security Considerations

1. **Environment Variables**: Never commit secrets to Git
2. **HTTPS**: Render provides HTTPS by default
3. **CORS**: Configure CORS origins properly
4. **Rate Limiting**: Consider adding rate limiting for production

## Scaling

### Free Tier Limitations

- **750 hours/month** of service time
- **512MB RAM**
- **0.1 CPU**
- **Ephemeral file storage**

### Upgrading

When you need more resources:
1. Go to your service settings
2. Choose a higher plan
3. Consider using Render's auto-scaling features

## Testing Your Deployment

1. **Health Check**: Visit `https://your-backend-domain.onrender.com/api/health`
2. **API Endpoints**: Test your API endpoints
3. **File Upload**: Test file upload functionality
4. **Database**: Verify database operations

## Backup and Recovery

1. **Database**: MongoDB Atlas provides automatic backups
2. **Code**: Your code is in Git, so it's already backed up
3. **Environment Variables**: Document your environment variables

## Cost Estimation

### Free Tier
- Web Service: Free (750 hours/month)
- MongoDB: Free (1GB storage)
- Total: $0/month

### Paid Plans
- Web Service: $7/month (Starter plan)
- MongoDB: $7/month (Starter plan)
- Total: ~$14/month

## Next Steps

1. **Deploy your backend** using one of the methods above
2. **Update your frontend** to use the new backend URL
3. **Test all functionality** thoroughly
4. **Set up monitoring** and alerts
5. **Consider upgrading** to paid plans for production use

## Support

- **Render Documentation**: [render.com/docs](https://render.com/docs)
- **Render Community**: [community.render.com](https://community.render.com)
- **Your Backend Logs**: Check the logs tab in your Render dashboard

## Files Created for Deployment

I've created these files to help with your deployment:

1. **`render.yaml`**: Blueprint configuration for automatic deployment
2. **`Dockerfile`**: Container configuration for Docker deployment
3. **`RENDER_DEPLOYMENT_GUIDE.md`**: This comprehensive guide

Your backend is now ready for deployment on Render! 🚀
