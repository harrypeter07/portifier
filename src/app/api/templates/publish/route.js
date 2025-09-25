// Template Publish API - Handle portfolio publishing
import { NextResponse } from "next/server";
import { getTemplatesApiKey } from "@/lib/serviceJwt";
import dbConnect from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import User from "@/models/User";

const TEMPLATES_APP_URL = process.env.TEMPLATES_APP_URL || process.env.TEMPLATES_BASE_URL || 'https://portumet.vercel.app';

export async function POST(request) {
	try {
		const requestData = await request.json();
		const { 
			username, 
			templateId, 
			templateName, 
			templateType = 'component',
			templateSource = 'local',
			isRemoteTemplate = false,
			portfolioData, 
			layout = {},
			options = {} 
		} = requestData;

		console.log('🔍 [TEMPLATE-PUBLISH] Publishing portfolio:', { username, templateId });

		// Connect to database
		await dbConnect();

		// Find user
		const user = await User.findOne({ username });
		if (!user) {
			return NextResponse.json(
				{ success: false, error: 'User not found' },
				{ status: 404 }
			);
		}

		// Optional remapping: allow local->remote template id mapping via env
		const templateIdMap = process.env.TEMPLATE_ID_MAP ? (() => {
			try { return JSON.parse(process.env.TEMPLATE_ID_MAP); } catch (_) { return {}; }
		})() : {};
		const mappedTemplateId = templateIdMap[templateId] || templateId;
		const mappedTemplateName = templateIdMap[templateName] || templateName;

		// Prepare portfolio data for database
		const portfolioUpdateData = {
			userId: user._id,
			username,
			templateId: mappedTemplateId,
			templateName: mappedTemplateName,
			templateType,
			templateSource,
			isRemoteTemplate,
			portfolioData,
			layout,
			isPublic: true,
			updatedAt: new Date()
		};

		// Save/update portfolio in database
		let portfolio;
		const existingPortfolio = await Portfolio.findOne({ 
			userId: user._id, 
			username 
		});

		if (existingPortfolio) {
			portfolio = await Portfolio.findByIdAndUpdate(
				existingPortfolio._id,
				portfolioUpdateData,
				{ new: true }
			);
		} else {
			portfolio = new Portfolio(portfolioUpdateData);
			await portfolio.save();
		}

		console.log('✅ [TEMPLATE-PUBLISH] Portfolio saved to database:', portfolio._id);

		// Get API Key for templates app
		const apiKey = getTemplatesApiKey();

		// Prepare publish data for Templates App
		const publishData = {
			username,
			templateId: mappedTemplateId,
			templateName: mappedTemplateName,
			templateType,
			templateSource,
			isRemoteTemplate,
			portfolioData,
			options: {
				publish: true,
				version: 'v1',
				...options
			}
		};

		// Send publish request to Templates App
		let result;
		try {
			// Add explicit timeout to avoid long hangs
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s
			const response = await fetch(`${TEMPLATES_APP_URL}/api/templates/publish`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${apiKey}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(publishData),
				signal: controller.signal
			});
			clearTimeout(timeoutId);

			if (!response.ok) {
				const errorText = await response.text();
				console.error(`❌ [TEMPLATE-PUBLISH] Templates App error: ${response.status} - ${errorText}`);
				// Fall through to local-success response below
				return NextResponse.json({
					success: true,
					portfolioId: portfolio._id,
					username,
					portfolioUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${username}`,
					templateId,
					warning: 'Portfolio saved locally but Templates App publish failed',
					templatesAppError: errorText
				});
			}

			result = await response.json();
		} catch (templatesError) {
			console.error('❌ [TEMPLATE-PUBLISH] Templates App request error:', templatesError);
			return NextResponse.json({
				success: true,
				portfolioId: portfolio._id,
				username,
				portfolioUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${username}`,
				templateId,
				warning: 'Portfolio saved locally; Templates App unreachable',
				templatesAppError: templatesError.message
			});
		}
		console.log('✅ [TEMPLATE-PUBLISH] Portfolio published to Templates App');

		return NextResponse.json({
			success: true,
			portfolioId: portfolio._id,
			username,
			portfolioUrl: result.portfolioUrl || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${username}`,
			previewUrl: result.previewUrl,
			templateId,
			templateName,
			templateType,
			templateSource,
			isRemoteTemplate
		});

	} catch (error) {
		console.error('❌ [TEMPLATE-PUBLISH] Publish error:', error);
		return NextResponse.json(
			{ 
				success: false, 
				error: error.message 
			},
			{ status: 500 }
		);
	}
}
