"""
API routes for the PDF Editor
"""
from .pdf_routes import pdf_bp
from .resume_routes import resume_bp
from .file_routes import file_bp
from .auth_routes import auth_bp

__all__ = [
    'pdf_bp',
    'resume_bp', 
    'file_bp',
    'auth_bp'
]
