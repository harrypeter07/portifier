// Configuration for which fields should have AI help enabled
export const aiFieldConfig = {
	// Personal Information - AI enabled for creative fields
	hero: {
		title: { enabled: false }, // Full name - no AI needed
		subtitle: { enabled: true, label: "Professional Title" }, // Job title - AI helpful
		tagline: { enabled: true, label: "Tagline" }, // Creative tagline - AI helpful
		availability: { enabled: true, label: "Availability" } // Status - AI helpful
	},

	// Contact Information - No AI needed for factual data
	contact: {
		email: { enabled: false }, // Email - no AI needed
		phone: { enabled: false }, // Phone - no AI needed
		location: { enabled: false }, // Location - no AI needed
		linkedin: { enabled: false } // LinkedIn URL - no AI needed
	},

	// Professional Summary & About - AI enabled for creative content
	about: {
		summary: { enabled: true, label: "Professional Summary" }, // Summary - AI helpful
		bio: { enabled: true, label: "Bio" }, // Bio - AI helpful
		interests: { enabled: true, label: "Interests" }, // Interests - AI helpful
		personalValues: { enabled: true, label: "Personal Values" }, // Values - AI helpful
		funFacts: { enabled: true, label: "Fun Facts" } // Fun facts - AI helpful
	},

	// Skills - AI enabled for skill suggestions
	skills: {
		technical: { enabled: true, label: "Technical Skills" }, // Tech skills - AI helpful
		soft: { enabled: true, label: "Soft Skills" } // Soft skills - AI helpful
	},

	// Languages - AI enabled for language suggestions
	languages: {
		languages: { enabled: true, label: "Languages" } // Languages - AI helpful
	},

	// Work Experience - AI enabled for job descriptions
	experience: {
		title: { enabled: true, label: "Job Title" }, // Job title - AI helpful
		company: { enabled: true, label: "Company Name" }, // Company - AI helpful
		duration: { enabled: true, label: "Duration" }, // Duration format - AI helpful
		description: { enabled: true, label: "Job Description" } // Description - AI helpful
	},

	// Education - AI enabled for degree and institution suggestions
	education: {
		degree: { enabled: true, label: "Degree" }, // Degree - AI helpful
		institution: { enabled: true, label: "Institution" }, // Institution - AI helpful
		year: { enabled: true, label: "Year" } // Year format - AI helpful
	},

	// Projects - AI enabled for project descriptions
	projects: {
		title: { enabled: true, label: "Project Title" }, // Project title - AI helpful
		description: { enabled: true, label: "Project Description" }, // Description - AI helpful
		github: { enabled: false }, // GitHub URL - no AI needed
		url: { enabled: false } // Live URL - no AI needed
	}
};

// Helper function to check if a field has AI enabled
export function isAIEnabled(section, field) {
	return aiFieldConfig[section]?.[field]?.enabled || false;
}

// Helper function to get AI label for a field
export function getAILabel(section, field) {
	return aiFieldConfig[section]?.[field]?.label || field;
} 