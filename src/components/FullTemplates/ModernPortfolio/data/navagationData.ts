// data/navigationData.ts
export const transformNavigationData = (portfolioData) => {
	const personal = portfolioData?.personal || {};
	const fullName = personal.firstName && personal.lastName
		? `${personal.firstName} ${personal.lastName}`
		: personal.title || "My Portfolio";
	
	return {
		title: fullName,
		description: portfolioData?.about?.summary || portfolioData?.about?.bio || 
			"Welcome to my personal portfolio website. Explore my projects, learn about me, and get in touch!",
		image: {
			src: personal.avatar || "/prismic/thank-you-complete.png",
			alt: `${fullName} - Portfolio`,
			width: 500,
			height: 500,
		},
		navigation: [
			{ text: "Home", link: "/" },
			{ text: "Projects", link: "/#projects" },
			{ text: "About", link: "/about" },
			{ text: "Contact", link: "/#contact" },
		],
	};
};

// Default navigation data
export const defaultNavigationData = {
	title: "My Portfolio",
	description:
		"Welcome to my personal portfolio website. Explore my projects, learn about me, and get in touch!",
	image: {
		src: "/prismic/thank-you-complete.png",
		alt: "portfolio",
		width: 500,
		height: 500,
	},
	navigation: [
		{ text: "Home", link: "/" },
		{ text: "Projects", link: "/#projects" },
		{ text: "About", link: "/about" },
		{ text: "Contact", link: "/#contact" },
	],
};

// Export function that returns appropriate data based on portfolio data
export const getNavigationData = (portfolioData) => {
	return portfolioData ? transformNavigationData(portfolioData) : defaultNavigationData;
};

export const navigationData = defaultNavigationData;
