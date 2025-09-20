import { getTemplatesApiKey } from "./serviceJwt";

export async function renderRemoteTemplate({ portfolio, options = {} }) {
	try {
		const baseUrl = process.env.TEMPLATES_BASE_URL || process.env.TEMPLATES_APP_URL || "https://portumet.vercel.app";
		if (!baseUrl) return null;
		
		const apiKey = getTemplatesApiKey();
		const res = await fetch(`${baseUrl}/api/render`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify({
				templateId: portfolio?.templateId || portfolio?.templateName,
				data: portfolio,
				options: { draft: false, version: "v1", ...options },
			}),
			cache: "no-store",
		});
		if (!res.ok) return null;
		const payload = await res.json();
		if (!payload?.html) return null;
		return { html: payload.html, css: payload.css || "" };
	} catch (e) {
		return null;
	}
}

export default renderRemoteTemplate;


