"""
PDF Storage Service using MongoDB GridFS
"""
import os
import base64
import uuid
from datetime import datetime
from typing import Optional, Dict, Any, List
from pymongo import MongoClient
import gridfs
from bson import ObjectId

from models.pdf_models import PDFDocument, TextElement, ImageElement
from utils.database import get_database

class PDFStorageService:
    """Service for storing and retrieving PDFs from MongoDB"""
    
    def __init__(self):
        self.db_manager = None
        self.fs = None
        self.collection = None
        self._initialized = False
        # Don't initialize immediately - wait until first use
    
    def _ensure_database_initialized(self) -> bool:
        """Ensure database is initialized"""
        if not self._initialized:
            print("🔄 Initializing PDFStorageService database...")
            try:
                self.db_manager = get_database()
                if self.db_manager is not None and self.db_manager.db is not None:
                    self.fs = gridfs.GridFS(self.db_manager.db)
                    self.collection = self.db_manager.get_collection('pdf_documents')
                    self._initialized = True
                    print("✅ PDFStorageService database initialized successfully")
                    return True
                else:
                    print("❌ Failed to initialize database in PDFStorageService - db_manager or db is None")
                    return False
            except Exception as e:
                print(f"❌ Error initializing database in PDFStorageService: {e}")
                return False
        return True
    
    def store_pdf(self, file_data: bytes, filename: str, user_id: str = None) -> Dict[str, Any]:
        """Store PDF file in MongoDB GridFS"""
        try:
            if not self._ensure_database_initialized():
                return {'success': False, 'error': 'Database not initialized'}
            
            print(f"📁 Storing PDF in MongoDB: {filename}")
            
            # Generate unique document ID
            document_id = str(uuid.uuid4())
            
            # Store file in GridFS
            file_id = self.fs.put(
                file_data,
                filename=filename,
                document_id=document_id,
                user_id=user_id,
                upload_date=datetime.now()
            )
            
            print(f"✅ PDF stored in GridFS with ID: {file_id}")
            
            # Store document metadata
            document_metadata = {
                'document_id': document_id,
                'file_id': file_id,
                'filename': filename,
                'file_size': len(file_data),
                'user_id': user_id,
                'created_at': datetime.now(),
                'updated_at': datetime.now(),
                'status': 'uploaded'
            }
            
            result = self.collection.insert_one(document_metadata)
            print(f"✅ Document metadata stored with ID: {result.inserted_id}")
            
            return {
                'success': True,
                'document_id': document_id,
                'file_id': str(file_id),
                'filename': filename,
                'file_size': len(file_data)
            }
            
        except Exception as e:
            print(f"❌ Error storing PDF: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def retrieve_pdf(self, document_id: str) -> Optional[bytes]:
        """Retrieve PDF file from MongoDB GridFS"""
        try:
            print(f"📥 Retrieving PDF from MongoDB: {document_id}")
            # Ensure DB initialized (in case service constructed before DB ready)
            if not self._ensure_database_initialized():
                print("❌ Database not initialized in retrieve_pdf")
                return None
            
            # Get document metadata
            doc_metadata = self.collection.find_one({'document_id': document_id})
            if not doc_metadata:
                print(f"❌ Document not found: {document_id}")
                return None
            
            # Get file from GridFS
            file_id = doc_metadata['file_id']
            file_data = self.fs.get(file_id).read()
            
            print(f"✅ PDF retrieved successfully, size: {len(file_data)} bytes")
            return file_data
            
        except Exception as e:
            print(f"❌ Error retrieving PDF: {e}")
            return None
    
    def store_pdf_document(self, pdf_document: PDFDocument, user_id: str = None) -> Dict[str, Any]:
        """Store or update complete PDF document with all elements.
        Use upsert to avoid creating a second document without file_id.
        """
        try:
            print(f"📄 Storing PDF document in MongoDB: {pdf_document.document_id}")
            
            # Convert to dictionary
            doc_dict = pdf_document.to_dict()
            doc_dict['user_id'] = user_id
            doc_dict['stored_at'] = datetime.now()
            
            # Update existing metadata document (created in store_pdf) without removing file_id
            result = self.collection.update_one(
                {'document_id': pdf_document.document_id},
                {'$set': doc_dict},
                upsert=True
            )
            print(f"✅ PDF document metadata upserted. matched={result.matched_count} upserted_id={result.upserted_id}")
            
            return {
                'success': True,
                'document_id': pdf_document.document_id,
            }
            
        except Exception as e:
            print(f"❌ Error storing PDF document: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_pdf_document(self, document_id: str) -> Optional[PDFDocument]:
        """Retrieve PDF document from MongoDB"""
        try:
            print(f"📖 Retrieving PDF document from MongoDB: {document_id}")
            
            # Prefer the record that contains file_id
            doc_data = self.collection.find_one({'document_id': document_id, 'file_id': {'$exists': True}})
            if not doc_data:
                # Fallback to any record if older duplicates exist
                doc_data = self.collection.find_one({'document_id': document_id})
            if not doc_data:
                print(f"❌ PDF document not found: {document_id}")
                return None
            
            # Convert ObjectId to string for JSON serialization
            if '_id' in doc_data:
                doc_data['_id'] = str(doc_data['_id'])
            
            # Convert to PDFDocument object
            pdf_document = PDFDocument.from_dict(doc_data)
            print(f"✅ PDF document retrieved successfully")
            return pdf_document
            
        except Exception as e:
            print(f"❌ Error retrieving PDF document: {e}")
            return None
    
    def update_pdf_document(self, document_id: str, updates: Dict[str, Any]) -> bool:
        """Update PDF document in MongoDB"""
        try:
            print(f"🔄 Updating PDF document: {document_id}")
            
            updates['updated_at'] = datetime.now()
            result = self.collection.update_one(
                {'document_id': document_id},
                {'$set': updates}
            )
            
            if result.modified_count > 0:
                print(f"✅ PDF document updated successfully")
                return True
            else:
                print(f"⚠️ No changes made to PDF document")
                return False
                
        except Exception as e:
            print(f"❌ Error updating PDF document: {e}")
            return False

    def replace_pdf_file(self, document_id: str, new_file_bytes: bytes) -> bool:
        """Replace the PDF file in GridFS and update metadata with new file size and file_id."""
        try:
            if not self._ensure_database_initialized():
                print("❌ Database not initialized in replace_pdf_file")
                return False

            doc = self.collection.find_one({'document_id': document_id})
            if not doc:
                print(f"❌ Document metadata not found for replace: {document_id}")
                return False

            # Delete old file if exists
            if 'file_id' in doc and doc['file_id']:
                try:
                    self.fs.delete(doc['file_id'])
                except Exception as del_err:
                    print(f"⚠️ Could not delete old GridFS file: {del_err}")

            # Store new file
            new_file_id = self.fs.put(
                new_file_bytes,
                filename=doc.get('filename', f"{document_id}.pdf"),
                document_id=document_id,
                user_id=doc.get('user_id'),
                upload_date=datetime.now()
            )

            # Update metadata
            self.collection.update_one(
                {'document_id': document_id},
                {'$set': {
                    'file_id': new_file_id,
                    'file_size': len(new_file_bytes),
                    'updated_at': datetime.now(),
                    'status': 'updated'
                }}
            )

            print(f"✅ Replaced PDF file in GridFS for {document_id}")
            return True
        except Exception as e:
            print(f"❌ Error replacing PDF file: {e}")
            return False
    
    def delete_pdf_document(self, document_id: str) -> bool:
        """Delete PDF document from MongoDB"""
        try:
            print(f"🗑️ Deleting PDF document: {document_id}")
            
            # Get document metadata
            doc_metadata = self.collection.find_one({'document_id': document_id})
            if not doc_metadata:
                print(f"❌ Document not found: {document_id}")
                return False
            
            # Delete from GridFS
            if 'file_id' in doc_metadata:
                self.fs.delete(doc_metadata['file_id'])
                print(f"✅ File deleted from GridFS")
            
            # Delete metadata
            result = self.collection.delete_one({'document_id': document_id})
            if result.deleted_count > 0:
                print(f"✅ PDF document deleted successfully")
                return True
            else:
                print(f"❌ Failed to delete PDF document metadata")
                return False
                
        except Exception as e:
            print(f"❌ Error deleting PDF document: {e}")
            return False
    
    def list_user_pdfs(self, user_id: str) -> List[Dict[str, Any]]:
        """List all PDFs for a user"""
        try:
            print(f"📋 Listing PDFs for user: {user_id}")
            
            cursor = self.collection.find(
                {'user_id': user_id},
                {'document_id': 1, 'filename': 1, 'file_size': 1, 'created_at': 1, 'status': 1}
            ).sort('created_at', -1)
            
            pdfs = []
            for doc in cursor:
                doc['_id'] = str(doc['_id'])
                pdfs.append(doc)
            
            print(f"✅ Found {len(pdfs)} PDFs for user")
            return pdfs
            
        except Exception as e:
            print(f"❌ Error listing PDFs: {e}")
            return []
