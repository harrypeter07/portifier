import mongoose from "mongoose";

const PortfolioSchema = new mongoose.Schema({
	// User association
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	username: { type: String, required: false }, // Removed unique: true, sparse: true
	
	// Portfolio configuration
	templateName: { type: String, default: "cleanfolio" },
	templateId: { type: String, default: "cleanfolio" }, // New: specific template ID
	templateType: { type: String, default: "component" }, // New: component or full
	currentTemplate: { type: Object, default: null }, // New: full template object for reference
	portfolioType: { type: String, enum: ['developer', 'designer', 'marketing', 'academic'], default: 'developer' },
	
	// Layout configuration (component mapping)
	layout: { type: Object, default: {} }, // Changed from Array to Object
	
	// Complete portfolio data in new schema format
	portfolioData: {
		personal: {
			firstName: { type: String, default: '' },
			lastName: { type: String, default: '' },
			title: { type: String, default: '' },
			subtitle: { type: String, default: '' },
			avatar: { type: String, default: '' },
			email: { type: String, default: '' },
			phone: { type: String, default: '' },
			location: {
				city: { type: String, default: '' },
				state: { type: String, default: '' },
				country: { type: String, default: '' }
			},
			social: {
				linkedin: { type: String, default: '' },
				github: { type: String, default: '' },
				portfolio: { type: String, default: '' },
				twitter: { type: String, default: '' },
				instagram: { type: String, default: '' },
				behance: { type: String, default: '' },
				dribbble: { type: String, default: '' },
				medium: { type: String, default: '' },
				youtube: { type: String, default: '' }
			},
			tagline: { type: String, default: '' },
			availability: { type: String, default: '' }
		},
		about: {
			summary: { type: String, default: '' },
			bio: { type: String, default: '' },
			interests: [String],
			personalValues: [String],
			funFacts: [String]
		},
		experience: {
			jobs: [{
				id: { type: String, required: true },
				company: String,
				position: String,
				location: String,
				startDate: String,
				endDate: String,
				current: { type: Boolean, default: false },
				description: String,
				responsibilities: [String],
				achievements: [String],
				technologies: [String],
				projects: [String],
				companyLogo: String,
				companyWebsite: String
			}]
		},
		education: {
			degrees: [{
				id: { type: String, required: true },
				institution: String,
				degree: String,
				field: String,
				grade: String,
				startDate: String,
				endDate: String,
				current: { type: Boolean, default: false },
				description: String,
				courses: [String],
				activities: [String],
				honors: [String],
				thesis: String,
				logo: String
			}]
		},
		skills: {
			technical: [{
				category: String,
				skills: [{
					name: String,
					level: String,
					years: { type: Number, default: 0 },
					icon: String,
					certified: { type: Boolean, default: false }
				}]
			}],
			soft: [{
				name: String,
				description: String,
				examples: [String]
			}],
			languages: [{
				name: String,
				proficiency: String,
				certification: String
			}]
		},
		projects: {
			items: [{
				id: { type: String, required: true },
				title: String,
				description: String,
				longDescription: String,
				category: String,
				tags: [String],
				technologies: [String],
				status: String,
				startDate: String,
				endDate: String,
				images: [String],
				videos: [String],
				links: {
					live: String,
					github: String,
					demo: String,
					documentation: String
				},
				features: [String],
				challenges: [String],
				learnings: [String],
				teamSize: { type: Number, default: 0 },
				role: String,
				client: String,
				metrics: {
					users: String,
					performance: String,
					impact: String
				},
				testimonial: {
					text: String,
					author: String,
					title: String,
					avatar: String
				}
			}]
		},
		achievements: {
			awards: [{
				id: { type: String, required: true },
				title: String,
				organization: String,
				date: String,
				description: String,
				image: String,
				link: String,
				category: String
			}],
			certifications: [{
				id: { type: String, required: true },
				name: String,
				organization: String,
				issueDate: String,
				expiryDate: String,
				credentialId: String,
				verificationLink: String,
				image: String,
				skills: [String]
			}],
			publications: [{
				id: { type: String, required: true },
				title: String,
				type: String,
				publisher: String,
				date: String,
				description: String,
				link: String,
				coAuthors: [String],
				citations: { type: Number, default: 0 }
			}],
			patents: [{
				id: { type: String, required: true },
				title: String,
				number: String,
				status: String,
				date: String,
				description: String,
				inventors: [String],
				assignee: String
			}]
		},
		contact: {
			email: String,
			phone: String,
			preferredContact: { type: String, default: 'email' },
			timezone: String,
			availability: String,
			rates: {
				hourly: String,
				project: String,
				retainer: String
			},
			services: [String],
			workingHours: String,
			responseTime: String
		},
		metadata: {
			title: String,
			description: String,
			keywords: [String],
			ogImage: String,
			canonicalUrl: String,
			schema: Object
		},
		theme: {
			primaryColor: { type: String, default: '#3B82F6' },
			secondaryColor: { type: String, default: '#1E40AF' },
			accentColor: { type: String, default: '#F59E0B' },
			backgroundColor: { type: String, default: '#FFFFFF' },
			textColor: { type: String, default: '#1F2937' },
			font: { type: String, default: 'Inter' },
			darkMode: { type: Boolean, default: false },
			animations: { type: Boolean, default: true },
			layout: { type: String, default: 'modern' }
		},
		analytics: {
			googleAnalytics: String,
			googleTagManager: String,
			hotjar: String,
			mixpanel: String,
			customEvents: [Object]
		}
	},
	
	// Legacy content data (for backwards compatibility)
	content: { type: Object, default: {} },
	
	// SEO and public profile settings
	isPublic: { type: Boolean, default: false },
	slug: { type: String, unique: true, sparse: true }, // URL slug for public portfolio
	// Public stats
	views: { type: Number, default: 0 },
	
	// Timestamps
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
});

// Pre-save middleware to update timestamps and generate username
PortfolioSchema.pre('save', function(next) {
	this.updatedAt = new Date();
	
	// Generate username from email if not provided
	if (!this.username && this.portfolioData?.personal?.email) {
		const emailPrefix = this.portfolioData.personal.email.split('@')[0];
		this.username = emailPrefix.toLowerCase().replace(/[^a-z0-9]/g, '');
	}
	
	next();
});

// Instance method to get public portfolio data
PortfolioSchema.methods.getPublicData = function() {
	return {
		id: this._id,
		username: this.username,
		slug: this.slug,
		templateName: this.templateName,
		templateId: this.templateId,
		templateType: this.templateType,
		currentTemplate: this.currentTemplate,
		portfolioType: this.portfolioType,
		layout: this.layout,
		portfolioData: this.portfolioData,
		content: this.content, // For legacy compatibility
		isPublic: this.isPublic,
		views: this.views,
		updatedAt: this.updatedAt
	};
};

// Instance method to validate portfolio completeness
PortfolioSchema.methods.calculateCompleteness = function() {
	const data = this.portfolioData;
	const sections = [
		{ section: 'personal', weight: 20, complete: !!(data.personal?.firstName && data.personal?.lastName && data.personal?.email) },
		{ section: 'about', weight: 15, complete: !!(data.about?.summary) },
		{ section: 'experience', weight: 20, complete: !!(data.experience?.jobs && data.experience.jobs.length > 0) },
		{ section: 'skills', weight: 15, complete: !!(data.skills?.technical && data.skills.technical.length > 0) },
		{ section: 'projects', weight: 20, complete: !!(data.projects?.items && data.projects.items.length > 0) },
		{ section: 'contact', weight: 10, complete: !!(data.personal?.email || data.contact?.email) }
	];

	const totalWeight = sections.reduce((sum, s) => sum + s.weight, 0);
	const completedWeight = sections.reduce((sum, s) => sum + (s.complete ? s.weight : 0), 0);
	
	return Math.round((completedWeight / totalWeight) * 100);
};

export default mongoose.models.Portfolio || mongoose.model("Portfolio", PortfolioSchema);
