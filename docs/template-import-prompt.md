Reusable Prompt: Importing Portfolio Templates into This App

1) Tailwind CSS Compatibility
- Ensure your template uses Tailwind utilities available in this app’s config. If you need custom tokens, extend them in tailwind.config.js rather than replacing defaults.
- Avoid global resets that conflict with app styles. Scope any template-specific CSS.

2) Data Model Alignment
- Bind strictly to this schema shape passed as `portfolioData`:
  - personal: { firstName, lastName, title, subtitle, avatar, email, phone, location { city, state, country }, social { github, linkedin, ... } }
  - about: { summary, bio }
  - experience: { jobs: [{ id, company, position, location, startDate, endDate, description, technologies }] }
  - education: { degrees: [{ id, institution, degree, field, startDate, endDate, grade }] }
  - skills: { technical: [{ category, skills: [{ name, level, years }] }], soft: [{ name, description }], languages: [{ name, proficiency }] }
  - projects: { items: [{ id, title, description, links { live, github }, technologies, images: [url], videos: [url] }] }
  - achievements: { awards: [...], certifications: [...], publications: [...], patents: [...] }
  - contact: { email, phone }

3) Component Contract
- Export your component(s) and register them in `src/data/componentMap.ts[x]` with a unique key.
- Accept props in a stable shape: either `{ data: portfolioData }` or explicit props documented in existing components.
- Do not depend on `window` during SSR; mark client components with "use client" when necessary.

4) Code Delivery
- Provide minimal diffs and explicit file paths instead of whole folder dumps.
- List any new dependencies and where they are used.
- Include any required environment variables and fallback behavior.

5) Testing Checklist
- Build locally without TypeScript/lint errors.
- Open `/[username]` and verify all sections render; no undefined props.
- Confirm hero avatar (`personal.avatar`) and project media (`projects.items[].images/videos`) render without broken links.

6) Performance & Accessibility
- Prefer responsive images and lazy loading where applicable.
- Ensure color contrast and keyboard focus states are preserved.


