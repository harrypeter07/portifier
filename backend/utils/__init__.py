"""
Utility modules for the PDF Editor API
"""
from .file_utils import FileHandler, FileValidator
from .security import SecurityManager, JWTManager
from .database import DatabaseManager

# Make AI dependencies optional to avoid import errors
try:
    from .ai_utils import AIAnalyzer, TextProcessor
    AI_AVAILABLE = True
except ImportError as e:
    print(f"⚠️ AI dependencies not available: {e}")
    AIAnalyzer = None
    TextProcessor = None
    AI_AVAILABLE = False

__all__ = [
    'FileHandler',
    'FileValidator',
    'SecurityManager',
    'JWTManager',
    'DatabaseManager'
]

if AI_AVAILABLE:
    __all__.extend(['AIAnalyzer', 'TextProcessor'])
