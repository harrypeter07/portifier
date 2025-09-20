#!/usr/bin/env node

/**
 * Test script for Templates App Integration
 * 
 * This script tests the connection between the main portfolio app
 * and the deployed templates app at https://portumet.vercel.app
 */

const https = require('https');

// Configuration
const TEMPLATES_APP_URL = 'https://portumet.vercel.app';
const TEST_USERNAME = 'test_user'; // Replace with an actual username from your database

// Test data
const testPortfolioData = {
  username: TEST_USERNAME,
  templateId: 'modern-resume',
  portfolioData: {
    personal: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      title: 'Full Stack Developer',
      phone: '+1 (555) 123-4567',
      location: {
        city: 'San Francisco',
        state: 'CA',
        country: 'USA'
      },
      social: {
        linkedin: 'https://linkedin.com/in/johndoe',
        github: 'https://github.com/johndoe',
        website: 'https://johndoe.com'
      }
    },
    about: {
      summary: 'Passionate full-stack developer with 5+ years of experience building scalable web applications.'
    },
    skills: {
      technical: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python'],
      frameworks: ['Next.js', 'Express', 'Django'],
      tools: ['Git', 'Docker', 'AWS', 'MongoDB']
    },
    experience: {
      jobs: [
        {
          position: 'Senior Full Stack Developer',
          company: 'Tech Corp',
          location: 'San Francisco, CA',
          startDate: '2022-01',
          endDate: 'Present',
          description: 'Led development of multiple web applications serving 100k+ users.',
          technologies: ['React', 'Node.js', 'MongoDB', 'AWS']
        }
      ]
    },
    projects: {
      items: [
        {
          title: 'E-commerce Platform',
          description: 'Built a full-stack e-commerce platform with React and Node.js',
          technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
          links: {
            live: 'https://example-ecommerce.com',
            github: 'https://github.com/johndoe/ecommerce'
          }
        }
      ]
    },
    education: {
      degrees: [
        {
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          institution: 'University of California',
          location: 'Berkeley, CA',
          startDate: '2018',
          endDate: '2022',
          gpa: '3.8'
        }
      ]
    }
  }
};

// Create a simple JWT token for testing
function createTestJWT() {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  const payload = {
    scope: 'render',
    sub: TEST_USERNAME,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (5 * 60) // 5 minutes
  };
  
  // Note: This is a test token - in production, use proper JWT signing
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = 'test-signature'; // In production, this would be properly signed
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// Test the templates app manifest endpoint
async function testManifest() {
  console.log('🔍 Testing Templates App Manifest...');
  
  return new Promise((resolve, reject) => {
    const req = https.get(`${TEMPLATES_APP_URL}/api/templates/manifest`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const manifest = JSON.parse(data);
          console.log('✅ Manifest endpoint working');
          console.log('📋 Available templates:', manifest.map(t => t.id).join(', '));
          resolve(manifest);
        } catch (error) {
          console.log('❌ Failed to parse manifest response');
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Manifest request failed:', error.message);
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      console.log('❌ Manifest request timeout');
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

// Test the render endpoint
async function testRender() {
  console.log('🔍 Testing Templates App Render...');
  
  const testJWT = createTestJWT();
  const postData = JSON.stringify({
    templateId: 'modern-resume',
    data: testPortfolioData
  });
  
  const options = {
    hostname: 'portumet.vercel.app',
    port: 443,
    path: '/api/render',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${testJWT}`,
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const result = JSON.parse(data);
            if (result.html) {
              console.log('✅ Render endpoint working');
              console.log('📄 Generated HTML length:', result.html.length);
              console.log('🎨 CSS included:', !!result.css);
              resolve(result);
            } else {
              console.log('❌ No HTML in response');
              reject(new Error('No HTML in response'));
            }
          } catch (error) {
            console.log('❌ Failed to parse render response');
            console.log('Response:', data.substring(0, 200) + '...');
            reject(error);
          }
        } else {
          console.log(`❌ Render request failed with status: ${res.statusCode}`);
          console.log('Response:', data);
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Render request failed:', error.message);
      reject(error);
    });
    
    req.setTimeout(15000, () => {
      console.log('❌ Render request timeout');
      req.destroy();
      reject(new Error('Timeout'));
    });
    
    req.write(postData);
    req.end();
  });
}

// Main test function
async function runTests() {
  console.log('🚀 Starting Templates App Integration Tests');
  console.log('📍 Templates App URL:', TEMPLATES_APP_URL);
  console.log('');
  
  try {
    // Test 1: Manifest endpoint
    await testManifest();
    console.log('');
    
    // Test 2: Render endpoint
    await testRender();
    console.log('');
    
    console.log('🎉 All tests passed! Integration is working correctly.');
    console.log('');
    console.log('📝 Next steps:');
    console.log('1. Set JWT_SECRET environment variable in your main app');
    console.log('2. Set SHARED_JWT_SECRET environment variable in your templates app');
    console.log('3. Deploy both apps with the same JWT secret');
    console.log('4. Test with a real portfolio username');
    
  } catch (error) {
    console.log('❌ Tests failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Check if templates app is deployed and accessible');
    console.log('2. Verify the templates app has the correct environment variables');
    console.log('3. Check network connectivity');
    console.log('4. Review templates app logs for errors');
  }
}

// Run the tests
if (require.main === module) {
  runTests();
}

module.exports = { runTests, testManifest, testRender };
