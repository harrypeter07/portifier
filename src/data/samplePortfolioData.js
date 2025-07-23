// Sample portfolio data for templates

export const sampleDataCleanfolio = {
	personal: {
		firstName: "John",
		lastName: "Doe",
		title: "Full Stack Developer",
		subtitle: "Building digital experiences that matter",
		email: "john@example.com",
		phone: "+1 (555) 123-4567",
		location: {
			city: "San Francisco",
			state: "CA",
			country: "USA",
		},
		social: {
			linkedin: "linkedin.com/in/johndoe",
			github: "github.com/johndoe",
			portfolio: "johndoe.dev",
			twitter: "twitter.com/johndoe",
		},
		avatar: "",
		tagline: "Passionate about creating scalable web applications",
		availability: "Available for new opportunities",
	},
	about: {
		summary:
			"Experienced full-stack developer with 5+ years building web applications. Passionate about clean code, user experience, and modern technologies.",
		bio: "I'm a dedicated software engineer who loves solving complex problems through code. When I'm not coding, you can find me contributing to open source projects or exploring new technologies.",
		interests: ["Open Source", "Machine Learning", "Web Performance"],
		personalValues: ["Quality", "Collaboration", "Continuous Learning"],
		funFacts: ["Coffee enthusiast", "Marathon runner", "Tech blogger"],
	},
	experience: {
		jobs: [
			{
				id: "1",
				company: "Tech Corp",
				position: "Senior Full Stack Developer",
				location: "San Francisco, CA",
				startDate: "Jan 2022",
				endDate: "",
				current: true,
				description:
					"Lead development of scalable web applications using React and Node.js. Mentor junior developers and drive technical decisions.",
				responsibilities: [
					"Architected and built microservices handling 100k+ daily requests",
					"Led a team of 4 developers in building core platform features",
					"Implemented CI/CD pipelines reducing deployment time by 70%",
				],
				achievements: [
					"Increased application performance by 40%",
					"Reduced bug reports by 60% through comprehensive testing",
				],
				technologies: ["React", "Node.js", "TypeScript", "AWS", "Docker"],
				projects: ["E-commerce Platform", "Analytics Dashboard"],
				companyLogo: "",
				companyWebsite: "https://techcorp.com",
			},
		],
	},
	education: {
		degrees: [
			{
				id: "1",
				institution: "University of Technology",
				degree: "Bachelor of Science",
				field: "Computer Science",
				grade: "3.8 GPA",
				startDate: "2016",
				endDate: "2020",
				current: false,
				description: "Focused on software engineering and data structures",
				courses: ["Data Structures", "Algorithms", "Database Systems"],
				activities: ["Programming Club President", "Hackathon Winner"],
				honors: ["Dean's List", "Magna Cum Laude"],
				thesis: "Machine Learning Applications in Web Development",
				logo: "",
			},
		],
	},
	skills: {
		technical: [
			{
				category: "Frontend",
				skills: [
					{
						name: "React",
						level: "expert",
						years: 4,
						icon: "",
						certified: false,
					},
					{
						name: "JavaScript",
						level: "expert",
						years: 5,
						icon: "",
						certified: false,
					},
					{
						name: "TypeScript",
						level: "advanced",
						years: 3,
						icon: "",
						certified: false,
					},
				],
			},
			{
				category: "Backend",
				skills: [
					{
						name: "Node.js",
						level: "expert",
						years: 4,
						icon: "",
						certified: false,
					},
					{
						name: "Python",
						level: "advanced",
						years: 3,
						icon: "",
						certified: false,
					},
					{
						name: "PostgreSQL",
						level: "advanced",
						years: 4,
						icon: "",
						certified: false,
					},
				],
			},
		],
		soft: [
			{
				name: "Leadership",
				description: "Led multiple development teams",
				examples: ["Team Lead at Tech Corp"],
			},
			{
				name: "Communication",
				description: "Excellent presentation and writing skills",
				examples: ["Tech talks", "Documentation"],
			},
		],
		languages: [
			{ name: "English", proficiency: "native", certification: "" },
			{ name: "Spanish", proficiency: "conversational", certification: "" },
		],
	},
	projects: {
		items: [
			{
				id: "1",
				title: "E-commerce Platform",
				description: "Full-stack e-commerce solution with payment integration",
				longDescription:
					"Built a complete e-commerce platform handling thousands of transactions daily with advanced features like real-time inventory, payment processing, and analytics.",
				category: "Web Application",
				tags: ["E-commerce", "Full-stack", "Payments"],
				technologies: ["React", "Node.js", "MongoDB", "Stripe", "AWS"],
				status: "completed",
				startDate: "2023-01",
				endDate: "2023-06",
				images: ["/projects/ecommerce-1.jpg", "/projects/ecommerce-2.jpg"],
				videos: [],
				links: {
					live: "https://shop.example.com",
					github: "https://github.com/johndoe/ecommerce",
					demo: "https://demo.shop.example.com",
					documentation: "https://docs.shop.example.com",
				},
				features: [
					"Payment Processing",
					"Inventory Management",
					"User Analytics",
				],
				challenges: [
					"Scaling to handle high traffic",
					"Real-time inventory updates",
				],
				learnings: ["Microservices architecture", "Payment security"],
				teamSize: 3,
				role: "Lead Developer",
				client: "Retail Corp",
				metrics: {
					users: "10,000+ active users",
					performance: "99.9% uptime",
					impact: "$2M+ in processed transactions",
				},
				testimonial: {
					text: "John delivered an exceptional e-commerce platform that exceeded our expectations.",
					author: "Sarah Johnson",
					title: "CTO, Retail Corp",
					avatar: "/testimonials/sarah.jpg",
				},
			},
		],
	},
	achievements: {
		awards: [
			{
				id: "1",
				title: "Developer of the Year",
				organization: "Tech Corp",
				date: "2023",
				description:
					"Recognized for outstanding contributions to platform development",
				image: "/awards/developer-year.jpg",
				link: "",
				category: "recognition",
			},
		],
		certifications: [
			{
				id: "1",
				name: "AWS Certified Solutions Architect",
				organization: "Amazon Web Services",
				issueDate: "2023-03",
				expiryDate: "2026-03",
				credentialId: "AWS-SAA-123456",
				verificationLink: "https://aws.amazon.com/verification/123456",
				image: "/certs/aws-saa.png",
				skills: ["Cloud Architecture", "AWS Services", "Security"],
			},
		],
		publications: [
			{
				id: "1",
				title: "Building Scalable React Applications",
				type: "article",
				publisher: "Medium",
				date: "2023-05",
				description: "Guide on architecting large-scale React applications",
				link: "https://medium.com/@johndoe/building-scalable-react",
				coAuthors: [],
				citations: 150,
			},
		],
		patents: [],
	},
	contact: {
		email: "john@example.com",
		phone: "+1 (555) 123-4567",
		preferredContact: "email",
		timezone: "PST",
		availability: "Available for freelance and full-time opportunities",
		rates: {
			hourly: "$75-100",
			project: "Varies by scope",
			retainer: "Available",
		},
		services: ["Web Development", "Technical Consulting", "Code Reviews"],
		workingHours: "9 AM - 5 PM PST",
		responseTime: "Within 24 hours",
	},
	metadata: {
		title: "John Doe - Full Stack Developer Portfolio",
		description:
			"Experienced full-stack developer specializing in React and Node.js",
		keywords: [
			"Full Stack Developer",
			"React",
			"Node.js",
			"JavaScript",
			"Web Development",
		],
		ogImage: "/og-images/john-doe-portfolio.jpg",
		canonicalUrl: "https://johndoe.dev",
		schema: {
			"@context": "https://schema.org",
			"@type": "Person",
			name: "John Doe",
			jobTitle: "Full Stack Developer",
			url: "https://johndoe.dev",
		},
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
	analytics: {
		googleAnalytics: "",
		googleTagManager: "",
		hotjar: "",
		mixpanel: "",
		customEvents: [],
	},
};

export const sampleDataCreative = {
	personal: {
		firstName: "Jane",
		lastName: "Smith",
		title: "UI/UX Designer",
		subtitle: "Creating beautiful digital experiences",
		email: "jane@example.com",
		phone: "+1 (555) 234-5678",
		location: {
			city: "New York",
			state: "NY",
			country: "USA",
		},
		social: {
			linkedin: "linkedin.com/in/janesmith",
			github: "github.com/janesmith",
			portfolio: "janesmith.design",
			twitter: "twitter.com/janesmith",
		},
		avatar: "",
		tagline: "Designing intuitive and beautiful user experiences",
		availability: "Available for new projects",
	},
	about: {
		summary:
			"Passionate UI/UX designer with a keen eye for detail and user-centered design.",
		bio: "I'm a creative thinker who loves crafting digital experiences that are both functional and beautiful. My goal is to create intuitive, accessible, and delightful designs that make a positive impact on users.",
		interests: ["User Research", "Interaction Design", "Accessibility"],
		personalValues: [
			"User-Centered Design",
			"Continuous Learning",
			"Collaboration",
		],
		funFacts: ["Coffee addict", "Travel enthusiast", "Design nerd"],
	},
	experience: {
		jobs: [
			{
				id: "1",
				company: "Design Studio",
				position: "UI/UX Designer",
				location: "San Francisco, CA",
				startDate: "2021",
				endDate: "",
				current: true,
				description:
					"Lead UI/UX design for a variety of digital products, including mobile apps and web platforms.",
				responsibilities: [
					"Conduct user research to understand user needs and pain points",
					"Design wireframes, mockups, and prototypes for digital products",
					"Collaborate with developers to ensure design implementation",
				],
				achievements: [
					"Improved user engagement by 30% for a mobile banking app",
					"Reduced bounce rate by 40% for a SaaS platform",
				],
				technologies: ["Figma", "Adobe XD", "Sketch"],
				projects: ["Mobile Banking App", "SaaS Dashboard"],
				companyLogo: "",
				companyWebsite: "https://designstudio.com",
			},
		],
	},
	education: {
		degrees: [
			{
				id: "1",
				institution: "University of Design",
				degree: "Bachelor of Arts",
				field: "Interaction Design",
				grade: "3.9 GPA",
				startDate: "2017",
				endDate: "2021",
				current: false,
				description:
					"Focused on user-centered design principles and interaction design.",
				courses: ["User Research", "Interaction Design", "Prototyping"],
				activities: ["Design Club President", "Hackathon Winner"],
				honors: ["Dean's List", "Cum Laude"],
				thesis: "Designing Accessible User Interfaces",
				logo: "",
			},
		],
	},
	skills: {
		technical: [
			{
				category: "Design Tools",
				skills: [
					{
						name: "Figma",
						level: "expert",
						years: 3,
						icon: "",
						certified: false,
					},
					{
						name: "Adobe XD",
						level: "advanced",
						years: 2,
						icon: "",
						certified: false,
					},
					{
						name: "Sketch",
						level: "advanced",
						years: 2,
						icon: "",
						certified: false,
					},
				],
			},
			{
				category: "Frontend",
				skills: [
					{
						name: "HTML",
						level: "advanced",
						years: 3,
						icon: "",
						certified: false,
					},
					{
						name: "CSS",
						level: "advanced",
						years: 3,
						icon: "",
						certified: false,
					},
					{
						name: "JavaScript",
						level: "advanced",
						years: 3,
						icon: "",
						certified: false,
					},
				],
			},
		],
		soft: [
			{
				name: "Empathy",
				description: "Strong ability to understand user needs and pain points",
				examples: ["User interviews", "User testing"],
			},
			{
				name: "Communication",
				description: "Excellent collaboration and presentation skills",
				examples: ["Design reviews", "Client meetings"],
			},
		],
		languages: [
			{ name: "English", proficiency: "native", certification: "" },
			{ name: "Spanish", proficiency: "conversational", certification: "" },
		],
	},
	projects: {
		items: [
			{
				id: "1",
				title: "Mobile Banking App",
				description:
					"Enhanced mobile banking experience with intuitive navigation and smooth animations.",
				longDescription:
					"Designed a mobile banking app that prioritizes user experience and accessibility. Features include secure login, intuitive navigation, and smooth animations for a more engaging interface.",
				category: "Mobile App",
				tags: ["Mobile Banking", "UX Design", "Animations"],
				technologies: ["Figma", "Adobe XD", "HTML/CSS"],
				status: "completed",
				startDate: "2022-01",
				endDate: "2022-06",
				images: [
					"/projects/mobile-banking-1.jpg",
					"/projects/mobile-banking-2.jpg",
				],
				videos: [],
				links: {
					live: "https://app.example.com",
					github: "",
					demo: "https://demo.app.example.com",
					documentation: "",
				},
				features: ["Secure Login", "Intuitive Navigation", "Smooth Animations"],
				challenges: ["Complex state management", "Accessibility compliance"],
				learnings: [
					"User-centered design principles",
					"Animation best practices",
				],
				teamSize: 1,
				role: "UI/UX Designer",
				client: "Banking Corp",
				metrics: {
					users: "100,000+ active users",
					performance: "99.9% uptime",
					impact: "Increased user satisfaction by 40%",
				},
				testimonial: {
					text: "Jane's design work significantly improved the user experience of our mobile banking app.",
					author: "Alex Brown",
					title: "Product Manager, Banking Corp",
					avatar: "/testimonials/alex.jpg",
				},
			},
		],
	},
	achievements: {
		awards: [],
		certifications: [],
		publications: [],
		patents: [],
	},
	contact: {
		email: "jane@example.com",
		phone: "+1 (555) 234-5678",
		preferredContact: "email",
		timezone: "EST",
		availability: "Available for freelance and full-time opportunities",
		rates: {
			hourly: "$50-80",
			project: "Varies by scope",
			retainer: "Available",
		},
		services: ["UI/UX Design", "Prototyping", "Design Systems"],
		workingHours: "9 AM - 6 PM EST",
		responseTime: "Within 24 hours",
	},
	metadata: {
		title: "Jane Smith - UI/UX Designer Portfolio",
		description:
			"Passionate UI/UX designer creating beautiful digital experiences.",
		keywords: ["UI/UX Designer", "Interaction Design", "Figma", "Adobe XD"],
		ogImage: "/og-images/jane-smith-portfolio.jpg",
		canonicalUrl: "https://janesmith.design",
		schema: {
			"@context": "https://schema.org",
			"@type": "Person",
			name: "Jane Smith",
			jobTitle: "UI/UX Designer",
			url: "https://janesmith.design",
		},
	},
	theme: {
		primaryColor: "#4F46E5",
		secondaryColor: "#6366F1",
		accentColor: "#8B5CF6",
		backgroundColor: "#F9FAFB",
		textColor: "#1F2937",
		font: "Inter",
		darkMode: false,
		animations: true,
		layout: "modern",
	},
	analytics: {
		googleAnalytics: "",
		googleTagManager: "",
		hotjar: "",
		mixpanel: "",
		customEvents: [],
	},
};

export const sampleDataBusiness = {
	// Business-focused sample data (fill as needed)
};
