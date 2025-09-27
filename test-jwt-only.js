// Test script for JWT functionality only (without MongoDB)
// This tests the JWT creation and verification logic

const { SignJWT, jwtVerify } = require('jose');

async function testJWT() {
    console.log('🧪 Testing JWT Functionality\n');
    
    const JWT_SECRET = 'your-super-secret-jwt-key-change-this-in-production';
    const userId = 'test-user-id-123';
    
    try {
        // Test 1: Create JWT token
        console.log('1. Testing JWT Token Creation...');
        const secret = new TextEncoder().encode(JWT_SECRET);
        const token = await new SignJWT({ userId })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("7d")
            .sign(secret);
        
        console.log('✅ JWT token created successfully');
        console.log('Token:', token.substring(0, 50) + '...');
        
        // Test 2: Verify JWT token
        console.log('\n2. Testing JWT Token Verification...');
        const { payload } = await jwtVerify(token, secret);
        console.log('✅ JWT token verified successfully');
        console.log('Payload:', payload);
        
        if (payload.userId === userId) {
            console.log('✅ User ID matches');
        } else {
            console.log('❌ User ID mismatch');
        }
        
        // Test 3: Test with wrong secret
        console.log('\n3. Testing JWT Token with Wrong Secret...');
        const wrongSecret = new TextEncoder().encode('wrong-secret');
        try {
            await jwtVerify(token, wrongSecret);
            console.log('❌ Token should not be verified with wrong secret');
        } catch (error) {
            console.log('✅ Token correctly rejected with wrong secret');
        }
        
        // Test 4: Test expired token
        console.log('\n4. Testing Expired JWT Token...');
        const expiredToken = await new SignJWT({ userId })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("1s")
            .sign(secret);
        
        // Wait for token to expire
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        try {
            await jwtVerify(expiredToken, secret);
            console.log('❌ Expired token should not be verified');
        } catch (error) {
            console.log('✅ Expired token correctly rejected');
        }
        
        console.log('\n🏁 JWT tests completed successfully');
        
    } catch (error) {
        console.error('❌ JWT test failed:', error.message);
    }
}

// Run the test
testJWT();