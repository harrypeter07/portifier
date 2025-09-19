# Templates App Development Prompt

## Overview
You are building a separate Next.js app called "Templates App" that exclusively renders portfolio templates and returns HTML/CSS to the Main App. The Main App owns MongoDB, auth, analytics, and URLs. Templates App must be stateless (no DB), secure (service-to-service JWT), fast (ETag/Cache-Control), and flexible (manifest + multiple templates).

- **Main App domain**: portume.com
- **Templates App domain**: templates.portume.com
- **Contract**: Main App calls Templates App via server-side proxy (or edge rewrite in future). Primary mode is render-from-payload; optional mode supports signed pull from Main App.

## Current Portfolio Schema (from Main App)

Based on the existing Main App implementation, here's the complete portfolio data structure:

### Core Portfolio Object
```typescript
interface Portfolio {
  id?: string;
  _id?: any; // MongoDB ObjectId
  username: string;
  templateId: string;
  templateName?: string;
  templateType?: "component" | "full";
  theme?: {
    color?: string;
    font?: string;
  };
  portfolioData?: PortfolioData;
  content?: Record<string, any>;
  layout?: Record<string, string>;
  currentTemplate?: TemplateDefinition;
  updatedAt?: string;
}
```

### Portfolio Data Structure
```typescript
interface PortfolioData {
  personal?: PersonalInfo;
  about?: AboutInfo;
  projects?: ProjectsInfo;
  skills?: SkillsInfo;
  experience?: ExperienceInfo;
  education?: EducationInfo;
  achievements?: AchievementsInfo;
  contact?: ContactInfo;
}

interface PersonalInfo {
  firstName?: string;
  lastName?: string;
  title?: string;
  subtitle?: string;
  tagline?: string;
  email?: string;
  phone?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  social?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
    instagram?: string;
    facebook?: string;
  };
}

interface AboutInfo {
  summary?: string;
  interests?: string[];
  values?: string[];
  funFacts?: string[];
}

interface ProjectsInfo {
  items?: ProjectItem[];
}

interface ProjectItem {
  title?: string;
  name?: string; // fallback for title
  description?: string;
  image?: string;
  technologies?: string[];
  links?: {
    live?: string;
    github?: string;
    demo?: string;
  };
  url?: string; // fallback for links.live
  github?: string; // fallback for links.github
  startDate?: string;
  endDate?: string;
  status?: "completed" | "in-progress" | "planned";
}

interface SkillsInfo {
  technical?: string[];
  soft?: string[];
  languages?: string[];
  tools?: string[];
  frameworks?: string[];
  databases?: string[];
}

interface ExperienceInfo {
  jobs?: JobItem[];
}

interface JobItem {
  position?: string;
  title?: string; // fallback for position
  company?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  duration?: string; // computed from dates if not provided
  description?: string;
  technologies?: string[];
  achievements?: string[];
  current?: boolean;
}

interface EducationInfo {
  degrees?: DegreeItem[];
}

interface DegreeItem {
  degree?: string;
  field?: string;
  institution?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  year?: string; // computed from dates if not provided
  grade?: string;
  gpa?: string;
  honors?: string[];
  relevantCoursework?: string[];
}

interface AchievementsInfo {
  awards?: string[];
  certifications?: string[];
  publications?: string[];
  recognitions?: string[];
}

interface ContactInfo {
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}
```

## Zod Schema Implementation

Create `packages/shared/portfolioSchema.ts`:

```typescript
import { z } from "zod";

const socialSchema = z.object({
  linkedin: z.string().optional(),
  github: z.string().optional(),
  twitter: z.string().optional(),
  website: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional()
}).optional();

const locationSchema = z.object({
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional()
}).optional();

const personalSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  tagline: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  location: locationSchema,
  social: socialSchema
}).optional();

const projectItemSchema = z.object({
  title: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  links: z.object({
    live: z.string().optional(),
    github: z.string().optional(),
    demo: z.string().optional()
  }).optional(),
  url: z.string().optional(),
  github: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.enum(["completed", "in-progress", "planned"]).optional()
});

const projectsSchema = z.object({
  items: z.array(projectItemSchema).optional()
});

const jobItemSchema = z.object({
  position: z.string().optional(),
  title: z.string().optional(),
  company: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  duration: z.string().optional(),
  description: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  achievements: z.array(z.string()).optional(),
  current: z.boolean().optional()
});

const experienceSchema = z.object({
  jobs: z.array(jobItemSchema).optional()
});

const degreeItemSchema = z.object({
  degree: z.string().optional(),
  field: z.string().optional(),
  institution: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  year: z.string().optional(),
  grade: z.string().optional(),
  gpa: z.string().optional(),
  honors: z.array(z.string()).optional(),
  relevantCoursework: z.array(z.string()).optional()
});

const educationSchema = z.object({
  degrees: z.array(degreeItemSchema).optional()
});

const achievementsSchema = z.object({
  awards: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  publications: z.array(z.string()).optional(),
  recognitions: z.array(z.string()).optional()
});

const skillsSchema = z.object({
  technical: z.array(z.string()).optional(),
  soft: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  tools: z.array(z.string()).optional(),
  frameworks: z.array(z.string()).optional(),
  databases: z.array(z.string()).optional()
});

const contactSchema = z.object({
  email: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  website: z.string().optional()
});

const aboutSchema = z.object({
  summary: z.string().optional(),
  interests: z.array(z.string()).optional(),
  values: z.array(z.string()).optional(),
  funFacts: z.array(z.string()).optional()
});

export const portfolioSchema = z.object({
  id: z.string().optional(),
  _id: z.any().optional(),
  username: z.string(),
  templateId: z.string(),
  templateName: z.string().optional(),
  templateType: z.enum(["component", "full"]).optional(),
  theme: z.object({
    color: z.string().optional(),
    font: z.string().optional()
  }).optional(),
  portfolioData: z.object({
    personal: personalSchema,
    about: aboutSchema,
    projects: projectsSchema,
    skills: skillsSchema,
    experience: experienceSchema,
    education: educationSchema,
    achievements: achievementsSchema,
    contact: contactSchema
  }).optional(),
  content: z.record(z.any()).optional(),
  layout: z.record(z.string()).optional(),
  currentTemplate: z.any().optional(),
  updatedAt: z.string().optional()
});

export function validatePortfolio(input: unknown) {
  return portfolioSchema.safeParse(input);
}

// Helper to normalize data (handle fallbacks)
export function normalizePortfolioData(data: any) {
  const personal = data?.personal || {};
  const projects = data?.projects?.items || [];
  const jobs = data?.experience?.jobs || [];
  const degrees = data?.education?.degrees || [];
  
  return {
    personal: {
      ...personal,
      fullName: [personal.firstName, personal.lastName].filter(Boolean).join(" ") || personal.title || "Your Name"
    },
    about: data?.about || {},
    projects: projects.map((p: any) => ({
      ...p,
      name: p.title || p.name,
      url: p.links?.live || p.url,
      github: p.links?.github || p.github
    })),
    skills: data?.skills || {},
    experience: jobs.map((j: any) => ({
      ...j,
      title: j.position || j.title,
      duration: j.duration || (j.startDate && j.endDate ? `${j.startDate} - ${j.endDate}` : 
                j.startDate ? `${j.startDate} - Present` : "")
    })),
    education: degrees.map((d: any) => ({
      ...d,
      year: d.year || (d.startDate && d.endDate ? `${d.startDate} - ${d.endDate}` : 
             d.startDate ? `${d.startDate} - Present` : "")
    })),
    achievements: data?.achievements || {},
    contact: data?.contact || {}
  };
}
```

## Template Implementation Guidelines

### Data Access Pattern
Always check if data exists before rendering sections:

```typescript
// Good: Check if data exists
{personal?.email && <p>{personal.email}</p>}

// Good: Check array length
{projects?.length > 0 && (
  <section>
    <h2>Projects</h2>
    {projects.map((project, i) => (
      <div key={i}>
        <h3>{project.title || project.name}</h3>
        {project.description && <p>{project.description}</p>}
        {project.technologies?.length > 0 && (
          <div>
            {project.technologies.map(tech => <span key={tech}>{tech}</span>)}
          </div>
        )}
      </div>
    ))}
  </section>
)}

// Good: Fallback values
<h1>{personal?.fullName || personal?.title || "Your Name"}</h1>
```

### Field Mapping (Handle Fallbacks)
```typescript
// Projects: title OR name
const projectName = project.title || project.name;

// Experience: position OR title  
const jobTitle = job.position || job.title;

// Links: prefer structured links, fallback to direct fields
const liveUrl = project.links?.live || project.url;
const githubUrl = project.links?.github || project.github;

// Duration computation
const duration = job.duration || 
  (job.startDate && job.endDate ? `${job.startDate} - ${job.endDate}` : 
   job.startDate ? `${job.startDate} - Present` : "");
```

### Template Structure Example
```typescript
export default function ModernResume({ data }: { data: any }) {
  const normalized = normalizePortfolioData(data);
  const { personal, about, projects, skills, experience, education, achievements } = normalized;

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      {/* Personal Section */}
      <section style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>
          {personal.fullName}
        </h1>
        {personal.subtitle && <h2 style={{ color: "#666", fontWeight: "normal" }}>{personal.subtitle}</h2>}
        {personal.tagline && <p style={{ fontStyle: "italic" }}>{personal.tagline}</p>}
        
        <div style={{ marginTop: "20px" }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span style={{ marginLeft: "20px" }}>{personal.phone}</span>}
        </div>
        
        {personal.location && (
          <p>{[personal.location.city, personal.location.state, personal.location.country].filter(Boolean).join(", ")}</p>
        )}
        
        {personal.social && (
          <div style={{ marginTop: "15px" }}>
            {personal.social.linkedin && <a href={personal.social.linkedin} target="_blank" rel="noopener">LinkedIn</a>}
            {personal.social.github && <a href={personal.social.github} target="_blank" rel="noopener" style={{ marginLeft: "15px" }}>GitHub</a>}
            {personal.social.website && <a href={personal.social.website} target="_blank" rel="noopener" style={{ marginLeft: "15px" }}>Website</a>}
          </div>
        )}
      </section>

      {/* About Section */}
      {about.summary && (
        <section style={{ marginBottom: "30px" }}>
          <h2>About</h2>
          <p>{about.summary}</p>
        </section>
      )}

      {/* Skills Section */}
      {(skills.technical?.length > 0 || skills.soft?.length > 0) && (
        <section style={{ marginBottom: "30px" }}>
          <h2>Skills</h2>
          {skills.technical?.length > 0 && (
            <div>
              <h3>Technical</h3>
              <p>{skills.technical.join(", ")}</p>
            </div>
          )}
          {skills.soft?.length > 0 && (
            <div>
              <h3>Soft Skills</h3>
              <p>{skills.soft.join(", ")}</p>
            </div>
          )}
        </section>
      )}

      {/* Experience Section */}
      {experience.length > 0 && (
        <section style={{ marginBottom: "30px" }}>
          <h2>Experience</h2>
          {experience.map((job, i) => (
            <div key={i} style={{ marginBottom: "20px" }}>
              <h3>{job.title} at {job.company}</h3>
              <p style={{ color: "#666" }}>
                {job.location && `${job.location} • `}
                {job.duration}
              </p>
              {job.description && <p>{job.description}</p>}
              {job.technologies?.length > 0 && (
                <p><strong>Technologies:</strong> {job.technologies.join(", ")}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Projects Section */}
      {projects.length > 0 && (
        <section style={{ marginBottom: "30px" }}>
          <h2>Projects</h2>
          {projects.map((project, i) => (
            <div key={i} style={{ marginBottom: "20px" }}>
              <h3>{project.name}</h3>
              {project.description && <p>{project.description}</p>}
              {project.technologies?.length > 0 && (
                <p><strong>Technologies:</strong> {project.technologies.join(", ")}</p>
              )}
              <div>
                {project.url && <a href={project.url} target="_blank" rel="noopener">Live Demo</a>}
                {project.github && <a href={project.github} target="_blank" rel="noopener" style={{ marginLeft: "15px" }}>GitHub</a>}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Education Section */}
      {education.length > 0 && (
        <section style={{ marginBottom: "30px" }}>
          <h2>Education</h2>
          {education.map((degree, i) => (
            <div key={i} style={{ marginBottom: "15px" }}>
              <h3>{degree.degree} in {degree.field}</h3>
              <p>{degree.institution}</p>
              <p style={{ color: "#666" }}>
                {degree.location && `${degree.location} • `}
                {degree.year}
                {degree.gpa && ` • GPA: ${degree.gpa}`}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* Achievements Section */}
      {(achievements.awards?.length > 0 || achievements.certifications?.length > 0) && (
        <section style={{ marginBottom: "30px" }}>
          <h2>Achievements</h2>
          {achievements.awards?.length > 0 && (
            <div>
              <h3>Awards</h3>
              <ul>
                {achievements.awards.map((award, i) => (
                  <li key={i}>{award}</li>
                ))}
              </ul>
            </div>
          )}
          {achievements.certifications?.length > 0 && (
            <div>
              <h3>Certifications</h3>
              <ul>
                {achievements.certifications.map((cert, i) => (
                  <li key={i}>{cert}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
```

## Environment Variables
```bash
SHARED_JWT_SECRET=your-shared-secret-with-main-app
ALLOWED_ORIGINS=https://portume.com
MAIN_API_BASE=https://portume.com
PREVIEW_JWT_SECRET=your-preview-secret (can reuse SHARED_JWT_SECRET)
```

## API Endpoints to Implement

### 1. POST /api/render
- Verify service JWT
- Validate portfolio data with schema
- Render template to HTML string
- Return `{ html, css, meta }` with ETag and cache headers

### 2. GET /api/templates/manifest
- Return array of available templates with metadata

### 3. GET /api/render/export (stub)
- Future: PDF/PNG export functionality

## Security Requirements
- Verify `Authorization: Bearer <jwt>` with HS256
- Require `scope: "render"` in JWT payload
- JWT expiration ≤ 5 minutes
- No database access in Templates App

## Performance Requirements
- Add ETag headers for caching
- Cache-Control: `public, s-maxage=300, stale-while-revalidate=600`
- Support 304 responses for unchanged content
- Co-locate with Main App in same Vercel region

## Template Registry Structure
```
templates/
  modern-resume/
    index.tsx          # Template component
    manifest.json      # Template metadata
    styles.css         # Optional custom styles
    assets/            # Images, fonts, etc.
  creative-portfolio/
    index.tsx
    manifest.json
    styles.css
    assets/
```

## Manifest Format
```json
{
  "id": "modern-resume",
  "name": "Modern Resume",
  "version": "1.0.0",
  "previewImage": "/templates/modern-resume/preview.png",
  "requiredSections": ["personal", "about", "experience"],
  "supportedExports": ["html", "pdf", "png"],
  "tags": ["developer", "clean", "professional"],
  "description": "Clean, professional resume template"
}
```

## Key Implementation Notes
1. **Always check for data existence** before rendering sections
2. **Handle fallbacks** (title/name, position/title, links structure)
3. **Normalize data** using the helper function
4. **Server-side rendering only** - no client JavaScript assumptions
5. **Responsive design** - templates should work on all screen sizes
6. **Accessibility** - proper heading hierarchy, alt text, semantic HTML
7. **Performance** - minimal CSS, efficient rendering

This prompt provides everything needed to build a robust Templates App that integrates seamlessly with the existing Main App while handling all the optional field scenarios properly.
