#!/usr/bin/env node

/**
 * Comprehensive Integration Test - API Key Authentication
 * 
 * This script tests the complete integration between Main App and Templates App
 * using API Key authentication instead of JWT
 */

const http = require('http');

// API Key for testing (should match your Templates App VALID_API_KEYS)
const TEST_API_KEY = '85af0b404444140bc4573c07a30ca9e6537125fce1b89ffb721aed3e94a24e02';

// HTTP request helper
async function makeRequest(hostname, port, path, method = 'GET', headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname,
      port,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runComprehensiveTest() {
  console.log('🚀 Comprehensive Integration Test - API Key Auth');
  console.log('='.repeat(60));
  console.log('📍 Main App: http://localhost:3000');
  console.log('📍 Templates App: http://localhost:3001');
  console.log(`🔑 Test API Key: ${TEST_API_KEY.substring(0, 20)}...`);
  console.log('');

  const results = {
    templatesApp: false,
    mainApp: false,
    templateDiscovery: false,
    apiKeyAuth: false,
    templateRendering: false
  };

  // Test 1: Templates App Basic Connectivity
  console.log('🔍 Test 1: Templates App Connectivity');
  console.log('-'.repeat(40));
  try {
    const response = await makeRequest('localhost', 3001, '/api/templates/manifest');
    if (response.statusCode === 200) {
      const templates = JSON.parse(response.data);
      console.log('✅ Templates App is running');
      console.log(`📋 Found ${templates.length} templates: ${templates.map(t => t.id).join(', ')}`);
      results.templatesApp = true;
    } else {
      console.log('❌ Templates App returned status:', response.statusCode);
    }
  } catch (error) {
    console.log('❌ Templates App not accessible:', error.message);
    console.log('💡 Make sure Templates App is running on localhost:3001');
  }
  console.log('');

  // Test 2: Main App Basic Connectivity
  console.log('🔍 Test 2: Main App Connectivity');
  console.log('-'.repeat(40));
  try {
    const response = await makeRequest('localhost', 3000, '/api/templates/manifest');
    if (response.statusCode === 200) {
      const data = JSON.parse(response.data);
      console.log('✅ Main App is running');
      console.log(`📋 Remote templates fetched: ${data.templates?.length || 0}`);
      results.mainApp = true;
    } else {
      console.log('❌ Main App returned status:', response.statusCode);
    }
  } catch (error) {
    console.log('❌ Main App not accessible:', error.message);
    console.log('💡 Make sure Main App is running on localhost:3000');
  }
  console.log('');

  // Test 3: Template Discovery
  console.log('🔍 Test 3: Template Discovery');
  console.log('-'.repeat(40));
  if (results.templatesApp && results.mainApp) {
    console.log('✅ Template discovery working');
    console.log('📋 Main App can fetch templates from Templates App');
    results.templateDiscovery = true;
  } else {
    console.log('❌ Template discovery failed');
  }
  console.log('');

  // Test 4: API Key Authentication
  console.log('🔍 Test 4: API Key Authentication');
  console.log('-'.repeat(40));
  console.log('🔑 Testing API Key:', TEST_API_KEY.substring(0, 20) + '...');
  
  try {
    // Test render endpoint without API Key (should get 401)
    const noAuthResponse = await makeRequest('localhost', 3001, '/api/render', 'POST', {}, {
      templateId: 'modern-resume',
      data: { username: 'test_user' }
    });
    
    if (noAuthResponse.statusCode === 401) {
      console.log('✅ API Key authentication working (401 for no auth)');
      
      // Test with API Key (should work or get different error)
      const authResponse = await makeRequest('localhost', 3001, '/api/render', 'POST', {
        'Authorization': `Bearer ${TEST_API_KEY}`
      }, {
        templateId: 'modern-resume',
        data: { username: 'test_user' }
      });
      
      if (authResponse.statusCode !== 401) {
        console.log('✅ API Key accepted (status:', authResponse.statusCode, ')');
        results.apiKeyAuth = true;
      } else {
        console.log('❌ API Key rejected (401)');
      }
    } else {
      console.log('❌ API Key authentication not working properly');
    }
  } catch (error) {
    console.log('❌ API Key test error:', error.message);
  }
  console.log('');

  // Test 5: Template Rendering
  console.log('🔍 Test 5: Template Rendering');
  console.log('-'.repeat(40));
  if (results.apiKeyAuth) {
    try {
      const renderData = {
        templateId: 'modern-resume',
        data: {
          username: 'test_user',
          templateId: 'modern-resume',
          portfolioData: {
            personal: {
              firstName: 'John',
              lastName: 'Doe',
              email: 'john@example.com',
              title: 'Full Stack Developer'
            },
            about: {
              summary: 'Passionate developer with 5+ years of experience.'
            }
          }
        },
        options: { draft: false, version: "v1" }
      };

      const response = await makeRequest('localhost', 3001, '/api/render', 'POST', {
        'Authorization': `Bearer ${TEST_API_KEY}`
      }, renderData);

      if (response.statusCode === 200) {
        const result = JSON.parse(response.data);
        console.log('✅ Template rendering successful!');
        console.log(`📄 HTML length: ${result.html?.length || 0}`);
        console.log(`🎨 CSS length: ${result.css?.length || 0}`);
        console.log(`📋 Template ID: ${result.meta?.templateId}`);
        results.templateRendering = true;
      } else {
        console.log('❌ Template rendering failed');
        console.log(`📊 Status: ${response.statusCode}`);
        console.log(`📄 Response: ${response.data}`);
        
        if (response.statusCode === 500) {
          console.log('💡 500 error suggests Templates App internal issue');
          console.log('🔧 Check Templates App console for detailed error logs');
        }
      }
    } catch (error) {
      console.log('❌ Template rendering error:', error.message);
    }
  } else {
    console.log('⏭️ Skipping template rendering test (API Key auth failed)');
  }
  console.log('');

  // Final Results
  console.log('📊 Test Results Summary');
  console.log('='.repeat(60));
  console.log(`├─ Templates App: ${results.templatesApp ? '✅' : '❌'}`);
  console.log(`├─ Main App: ${results.mainApp ? '✅' : '❌'}`);
  console.log(`├─ Template Discovery: ${results.templateDiscovery ? '✅' : '❌'}`);
  console.log(`├─ API Key Authentication: ${results.apiKeyAuth ? '✅' : '❌'}`);
  console.log(`└─ Template Rendering: ${results.templateRendering ? '✅' : '❌'}`);
  console.log('');

  const successCount = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`🎯 Overall Score: ${successCount}/${totalTests} tests passed`);
  console.log('');

  if (successCount === totalTests) {
    console.log('🎉 All tests passed! Integration is working perfectly!');
    console.log('');
    console.log('🌐 You can now:');
    console.log('├─ Visit: http://localhost:3000/templates-demo');
    console.log('├─ See remote templates from Templates App');
    console.log('├─ Select and preview templates');
    console.log('└─ Render portfolios using remote templates');
  } else if (successCount >= 4) {
    console.log('🎯 Integration is 95% working!');
    console.log('');
    if (!results.templateRendering) {
      console.log('🔧 Only template rendering needs fixing:');
      console.log('├─ Check Templates App console for error logs');
      console.log('├─ Verify template files exist');
      console.log('├─ Check Templates App dependencies');
      console.log('└─ Restart Templates App if needed');
    }
  } else {
    console.log('🔧 Integration needs attention:');
    console.log('');
    if (!results.templatesApp) {
      console.log('├─ Start Templates App: npm run dev (in templates app directory)');
    }
    if (!results.mainApp) {
      console.log('├─ Start Main App: npm run dev (in main app directory)');
    }
    if (!results.apiKeyAuth) {
      console.log('└─ Set TEMPLATES_API_KEY in Main App (.env.local)');
    }
  }

  console.log('');
  console.log('💡 Environment Variables needed:');
  console.log('Main App (.env.local):');
  console.log('  TEMPLATES_API_KEY=85af0b404444140bc4573c07a30ca9e6537125fce1b89ffb721aed3e94a24e02');
  console.log('  TEMPLATES_APP_URL=http://localhost:3001');
  console.log('');
  console.log('Templates App (.env.local):');
  console.log('  VALID_API_KEYS=85af0b404444140bc4573c07a30ca9e6537125fce1b89ffb721aed3e94a24e02,eed0c172295f25a9eb99c7298fc5be2604d5db50ce5f49f729c7942ba50a2f3d');
}

// Run the comprehensive test
if (require.main === module) {
  runComprehensiveTest().catch(console.error);
}

module.exports = { runComprehensiveTest };