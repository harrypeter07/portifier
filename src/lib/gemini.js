import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Default portfolio schema - you can modify this or pass it as a parameter
const DEFAULT_PORTFOLIO_SCHEMA = {
  hero: {
    title: "Full name of the person",
    subtitle: "Professional title or role (e.g., Software Engineer, Designer)",
    tagline: "Brief catchy tagline or motto"
  },
  about: {
    summary: "Professional summary or bio paragraph",
    yearsOfExperience: "Number of years of experience",
    location: "Current location or preferred work location"
  },
  contact: {
    email: "Email address",
    phone: "Phone number",
    linkedin: "LinkedIn profile URL",
    github: "GitHub profile URL", 
    website: "Personal website URL",
    location: "City, State/Country"
  },
  experience: {
    jobs: [
      {
        title: "Job title",
        company: "Company name",
        duration: "Employment duration (e.g., Jan 2022 - Present)",
        location: "Job location",
        description: "Job description and key achievements",
        technologies: ["Technologies/tools used in this role"]
      }
    ]
  },
  education: {
    degrees: [
      {
        degree: "Degree name (e.g., Bachelor of Science)",
        field: "Field of study (e.g., Computer Science)",
        institution: "University/College name",
        year: "Graduation year or year range",
        gpa: "GPA if mentioned",
        location: "Institution location"
      }
    ]
  },
  skills: {
    technical: ["Technical skills like programming languages, frameworks, tools"],
    soft: ["Soft skills like leadership, communication, problem-solving"],
    languages: ["Spoken languages with proficiency levels"]
  },
  projects: {
    items: [
      {
        name: "Project name",
        description: "Project description",
        technologies: ["Technologies used"],
        url: "Project URL if available",
        github: "GitHub repository URL if available"
      }
    ]
  },
  achievements: {
    awards: ["Awards, certifications, recognitions"],
    certifications: ["Professional certifications"],
    publications: ["Publications, articles, blogs"]
  },
  interests: {
    hobbies: ["Personal interests and hobbies"],
    volunteer: ["Volunteer work and community involvement"]
  }
};

export async function parseResumeWithGemini(buffer, customSchema = null) {
  if (!process.env.GEMINI_API_KEY) {
    console.log("⚠️  No Google API key found, using mock data");
    return getMockData(customSchema || DEFAULT_PORTFOLIO_SCHEMA);
  }

  try {
    console.log("🤖 Calling Gemini API for resume parsing...");

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const schema = customSchema || DEFAULT_PORTFOLIO_SCHEMA;

    // Convert buffer to base64
    const base64Data = buffer.toString("base64");

    // Dynamic prompt that includes the schema
    const prompt = `
You are an expert resume parser. I will provide you with a resume PDF and a specific data structure schema. Your task is to:

1. Extract ALL relevant information from the resume PDF
2. Map the extracted information to the provided schema structure
3. Return a JSON object that matches the schema exactly
4. If information is not available in the resume, use null or empty arrays/strings as appropriate
5. Be intelligent about mapping - for example, if schema asks for "subtitle" and resume has "Software Engineer", map it appropriately
6. Extract as much detail as possible while staying within the schema structure

HERE IS THE TARGET SCHEMA STRUCTURE:
${JSON.stringify(schema, null, 2)}

IMPORTANT INSTRUCTIONS:
- Return ONLY a valid JSON object that matches this schema
- Do not include any explanations or additional text
- If a field cannot be filled from the resume, use appropriate empty values (null, "", [])
- Be smart about categorizing skills into technical vs soft skills
- Extract years of experience by analyzing work history
- Look for all contact information including social profiles
- Parse dates consistently (prefer formats like "Jan 2022 - Dec 2023")
- For projects, look in experience descriptions or dedicated project sections
- Include all achievements, awards, and certifications you find

Now analyze the resume and return the structured JSON:
`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "application/pdf",
          data: base64Data,
        },
      },
    ]);

    const response = await result.response;
    let extractedData = response.text();

    console.log("📋 Raw Response from Gemini:");
    console.log("=".repeat(50));
    console.log(extractedData);
    console.log("=".repeat(50));

    // Clean the response to ensure it's valid JSON
    extractedData = extractedData.replace(/```json/g, '').replace(/```/g, '').trim();

    // Parse the JSON response
    let parsedData;
    try {
      parsedData = JSON.parse(extractedData);
    } catch (parseError) {
      console.error("❌ Error parsing JSON response:", parseError);
      console.log("🔧 Attempting to fix JSON...");
      
      // Try to fix common JSON issues
      extractedData = fixJsonResponse(extractedData);
      parsedData = JSON.parse(extractedData);
    }

    // Validate and clean the data
    const validatedData = validateAndCleanData(parsedData, schema);

    console.log("📊 Final Structured Data:");
    console.log(JSON.stringify(validatedData, null, 2));

    return {
      content: validatedData,
      schema: schema
    };

  } catch (error) {
    console.error("❌ Error calling Gemini API:", error);
    console.log("🔄 Falling back to mock data");
    return getMockData(customSchema || DEFAULT_PORTFOLIO_SCHEMA);
  }
}

function fixJsonResponse(jsonString) {
  // Remove any leading/trailing non-JSON content
  const jsonStart = jsonString.indexOf('{');
  const jsonEnd = jsonString.lastIndexOf('}') + 1;
  
  if (jsonStart !== -1 && jsonEnd !== 0) {
    jsonString = jsonString.substring(jsonStart, jsonEnd);
  }
  
  // Fix common JSON issues
  jsonString = jsonString
    .replace(/,\s*}/g, '}') // Remove trailing commas before }
    .replace(/,\s*]/g, ']') // Remove trailing commas before ]
    .replace(/'/g, '"')     // Replace single quotes with double quotes
    .replace(/(\w+):/g, '"$1":'); // Add quotes around unquoted keys
  
  return jsonString;
}

function validateAndCleanData(data, schema) {
  // Recursively validate the data against schema structure
  function validateObject(obj, schemaObj) {
    const result = {};
    
    for (const key in schemaObj) {
      if (typeof schemaObj[key] === 'object' && !Array.isArray(schemaObj[key])) {
        result[key] = validateObject(obj[key] || {}, schemaObj[key]);
      } else if (Array.isArray(schemaObj[key])) {
        result[key] = Array.isArray(obj[key]) ? obj[key] : [];
      } else {
        result[key] = obj[key] || null;
      }
    }
    
    return result;
  }
  
  return validateObject(data, schema);
}

// Enhanced mock data generator that follows schema
function getMockData(schema) {
  console.log("🎭 Using mock resume data with provided schema");
  
  // Generate mock data based on schema structure
  const mockData = {};
  
  // This is a simplified mock - you'd want to expand this based on your needs
  if (schema.hero) {
    mockData.hero = {
      title: "Hassan Ahmed",
      subtitle: "Full Stack Developer",
      tagline: "Building digital experiences that matter"
    };
  }
  
  if (schema.about) {
    mockData.about = {
      summary: "Experienced developer with 3+ years building web applications. Passionate about clean code and user experience.",
      yearsOfExperience: "3+",
      location: "New York, NY"
    };
  }
  
  if (schema.contact) {
    mockData.contact = {
      email: "hassan@example.com",
      phone: "+1-555-0123",
      linkedin: "linkedin.com/in/hassan",
      github: "github.com/hassan",
      website: "hassan.dev",
      location: "New York, NY"
    };
  }
  
  if (schema.experience) {
    mockData.experience = {
      jobs: [
        {
          title: "Senior Developer",
          company: "Tech Corp",
          duration: "Jan 2022 - Present",
          location: "New York, NY",
          description: "Led development of multiple web applications using React and Node.js. Mentored junior developers and improved team productivity by 40%.",
          technologies: ["React", "Node.js", "TypeScript", "AWS"]
        },
        {
          title: "Junior Developer",
          company: "Startup Inc",
          duration: "Jun 2020 - Dec 2021",
          location: "San Francisco, CA",
          description: "Built responsive websites and maintained existing codebase. Collaborated with design team to implement pixel-perfect interfaces.",
          technologies: ["JavaScript", "HTML", "CSS", "Vue.js"]
        }
      ]
    };
  }
  
  if (schema.education) {
    mockData.education = {
      degrees: [
        {
          degree: "Bachelor of Science",
          field: "Computer Science",
          institution: "University of Technology",
          year: "2020",
          gpa: "3.8",
          location: "California, USA"
        }
      ]
    };
  }
  
  if (schema.skills) {
    mockData.skills = {
      technical: ["JavaScript", "React", "Node.js", "Python", "MongoDB", "AWS", "Docker"],
      soft: ["Team Leadership", "Problem Solving", "Communication", "Project Management"],
      languages: ["English (Native)", "Spanish (Conversational)"]
    };
  }
  
  if (schema.projects) {
    mockData.projects = {
      items: [
        {
          name: "E-commerce Platform",
          description: "Full-stack e-commerce solution with payment integration and admin dashboard",
          technologies: ["React", "Node.js", "MongoDB", "Stripe"],
          url: "https://shop.example.com",
          github: "https://github.com/hassan/ecommerce"
        },
        {
          name: "Task Management App",
          description: "Collaborative task management tool with real-time updates",
          technologies: ["Vue.js", "Express", "Socket.io"],
          url: "https://tasks.example.com",
          github: "https://github.com/hassan/taskapp"
        }
      ]
    };
  }
  
  if (schema.achievements) {
    mockData.achievements = {
      awards: ["Best Developer Award 2023", "Innovation Challenge Winner"],
      certifications: ["AWS Certified Solutions Architect", "Google Cloud Professional"],
      publications: ["Building Scalable Web Applications - Tech Blog 2023"]
    };
  }
  
  if (schema.interests) {
    mockData.interests = {
      hobbies: ["Photography", "Hiking", "Guitar Playing", "Open Source Contributing"],
      volunteer: ["Code for Good - Teaching coding to underprivileged kids", "Local Food Bank Volunteer"]
    };
  }
  
  return {
    content: mockData,
    schema: schema
  };
}

// Utility function to create custom schemas for different portfolio types
export function createPortfolioSchema(type = 'developer') {
  const schemas = {
    developer: DEFAULT_PORTFOLIO_SCHEMA,
    designer: {
      // Designer-focused schema
      hero: {
        title: "Full name",
        subtitle: "Design specialty (e.g., UX Designer, Graphic Designer)",
        tagline: "Creative tagline"
      },
      about: {
        summary: "Creative professional summary",
        yearsOfExperience: "Years in design",
        location: "Current location"
      },
      contact: {
        email: "Email address",
        phone: "Phone number",
        behance: "Behance portfolio URL",
        dribbble: "Dribbble profile URL",
        linkedin: "LinkedIn profile URL",
        website: "Portfolio website URL",
        location: "City, State/Country"
      },
      skills: {
        design: ["Design tools like Figma, Sketch, Adobe Creative Suite"],
        technical: ["Technical skills like HTML, CSS, JavaScript"],
        soft: ["Soft skills like creativity, communication, collaboration"]
      },
      projects: {
        items: [
          {
            name: "Project name",
            description: "Project description and design process",
            tools: ["Design tools used"],
            url: "Live project URL",
            behance: "Behance project URL"
          }
        ]
      }
      // ... other designer-specific fields
    },
    marketing: {
      // Marketing-focused schema
      hero: {
        title: "Full name",
        subtitle: "Marketing specialty (e.g., Digital Marketing, Content Marketing)",
        tagline: "Marketing tagline"
      },
      skills: {
        marketing: ["Marketing tools and platforms"],
        analytical: ["Analytics and data tools"],
        soft: ["Communication, strategy, creativity"]
      }
      // ... marketing-specific fields
    }
  };
  
  return schemas[type] || DEFAULT_PORTFOLIO_SCHEMA;
}
