// Test script for Templates App Integration
// Run with: node test-templates-integration.js

const BASE_URL = 'http://localhost:3000';

async function testTemplatesIntegration() {
	console.log('🧪 Testing Templates App Integration...\n');

	// Test 1: Direct Portfolio Rendering API
	console.log('1️⃣ Testing Direct Portfolio Rendering API...');
	try {
		const response = await fetch(`${BASE_URL}/api/portfolio/render/testuser`);
		console.log(`   Status: ${response.status}`);
		console.log(`   Content-Type: ${response.headers.get('content-type')}`);
		
		if (response.ok) {
			const html = await response.text();
			console.log(`   ✅ Success: ${html.length} characters returned`);
			console.log(`   Preview: ${html.substring(0, 100)}...`);
		} else {
			const error = await response.text();
			console.log(`   ❌ Error: ${error}`);
		}
	} catch (error) {
		console.log(`   ❌ Network Error: ${error.message}`);
	}

	console.log('\n');

	// Test 2: Render Portfolio Proxy API
	console.log('2️⃣ Testing Render Portfolio Proxy API...');
	try {
		const response = await fetch(`${BASE_URL}/api/render-portfolio`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username: 'testuser',
				templateId: 'cleanfolio'
			})
		});
		console.log(`   Status: ${response.status}`);
		console.log(`   Content-Type: ${response.headers.get('content-type')}`);
		
		if (response.ok) {
			const html = await response.text();
			console.log(`   ✅ Success: ${html.length} characters returned`);
			console.log(`   Preview: ${html.substring(0, 100)}...`);
		} else {
			const error = await response.text();
			console.log(`   ❌ Error: ${error}`);
		}
	} catch (error) {
		console.log(`   ❌ Network Error: ${error.message}`);
	}

	console.log('\n');

	// Test 3: Portfolio Data API
	console.log('3️⃣ Testing Portfolio Data API...');
	try {
		const response = await fetch(`${BASE_URL}/api/portfolio/testuser`);
		console.log(`   Status: ${response.status}`);
		
		if (response.ok) {
			const data = await response.json();
			console.log(`   ✅ Success: Portfolio data retrieved`);
			console.log(`   Portfolio ID: ${data.portfolio?.id}`);
			console.log(`   Username: ${data.portfolio?.username}`);
			console.log(`   Template: ${data.portfolio?.templateId}`);
		} else {
			const error = await response.json();
			console.log(`   ❌ Error: ${error.error}`);
		}
	} catch (error) {
		console.log(`   ❌ Network Error: ${error.message}`);
	}

	console.log('\n');

	// Test 4: Environment Variables Check
	console.log('4️⃣ Checking Environment Variables...');
	const requiredEnvVars = [
		'TEMPLATES_APP_URL',
		'TEMPLATES_API_KEY',
		'MONGODB_URI'
	];

	requiredEnvVars.forEach(envVar => {
		const value = process.env[envVar];
		if (value) {
			console.log(`   ✅ ${envVar}: ${value.substring(0, 20)}...`);
		} else {
			console.log(`   ❌ ${envVar}: Not set`);
		}
	});

	console.log('\n🎉 Templates App Integration Test Complete!');
	console.log('\n📋 Next Steps:');
	console.log('1. Set up environment variables in .env.local');
	console.log('2. Start the development server: npm run dev');
	console.log('3. Deploy the Templates App to your templates domain');
	console.log('4. Test with real portfolio data');
}

// Run the test
testTemplatesIntegration().catch(console.error);
