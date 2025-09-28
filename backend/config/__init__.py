"""
Configuration module for the PDF Editor API
"""
import os
from pathlib import Path

# Base directory
BASE_DIR = Path(__file__).parent.parent

# Upload and temporary directories
UPLOAD_FOLDER = BASE_DIR / 'uploads'
TEMP_FOLDER = BASE_DIR / 'temp'
OUTPUT_FOLDER = BASE_DIR / 'output'

# Create directories if they don't exist
for folder in [UPLOAD_FOLDER, TEMP_FOLDER, OUTPUT_FOLDER]:
    folder.mkdir(exist_ok=True)

# Flask configuration
class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    UPLOAD_FOLDER = str(UPLOAD_FOLDER)
    TEMP_FOLDER = str(TEMP_FOLDER)
    OUTPUT_FOLDER = str(OUTPUT_FOLDER)
    
    # CORS settings
    CORS_ORIGINS = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://your-frontend-domain.com"
    ]
    
    # Database settings
    MONGODB_URI = os.environ.get('MONGODB_URI') or 'mongodb://localhost:27017/pdf_editor'
    
    # AI/ML settings
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
    HUGGINGFACE_API_KEY = os.environ.get('HUGGINGFACE_API_KEY')
    
    # OCR settings
    TESSERACT_CMD = os.environ.get('TESSERACT_CMD') or '/usr/bin/tesseract'
    
    # Security settings
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key'
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 hour
    
    # File processing settings
    ALLOWED_EXTENSIONS = {
        'pdf': ['pdf'],
        'image': ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff'],
        'document': ['docx', 'doc', 'rtf'],
        'python': ['py'],
        'jupyter': ['ipynb'],
        'text': ['txt', 'md']
    }
    
    # Supported file types for upload
    SUPPORTED_FILE_TYPES = {
        'application/pdf': 'pdf',
        'image/png': 'image',
        'image/jpeg': 'image',
        'image/jpg': 'image',
        'image/gif': 'image',
        'image/bmp': 'image',
        'image/tiff': 'image',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'document',
        'application/msword': 'document',
        'text/plain': 'text',
        'text/x-python': 'python',
        'application/x-ipynb+json': 'jupyter'
    }

class DevelopmentConfig(Config):
    DEBUG = True
    TESTING = False

class ProductionConfig(Config):
    DEBUG = False
    TESTING = False

class TestingConfig(Config):
    DEBUG = True
    TESTING = True
    WTF_CSRF_ENABLED = False

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
