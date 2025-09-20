import { NextResponse } from "next/server";
import { getTemplatesApiKey } from "@/lib/serviceJwt";

// Simplified: Just proxy requests to templates app
export async function GET() {
	const requestId = Math.random().toString(36).substr(2, 9);
	
	try {
		console.log(`🔍 [TEMPLATES-MANIFEST-${requestId}] Starting templates manifest request`);
		
		const apiKey = getTemplatesApiKey();
		const templatesAppUrl = process.env.TEMPLATES_BASE_URL || process.env.TEMPLATES_APP_URL || "https://portumet.vercel.app";
		
		console.log(`🔍 [TEMPLATES-MANIFEST-${requestId}] Templates app URL: ${templatesAppUrl}`);
		console.log(`🔍 [TEMPLATES-MANIFEST-${requestId}] API Key: ${apiKey ? 'Present' : 'Missing'}`);
		
		const response = await fetch(`${templatesAppUrl}/api/templates/manifest`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${apiKey}`,
				'Content-Type': 'application/json'
			},
			timeout: 10000 // 10 second timeout
		});

		console.log(`🔍 [TEMPLATES-MANIFEST-${requestId}] Response status: ${response.status}`);

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`❌ [TEMPLATES-MANIFEST-${requestId}] Templates app error: ${response.status} - ${errorText}`);
			
			// Return fallback templates if templates app is not available
			const fallbackTemplates = [
				{
					id: 'modern-resume',
					name: 'Modern Resume',
					version: '1.0.0',
					description: 'Clean, professional resume template with comprehensive sections',
					requiredSections: ['personal', 'about', 'experience'],
					tags: ['developer', 'clean', 'professional', 'comprehensive'],
					remote: true,
					source: 'templates-app',
					fallback: true
				},
				{
					id: 'minimal-card',
					name: 'Minimal Card',
					version: '1.0.0',
					description: 'Simple profile card template',
					requiredSections: ['personal'],
					tags: ['minimal', 'card', 'simple'],
					remote: true,
					source: 'templates-app',
					fallback: true
				}
			];
			
			console.log(`🔄 [TEMPLATES-MANIFEST-${requestId}] Returning fallback templates`);
			return NextResponse.json(fallbackTemplates);
		}

		const result = await response.json();
		console.log(`✅ [TEMPLATES-MANIFEST-${requestId}] Successfully fetched ${result.length || 0} templates from templates app`);
		console.log(`🔍 [TEMPLATES-MANIFEST-${requestId}] Templates:`, result);

		return NextResponse.json(result);

	} catch (error) {
		console.error(`❌ [TEMPLATES-MANIFEST-${requestId}] Error fetching templates manifest:`, error);
		
		// Return fallback templates on error
		const fallbackTemplates = [
			{
				id: 'modern-resume',
				name: 'Modern Resume',
				version: '1.0.0',
				description: 'Clean, professional resume template with comprehensive sections',
				requiredSections: ['personal', 'about', 'experience'],
				tags: ['developer', 'clean', 'professional', 'comprehensive'],
				remote: true,
				source: 'templates-app',
				fallback: true,
				error: error.message
			}
		];
		
		console.log(`🔄 [TEMPLATES-MANIFEST-${requestId}] Returning fallback templates due to error`);
		return NextResponse.json(fallbackTemplates);
	}
}