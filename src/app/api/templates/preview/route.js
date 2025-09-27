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
		const { templateId, portfolioData, layout, username, portfolioId, resumeId, userId, useDb = false, useClientData = false, options = {} } = requestData;

		// Optional mapping for local->remote template ids
		const templateIdMap = process.env.TEMPLATE_ID_MAP ? (() => { try { return JSON.parse(process.env.TEMPLATE_ID_MAP); } catch (_) { return {}; } })() : {};
		const mappedTemplateId = templateIdMap[templateId] || templateId;

		console.log('🔍 [TEMPLATE-PREVIEW] Previewing template:', templateId);

		// Get API Key for templates app
		const apiKey = getTemplatesApiKey();

		// If portfolioData is missing, try to populate from DB using username
		let finalPortfolioData = (useClientData ? portfolioData : null) || null;
		let dataSource = null;
		let user = null;
		
		// Priorities to populate missing data:
		// 1) Explicit portfolioId
		// 2) Username (latest portfolio)
		// 3) ResumeId -> linked portfolio if present (fallback later possible)
		if (!useClientData && (!finalPortfolioData || Object.keys(finalPortfolioData || {}).length === 0)) {
			try {
				await dbConnect();
				
				// Get authenticated user first
				try {
					user = await auth();
					console.log('🔍 [TEMPLATE-PREVIEW] Authenticated user:', {
						userId: user?._id,
						username: user?.username,
						email: user?.email
					});
				} catch (authError) {
					console.log('⚠️ [TEMPLATE-PREVIEW] No authenticated user:', authError.message);
					// If no authenticated user, we'll use empty data
					user = null;
				}
				
				let effectiveUsername = username;
				if (!effectiveUsername && user) {
					// Use authenticated user's username as a fallback
					if (user?.username) effectiveUsername = user.username;
					else if (user?.email) effectiveUsername = user.email.split('@')[0];
				}
				if (portfolioId) {
					const p = await Portfolio.findById(portfolioId);
					if (p) {
						finalPortfolioData = p.portfolioData || p.content || {};
						dataSource = { collection: 'portfolios', id: p._id.toString() };
					}
				}

				if (!finalPortfolioData && effectiveUsername) {
					// Try both username and email lookup (since /api/portfolio/get uses email)
					let user = await User.findOne({ username: effectiveUsername });
					if (!user) {
						user = await User.findOne({ email: effectiveUsername });
					}
					if (!user && effectiveUsername.includes('@')) {
						user = await User.findOne({ email: effectiveUsername });
					}
					
					if (user) {
						const portfolio = await Portfolio.findOne({ userId: user._id }).sort({ updatedAt: -1 });
						if (portfolio) {
							finalPortfolioData = portfolio.portfolioData || portfolio.content || {};
							dataSource = { collection: 'portfolios', id: portfolio._id.toString() };
							console.log('🔍 [TEMPLATE-PREVIEW] Found user and portfolio:', {
								userId: user._id,
								username: user.username,
								email: user.email,
								portfolioId: portfolio._id,
								hasPortfolioData: !!finalPortfolioData,
								personalName: finalPortfolioData?.personal?.firstName + ' ' + finalPortfolioData?.personal?.lastName
							});
						} else {
							console.log('⚠️ [TEMPLATE-PREVIEW] User found but no portfolio:', {
								userId: user._id,
								username: user.username,
								email: user.email
							});
						}
					} else {
						console.log('⚠️ [TEMPLATE-PREVIEW] User not found:', { effectiveUsername });
					}
				}

				// If still no portfolio data, try to get from latest parsed resume for authenticated user or provided userId
				if (!finalPortfolioData && (user || userId)) {
					const targetUserId = user?._id || userId;
					console.log('🔍 [TEMPLATE-PREVIEW] Looking for parsed resume data for user:', {
						userId: targetUserId,
						username: user?.username,
						email: user?.email,
						providedUserId: userId
					});
					
					const { default: Resume } = await import('@/models/Resume');
					const latestResume = await Resume.findOne({ userId: targetUserId, status: 'parsed' })
						.sort({ updatedAt: -1 });
					
					console.log('📄 [TEMPLATE-PREVIEW] Resume query result for authenticated user:', {
						foundResume: !!latestResume,
						resumeId: latestResume?._id,
						hasParsedData: !!latestResume?.parsedData,
						parsedDataKeys: latestResume?.parsedData ? Object.keys(latestResume.parsedData) : [],
						status: latestResume?.status,
						updatedAt: latestResume?.updatedAt,
						heroTitle: latestResume?.parsedData?.hero?.title,
						contactEmail: latestResume?.parsedData?.contact?.email
					});
					
					if (latestResume?.parsedData) {
						// Transform resume parsedData to portfolio format
						const resumeData = latestResume.parsedData;
						finalPortfolioData = {
							personal: {
								firstName: resumeData.hero?.title?.split(' ')[0] || '',
								lastName: resumeData.hero?.title?.split(' ').slice(1).join(' ') || '',
								title: resumeData.hero?.subtitle || '',
								subtitle: resumeData.hero?.subtitle || '',
								email: resumeData.contact?.email || '',
								phone: resumeData.contact?.phone || '',
								location: resumeData.contact?.location || '',
								social: {
									linkedin: resumeData.contact?.linkedin || '',
									github: resumeData.contact?.github || ''
								},
								tagline: resumeData.hero?.tagline || ''
							},
							about: {
								summary: resumeData.about?.summary || '',
								bio: resumeData.about?.bio || ''
							},
							experience: {
								jobs: resumeData.experience?.jobs || []
							},
							education: {
								degrees: resumeData.education?.degrees || []
							},
							skills: {
								technical: resumeData.skills?.technical || [],
								soft: resumeData.skills?.soft || []
							},
							projects: {
								items: resumeData.projects?.items || []
							},
							achievements: {
								awards: resumeData.achievements?.awards || []
							}
						};
						dataSource = { collection: 'resumes', id: latestResume._id.toString() };
						console.log('🔍 [TEMPLATE-PREVIEW] Found parsed resume data:', {
							resumeId: latestResume._id,
							hasParsedData: !!latestResume.parsedData,
							personalName: finalPortfolioData?.personal?.firstName + ' ' + finalPortfolioData?.personal?.lastName,
							transformedSections: Object.keys(finalPortfolioData || {}),
							personalData: finalPortfolioData?.personal ? {
								firstName: finalPortfolioData.personal.firstName,
								lastName: finalPortfolioData.personal.lastName,
								email: finalPortfolioData.personal.email,
								title: finalPortfolioData.personal.title
							} : null,
							experienceCount: finalPortfolioData?.experience?.jobs?.length || 0,
							skillsCount: finalPortfolioData?.skills?.technical?.length || 0
						});
					}
				}

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
						source: dataSource,
						authenticatedUser: user ? {
							userId: user._id,
							username: user.username,
							email: user.email
						} : null
					});
				} else {
					console.log('⚠️ [TEMPLATE-PREVIEW] No portfolio data found in DB for authenticated user:', { 
						username, 
						portfolioId, 
						resumeId,
						authenticatedUser: user ? {
							userId: user._id,
							username: user.username,
							email: user.email
						} : null
					});
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

		// Try to connect to external templates app first
		let result;
		try {
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
				throw new Error(`Templates App preview failed: ${response.status}`);
			}

			result = await response.json();
			console.log('✅ [TEMPLATE-PREVIEW] External preview generated successfully');

			return NextResponse.json({
				success: true,
				previewUrl: result.previewUrl,
				html: result.html,
				templateId,
				expiresAt: result.expiresAt,
				// Include the full URL for direct access
				fullPreviewUrl: result.previewUrl ? `${TEMPLATES_APP_URL}${result.previewUrl}` : null
			});

		} catch (externalError) {
			console.log('⚠️ [TEMPLATE-PREVIEW] External templates app unavailable, using local preview:', externalError.message);
			
			// Fallback to local preview using existing editor preview system
			try {
				// Use the existing editor preview system
				const localPreviewUrl = `/preview/live?templateId=${mappedTemplateId}&data=${encodeURIComponent(JSON.stringify(transformedData))}`;
				
				console.log('✅ [TEMPLATE-PREVIEW] Local preview generated successfully');
				
				return NextResponse.json({
					success: true,
					previewUrl: localPreviewUrl,
					html: null, // Local preview doesn't need HTML
					templateId,
					expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
					// Include the full URL for direct access
					fullPreviewUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${localPreviewUrl}`,
					isLocalPreview: true
				});
			} catch (localError) {
				console.error('❌ [TEMPLATE-PREVIEW] Local preview also failed:', localError.message);
				throw localError;
			}
		}

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
