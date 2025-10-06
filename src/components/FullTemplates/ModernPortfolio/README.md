# ModernPortfolio Template

## How to integrate your multi-file template:

### Step 1: Copy your template files here
Paste your entire `src` folder contents into this directory:
```
src/components/FullTemplates/ModernPortfolio/
├── components/          # Your template components
├── pages/              # Your template pages  
├── layouts/            # Your template layouts
├── styles/             # Your template CSS files
├── assets/             # Your template assets
└── index.js            # Main entry point (create this)
```

### Step 2: Create the main entry point
Create `index.js` in this folder that exports your main template component:

```javascript
// src/components/FullTemplates/ModernPortfolio/index.js
export { default } from './pages/YourMainPage'; // or wherever your main component is
```

### Step 3: Update imports
Make sure all imports in your template files use relative paths or update them to work from this location.

### Step 4: Register the template
Add your template to the template list in `src/app/editor/page.jsx`:

```javascript
import ModernPortfolio from "@/components/FullTemplates/ModernPortfolio";

const PREBUILT_TEMPLATES = [
  // ... existing templates
  {
    name: "Modern Portfolio",
    layout: FULL_LAYOUT,
    content: sampleDataCleanfolio,
    component: ModernPortfolio, // Add this
  },
];
```
