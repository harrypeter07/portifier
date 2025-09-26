// Test script to verify Gemini API key works
// Usage: node test-gemini-key.js

const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiKey() {
    const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyD-muOOl3MUkOj7GGRT_jv-jaSCi6jJr10';
    
    console.log('🔑 Testing Gemini API Key...');
    console.log('API Key (first 10 chars):', apiKey.substring(0, 10) + '...');
    
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        
        // Try different model names in order of preference
        const models = [
            'gemini-1.5-pro',
            'gemini-1.5-flash-latest', 
            'gemini-1.0-pro',
            'gemini-pro',
            'gemini-1.5-flash',
            'gemini-2.0-flash-exp'
        ];
        
        let workingModel = null;
        
        for (const modelName of models) {
            try {
                console.log(`\n🧪 Testing model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello, this is a test");
                const response = await result.response;
                const text = response.text();
                
                console.log(`✅ ${modelName} works! Response:`, text.substring(0, 50) + '...');
                workingModel = modelName;
                break; // If one works, we're good
                
            } catch (modelError) {
                if (modelError.message.includes('quota') || modelError.message.includes('Too Many Requests')) {
                    console.log(`⚠️ ${modelName} quota exceeded (but model exists)`);
                    workingModel = modelName; // Model exists, just quota issue
                    break;
                } else if (modelError.message.includes('404') || modelError.message.includes('not found')) {
                    console.log(`❌ ${modelName} not found`);
                } else {
                    console.log(`❌ ${modelName} failed:`, modelError.message);
                }
            }
        }
        
        if (workingModel) {
            console.log(`\n🎉 Recommended model: ${workingModel}`);
        } else {
            console.log(`\n❌ No working models found`);
        }
        
    } catch (error) {
        console.error('❌ API Key test failed:', error.message);
        
        if (error.message.includes('API_KEY_INVALID')) {
            console.log('💡 Your API key is invalid. Please check it.');
        } else if (error.message.includes('Too Many Requests')) {
            console.log('💡 Rate limit exceeded. Wait 5-10 minutes and try again.');
        } else if (error.message.includes('PERMISSION_DENIED')) {
            console.log('💡 API key doesn\'t have permission for this model.');
        }
    }
}

testGeminiKey();
