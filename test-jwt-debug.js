#!/usr/bin/env node

/**
 * JWT Debug Test Script
 * 
 * This script helps debug JWT creation and verification issues
 */

const crypto = require('crypto');

// Test JWT creation with different secrets
function createTestJWT(secret, payload = {}) {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + 300 // 5 minutes
  };
  
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// Test JWT verification
function verifyTestJWT(token, secret) {
  try {
    const [headerB64, payloadB64, signatureB64] = token.split('.');
    
    const header = JSON.parse(Buffer.from(headerB64, 'base64url').toString());
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
    
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${headerB64}.${payloadB64}`)
      .digest('base64url');
    
    const isValid = signatureB64 === expectedSignature;
    
    return {
      valid: isValid,
      header,
      payload,
      expectedSignature,
      actualSignature: signatureB64
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message
    };
  }
}

async function testJWTSecrets() {
  console.log('🔍 Testing JWT Creation and Verification');
  console.log('');

  // Test with different common secrets
  const testSecrets = [
    'your-super-secret-jwt-key-here',
    'jwt-secret-key',
    'my-secret-key',
    'secret',
    'test-secret',
    'portume-secret',
    'templates-secret'
  ];

  const testPayload = {
    scope: 'render',
    sub: 'test_user'
  };

  console.log('📋 Testing JWT creation with different secrets:');
  console.log('');

  for (const secret of testSecrets) {
    console.log(`🔑 Testing secret: "${secret}"`);
    
    try {
      const jwt = createTestJWT(secret, testPayload);
      console.log(`   JWT: ${jwt.substring(0, 50)}...`);
      
      // Test verification with the same secret
      const verification = verifyTestJWT(jwt, secret);
      console.log(`   ✅ Self-verification: ${verification.valid ? 'PASS' : 'FAIL'}`);
      
      // Test verification with different secrets
      let crossVerification = false;
      for (const otherSecret of testSecrets) {
        if (otherSecret !== secret) {
          const otherVerification = verifyTestJWT(jwt, otherSecret);
          if (otherVerification.valid) {
            crossVerification = true;
            console.log(`   ⚠️  Cross-verification with "${otherSecret}": PASS (SECURITY ISSUE!)`);
          }
        }
      }
      
      if (!crossVerification) {
        console.log(`   ✅ No cross-verification issues`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    console.log('');
  }

  console.log('💡 Recommendations:');
  console.log('1. Set the same JWT secret in both apps');
  console.log('2. Use a strong, unique secret (at least 32 characters)');
  console.log('3. Set SHARED_JWT_SECRET in both apps');
  console.log('');
  console.log('🔧 Environment Variables to set:');
  console.log('');
  console.log('# Main App (.env.local)');
  console.log('JWT_SECRET=your-super-secret-jwt-key-here');
  console.log('SHARED_JWT_SECRET=your-super-secret-jwt-key-here');
  console.log('');
  console.log('# Templates App (.env.local)');
  console.log('SHARED_JWT_SECRET=your-super-secret-jwt-key-here');
  console.log('');
  console.log('🚀 After setting the same secret in both apps, restart both servers.');
}

// Run the test
if (require.main === module) {
  testJWTSecrets().catch(console.error);
}

module.exports = { createTestJWT, verifyTestJWT, testJWTSecrets };
