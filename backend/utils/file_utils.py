"""
File handling utilities
"""
import os
import uuid
import magic
import hashlib
from pathlib import Path
from typing import Optional, Dict, Any, List
import mimetypes
from werkzeug.utils import secure_filename

class FileValidator:
    """Validates file types and content"""
    
    ALLOWED_EXTENSIONS = {
        'pdf': ['pdf'],
        'image': ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff'],
        'document': ['docx', 'doc', 'rtf'],
        'python': ['py'],
        'jupyter': ['ipynb'],
        'text': ['txt', 'md']
    }
    
    MAX_FILE_SIZES = {
        'pdf': 16 * 1024 * 1024,  # 16MB
        'image': 10 * 1024 * 1024,  # 10MB
        'document': 10 * 1024 * 1024,  # 10MB
        'python': 1 * 1024 * 1024,  # 1MB
        'jupyter': 5 * 1024 * 1024,  # 5MB
        'text': 1 * 1024 * 1024  # 1MB
    }
    
    @classmethod
    def get_file_type(cls, filename: str) -> Optional[str]:
        """Get file type based on extension"""
        if not filename:
            return None
        
        extension = filename.lower().split('.')[-1]
        
        for file_type, extensions in cls.ALLOWED_EXTENSIONS.items():
            if extension in extensions:
                return file_type
        
        return None
    
    @classmethod
    def validate_file_type(cls, filename: str) -> bool:
        """Validate if file type is allowed"""
        return cls.get_file_type(filename) is not None
    
    @classmethod
    def validate_file_size(cls, file_size: int, file_type: str) -> bool:
        """Validate if file size is within limits"""
        max_size = cls.MAX_FILE_SIZES.get(file_type, 16 * 1024 * 1024)
        return file_size <= max_size
    
    @classmethod
    def validate_file_content(cls, file_path: str, expected_type: str) -> bool:
        """Validate file content using magic numbers"""
        try:
            mime = magic.from_file(file_path, mime=True)
            
            mime_mapping = {
                'pdf': 'application/pdf',
                'image': ['image/png', 'image/jpeg', 'image/gif', 'image/bmp', 'image/tiff'],
                'document': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'],
                'python': 'text/x-python',
                'jupyter': 'application/x-ipynb+json',
                'text': ['text/plain', 'text/markdown']
            }
            
            expected_mimes = mime_mapping.get(expected_type, [])
            if isinstance(expected_mimes, str):
                expected_mimes = [expected_mimes]
            
            return mime in expected_mimes
        except Exception:
            return False

class FileHandler:
    """Handles file operations"""
    
    def __init__(self, upload_folder: str, temp_folder: str):
        self.upload_folder = Path(upload_folder)
        self.temp_folder = Path(temp_folder)
        
        # Create directories if they don't exist
        self.upload_folder.mkdir(exist_ok=True)
        self.temp_folder.mkdir(exist_ok=True)
    
    def generate_unique_filename(self, original_filename: str) -> str:
        """Generate a unique filename"""
        secure_name = secure_filename(original_filename)
        name, ext = os.path.splitext(secure_name)
        unique_id = str(uuid.uuid4())
        return f"{unique_id}_{name}{ext}"
    
    def save_file(self, file, filename: str, subfolder: str = "") -> str:
        """Save uploaded file"""
        if subfolder:
            save_path = self.upload_folder / subfolder
            save_path.mkdir(exist_ok=True)
        else:
            save_path = self.upload_folder
        
        unique_filename = self.generate_unique_filename(filename)
        file_path = save_path / unique_filename
        
        file.save(str(file_path))
        return str(file_path)
    
    def delete_file(self, file_path: str) -> bool:
        """Delete a file"""
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                return True
            return False
        except Exception:
            return False
    
    def get_file_hash(self, file_path: str) -> str:
        """Get SHA-256 hash of a file"""
        hash_sha256 = hashlib.sha256()
        try:
            with open(file_path, "rb") as f:
                for chunk in iter(lambda: f.read(4096), b""):
                    hash_sha256.update(chunk)
            return hash_sha256.hexdigest()
        except Exception:
            return ""
    
    def get_file_info(self, file_path: str) -> Dict[str, Any]:
        """Get comprehensive file information"""
        try:
            stat = os.stat(file_path)
            return {
                'size': stat.st_size,
                'created': stat.st_ctime,
                'modified': stat.st_mtime,
                'hash': self.get_file_hash(file_path),
                'mime_type': magic.from_file(file_path, mime=True),
                'extension': Path(file_path).suffix.lower()
            }
        except Exception:
            return {}
    
    def create_temp_file(self, content: bytes, extension: str = "") -> str:
        """Create a temporary file with content"""
        temp_filename = f"temp_{uuid.uuid4()}{extension}"
        temp_path = self.temp_folder / temp_filename
        
        with open(temp_path, 'wb') as f:
            f.write(content)
        
        return str(temp_path)
    
    def cleanup_temp_files(self, max_age_hours: int = 24) -> int:
        """Clean up old temporary files"""
        import time
        current_time = time.time()
        max_age_seconds = max_age_hours * 3600
        cleaned_count = 0
        
        try:
            for file_path in self.temp_folder.iterdir():
                if file_path.is_file():
                    file_age = current_time - file_path.stat().st_mtime
                    if file_age > max_age_seconds:
                        file_path.unlink()
                        cleaned_count += 1
        except Exception:
            pass
        
        return cleaned_count
