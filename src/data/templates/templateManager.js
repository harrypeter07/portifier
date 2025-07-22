// Template Management System for Portfolio Builder
// Provides scalable template configurations with full schema support

import { EMPTY_PORTFOLIO } from '@/components/Skills/data/schemas/portfolioSchema';
import { getRecommendedLayout } from '@/components/Skills/data/componentMap';

// Template configurations with complete schema data
export const PORTFOLIO_TEMPLATES = {
  cleanfolio: {
    id: 'cleanfolio',
    name: 'Clean Portfolio',
    description: 'Minimalist and professional design perfect for developers',
    category: 'developer',
    preview: '/templates/cleanfolio-preview.jpg',
    layout: {
      hero: 'HeroA',
      about: 'AboutA',
      experience: 'ExperienceA',
      skills: 'SkillsA',
      projects: 'ShowcaseA',
      contact: 'ContactFormA'
    },
    theme: {
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      accentColor: '#F59E0B',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      font: 'Inter',
      darkMode: true,
      animations: true,
      layout: 'modern'
    },
    sampleData: {
      personal: {
        firstName: 'John',
        lastName: 'Doe',
        title: 'Full Stack Developer',
        subtitle: 'Building digital experiences that matter',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567',
        location: {
          city: 'San Francisco',
          state: 'CA',
          country: 'USA'
        },
        social: {
          linkedin: 'linkedin.com/in/johndoe',
          github: 'github.com/johndoe',
          portfolio: 'johndoe.dev',
          twitter: 'twitter.com/johndoe'
        },
        avatar: '',
        tagline: 'Passionate about creating scalable web applications',
        availability: 'Available for new opportunities'
      },
      about: {
        summary: 'Experienced full-stack developer with 5+ years building web applications. Passionate about clean code, user experience, and modern technologies.',
        bio: 'I\'m a dedicated software engineer who loves solving complex problems through code. When I\'m not coding, you can find me contributing to open source projects or exploring new technologies.',
        interests: ['Open Source', 'Machine Learning', 'Web Performance'],
        personalValues: ['Quality', 'Collaboration', 'Continuous Learning'],
        funFacts: ['Coffee enthusiast', 'Marathon runner', 'Tech blogger']
      },
      experience: {
        jobs: [
          {
            id: '1',
            company: 'Tech Corp',
            position: 'Senior Full Stack Developer',
            location: 'San Francisco, CA',
            startDate: 'Jan 2022',
            endDate: '',
            current: true,
            description: 'Lead development of scalable web applications using React and Node.js. Mentor junior developers and drive technical decisions.',
            responsibilities: [
              'Architected and built microservices handling 100k+ daily requests',
              'Led a team of 4 developers in building core platform features',
              'Implemented CI/CD pipelines reducing deployment time by 70%'
            ],
            achievements: [
              'Increased application performance by 40%',
              'Reduced bug reports by 60% through comprehensive testing'
            ],
            technologies: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker'],
            projects: ['E-commerce Platform', 'Analytics Dashboard'],
            companyLogo: '',
            companyWebsite: 'https://techcorp.com'
          }
        ]
      },
      education: {
        degrees: [
          {
            id: '1',
            institution: 'University of Technology',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            grade: '3.8 GPA',
            startDate: '2016',
            endDate: '2020',
            current: false,
            description: 'Focused on software engineering and data structures',
            courses: ['Data Structures', 'Algorithms', 'Database Systems'],
            activities: ['Programming Club President', 'Hackathon Winner'],
            honors: ['Dean\'s List', 'Magna Cum Laude'],
            thesis: 'Machine Learning Applications in Web Development',
            logo: ''
          }
        ]
      },
      skills: {
        technical: [
          {
            category: 'Frontend',
            skills: [
              { name: 'React', level: 'expert', years: 4, icon: '', certified: false },
              { name: 'JavaScript', level: 'expert', years: 5, icon: '', certified: false },
              { name: 'TypeScript', level: 'advanced', years: 3, icon: '', certified: false }
            ]
          },
          {
            category: 'Backend',
            skills: [
              { name: 'Node.js', level: 'expert', years: 4, icon: '', certified: false },
              { name: 'Python', level: 'advanced', years: 3, icon: '', certified: false },
              { name: 'PostgreSQL', level: 'advanced', years: 4, icon: '', certified: false }
            ]
          }
        ],
        soft: [
          { name: 'Leadership', description: 'Led multiple development teams', examples: ['Team Lead at Tech Corp'] },
          { name: 'Communication', description: 'Excellent presentation and writing skills', examples: ['Tech talks', 'Documentation'] }
        ],
        languages: [
          { name: 'English', proficiency: 'native', certification: '' },
          { name: 'Spanish', proficiency: 'conversational', certification: '' }
        ]
      },
      projects: {
        items: [
          {
            id: '1',
            title: 'E-commerce Platform',
            description: 'Full-stack e-commerce solution with payment integration',
            longDescription: 'Built a complete e-commerce platform handling thousands of transactions daily with advanced features like real-time inventory, payment processing, and analytics.',
            category: 'Web Application',
            tags: ['E-commerce', 'Full-stack', 'Payments'],
            technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'AWS'],
            status: 'completed',
            startDate: '2023-01',
            endDate: '2023-06',
            images: ['/projects/ecommerce-1.jpg', '/projects/ecommerce-2.jpg'],
            videos: [],
            links: {
              live: 'https://shop.example.com',
              github: 'https://github.com/johndoe/ecommerce',
              demo: 'https://demo.shop.example.com',
              documentation: 'https://docs.shop.example.com'
            },
            features: ['Payment Processing', 'Inventory Management', 'User Analytics'],
            challenges: ['Scaling to handle high traffic', 'Real-time inventory updates'],
            learnings: ['Microservices architecture', 'Payment security'],
            teamSize: 3,
            role: 'Lead Developer',
            client: 'Retail Corp',
            metrics: {
              users: '10,000+ active users',
              performance: '99.9% uptime',
              impact: '$2M+ in processed transactions'
            },
            testimonial: {
              text: 'John delivered an exceptional e-commerce platform that exceeded our expectations.',
              author: 'Sarah Johnson',
              title: 'CTO, Retail Corp',
              avatar: '/testimonials/sarah.jpg'
            }
          }
        ]
      },
      achievements: {
        awards: [
          {
            id: '1',
            title: 'Developer of the Year',
            organization: 'Tech Corp',
            date: '2023',
            description: 'Recognized for outstanding contributions to platform development',
            image: '/awards/developer-year.jpg',
            link: '',
            category: 'recognition'
          }
        ],
        certifications: [
          {
            id: '1',
            name: 'AWS Certified Solutions Architect',
            organization: 'Amazon Web Services',
            issueDate: '2023-03',
            expiryDate: '2026-03',
            credentialId: 'AWS-SAA-123456',
            verificationLink: 'https://aws.amazon.com/verification/123456',
            image: '/certs/aws-saa.png',
            skills: ['Cloud Architecture', 'AWS Services', 'Security']
          }
        ],
        publications: [
          {
            id: '1',
            title: 'Building Scalable React Applications',
            type: 'article',
            publisher: 'Medium',
            date: '2023-05',
            description: 'Guide on architecting large-scale React applications',
            link: 'https://medium.com/@johndoe/building-scalable-react',
            coAuthors: [],
            citations: 150
          }
        ],
        patents: []
      },
      contact: {
        email: 'john@example.com',
        phone: '+1 (555) 123-4567',
        preferredContact: 'email',
        timezone: 'PST',
        availability: 'Available for freelance and full-time opportunities',
        rates: {
          hourly: '$75-100',
          project: 'Varies by scope',
          retainer: 'Available'
        },
        services: ['Web Development', 'Technical Consulting', 'Code Reviews'],
        workingHours: '9 AM - 5 PM PST',
        responseTime: 'Within 24 hours'
      },
      metadata: {
        title: 'John Doe - Full Stack Developer Portfolio',
        description: 'Experienced full-stack developer specializing in React and Node.js',
        keywords: ['Full Stack Developer', 'React', 'Node.js', 'JavaScript', 'Web Development'],
        ogImage: '/og-images/john-doe-portfolio.jpg',
        canonicalUrl: 'https://johndoe.dev',
        schema: {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'John Doe',
          jobTitle: 'Full Stack Developer',
          url: 'https://johndoe.dev'
        }
      },
      theme: {
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF',
        accentColor: '#F59E0B',
        backgroundColor: '#FFFFFF',
        textColor: '#1F2937',
        font: 'Inter',
        darkMode: true,
        animations: true,
        layout: 'modern'
      },
      analytics: {
        googleAnalytics: '',
        googleTagManager: '',
        hotjar: '',
        mixpanel: '',
        customEvents: []
      }
    }
  },

  creative: {
    id: 'creative',
    name: 'Creative Portfolio',
    description: 'Bold and vibrant design perfect for designers and creatives',
    category: 'designer',
    preview: '/templates/creative-preview.jpg',
    layout: {
      hero: 'HeroB',
      about: 'AboutA',
      projects: 'ShowcaseA',
      skills: 'SkillsA',
      contact: 'ContactFormA'
    },
    theme: {
      primaryColor: '#8B5CF6',
      secondaryColor: '#7C3AED',
      accentColor: '#F59E0B',
      backgroundColor: '#FAFAFA',
      textColor: '#1F2937',
      font: 'Poppins',
      darkMode: true,
      animations: true,
      layout: 'creative'
    },
    sampleData: {
      // Similar structure with designer-focused content
      personal: {
        firstName: 'Jane',
        lastName: 'Smith',
        title: 'UI/UX Designer',
        subtitle: 'Creating beautiful digital experiences',
        // ... rest of personal data
      }
      // ... rest of template data
    }
  },

  business: {
    id: 'business',
    name: 'Business Portfolio',
    description: 'Professional and corporate design for business professionals',
    category: 'marketing',
    preview: '/templates/business-preview.jpg',
    layout: {
      hero: 'HeroA',
      about: 'AboutA',
      experience: 'ExperienceA',
      achievements: 'AchievementsA',
      contact: 'ContactFormA'
    },
    theme: {
      primaryColor: '#1F2937',
      secondaryColor: '#374151',
      accentColor: '#059669',
      backgroundColor: '#FFFFFF',
      textColor: '#111827',
      font: 'Roboto',
      darkMode: false,
      animations: false,
      layout: 'corporate'
    },
    sampleData: {
      // Business-focused sample data
    }
  }
};

// Template utility functions
export const getTemplate = (templateId) => {
  return PORTFOLIO_TEMPLATES[templateId] || null;
};

export const getAllTemplates = () => {
  return Object.values(PORTFOLIO_TEMPLATES);
};

export const getTemplatesByCategory = (category) => {
  return Object.values(PORTFOLIO_TEMPLATES).filter(template => 
    template.category === category
  );
};

export const createTemplateFromPortfolioType = (portfolioType) => {
  const layout = getRecommendedLayout(portfolioType);
  const baseTemplate = PORTFOLIO_TEMPLATES.cleanfolio;
  
  return {
    id: `custom-${portfolioType}`,
    name: `${portfolioType.charAt(0).toUpperCase() + portfolioType.slice(1)} Template`,
    description: `Optimized template for ${portfolioType} portfolios`,
    category: portfolioType,
    layout,
    theme: baseTemplate.theme,
    sampleData: JSON.parse(JSON.stringify(EMPTY_PORTFOLIO))
  };
};

export const mergeTemplateWithData = (template, userData) => {
  if (!template || !userData) return template;
  
  return {
    ...template,
    sampleData: {
      ...template.sampleData,
      ...userData,
      // Preserve template theme if user hasn't customized it
      theme: userData.theme?.primaryColor 
        ? userData.theme 
        : template.theme
    }
  };
};

export const validateTemplate = (template) => {
  const errors = [];
  
  if (!template.id) errors.push('Template ID is required');
  if (!template.name) errors.push('Template name is required');
  if (!template.layout) errors.push('Template layout is required');
  if (!template.theme) errors.push('Template theme is required');
  
  // Validate layout components exist
  if (template.layout) {
    Object.values(template.layout).forEach(componentName => {
      // This would need to be implemented with actual component checking
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export default {
  PORTFOLIO_TEMPLATES,
  getTemplate,
  getAllTemplates,
  getTemplatesByCategory,
  createTemplateFromPortfolioType,
  mergeTemplateWithData,
  validateTemplate
};
