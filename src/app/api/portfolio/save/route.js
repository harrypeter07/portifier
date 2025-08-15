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
			portfolioType = "developer",
			// Force publish for username-only URL; no slug
			isPublic = true,
			resumeId, // Optional: associate with a resume
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
			templateName,
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

		// Upsert a single portfolio per userId (username URL)
		const portfolio = await Portfolio.findOneAndUpdate(
			{ userId: user._id },
			updateData,
			{ new: true, upsert: true, setDefaultsOnInsert: true }
		);

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
		const portfolioUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${portfolio.username || user.username}`;

		return NextResponse.json({
			success: true,
			portfolio: portfolio.getPublicData(),
			completeness,
			validation: {
				isValid: validation.isValid,
				warnings: validation.errors || [],
				suggestions: validation.warnings || [],
			},
			username: portfolio.username || user.username,
			portfolioId: portfolio._id,
			slug: portfolio.slug,
			portfolioUrl: portfolioUrl,
		});
	} catch (err) {
		console.error("Error saving portfolio:", err);
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
