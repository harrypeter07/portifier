# 🚀 Templates App Configuration

## 📋 **Environment Variables**

```bash
# Templates App Configuration
TEMPLATES_APP_URL=https://portumet.vercel.app
TEMPLATES_API_KEY=85af0b404444140bc4573c07a30ca9e6537125fce1b89ffb721aed3e94a24e02

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/portfolio

# App Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 🔄 **Template Flow**

### **1. Template Fetching**
```bash
GET /api/templates
```
**Response:**
```json
{
  "success": true,
  "templates": [
    {
      "id": "cleanfolio",
      "name": "Cleanfolio",
      "description": "Clean and modern portfolio template",
      "category": "developer",
      "preview": "/templates/cleanfolio-preview.jpg",
      "version": "1.0.0",
      "author": "Portfolio Team",
      "remote": false,
      "source": "local"
    }
  ],
  "count": 1
}
```

### **2. Template Preview**
```bash
POST /api/templates/preview
```
**Request:**
```json
{
  "templateId": "cleanfolio",
  "portfolioData": {
    "personal": { "firstName": "John", "lastName": "Doe" },
    "about": { "summary": "Full stack developer" },
    "experience": { "jobs": [...] },
    "skills": { "technical": [...] },
    "projects": { "items": [...] }
  },
  "options": { "preview": true, "version": "v1" }
}
```
**Response:**
```json
{
  "success": true,
  "previewUrl": "/preview/abc123",
  "html": "<html>...</html>",
  "templateId": "cleanfolio",
  "expiresAt": "2024-01-15T10:30:00Z",
  "fullPreviewUrl": "https://templates-app.com/preview/abc123"
}
```

### **3. Template Publishing**
```bash
POST /api/templates/publish
```
**Request:**
```json
{
  "username": "johndoe",
  "templateId": "cleanfolio",
  "templateName": "Cleanfolio",
  "templateType": "component",
  "templateSource": "local",
  "isRemoteTemplate": false,
  "portfolioData": { ... },
  "layout": {},
  "options": { "publish": true, "version": "v1" }
}
```
**Response:**
```json
{
  "success": true,
  "portfolioId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "username": "johndoe",
  "portfolioUrl": "https://templates-app.com/johndoe",
  "previewUrl": "https://templates-app.com/preview/abc123",
  "templateId": "cleanfolio"
}
```

## 🧪 **Testing**

### **Test Template Flow:**
```bash
# Run complete test
node test-template-flow.js

# Test individual endpoints
curl http://localhost:3000/api/templates
curl -X POST http://localhost:3000/api/templates/preview
curl -X POST http://localhost:3000/api/templates/publish
```

### **Test Portfolio Rendering:**
```bash
# Test direct portfolio rendering
curl http://localhost:3000/username
curl http://localhost:3000/api/portfolio/render/username
```

## 📁 **File Structure**

```
src/
├── lib/
│   └── templateManager.js          # Template management logic
├── app/
│   ├── api/
│   │   ├── templates/
│   │   │   ├── route.js            # Template fetching API
│   │   │   ├── preview/route.js    # Preview API
│   │   │   └── publish/route.js    # Publish API
│   │   ├── render-portfolio/route.js
│   │   └── portfolio/render/[username]/route.js
│   ├── [username]/page.jsx         # Direct portfolio page
│   └── templates-demo/page.jsx    # Template demo page
├── components/
│   ├── TemplateSelector.jsx        # Template selection UI
│   └── TemplatePreview.jsx         # Preview modal
└── test-template-flow.js          # Test script
```

## ✅ **Features**

- ✅ **Template Management**: Local template support
- ✅ **Template Preview**: Real-time preview with portfolio data
- ✅ **Template Publishing**: Database integration + Templates App
- ✅ **Portfolio Rendering**: Direct access via `/{username}`
- ✅ **UI Components**: Template selector and preview modal
- ✅ **API Integration**: Complete RESTful APIs

## 🚀 **Deployment**

1. **Set Environment Variables**:
   ```bash
   TEMPLATES_APP_URL=https://your-templates-app.com
   TEMPLATES_API_KEY=your-api-key
   MONGODB_URI=mongodb://your-mongodb-uri
   ```

2. **Deploy Main App**:
   ```bash
   npm run build
   npm run start
   ```

3. **Deploy Templates App**: Deploy to your templates domain

4. **Test Integration**: Run `node test-template-flow.js`

## 🔍 **Troubleshooting**

- **"Templates not loading"**: Check database connection
- **"Preview failed"**: Check `TEMPLATES_APP_URL` and API key
- **"Publishing failed"**: Check database and Templates App integration

This provides a complete template management system with Templates App integration! 🎉
