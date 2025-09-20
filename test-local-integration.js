#!/usr/bin/env node

/**
 * Local Integration Test Script
 * 
 * Tests the connection between:
 * - Main App: localhost:3000
 * - Templates App: localhost:3001
 */

const http = require('http');

// Configuration
const MAIN_APP_URL = 'http://localhost:3000';
const TEMPLATES_APP_URL = 'http://localhost:3001';

// Test data
const testPortfolioData = {
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
};

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = http.request(requestOptions, (res) => {
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

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

// Test 1: Check if Templates App is running
async function testTemplatesApp() {
  console.log('🔍 Testing Templates App (localhost:3001)...');
  
  try {
    const response = await makeRequest(`${TEMPLATES_APP_URL}/api/templates/manifest`);
    
    if (response.statusCode === 200) {
      const templates = JSON.parse(response.data);
      console.log('✅ Templates App is running');
      console.log('📋 Available templates:', templates.map(t => t.id).join(', '));
      return true;
    } else {
      console.log('❌ Templates App returned status:', response.statusCode);
      return false;
    }
  } catch (error) {
    console.log('❌ Templates App is not accessible:', error.message);
    console.log('💡 Make sure Templates App is running on localhost:3001');
    return false;
  }
}

// Test 2: Check if Main App is running
async function testMainApp() {
  console.log('🔍 Testing Main App (localhost:3000)...');
  
  try {
    const response = await makeRequest(`${MAIN_APP_URL}/api/templates/manifest`);
    
    if (response.statusCode === 200) {
      const data = JSON.parse(response.data);
      console.log('✅ Main App is running');
      console.log('📋 Remote templates fetched:', data.templates?.length || 0);
      return true;
    } else {
      console.log('❌ Main App returned status:', response.statusCode);
      return false;
    }
  } catch (error) {
    console.log('❌ Main App is not accessible:', error.message);
    console.log('💡 Make sure Main App is running on localhost:3000');
    return false;
  }
}

// Test 3: Test template rendering
async function testTemplateRendering() {
  console.log('🔍 Testing template rendering...');
  
  try {
    const response = await makeRequest(`${MAIN_APP_URL}/api/render-portfolio`, {
      method: 'POST',
      body: { username: 'test_user' }
    });
    
    if (response.statusCode === 200) {
      console.log('✅ Template rendering works');
      console.log('📄 HTML length:', response.data.length);
      return true;
    } else {
      console.log('❌ Template rendering failed with status:', response.statusCode);
      console.log('📄 Response:', response.data);
      return false;
    }
  } catch (error) {
    console.log('❌ Template rendering error:', error.message);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting Local Integration Tests');
  console.log('📍 Main App:', MAIN_APP_URL);
  console.log('📍 Templates App:', TEMPLATES_APP_URL);
  console.log('');

  const results = {
    templatesApp: await testTemplatesApp(),
    mainApp: await testMainApp(),
    rendering: false
  };

  console.log('');

  if (results.templatesApp && results.mainApp) {
    results.rendering = await testTemplateRendering();
  } else {
    console.log('⏭️ Skipping rendering test due to previous failures');
  }

  console.log('');
  console.log('📊 Test Results:');
  console.log('├─ Templates App:', results.templatesApp ? '✅' : '❌');
  console.log('├─ Main App:', results.mainApp ? '✅' : '❌');
  console.log('└─ Template Rendering:', results.rendering ? '✅' : '❌');

  if (results.templatesApp && results.mainApp && results.rendering) {
    console.log('');
    console.log('🎉 All tests passed! Integration is working correctly.');
    console.log('');
    console.log('🌐 You can now visit:');
    console.log('├─ Main App: http://localhost:3000/templates-demo');
    console.log('└─ Templates App: http://localhost:3001/api/templates/manifest');
  } else {
    console.log('');
    console.log('🔧 Troubleshooting:');
    if (!results.templatesApp) {
      console.log('├─ Start Templates App: npm run dev (in templates app directory)');
    }
    if (!results.mainApp) {
      console.log('├─ Start Main App: npm run dev (in main app directory)');
    }
    if (!results.rendering) {
      console.log('└─ Check JWT_SECRET environment variables in both apps');
    }
  }
}

// Run the tests
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests, testTemplatesApp, testMainApp, testTemplateRendering };
