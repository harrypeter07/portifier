// Complete Template Flow Test Script
// Tests: Template fetching, preview, and publishing
// Run with: node test-template-flow.js

const BASE_URL = 'http://localhost:3000';

// Test user credentials
const TEST_USER = {
	email: 'test@gmail.com',
	password: 'hassan123',
	username: 'testuser'
};

// Sample portfolio data for testing
const samplePortfolioData = {
	personal: {
		firstName: 'John',
		lastName: 'Doe',
		title: 'Full Stack Developer',
		email: 'john.doe@example.com',
		phone: '+1 (555) 123-4567',
		location: {
			city: 'San Francisco',
			state: 'CA',
			country: 'USA'
		},
		social: {
			linkedin: 'https://linkedin.com/in/johndoe',
			github: 'https://github.com/johndoe',
			portfolio: 'https://johndoe.dev'
		},
		avatar: '',
		tagline: 'Building amazing web experiences'
	},
	about: {
		summary: 'Passionate full-stack developer with 5+ years of experience building scalable web applications.',
		bio: 'I love creating beautiful, functional web applications that solve real-world problems.',
		interests: ['Web Development', 'Machine Learning', 'Open Source'],
		personalValues: ['Innovation', 'Collaboration', 'Continuous Learning']
	},
	experience: {
		jobs: [
			{
				id: '1',
				company: 'Tech Corp',
				position: 'Senior Developer',
				location: 'San Francisco, CA',
				startDate: '2022-01',
				endDate: '',
				current: true,
				description: 'Leading development of scalable web applications',
				responsibilities: [
					'Architect and develop web applications',
					'Lead a team of 5 developers',
					'Implement best practices and code reviews'
				],
				achievements: [
					'Increased application performance by 40%',
					'Reduced deployment time by 60%'
				],
				technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS']
			}
		]
	},
	skills: {
		technical: [
			{
				category: 'Frontend',
				skills: [
					{ name: 'React', level: 'Expert', years: 4 },
					{ name: 'Vue.js', level: 'Advanced', years: 2 },
					{ name: 'TypeScript', level: 'Expert', years: 3 }
				]
			},
			{
				category: 'Backend',
				skills: [
					{ name: 'Node.js', level: 'Expert', years: 4 },
					{ name: 'Python', level: 'Advanced', years: 3 },
					{ name: 'PostgreSQL', level: 'Advanced', years: 3 }
				]
			}
		],
		soft: [
			{ name: 'Leadership', description: 'Team leadership and mentoring' },
			{ name: 'Communication', description: 'Clear technical communication' }
		]
	},
	projects: {
		items: [
			{
				id: '1',
				title: 'E-commerce Platform',
				description: 'Full-stack e-commerce solution with React and Node.js',
				category: 'Web Development',
				technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
				links: {
					live: 'https://example-store.com',
					github: 'https://github.com/johndoe/ecommerce'
				}
			}
		]
	},
	education: {
		degrees: [
			{
				id: '1',
				institution: 'University of California',
				degree: 'Bachelor of Science',
				field: 'Computer Science',
				startDate: '2016',
				endDate: '2020'
			}
		]
	}
};

async function testTemplateFlow() {
	console.log('🧪 Testing Complete Template Flow...\n');

	// Test 1: Fetch Templates
	console.log('1️⃣ Testing Template Fetching...');
	try {
		const response = await fetch(`${BASE_URL}/api/templates`);
		const result = await response.json();
		
		if (result.success) {
			console.log(`   ✅ Success: ${result.count} templates fetched`);
			console.log(`   📦 Local: ${result.templates.filter(t => !t.remote).length}`);
			
			// Use first template for testing
			const testTemplate = result.templates[0];
			if (testTemplate) {
				console.log(`   🎯 Using template: ${testTemplate.name} (${testTemplate.id})`);
				return testTemplate;
			}
		} else {
			console.log(`   ❌ Error: ${result.error}`);
		}
	} catch (error) {
		console.log(`   ❌ Network Error: ${error.message}`);
	}

	return null;
}

async function testTemplatePreview(template) {
	console.log('\n2️⃣ Testing Template Preview...');
	try {
		const response = await fetch(`${BASE_URL}/api/templates/preview`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				templateId: template.id,
				portfolioData: samplePortfolioData,
				options: {
					preview: true,
					version: 'v1'
				}
			})
		});

		const result = await response.json();
		
		if (result.success) {
			console.log(`   ✅ Success: Preview generated`);
			console.log(`   🔗 Preview URL: ${result.previewUrl}`);
			console.log(`   🌐 Full URL: ${result.fullPreviewUrl}`);
			console.log(`   ⏰ Expires: ${result.expiresAt ? new Date(result.expiresAt).toLocaleString() : 'N/A'}`);
			return result;
		} else {
			console.log(`   ❌ Error: ${result.error}`);
		}
	} catch (error) {
		console.log(`   ❌ Network Error: ${error.message}`);
	}

	return null;
}

async function testTemplatePublish(template) {
	console.log('\n3️⃣ Testing Template Publishing...');
	try {
		const response = await fetch(`${BASE_URL}/api/templates/publish`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username: 'testuser',
				templateId: template.id,
				templateName: template.name,
				templateType: 'component',
				templateSource: template.source || 'local',
				isRemoteTemplate: template.remote || false,
				portfolioData: samplePortfolioData,
				layout: {},
				options: {
					publish: true,
					version: 'v1'
				}
			})
		});

		const result = await response.json();
		
		if (result.success) {
			console.log(`   ✅ Success: Portfolio published`);
			console.log(`   🆔 Portfolio ID: ${result.portfolioId}`);
			console.log(`   👤 Username: ${result.username}`);
			console.log(`   🔗 Portfolio URL: ${result.portfolioUrl}`);
			console.log(`   👁️ Preview URL: ${result.previewUrl || 'N/A'}`);
			console.log(`   🎨 Template: ${result.templateId}`);
			return result;
		} else {
			console.log(`   ❌ Error: ${result.error}`);
		}
	} catch (error) {
		console.log(`   ❌ Network Error: ${error.message}`);
	}

	return null;
}

async function testTemplateValidation(template) {
	console.log('\n4️⃣ Testing Template Validation...');
	try {
		const response = await fetch(`${BASE_URL}/api/templates`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				action: 'validate',
				templateId: template.id,
				userInfo: {
					username: 'testuser'
				}
			})
		});

		const result = await response.json();
		
		if (result.success) {
			console.log(`   ✅ Success: Template validation ${result.valid ? 'passed' : 'failed'}`);
			return result.valid;
		} else {
			console.log(`   ❌ Error: ${result.error}`);
		}
	} catch (error) {
		console.log(`   ❌ Network Error: ${error.message}`);
	}

	return false;
}

async function runCompleteTest() {
	console.log('🚀 Starting Complete Template Flow Test...\n');

	// Step 1: Fetch templates
	const template = await testTemplateFlow();
	if (!template) {
		console.log('\n❌ Cannot proceed without templates');
		return;
	}

	// Step 2: Test preview
	const previewResult = await testTemplatePreview(template);
	if (!previewResult) {
		console.log('\n⚠️ Preview failed, but continuing with publish test...');
	}

	// Step 3: Test validation
	const isValid = await testTemplateValidation(template);
	if (!isValid) {
		console.log('\n⚠️ Template validation failed, but continuing...');
	}

	// Step 4: Test publishing
	const publishResult = await testTemplatePublish(template);
	if (!publishResult) {
		console.log('\n❌ Publishing failed');
		return;
	}

	// Summary
	console.log('\n🎉 Complete Template Flow Test Results:');
	console.log('=====================================');
	console.log(`✅ Template Fetching: ${template ? 'PASSED' : 'FAILED'}`);
	console.log(`✅ Template Preview: ${previewResult ? 'PASSED' : 'FAILED'}`);
	console.log(`✅ Template Validation: ${isValid ? 'PASSED' : 'FAILED'}`);
	console.log(`✅ Template Publishing: ${publishResult ? 'PASSED' : 'FAILED'}`);
	
	if (publishResult) {
		console.log('\n🔗 Published Portfolio URLs:');
		console.log(`   Main: ${publishResult.portfolioUrl}`);
		if (publishResult.previewUrl) {
			console.log(`   Preview: ${publishResult.previewUrl}`);
		}
	}

	console.log('\n📋 Next Steps:');
	console.log('1. Start the development server: npm run dev');
	console.log('2. Visit http://localhost:3000/templates-demo');
	console.log('3. Test the UI components');
	console.log('4. Deploy the Templates App');
	console.log('5. Configure environment variables');
}

// Run the complete test
runCompleteTest().catch(console.error);
