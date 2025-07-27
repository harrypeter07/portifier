// Dynamic component mapping with new schema support
export const componentMap = {
	HeroA: require("@/components/Hero/HeroA").default,
	HeroB: require("@/components/Hero/HeroB").default,
	AboutA: require("@/components/About/AboutA").default,
	AboutB: require("@/components/About/AboutB").default,
	ExperienceA: require("@/components/Experience/ExperienceA").default,
	ExperienceB: require("@/components/Experience/ExperienceB").default,
	EducationA: require("@/components/Education/EducationA").default,
	SkillsA: require("@/components/Skills/SkillsA").default,
	ShowcaseA: require("@/components/Showcase/ShowcaseA").default,
	AchievementsA: require("@/components/Achievements/AchievementsA").default,
	ContactFormA: require("@/components/Contact/ContactFormA").default,
};

// Component categories for organized selection
export const componentCategories = {
	hero: {
		label: "Hero Section",
		components: ["HeroA", "HeroB"],
		description: "Main header section with name and title",
		required: true
	},
	about: {
		label: "About Section",
		components: ["AboutA", "AboutB"],
		description: "Professional summary and bio",
		required: true
	},
	experience: {
		label: "Work Experience",
		components: ["ExperienceA", "ExperienceB"],
		description: "Professional work history",
		required: false
	},
	education: {
		label: "Education",
		components: ["EducationA"],
		description: "Academic background",
		required: false
	},
	skills: {
		label: "Skills",
		components: ["SkillsA"],
		description: "Technical and soft skills",
		required: false
	},
	projects: {
		label: "Projects/Portfolio",
		components: ["ShowcaseA"],
		description: "Project showcase and portfolio items",
		required: false
	},
	achievements: {
		label: "Achievements",
		components: ["AchievementsA"],
		description: "Awards, certifications, and recognition",
		required: false
	},
	contact: {
		label: "Contact Information",
		components: ["ContactFormA"],
		description: "Contact details and social links",
		required: true
	}
};

// Portfolio type specific component recommendations
export const portfolioTypeComponents = {
	developer: {
		recommended: ["hero", "about", "experience", "skills", "projects", "contact"],
		optional: ["education", "achievements"]
	},
	designer: {
		recommended: ["hero", "about", "projects", "skills", "contact"],
		optional: ["experience", "education", "achievements"]
	},
	marketing: {
		recommended: ["hero", "about", "experience", "achievements", "contact"],
		optional: ["education", "projects", "skills"]
	},
	academic: {
		recommended: ["hero", "about", "education", "achievements", "contact"],
		optional: ["experience", "skills", "projects"]
	}
};

// Helper function to get component by name
export const getComponent = (componentName) => {
	return componentMap[componentName] || null;
};

// Helper function to get all components for a section
export const getSectionComponents = (sectionName) => {
	const category = componentCategories[sectionName];
	return category ? category.components.map(name => ({
		name,
		component: componentMap[name],
		label: category.label
	})) : [];
};

// Helper function to get recommended layout for portfolio type
export const getRecommendedLayout = (portfolioType = 'developer') => {
	const typeConfig = portfolioTypeComponents[portfolioType] || portfolioTypeComponents.developer;
	const layout = {};
	
	typeConfig.recommended.forEach(section => {
		const category = componentCategories[section];
		if (category && category.components.length > 0) {
			layout[section] = category.components[0]; // Use first component as default
		}
	});
	
	return layout;
};

export default componentMap;
