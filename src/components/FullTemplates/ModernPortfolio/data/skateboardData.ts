// Transform app portfolio data to template format
export const transformProjectsData = (portfolioData) => {
	const projects = portfolioData?.projects?.items || [];
	
	return projects.map((project, index) => ({
		title: project.title || `Project ${index + 1}`,
		image: project.images?.[0] || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
		description: project.description || project.longDescription || "A creative project showcasing my skills and expertise.",
		link: project.links?.live || project.links?.github || project.links?.demo || "#",
	}));
};

// Default project data for when no portfolio data is available
const defaultProjectData = [
	{
		title: "Personal Portfolio Website",
		image:
			"https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
		description:
			"A modern, responsive portfolio to showcase my work, skills, and contact information. Built with Next.js, Tailwind CSS, and Framer Motion.",
		link: "https://aryansharma.dev",
	},
	{
		title: "E-commerce Store UI",
		image:
			"https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
		description:
			"A sleek, animated e-commerce front-end with product previews, cart, and checkout flows. Designed for a seamless shopping experience.",
		link: "https://ecommerce-demo.com",
	},
	{
		title: "Interactive Data Dashboard",
		image:
			"https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
		description:
			"A real-time dashboard for visualizing analytics and KPIs, featuring custom charts and smooth transitions.",
		link: "https://dashboard-demo.com",
	},
	{
		title: "3D Product Viewer",
		image:
			"https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
		description:
			"A web-based 3D viewer for product showcases, using Three.js and React Three Fiber for interactive experiences.",
		link: "https://3dviewer-demo.com",
	},
	{
		title: "Mobile Banking App",
		image:
			"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
		description:
			"A secure mobile banking application with biometric authentication, real-time transactions, and intuitive financial management tools.",
		link: "https://banking-app-demo.com",
	},
	{
		title: "Social Media Platform",
		image:
			"https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=800&q=80",
		description:
			"A modern social networking platform with real-time messaging, content sharing, and community features built with React and Socket.io.",
		link: "https://social-platform-demo.com",
	},
	{
		title: "Fitness Tracking App",
		image:
			"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
		description:
			"A comprehensive fitness tracking application with workout plans, progress analytics, and social features for motivation.",
		link: "https://fitness-app-demo.com",
	},
	{
		title: "Weather Dashboard",
		image:
			"https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&w=800&q=80",
		description:
			"A beautiful weather application with detailed forecasts, interactive maps, and location-based weather alerts.",
		link: "https://weather-dashboard-demo.com",
	},
	{
		title: "Task Management System",
		image:
			"https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80",
		description:
			"A collaborative task management system with drag-and-drop functionality, team collaboration, and progress tracking.",
		link: "https://task-manager-demo.com",
	},
	{
		title: "Music Streaming App",
		image:
			"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80",
		description:
			"A music streaming platform with personalized playlists, offline downloads, and high-quality audio streaming capabilities.",
		link: "https://music-app-demo.com",
	},
	{
		title: "Recipe Finder App",
		image:
			"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80",
		description:
			"An intelligent recipe finder with ingredient-based search, nutritional information, and step-by-step cooking instructions.",
		link: "https://recipe-finder-demo.com",
	},
];

// Export function that returns appropriate data based on portfolio data
export const getProjectData = (portfolioData) => {
	const transformedData = transformProjectsData(portfolioData);
	return transformedData.length > 0 ? transformedData : defaultProjectData;
};

export default defaultProjectData;
