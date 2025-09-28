"""
Resume-related data models
"""
from dataclasses import dataclass, asdict
from typing import List, Dict, Optional, Any
from datetime import datetime

@dataclass
class Experience:
    """Represents work experience"""
    title: str
    company: str
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None
    current: bool = False
    
    def to_dict(self):
        return asdict(self)
    
    @classmethod
    def from_dict(cls, data):
        return cls(**data)

@dataclass
class Education:
    """Represents education information"""
    degree: str
    institution: str
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    gpa: Optional[str] = None
    description: Optional[str] = None
    
    def to_dict(self):
        return asdict(self)
    
    @classmethod
    def from_dict(cls, data):
        return cls(**data)

@dataclass
class Skill:
    """Represents a skill with proficiency level"""
    name: str
    level: str  # 'beginner', 'intermediate', 'advanced', 'expert'
    category: Optional[str] = None  # 'technical', 'soft', 'language', etc.
    
    def to_dict(self):
        return asdict(self)
    
    @classmethod
    def from_dict(cls, data):
        return cls(**data)

@dataclass
class Resume:
    """Represents a complete resume"""
    resume_id: str
    user_id: str
    title: str
    name: str
    email: str
    phone: Optional[str] = None
    location: Optional[str] = None
    summary: Optional[str] = None
    experience: List[Experience] = None
    education: List[Education] = None
    skills: List[Skill] = None
    
    # File information
    file_name: Optional[str] = None
    file_size: Optional[int] = None
    file_type: Optional[str] = None
    file_path: Optional[str] = None
    
    # Metadata
    created_at: datetime = None
    updated_at: datetime = None
    
    def __post_init__(self):
        if self.experience is None:
            self.experience = []
        if self.education is None:
            self.education = []
        if self.skills is None:
            self.skills = []
        if self.created_at is None:
            self.created_at = datetime.now()
        if self.updated_at is None:
            self.updated_at = datetime.now()
    
    def to_dict(self):
        return {
            'resume_id': self.resume_id,
            'user_id': self.user_id,
            'title': self.title,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'location': self.location,
            'summary': self.summary,
            'experience': [exp.to_dict() for exp in self.experience],
            'education': [edu.to_dict() for edu in self.education],
            'skills': [skill.to_dict() for skill in self.skills],
            'file_name': self.file_name,
            'file_size': self.file_size,
            'file_type': self.file_type,
            'file_path': self.file_path,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    @classmethod
    def from_dict(cls, data):
        return cls(
            resume_id=data['resume_id'],
            user_id=data['user_id'],
            title=data['title'],
            name=data['name'],
            email=data['email'],
            phone=data.get('phone'),
            location=data.get('location'),
            summary=data.get('summary'),
            experience=[Experience.from_dict(exp) for exp in data.get('experience', [])],
            education=[Education.from_dict(edu) for edu in data.get('education', [])],
            skills=[Skill.from_dict(skill) for skill in data.get('skills', [])],
            file_name=data.get('file_name'),
            file_size=data.get('file_size'),
            file_type=data.get('file_type'),
            file_path=data.get('file_path'),
            created_at=datetime.fromisoformat(data['created_at']),
            updated_at=datetime.fromisoformat(data['updated_at'])
        )

@dataclass
class ResumeAnalysis:
    """Represents the analysis results of a resume"""
    resume_id: str
    analysis_type: str = 'resume'
    overall_score: float = 0.0
    strengths: List[str] = None
    weaknesses: List[str] = None
    suggestions: List[str] = None
    ats_score: float = 0.0
    keyword_match: float = 0.0
    sections: Dict[str, Dict[str, Any]] = None
    extracted_data: Dict[str, Any] = None
    created_at: datetime = None
    
    def __post_init__(self):
        if self.strengths is None:
            self.strengths = []
        if self.weaknesses is None:
            self.weaknesses = []
        if self.suggestions is None:
            self.suggestions = []
        if self.sections is None:
            self.sections = {}
        if self.extracted_data is None:
            self.extracted_data = {}
        if self.created_at is None:
            self.created_at = datetime.now()
    
    def to_dict(self):
        return {
            'resume_id': self.resume_id,
            'analysis_type': self.analysis_type,
            'overall_score': self.overall_score,
            'strengths': self.strengths,
            'weaknesses': self.weaknesses,
            'suggestions': self.suggestions,
            'ats_score': self.ats_score,
            'keyword_match': self.keyword_match,
            'sections': self.sections,
            'extracted_data': self.extracted_data,
            'created_at': self.created_at.isoformat()
        }
    
    @classmethod
    def from_dict(cls, data):
        return cls(
            resume_id=data['resume_id'],
            analysis_type=data.get('analysis_type', 'resume'),
            overall_score=data.get('overall_score', 0.0),
            strengths=data.get('strengths', []),
            weaknesses=data.get('weaknesses', []),
            suggestions=data.get('suggestions', []),
            ats_score=data.get('ats_score', 0.0),
            keyword_match=data.get('keyword_match', 0.0),
            sections=data.get('sections', {}),
            extracted_data=data.get('extracted_data', {}),
            created_at=datetime.fromisoformat(data['created_at'])
        )
