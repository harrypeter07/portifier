// Data Transformation Utilities for Portfolio Schema Integration
// Handles conversion between old formats, parsed resume data, and new schema

import { EMPTY_PORTFOLIO, PORTFOLIO_SCHEMA } from '@/data/schemas/portfolioSchema';

/**
 * Transform parsed resume data from Gemini API to new portfolio schema format
 * @param {Object} parsedData - Raw data from Gemini API
 * @param {String} portfolioType - Type of portfolio (developer, designer, marketing, etc.)
 * @returns {Object} - Transformed data matching new portfolio schema
 */
export const transformParsedResumeToSchema = (parsedData, portfolioType = 'developer') => {
  const transformed = JSON.parse(JSON.stringify(EMPTY_PORTFOLIO));
  
  if (!parsedData) return transformed;

  try {
    // Transform Personal Information
    if (parsedData.hero || parsedData.personal) {
      const heroData = parsedData.hero || parsedData.personal || {};
      
      // Handle name extraction from title field or separate fields
      if (heroData.title && typeof heroData.title === 'string') {
        const nameParts = heroData.title.trim().split(' ');
        transformed.personal.firstName = nameParts[0] || '';
        transformed.personal.lastName = nameParts.slice(1).join(' ') || '';
      }
      
      if (heroData.firstName) transformed.personal.firstName = heroData.firstName;
      if (heroData.lastName) transformed.personal.lastName = heroData.lastName;
      if (heroData.subtitle) transformed.personal.title = heroData.subtitle;
      if (heroData.tagline) transformed.personal.tagline = heroData.tagline;
    }

    // Transform Contact Information
    if (parsedData.contact) {
      const contactData = parsedData.contact;
      transformed.personal.email = contactData.email || '';
      transformed.personal.phone = contactData.phone || '';
      
      if (contactData.location) {
        // Parse location string into components
        const locationParts = contactData.location.split(',').map(p => p.trim());
        if (locationParts.length >= 2) {
          transformed.personal.location.city = locationParts[0] || '';
          transformed.personal.location.state = locationParts[1] || '';
          transformed.personal.location.country = locationParts[2] || locationParts[1] || '';
        } else if (locationParts.length === 1) {
          transformed.personal.location.city = locationParts[0] || '';
        }
      }

      // Social links
      if (contactData.linkedin) transformed.personal.social.linkedin = contactData.linkedin;
      if (contactData.github) transformed.personal.social.github = contactData.github;
      if (contactData.website || contactData.portfolio) {
        transformed.personal.social.portfolio = contactData.website || contactData.portfolio;
      }
    }

    // Transform About Section
    if (parsedData.about) {
      transformed.about.summary = parsedData.about.summary || '';
      transformed.about.bio = parsedData.about.bio || parsedData.about.summary || '';
      
      // Extract years of experience if mentioned
      if (parsedData.about.yearsOfExperience) {
        transformed.about.bio += `\n\nExperience: ${parsedData.about.yearsOfExperience} years`;
      }
    }

    // Transform Experience
    if (parsedData.experience?.jobs) {
      transformed.experience.jobs = parsedData.experience.jobs.map(job => ({
        id: generateId(),
        company: job.company || '',
        position: job.title || job.position || '',
        location: job.location || '',
        startDate: extractStartDate(job.duration) || '',
        endDate: extractEndDate(job.duration) || '',
        current: checkIfCurrent(job.duration),
        description: job.description || '',
        responsibilities: parseResponsibilities(job.description),
        achievements: [],
        technologies: job.technologies || [],
        projects: [],
        companyLogo: '',
        companyWebsite: ''
      }));
    }

    // Transform Education
    if (parsedData.education?.degrees) {
      transformed.education.degrees = parsedData.education.degrees.map(degree => ({
        id: generateId(),
        institution: degree.institution || '',
        degree: degree.degree || '',
        field: degree.field || '',
        grade: degree.gpa || '',
        startDate: '',
        endDate: degree.year || '',
        current: false,
        description: '',
        courses: [],
        activities: [],
        honors: [],
        thesis: '',
        logo: ''
      }));
    }

    // Transform Skills
    if (parsedData.skills) {
      // Technical skills with categorization
      if (parsedData.skills.technical) {
        const techSkills = Array.isArray(parsedData.skills.technical) 
          ? parsedData.skills.technical 
          : [parsedData.skills.technical];
        
        transformed.skills.technical = [{
          category: 'Technical Skills',
          skills: techSkills.map(skill => ({
            name: typeof skill === 'string' ? skill : skill.name || skill,
            level: 'intermediate',
            years: 0,
            icon: '',
            certified: false
          }))
        }];
      }

      // Soft skills
      if (parsedData.skills.soft) {
        transformed.skills.soft = parsedData.skills.soft.map(skill => ({
          name: typeof skill === 'string' ? skill : skill.name || skill,
          description: '',
          examples: []
        }));
      }

      // Languages
      if (parsedData.skills.languages) {
        transformed.skills.languages = parsedData.skills.languages.map(lang => ({
          name: typeof lang === 'string' ? lang.split('(')[0].trim() : lang.name || lang,
          proficiency: extractProficiency(lang),
          certification: ''
        }));
      }
    }

    // Transform Projects
    if (parsedData.projects?.items) {
      transformed.projects.items = parsedData.projects.items.map(project => ({
        id: generateId(),
        title: project.name || project.title || '',
        description: project.description || '',
        longDescription: '',
        category: 'Web Development',
        tags: project.technologies || [],
        technologies: project.technologies || project.tools || [],
        status: 'completed',
        startDate: '',
        endDate: '',
        images: [],
        videos: [],
        links: {
          live: project.url || project.link || '',
          github: project.github || '',
          demo: project.url || project.link || '',
          documentation: ''
        },
        features: [],
        challenges: [],
        learnings: [],
        teamSize: 0,
        role: '',
        client: '',
        metrics: {
          users: '',
          performance: '',
          impact: ''
        },
        testimonial: {
          text: '',
          author: '',
          title: '',
          avatar: ''
        }
      }));
    }

    // Transform Achievements
    if (parsedData.achievements) {
      if (parsedData.achievements.awards) {
        transformed.achievements.awards = parsedData.achievements.awards.map(award => ({
          id: generateId(),
          title: typeof award === 'string' ? award : award.title || award,
          organization: '',
          date: '',
          description: '',
          image: '',
          link: '',
          category: 'recognition'
        }));
      }

      if (parsedData.achievements.certifications) {
        transformed.achievements.certifications = parsedData.achievements.certifications.map(cert => ({
          id: generateId(),
          name: typeof cert === 'string' ? cert : cert.name || cert,
          organization: '',
          issueDate: '',
          expiryDate: '',
          credentialId: '',
          verificationLink: '',
          image: '',
          skills: []
        }));
      }

      if (parsedData.achievements.publications) {
        transformed.achievements.publications = parsedData.achievements.publications.map(pub => ({
          id: generateId(),
          title: typeof pub === 'string' ? pub : pub.title || pub,
          type: 'article',
          publisher: '',
          date: '',
          description: '',
          link: '',
          coAuthors: [],
          citations: 0
        }));
      }
    }

    // Set contact information from personal data
    transformed.contact.email = transformed.personal.email;
    transformed.contact.phone = transformed.personal.phone;
    transformed.contact.preferredContact = 'email';

    // Set metadata
    transformed.metadata.title = `${transformed.personal.firstName} ${transformed.personal.lastName} - Portfolio`.trim();
    transformed.metadata.description = transformed.about.summary || 'Professional portfolio';

    return transformed;

  } catch (error) {
    console.error('Error transforming parsed resume data:', error);
    return transformed;
  }
};

/**
 * Transform old component props format to new schema format
 * @param {Object} oldData - Data in old component props format
 * @param {Object} layout - Current layout configuration
 * @returns {Object} - Data transformed to new schema format
 */
export const transformLegacyDataToSchema = (oldData, layout) => {
  const transformed = JSON.parse(JSON.stringify(EMPTY_PORTFOLIO));
  
  if (!oldData) return transformed;

  try {
    // Transform hero/personal data
    if (oldData.hero) {
      const nameParts = (oldData.hero.title || '').split(' ');
      transformed.personal.firstName = nameParts[0] || '';
      transformed.personal.lastName = nameParts.slice(1).join(' ') || '';
      transformed.personal.title = oldData.hero.subtitle || '';
      transformed.personal.tagline = oldData.hero.tagline || '';
    }

    // Transform about data
    if (oldData.about) {
      transformed.about.summary = oldData.about.summary || '';
    }

    // Transform contact data
    if (oldData.contact) {
      transformed.personal.email = oldData.contact.email || '';
      transformed.personal.phone = oldData.contact.phone || '';
      transformed.personal.social.linkedin = oldData.contact.linkedin || '';
      
      if (oldData.contact.location) {
        const locationParts = oldData.contact.location.split(',').map(p => p.trim());
        transformed.personal.location.city = locationParts[0] || '';
        transformed.personal.location.state = locationParts[1] || '';
        transformed.personal.location.country = locationParts[2] || locationParts[1] || '';
      }
    }

    // Transform experience
    if (oldData.experience?.jobs) {
      transformed.experience.jobs = oldData.experience.jobs.map(job => ({
        id: generateId(),
        company: job.company || '',
        position: job.title || '',
        location: job.location || '',
        startDate: extractStartDate(job.duration),
        endDate: extractEndDate(job.duration),
        current: checkIfCurrent(job.duration),
        description: job.description || '',
        responsibilities: parseResponsibilities(job.description),
        achievements: [],
        technologies: job.technologies || [],
        projects: [],
        companyLogo: '',
        companyWebsite: ''
      }));
    }

    // Transform education
    if (oldData.education?.degrees) {
      transformed.education.degrees = oldData.education.degrees.map(degree => ({
        id: generateId(),
        institution: degree.institution || '',
        degree: degree.degree || '',
        field: degree.field || '',
        grade: degree.gpa || '',
        startDate: '',
        endDate: degree.year || '',
        current: false,
        description: '',
        courses: [],
        activities: [],
        honors: [],
        thesis: '',
        logo: ''
      }));
    }

    // Transform skills
    if (oldData.skills) {
      if (oldData.skills.technical) {
        transformed.skills.technical = [{
          category: 'Technical Skills',
          skills: oldData.skills.technical.map(skill => ({
            name: skill,
            level: 'intermediate',
            years: 0,
            icon: '',
            certified: false
          }))
        }];
      }

      if (oldData.skills.soft) {
        transformed.skills.soft = oldData.skills.soft.map(skill => ({
          name: skill,
          description: '',
          examples: []
        }));
      }

      if (oldData.skills.languages) {
        transformed.skills.languages = oldData.skills.languages.map(lang => ({
          name: lang,
          proficiency: 'conversational',
          certification: ''
        }));
      }
    }

    // Transform projects/showcase
    if (oldData.showcase || oldData.projects) {
      const projectsData = oldData.showcase || oldData.projects;
      
      if (typeof projectsData.projects === 'string' && projectsData.projects) {
        // Handle comma-separated string format
        transformed.projects.items = projectsData.projects.split(',').map(proj => ({
          id: generateId(),
          title: proj.trim(),
          description: '',
          longDescription: '',
          category: 'Web Development',
          tags: [],
          technologies: [],
          status: 'completed',
          startDate: '',
          endDate: '',
          images: [],
          videos: [],
          links: {
            live: '',
            github: '',
            demo: '',
            documentation: ''
          },
          features: [],
          challenges: [],
          learnings: [],
          teamSize: 0,
          role: '',
          client: '',
          metrics: { users: '', performance: '', impact: '' },
          testimonial: { text: '', author: '', title: '', avatar: '' }
        }));
      } else if (projectsData.items) {
        // Handle items array format
        transformed.projects.items = projectsData.items.map(project => ({
          id: generateId(),
          title: project.name || project.title || '',
          description: project.description || '',
          longDescription: '',
          category: 'Web Development',
          tags: project.technologies || project.tags || [],
          technologies: project.technologies || project.tools || [],
          status: 'completed',
          startDate: '',
          endDate: '',
          images: [],
          videos: [],
          links: {
            live: project.url || project.link || '',
            github: project.github || '',
            demo: project.url || project.link || '',
            documentation: ''
          },
          features: [],
          challenges: [],
          learnings: [],
          teamSize: 0,
          role: '',
          client: '',
          metrics: { users: '', performance: '', impact: '' },
          testimonial: { text: '', author: '', title: '', avatar: '' }
        }));
      }
    }

    // Transform achievements
    if (oldData.achievements) {
      if (oldData.achievements.awards) {
        transformed.achievements.awards = oldData.achievements.awards.map(award => ({
          id: generateId(),
          title: award,
          organization: '',
          date: '',
          description: '',
          image: '',
          link: '',
          category: 'recognition'
        }));
      }

      if (oldData.achievements.certifications) {
        transformed.achievements.certifications = oldData.achievements.certifications.map(cert => ({
          id: generateId(),
          name: cert,
          organization: '',
          issueDate: '',
          expiryDate: '',
          credentialId: '',
          verificationLink: '',
          image: '',
          skills: []
        }));
      }

      if (oldData.achievements.publications) {
        transformed.achievements.publications = oldData.achievements.publications.map(pub => ({
          id: generateId(),
          title: pub,
          type: 'article',
          publisher: '',
          date: '',
          description: '',
          link: '',
          coAuthors: [],
          citations: 0
        }));
      }
    }

    return transformed;

  } catch (error) {
    console.error('Error transforming legacy data:', error);
    return transformed;
  }
};

/**
 * Transform new schema data to component props format for backwards compatibility
 * @param {Object} schemaData - Data in new schema format
 * @param {String} section - Section name (hero, about, etc.)
 * @returns {Object} - Data in component props format
 */
export const transformSchemaToComponentProps = (schemaData, section) => {
  if (!schemaData || !section) return {};

  try {
    switch (section) {
      case 'hero':
        return {
          data: schemaData
        };

      case 'about':
        return {
          summary: schemaData.about?.summary || '',
          data: schemaData
        };

      case 'experience':
        return {
          jobs: schemaData.experience?.jobs || [],
          data: schemaData
        };

      case 'education':
        return {
          degrees: schemaData.education?.degrees || [],
          data: schemaData
        };

      case 'skills':
        return {
          technical: flattenTechnicalSkills(schemaData.skills?.technical || []),
          soft: schemaData.skills?.soft?.map(s => s.name) || [],
          languages: schemaData.skills?.languages?.map(l => l.name) || [],
          data: schemaData
        };

      case 'projects':
      case 'showcase':
        return {
          items: schemaData.projects?.items || [],
          data: schemaData
        };

      case 'achievements':
        return {
          awards: schemaData.achievements?.awards?.map(a => a.title) || [],
          certifications: schemaData.achievements?.certifications?.map(c => c.name) || [],
          publications: schemaData.achievements?.publications?.map(p => p.title) || [],
          data: schemaData
        };

      case 'contact':
        return {
          email: schemaData.personal?.email || schemaData.contact?.email || '',
          phone: schemaData.personal?.phone || schemaData.contact?.phone || '',
          linkedin: schemaData.personal?.social?.linkedin || '',
          location: formatLocation(schemaData.personal?.location),
          data: schemaData
        };

      default:
        return { data: schemaData };
    }
  } catch (error) {
    console.error(`Error transforming schema to component props for section ${section}:`, error);
    return { data: schemaData };
  }
};

// Helper Functions
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const extractStartDate = (duration) => {
  if (!duration) return '';
  const match = duration.match(/(\w+\s+\d{4})/);
  return match ? match[1] : '';
};

const extractEndDate = (duration) => {
  if (!duration) return '';
  if (duration.toLowerCase().includes('present') || duration.toLowerCase().includes('current')) {
    return '';
  }
  const parts = duration.split(' - ');
  return parts[1] ? parts[1].trim() : '';
};

const checkIfCurrent = (duration) => {
  if (!duration) return false;
  return duration.toLowerCase().includes('present') || duration.toLowerCase().includes('current');
};

const parseResponsibilities = (description) => {
  if (!description) return [];
  return description.split('\n')
    .map(line => line.replace(/^[•\-*]\s*/, '').trim())
    .filter(line => line.length > 0);
};

const extractProficiency = (languageString) => {
  if (!languageString) return 'conversational';
  const lower = languageString.toLowerCase();
  if (lower.includes('native') || lower.includes('fluent')) return 'native';
  if (lower.includes('advanced')) return 'fluent';
  if (lower.includes('intermediate')) return 'conversational';
  if (lower.includes('basic') || lower.includes('beginner')) return 'basic';
  return 'conversational';
};

const flattenTechnicalSkills = (technicalSkillsArray) => {
  if (!Array.isArray(technicalSkillsArray)) return [];
  
  return technicalSkillsArray.reduce((acc, category) => {
    if (category.skills && Array.isArray(category.skills)) {
      return [...acc, ...category.skills.map(skill => skill.name || skill)];
    }
    return acc;
  }, []);
};

const formatLocation = (locationObj) => {
  if (!locationObj) return '';
  const { city, state, country } = locationObj;
  const parts = [city, state, country].filter(Boolean);
  return parts.join(', ');
};

/**
 * Validate data against portfolio schema
 * @param {Object} data - Data to validate
 * @returns {Object} - Validation result with errors
 */
export const validatePortfolioData = (data) => {
  const errors = [];
  const warnings = [];

  try {
    // Required field validation
    if (!data.personal?.firstName) errors.push('First name is required');
    if (!data.personal?.lastName) errors.push('Last name is required');
    if (!data.personal?.email) errors.push('Email is required');
    if (!data.about?.summary) warnings.push('Professional summary is recommended');

    // Email format validation
    if (data.personal?.email && !isValidEmail(data.personal.email)) {
      errors.push('Please provide a valid email address');
    }

    // Data completeness checks
    if (!data.experience?.jobs || data.experience.jobs.length === 0) {
      warnings.push('Adding work experience will make your portfolio more compelling');
    }

    if (!data.skills?.technical || data.skills.technical.length === 0) {
      warnings.push('Adding technical skills will help showcase your expertise');
    }

    if (!data.projects?.items || data.projects.items.length === 0) {
      warnings.push('Adding projects will demonstrate your practical experience');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      completeness: calculateCompleteness(data)
    };

  } catch (error) {
    return {
      isValid: false,
      errors: ['Data validation failed due to unexpected format'],
      warnings: [],
      completeness: 0
    };
  }
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const calculateCompleteness = (data) => {
  const sections = [
    { section: 'personal', weight: 20, complete: !!(data.personal?.firstName && data.personal?.lastName && data.personal?.email) },
    { section: 'about', weight: 15, complete: !!(data.about?.summary) },
    { section: 'experience', weight: 20, complete: !!(data.experience?.jobs && data.experience.jobs.length > 0) },
    { section: 'skills', weight: 15, complete: !!(data.skills?.technical && data.skills.technical.length > 0) },
    { section: 'projects', weight: 20, complete: !!(data.projects?.items && data.projects.items.length > 0) },
    { section: 'contact', weight: 10, complete: !!(data.personal?.email || data.contact?.email) }
  ];

  const totalWeight = sections.reduce((sum, s) => sum + s.weight, 0);
  const completedWeight = sections.reduce((sum, s) => sum + (s.complete ? s.weight : 0), 0);
  
  return Math.round((completedWeight / totalWeight) * 100);
};

export default {
  transformParsedResumeToSchema,
  transformLegacyDataToSchema,
  transformSchemaToComponentProps,
  validatePortfolioData
};
