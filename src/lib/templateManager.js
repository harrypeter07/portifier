// Template Manager - Handles template fetching, preview, and publishing
import { getTemplatesApiKey } from './serviceJwt';

const TEMPLATES_APP_URL = process.env.TEMPLATES_APP_URL || process.env.TEMPLATES_BASE_URL || 'https://portumet.vercel.app';

class TemplateManager {
	constructor() {
		this.templates = new Map();
		this.remoteTemplates = new Map();
		this.apiKey = getTemplatesApiKey();
	}

	/**
	 * Fetch templates from remote origin
	 */
	async fetchRemoteTemplates() {
		try {
			console.log('🔍 [TEMPLATE-MANAGER] Fetching remote templates...');
			
			const response = await fetch(`${TEMPLATES_APP_URL}/api/templates/manifest`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${this.apiKey}`,
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error(`Remote templates fetch failed: ${response.status}`);
			}

			const data = await response.json();
			console.log('✅ [TEMPLATE-MANAGER] Remote templates fetched successfully');
			
			// Transform remote templates to match expected format
			const remoteTemplates = Array.isArray(data) ? data : (data.templates || []);
			
			return remoteTemplates.map(template => ({
				id: template.id,
				name: template.name,
				description: template.description,
				category: template.category,
				preview: template.preview,
				version: template.version || '1.0.0',
				author: template.author || 'Remote Team',
				remote: true,
				source: 'remote',
				type: template.type || 'component',
				layout: template.layout,
				theme: template.theme
			}));

		} catch (error) {
			console.error('❌ [TEMPLATE-MANAGER] Remote templates fetch error:', error);
			return [];
		}
	}

	/**
	 * Get all available templates (local + remote)
	 */
	async getAllTemplates() {
		const localTemplates = this.getLocalTemplates();
		const remoteTemplates = await this.fetchRemoteTemplates();
		
		return {
			local: localTemplates,
			remote: remoteTemplates,
			all: [...localTemplates, ...remoteTemplates]
		};
	}

	/**
	 * Get local templates
	 */
	getLocalTemplates() {
		return [
			{
				id: 'cleanfolio',
				name: 'Cleanfolio',
				description: 'Clean and modern portfolio template',
				category: 'developer',
				preview: '/templates/cleanfolio-preview.jpg',
				version: '1.0.0',
				author: 'Portfolio Team',
				remote: false,
				source: 'local'
			},
			{
				id: 'creative',
				name: 'Creative',
				description: 'Creative and artistic portfolio template',
				category: 'designer',
				preview: '/templates/creative-preview.jpg',
				version: '1.0.0',
				author: 'Portfolio Team',
				remote: false,
				source: 'local'
			}
		];
	}

	/**
	 * Preview template with portfolio data
	 */
	async previewTemplate(templateId, portfolioData, options = {}) {
		try {
			console.log('🔍 [TEMPLATE-MANAGER] Previewing template:', templateId);
			
			const previewData = {
				templateId,
				portfolioData,
				options: {
					preview: true,
					version: 'v1',
					...options
				}
			};

			// Send preview request to Templates App
			const response = await fetch(`${TEMPLATES_APP_URL}/api/templates/preview`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${this.apiKey}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(previewData)
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Templates App preview failed: ${response.status} - ${errorText}`);
			}

			const result = await response.json();
			console.log('✅ [TEMPLATE-MANAGER] Preview generated successfully');
			
			return {
				success: true,
				previewUrl: result.previewUrl,
				html: result.html,
				templateId,
				expiresAt: result.expiresAt
			};

		} catch (error) {
			console.error('❌ [TEMPLATE-MANAGER] Preview error:', error);
			return {
				success: false,
				error: error.message
			};
		}
	}

	/**
	 * Publish portfolio with template
	 */
	async publishPortfolio(portfolioData, templateInfo, userInfo) {
		try {
			console.log('🔍 [TEMPLATE-MANAGER] Publishing portfolio...');
			
			// Prepare publish data
			const publishData = {
				username: userInfo.username,
				templateId: templateInfo.id,
				templateName: templateInfo.name,
				templateType: templateInfo.type || 'component',
				templateSource: templateInfo.source || 'local',
				isRemoteTemplate: templateInfo.remote || false,
				portfolioData,
				options: {
					publish: true,
					version: 'v1'
				}
			};

			// Send publish request to Templates App
			const response = await fetch(`${TEMPLATES_APP_URL}/api/templates/publish`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${this.apiKey}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(publishData)
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Templates App publish failed: ${response.status} - ${errorText}`);
			}

			const result = await response.json();
			console.log('✅ [TEMPLATE-MANAGER] Portfolio published successfully');
			
			return {
				success: true,
				portfolioUrl: result.portfolioUrl,
				previewUrl: result.previewUrl,
				templateId: templateInfo.id,
				username: userInfo.username
			};

		} catch (error) {
			console.error('❌ [TEMPLATE-MANAGER] Publish error:', error);
			return {
				success: false,
				error: error.message
			};
		}
	}

	/**
	 * Save portfolio to database
	 */
	async savePortfolioToDatabase(portfolioData, templateInfo, userInfo) {
		try {
			console.log('🔍 [TEMPLATE-MANAGER] Saving portfolio to database...');
			
			const saveData = {
				username: userInfo.username,
				templateId: templateInfo.id,
				templateName: templateInfo.name,
				templateType: templateInfo.type || 'component',
				templateSource: templateInfo.source || 'local',
				isRemoteTemplate: templateInfo.remote || false,
				portfolioData,
				layout: templateInfo.layout || {},
				isPublic: true,
				portfolioType: templateInfo.category || 'developer'
			};

			// Save to database via API
			const response = await fetch('/api/portfolio/save', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(saveData)
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(`Database save failed: ${errorData.error}`);
			}

			const result = await response.json();
			console.log('✅ [TEMPLATE-MANAGER] Portfolio saved to database');
			
			return {
				success: true,
				portfolioId: result.portfolioId,
				username: result.username,
				portfolioUrl: result.portfolioUrl
			};

		} catch (error) {
			console.error('❌ [TEMPLATE-MANAGER] Database save error:', error);
			return {
				success: false,
				error: error.message
			};
		}
	}

	/**
	 * Complete publish flow: Save to DB + Publish to Templates App
	 */
	async completePublishFlow(portfolioData, templateInfo, userInfo) {
		try {
			console.log('🚀 [TEMPLATE-MANAGER] Starting complete publish flow...');
			
			// Step 1: Save to database
			const dbResult = await this.savePortfolioToDatabase(portfolioData, templateInfo, userInfo);
			if (!dbResult.success) {
				throw new Error(`Database save failed: ${dbResult.error}`);
			}

			// Step 2: Publish to Templates App
			const publishResult = await this.publishPortfolio(portfolioData, templateInfo, userInfo);
			if (!publishResult.success) {
				throw new Error(`Templates App publish failed: ${publishResult.error}`);
			}

			console.log('✅ [TEMPLATE-MANAGER] Complete publish flow successful');
			
			return {
				success: true,
				portfolioId: dbResult.portfolioId,
				username: dbResult.username,
				portfolioUrl: publishResult.portfolioUrl,
				previewUrl: publishResult.previewUrl,
				templateId: templateInfo.id
			};

		} catch (error) {
			console.error('❌ [TEMPLATE-MANAGER] Complete publish flow error:', error);
			return {
				success: false,
				error: error.message
			};
		}
	}

	/**
	 * Get template by ID
	 */
	getTemplate(templateId) {
		return this.remoteTemplates.get(templateId) || this.getLocalTemplates().find(t => t.id === templateId);
	}

	/**
	 * Validate template access
	 */
	async validateTemplateAccess(templateId, userInfo) {
		try {
			const response = await fetch(`${TEMPLATES_APP_URL}/api/validate-template`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${this.apiKey}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					templateId,
					username: userInfo.username
				})
			});

			return response.ok;
		} catch (error) {
			console.error('❌ [TEMPLATE-MANAGER] Template validation error:', error);
			return false;
		}
	}
}

export default TemplateManager;
