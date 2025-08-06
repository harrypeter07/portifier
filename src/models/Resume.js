import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
	// User association
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	
	// File information
	originalName: { type: String, required: true },
	fileName: { type: String, required: true },
	fileSize: { type: Number, required: true },
	fileType: { type: String, required: true },
	filePath: { type: String, required: false },
	
	// Parsed data
	parsedData: {
		hero: {
			title: String,
			subtitle: String,
			tagline: String,
			availability: String
		},
		contact: {
			email: String,
			phone: String,
			location: String,
			linkedin: String,
			github: String
		},
		about: {
			summary: String,
			bio: String,
			interests: [String],
			personalValues: [String],
			funFacts: [String]
		},
		experience: {
			jobs: [{
				title: String,
				company: String,
				duration: String,
				description: String,
				skills: [String],
				achievements: [String]
			}]
		},
		education: {
			degrees: [{
				degree: String,
				institution: String,
				year: String,
				description: String
			}]
		},
		skills: {
			technical: [String],
			soft: [String]
		},
		languages: [String],
		projects: {
			items: [{
				title: String,
				description: String,
				github: String,
				url: String
			}]
		},
		achievements: {
			awards: [String]
		}
	},
	
	// Processing status
	status: { 
		type: String, 
		enum: ['uploaded', 'processing', 'parsed', 'failed'], 
		default: 'uploaded' 
	},
	
	// Error information if parsing failed
	error: {
		message: String,
		details: String
	},
	
	// Portfolio association (if created from this resume)
	portfolioId: { type: mongoose.Schema.Types.ObjectId, ref: "Portfolio" },
	
	// Timestamps
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
});

// Pre-save middleware to update timestamps
ResumeSchema.pre('save', function(next) {
	this.updatedAt = new Date();
	next();
});

// Instance method to get public resume data
ResumeSchema.methods.getPublicData = function() {
	return {
		id: this._id,
		originalName: this.originalName,
		fileSize: this.fileSize,
		fileType: this.fileType,
		status: this.status,
		parsedData: this.parsedData,
		portfolioId: this.portfolioId,
		createdAt: this.createdAt,
		updatedAt: this.updatedAt
	};
};

// Instance method to check if resume has been used to create a portfolio
ResumeSchema.methods.hasPortfolio = function() {
	return !!this.portfolioId;
};

export default mongoose.models.Resume || mongoose.model("Resume", ResumeSchema); 