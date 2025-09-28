"""
Database utilities and connection management
"""
import os
from typing import Optional, Dict, Any, List
from pymongo import MongoClient
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
from datetime import datetime

class DatabaseManager:
    """Manages database connections and operations"""
    
    def __init__(self, connection_string: str, database_name: str):
        self.connection_string = connection_string
        self.database_name = database_name
        self.client: Optional[MongoClient] = None
        self.async_client: Optional[AsyncIOMotorClient] = None
        self.db = None
        self.async_db = None
    
    def connect(self) -> bool:
        """Connect to MongoDB"""
        try:
            self.client = MongoClient(self.connection_string)
            self.db = self.client[self.database_name]
            
            # Test connection
            self.client.admin.command('ping')
            return True
        except Exception as e:
            print(f"Database connection failed: {e}")
            return False
    
    async def async_connect(self) -> bool:
        """Connect to MongoDB asynchronously"""
        try:
            self.async_client = AsyncIOMotorClient(self.connection_string)
            self.async_db = self.async_client[self.database_name]
            
            # Test connection
            await self.async_client.admin.command('ping')
            return True
        except Exception as e:
            print(f"Async database connection failed: {e}")
            return False
    
    def disconnect(self):
        """Disconnect from MongoDB"""
        if self.client:
            self.client.close()
        if self.async_client:
            asyncio.create_task(self.async_client.close())
    
    def get_collection(self, collection_name: str):
        """Get a collection from the database"""
        if not self.db:
            raise Exception("Database not connected")
        return self.db[collection_name]
    
    async def get_async_collection(self, collection_name: str):
        """Get a collection from the async database"""
        if not self.async_db:
            raise Exception("Async database not connected")
        return self.async_db[collection_name]
    
    def create_indexes(self):
        """Create database indexes for better performance"""
        try:
            # Users collection indexes
            users_collection = self.get_collection('users')
            users_collection.create_index('email', unique=True)
            users_collection.create_index('username', unique=True)
            users_collection.create_index('created_at')
            
            # Resumes collection indexes
            resumes_collection = self.get_collection('resumes')
            resumes_collection.create_index('user_id')
            resumes_collection.create_index([('user_id', 1), ('updated_at', -1)])
            resumes_collection.create_index('created_at')
            
            # PDF documents collection indexes
            pdf_collection = self.get_collection('pdf_documents')
            pdf_collection.create_index('user_id')
            pdf_collection.create_index('created_at')
            pdf_collection.create_index('file_hash')
            
            # Resume analyses collection indexes
            analyses_collection = self.get_collection('resume_analyses')
            analyses_collection.create_index('resume_id')
            analyses_collection.create_index('created_at')
            
            print("Database indexes created successfully")
        except Exception as e:
            print(f"Error creating indexes: {e}")
    
    def get_stats(self) -> Dict[str, Any]:
        """Get database statistics"""
        try:
            if self.db is None:
                return {'error': 'Database not connected'}
            
            stats = {
                'users_count': self.get_collection('users').count_documents({}),
                'resumes_count': self.get_collection('resumes').count_documents({}),
                'pdf_documents_count': self.get_collection('pdf_documents').count_documents({}),
                'analyses_count': self.get_collection('resume_analyses').count_documents({}),
                'database_name': self.database_name,
                'connection_status': 'connected' if self.client is not None else 'disconnected'
            }
            return stats
        except Exception as e:
            return {'error': str(e)}

# Global database manager instance
db_manager: Optional[DatabaseManager] = None

def init_database(connection_string: str, database_name: str) -> DatabaseManager:
    """Initialize the global database manager"""
    global db_manager
    db_manager = DatabaseManager(connection_string, database_name)
    return db_manager

def get_database() -> DatabaseManager:
    """Get the global database manager"""
    if db_manager is None:
        raise Exception("Database not initialized")
    return db_manager
