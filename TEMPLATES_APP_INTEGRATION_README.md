# 🚀 Templates App Integration - Complete Guide

## 📋 **Overview**

This document provides complete instructions for integrating the **Templates App** with the **Main Portfolio App**. The Templates App handles all portfolio rendering, database operations, and template management, while the Main App acts as a simple proxy.

## 🏗️ **Architecture**

```
┌─────────────────────────────────────────────────────────────────┐
│                    SIMPLIFIED ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Main App (Portfolio)          Templates App (Rendering)       │
│  ┌─────────────────────┐       ┌─────────────────────────────┐  │
│  │ • User Interface    │       │ • Portfolio Rendering       │  │
│  │ • Authentication    │       │ • Database Operations       │  │
│  │ • Template Selection│       │ • Template Management       │  │
│  │ • Proxy Requests    │──────▶│ • HTML/CSS Generation       │  │
│  └─────────────────────┘       └─────────────────────────────┘  │
│                                                                 │
│  Shared Database (MongoDB)                                      │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ • Users Collection                                          │ │
│  │ • Portfolios Collection                                     │ │
│  │ • Templates Collection                                      │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 🔧 **Required Changes for Templates App**

### 1. **Database Models** (Add to Templates App)

Create these models in your Templates App:

```javascript
// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
```

```javascript
// models/Portfolio.js
const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  templateId: { type: String, required: true },
  templateName: { type: String, required: true },
  templateType: { type: String, default: 'remote' },
  portfolioData: { type: Object, required: true },
  content: { type: Object }, // Legacy format
  layout: { type: Object, required: true },
  isPublic: { type: Boolean, default: true },
  slug: { type: String },
  portfolioType: { type: String, default: 'developer' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
```

### 2. **New API Routes** (Add to Templates App)

#### **A. Portfolio Rendering Route**

```javascript
// app/api/render-portfolio/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import User from "@/models/User";
import { verifyApiKey } from "@/lib/auth";

export async function POST(request) {
  try {
    // 1. Verify API Key
    const authResult = await verifyApiKey(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    await dbConnect();
    const { username, templateId, preview, sampleData } = await request.json();

    let portfolioData;
    let finalTemplateId = templateId;

    if (preview && sampleData) {
      // Handle preview requests with sample data
      portfolioData = {
        personal: {
          firstName: 'John',
          lastName: 'Doe',
          title: 'Full Stack Developer',
          email: 'john@example.com',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA',
          avatar: '/api/placeholder/150/150',
          tagline: 'Passionate developer with 5+ years of experience'
        },
        about: {
          summary: 'Experienced full-stack developer specializing in modern web technologies. Passionate about creating scalable and user-friendly applications.'
        },
        experience: [
          {
            company: 'Tech Corp',
            position: 'Senior Developer',
            duration: '2020 - Present',
            description: 'Led development of multiple web applications using React and Node.js'
          }
        ],
        skills: {
          technical: ['JavaScript', 'React', 'Node.js', 'Python', 'MongoDB'],
          soft: ['Leadership', 'Problem Solving', 'Communication']
        },
        projects: [
          {
            name: 'E-commerce Platform',
            description: 'Built a full-stack e-commerce solution',
            technologies: ['React', 'Node.js', 'MongoDB'],
            link: 'https://example.com'
          }
        ]
      };
    } else if (username) {
      // Handle real portfolio requests
      const user = await User.findOne({ username });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const portfolio = await Portfolio.findOne({ 
        userId: user._id, 
        isPublic: true 
      }).sort({ updatedAt: -1 });

      if (!portfolio) {
        return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
      }

      portfolioData = portfolio.portfolioData || portfolio.content || {};
      finalTemplateId = portfolio.templateId || templateId;
    } else {
      return NextResponse.json({ error: "Username or preview data required" }, { status: 400 });
    }

    // 2. Render the template
    const renderResult = await renderTemplate(finalTemplateId, portfolioData);
    
    if (!renderResult.success) {
      return NextResponse.json({ error: renderResult.error }, { status: 500 });
    }

    // 3. Return HTML with proper headers
    return new Response(renderResult.html, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, s-maxage=300',
        'ETag': `"${Date.now()}"`
      }
    });

  } catch (error) {
    console.error("Render portfolio error:", error);
    return NextResponse.json({ error: "Render failed" }, { status: 500 });
  }
}

async function renderTemplate(templateId, data) {
  // Your existing template rendering logic
  // This should return { success: true, html: "..." } or { success: false, error: "..." }
  try {
    // Implement your template rendering logic here
    const html = await renderTemplateHTML(templateId, data);
    return { success: true, html };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

#### **B. Templates Manifest Route** (Update existing)

```javascript
// app/api/templates/manifest/route.js
import { NextResponse } from "next/server";
import { verifyApiKey } from "@/lib/auth";

export async function GET(request) {
  try {
    // Verify API Key
    const authResult = await verifyApiKey(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    // Return your existing templates manifest
    const templates = [
      {
        id: 'modern-resume',
        name: 'Modern Resume',
        version: '1.0.0',
        description: 'Clean, professional resume template with comprehensive sections',
        requiredSections: ['personal', 'about', 'experience'],
        tags: ['developer', 'clean', 'professional', 'comprehensive'],
        remote: true,
        source: 'templates-app'
      },
      {
        id: 'minimal-card',
        name: 'Minimal Card',
        version: '1.0.0',
        description: 'Simple profile card template',
        requiredSections: ['personal'],
        tags: ['minimal', 'card', 'simple'],
        remote: true,
        source: 'templates-app'
      }
    ];

    return NextResponse.json(templates);

  } catch (error) {
    console.error("Error fetching templates manifest:", error);
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 });
  }
}
```

### 3. **Environment Variables** (Templates App)

Add these to your Templates App's `.env.local`:

```bash
# Database Connection (Same as Main App)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio

# API Key Authentication
VALID_API_KEYS=85af0b404444140bc4573c07a30ca9e6537125fce1b89ffb721aed3e94a24e02,eed0c172295f25a9eb99c7298fc5be2604d5db50ce5f49f729c7942ba50a2f3d

# Main App URL (for CORS)
MAIN_APP_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,https://your-main-app.vercel.app
```

### 4. **Database Connection** (Templates App)

Create `lib/mongodb.js` in your Templates App:

```javascript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
```

### 5. **API Key Authentication** (Templates App)

Create `lib/auth.js` in your Templates App:

```javascript
export async function verifyApiKey(request) {
  try {
    const authorization = request.headers.get('authorization');
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return { success: false, error: 'Invalid authorization format' };
    }

    const apiKey = authorization.slice(7); // Remove "Bearer "
    const validKeys = process.env.VALID_API_KEYS?.split(',') || [];

    if (!validKeys.includes(apiKey)) {
      return { success: false, error: 'Invalid API key' };
    }

    return { success: true, apiKey };
  } catch (error) {
    return { success: false, error: 'Authentication failed' };
  }
}
```

## 🔄 **Main App Changes** (Already Implemented)

The Main App has been simplified to act as a proxy:

### **1. Render Portfolio API** (`src/app/api/render-portfolio/route.js`)
- Simple proxy that forwards requests to Templates App
- Templates App handles all database operations and rendering

### **2. Templates Manifest API** (`src/app/api/templates/manifest/route.js`)
- Simple proxy that forwards requests to Templates App
- Templates App returns the templates list

### **3. Templates Demo Page** (`src/app/templates-demo/page.jsx`)
- Updated to work with simplified architecture
- Preview button sends `preview: true, sampleData: true` flags

## 🚀 **Deployment Steps**

### **1. Templates App Deployment**

1. **Add the new files** to your Templates App:
   - `models/User.js`
   - `models/Portfolio.js`
   - `app/api/render-portfolio/route.js`
   - `lib/mongodb.js`
   - `lib/auth.js`

2. **Update environment variables** in Vercel:
   ```bash
   MONGODB_URI=your_mongodb_connection_string
   VALID_API_KEYS=85af0b404444140bc4573c07a30ca9e6537125fce1b89ffb721aed3e94a24e02,eed0c172295f25a9eb99c7298fc5be2604d5db50ce5f49f729c7942ba50a2f3d
   MAIN_APP_URL=https://your-main-app.vercel.app
   ALLOWED_ORIGINS=https://your-main-app.vercel.app,http://localhost:3000
   ```

3. **Deploy to Vercel**:
   ```bash
   git add .
   git commit -m "Add portfolio rendering and database integration"
   git push origin main
   vercel --prod
   ```

### **2. Main App Deployment**

The Main App changes are already implemented. Just deploy:

```bash
git add .
git commit -m "Simplify architecture - proxy to templates app"
git push origin main
vercel --prod
```

## 🧪 **Testing**

### **1. Test Templates App Directly**

```bash
# Test templates manifest
curl -H "Authorization: Bearer 85af0b404444140bc4573c07a30ca9e6537125fce1b89ffb721aed3e94a24e02" \
     https://your-templates-app.vercel.app/api/templates/manifest

# Test portfolio rendering (preview)
curl -X POST \
     -H "Authorization: Bearer 85af0b404444140bc4573c07a30ca9e6537125fce1b89ffb721aed3e94a24e02" \
     -H "Content-Type: application/json" \
     -d '{"username":"preview","templateId":"modern-resume","preview":true,"sampleData":true}' \
     https://your-templates-app.vercel.app/api/render-portfolio
```

### **2. Test Main App Integration**

1. Visit `https://your-main-app.vercel.app/templates-demo`
2. Check if remote templates are displayed
3. Click "👁️ Preview" on a remote template
4. Click "🚀 Use Template" to apply a template

## 📊 **Data Flow**

### **1. Template Discovery**
```
Main App → Templates App → Database → Return Templates List
```

### **2. Portfolio Preview**
```
Main App → Templates App → Generate Sample Data → Render Template → Return HTML
```

### **3. Portfolio Rendering**
```
Main App → Templates App → Database (Fetch Portfolio) → Render Template → Return HTML
```

## 🔒 **Security**

- **API Key Authentication**: All requests between apps use API keys
- **Database Access**: Templates App has direct database access
- **CORS**: Configured for specific origins
- **Input Validation**: All inputs are validated before processing

## 🎯 **Benefits of This Architecture**

1. **Simplified Main App**: No complex rendering logic
2. **Centralized Rendering**: All templates handled in one place
3. **Shared Database**: Both apps use the same data
4. **Scalable**: Easy to add new templates and features
5. **Maintainable**: Clear separation of concerns

## 🚨 **Important Notes**

1. **Database Connection**: Both apps must use the same MongoDB database
2. **API Keys**: Must be identical in both apps
3. **CORS**: Templates App must allow Main App's domain
4. **Error Handling**: Templates App should return proper error responses
5. **Caching**: Consider implementing caching for better performance

## 📞 **Support**

If you encounter any issues:

1. Check the console logs in both apps
2. Verify environment variables are set correctly
3. Test API endpoints directly
4. Check database connectivity
5. Verify API key authentication

---

**🎉 Integration Complete!** Your Templates App now handles all portfolio rendering and database operations, while the Main App provides a clean user interface and acts as a proxy.
