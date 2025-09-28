#!/usr/bin/env python3
"""
Simple script to test MongoDB connection
"""

import os
import sys
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_mongodb_connection():
    """Test MongoDB connection"""
    try:
        # Get MongoDB URI from environment
        mongodb_uri = os.getenv('MONGODB_URI')
        if not mongodb_uri:
            print("❌ MONGODB_URI not found in environment variables")
            return False
        
        print(f"🔌 Testing connection to: {mongodb_uri[:50]}...")
        
        # Create client
        client = MongoClient(mongodb_uri)
        
        # Test connection
        print("🏓 Pinging database...")
        client.admin.command('ping')
        
        # Get database info
        db = client['pdf_editor_db']
        print(f"📊 Database: {db.name}")
        
        # List collections
        collections = db.list_collection_names()
        print(f"📁 Collections: {collections}")
        
        # Test creating a simple document
        test_collection = db['test_connection']
        test_doc = {'test': True, 'timestamp': '2024-01-01'}
        result = test_collection.insert_one(test_doc)
        print(f"✅ Test document inserted with ID: {result.inserted_id}")
        
        # Clean up test document
        test_collection.delete_one({'_id': result.inserted_id})
        print("🧹 Test document cleaned up")
        
        client.close()
        print("✅ MongoDB connection test successful!")
        return True
        
    except Exception as e:
        print(f"❌ MongoDB connection test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("🚀 Starting MongoDB connection test...")
    success = test_mongodb_connection()
    sys.exit(0 if success else 1)
