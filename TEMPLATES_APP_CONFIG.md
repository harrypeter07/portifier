# 🚀 Templates App Configuration Guide

## 📋 **Environment Variables Setup**

Create a `.env.local` file in your project root with the following variables:

```bash
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/portfolio
DATABASE_URL=mongodb://localhost:27017/portfolio

# Templates App Configuration
TEMPLATES_APP_URL=https://portumet.vercel.app
TEMPLATES_BASE_URL=https://portumet.vercel.app
TEMPLATES_API_KEY=85af0b404444140bc4573c07a30ca9e6537125fce1b89ffb721aed3e94a24e02

# JWT Configuration
JWT_SECRET=your-jwt-secret-here
SHARED_JWT_SECRET=your-shared-jwt-secret-here

# App Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# Google AI Configuration
GOOGLE_AI_API_KEY=your-google-ai-api-key-here
```

## 🔧 **Templates App Integration**

### **1. Main App (This App)**
- **Role**: Lightweight proxy that fetches portfolio data and forwards to Templates App
- **Database**: Direct access to portfolio data
- **Rendering**: Delegated to Templates App

### **2. Templates App**
- **Role**: Handles all portfolio rendering and template processing
- **Database**: Can access shared database or receive data from Main App
- **Rendering**: Full HTML generation with templates

## 📁 **New File Structure**

```
src/
├── app/
│   ├── api/
│   │   ├── render-portfolio/
│   │   │   └── route.js          # Updated: Proxy to Templates App
│   │   └── portfolio/
│   │       ├── render/
│   │       │   └── [username]/
│   │       │       └── route.js  # New: Direct portfolio rendering
│   │       └── [username]/
│   │           └── route.js       # Existing: Portfolio data API
│   └── [username]/
│       └── page.jsx              # New: Direct portfolio page
```

## 🔄 **API Flow**

### **1. Direct Portfolio Access**
```
User visits /username
↓
Main App fetches portfolio data from database
↓
Main App sends minimal data to Templates App
↓
Templates App renders HTML
↓
Main App returns HTML to user
```

### **2. Portfolio Dashboard**
```
User visits /portfolio/username
↓
Main App fetches portfolio data and analytics
↓
Main App renders dashboard with portfolio info
```

## 🛠️ **Implementation Details**

### **Updated Files:**
1. **`src/app/api/render-portfolio/route.js`** - Now fetches portfolio data and proxies to Templates App
2. **`src/app/api/portfolio/render/[username]/route.js`** - New direct portfolio rendering route
3. **`src/app/[username]/page.jsx`** - New direct portfolio page
4. **`src/app/portfolio/[username]/page.jsx`** - Updated dashboard page

### **Key Features:**
- ✅ **Load Balancing**: Templates App handles heavy rendering
- ✅ **Database Efficiency**: Direct DB access from Main App
- ✅ **Minimal Data Transfer**: Only username and portfolio data sent to Templates App
- ✅ **Fallback Handling**: Graceful degradation when Templates App is unavailable
- ✅ **Error Handling**: Comprehensive error responses

## 🧪 **Testing**

### **Test Direct Portfolio Access:**
```bash
# Test portfolio rendering
curl http://localhost:3000/username

# Test API endpoint
curl http://localhost:3000/api/portfolio/render/username
```

### **Test Templates App Integration:**
```bash
# Test render-portfolio proxy
curl -X POST http://localhost:3000/api/render-portfolio \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "templateId": "cleanfolio"}'
```

## 🚀 **Deployment**

### **Main App Deployment:**
1. Set `TEMPLATES_APP_URL` to your Templates App URL
2. Set `TEMPLATES_API_KEY` for authentication
3. Deploy to your main domain

### **Templates App Deployment:**
1. Deploy to your templates domain
2. Configure database connection
3. Set up API key authentication

## 📊 **Performance Benefits**

- **Reduced Data Transfer**: Only essential data sent between apps
- **Direct Database Access**: No data serialization overhead
- **Independent Scaling**: Templates App can be scaled separately
- **Caching**: Templates App can implement its own caching strategy
- **Load Distribution**: Rendering load completely offloaded

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **"Templates App Unavailable"**
   - Check `TEMPLATES_APP_URL` environment variable
   - Verify Templates App is running
   - Check API key authentication

2. **"Portfolio not found"**
   - Check database connection
   - Verify username exists in database
   - Check portfolio is public

3. **"API Key verification failed"**
   - Check `TEMPLATES_API_KEY` environment variable
   - Verify both apps have matching keys

## 📝 **Next Steps**

1. **Deploy Templates App**: Set up the templates rendering service
2. **Configure Environment**: Set up all required environment variables
3. **Test Integration**: Verify portfolio rendering works end-to-end
4. **Monitor Performance**: Set up logging and metrics
5. **Add Caching**: Implement Redis or similar for performance

This architecture provides true load balancing and optimal performance for your portfolio rendering system! 🎉
