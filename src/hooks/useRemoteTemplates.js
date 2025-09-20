import { useState, useEffect } from 'react';

export function useRemoteTemplates() {
	const [templates, setTemplates] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function fetchRemoteTemplates() {
			try {
				setLoading(true);
				setError(null);
				
				console.log("🔍 [REMOTE-TEMPLATES] Fetching templates from /api/templates/manifest");
				const response = await fetch('/api/templates/manifest');
				const data = await response.json();
				
				console.log("🔍 [REMOTE-TEMPLATES] Response:", { status: response.status, data });
				
				if (response.ok && data.success) {
					console.log("🔍 [REMOTE-TEMPLATES] Setting templates:", data.templates);
					setTemplates(data.templates);
				} else {
					console.error("🔍 [REMOTE-TEMPLATES] Error response:", data);
					setError(data.error || 'Failed to fetch templates');
				}
			} catch (err) {
				console.error('🔍 [REMOTE-TEMPLATES] Network error:', err);
				setError('Network error while fetching templates');
			} finally {
				setLoading(false);
			}
		}

		fetchRemoteTemplates();
	}, []);

	return { templates, loading, error, refetch: () => fetchRemoteTemplates() };
}
