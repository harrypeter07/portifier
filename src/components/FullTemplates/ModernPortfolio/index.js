// Main entry point for ModernPortfolio template
import { EMPTY_PORTFOLIO } from "@/data/schemas/portfolioSchema";
import { getProjectData } from "./data/skateboardData";
import { getNavigationData } from "./data/navagationData";

// Main template component that integrates with app data
export default function ModernPortfolio({ data = EMPTY_PORTFOLIO }) {
	// Transform data for template use
	const projectData = getProjectData(data);
	const navigationData = getNavigationData(data);
	
	// Import and render the main template component
	const Homepage = require("./pages/Homepage.jsx").default;
	
	return <Homepage 
		portfolioData={data}
		projectData={projectData}
		navigationData={navigationData}
	/>;
}
