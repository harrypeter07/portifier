// Portfolio Data Schema - Industry Standard Structure
// This defines the complete data structure for all portfolio types

export const PORTFOLIO_SCHEMA = {
  // Core personal information
  personal: {
    firstName: "",
    lastName: "",
    title: "",
    subtitle: "",
    email: "",
    phone: "",
    location: {
      city: "",
      state: "",
      country: ""
    },
    social: {
      linkedin: "",
      github: "",
      portfolio: "",
      twitter: "",
      instagram: "",
      behance: "",
      dribbble: "",
      medium: "",
      youtube: ""
    },
    avatar: "",
    tagline: "",
    availability: ""
  },

  // About section with rich content
  about: {
    summary: "",
    bio: "",
    interests: [],
    personalValues: [],
    funFacts: []
  },

  // Experience with detailed structure
  experience: {
    jobs: [
      {
        id: "",
        company: "",
        position: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
        responsibilities: [],
        achievements: [],
        technologies: [],
        projects: [],
        companyLogo: "",
        companyWebsite: ""
      }
    ]
  },

  // Education with comprehensive details
  education: {
    degrees: [
      {
        id: "",
        institution: "",
        degree: "",
        field: "",
        grade: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
        courses: [],
        activities: [],
        honors: [],
        thesis: "",
        logo: ""
      }
    ]
  },

  // Skills organized by categories
  skills: {
    technical: [
      {
        category: "",
        skills: [
          {
            name: "",
            level: "", // beginner, intermediate, advanced, expert
            years: 0,
            icon: "",
            certified: false
          }
        ]
      }
    ],
    soft: [
      {
        name: "",
        description: "",
        examples: []
      }
    ],
    languages: [
      {
        name: "",
        proficiency: "", // native, fluent, conversational, basic
        certification: ""
      }
    ]
  },

  // Projects/Portfolio items
  projects: {
    items: [
      {
        id: "",
        title: "",
        description: "",
        longDescription: "",
        category: "",
        tags: [],
        technologies: [],
        status: "", // completed, in-progress, planned
        startDate: "",
        endDate: "",
        images: [],
        videos: [],
        links: {
          live: "",
          github: "",
          demo: "",
          documentation: ""
        },
        features: [],
        challenges: [],
        learnings: [],
        teamSize: 0,
        role: "",
        client: "",
        metrics: {
          users: "",
          performance: "",
          impact: ""
        },
        testimonial: {
          text: "",
          author: "",
          title: "",
          avatar: ""
        }
      }
    ]
  },

  // Achievements and recognition
  achievements: {
    awards: [
      {
        id: "",
        title: "",
        organization: "",
        date: "",
        description: "",
        image: "",
        link: "",
        category: ""
      }
    ],
    certifications: [
      {
        id: "",
        name: "",
        organization: "",
        issueDate: "",
        expiryDate: "",
        credentialId: "",
        verificationLink: "",
        image: "",
        skills: []
      }
    ],
    publications: [
      {
        id: "",
        title: "",
        type: "", // article, book, research, blog
        publisher: "",
        date: "",
        description: "",
        link: "",
        coAuthors: [],
        citations: 0
      }
    ],
    patents: [
      {
        id: "",
        title: "",
        number: "",
        status: "",
        date: "",
        description: "",
        inventors: [],
        assignee: ""
      }
    ]
  },

  // Contact information and preferences
  contact: {
    email: "",
    phone: "",
    preferredContact: "", // email, phone, linkedin
    timezone: "",
    availability: "",
    rates: {
      hourly: "",
      project: "",
      retainer: ""
    },
    services: [],
    workingHours: "",
    responseTime: ""
  },

  // SEO and metadata
  metadata: {
    title: "",
    description: "",
    keywords: [],
    ogImage: "",
    canonicalUrl: "",
    schema: {}
  },

  // Theme and styling preferences
  theme: {
    primaryColor: "",
    secondaryColor: "",
    accentColor: "",
    backgroundColor: "",
    textColor: "",
    font: "",
    darkMode: false,
    animations: true,
    layout: ""
  },

  // Analytics and tracking
  analytics: {
    googleAnalytics: "",
    googleTagManager: "",
    hotjar: "",
    mixpanel: "",
    customEvents: []
  }
};

// Default empty portfolio data
export const EMPTY_PORTFOLIO = {
  personal: {
    firstName: "",
    lastName: "",
    title: "",
    subtitle: "",
    email: "",
    phone: "",
    location: { city: "", state: "", country: "" },
    social: {},
    avatar: "",
    tagline: "",
    availability: ""
  },
  about: {
    summary: "",
    bio: "",
    interests: [],
    personalValues: [],
    funFacts: []
  },
  experience: { jobs: [] },
  education: { degrees: [] },
  skills: {
    technical: [],
    soft: [],
    languages: []
  },
  projects: { items: [] },
  achievements: {
    awards: [],
    certifications: [],
    publications: [],
    patents: []
  },
  contact: {
    email: "",
    phone: "",
    preferredContact: "email",
    timezone: "",
    availability: "",
    rates: {},
    services: [],
    workingHours: "",
    responseTime: ""
  },
  metadata: {
    title: "",
    description: "",
    keywords: [],
    ogImage: "",
    canonicalUrl: "",
    schema: {}
  },
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
  analytics: {
    googleAnalytics: "",
    googleTagManager: "",
    hotjar: "",
    mixpanel: "",
    customEvents: []
  }
};

// Data validation functions
export const validatePortfolioData = (data) => {
  const errors = [];
  
  // Validate required fields
  if (!data.personal?.firstName) errors.push("First name is required");
  if (!data.personal?.lastName) errors.push("Last name is required");
  if (!data.personal?.email) errors.push("Email is required");
  if (!data.about?.summary) errors.push("Professional summary is required");
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Portfolio type configurations
export const PORTFOLIO_TYPES = {
  developer: {
    requiredSections: ['personal', 'about', 'experience', 'skills', 'projects', 'contact'],
    optionalSections: ['education', 'achievements'],
    skillCategories: ['Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'Other'],
    projectCategories: ['Web App', 'Mobile App', 'API', 'Library', 'Tool', 'Game']
  },
  designer: {
    requiredSections: ['personal', 'about', 'projects', 'skills', 'contact'],
    optionalSections: ['experience', 'education', 'achievements'],
    skillCategories: ['UI/UX', 'Visual Design', 'Motion Graphics', 'Branding', 'Tools', 'Other'],
    projectCategories: ['Web Design', 'Mobile Design', 'Branding', 'Print', 'Motion Graphics', 'Illustration']
  },
  marketing: {
    requiredSections: ['personal', 'about', 'experience', 'skills', 'achievements', 'contact'],
    optionalSections: ['education', 'projects'],
    skillCategories: ['Digital Marketing', 'Analytics', 'Content', 'Social Media', 'Tools', 'Other'],
    projectCategories: ['Campaign', 'Strategy', 'Content', 'Analytics', 'Automation', 'Brand']
  },
  academic: {
    requiredSections: ['personal', 'about', 'education', 'achievements', 'contact'],
    optionalSections: ['experience', 'skills', 'projects'],
    skillCategories: ['Research', 'Teaching', 'Technical', 'Languages', 'Tools', 'Other'],
    projectCategories: ['Research', 'Publication', 'Grant', 'Teaching', 'Conference', 'Collaboration']
  }
};
