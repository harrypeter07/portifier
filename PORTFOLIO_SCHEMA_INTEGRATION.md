# Portfolio Schema Integration Guide

## 🎯 Perfect Schema for Main App ↔ Templates App Integration

This document defines the exact schema that both apps should use for seamless integration.

## 📋 Complete Portfolio Schema

### Core Structure
```javascript
{
  // Template identification
  templateId: "modern-resume", // or "minimal-card", etc.
  
  // Complete portfolio data (this is what templates app expects)
  data: {
    // Personal information
    personal: {
      firstName: "John",
      lastName: "Doe", 
      title: "Full Stack Developer",
      subtitle: "Building digital experiences that matter",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      location: {
        city: "San Francisco",
        state: "CA", 
        country: "USA"
      },
      social: {
        linkedin: "linkedin.com/in/johndoe",
        github: "github.com/johndoe",
        portfolio: "johndoe.dev",
        twitter: "twitter.com/johndoe",
        instagram: "",
        behance: "",
        dribbble: "",
        medium: "",
        youtube: ""
      },
      avatar: "/path/to/avatar.jpg",
      tagline: "Passionate about creating scalable web applications",
      availability: "Available for new opportunities"
    },

    // About section
    about: {
      summary: "Experienced full-stack developer with 5+ years building web applications...",
      bio: "I'm a dedicated software engineer who loves solving complex problems...",
      interests: ["Open Source", "Machine Learning", "Web Performance"],
      personalValues: ["Quality", "Collaboration", "Continuous Learning"],
      funFacts: ["Coffee enthusiast", "Marathon runner", "Tech blogger"]
    },

    // Work experience
    experience: {
      jobs: [
        {
          id: "1",
          company: "Tech Corp",
          position: "Senior Full Stack Developer", 
          location: "San Francisco, CA",
          startDate: "Jan 2022",
          endDate: "",
          current: true,
          description: "Lead development of scalable web applications using React and Node.js...",
          responsibilities: [
            "Architected and built microservices handling 100k+ daily requests",
            "Led a team of 4 developers in building core platform features",
            "Implemented CI/CD pipelines reducing deployment time by 70%"
          ],
          achievements: [
            "Increased application performance by 40%",
            "Reduced bug reports by 60% through comprehensive testing"
          ],
          technologies: ["React", "Node.js", "TypeScript", "AWS", "Docker"],
          projects: ["E-commerce Platform", "Analytics Dashboard"],
          companyLogo: "/logos/techcorp.png",
          companyWebsite: "https://techcorp.com"
        }
      ]
    },

    // Education
    education: {
      degrees: [
        {
          id: "1",
          institution: "University of Technology",
          degree: "Bachelor of Science",
          field: "Computer Science", 
          grade: "3.8 GPA",
          startDate: "2016",
          endDate: "2020",
          current: false,
          description: "Focused on software engineering and data structures",
          courses: ["Data Structures", "Algorithms", "Database Systems"],
          activities: ["Programming Club President", "Hackathon Winner"],
          honors: ["Dean's List", "Magna Cum Laude"],
          thesis: "Machine Learning Applications in Web Development",
          logo: "/logos/university.png"
        }
      ]
    },

    // Skills organized by categories
    skills: {
      technical: [
        {
          category: "Frontend",
          skills: [
            {
              name: "React",
              level: "expert", // beginner, intermediate, advanced, expert
              years: 4,
              icon: "/icons/react.svg",
              certified: false
            },
            {
              name: "JavaScript", 
              level: "expert",
              years: 5,
              icon: "/icons/javascript.svg",
              certified: false
            }
          ]
        },
        {
          category: "Backend",
          skills: [
            {
              name: "Node.js",
              level: "expert", 
              years: 4,
              icon: "/icons/nodejs.svg",
              certified: false
            }
          ]
        }
      ],
      soft: [
        {
          name: "Leadership",
          description: "Led multiple development teams",
          examples: ["Team Lead at Tech Corp"]
        },
        {
          name: "Communication", 
          description: "Excellent presentation and writing skills",
          examples: ["Tech talks", "Documentation"]
        }
      ],
      languages: [
        {
          name: "English",
          proficiency: "native", // native, fluent, conversational, basic
          certification: ""
        },
        {
          name: "Spanish",
          proficiency: "conversational", 
          certification: ""
        }
      ]
    },

    // Projects/Portfolio items
    projects: {
      items: [
        {
          id: "1",
          title: "E-commerce Platform",
          description: "Full-stack e-commerce solution with payment integration",
          longDescription: "Built a complete e-commerce platform handling thousands of transactions daily...",
          category: "Web Application",
          tags: ["E-commerce", "Full-stack", "Payments"],
          technologies: ["React", "Node.js", "MongoDB", "Stripe", "AWS"],
          status: "completed", // completed, in-progress, planned
          startDate: "2023-01",
          endDate: "2023-06", 
          images: ["/projects/ecommerce-1.jpg", "/projects/ecommerce-2.jpg"],
          videos: [],
          links: {
            live: "https://shop.example.com",
            github: "https://github.com/johndoe/ecommerce",
            demo: "https://demo.shop.example.com",
            documentation: "https://docs.shop.example.com"
          },
          features: ["Payment Processing", "Inventory Management", "User Analytics"],
          challenges: ["Scaling to handle high traffic", "Real-time inventory updates"],
          learnings: ["Microservices architecture", "Payment security"],
          teamSize: 3,
          role: "Lead Developer",
          client: "Retail Corp",
          metrics: {
            users: "10,000+ active users",
            performance: "99.9% uptime", 
            impact: "$2M+ in processed transactions"
          },
          testimonial: {
            text: "John delivered an exceptional e-commerce platform that exceeded our expectations.",
            author: "Sarah Johnson",
            title: "CTO, Retail Corp",
            avatar: "/testimonials/sarah.jpg"
          }
        }
      ]
    },

    // Achievements and recognition
    achievements: {
      awards: [
        {
          id: "1",
          title: "Developer of the Year",
          organization: "Tech Corp",
          date: "2023",
          description: "Recognized for outstanding contributions to platform development",
          image: "/awards/developer-year.jpg",
          link: "",
          category: "recognition"
        }
      ],
      certifications: [
        {
          id: "1", 
          name: "AWS Certified Solutions Architect",
          organization: "Amazon Web Services",
          issueDate: "2023-03",
          expiryDate: "2026-03",
          credentialId: "AWS-SAA-123456",
          verificationLink: "https://aws.amazon.com/verification/123456",
          image: "/certs/aws-saa.png",
          skills: ["Cloud Architecture", "AWS Services", "Security"]
        }
      ],
      publications: [
        {
          id: "1",
          title: "Building Scalable React Applications", 
          type: "article", // article, book, research, blog
          publisher: "Medium",
          date: "2023-05",
          description: "Guide on architecting large-scale React applications",
          link: "https://medium.com/@johndoe/building-scalable-react",
          coAuthors: [],
          citations: 150
        }
      ],
      patents: [
        {
          id: "1",
          title: "Advanced Web Performance Optimization",
          number: "US123456789",
          status: "pending",
          date: "2023-01", 
          description: "Novel approach to optimizing web application performance",
          inventors: ["John Doe"],
          assignee: "Tech Corp"
        }
      ]
    },

    // Contact information
    contact: {
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      preferredContact: "email", // email, phone, linkedin
      timezone: "PST",
      availability: "Available for freelance and full-time opportunities",
      rates: {
        hourly: "$75-100",
        project: "Varies by scope", 
        retainer: "Available"
      },
      services: ["Web Development", "Technical Consulting", "Code Reviews"],
      workingHours: "9 AM - 5 PM PST",
      responseTime: "Within 24 hours"
    },

    // SEO and metadata
    metadata: {
      title: "John Doe - Full Stack Developer Portfolio",
      description: "Experienced full-stack developer specializing in React and Node.js",
      keywords: ["Full Stack Developer", "React", "Node.js", "JavaScript", "Web Development"],
      ogImage: "/og-images/john-doe-portfolio.jpg",
      canonicalUrl: "https://johndoe.dev",
      schema: {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "John Doe",
        jobTitle: "Full Stack Developer",
        url: "https://johndoe.dev"
      }
    },

    // Theme and styling preferences
    theme: {
      primaryColor: "#3B82F6",
      secondaryColor: "#1E40AF", 
      accentColor: "#F59E0B",
      backgroundColor: "#FFFFFF",
      textColor: "#1F2937",
      font: "Inter",
      darkMode: false,
      animations: true,
      layout: "modern"
    },

    // Analytics and tracking
    analytics: {
      googleAnalytics: "",
      googleTagManager: "",
      hotjar: "",
      mixpanel: "",
      customEvents: []
    }
  },

  // Optional rendering options
  options: {
    draft: false,
    version: "v1",
    format: "html" // html, pdf, png
  }
}
```

## 🔄 API Integration Flow

### 1. Main App → Templates App Request
```javascript
// POST /api/render
{
  "templateId": "modern-resume",
  "data": {
    // Complete portfolio data as shown above
    personal: { ... },
    about: { ... },
    experience: { ... },
    // ... all other sections
  },
  "options": {
    "draft": false,
    "version": "v1"
  }
}
```

### 2. Templates App Response
```javascript
{
  "html": "<!DOCTYPE html>...",
  "css": "body { font-family: Inter; }...",
  "meta": {
    "templateId": "modern-resume",
    "version": "v1.0.0",
    "renderedAt": "2024-01-15T10:30:00Z"
  }
}
```

## 🛠️ Implementation in Main App

### Updated API Route (`/api/render-portfolio/route.js`)
```javascript
export async function POST(request) {
  try {
    const { username } = await request.json();
    
    // 1. Get portfolio data from database
    const portfolioData = await getPortfolioFromDB(username);
    if (!portfolioData) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    // 2. Get API Key for templates app
    const apiKey = getTemplatesApiKey();

    // 3. Call Templates App with correct data structure
    const templatesAppUrl = process.env.TEMPLATES_APP_URL || "https://portumet.vercel.app";
    const response = await fetch(`${templatesAppUrl}/api/render`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        templateId: portfolioData.templateId,
        data: portfolioData.portfolioData, // ✅ Send only portfolioData, not entire object
        options: { draft: false, version: "v1" }
      })
    });

    if (!response.ok) {
      console.error(`Templates App error: ${response.status}`, await response.text());
      return NextResponse.json({ error: `Templates App error: ${response.status}` }, { status: response.status });
    }

    const result = await response.json();
    return new Response(result.html, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, s-maxage=300',
        'ETag': response.headers.get('ETag') || `"${Date.now()}"`
      }
    });

  } catch (error) {
    console.error("Render portfolio error:", error);
    return NextResponse.json({ error: "Render failed" }, { status: 500 });
  }
}
```

## 🎯 Key Points

1. **Data Structure**: The `data` field should contain ONLY the portfolio data (personal, about, experience, etc.)
2. **Template ID**: Must be a valid template ID that exists in the templates app
3. **Authentication**: Use API Key authentication with `Bearer` token
4. **Options**: Include rendering options like draft mode and version
5. **Response**: Templates app returns HTML and CSS that can be directly served

## 🔧 Required Environment Variables

### Main App (.env.local)
```bash
TEMPLATES_API_KEY=85af0b404444140bc4573c07a30ca9e6537125fce1b89ffb721aed3e94a24e02
TEMPLATES_APP_URL=http://localhost:3001
```

### Templates App (.env.local)
```bash
VALID_API_KEYS=85af0b404444140bc4573c07a30ca9e6537125fce1b89ffb721aed3e94a24e02,eed0c172295f25a9eb99c7298fc5be2604d5db50ce5f49f729c7942ba50a2f3d
```

## ✅ Validation Checklist

- [ ] Template ID is valid and exists in templates app
- [ ] Data structure matches the schema above
- [ ] API Key authentication is working
- [ ] Required fields are present (firstName, lastName, email, summary)
- [ ] Optional fields are properly formatted
- [ ] Arrays are properly structured
- [ ] Dates are in consistent format
- [ ] URLs are properly formatted
- [ ] Images have proper paths
- [ ] Social links are complete URLs

This schema ensures perfect compatibility between both apps and provides a comprehensive structure for all portfolio types.
