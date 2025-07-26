# 🚀 **Portifier: Next.js Portfolio Builder**

<p align="center">
  <img src="public/next.svg" alt="Next.js Logo" height="40"/>
  <img src="public/vercel.svg" alt="Vercel Logo" height="40"/>
  <img src="public/globe.svg" alt="Globe Logo" height="40"/>
</p>

<p align="center">
  <b>Build, customize, and deploy beautiful developer portfolios with ease.</b>
</p>

<p align="center">
  <a href="https://nextjs.org/">Next.js</a> • <a href="https://vercel.com/">Vercel</a> • <a href="#team--task-breakdown">Team</a>
</p>

---

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](#)
[![Next.js](https://img.shields.io/badge/Next.js-14-blue?logo=next.js)](https://nextjs.org/)
[![Made with Zustand](https://img.shields.io/badge/State-Zustand-29b6f6)](https://github.com/pmndrs/zustand)

---

## 📑 **Table of Contents**

- [Getting Started](#getting-started)
- [Architecture & Customization Guide](#portfolio-builder-architecture--customization-guide)
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

## 🏗️ **Portfolio Builder Architecture & Customization Guide**

### 1. **Flow: From Resume Parsing to Portfolio Rendering**

- **Resume Parsing:**
  - API: `src/app/api/parse-resume/route.js` parses uploaded resumes using Gemini API (`src/lib/gemini.js`).
  - Returns structured data matching the portfolio schema.
- **State Management:** Zustand store (`src/store/layoutStore.js`) holds all portfolio data, template, layout, and content.
- **Editor:** `src/app/editor/edit-resume/page.jsx` renders a dynamic form for each section based on the selected template/layout. Updates the Zustand store as the user edits. Right panel shows a live preview using the actual portfolio components.
- **Portfolio Components:** `src/components/` contains all section components (Hero, About, Projects, etc.). `src/data/componentMap.js` maps section names to React components.
- **Templates:** Defined in `src/data/templates/templateManager.js`. Each template specifies a layout, theme, and sample data.
- **Schema:** `src/data/schemas/portfolioSchema.js` defines the full data structure for all portfolio types.
- **Rendering:** Live preview and final portfolio use the same logic to render the user’s portfolio.

### 2. **How Data Flows**

1. Resume is parsed → structured data is returned.
2. Data is stored in Zustand (`portfolioData`, `content`).
3. Editor form reads/writes to Zustand.
4. Live preview and final portfolio use the same data and component mapping.

### 3. **Adding New Templates and Components**

#### A. **Add a Complete Template Portfolio**

- **Where:** `src/data/templates/templateManager.js`
- **How:**
  1. Add a new entry to `PORTFOLIO_TEMPLATES` with a unique `id`, `name`, `layout`, `theme`, and `sampleData`.
  2. The `layout` field maps section names to component names (e.g., `"hero": "HeroA"`).
  3. Add a preview image in `/public/templates/` if needed.

#### B. **Add New Section Components**

- **Where:** `src/components/`
- **How:**
  1. Create a new file for your component, e.g., `src/components/Hero/HeroAnimated.jsx`.
  2. Export the component.
  3. Add it to `src/data/componentMap.js` so it can be referenced in templates/layouts.

#### C. **Let Users Pick Components One by One**

- **How:**
  1. In your UI, allow users to select which component to use for each section.
  2. Update the `layout` in Zustand to reflect their choices.
  3. The editor and preview will automatically use the selected components.

---

## 🗂️ **Directory Structure**

```text
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

---

## 🧩 **How Data Is Populated and Used**

- **Parsing:** Data is parsed and set in Zustand.
- **Form:** Reads and writes to Zustand (`formData` mirrors `content`/`portfolioData`).
- **Preview:** Reads from Zustand and passes the correct props to each section/component.
- **Component Map:** Ensures the right React component is used for each section, based on the current layout/template.

---

## 🎨 **Adding Full-Page Portfolio Templates**

You can use fully coded, single-page portfolio templates (not just section components) in your system. Here’s how:

#### A. **Where to Add Full Templates**

- Place your full template component in `src/components/FullTemplates/` (recommended) or as a page in `src/app/templates/`.

#### B. **Registering the Template**

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

#### C. **How Full Templates Get Data**

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

#### D. **Customization**

- The user customizes their data in the editor as usual.
- The full template component should use the data fields (not hardcoded content), so any changes in the editor are reflected in the preview and final output.
- For per-section overrides, add logic in your full template to optionally render a different component if specified.

#### E. **Supporting Both Section-Based and Full-Page Templates**

```js
if (currentTemplate.type === "full" && currentTemplate.component) {
	// Render the full template with all data
	return <currentTemplate.component data={portfolioData} />;
} else {
	// Render section-based layout as before
}
```

#### F. **Summary Table**

| Type               | Where to Add Code                                                    | How Data is Passed       | How to Register in TemplateManager |
| ------------------ | -------------------------------------------------------------------- | ------------------------ | ---------------------------------- |
| Section Component  | `src/components/Section/SectionX.jsx`                                | As props to each section | In `componentMap.js` and `layout`  |
| Full Page Template | `src/components/FullTemplates/TemplateX.jsx` or `src/app/templates/` | As a single `data` prop  | As `component` in templateManager  |

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

> For further customization or questions, see code comments or ask your team lead.
