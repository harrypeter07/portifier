# Templates App - Architecture & Integration Guide

**For Main App Agent**: Complete guide to integrate with the Templates App for portfolio rendering.

## 🏗️ Architecture Overview

**Templates App** is a stateless Next.js App Router service that server-renders portfolio templates and returns HTML/CSS to the Main App. It's designed for high performance with JWT security, ETag caching, and comprehensive portfolio data handling.

### Key Principles
- **Stateless**: No database, all data provided by Main App
- **Secure**: Service-to-service JWT authentication
- **Fast**: ETag + Cache-Control headers with 304 support
- **Flexible**: Template registry with comprehensive data schema
- **Scalable**: Server-side rendering with Next.js App Router

## 🌐 Domains & Deployment

- **Main App**: `portume.vercel.app`
- **Templates App**: `templates.portume.com` (deploy on Vercel)
- **Co-location**: Deploy in same Vercel region for optimal performance

## 🔌 API Endpoints

### 1. POST `/api/render` (Primary Endpoint)
**Purpose**: Render portfolio data into HTML/CSS using specified template

**Authentication**: 
```http
Authorization: Bearer <jwt>
```

**Request Body**:
```json
{
  "templateId": "modern-resume",
  "data": {
    "username": "john_doe",
    "templateId": "modern-resume",
    "portfolioData": {
      "personal": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "title": "Full Stack Developer"
      },
      "projects": {
        "items": [
          {
            "title": "E-commerce Platform",
            "description": "Built with React and Node.js",
            "technologies": ["React", "Node.js", "MongoDB"]
          }
        ]
      }
    }
  },
  "options": {}
}
```

**Response**:
```json
{
  "html": "<div class=\"modern-resume\">...</div>",
  "css": ".modern-resume { font-family: Inter; }",
  "meta": {
    "templateId": "modern-resume",
    "version": "1.0.0",
    "renderedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Headers**:
- `ETag`: `"abc123..."` (for caching)
- `Cache-Control`: `public, s-maxage=300, stale-while-revalidate=600`

**304 Support**: Send `If-None-Match: "abc123..."` header to get 304 if content unchanged.

### 2. GET `/api/templates/manifest`
**Purpose**: Get list of available templates

**Response**:
```json
[
  {
    "id": "modern-resume",
    "name": "Modern Resume",
    "version": "1.0.0",
    "description": "Clean, professional resume template",
    "requiredSections": ["personal", "about", "experience"],
    "tags": ["developer", "clean", "professional"]
  }
]
```

### 3. GET `/preview/[username]` (Optional)
**Purpose**: Direct preview with signed token (for edge rewrites)

**URL**: `https://templates.portume.com/preview/john_doe?token=<signed_jwt>`

**Returns**: Full HTML page with embedded CSS

## 🔐 Security & Authentication

### JWT Configuration
**Shared Secret**: Use your Main App's existing JWT secret for `SHARED_JWT_SECRET`

**JWT Payload Requirements**:
```json
{
  "scope": "render",
  "exp": 1642234567,
  "iat": 1642234267
}
```

**Token Creation** (in Main App):
```javascript
import { SignJWT } from 'jose';

const jwt = await new SignJWT({ scope: "render" })
  .setProtectedHeader({ alg: "HS256" })
  .setIssuedAt()
  .setExpirationTime("5m")
  .sign(new TextEncoder().encode(process.env.JWT_SECRET));
```

### Environment Variables
```bash
# Required
SHARED_JWT_SECRET=your-main-app-jwt-secret

# Optional
MAIN_API_BASE=https://portume.vercel.app
ALLOWED_ORIGINS=https://portume.vercel.app
PREVIEW_JWT_SECRET=your-preview-secret  # can reuse SHARED_JWT_SECRET
```

## 📊 Data Schema & Validation

### Portfolio Data Structure
The Templates App uses a comprehensive Zod schema that handles all portfolio sections with smart fallbacks:

```typescript
interface PortfolioData {
  personal?: {
    firstName?: string;
    lastName?: string;
    title?: string;
    subtitle?: string;
    tagline?: string;
    email?: string;
    phone?: string;
    location?: { city?: string; state?: string; country?: string };
    social?: {
      linkedin?: string;
      github?: string;
      twitter?: string;
      website?: string;
      instagram?: string;
      facebook?: string;
    };
  };
  about?: {
    summary?: string;
    interests?: string[];
    values?: string[];
    funFacts?: string[];
  };
  projects?: {
    items?: Array<{
      title?: string;
      name?: string;  // fallback for title
      description?: string;
      technologies?: string[];
      links?: {
        live?: string;
        github?: string;
        demo?: string;
      };
      url?: string;  // fallback for links.live
      github?: string;  // fallback for links.github
    }>;
  };
  skills?: {
    technical?: string[];
    soft?: string[];
    languages?: string[];
    tools?: string[];
    frameworks?: string[];
    databases?: string[];
  };
  experience?: {
    jobs?: Array<{
      position?: string;
      title?: string;  // fallback for position
      company?: string;
      location?: string;
      startDate?: string;
      endDate?: string;
      duration?: string;  // auto-computed if not provided
      description?: string;
      technologies?: string[];
      achievements?: string[];
      current?: boolean;
    }>;
  };
  education?: {
    degrees?: Array<{
      degree?: string;
      field?: string;
      institution?: string;
      location?: string;
      startDate?: string;
      endDate?: string;
      year?: string;  // auto-computed if not provided
      grade?: string;
      gpa?: string;
      honors?: string[];
      relevantCoursework?: string[];
    }>;
  };
  achievements?: {
    awards?: string[];
    certifications?: string[];
    publications?: string[];
    recognitions?: string[];
  };
  contact?: {
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
}
```

### Data Normalization
The app automatically handles fallbacks:
- `title` OR `name` for project names
- `position` OR `title` for job titles
- `links.live` OR `url` for project URLs
- Auto-computes `duration` from `startDate`/`endDate`
- Combines `firstName` + `lastName` into `fullName`

## 🎨 Available Templates

### 1. `modern-resume`
**Features**:
- Professional typography with Inter font
- Responsive design (mobile-friendly)
- Skills categorization (technical, frameworks, tools, soft skills)
- Technology tags with styling
- Social links integration
- Comprehensive sections: Personal, About, Skills, Experience, Projects, Education, Achievements

**CSS**: Embedded critical CSS for optimal performance

### 2. `minimal-card`
**Features**:
- Lightweight profile card
- Basic styling with border and padding
- Minimal data requirements

## 🔄 Integration Patterns

### Pattern 1: Server-Side Proxy (Recommended)
```javascript
// In your Main App: app/api/render-portfolio/route.js
export async function POST(request) {
  try {
    // 1. Get portfolio data from your database
    const portfolioData = await getPortfolioFromDB(request.body.username);
    
    // 2. Create JWT token
    const jwt = await new SignJWT({ scope: "render" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("5m")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));
    
    // 3. Call Templates App
    const response = await fetch('https://templates.portume.com/api/render', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        templateId: portfolioData.templateId,
        data: portfolioData
      })
    });
    
    if (!response.ok) {
      throw new Error(`Templates App error: ${response.status}`);
    }
    
    const result = await response.json();
    
    // 4. Return HTML/CSS to client
    return new Response(result.html, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, s-maxage=300',
        'ETag': response.headers.get('ETag')
      }
    });
    
  } catch (error) {
    return new Response('Render failed', { status: 500 });
  }
}
```

### Pattern 2: Edge Rewrite (Alternative)
```javascript
// In your Main App: middleware.js
export function middleware(request) {
  if (request.nextUrl.pathname.startsWith('/portfolio/')) {
    const username = request.nextUrl.pathname.split('/')[2];
    
    // Create signed preview URL
    const token = createPreviewToken(username);
    const previewUrl = `https://templates.portume.com/preview/${username}?token=${token}`;
    
    return NextResponse.rewrite(previewUrl);
  }
}
```

## 🚀 Deployment Checklist

### Templates App Deployment
1. **Push to GitHub**: Ensure all code is committed
2. **Deploy on Vercel**: 
   - Connect GitHub repository
   - Set domain as `templates.portume.com`
   - Configure environment variables
3. **Environment Variables**:
   ```bash
   SHARED_JWT_SECRET=your-main-app-jwt-secret
   MAIN_API_BASE=https://portume.vercel.app
   ALLOWED_ORIGINS=https://portume.vercel.app
   ```

### Main App Integration
1. **Add API Route**: Create `/api/render-portfolio/route.js`
2. **Update Portfolio Pages**: Use the new API route
3. **Test Integration**: Verify JWT creation and Templates App communication
4. **Monitor Performance**: Check ETag caching and response times

## 🧪 Testing

### Test Template Rendering
```bash
curl -X POST https://templates.portume.com/api/render \
  -H "Authorization: Bearer <your-jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "modern-resume",
    "data": {
      "username": "test_user",
      "templateId": "modern-resume",
      "portfolioData": {
        "personal": {
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com"
        }
      }
    }
  }'
```

### Test Template Manifest
```bash
curl https://templates.portume.com/api/templates/manifest
```

## 📁 File Structure

```
templates-app/
├── app/
│   ├── api/
│   │   ├── render/route.ts          # Main rendering endpoint
│   │   ├── templates/manifest/route.ts  # Template list
│   │   └── render/export/route.ts   # Future PDF/PNG export
│   └── preview/[username]/page.tsx  # Direct preview page
├── src/
│   ├── lib/
│   │   ├── auth.ts                  # JWT verification
│   │   ├── cache.ts                 # ETag & cache headers
│   │   ├── renderer.ts              # Data validation & normalization
│   │   └── server-render.tsx        # SSR utilities
│   └── templates/
│       └── registry.ts              # Template registry
├── templates/
│   ├── modern-resume/               # Professional resume template
│   │   ├── index.tsx
│   │   ├── manifest.json
│   │   └── styles.css
│   └── minimal-card/                # Simple card template
│       ├── index.tsx
│       └── manifest.json
└── packages/shared/
    └── portfolioSchema.ts           # Comprehensive data schema
```

## 🔧 Adding New Templates

1. **Create Template Folder**: `templates/<template-id>/`
2. **Add Component**: `index.tsx` with default export and optional `css`
3. **Add Manifest**: `manifest.json` with metadata
4. **Register Template**: Update `src/templates/registry.ts`
5. **Test**: Use `/api/render` endpoint

## 📈 Performance Features

- **ETag Caching**: Automatic cache invalidation on data changes
- **304 Responses**: Efficient handling of unchanged content
- **CDN Ready**: Cache-Control headers for edge caching
- **Server-Side Rendering**: No client JavaScript required
- **Dynamic Imports**: Optimized bundle splitting

## 🛠️ Troubleshooting

### Common Issues
1. **JWT Verification Failed**: Ensure `SHARED_JWT_SECRET` matches Main App
2. **Template Not Found**: Check template registration in `registry.ts`
3. **Data Validation Error**: Verify portfolio data matches schema
4. **Build Errors**: Ensure all imports use correct path aliases

### Debug Mode
Set `NODE_ENV=development` for detailed error messages.

---

## 🔗 Main App Integration Status

**Integration Complete**: The Main App has been successfully integrated with the Templates App for seamless template sharing and rendering.

### New API Routes Added to Main App:
- `GET /api/templates/manifest` - Fetches available templates from Templates App
- `POST /api/render-portfolio` - Renders portfolios using Templates App (enhanced)
- `GET /api/render-portfolio?username=<username>` - Alternative render endpoint

### Templates Demo Page Enhanced:
- **Remote Templates Section**: Displays templates from Templates App (`modern-resume`, `minimal-card`)
- **Connection Status**: Shows loading states and error handling
- **Template Preview**: Direct links to preview templates
- **Local vs Remote**: Clear distinction between local and remote templates

### Integration Features:
- ✅ **Template Discovery**: Automatically fetches and displays remote templates
- ✅ **Error Handling**: Graceful fallback when Templates App is unavailable
- ✅ **Visual Indicators**: Version numbers, tags, and source identification
- ✅ **Preview Links**: Direct access to template previews

### Testing Setup:
- **Main App**: `localhost:3000` (portfolio app)
- **Templates App**: `localhost:3001` (templates service)
- **Environment**: Set `TEMPLATES_BASE_URL=http://localhost:3001` for local testing

### Required Environment Variables:
```bash
# Main App
TEMPLATES_API_KEY=85af0b404444140bc4573c07a30ca9e6537125fce1b89ffb721aed3e94a24e02
TEMPLATES_APP_URL=http://localhost:3001  # or https://portumet.vercel.app for production

# Templates App
VALID_API_KEYS=85af0b404444140bc4573c07a30ca9e6537125fce1b89ffb721aed3e94a24e02,eed0c172295f25a9eb99c7298fc5be2604d5db50ce5f49f729c7942ba50a2f3d
```

---

**Ready for Production**: The Templates App is fully implemented, tested, and ready for deployment. It provides a robust, scalable solution for portfolio rendering with comprehensive data handling and professional templates.
