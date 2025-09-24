// Templates API - Fetch and manage templates
import { NextResponse } from "next/server";
import { 
	getAllTemplates, 
	getTemplatesByCategory, 
	getTemplateById 
} from "@/data/templates/templateManager";
import TemplateManager from "@/lib/templateManager";

const templateManager = new TemplateManager();

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const source = searchParams.get('source'); // 'local', 'remote', 'all'
		const category = searchParams.get('category');
		const refresh = searchParams.get('refresh') === 'true';

		console.log('🔍 [TEMPLATES-API] Fetching templates:', { source, category, refresh });

		let templates;

		if (source === 'local') {
			templates = getAllTemplates();
		} else if (source === 'remote') {
			templates = await templateManager.fetchRemoteTemplates();
		} else {
			// Fetch all templates (local + remote)
			const allTemplates = await templateManager.getAllTemplates();
			templates = allTemplates.all;
		}

		// Transform templates to match expected API format
		templates = templates.map(template => ({
			id: template.id,
			name: template.name,
			description: template.description,
			category: template.category,
			preview: template.preview,
			version: '1.0.0',
			author: 'Portfolio Team',
			remote: false,
			source: 'local',
			type: template.type,
			layout: template.layout,
			theme: template.theme
		}));

		// Filter by category if specified
		if (category) {
			templates = templates.filter(template => 
				template.category === category || 
				template.category === 'general'
			);
		}

		console.log(`✅ [TEMPLATES-API] Returning ${templates.length} templates`);

		return NextResponse.json({
			success: true,
			templates,
			count: templates.length,
			source: source || 'all',
			category: category || 'all'
		});

	} catch (error) {
		console.error('❌ [TEMPLATES-API] Error fetching templates:', error);
		return NextResponse.json(
			{ 
				success: false, 
				error: error.message,
				templates: [],
				count: 0
			},
			{ status: 500 }
		);
	}
}

export async function POST(request) {
	try {
		const requestData = await request.json();
		const { action, templateId, portfolioData, userInfo, options } = requestData;

		console.log('🔍 [TEMPLATES-API] Template action:', action);

		switch (action) {
			case 'preview':
				const previewResult = await templateManager.previewTemplate(
					templateId, 
					portfolioData, 
					options
				);
				return NextResponse.json(previewResult);

			case 'publish':
				const publishResult = await templateManager.completePublishFlow(
					portfolioData,
					{ id: templateId, ...options.templateInfo },
					userInfo
				);
				return NextResponse.json(publishResult);

			case 'validate':
				const isValid = await templateManager.validateTemplateAccess(templateId, userInfo);
				return NextResponse.json({ success: true, valid: isValid });

			default:
				return NextResponse.json(
					{ success: false, error: 'Invalid action' },
					{ status: 400 }
				);
		}

	} catch (error) {
		console.error('❌ [TEMPLATES-API] Error processing template action:', error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
