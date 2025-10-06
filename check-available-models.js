// Script to check what Gemini models are actually available
// Usage: node check-available-models.js

const { GoogleGenerativeAI } = require('@google/generative-ai');

async function checkAvailableModels() {
    const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyD-muOOl3MUkOj7GGRT_jv-jaSCi6jJr10';
    
    console.log('🔍 Checking available Gemini models...');
    console.log('API Key (first 10 chars):', apiKey.substring(0, 10) + '...');
    
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        
        // Try to list available models (if this endpoint exists)
        try {
            console.log('\n📋 Attempting to list available models...');
            // Note: This might not work as the API might not expose this endpoint
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
            if (response.ok) {
                const data = await response.json();
                console.log('Available models:', data);
            } else {
                console.log('Model listing not available via API');
            }
        } catch (listError) {
            console.log('Model listing failed:', listError.message);
        }
        
        // Test Gemini 2.0+ model names only
        const modelsToTest = [
            'gemini-2.0-flash-exp',
            'gemini-2.0-flash-thinking-exp',
            'gemini-exp-1206',
            'gemini-exp-1120',
            'gemini-2.0-flash',
            'gemini-2.0-pro',
            'gemini-2.0-flash-001',
            'gemini-2.0-pro-001'
        ];
        
        console.log('\n🧪 Testing individual models...');
        const workingModels = [];
        const quotaExceededModels = [];
        const notFoundModels = [];
        
        for (const modelName of modelsToTest) {
            try {
                console.log(`Testing: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello");
                const response = await result.response;
                const text = response.text();
                
                console.log(`✅ ${modelName} - WORKS!`);
                workingModels.push(modelName);
                
            } catch (error) {
                if (error.message.includes('quota') || error.message.includes('Too Many Requests')) {
                    console.log(`⚠️ ${modelName} - Quota exceeded (but model exists)`);
                    quotaExceededModels.push(modelName);
                } else if (error.message.includes('404') || error.message.includes('not found')) {
                    console.log(`❌ ${modelName} - Not found`);
                    notFoundModels.push(modelName);
                } else {
                    console.log(`❌ ${modelName} - Error: ${error.message.substring(0, 100)}...`);
                }
            }
        }
        
        console.log('\n📊 SUMMARY:');
        console.log('✅ Working models:', workingModels);
        console.log('⚠️ Quota exceeded (but exist):', quotaExceededModels);
        console.log('❌ Not found:', notFoundModels);
        
        if (workingModels.length > 0) {
            console.log(`\n🎉 Recommended model: ${workingModels[0]}`);
        } else if (quotaExceededModels.length > 0) {
            console.log(`\n⚠️ All models quota exceeded. Try: ${quotaExceededModels[0]} when quota resets`);
        } else {
            console.log('\n❌ No working models found');
        }
        
    } catch (error) {
        console.error('❌ API Key test failed:', error.message);
    }
}

checkAvailableModels();
