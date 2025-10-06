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
import crypto from "node:crypto";

// Utility function to generate unique slug
async function generateUniqueSlug(portfolioData, existingId = null) {
	if (!portfolioData?.personal?.firstName || !portfolioData?.personal?.lastName) {
		return null;
	}
	
	const fullName = `${portfolioData.personal.firstName}-${portfolioData.personal.lastName}`;
	let baseSlug = fullName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
	
	// Make slug unique by appending numbers if needed
	let slug = baseSlug;
	let counter = 1;
	
	while (counter <= 100) { // Limit to prevent infinite loop
		const existingPortfolio = await Portfolio.findOne({ slug });
		if (!existingPortfolio || (existingId && existingPortfolio._id.equals(existingId))) {
			break; // Slug is unique or it's the same document
		}
		counter++;
		slug = `${baseSlug}-${counter}`;
	}
	
	return slug;
}

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
			portfolioId, // New: specific portfolio ID to update
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

		// Normalize data to satisfy schema requirements (ensure IDs on nested arrays, sane defaults)
		const ensureId = (obj) => {
			if (!obj) return obj;
			if (!obj.id) obj.id = crypto.randomUUID();
			return obj;
		};

		try {
			// Experience jobs
			if (finalPortfolioData?.experience?.jobs?.length) {
				finalPortfolioData.experience.jobs = finalPortfolioData.experience.jobs.map((job) => ensureId(job));
			}
			// Projects
			if (finalPortfolioData?.projects?.items?.length) {
				finalPortfolioData.projects.items = finalPortfolioData.projects.items.map((proj) => ensureId(proj));
			}
			// Education
			if (finalPortfolioData?.education?.degrees?.length) {
				finalPortfolioData.education.degrees = finalPortfolioData.education.degrees.map((deg) => ensureId(deg));
			}
			// Skills groups (technical categories and soft skills)
			if (finalPortfolioData?.skills?.technical?.length) {
				finalPortfolioData.skills.technical = finalPortfolioData.skills.technical.map((cat) => {
					const withId = ensureId(cat);
					if (withId?.skills?.length) {
						withId.skills = withId.skills.map((skill) => ensureId(typeof skill === 'object' ? skill : { name: skill }));
					}
					return withId;
				});
			}
			if (finalPortfolioData?.skills?.soft?.length) {
				finalPortfolioData.skills.soft = finalPortfolioData.skills.soft.map((skill) => ensureId(typeof skill === 'object' ? skill : { name: skill }));
			}
		} catch (_) {
			// If normalization fails, proceed; validation will catch issues
		}

		// Validate portfolio data
		const validation = validatePortfolioData(finalPortfolioData);
		if (!validation.isValid) {
			// Continue saving but log warnings
		}

		// Generate unique slug if needed
		const uniqueSlug = await generateUniqueSlug(finalPortfolioData);

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
		if (uniqueSlug) updateData.slug = uniqueSlug;

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

		// Extra logging for slug/username conflicts
		const existingByUsername = await Portfolio.findOne({ username: updateData.username }).select("_id username userId");
		if (existingByUsername && (!portfolioId || String(existingByUsername.userId) !== String(user._id))) {
			console.log("⚠️ [SAVE] Username already used by another portfolio:", existingByUsername.username, existingByUsername._id);
		}

		// Handle portfolio creation/update with strict update preference to avoid duplicates on slug change
		let portfolio;
		if (isNewPortfolio) {
			console.log("🆕 [SAVE] Creating new portfolio explicitly (isNewPortfolio=true):", updateData.username);
			portfolio = new Portfolio(updateData);
			await portfolio.save();
		} else {
			// Determine target portfolio to update
			let targetPortfolio = null;
			if (portfolioId) {
				console.log("🔄 [SAVE] Updating by provided portfolioId:", portfolioId);
				targetPortfolio = await Portfolio.findOne({ _id: portfolioId, userId: user._id });
			} else {
				// Use the latest portfolio for this user as the canonical doc to update
				targetPortfolio = await Portfolio.findOne({ userId: user._id }).sort({ updatedAt: -1 });
			}

			// If another portfolio already uses this username (slug), block update
			if (updateData.username) {
				const conflict = await Portfolio.findOne({ username: updateData.username, userId: { $ne: user._id } }).select("_id username userId");
				if (conflict) {
					return NextResponse.json({ error: "Username is already in use by another user" }, { status: 409 });
				}
			}

			if (targetPortfolio) {
				console.log("🔄 [SAVE] Updating existing portfolio:", targetPortfolio._id, "→ username:", updateData.username);
				portfolio = await Portfolio.findByIdAndUpdate(targetPortfolio._id, updateData, { new: true });
			} else {
				console.log("🆕 [SAVE] No existing portfolio found for user; creating first portfolio:", updateData.username);
				portfolio = new Portfolio(updateData);
				await portfolio.save();
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
