// Template Management System for Portfolio Builder
// Provides scalable template configurations with full schema support

import { EMPTY_PORTFOLIO } from "@/data/schemas/portfolioSchema";
// Simple layout recommendation function to avoid React context issues in server-side code
const getRecommendedLayout = (templateId) => {
  const layouts = {
    cleanfolio: ['hero', 'about', 'experience', 'skills', 'showcase', 'contact'],
    creative: ['hero', 'about', 'experience', 'skills', 'achievements', 'contact'],
    business: ['hero', 'about', 'experience', 'education', 'skills', 'contact']
  };
  return layouts[templateId] || layouts.cleanfolio;
};
import {
	sampleDataCleanfolio,
	sampleDataCreative,
	sampleDataBusiness,
} from "@/data/samplePortfolioData";

// Template configurations with complete schema data
export const PORTFOLIO_TEMPLATES = {
	// Component-based templates
	cleanfolio: {
		id: "cleanfolio",
		name: "Clean Portfolio",
		description: "Minimalist and professional design perfect for developers",
		category: "developer",
		type: "component", // component-based template
		preview: "/templates/cleanfolio-preview.jpg",
		layout: {
			hero: "HeroA",
			about: "AboutA",
			experience: "ExperienceA",
			skills: "SkillsA",
			projects: "ShowcaseA",
			contact: "ContactFormA",
		},
		theme: {
			primaryColor: "#3B82F6",
			secondaryColor: "#1E40AF",
			accentColor: "#F59E0B",
			backgroundColor: "#FFFFFF",
			textColor: "#1F2937",
			font: "Inter",
			darkMode: true,
			animations: true,
			layout: "modern",
		},
		sampleData: sampleDataCleanfolio,
	},

	creative: {
		id: "creative",
		name: "Creative Portfolio",
		description: "Bold and vibrant design perfect for designers and creatives",
		category: "designer",
		type: "component", // component-based template
		preview: "/templates/creative-preview.jpg",
		layout: {
			hero: "HeroB",
			about: "AboutA",
			projects: "ShowcaseA",
			skills: "SkillsA",
			contact: "ContactFormA",
		},
		theme: {
			primaryColor: "#8B5CF6",
			secondaryColor: "#7C3AED",
			accentColor: "#F59E0B",
			backgroundColor: "#FAFAFA",
			textColor: "#1F2937",
			font: "Poppins",
			darkMode: true,
			animations: true,
			layout: "creative",
		},
		sampleData: sampleDataCreative,
	},

	business: {
		id: "business",
		name: "Business Portfolio",
		description: "Professional and corporate design for business professionals",
		category: "marketing",
		type: "component", // component-based template
		preview: "/templates/business-preview.jpg",
		layout: {
			hero: "HeroA",
			about: "AboutA",
			experience: "ExperienceA",
			achievements: "AchievementsA",
			contact: "ContactFormA",
		},
		theme: {
			primaryColor: "#1F2937",
			secondaryColor: "#374151",
			accentColor: "#059669",
			backgroundColor: "#FFFFFF",
			textColor: "#111827",
			font: "Roboto",
			darkMode: false,
			animations: false,
			layout: "corporate",
		},
		sampleData: sampleDataBusiness,
	},

	// New component-based templates
	modern: {
		id: "modern",
		name: "Modern Portfolio",
		description: "Contemporary design with clean lines and modern aesthetics",
		category: "developer",
		type: "component",
		preview: "/templates/modern-preview.jpg",
		layout: {
			hero: "HeroC",
			about: "AboutC",
			experience: "ExperienceA",
			skills: "SkillsA",
			projects: "ShowcaseA",
			contact: "ContactFormA",
		},
		theme: {
			primaryColor: "#6366F1",
			secondaryColor: "#4F46E5",
			accentColor: "#F59E0B",
			backgroundColor: "#FFFFFF",
			textColor: "#1F2937",
			font: "Inter",
			darkMode: true,
			animations: true,
			layout: "modern",
		},
		sampleData: sampleDataCleanfolio,
	},

	animated: {
		id: "animated",
		name: "Animated Portfolio",
		description: "Dynamic and interactive design with smooth animations",
		category: "designer",
		type: "component",
		preview: "/templates/animated-preview.jpg",
		layout: {
			hero: "HeroD",
			about: "AboutC",
			experience: "ExperienceB",
			skills: "SkillsA",
			projects: "ShowcaseA",
			contact: "ContactFormA",
		},
		theme: {
			primaryColor: "#8B5CF6",
			secondaryColor: "#7C3AED",
			accentColor: "#F59E0B",
			backgroundColor: "#000000",
			textColor: "#FFFFFF",
			font: "Poppins",
			darkMode: true,
			animations: true,
			layout: "creative",
		},
		sampleData: sampleDataCreative,
	},

	// Full-page templates
	cleanfolioFull: {
		id: "cleanfolioFull",
		name: "Cleanfolio (Full Page)",
		description: "Complete portfolio page with clean, professional design",
		category: "developer",
		type: "full", // full-page template
		component: "CleanfolioFull", // reference to full template component
		preview: "/templates/cleanfolio-full-preview.jpg",
		theme: {
			primaryColor: "#3B82F6",
			secondaryColor: "#1E40AF",
			accentColor: "#F59E0B",
			backgroundColor: "#FFFFFF",
			textColor: "#1F2937",
			font: "Inter",
			darkMode: true,
			animations: true,
			layout: "modern",
		},
		sampleData: sampleDataCleanfolio,
	},

	creativeFull: {
		id: "creativeFull",
		name: "Creative (Full Page)",
		description: "Complete portfolio page with bold, artistic design",
		category: "designer",
		type: "full", // full-page template
		component: "CreativeFull", // reference to full template component
		preview: "/templates/creative-full-preview.jpg",
		theme: {
			primaryColor: "#8B5CF6",
			secondaryColor: "#7C3AED",
			accentColor: "#F59E0B",
			backgroundColor: "#000000",
			textColor: "#FFFFFF",
			font: "Poppins",
			darkMode: true,
			animations: true,
			layout: "creative",
		},
		sampleData: sampleDataCreative,
	},

	modernPortfolio: {
		id: "modernPortfolio",
		name: "Modern Portfolio",
		description: "Dynamic portfolio with animations and modern design",
		category: "developer",
		type: "full", // full-page template
		component: "ModernPortfolio", // reference to full template component
		preview: "/templates/modern-portfolio-preview.jpg",
		theme: {
			primaryColor: "#8B5CF6",
			secondaryColor: "#7C3AED",
			accentColor: "#F59E0B",
			backgroundColor: "#FFFFFF",
			textColor: "#1F2937",
			font: "Inter",
			darkMode: false,
			animations: true,
			layout: "modern",
		},
		sampleData: sampleDataCleanfolio,
	},

	spacefolioFull: {
		id: "spacefolioFull",
		name: "Spacefolio (Full Page)",
		description: "Space-themed portfolio with 3D animations and modern design",
		category: "developer",
		type: "full", // full-page template
		component: "SpacefolioFull", // reference to full template component
		preview: "/templates/spacefolio-full-preview.jpg",
		theme: {
			primaryColor: "#7042F8",
			secondaryColor: "#B49BFF",
			accentColor: "#60A5FA",
			backgroundColor: "#030014",
			textColor: "#FFFFFF",
			font: "Inter",
			darkMode: true,
			animations: true,
			layout: "space",
		},
		sampleData: sampleDataCleanfolio,
	},
};

// Template utility functions
export const getTemplate = (templateId) => {
	return PORTFOLIO_TEMPLATES[templateId] || null;
};

export const getAllTemplates = () => {
	return Object.values(PORTFOLIO_TEMPLATES);
};

export const getTemplatesByCategory = (category) => {
	return Object.values(PORTFOLIO_TEMPLATES).filter(
		(template) => template.category === category
	);
};

export const getTemplatesByType = (type) => {
	return Object.values(PORTFOLIO_TEMPLATES).filter(
		(template) => template.type === type
	);
};

export const getComponentTemplates = () => {
	return getTemplatesByType("component");
};

export const getFullPageTemplates = () => {
	return getTemplatesByType("full");
};

export const createTemplateFromPortfolioType = (portfolioType) => {
	const layout = getRecommendedLayout(portfolioType);
	const baseTemplate = PORTFOLIO_TEMPLATES.cleanfolio;

	return {
		id: `custom-${portfolioType}`,
		name: `${
			portfolioType.charAt(0).toUpperCase() + portfolioType.slice(1)
		} Template`,
		description: `Optimized template for ${portfolioType} portfolios`,
		category: portfolioType,
		type: "component",
		layout,
		theme: baseTemplate.theme,
		sampleData: JSON.parse(JSON.stringify(EMPTY_PORTFOLIO)),
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
			theme: userData.theme?.primaryColor ? userData.theme : template.theme,
		},
	};
};

export const validateTemplate = (template) => {
	const errors = [];

	if (!template.id) errors.push("Template ID is required");
	if (!template.name) errors.push("Template name is required");
	if (!template.type) errors.push("Template type is required");
	
	if (template.type === "component") {
		if (!template.layout) errors.push("Component template layout is required");
	} else if (template.type === "full") {
		if (!template.component) errors.push("Full template component is required");
	}
	
	if (!template.theme) errors.push("Template theme is required");

	// Validate layout components exist
	if (template.layout) {
		Object.values(template.layout).forEach((componentName) => {
			// This would need to be implemented with actual component checking
		});
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
};

const TemplateManager = {
	PORTFOLIO_TEMPLATES,
	getTemplate,
	getAllTemplates,
	getTemplatesByCategory,
	getTemplatesByType,
	getComponentTemplates,
	getFullPageTemplates,
	createTemplateFromPortfolioType,
	mergeTemplateWithData,
	validateTemplate,
};

export default TemplateManager;
