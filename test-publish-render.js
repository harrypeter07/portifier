// End-to-end publish + render test using env config and schema-like mock data
// Usage:
//   BASE_URL=http://localhost:3000 \
//   TEST_USERNAME=testuser \
//   TEST_EMAIL=test@example.com \
//   TEST_PASSWORD=pass1234 \
//   node test-publish-render.js

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TEST_USERNAME = process.env.TEST_USERNAME || 'testuser';
const TEST_EMAIL = process.env.TEST_EMAIL || 'test@example.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'pass1234';

function buildMockPortfolioData() {
	// Schema-aligned minimal yet rich dataset
	return {
		personal: {
			firstName: 'Jane',
			lastName: 'Doe',
			title: 'Full Stack Developer',
			subtitle: 'JavaScript | React | Node.js',
			email: TEST_EMAIL,
			phone: '+1 (555) 010-0101',
			location: { city: 'San Francisco', state: 'CA', country: 'USA' },
			social: {
				linkedin: 'https://linkedin.com/in/janedoe',
				github: 'https://github.com/janedoe'
			},
			avatar: '',
			tagline: 'I build reliable, user-centric web applications.'
		},
		about: {
			summary: 'Developer focused on performant UIs and robust APIs.',
			bio: 'I love shipping delightful, accessible products.',
			interests: ['Web Performance', 'DX', 'Open Source']
		},
		experience: {
			jobs: [
				{
					id: 'job-1',
					company: 'Acme Corp',
					position: 'Senior Full Stack Engineer',
					location: 'Remote',
					startDate: '2022-03',
					endDate: '',
					current: true,
					description: 'Lead end-to-end feature delivery across frontend and backend.',
					responsibilities: ['Own frontend architecture', 'Mentor engineers'],
					achievements: ['Cut TTI by 35%', 'Reduced bundle by 40%'],
					technologies: ['React', 'Next.js', 'Node.js', 'MongoDB']
				}
			]
		},
		education: {
			degrees: [
				{ id: 'deg-1', institution: 'State University', degree: 'B.Sc.', field: 'Computer Science', startDate: '2016', endDate: '2020' }
			]
		},
		skills: {
			technical: [
				{
					category: 'Frontend',
					skills: [
						{ name: 'React', level: 'Expert', years: 4 },
						{ name: 'TypeScript', level: 'Advanced', years: 3 }
					]
				}
			],
			soft: [ { name: 'Communication', description: 'Clear, empathetic, async-first' } ],
			languages: [ { name: 'English', proficiency: 'Native' } ]
		},
		projects: {
			items: [
				{
					id: 'proj-1',
					title: 'Portfolio Platform',
					description: 'Multi-tenant personal sites with analytics',
					category: 'Web',
					technologies: ['Next.js', 'MongoDB'],
					links: { live: 'https://example.com', github: 'https://github.com/janedoe/portfolio' }
				}
			]
		},
		achievements: {
			awards: [ { id: 'awd-1', title: 'Top Engineer', organization: 'Acme', date: '2023' } ],
			certifications: []
		},
		contact: { email: TEST_EMAIL },
		theme: {
			primaryColor: '#3B82F6',
			secondaryColor: '#1E40AF',
			accentColor: '#F59E0B',
			backgroundColor: '#FFFFFF',
			textColor: '#111827',
			font: 'Inter',
			darkMode: false,
			animations: true,
			layout: 'modern'
		}
	};
}

async function ensureAuth() {
	console.log('🔐 Auth: sign-in or sign-up');
	const signin = await fetch(`${BASE_URL}/api/auth/signin`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD })
	});
	if (signin.ok) return true;
	const signup = await fetch(`${BASE_URL}/api/auth/signup`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD, name: 'Test User', username: TEST_USERNAME })
	});
	return signup.ok;
}

async function publishPortfolio(templateId = 'cleanfolio', templateName = 'Cleanfolio') {
	console.log('📤 Publish: /api/templates/publish');
	const payload = {
		username: TEST_USERNAME,
		templateId,
		templateName,
		templateType: 'component',
		templateSource: 'local',
		isRemoteTemplate: false,
		portfolioData: buildMockPortfolioData(),
		layout: {},
		options: { publish: true, version: 'v1' }
	};
	const res = await fetch(`${BASE_URL}/api/templates/publish`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
	});
	const json = await res.json();
	if (!res.ok || !json.success) throw new Error(json.error || 'Publish failed');
	console.log('✅ Published', { portfolioId: json.portfolioId, username: json.username, url: json.portfolioUrl });
	return json;
}

async function renderPortfolio(username) {
	console.log('🎨 Render: /api/portfolio/render/[username]');
	const res = await fetch(`${BASE_URL}/api/portfolio/render/${encodeURIComponent(username)}`);
	const text = await res.text();
	if (!res.ok) throw new Error(`Render failed: ${res.status}`);
	console.log(`✅ Rendered HTML length: ${text.length}`);
	return text;
}

(async function run() {
	try {
		console.log('🚀 E2E Publish + Render Test');
		console.log('🔧 Config', { BASE_URL, TEST_USERNAME, TEST_EMAIL });
		const ok = await ensureAuth();
		if (!ok) throw new Error('Auth failed');
		const pub = await publishPortfolio();
		await renderPortfolio(pub.username);
		console.log('🎉 All steps passed');
	} catch (e) {
		console.error('❌ Test failed:', e.message);
		process.exitCode = 1;
	}
})();


