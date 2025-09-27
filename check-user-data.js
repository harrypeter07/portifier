// Script to check specific user data
// Usage: node check-user-data.js

const { MongoClient } = require('mongodb');

async function checkUserData() {
    const uri = process.env.MONGODB_URI || 'mongodb+srv://hassanmansuri570:qW39cAZ6LjjALyqv@cluster0.sjzsfmk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');
        
        const db = client.db('test');
        
        // Check test@gmail.com user
        const user = await db.collection('users').findOne({ email: 'test@gmail.com' });
        console.log('👤 User test@gmail.com:', {
            id: user?._id,
            email: user?.email,
            username: user?.username
        });
        
        if (user) {
            // Check portfolios for this user
            const portfolios = await db.collection('portfolios').find({ userId: user._id }).toArray();
            console.log(`\n📄 Portfolios for test@gmail.com (${portfolios.length}):`);
            portfolios.forEach(portfolio => {
                console.log(`  - ID: ${portfolio._id}, Template: ${portfolio.templateId}`);
                if (portfolio.portfolioData?.personal) {
                    console.log(`    Name: ${portfolio.portfolioData.personal.firstName} ${portfolio.portfolioData.personal.lastName}`);
                }
            });
            
            // Check resumes for this user
            const resumes = await db.collection('resumes').find({ userId: user._id }).toArray();
            console.log(`\n📋 Resumes for test@gmail.com (${resumes.length}):`);
            resumes.forEach(resume => {
                console.log(`  - ID: ${resume._id}, Status: ${resume.status}`);
                if (resume.parsedData?.hero?.title) {
                    console.log(`    Title: ${resume.parsedData.hero.title}`);
                }
                if (resume.parsedData?.contact?.email) {
                    console.log(`    Email: ${resume.parsedData.contact.email}`);
                }
            });
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.close();
    }
}

checkUserData();
