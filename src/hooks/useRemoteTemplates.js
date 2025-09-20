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
				
				const response = await fetch('/api/templates/manifest');
				const data = await response.json();
				
				if (response.ok && data.success) {
					setTemplates(data.templates);
				} else {
					setError(data.error || 'Failed to fetch templates');
				}
			} catch (err) {
				setError('Network error while fetching templates');
				console.error('Error fetching remote templates:', err);
			} finally {
				setLoading(false);
			}
		}

		fetchRemoteTemplates();
	}, []);

	return { templates, loading, error, refetch: () => fetchRemoteTemplates() };
}
