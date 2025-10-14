// Dynamic component mapping with new schema support
import HeroA from "@/components/Hero/HeroA";
import HeroB from "@/components/Hero/HeroB";
import HeroC from "@/components/Hero/HeroC";
import HeroD from "@/components/Hero/HeroD";
import AboutA from "@/components/About/AboutA";
import AboutB from "@/components/About/AboutB";
import AboutC from "@/components/About/AboutC";
import ExperienceA from "@/components/Experience/ExperienceA";
import ExperienceB from "@/components/Experience/ExperienceB";
import EducationA from "@/components/Education/EducationA";
import SkillsA from "@/components/Skills/SkillsA";
import ShowcaseA from "@/components/Showcase/ShowcaseA";
import AchievementsA from "@/components/Achievements/AchievementsA";
import ContactFormA from "@/components/Contact/ContactFormA";
import PortfolioLoading from "@/components/PortfolioLoading";
import CustomPortfolioLoading from "@/components/CustomPortfolioLoading";
import LottieLoading from "@/components/LottieLoading";

// Full-page templates
import CleanfolioFull from "@/components/FullTemplates/CleanfolioFull";
import CreativeFull from "@/components/FullTemplates/CreativeFull";
import ModernPortfolio from "@/components/FullTemplates/ModernPortfolio";
import SpacefolioFull from "@/components/FullTemplates/spacefolio/app/page";
import NeoBrutalFull from "@/components/FullTemplates/NeoBrutalFull";
import ColorfullFull from "@/components/FullTemplates/ColorfullFull";

export const componentMap = {
	// Hero components
	HeroA,
	HeroB,
	HeroC,
	HeroD,
	
	// About components
	AboutA,
	AboutB,
	AboutC,
	
	// Experience components
	ExperienceA,
	ExperienceB,
	
	// Education components
	EducationA,
	
	// Skills components
	SkillsA,
	
	// Showcase/Projects components
	ShowcaseA,
	
	// Achievements components
	AchievementsA,
	
	// Contact components
	ContactFormA,
	
	// Loading components
	PortfolioLoading,
	CustomPortfolioLoading,
	LottieLoading,
	
	// Full-page templates
	CleanfolioFull,
	CreativeFull,
	ModernPortfolio,
	SpacefolioFull,
	NeoBrutalFull,
	ColorfullFull,
};

// Component categories for organized selection
export const componentCategories = {
	hero: {
		label: "Hero Section",
		components: ["HeroA", "HeroB", "HeroC", "HeroD"],
		description: "Main header section with name and title",
		required: true
	},
	about: {
		label: "About Section",
		components: ["AboutA", "AboutB", "AboutC"],
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
	},
	loading: {
		label: "Loading Screen",
		components: ["PortfolioLoading", "CustomPortfolioLoading", "LottieLoading"],
		description: "Loading spinner or animation while portfolio loads",
		required: false
	},
	fullTemplates: {
		label: "Full Page Templates",
		components: ["CleanfolioFull", "CreativeFull", "ModernPortfolio", "SpacefolioFull", "NeoBrutalFull", "ColorfullFull"],
		description: "Complete portfolio page templates",
		required: false
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

// Helper function to check if a component is a full-page template
export const isFullPageTemplate = (componentName) => {
	return componentCategories.fullTemplates.components.includes(componentName);
};

export default componentMap;
