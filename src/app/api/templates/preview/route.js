// Template Preview API - Handle template previews
import { NextResponse } from "next/server";
import { getTemplatesApiKey } from "@/lib/serviceJwt";

const TEMPLATES_APP_URL = process.env.TEMPLATES_APP_URL || process.env.TEMPLATES_BASE_URL || 'https://portumet.vercel.app';

export async function POST(request) {
	try {
		const requestData = await request.json();
		const { templateId, portfolioData, layout, username, options = {} } = requestData;

		// Optional mapping for local->remote template ids
		const templateIdMap = process.env.TEMPLATE_ID_MAP ? (() => { try { return JSON.parse(process.env.TEMPLATE_ID_MAP); } catch (_) { return {}; } })() : {};
		const mappedTemplateId = templateIdMap[templateId] || templateId;

		console.log('🔍 [TEMPLATE-PREVIEW] Previewing template:', templateId);

		// Get API Key for templates app
		const apiKey = getTemplatesApiKey();

		// Prepare preview data for Templates App
		const previewData = {
			templateId: mappedTemplateId,
			portfolioData,
			// Forward optional params if provided for better rendering fidelity
			...(layout ? { layout } : {}),
			...(username ? { username } : {}),
			options: {
				preview: true,
				version: 'v1',
				...options
			}
		};

		// Send preview request to Templates App
		// Add timeout to avoid long hangs
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000);
		const response = await fetch(`${TEMPLATES_APP_URL}/api/templates/preview`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${apiKey}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(previewData),
			signal: controller.signal
		});
		clearTimeout(timeoutId);

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`❌ [TEMPLATE-PREVIEW] Templates App error: ${response.status} - ${errorText}`);
			
			return NextResponse.json(
				{ 
					success: false, 
					error: `Templates App preview failed: ${response.status}`,
					details: errorText
				},
				{ status: response.status }
			);
		}

		const result = await response.json();
		console.log('✅ [TEMPLATE-PREVIEW] Preview generated successfully');

		return NextResponse.json({
			success: true,
			previewUrl: result.previewUrl,
			html: result.html,
			templateId,
			expiresAt: result.expiresAt,
			// Include the full URL for direct access
			fullPreviewUrl: result.previewUrl ? `${TEMPLATES_APP_URL}${result.previewUrl}` : null
		});

	} catch (error) {
		console.error('❌ [TEMPLATE-PREVIEW] Preview error:', error);
		return NextResponse.json(
			{ 
				success: false, 
				error: error.message 
			},
			{ status: 500 }
		);
	}
}

export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const templateId = searchParams.get('templateId');
	const previewUrl = searchParams.get('previewUrl');

	if (!templateId && !previewUrl) {
		return NextResponse.json(
			{ success: false, error: 'Template ID or preview URL is required' },
			{ status: 400 }
		);
	}

	try {
		console.log('🔍 [TEMPLATE-PREVIEW] Getting preview:', { templateId, previewUrl });

		// If we have a preview URL, redirect to it
		if (previewUrl) {
			const fullUrl = previewUrl.startsWith('http') ? previewUrl : `${TEMPLATES_APP_URL}${previewUrl}`;
			return NextResponse.redirect(fullUrl);
		}

		// If we have template ID, we need portfolio data to generate preview
		return NextResponse.json(
			{ 
				success: false, 
				error: 'Portfolio data is required for preview generation' 
			},
			{ status: 400 }
		);

	} catch (error) {
		console.error('❌ [TEMPLATE-PREVIEW] Get preview error:', error);
		return NextResponse.json(
			{ 
				success: false, 
				error: error.message 
			},
			{ status: 500 }
		);
	}
}
