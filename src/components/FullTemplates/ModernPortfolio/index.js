// Main entry point for ModernPortfolio template
import { EMPTY_PORTFOLIO } from "@/data/schemas/portfolioSchema";
// Ensure template-specific styles (texture, button-cutout, animations) are loaded
import "./app/globals.css";
import { Header } from "./app/components/Header";
import { Bowlby_One_SC, DM_Mono } from "next/font/google";
const bowlby = Bowlby_One_SC({ subsets: ["latin"], display: "swap", variable: "--font-bowlby-sc", weight: "400" });
const dmMono = DM_Mono({ subsets: ["latin"], display: "swap", variable: "--font-dm-mono", weight: "500" });
import { getProjectData } from "./data/skateboardData";
import { getNavigationData } from "./data/navagationData";

// Main template component that integrates with app data
export default function ModernPortfolio({ data = EMPTY_PORTFOLIO }) {
	// Transform data for template use
	const projectData = getProjectData(data);
	const navigationData = getNavigationData(data);
	
    // Import and render the main template component
    const Homepage = require("./pages/Homepage.jsx").default;

    return (
        <div className={`relative ${bowlby.variable} ${dmMono.variable} font-sans`}>
            {/* Template header (navbar) */}
            <Header />
            {/* Main page */}
            <Homepage 
                portfolioData={data}
                projectData={projectData}
                navigationData={navigationData}
            />
        </div>
    );
}
