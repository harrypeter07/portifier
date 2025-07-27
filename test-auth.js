// Test script for authentication endpoints
// Run with: node test-auth.js

const BASE_URL = 'http://localhost:3000';

async function testAuth() {
    console.log('🧪 Testing Authentication Endpoints\n');

    // Test 1: Sign up a new user
    console.log('1. Testing Sign Up...');
    const signupData = {
        name: 'Test User',
        username: 'testuser' + Date.now(),
        email: 'test' + Date.now() + '@example.com',
        password: 'password123'
    };

    try {
        const signupRes = await fetch(`${BASE_URL}/api/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signupData)
        });

        const signupResult = await signupRes.json();
        console.log('Signup Response:', signupRes.status, signupResult);

        if (signupRes.ok) {
            console.log('✅ Signup successful');
            
            // Test 2: Check if user is authenticated
            console.log('\n2. Testing /me endpoint...');
            const meRes = await fetch(`${BASE_URL}/api/auth/me`);
            const meResult = await meRes.json();
            console.log('/me Response:', meRes.status, meResult);

            if (meRes.ok) {
                console.log('✅ User is authenticated after signup');
            } else {
                console.log('❌ User not authenticated after signup');
            }

            // Test 3: Sign in with the same credentials
            console.log('\n3. Testing Sign In...');
            const signinRes = await fetch(`${BASE_URL}/api/auth/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: signupData.email,
                    password: signupData.password
                })
            });

            const signinResult = await signinRes.json();
            console.log('Signin Response:', signinRes.status, signinResult);

            if (signinRes.ok) {
                console.log('✅ Signin successful');
            } else {
                console.log('❌ Signin failed');
            }

            // Test 4: Logout
            console.log('\n4. Testing Logout...');
            const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
                method: 'POST'
            });

            const logoutResult = await logoutRes.json();
            console.log('Logout Response:', logoutRes.status, logoutResult);

            if (logoutRes.ok) {
                console.log('✅ Logout successful');
            } else {
                console.log('❌ Logout failed');
            }

            // Test 5: Check if user is still authenticated after logout
            console.log('\n5. Testing /me endpoint after logout...');
            const meAfterLogoutRes = await fetch(`${BASE_URL}/api/auth/me`);
            const meAfterLogoutResult = await meAfterLogoutRes.json();
            console.log('/me Response after logout:', meAfterLogoutRes.status, meAfterLogoutResult);

            if (meAfterLogoutRes.status === 401) {
                console.log('✅ User properly logged out');
            } else {
                console.log('❌ User still authenticated after logout');
            }

        } else {
            console.log('❌ Signup failed');
        }

    } catch (error) {
        console.error('❌ Test failed with error:', error.message);
    }

    console.log('\n🏁 Authentication tests completed');
}

// Run the test
testAuth();