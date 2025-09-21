# 🔧 Templates App Route Conflict Fix

## ❌ **Problem**
The error `[Error: You cannot use different slug names for the same dynamic path ('previewId' !== 'username').]` occurs because:

1. **Main App** (port 3000): Has `/[username]` route
2. **Templates App** (port 3001): Has `/[previewId]` route
3. **Next.js Conflict**: Both apps are using the same dynamic path structure

## ✅ **Solution**

### **Option 1: Use Different Route Patterns**

**Templates App should use:**
```
/preview/[previewId]     # Instead of /[previewId]
/portfolio/[username]    # Instead of /[username]
/template/[templateId]   # Instead of /[templateId]
```

**Main App keeps:**
```
/[username]              # Direct portfolio access
/portfolio/[username]    # Portfolio dashboard
```

### **Option 2: Use Different Ports with Proper Routing**

**Main App (port 3000):**
- `http://localhost:3000/username` - Direct portfolio
- `http://localhost:3000/portfolio/username` - Dashboard

**Templates App (port 3001):**
- `http://localhost:3001/preview/previewId` - Preview
- `http://localhost:3001/portfolio/username` - Rendered portfolio

### **Option 3: Use Subdomain Routing**

**Main App:**
- `http://localhost:3000/username` - Direct portfolio

**Templates App:**
- `http://templates.localhost:3001/username` - Rendered portfolio
- `http://templates.localhost:3001/preview/previewId` - Preview

## 🚀 **Quick Fix**

Update your Templates App to use these route patterns:

```javascript
// Templates App routes
app/
├── preview/
│   └── [previewId]/
│       └── page.jsx
├── portfolio/
│   └── [username]/
│       └── page.jsx
└── template/
    └── [templateId]/
        └── page.jsx
```

This will resolve the conflict and allow both apps to run simultaneously.
