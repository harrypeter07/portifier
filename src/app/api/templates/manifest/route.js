import { NextResponse } from "next/server";

export async function GET() {
	try {
		// Fetch templates from your templates app
		const templatesAppUrl = process.env.TEMPLATES_BASE_URL || "https://portumet.vercel.app";
		const response = await fetch(`${templatesAppUrl}/api/templates/manifest`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			console.error(`Templates app error: ${response.status}`);
			return NextResponse.json(
				{ error: `Templates app error: ${response.status}` },
				{ status: response.status }
			);
		}

		const templates = await response.json();
		
		// Transform templates from templates app format to our local format
		const transformedTemplates = templates.map(template => ({
			id: template.id,
			name: template.name,
			description: template.description,
			category: template.tags?.[0] || "general",
			type: "remote", // Mark as remote template
			version: template.version,
			requiredSections: template.requiredSections || [],
			tags: template.tags || [],
			// Add remote-specific properties
			remote: true,
			source: "templates-app",
			preview: `/templates/${template.id}-preview.jpg`, // Placeholder
		}));

		return NextResponse.json({
			success: true,
			templates: transformedTemplates,
			source: "templates-app"
		});

	} catch (error) {
		console.error("Error fetching templates manifest:", error);
		return NextResponse.json(
			{ error: "Failed to fetch templates" },
			{ status: 500 }
		);
	}
}
