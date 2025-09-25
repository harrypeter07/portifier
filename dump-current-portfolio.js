// Dumps current authenticated user and latest portfolio data (summary)
// Usage: BASE_URL=http://localhost:3000 node dump-current-portfolio.js

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

(async function run() {
	try {
		console.log('🔎 Dumping current user and portfolio');
		const meRes = await fetch(`${BASE_URL}/api/auth/me`);
		const me = await meRes.json();
		if (!meRes.ok || !me?.user) {
			console.log('❌ /api/auth/me failed:', me);
			process.exit(1);
		}
		console.log('👤 User:', { id: me.user.id, username: me.user.username, email: me.user.email });

		// Try portfolio by username
		const username = me.user.username || (me.user.email ? me.user.email.split('@')[0] : '');
		if (!username) {
			console.log('⚠️ No username available');
			process.exit(0);
		}
		const res = await fetch(`${BASE_URL}/api/portfolio/get?username=${encodeURIComponent(username)}`);
		const json = await res.json();
		if (!res.ok || !json?.portfolio) {
			console.log('⚠️ No portfolio for user', json);
			process.exit(0);
		}
		const p = json.portfolio;
		console.log('🧾 Portfolio summary:', {
			id: p.id || p._id,
			templateId: p.templateId,
			sections: Object.keys(p.portfolioData || {}),
			personal: {
				firstName: p.portfolioData?.personal?.firstName,
				lastName: p.portfolioData?.personal?.lastName,
				email: p.portfolioData?.personal?.email
			},
			experienceJobs: Array.isArray(p.portfolioData?.experience?.jobs) ? p.portfolioData.experience.jobs.length : 0,
			projects: Array.isArray(p.portfolioData?.projects?.items) ? p.portfolioData.projects.items.length : 0
		});
	} catch (e) {
		console.error('❌ Dump failed:', e.message);
		process.exit(1);
	}
})();


