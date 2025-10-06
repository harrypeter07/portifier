import { GoogleGenerativeAI } from "@google/generative-ai";

// Function to get Gemini instance with user's API key or fallback to env
export async function getGeminiInstance(userId = null) {
	let apiKey = process.env.GEMINI_API_KEY;

	// If userId is provided, try to get user's API key
	if (userId) {
		try {
			const { default: dbConnect } = await import("@/lib/mongodb");
			const { default: User } = await import("@/models/User");
			
			await dbConnect();
			const user = await User.findById(userId).select('+geminiApiKey');
			
			if (user && user.geminiApiKey) {
				apiKey = user.geminiApiKey;
			}
		} catch (error) {
			console.error("Failed to fetch user's API key:", error);
			// Fall back to environment variable
		}
	}

	if (!apiKey) {
		throw new Error("No Gemini API key available");
	}

	return new GoogleGenerativeAI(apiKey);
}

// Function to get model instance
export async function getGeminiModel(userId = null, modelName = "gemini-1.5-flash") {
	const genAI = await getGeminiInstance(userId);
	return genAI.getGenerativeModel({ model: modelName });
}

// Function to generate content with user's API key
export async function generateContent(prompt, userId = null, modelName = "gemini-1.5-flash") {
	try {
		const model = await getGeminiModel(userId, modelName);
		const result = await model.generateContent(prompt);
		const response = await result.response;
		return response.text();
	} catch (error) {
		console.error("Gemini API error:", error);
		throw error;
	}
}

// Function to check if user has API key configured
export async function checkUserApiKey(userId) {
	try {
		const { default: dbConnect } = await import("@/lib/mongodb");
		const { default: User } = await import("@/models/User");
		
		await dbConnect();
		const user = await User.findById(userId).select('+geminiApiKey');
		
		return {
			hasKey: !!user?.geminiApiKey,
			key: user?.geminiApiKey || null
		};
	} catch (error) {
		console.error("Failed to check user API key:", error);
		return { hasKey: false, key: null };
	}
}

// Legacy function for backward compatibility
export function getGemini() {
	return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

// Retry configuration
const RETRY_CONFIG = {
	maxRetries: 3,
	baseDelay: 1000, // 1 second
	maxDelay: 10000, // 10 seconds
	timeout: 30000, // 30 seconds timeout
};

// Available Gemini models to try as fallbacks (only 2.0+ models)
const GEMINI_MODELS = [
	"gemini-2.0-flash-exp",
	"gemini-2.0-flash-thinking-exp",
	"gemini-exp-1206",
	"gemini-exp-1120",
];

// Default portfolio schema - you can modify this or pass it as a parameter
const DEFAULT_PORTFOLIO_SCHEMA = {
	hero: {
		title: "Full name of the person",
		subtitle: "Professional title or role (e.g., Software Engineer, Designer)",
		tagline: "Brief catchy tagline or motto",
	},
	about: {
		summary: "Professional summary or bio paragraph",
		yearsOfExperience: "Number of years of experience",
		location: "Current location or preferred work location",
	},
	contact: {
		email: "Email address",
		phone: "Phone number",
		linkedin: "LinkedIn profile URL",
		github: "GitHub profile URL",
		website: "Personal website URL",
		location: "City, State/Country",
	},
	experience: {
		jobs: [
			{
				title: "Job title",
				company: "Company name",
				duration: "Employment duration (e.g., Jan 2022 - Present)",
				location: "Job location",
				description: "Job description and key achievements",
				technologies: ["Technologies/tools used in this role"],
			},
		],
	},
	education: {
		degrees: [
			{
				degree: "Degree name (e.g., Bachelor of Science)",
				field: "Field of study (e.g., Computer Science)",
				institution: "University/College name",
				year: "Graduation year or year range",
				gpa: "GPA if mentioned",
				location: "Institution location",
			},
		],
	},
	skills: {
		technical: [
			"Technical skills like programming languages, frameworks, tools",
		],
		soft: ["Soft skills like leadership, communication, problem-solving"],
		languages: ["Spoken languages with proficiency levels"],
	},
	projects: {
		items: [
			{
				name: "Project name",
				description: "Project description",
				technologies: ["Technologies used"],
				url: "Project URL if available",
				github: "GitHub repository URL if available",
			},
		],
	},
	achievements: {
		awards: ["Awards, certifications, recognitions"],
		certifications: ["Professional certifications"],
		publications: ["Publications, articles, blogs"],
	},
	interests: {
		hobbies: ["Personal interests and hobbies"],
		volunteer: ["Volunteer work and community involvement"],
	},
};

// Utility function to calculate exponential backoff delay
function calculateDelay(attempt, baseDelay, maxDelay) {
	const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
	return delay + Math.random() * 1000; // Add jitter
}

// Utility function to check if error is retryable
function isRetryableError(error) {
	// Check for specific error types that are retryable
	if (error.message && error.message.includes('503')) return true;
	if (error.message && error.message.includes('Service Unavailable')) return true;
	if (error.message && error.message.includes('overloaded')) return true;
	if (error.message && error.message.includes('rate limit')) return true;
	if (error.message && error.message.includes('quota exceeded')) return true;
	
	// Check for network-related errors
	if (error.message && error.message.includes('network')) return true;
	if (error.message && error.message.includes('timeout')) return true;
	
	return false;
}

// Utility function to create a timeout promise
function createTimeoutPromise(timeoutMs) {
	return new Promise((_, reject) => {
		setTimeout(() => {
			reject(new Error(`Request timeout after ${timeoutMs}ms`));
		}, timeoutMs);
	});
}

export async function parseResumeWithGemini(buffer, customSchema = null) {
	if (!process.env.GEMINI_API_KEY) {
		console.log("⚠️  No Google API key found, using mock data");
		return getMockData(customSchema || DEFAULT_PORTFOLIO_SCHEMA);
	}

	const schema = customSchema || DEFAULT_PORTFOLIO_SCHEMA;
	let lastError = null;

	// Try different models
	for (const modelName of GEMINI_MODELS) {
		console.log(`🤖 Trying Gemini model: ${modelName}`);
		
		// Retry loop for each model
		for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
			try {
				const model = await getGeminiModel(null, modelName); // Use getGeminiModel

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

				// Create the API call with timeout
				const apiCall = model.generateContent([
					prompt,
					{
						inlineData: {
							mimeType: "application/pdf",
							data: base64Data,
						},
					},
				]);

				// Race between the API call and timeout
				const result = await Promise.race([
					apiCall,
					createTimeoutPromise(RETRY_CONFIG.timeout)
				]);

				const response = await result.response;
				let extractedData = response.text();

				// Clean the response to ensure it's valid JSON
				extractedData = extractedData
					.replace(/```json/g, "")
					.replace(/```/g, "")
					.trim();

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

				console.log(`✅ Gemini API call successful with model: ${modelName}!`);
				return {
					content: validatedData,
					schema: schema,
				};
			} catch (error) {
				lastError = error;
				
				// Check if this is a retryable error
				if (isRetryableError(error) && attempt < RETRY_CONFIG.maxRetries) {
					const delay = calculateDelay(attempt, RETRY_CONFIG.baseDelay, RETRY_CONFIG.maxDelay);
					console.log(`⚠️  Gemini API error (${modelName}, attempt ${attempt + 1}/${RETRY_CONFIG.maxRetries + 1}):`, error.message);
					console.log(`🔄 Retrying in ${Math.round(delay)}ms...`);
					
					await new Promise(resolve => setTimeout(resolve, delay));
					continue;
				}
				
				// If not retryable or max retries reached, try next model
				break;
			}
		}
		
		// If we get here, this model failed completely, try next model
		console.log(`❌ Model ${modelName} failed, trying next model...`);
	}

	// If we get here, all models failed
	console.error("❌ All Gemini API attempts failed:", lastError);
	
	// Create a more descriptive error message
	let errorMessage = "AI service unavailable";
	if (lastError) {
		if (lastError.message?.includes("503")) {
			errorMessage = "AI service is temporarily overloaded";
		} else if (lastError.message?.includes("429")) {
			errorMessage = "Too many requests to AI service";
		} else if (lastError.message?.includes("401") || lastError.message?.includes("403")) {
			errorMessage = "AI service authentication failed";
		} else if (lastError.message?.includes("timeout")) {
			errorMessage = "AI service request timed out";
		} else if (lastError.message?.includes("network") || lastError.message?.includes("fetch")) {
			errorMessage = "Network error connecting to AI service";
		} else if (lastError.message?.includes("model is overloaded")) {
			errorMessage = "AI service is currently overloaded";
		} else if (lastError.message?.includes("quota")) {
			errorMessage = "AI service quota exceeded";
		} else {
			errorMessage = lastError.message || "AI service unavailable";
		}
	}
	
	// Throw error with specific message instead of falling back to mock data
	throw new Error(errorMessage);
}

function fixJsonResponse(jsonString) {
	// Remove any leading/trailing non-JSON content
	const jsonStart = jsonString.indexOf("{");
	const jsonEnd = jsonString.lastIndexOf("}") + 1;

	if (jsonStart !== -1 && jsonEnd !== 0) {
		jsonString = jsonString.substring(jsonStart, jsonEnd);
	}

	// Fix common JSON issues
	jsonString = jsonString
		.replace(/,\s*}/g, "}") // Remove trailing commas before }
		.replace(/,\s*]/g, "]") // Remove trailing commas before ]
		.replace(/'/g, '"') // Replace single quotes with double quotes
		.replace(/(\w+):/g, '"$1":'); // Add quotes around unquoted keys

	return jsonString;
}

function validateAndCleanData(data, schema) {
	// Recursively validate the data against schema structure
	function validateObject(obj, schemaObj) {
		const result = {};

		for (const key in schemaObj) {
			if (
				typeof schemaObj[key] === "object" &&
				!Array.isArray(schemaObj[key])
			) {
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
			tagline: "Building digital experiences that matter",
		};
	}

	if (schema.about) {
		mockData.about = {
			summary:
				"Experienced developer with 3+ years building web applications. Passionate about clean code and user experience.",
			yearsOfExperience: "3+",
			location: "New York, NY",
		};
	}

	if (schema.contact) {
		mockData.contact = {
			email: "hassan@example.com",
			phone: "+1-555-0123",
			linkedin: "linkedin.com/in/hassan",
			github: "github.com/hassan",
			website: "hassan.dev",
			location: "New York, NY",
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
					description:
						"Led development of multiple web applications using React and Node.js. Mentored junior developers and improved team productivity by 40%.",
					technologies: ["React", "Node.js", "TypeScript", "AWS"],
				},
				{
					title: "Junior Developer",
					company: "Startup Inc",
					duration: "Jun 2020 - Dec 2021",
					location: "San Francisco, CA",
					description:
						"Built responsive websites and maintained existing codebase. Collaborated with design team to implement pixel-perfect interfaces.",
					technologies: ["JavaScript", "HTML", "CSS", "Vue.js"],
				},
			],
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
					location: "California, USA",
				},
			],
		};
	}

	if (schema.skills) {
		mockData.skills = {
			technical: [
				"JavaScript",
				"React",
				"Node.js",
				"Python",
				"MongoDB",
				"AWS",
				"Docker",
			],
			soft: [
				"Team Leadership",
				"Problem Solving",
				"Communication",
				"Project Management",
			],
			languages: ["English (Native)", "Spanish (Conversational)"],
		};
	}

	if (schema.projects) {
		mockData.projects = {
			items: [
				{
					name: "E-commerce Platform",
					description:
						"Full-stack e-commerce solution with payment integration and admin dashboard",
					technologies: ["React", "Node.js", "MongoDB", "Stripe"],
					url: "https://shop.example.com",
					github: "https://github.com/hassan/ecommerce",
				},
				{
					name: "Task Management App",
					description:
						"Collaborative task management tool with real-time updates",
					technologies: ["Vue.js", "Express", "Socket.io"],
					url: "https://tasks.example.com",
					github: "https://github.com/hassan/taskapp",
				},
			],
		};
	}

	if (schema.achievements) {
		mockData.achievements = {
			awards: ["Best Developer Award 2023", "Innovation Challenge Winner"],
			certifications: [
				"AWS Certified Solutions Architect",
				"Google Cloud Professional",
			],
			publications: ["Building Scalable Web Applications - Tech Blog 2023"],
		};
	}

	if (schema.interests) {
		mockData.interests = {
			hobbies: [
				"Photography",
				"Hiking",
				"Guitar Playing",
				"Open Source Contributing",
			],
			volunteer: [
				"Code for Good - Teaching coding to underprivileged kids",
				"Local Food Bank Volunteer",
			],
		};
	}

	return {
		content: mockData,
		schema: schema,
	};
}

// Utility function to create custom schemas for different portfolio types
export function createPortfolioSchema(type = "developer") {
	const schemas = {
		developer: DEFAULT_PORTFOLIO_SCHEMA,
		designer: {
			// Designer-focused schema
			hero: {
				title: "Full name",
				subtitle: "Design specialty (e.g., UX Designer, Graphic Designer)",
				tagline: "Creative tagline",
			},
			about: {
				summary: "Creative professional summary",
				yearsOfExperience: "Years in design",
				location: "Current location",
			},
			contact: {
				email: "Email address",
				phone: "Phone number",
				behance: "Behance portfolio URL",
				dribbble: "Dribbble profile URL",
				linkedin: "LinkedIn profile URL",
				website: "Portfolio website URL",
				location: "City, State/Country",
			},
			skills: {
				design: ["Design tools like Figma, Sketch, Adobe Creative Suite"],
				technical: ["Technical skills like HTML, CSS, JavaScript"],
				soft: ["Soft skills like creativity, communication, collaboration"],
			},
			projects: {
				items: [
					{
						name: "Project name",
						description: "Project description and design process",
						tools: ["Design tools used"],
						url: "Live project URL",
						behance: "Behance project URL",
					},
				],
			},
			// ... other designer-specific fields
		},
		marketing: {
			// Marketing-focused schema
			hero: {
				title: "Full name",
				subtitle:
					"Marketing specialty (e.g., Digital Marketing, Content Marketing)",
				tagline: "Marketing tagline",
			},
			skills: {
				marketing: ["Marketing tools and platforms"],
				analytical: ["Analytics and data tools"],
				soft: ["Communication, strategy, creativity"],
			},
			// ... marketing-specific fields
		},
	};

	return schemas[type] || DEFAULT_PORTFOLIO_SCHEMA;
}
