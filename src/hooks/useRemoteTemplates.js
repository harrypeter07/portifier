import { useState, useEffect } from 'react';

export function useRemoteTemplates() {
	const [templates, setTemplates] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function fetchRemoteTemplates() {
			const requestId = Math.random().toString(36).substr(2, 9);
			
			try {
				setLoading(true);
				setError(null);
				
				console.log(`🔍 [REMOTE-TEMPLATES-${requestId}] Fetching templates from /api/templates/manifest`);
				const response = await fetch('/api/templates/manifest');
				const data = await response.json();
				
				console.log(`🔍 [REMOTE-TEMPLATES-${requestId}] Response:`, { 
					status: response.status, 
					dataType: Array.isArray(data) ? 'array' : 'object',
					dataLength: Array.isArray(data) ? data.length : Object.keys(data).length
				});
				
				if (response.ok) {
					// Handle both array response (new format) and object response (old format)
					let templatesList = [];
					
					if (Array.isArray(data)) {
						// New format: direct array of templates
						templatesList = data;
						console.log(`✅ [REMOTE-TEMPLATES-${requestId}] Direct array format: ${templatesList.length} templates`);
					} else if (data.templates && Array.isArray(data.templates)) {
						// Old format: object with templates array
						templatesList = data.templates;
						console.log(`✅ [REMOTE-TEMPLATES-${requestId}] Object format: ${templatesList.length} templates`);
					} else {
						console.error(`❌ [REMOTE-TEMPLATES-${requestId}] Unexpected data format:`, data);
						setError('Unexpected response format from templates service');
						return;
					}
					
					// Mark templates as remote and add source info
					const remoteTemplates = templatesList.map(template => ({
						...template,
						remote: true,
						source: template.source || 'templates-app',
						fallback: template.fallback || false
					}));
					
					console.log(`🔍 [REMOTE-TEMPLATES-${requestId}] Setting templates:`, remoteTemplates);
					console.log(`🔍 [REMOTE-TEMPLATES-${requestId}] Templates count: ${remoteTemplates.length}`);
					
					setTemplates(remoteTemplates);
					
					// Check if any templates are fallback templates
					const fallbackCount = remoteTemplates.filter(t => t.fallback).length;
					if (fallbackCount > 0) {
						console.warn(`⚠️ [REMOTE-TEMPLATES-${requestId}] ${fallbackCount} fallback templates detected - templates app may be unavailable`);
					}
					
				} else {
					console.error(`❌ [REMOTE-TEMPLATES-${requestId}] Error response:`, data);
					setError(data.error || `HTTP ${response.status}: Failed to fetch templates`);
				}
			} catch (err) {
				console.error(`❌ [REMOTE-TEMPLATES-${requestId}] Network error:`, err);
				setError(`Network error: ${err.message}`);
			} finally {
				setLoading(false);
			}
		}

		fetchRemoteTemplates();
	}, []);

	return { templates, loading, error, refetch: () => fetchRemoteTemplates() };
}
