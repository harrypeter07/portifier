// Dumps current authenticated user and latest portfolio data (summary)
// Usage: BASE_URL=http://localhost:3000 node dump-current-portfolio.js

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

(async function run() {
	try {
		console.log('🔎 Dumping current user and portfolio');
		
		// Try to get user info from the logs - we know the user is test@gmail.com
		// But let's also try test@example.com which has a portfolio
		const testEmails = ['test@gmail.com', 'test@example.com'];
		
		for (const testEmail of testEmails) {
			console.log(`\n👤 Testing with user: ${testEmail}`);

			// Try portfolio by email (as used in /api/portfolio/get)
			console.log('🔍 Fetching portfolio for:', testEmail);
			const res = await fetch(`${BASE_URL}/api/portfolio/get?username=${encodeURIComponent(testEmail)}`);
			const json = await res.json();
			console.log('📡 API Response:', { status: res.status, ok: res.ok, json });
			
			if (!res.ok || !json?.portfolio) {
				console.log('⚠️ No portfolio for user', json);
				continue;
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
			
			// Also check if there's any content field
			if (p.content) {
				console.log('📄 Legacy content sections:', Object.keys(p.content));
			}
		}
	} catch (e) {
		console.error('❌ Dump failed:', e.message);
		process.exit(1);
	}
})();


