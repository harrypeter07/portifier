import dbConnect from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { EMPTY_PORTFOLIO } from '@/data/schemas/portfolioSchema';
import { transformLegacyDataToSchema, validatePortfolioData } from '@/utils/dataTransformers';

export async function POST(req) {
	await dbConnect();
	let userId = null;

	try {
		const requestData = await req.json();
		console.log('📥 Received save request:', Object.keys(requestData));
		
		// Handle both new schema format and legacy format
		const {
			layout,
			content, // Legacy format
			portfolioData, // New schema format
			email,
			username,
			templateName = 'cleanfolio',
			portfolioType = 'developer',
			isPublic = false,
			slug
		} = requestData;

		if (!layout) {
			return NextResponse.json(
				{ error: "Missing layout configuration" },
				{ status: 400 }
			);
		}

		// Determine data format and transform if needed
		let finalPortfolioData;
		if (portfolioData) {
			// New schema format - use directly
			finalPortfolioData = portfolioData;
			console.log('📊 Using new schema format');
		} else if (content) {
			// Legacy format - transform to new schema
			finalPortfolioData = transformLegacyDataToSchema(content, layout);
			console.log('🔄 Transformed legacy format to new schema');
		} else {
			// No data provided - use empty portfolio
			finalPortfolioData = JSON.parse(JSON.stringify(EMPTY_PORTFOLIO));
			console.log('📝 Using empty portfolio template');
		}
		
		// Validate portfolio data
		const validation = validatePortfolioData(finalPortfolioData);
		if (!validation.isValid) {
			console.log('⚠️  Portfolio validation warnings:', validation.errors);
			// Continue saving but log warnings
		}
		
		// Determine email for user lookup
		const userEmail = email || finalPortfolioData.personal?.email || finalPortfolioData.contact?.email;
		
		// Find or create user
		if (userEmail) {
			const user = await User.findOne({ email: userEmail });
			if (user) {
				userId = user._id;
				console.log('👤 Found existing user:', userEmail);
			} else {
				// Create a temporary user if not found (for demo purposes)
				console.log('👤 Creating new user for email:', userEmail);
				const newUser = new User({
					email: userEmail,
					name: finalPortfolioData.personal?.firstName 
						? `${finalPortfolioData.personal.firstName} ${finalPortfolioData.personal.lastName}`.trim()
						: userEmail.split("@")[0],
					password: "demo" + Date.now(), // Temporary password
					verified: true, // Skip verification for demo
				});
				await newUser.save();
				userId = newUser._id;
			}
		} else {
			// Fallback: use a default user ID for demo
			console.log("⚠️  No email provided, using demo user");
			const demoUser = await User.findOne({ email: "demo@example.com" });
			if (demoUser) {
				userId = demoUser._id;
			} else {
				const newDemoUser = new User({
					email: "demo@example.com",
					name: "Demo User",
					password: "demo" + Date.now(), // Temporary password
					verified: true,
				});
				await newDemoUser.save();
				userId = newDemoUser._id;
			}
		}

		// Prepare portfolio update data
		const updateData = {
			layout,
			portfolioData: finalPortfolioData,
			content, // Keep legacy format for compatibility
			templateName,
			portfolioType,
			isPublic,
			updatedAt: new Date()
		};
		
		// Add optional fields if provided
		if (username) updateData.username = username;
		if (slug) updateData.slug = slug;
		
		console.log('💾 Saving portfolio with update data keys:', Object.keys(updateData));
		
		// Upsert portfolio for user
		const portfolio = await Portfolio.findOneAndUpdate(
			{ userId },
			updateData,
			{ upsert: true, new: true, setDefaultsOnInsert: true }
		);
		
		// Calculate completeness
		const completeness = portfolio.calculateCompleteness();
		
		console.log(`✅ Portfolio saved successfully for user: ${userId}`);
		console.log(`📊 Portfolio completeness: ${completeness}%`);
		console.log(`🔗 Portfolio will be accessible at: /${portfolio.username || portfolio.slug || portfolio._id}`);
		
		return NextResponse.json({ 
			success: true, 
			portfolio: portfolio.getPublicData(),
			completeness,
			validation: {
				isValid: validation.isValid,
				warnings: validation.errors || [],
				suggestions: validation.warnings || []
			}
		});
	} catch (err) {
		console.error("❌ Error saving portfolio:", err);
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
