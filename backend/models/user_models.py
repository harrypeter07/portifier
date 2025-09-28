"""
User-related data models
"""
from dataclasses import dataclass, asdict
from typing import List, Optional, Dict, Any
from datetime import datetime
import hashlib
import secrets

@dataclass
class User:
    """Represents a user in the system"""
    user_id: str
    username: str
    email: str
    password_hash: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_picture: Optional[str] = None
    is_active: bool = True
    is_verified: bool = False
    created_at: datetime = None
    updated_at: datetime = None
    last_login: Optional[datetime] = None
    
    # User preferences
    preferences: Dict[str, Any] = None
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now()
        if self.updated_at is None:
            self.updated_at = datetime.now()
        if self.preferences is None:
            self.preferences = {}
    
    def to_dict(self):
        return {
            'user_id': self.user_id,
            'username': self.username,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'profile_picture': self.profile_picture,
            'is_active': self.is_active,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'preferences': self.preferences
        }
    
    @classmethod
    def from_dict(cls, data):
        return cls(
            user_id=data['user_id'],
            username=data['username'],
            email=data['email'],
            password_hash=data['password_hash'],
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            profile_picture=data.get('profile_picture'),
            is_active=data.get('is_active', True),
            is_verified=data.get('is_verified', False),
            created_at=datetime.fromisoformat(data['created_at']),
            updated_at=datetime.fromisoformat(data['updated_at']),
            last_login=datetime.fromisoformat(data['last_login']) if data.get('last_login') else None,
            preferences=data.get('preferences', {})
        )
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a password using SHA-256 with salt"""
        salt = secrets.token_hex(16)
        password_hash = hashlib.sha256((password + salt).encode()).hexdigest()
        return f"{salt}:{password_hash}"
    
    @staticmethod
    def verify_password(password: str, password_hash: str) -> bool:
        """Verify a password against its hash"""
        try:
            salt, hash_part = password_hash.split(':')
            computed_hash = hashlib.sha256((password + salt).encode()).hexdigest()
            return computed_hash == hash_part
        except ValueError:
            return False

@dataclass
class UserSession:
    """Represents a user session"""
    session_id: str
    user_id: str
    token: str
    created_at: datetime
    expires_at: datetime
    is_active: bool = True
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    
    def to_dict(self):
        return {
            'session_id': self.session_id,
            'user_id': self.user_id,
            'token': self.token,
            'created_at': self.created_at.isoformat(),
            'expires_at': self.expires_at.isoformat(),
            'is_active': self.is_active,
            'ip_address': self.ip_address,
            'user_agent': self.user_agent
        }
    
    @classmethod
    def from_dict(cls, data):
        return cls(
            session_id=data['session_id'],
            user_id=data['user_id'],
            token=data['token'],
            created_at=datetime.fromisoformat(data['created_at']),
            expires_at=datetime.fromisoformat(data['expires_at']),
            is_active=data.get('is_active', True),
            ip_address=data.get('ip_address'),
            user_agent=data.get('user_agent')
        )
