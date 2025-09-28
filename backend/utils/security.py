"""
Security utilities for authentication and authorization
"""
import jwt
import secrets
import hashlib
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import bcrypt

class JWTManager:
    """Manages JWT token operations"""
    
    def __init__(self, secret_key: str, algorithm: str = 'HS256'):
        self.secret_key = secret_key
        self.algorithm = algorithm
    
    def generate_token(self, payload: Dict[str, Any], expires_in: int = 3600) -> str:
        """Generate a JWT token"""
        payload['exp'] = datetime.utcnow() + timedelta(seconds=expires_in)
        payload['iat'] = datetime.utcnow()
        payload['jti'] = secrets.token_hex(16)  # JWT ID
        
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
    
    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify and decode a JWT token"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
    
    def refresh_token(self, token: str, expires_in: int = 3600) -> Optional[str]:
        """Refresh a JWT token"""
        payload = self.verify_token(token)
        if payload:
            # Remove exp and iat from payload
            payload.pop('exp', None)
            payload.pop('iat', None)
            payload.pop('jti', None)
            return self.generate_token(payload, expires_in)
        return None

class SecurityManager:
    """Manages security operations"""
    
    def __init__(self, secret_key: str):
        self.jwt_manager = JWTManager(secret_key)
        self.password_salt_rounds = 12
    
    def hash_password(self, password: str) -> str:
        """Hash a password using bcrypt"""
        salt = bcrypt.gensalt(rounds=self.password_salt_rounds)
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    def verify_password(self, password: str, hashed_password: str) -> bool:
        """Verify a password against its hash"""
        try:
            return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
        except Exception:
            return False
    
    def generate_session_token(self, user_id: str, additional_data: Dict[str, Any] = None) -> str:
        """Generate a session token for a user"""
        payload = {
            'user_id': user_id,
            'type': 'session'
        }
        
        if additional_data:
            payload.update(additional_data)
        
        return self.jwt_manager.generate_token(payload, expires_in=86400)  # 24 hours
    
    def verify_session_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify a session token"""
        payload = self.jwt_manager.verify_token(token)
        if payload and payload.get('type') == 'session':
            return payload
        return None
    
    def generate_api_key(self, user_id: str, permissions: list = None) -> str:
        """Generate an API key for a user"""
        payload = {
            'user_id': user_id,
            'type': 'api_key',
            'permissions': permissions or ['read', 'write']
        }
        
        return self.jwt_manager.generate_token(payload, expires_in=31536000)  # 1 year
    
    def verify_api_key(self, api_key: str) -> Optional[Dict[str, Any]]:
        """Verify an API key"""
        payload = self.jwt_manager.verify_token(api_key)
        if payload and payload.get('type') == 'api_key':
            return payload
        return None
    
    def generate_csrf_token(self, user_id: str) -> str:
        """Generate a CSRF token"""
        payload = {
            'user_id': user_id,
            'type': 'csrf'
        }
        
        return self.jwt_manager.generate_token(payload, expires_in=3600)  # 1 hour
    
    def verify_csrf_token(self, token: str, user_id: str) -> bool:
        """Verify a CSRF token"""
        payload = self.jwt_manager.verify_token(token)
        return (payload and 
                payload.get('type') == 'csrf' and 
                payload.get('user_id') == user_id)
    
    def sanitize_input(self, input_string: str) -> str:
        """Sanitize user input to prevent XSS"""
        if not isinstance(input_string, str):
            return str(input_string)
        
        # Remove potentially dangerous characters
        dangerous_chars = ['<', '>', '"', "'", '&', '\x00']
        for char in dangerous_chars:
            input_string = input_string.replace(char, '')
        
        return input_string.strip()
    
    def validate_email(self, email: str) -> bool:
        """Validate email format"""
        import re
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    def validate_password_strength(self, password: str) -> Dict[str, Any]:
        """Validate password strength"""
        result = {
            'is_valid': True,
            'score': 0,
            'issues': []
        }
        
        if len(password) < 8:
            result['issues'].append('Password must be at least 8 characters long')
            result['is_valid'] = False
        
        if not any(c.isupper() for c in password):
            result['issues'].append('Password must contain at least one uppercase letter')
            result['score'] += 1
        
        if not any(c.islower() for c in password):
            result['issues'].append('Password must contain at least one lowercase letter')
            result['score'] += 1
        
        if not any(c.isdigit() for c in password):
            result['issues'].append('Password must contain at least one number')
            result['score'] += 1
        
        if not any(c in '!@#$%^&*()_+-=[]{}|;:,.<>?' for c in password):
            result['issues'].append('Password must contain at least one special character')
            result['score'] += 1
        
        # Calculate final score (0-4)
        result['score'] = min(4, result['score'])
        
        return result
