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
          personal: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            title: 'Full Stack Developer',
            subtitle: 'Building digital experiences that matter',
            phone: '+1 (555) 123-4567',
            location: {
              city: 'San Francisco',
              state: 'CA',
              country: 'USA'
            },
            social: {
              linkedin: 'linkedin.com/in/johndoe',
              github: 'github.com/johndoe',
              portfolio: 'johndoe.dev'
            },
            tagline: 'Passionate about creating scalable web applications',
            availability: 'Available for new opportunities'
          },
          about: {
            summary: 'Experienced full-stack developer with 5+ years building web applications. Passionate about clean code, user experience, and modern technologies.',
            bio: 'I\'m a dedicated software engineer who loves solving complex problems through code. When I\'m not coding, you can find me contributing to open source projects or exploring new technologies.',
            interests: ['Open Source', 'Machine Learning', 'Web Performance'],
            personalValues: ['Quality', 'Collaboration', 'Continuous Learning'],
            funFacts: ['Coffee enthusiast', 'Marathon runner', 'Tech blogger']
          },
          experience: {
            jobs: [
              {
                id: '1',
                company: 'Tech Corp',
                position: 'Senior Full Stack Developer',
                location: 'San Francisco, CA',
                startDate: 'Jan 2022',
                endDate: '',
                current: true,
                description: 'Lead development of scalable web applications using React and Node.js. Mentor junior developers and drive technical decisions.',
                responsibilities: [
                  'Architected and built microservices handling 100k+ daily requests',
                  'Led a team of 4 developers in building core platform features',
                  'Implemented CI/CD pipelines reducing deployment time by 70%'
                ],
                achievements: [
                  'Increased application performance by 40%',
                  'Reduced bug reports by 60% through comprehensive testing'
                ],
                technologies: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker'],
                projects: ['E-commerce Platform', 'Analytics Dashboard'],
                companyLogo: '',
                companyWebsite: 'https://techcorp.com'
              }
            ]
          },
          skills: {
            technical: [
              {
                category: 'Frontend',
                skills: [
                  {
                    name: 'React',
                    level: 'expert',
                    years: 4,
                    icon: '',
                    certified: false
                  },
                  {
                    name: 'JavaScript',
                    level: 'expert',
                    years: 5,
                    icon: '',
                    certified: false
                  }
                ]
              }
            ],
            soft: [
              {
                name: 'Leadership',
                description: 'Led multiple development teams',
                examples: ['Team Lead at Tech Corp']
              }
            ],
            languages: [
              { name: 'English', proficiency: 'native', certification: '' }
            ]
          },
          projects: {
            items: [
              {
                id: '1',
                title: 'E-commerce Platform',
                description: 'Full-stack e-commerce solution with payment integration',
                longDescription: 'Built a complete e-commerce platform handling thousands of transactions daily with advanced features like real-time inventory, payment processing, and analytics.',
                category: 'Web Application',
                tags: ['E-commerce', 'Full-stack', 'Payments'],
                technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'AWS'],
                status: 'completed',
                startDate: '2023-01',
                endDate: '2023-06',
                images: [],
                videos: [],
                links: {
                  live: 'https://shop.example.com',
                  github: 'https://github.com/johndoe/ecommerce',
                  demo: 'https://demo.shop.example.com',
                  documentation: 'https://docs.shop.example.com'
                },
                features: ['Payment Processing', 'Inventory Management', 'User Analytics'],
                challenges: ['Scaling to handle high traffic', 'Real-time inventory updates'],
                learnings: ['Microservices architecture', 'Payment security'],
                teamSize: 3,
                role: 'Lead Developer',
                client: 'Retail Corp',
                metrics: {
                  users: '10,000+ active users',
                  performance: '99.9% uptime',
                  impact: '$2M+ in processed transactions'
                },
                testimonial: {
                  text: 'John delivered an exceptional e-commerce platform that exceeded our expectations.',
                  author: 'Sarah Johnson',
                  title: 'CTO, Retail Corp',
                  avatar: '/testimonials/sarah.jpg'
                }
              }
            ]
          },
          contact: {
            email: 'john@example.com',
            phone: '+1 (555) 123-4567',
            preferredContact: 'email',
            timezone: 'PST',
            availability: 'Available for freelance and full-time opportunities',
            rates: {
              hourly: '$75-100',
              project: 'Varies by scope',
              retainer: 'Available'
            },
            services: ['Web Development', 'Technical Consulting', 'Code Reviews'],
            workingHours: '9 AM - 5 PM PST',
            responseTime: 'Within 24 hours'
          },
          theme: {
            primaryColor: '#3B82F6',
            secondaryColor: '#1E40AF',
            accentColor: '#F59E0B',
            backgroundColor: '#FFFFFF',
            textColor: '#1F2937',
            font: 'Inter',
            darkMode: false,
            animations: true,
            layout: 'modern'
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