"""
PDF-related data models
"""
from dataclasses import dataclass, asdict
from typing import List, Dict, Tuple, Optional, Any
import json
from datetime import datetime

@dataclass
class TextElement:
    """Represents a text element with all its formatting properties"""
    text: str
    bbox: Tuple[float, float, float, float]  # x0, y0, x1, y1
    font_name: str
    font_size: float
    font_flags: int
    color: Tuple[int, int, int]
    page_num: int
    block_num: int
    line_num: int
    word_num: int
    element_id: str
    
    def to_dict(self):
        return asdict(self)
    
    @classmethod
    def from_dict(cls, data):
        return cls(**data)

@dataclass
class ImageElement:
    """Represents an image element in the PDF"""
    image_id: str
    page: int
    bbox: Tuple[float, float, float, float]
    data: str  # base64 encoded image data
    xref: int
    width: int
    height: int
    format: str = 'png'
    
    def to_dict(self):
        return asdict(self)
    
    @classmethod
    def from_dict(cls, data):
        return cls(**data)

@dataclass
class PDFDocument:
    """Represents a complete PDF document with all its elements"""
    document_id: str
    filename: str
    file_path: str
    file_size: int
    page_count: int
    text_elements: List[TextElement]
    images: List[ImageElement]
    fonts: List[str]
    colors: List[Dict[str, Any]]
    metadata: Dict[str, Any]
    created_at: datetime
    updated_at: datetime
    
    def to_dict(self):
        return {
            'document_id': self.document_id,
            'filename': self.filename,
            'file_path': self.file_path,
            'file_size': self.file_size,
            'page_count': self.page_count,
            'text_elements': [elem.to_dict() for elem in self.text_elements],
            'images': [img.to_dict() for img in self.images],
            'fonts': self.fonts,
            'colors': self.colors,
            'metadata': self.metadata,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    @classmethod
    def from_dict(cls, data):
        return cls(
            document_id=data['document_id'],
            filename=data['filename'],
            file_path=data['file_path'],
            file_size=data['file_size'],
            page_count=data['page_count'],
            text_elements=[TextElement.from_dict(elem) for elem in data['text_elements']],
            images=[ImageElement.from_dict(img) for img in data['images']],
            fonts=data['fonts'],
            colors=data['colors'],
            metadata=data['metadata'],
            created_at=datetime.fromisoformat(data['created_at']),
            updated_at=datetime.fromisoformat(data['updated_at'])
        )

@dataclass
class PDFAnalysis:
    """Represents the analysis results of a PDF document"""
    document_id: str
    analysis_type: str  # 'resume', 'document', 'general'
    overall_score: float
    strengths: List[str]
    weaknesses: List[str]
    suggestions: List[str]
    ats_score: float
    keyword_match: float
    sections: Dict[str, Dict[str, Any]]
    extracted_data: Dict[str, Any]
    created_at: datetime
    
    def to_dict(self):
        return {
            'document_id': self.document_id,
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
            document_id=data['document_id'],
            analysis_type=data['analysis_type'],
            overall_score=data['overall_score'],
            strengths=data['strengths'],
            weaknesses=data['weaknesses'],
            suggestions=data['suggestions'],
            ats_score=data['ats_score'],
            keyword_match=data['keyword_match'],
            sections=data['sections'],
            extracted_data=data['extracted_data'],
            created_at=datetime.fromisoformat(data['created_at'])
        )
