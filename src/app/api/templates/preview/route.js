// Template Preview API - Handle template previews
import { NextResponse } from "next/server";
import { getTemplatesApiKey } from "@/lib/serviceJwt";
import dbConnect from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import User from "@/models/User";
import { auth } from "@/lib/auth";

const TEMPLATES_APP_URL = process.env.TEMPLATES_APP_URL || process.env.TEMPLATES_BASE_URL || 'https://portumet.vercel.app';

export async function POST(request) {
	try {
		const requestData = await request.json();
		const { templateId, portfolioData, layout, username, portfolioId, resumeId, useDb = false, useClientData = false, options = {} } = requestData;

		// Optional mapping for local->remote template ids
		const templateIdMap = process.env.TEMPLATE_ID_MAP ? (() => { try { return JSON.parse(process.env.TEMPLATE_ID_MAP); } catch (_) { return {}; } })() : {};
		const mappedTemplateId = templateIdMap[templateId] || templateId;

		console.log('🔍 [TEMPLATE-PREVIEW] Previewing template:', templateId);

		// Get API Key for templates app
		const apiKey = getTemplatesApiKey();

		// If portfolioData is missing, try to populate from DB using username
		let finalPortfolioData = (useClientData ? portfolioData : null) || null;
		let dataSource = null;
		// Priorities to populate missing data:
		// 1) Explicit portfolioId
		// 2) Username (latest portfolio)
		// 3) ResumeId -> linked portfolio if present (fallback later possible)
		if (!useClientData && (!finalPortfolioData || Object.keys(finalPortfolioData || {}).length === 0)) {
			try {
				await dbConnect();
				let effectiveUsername = username;
				if (!effectiveUsername) {
					// Use authenticated user's username as a fallback
					try {
						const me = await auth();
						if (me?.username) effectiveUsername = me.username;
						else if (me?.email) effectiveUsername = me.email.split('@')[0];
					} catch {}
				}
				if (portfolioId) {
					const p = await Portfolio.findById(portfolioId);
					if (p) {
						finalPortfolioData = p.portfolioData || p.content || {};
						dataSource = { collection: 'portfolios', id: p._id.toString() };
					}
				}

				if (!finalPortfolioData && effectiveUsername) {
					const user = await User.findOne({ username: effectiveUsername });
					if (user) {
						const portfolio = await Portfolio.findOne({ userId: user._id }).sort({ updatedAt: -1 });
						if (portfolio) {
							finalPortfolioData = portfolio.portfolioData || portfolio.content || {};
							dataSource = { collection: 'portfolios', id: portfolio._id.toString() };
						}
					}
				}

				// Note: resumeId fetch can be added here if resume documents link to portfolio
				// Keeping placeholder for future extension

				if (finalPortfolioData) {
					console.log('🧩 [TEMPLATE-PREVIEW] Loaded portfolioData from DB for preview:', {
						username: effectiveUsername || null,
						templateId: mappedTemplateId,
						sections: Object.keys(finalPortfolioData),
						personal: {
							firstName: finalPortfolioData?.personal?.firstName,
							lastName: finalPortfolioData?.personal?.lastName,
							email: finalPortfolioData?.personal?.email
						},
						source: dataSource
					});
				} else {
					console.log('⚠️ [TEMPLATE-PREVIEW] No portfolio data found in DB for given identifiers', { username, portfolioId, resumeId });
				}
			} catch (dbErr) {
				console.log('⚠️ [TEMPLATE-PREVIEW] Failed to fetch portfolioData from DB:', dbErr?.message);
			}
		}

		// Prepare preview data for Templates App
		// Transform data to a shape commonly expected by Templates App
		function transformToTemplatesShape(data) {
			if (!data || typeof data !== 'object') return {};
			const personal = data.personal || {};
			const about = data.about || {};
			const experience = Array.isArray(data?.experience?.jobs) ? data.experience.jobs.map(j => ({
				company: j.company,
				position: j.position,
				location: j.location,
				startDate: j.startDate,
				endDate: j.endDate,
				current: !!j.current,
				description: j.description
			})) : [];
			const skills = {
				technical: Array.isArray(data?.skills?.technical) ? data.skills.technical.flatMap(cat => Array.isArray(cat.skills) ? cat.skills.map(s => s.name || s) : []) : [],
				soft: Array.isArray(data?.skills?.soft) ? data.skills.soft.map(s => s.name || s) : []
			};
			const projects = Array.isArray(data?.projects?.items) ? data.projects.items.map(p => ({
				title: p.title,
				description: p.description,
				technologies: p.technologies,
				links: p.links
			})) : [];
			const education = Array.isArray(data?.education?.degrees) ? data.education.degrees.map(d => ({
				institution: d.institution,
				degree: d.degree,
				field: d.field,
				startDate: d.startDate,
				endDate: d.endDate
			})) : [];

			return {
				personal: {
					firstName: personal.firstName,
					lastName: personal.lastName,
					title: personal.title,
					subtitle: personal.subtitle,
					email: personal.email,
					phone: personal.phone,
					location: personal.location,
					social: personal.social,
					avatar: personal.avatar,
					tagline: personal.tagline
				},
				about: { summary: about.summary, bio: about.bio },
				experience,
				skills,
				projects,
				education
			};
		}

		const transformedData = transformToTemplatesShape(finalPortfolioData);

		const includeRaw = (process.env.TEMPLATE_SEND_RAW || '').toLowerCase() === 'true';

		const previewData = {
			templateId: mappedTemplateId,
			portfolioData: transformedData,
			...(includeRaw ? { rawPortfolioData: finalPortfolioData } : {}),
			// Forward optional params if provided for better rendering fidelity
			...(layout ? { layout } : {}),
			...(username ? { username } : {}),
			// Include source metadata for Templates App to optionally fetch directly
			...(dataSource ? { source: dataSource } : {}),
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
		// Detailed logging of the exact payload being sent
		console.log('📦 [TEMPLATE-PREVIEW] Sending preview payload summary:', {
			mappedTemplateId,
			username: username || null,
			hasPortfolioData: !!finalPortfolioData,
			rawSections: finalPortfolioData ? Object.keys(finalPortfolioData) : [],
			transformed: {
				experienceCount: Array.isArray(transformedData?.experience) ? transformedData.experience.length : 0,
				projectsCount: Array.isArray(transformedData?.projects) ? transformedData.projects.length : 0,
				skillsTechCount: Array.isArray(transformedData?.skills?.technical) ? transformedData.skills.technical.length : 0,
				personal: transformedData?.personal ? {
					firstName: transformedData.personal.firstName,
					lastName: transformedData.personal.lastName,
					email: transformedData.personal.email
				} : null
			}
		});

		console.log('🔍 [TEMPLATE-PREVIEW] DETAILED PAYLOAD BREAKDOWN:');
		console.log('Template ID:', mappedTemplateId);
		console.log('Username:', username);
		console.log('Data Source:', dataSource);
		console.log('Raw Portfolio Data Keys:', Object.keys(finalPortfolioData || {}));
		console.log('Transformed Data Keys:', Object.keys(transformedData || {}));
		
		// Log each section of the transformed data
		if (transformedData) {
			console.log('📋 [TEMPLATE-PREVIEW] TRANSFORMED DATA SECTIONS:');
			Object.entries(transformedData).forEach(([key, value]) => {
				if (Array.isArray(value)) {
					console.log(`  ${key}: [${value.length} items]`, value.slice(0, 2));
				} else if (typeof value === 'object' && value !== null) {
					console.log(`  ${key}:`, Object.keys(value));
					if (key === 'personal') {
						console.log(`    personal details:`, value);
					}
				} else {
					console.log(`  ${key}:`, value);
				}
			});
		}

		console.log('🎯 [TEMPLATE-PREVIEW] COMPLETE PAYLOAD OBJECT:');
		console.log(JSON.stringify(previewData, null, 2));

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
