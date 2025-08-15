# 🚀 **Portifier: Next.js Portfolio Builder**

<p align="center">
  <img src="public/next.svg" alt="Next.js Logo" height="40"/>
  <img src="public/vercel.svg" alt="Vercel Logo" height="40"/>
  <img src="public/globe.svg" alt="Globe Logo" height="40"/>
  <img src="public/file.svg" alt="File Logo" height="40"/>
</p>

<p align="center">
  <b>Build, customize, and deploy beautiful developer portfolios with ease and AI-powered features.</b>
</p>

<p align="center">
  <a href="https://nextjs.org/">Next.js</a> • <a href="https://vercel.com/">Vercel</a> • <a href="https://github.com/pmndrs/zustand">Zustand</a> • <a href="#team--task-breakdown">Team</a>
</p>

---

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](#)
[![Next.js](https://img.shields.io/badge/Next.js-14-blue?logo=next.js)](https://nextjs.org/)
[![Made with Zustand](https://img.shields.io/badge/State-Zustand-29b6f6)](https://github.com/pmndrs/zustand)

---

## 📑 **Table of Contents**

- [Getting Started](#getting-started)
- [Features](#features)
- [Architecture & Customization Guide](#portfolio-builder-architecture--customization-guide)
- [Template System](#template-system)
- [Analytics & Tracking](#analytics--tracking)
- [Directory Structure](#4-directory-structure)
- [Adding Templates & Components](#3-adding-new-templates-and-components)
- [Team & Task Breakdown](#team--task-breakdown)
- [Learn More](#learn-more)
- [Deploy](#deploy-on-vercel)

---

## 🏁 **Getting Started**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

> **Tip:** Edit `app/page.js` to start customizing. The page auto-updates as you edit.

---

## ✨ **Features**

### 🎨 **Dynamic Navigation System**
- **Auto-hide Progress Bar**: Compact sidebar navigation that disappears after 3 seconds
- **Minimize/Maximize**: Toggle between compact and full navigation views
- **Smooth Transitions**: Opacity animations for seamless user experience
- **Scroll Detection**: Reappears on scroll or mouse movement
- **Mobile Optimized**: Responsive design for all device sizes

### 📊 **Real-Time Analytics**
- **Portfolio Views Tracking**: Comprehensive visitor analytics
- **Device & Browser Detection**: Detailed visitor information
- **Geographic Data**: IP-based location tracking
- **Session Management**: Unique visitor identification
- **Interactive Dashboard**: Charts and metrics visualization
- **Event Tracking**: Custom user interaction monitoring

### 🤖 **AI-Powered Resume Parsing**
- **Gemini API Integration**: Advanced resume parsing with retry logic
- **Model Fallback**: Automatic fallback to alternative models
- **Enhanced Error Handling**: Robust API call management
- **Structured Data Extraction**: Clean, organized portfolio data

### 🎯 **Template System**
- **Component-Based Templates**: Mix and match individual sections
- **Full-Page Templates**: Complete pre-designed portfolios
- **Live Preview**: Real-time template customization
- **Template Categories**: Developer, Designer, Marketing focused

### 🔐 **Authentication & Security**
- **JWT Authentication**: Secure user sessions
- **User Management**: Profile and portfolio management
- **Secure API Endpoints**: Protected routes and data
- **Environment Configuration**: Proper secret management

---

## 🏗️ **Portfolio Builder Architecture & Customization Guide**

### 1. **Flow: From Resume Parsing to Portfolio Rendering**

- **Resume Parsing:**
  - API: `src/app/api/parse-resume/route.js` parses uploaded resumes using Gemini API (`src/lib/gemini.js`).
  - **Enhanced Error Handling:** Implements retry logic with exponential backoff and model fallback for robust API calls.
  - Returns structured data matching the portfolio schema.
- **State Management:** Zustand store (`store/layoutStore.js`) holds all portfolio data, template, layout, and content.
- **Editor:** `src/app/editor/edit-resume/page.jsx` renders a dynamic form for each section based on the selected template/layout. Updates the Zustand store as the user edits. Right panel shows a live preview using the `Preview` component.
- **Portfolio Components:** `src/components/` contains all section components (Hero, About, Projects, etc.). `src/data/componentMap.js` maps section names to React components.
- **Templates:** Defined in `src/data/templates/templateManager.js`. Each template specifies a layout, theme, and sample data.
- **Schema:** `src/data/schemas/portfolioSchema.js` defines the full data structure for all portfolio types.
- **Rendering:** Live preview and final portfolio use the same logic to render the user's portfolio.

### 2. **How Data Flows**

1. Resume is parsed → structured data is returned.
2. Data is stored in Zustand (`portfolioData`, `content`).
3. Editor form reads/writes to Zustand.
4. Live preview and final portfolio use the same data and component mapping.

---

## 🎨 **Template System**

### **Dual Template Architecture**

The portfolio builder now supports two types of templates:

#### **1. Component-Based Templates**
- **Description:** Mix and match individual section components (Hero, About, Experience, etc.)
- **Flexibility:** Users can customize each section independently
- **Components:** Located in `src/components/[Section]/[Component].jsx`
- **Examples:** `HeroA`, `HeroB`, `HeroC`, `HeroD`, `AboutA`, `AboutB`, `AboutC`

#### **2. Full-Page Templates**
- **Description:** Complete, pre-designed portfolio pages as single components
- **Consistency:** Cohesive design across all sections
- **Components:** Located in `src/components/FullTemplates/[Template].jsx`
- **Examples:** `CleanfolioFull`, `CreativeFull`

### **Template Management**

- **Template Definitions:** `src/data/templates/templateManager.js`
- **Component Mapping:** `src/data/componentMap.js`
- **Preview Rendering:** `src/components/Preview.jsx`

### **Template Types**

| Type | Description | Location | Registration |
|------|-------------|----------|--------------|
| `"component"` | Individual section components | `src/components/[Section]/` | `componentMap.js` + `templateManager.js` |
| `"full"` | Complete portfolio pages | `src/components/FullTemplates/` | `componentMap.js` + `templateManager.js` |

---

## 📊 **Analytics & Tracking**

### **Real-Time Analytics System**
- **Portfolio Views**: Track every visit with detailed visitor information
- **Unique Visitors**: Based on IP + User Agent combination
- **Session Analytics**: Multi-page session tracking and bounce rate calculation
- **Device Analytics**: Desktop, mobile, tablet breakdown
- **Geographic Data**: Country/region based on IP address
- **Traffic Sources**: Referrer domain analysis

### **Event Tracking**
- **Page Views**: Automatic tracking of portfolio visits
- **User Interactions**: Resume downloads, contact form submissions
- **Social Clicks**: LinkedIn, GitHub, and other social media interactions
- **Time on Page**: Session duration and engagement metrics
- **Scroll Depth**: User engagement measurement

### **Analytics Dashboard**
- **Real-Time Metrics**: Live view counts and visitor data
- **Interactive Charts**: Line, Pie, and Bar charts for data visualization
- **Time Range Filtering**: 7-day, 30-day, 90-day analytics views
- **Export Capabilities**: Data export for further analysis

### **Technical Implementation**
```javascript
// PortfolioView Model
{
  portfolioId: ObjectId,
  userId: ObjectId,
  sessionId: String,
  ipAddress: String,
  userAgent: String,
  deviceType: String,
  browser: String,
  os: String,
  referrer: String,
  timeOnPage: Number,
  pagesViewed: Number,
  isBounce: Boolean,
  eventType: String,
  data: Object,
  timestamp: Date
}
```

---

## 🗂️ **Directory Structure**

```text
src/
  components/
    Hero/
      HeroA.jsx          # Original hero component
      HeroB.jsx          # Alternative hero design
      HeroC.jsx          # Modern minimalist hero
      HeroD.jsx          # Animated dynamic hero
    About/
      AboutA.jsx         # Original about component
      AboutB.jsx         # Alternative about design
      AboutC.jsx         # Card-based about layout
    FullTemplates/       # Full-page portfolio templates
      CleanfolioFull.jsx # Professional full-page template
      CreativeFull.jsx   # Artistic dark-themed template
    Showcase/
      ShowcaseA.jsx
    common/
      EditorNavbar.jsx   # Dynamic navigation component
      PortfolioUrlDisplay.jsx # URL display component
    ... (other sections)
  data/
    componentMap.js      # Maps component names to React components
    templates/
      templateManager.js # Template definitions and management
    schemas/
      portfolioSchema.js # Data structure definitions
  app/
    api/
      analytics/         # Analytics tracking endpoints
      portfolio/         # Portfolio management APIs
    editor/
      edit-resume/
        page.jsx         # Main editor interface
    templates-demo/
      page.jsx           # Template selection demo
    ... (other pages)
  store/
    layoutStore.js       # Zustand state management
  lib/
    gemini.js           # Enhanced Gemini API integration
  models/
    PortfolioView.js    # Analytics tracking model
```

---

## 🧩 **Adding New Templates and Components**

### **A. Adding New Section Components**

#### **Step 1: Create the Component**
```jsx
// src/components/Hero/HeroE.jsx
import { EMPTY_PORTFOLIO } from "@/data/schemas/portfolioSchema";

export default function HeroE({ data = EMPTY_PORTFOLIO, ...personalData }) {
  const personal = data?.personal || personalData || {};
  const fullName = personal.firstName && personal.lastName 
    ? `${personal.firstName} ${personal.lastName}`.trim() 
    : personal.title || "Your Name";
  
  return (
    <section className="your-hero-styles">
      <h1>{fullName}</h1>
      {/* Your component content */}
    </section>
  );
}
```

#### **Step 2: Register in Component Map**
```js
// src/data/componentMap.js
import HeroE from "@/components/Hero/HeroE";

export const componentMap = {
  // ... existing components
  HeroE: HeroE,
};

export const componentCategories = {
  hero: {
    name: "Hero Sections",
    components: ["HeroA", "HeroB", "HeroC", "HeroD", "HeroE"], // Add your component
  },
  // ... other categories
};
```

#### **Step 3: Add to Template Manager**
```js
// src/data/templates/templateManager.js
export const PORTFOLIO_TEMPLATES = {
  // ... existing templates
  myNewTemplate: {
    id: "myNewTemplate",
    name: "My New Template",
    type: "component", // or "full"
    category: "developer",
    description: "A new template using HeroE",
    layout: {
      hero: "HeroE", // Use your new component
      about: "AboutA",
      // ... other sections
    },
    theme: "modern",
    sampleData: { /* your sample data */ }
  },
};
```

### **B. Adding New Full-Page Templates**

#### **Step 1: Create the Full Template Component**
```jsx
// src/components/FullTemplates/MyFullTemplate.jsx
import { motion } from "framer-motion";
import { EMPTY_PORTFOLIO } from "@/data/schemas/portfolioSchema";

export default function MyFullTemplate({ data = EMPTY_PORTFOLIO }) {
  const personal = data?.personal || {};
  const about = data?.about || {};
  // ... extract other data

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="your-hero-section">
        <h1>{personal.firstName} {personal.lastName}</h1>
        {/* Your full template content */}
      </section>
      
      {/* About Section */}
      {about.summary && (
        <section className="your-about-section">
          <p>{about.summary}</p>
        </section>
      )}
      
      {/* Add other sections as needed */}
    </div>
  );
}
```

#### **Step 2: Register in Component Map**
```js
// src/data/componentMap.js
import MyFullTemplate from "@/components/FullTemplates/MyFullTemplate";

export const componentMap = {
  // ... existing components
  MyFullTemplate: MyFullTemplate,
};

export const componentCategories = {
  // ... existing categories
  fullTemplates: {
    name: "Full Page Templates",
    components: ["CleanfolioFull", "CreativeFull", "MyFullTemplate"], // Add your template
  },
};
```

#### **Step 3: Add to Template Manager**
```js
// src/data/templates/templateManager.js
export const PORTFOLIO_TEMPLATES = {
  // ... existing templates
  myFullTemplate: {
    id: "myFullTemplate",
    name: "My Full Template",
    type: "full", // Important: mark as full template
    component: "MyFullTemplate", // Reference to component name
    category: "designer",
    description: "A complete full-page portfolio template",
    theme: "creative",
    sampleData: { /* your sample data */ }
  },
};
```

### **C. Template Categories**

Available categories for organizing templates:
- `"developer"` - Software development focused
- `"designer"` - Design and creative focused  
- `"marketing"` - Marketing and business focused
- `"all"` - General purpose

### **D. Component Categories**

Available section categories:
- `"hero"` - Hero/Introduction sections
- `"about"` - About/Summary sections
- `"experience"` - Work experience sections
- `"education"` - Education sections
- `"skills"` - Skills and expertise sections
- `"projects"` - Project showcase sections
- `"achievements"` - Awards and achievements sections
- `"contact"` - Contact information sections
- `"fullTemplates"` - Complete full-page templates

---

## 🔧 **Recent Enhancements**

### **1. Dynamic Navigation System**
- **Auto-hide Functionality**: Progress bar disappears after 3 seconds of inactivity
- **Minimize/Maximize**: Toggle between compact and full navigation views
- **Smooth Transitions**: Opacity animations for seamless user experience
- **Scroll Detection**: Reappears on scroll or mouse movement
- **Mobile Optimized**: Responsive design for all device sizes

### **2. Enhanced Analytics System**
- **Real-Time Tracking**: Comprehensive visitor analytics with detailed metrics
- **Interactive Dashboard**: Charts and visualizations for data analysis
- **Event Tracking**: Custom user interaction monitoring
- **Geographic Data**: IP-based location tracking
- **Session Management**: Unique visitor identification

### **3. Enhanced Gemini API Integration**
- **Retry Logic:** Implements exponential backoff with jitter for transient failures
- **Model Fallback:** Automatically tries alternative models if primary fails
- **Timeout Handling:** Prevents hanging API requests
- **Better Error Reporting:** Clear feedback when mock data is used

### **4. New Component Variants**
- **HeroC:** Modern minimalist design with gradient backgrounds
- **HeroD:** Animated dynamic design with Framer Motion
- **AboutC:** Card-based layout with interests, values, and fun facts

### **5. Full-Page Templates**
- **CleanfolioFull:** Professional, clean design for developers
- **CreativeFull:** Artistic, dark-themed design with animations

### **6. Template Selection System**
- **TemplateSelector Component:** UI for choosing between component-based and full-page templates
- **Demo Page:** `/templates-demo` for interactive template exploration
- **Category Filtering:** Filter templates by category and type

### **7. Improved Preview System**
- **Unified Preview Component:** Handles both component-based and full-page templates
- **Real-time Updates:** Live preview reflects form changes immediately
- **Template Type Detection:** Automatically renders appropriate template type

---

## 🧑‍💻 **Team & Task Breakdown**

| Member             | Role                                | Responsibilities                                                                                                                                       |
| ------------------ | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Harshal Pande**  | Templates & Components Expansion    | Add new full-page templates, section components, document and map in `componentMap.js`, create sample data, (optional) write tests/stories             |
| **Hassan Mansuri** | UI/UX Polish & Animations           | Refine editor UI, add transitions/animations, polish preview, ensure responsiveness & a11y, add tooltips/onboarding, work with Harshal for consistency |
| **Omsingh Bais**   | Theming, Public Website, Deployment | Implement theming, add AI improvements, allow editing after save, add loading/error UI, maintain docs                                                  |

---

## 📚 **Learn More**

- [Next.js Documentation](https://nextjs.org/docs) — learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) — interactive Next.js tutorial.
- [Next.js GitHub](https://github.com/vercel/next.js) — feedback and contributions welcome!

---

## ▲ **Deploy on Vercel**

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

See [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## 🔍 **Troubleshooting**

### **Preview Not Showing Selected Template**
- Ensure the template is properly registered in `templateManager.js`
- Check that the component is mapped in `componentMap.js`
- Verify the template type (`"component"` vs `"full"`) is set correctly
- The `Preview` component automatically handles both template types

### **Component Not Rendering**
- Check that the component is exported as default
- Verify the component name matches the mapping in `componentMap.js`
- Ensure the component accepts the correct props (usually `data` or specific section props)

### **Template Selection Issues**
- Use the `/templates-demo` page to test template selection
- Check browser console for any mapping errors
- Verify template definitions in `templateManager.js`

### **Analytics Not Tracking**
- Check that the analytics API endpoints are properly configured
- Verify MongoDB connection for analytics data storage
- Ensure the `AnalyticsTracker` component is included in portfolio pages

---

> For further customization or questions, see code comments or ask your team lead.
