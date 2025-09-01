import dbConnect from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import User from "@/models/User";
import Resume from "@/models/Resume";
import { NextResponse } from "next/server";
import { EMPTY_PORTFOLIO } from "@/data/schemas/portfolioSchema";
import {
	transformLegacyDataToSchema,
	validatePortfolioData,
} from "@/utils/dataTransformers";
import { auth } from "@/lib/auth";

export async function POST(req) {
	await dbConnect();

	try {
		// Get authenticated user
		const user = await auth();
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const requestData = await req.json();

		// Handle both new schema format and legacy format
		const {
			layout,
			content, // Legacy format
			portfolioData, // New schema format
			username,
			templateName = "cleanfolio",
			templateId, // New: specific template ID
			templateType = "component", // New: template type
			currentTemplate, // New: full template object
			portfolioType = "developer",
			// Force publish for username-only URL; no slug
			isPublic = true,
			resumeId, // Optional: associate with a resume
			isNewPortfolio = false, // New: flag to create new portfolio instead of updating
		} = requestData;

		if (!layout) {
			return NextResponse.json(
				{ error: "Missing layout configuration" },
				{ status: 400 }
			);
		}

		// Determine final template information
		const finalTemplateId = templateId || currentTemplate?.id || templateName || "cleanfolio";
		const finalTemplateName = currentTemplate?.name || templateName || "cleanfolio";
		const finalTemplateType = templateType || currentTemplate?.type || "component";

		console.log("🎨 [SAVE] Template information:", {
			originalTemplateId: templateId,
			originalTemplateName: templateName,
			currentTemplateId: currentTemplate?.id,
			currentTemplateName: currentTemplate?.name,
			finalTemplateId,
			finalTemplateName,
			finalTemplateType,
			portfolioType
		});

		// Determine data format and transform if needed
		let finalPortfolioData;
		if (portfolioData) {
			// New schema format - use directly
			finalPortfolioData = portfolioData;
		} else if (content) {
			// Legacy format - transform to new schema
			finalPortfolioData = transformLegacyDataToSchema(content, layout);
		} else {
			// No data provided - use empty portfolio
			finalPortfolioData = JSON.parse(JSON.stringify(EMPTY_PORTFOLIO));
		}

		// Validate portfolio data
		const validation = validatePortfolioData(finalPortfolioData);
		if (!validation.isValid) {
			// Continue saving but log warnings
		}

		// Prepare portfolio update data
		const updateData = {
			userId: user._id,
			layout,
			portfolioData: finalPortfolioData,
			content, // Keep legacy format for compatibility
			templateName: finalTemplateId, // Use the specific template ID
			templateId: finalTemplateId, // Store template ID
			templateType: finalTemplateType, // Store template type
			currentTemplate: currentTemplate, // Store full template object for reference
			portfolioType,
			isPublic,
			updatedAt: new Date(),
		};

		// Add optional fields if provided
		if (username) updateData.username = username;

		// Ensure username is always set for uniqueness
		if (!updateData.username) {
			updateData.username = user.username || (user.email && user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, ''));
		}
		
		console.log("💾 [SAVE] Portfolio save details:", {
			userId: user._id,
			userEmail: user.email,
			userUsername: user.username,
			finalUsername: updateData.username,
			hasLayout: !!layout,
			hasPortfolioData: !!finalPortfolioData
		});

		// Handle portfolio creation/update based on isNewPortfolio flag
		let portfolio;
		if (isNewPortfolio) {
			// Create a new portfolio with the specified username
			console.log("🆕 [SAVE] Creating new portfolio with username:", updateData.username);
			portfolio = new Portfolio(updateData);
			await portfolio.save();
		} else {
			// Update existing portfolio - if username is provided, update that specific portfolio
			if (username) {
				console.log("🔄 [SAVE] Updating specific portfolio with username:", username);
				portfolio = await Portfolio.findOneAndUpdate(
					{ userId: user._id, username: username },
					updateData,
					{ new: true, upsert: true, setDefaultsOnInsert: true }
				);
			} else {
				// Fallback: update the latest portfolio for the user
				console.log("🔄 [SAVE] Updating latest portfolio for user:", user._id);
				portfolio = await Portfolio.findOneAndUpdate(
					{ userId: user._id },
					updateData,
					{ new: true, upsert: true, setDefaultsOnInsert: true }
				);
			}
		}

		// Associate resume with portfolio if resumeId is provided
		if (resumeId) {
			try {
				await Resume.findByIdAndUpdate(resumeId, {
					portfolioId: portfolio._id,
					status: 'parsed'
				});
			} catch (error) {
				console.error("Error associating resume with portfolio:", error);
				// Continue without failing the portfolio save
			}
		}

		// Calculate completeness
		const completeness = portfolio.calculateCompleteness();

		// Generate portfolio URL with username only
		const finalUsername = portfolio.username || updateData.username || user.username;
		const portfolioUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${finalUsername}`;
		
		console.log("✅ [SAVE] Portfolio saved successfully:", {
			portfolioId: portfolio._id,
			finalUsername,
			portfolioUrl,
			templateId: finalTemplateId,
			templateName: finalTemplateName,
			templateType: finalTemplateType,
			completeness: portfolio.calculateCompleteness()
		});

		return NextResponse.json({
			success: true,
			portfolio: portfolio.getPublicData(),
			completeness,
			validation: {
				isValid: validation.isValid,
				warnings: validation.errors || [],
				suggestions: validation.warnings || [],
			},
			username: finalUsername,
			portfolioId: portfolio._id,
			slug: portfolio.slug,
			portfolioUrl: portfolioUrl,
			// Include template information in response
			templateId: finalTemplateId,
			templateName: finalTemplateName,
			templateType: finalTemplateType,
			template: currentTemplate, // Full template object
		});
	} catch (err) {
		console.error("Error saving portfolio:", err);
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
