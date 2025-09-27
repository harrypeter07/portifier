// Script to check what data exists in the database
// Usage: node check-database.js

const { MongoClient } = require('mongodb');

async function checkDatabase() {
    const uri = process.env.MONGODB_URI || 'mongodb+srv://hassanmansuri570:qW39cAZ6LjjALyqv@cluster0.sjzsfmk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');
        
        // Connect to the test database
        const db = client.db('test');
        
        // List all collections
        const collections = await db.listCollections().toArray();
        console.log('📁 Collections in test database:', collections.map(c => c.name));
        
        // Check users collection
        const users = await db.collection('users').find({}).toArray();
        console.log(`\n👥 Users (${users.length}):`);
        users.forEach(user => {
            console.log(`  - ${user.email} (${user.username}) - ID: ${user._id}`);
        });
        
        // Check portfolios collection
        const portfolios = await db.collection('portfolios').find({}).toArray();
        console.log(`\n📄 Portfolios (${portfolios.length}):`);
        portfolios.forEach(portfolio => {
            console.log(`  - ID: ${portfolio._id}, User: ${portfolio.userId}, Template: ${portfolio.templateId}`);
            if (portfolio.portfolioData?.personal) {
                console.log(`    Name: ${portfolio.portfolioData.personal.firstName} ${portfolio.portfolioData.personal.lastName}`);
            }
        });
        
        // Check resumes collection
        const resumes = await db.collection('resumes').find({}).toArray();
        console.log(`\n📋 Resumes (${resumes.length}):`);
        resumes.forEach(resume => {
            console.log(`  - ID: ${resume._id}, User: ${resume.userId}, Status: ${resume.status}`);
            if (resume.parsedData?.hero?.title) {
                console.log(`    Title: ${resume.parsedData.hero.title}`);
            }
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.close();
    }
}

checkDatabase();
