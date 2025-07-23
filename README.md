This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Portfolio Builder Architecture & Customization Guide

### 1. Flow: From Resume Parsing to Portfolio Rendering

- **Resume Parsing:**
  - API: `src/app/api/parse-resume/route.js` parses uploaded resumes using Gemini API (`src/lib/gemini.js`).
  - Returns structured data matching the portfolio schema.
- **State Management:**
  - Zustand store (`src/store/layoutStore.js`) holds all portfolio data, template, layout, and content.
- **Editor:**
  - `src/app/editor/edit-resume/page.jsx` renders a dynamic form for each section based on the selected template/layout.
  - Updates the Zustand store as the user edits.
  - Right panel shows a live preview using the actual portfolio components.
- **Portfolio Components:**
  - `src/components/` contains all section components (Hero, About, Projects, etc.).
  - `src/data/componentMap.js` maps section names to React components.
- **Templates:**
  - Defined in `src/data/templates/templateManager.js`.
  - Each template specifies a layout (which components to use), theme, and sample data.
- **Schema:**
  - `src/data/schemas/portfolioSchema.js` defines the full data structure for all portfolio types.
- **Rendering:**
  - Live preview and final portfolio use the same logic to render the user’s portfolio.

### 2. How Data Flows

1. Resume is parsed → structured data is returned.
2. Data is stored in Zustand (`portfolioData`, `content`).
3. Editor form reads/writes to Zustand.
4. Live preview and final portfolio use the same data and component mapping.

### 3. Adding New Templates and Components

#### A. Add a Complete Template Portfolio

- **Where:** `src/data/templates/templateManager.js`
- **How:**
  1. Add a new entry to `PORTFOLIO_TEMPLATES` with a unique `id`, `name`, `layout`, `theme`, and `sampleData`.
  2. The `layout` field maps section names to component names (e.g., `"hero": "HeroA"`).
  3. Add a preview image in `/public/templates/` if needed.

#### B. Add New Section Components

- **Where:** `src/components/`
- **How:**
  1. Create a new file for your component, e.g., `src/components/Hero/HeroAnimated.jsx`.
  2. Export the component.
  3. Add it to `src/data/componentMap.js` so it can be referenced in templates/layouts.

#### C. Let Users Pick Components One by One

- **How:**
  1. In your UI, allow users to select which component to use for each section.
  2. Update the `layout` in Zustand to reflect their choices.
  3. The editor and preview will automatically use the selected components.

### 4. Directory Structure

```
src/
  components/
    Hero/
      HeroA.jsx
      HeroAnimated.jsx
    Showcase/
      ShowcaseA.jsx
      ShowcaseAnimated.jsx
    ... (other sections)
  data/
    componentMap.js
    templates/
      templateManager.js
    schemas/
      portfolioSchema.js
  app/
    editor/
      edit-resume/
        page.jsx
    ... (other pages)
  store/
    layoutStore.js
```

- **Add new full templates** in `templateManager.js`.
- **Add new section components** in the appropriate folder in `components/`.
- **Map new components** in `componentMap.js`.

### 5. How Data Is Populated and Used

- **Parsing:** Data is parsed and set in Zustand.
- **Form:** Reads and writes to Zustand (`formData` mirrors `content`/`portfolioData`).
- **Preview:** Reads from Zustand and passes the correct props to each section/component.
- **Component Map:** Ensures the right React component is used for each section, based on the current layout/template.

### 6. Adding Full-Page Portfolio Templates

You can use fully coded, single-page portfolio templates (not just section components) in your system. Here’s how:

#### A. Where to Add Full Templates

- Place your full template component in `src/components/FullTemplates/` (recommended) or as a page in `src/app/templates/`.
- Example:
  ```
  src/components/FullTemplates/
    CleanfolioFull.jsx
    AnimatedPortfolio.jsx
    ...
  ```

#### B. Registering the Template

- In `src/data/templates/templateManager.js`, add an entry for your full template:
  ```js
  import CleanfolioFull from "@/components/FullTemplates/CleanfolioFull";
  // ...
  export const PORTFOLIO_TEMPLATES = {
  	cleanfolio: {
  		id: "cleanfolio",
  		name: "Cleanfolio (Full Page)",
  		type: "full", // mark as full template
  		component: CleanfolioFull, // reference the full template component
  		// ...other fields
  	},
  	// ...other templates
  };
  ```

#### C. How Full Templates Get Data

- Your full template component should accept a single `data` prop (the entire portfolio data object matching your schema):
  ```jsx
  export default function CleanfolioFull({ data }) {
  	// Use data.hero, data.projects, data.skills, etc.
  	return (
  		<main>
  			<header>{data.hero.title}</header>
  			{/* ...render all sections using data... */}
  		</main>
  	);
  }
  ```
- When rendering a full template, pass the entire portfolio data from Zustand:

  ```jsx
  import { useLayoutStore } from "@/store/layoutStore";
  import { getTemplate } from "@/data/templates/templateManager";

  const { portfolioData, currentTemplate } = useLayoutStore();
  const TemplateComponent = currentTemplate?.component;

  return TemplateComponent ? (
  	<TemplateComponent data={portfolioData} />
  ) : (
  	<div>Select a template</div>
  );
  ```

#### D. Customization

- The user customizes their data in the editor as usual.
- The full template component should use the data fields (not hardcoded content), so any changes in the editor are reflected in the preview and final output.
- For per-section overrides, add logic in your full template to optionally render a different component if specified.

#### E. Supporting Both Section-Based and Full-Page Templates

- In your template manager, distinguish between:
  - **Section-based templates:** Use the `layout` object to map sections to components.
  - **Full-page templates:** Use a `component` field to render the whole page at once.
- In your editor/preview logic, check the template type:
  ```js
  if (currentTemplate.type === "full" && currentTemplate.component) {
  	// Render the full template with all data
  	return <currentTemplate.component data={portfolioData} />;
  } else {
  	// Render section-based layout as before
  }
  ```

#### F. Summary Table

| Type               | Where to Add Code                                                    | How Data is Passed       | How to Register in TemplateManager |
| ------------------ | -------------------------------------------------------------------- | ------------------------ | ---------------------------------- |
| Section Component  | `src/components/Section/SectionX.jsx`                                | As props to each section | In `componentMap.js` and `layout`  |
| Full Page Template | `src/components/FullTemplates/TemplateX.jsx` or `src/app/templates/` | As a single `data` prop  | As `component` in templateManager  |

---

For further customization or questions, see the code comments or ask your team lead.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# p o r t i f i e r
