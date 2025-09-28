"""
Resume management service
"""
import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime
import os

from ..models.resume_models import Resume, Experience, Education, Skill, ResumeAnalysis
from ..utils.file_utils import FileHandler, FileValidator
from ..utils.database import get_database

class ResumeService:
    """Service for resume management operations"""
    
    def __init__(self, file_handler: FileHandler):
        self.file_handler = file_handler
        self.db = get_database()
    
    def create_resume(self, user_id: str, resume_data: Dict[str, Any], 
                     file_path: Optional[str] = None) -> Resume:
        """Create a new resume"""
        resume_id = str(uuid.uuid4())
        
        # Parse experience data
        experience = []
        for exp_data in resume_data.get('experience', []):
            experience.append(Experience.from_dict(exp_data))
        
        # Parse education data
        education = []
        for edu_data in resume_data.get('education', []):
            education.append(Education.from_dict(edu_data))
        
        # Parse skills data
        skills = []
        for skill_data in resume_data.get('skills', []):
            skills.append(Skill.from_dict(skill_data))
        
        # Get file information if provided
        file_name = None
        file_size = None
        file_type = None
        
        if file_path and os.path.exists(file_path):
            file_info = self.file_handler.get_file_info(file_path)
            file_name = os.path.basename(file_path)
            file_size = file_info.get('size', 0)
            file_type = file_info.get('mime_type', '')
        
        # Create resume object
        resume = Resume(
            resume_id=resume_id,
            user_id=user_id,
            title=resume_data.get('title', 'Untitled Resume'),
            name=resume_data.get('name', ''),
            email=resume_data.get('email', ''),
            phone=resume_data.get('phone'),
            location=resume_data.get('location'),
            summary=resume_data.get('summary'),
            experience=experience,
            education=education,
            skills=skills,
            file_name=file_name,
            file_size=file_size,
            file_type=file_type,
            file_path=file_path
        )
        
        # Save to database
        self._save_resume_to_db(resume)
        
        return resume
    
    def get_resume(self, resume_id: str, user_id: str) -> Optional[Resume]:
        """Get a resume by ID"""
        try:
            collection = self.db.get_collection('resumes')
            resume_data = collection.find_one({
                'resume_id': resume_id,
                'user_id': user_id
            })
            
            if resume_data:
                return Resume.from_dict(resume_data)
            return None
        except Exception as e:
            print(f"Error getting resume: {e}")
            return None
    
    def get_user_resumes(self, user_id: str) -> List[Resume]:
        """Get all resumes for a user"""
        try:
            collection = self.db.get_collection('resumes')
            cursor = collection.find({'user_id': user_id}).sort('updated_at', -1)
            
            resumes = []
            for resume_data in cursor:
                resumes.append(Resume.from_dict(resume_data))
            
            return resumes
        except Exception as e:
            print(f"Error getting user resumes: {e}")
            return []
    
    def update_resume(self, resume_id: str, user_id: str, 
                     update_data: Dict[str, Any]) -> Optional[Resume]:
        """Update a resume"""
        try:
            collection = self.db.get_collection('resumes')
            
            # Parse updated data
            if 'experience' in update_data:
                update_data['experience'] = [
                    Experience.from_dict(exp).to_dict() 
                    for exp in update_data['experience']
                ]
            
            if 'education' in update_data:
                update_data['education'] = [
                    Education.from_dict(edu).to_dict() 
                    for edu in update_data['education']
                ]
            
            if 'skills' in update_data:
                update_data['skills'] = [
                    Skill.from_dict(skill).to_dict() 
                    for skill in update_data['skills']
                ]
            
            # Add update timestamp
            update_data['updated_at'] = datetime.now().isoformat()
            
            # Update in database
            result = collection.update_one(
                {'resume_id': resume_id, 'user_id': user_id},
                {'$set': update_data}
            )
            
            if result.modified_count > 0:
                return self.get_resume(resume_id, user_id)
            return None
            
        except Exception as e:
            print(f"Error updating resume: {e}")
            return None
    
    def delete_resume(self, resume_id: str, user_id: str) -> bool:
        """Delete a resume"""
        try:
            collection = self.db.get_collection('resumes')
            
            # Get resume to delete associated file
            resume = self.get_resume(resume_id, user_id)
            if resume and resume.file_path:
                self.file_handler.delete_file(resume.file_path)
            
            # Delete from database
            result = collection.delete_one({
                'resume_id': resume_id,
                'user_id': user_id
            })
            
            return result.deleted_count > 0
            
        except Exception as e:
            print(f"Error deleting resume: {e}")
            return False
    
    def save_resume_analysis(self, resume_id: str, analysis_data: Dict[str, Any]) -> ResumeAnalysis:
        """Save resume analysis results"""
        analysis = ResumeAnalysis(
            resume_id=resume_id,
            analysis_type=analysis_data.get('analysis_type', 'resume'),
            overall_score=analysis_data.get('overall_score', 0.0),
            strengths=analysis_data.get('strengths', []),
            weaknesses=analysis_data.get('weaknesses', []),
            suggestions=analysis_data.get('suggestions', []),
            ats_score=analysis_data.get('ats_score', 0.0),
            keyword_match=analysis_data.get('keyword_match', 0.0),
            sections=analysis_data.get('sections', {}),
            extracted_data=analysis_data.get('extracted_data', {})
        )
        
        # Save to database
        collection = self.db.get_collection('resume_analyses')
        collection.insert_one(analysis.to_dict())
        
        return analysis
    
    def get_resume_analysis(self, resume_id: str) -> Optional[ResumeAnalysis]:
        """Get resume analysis results"""
        try:
            collection = self.db.get_collection('resume_analyses')
            analysis_data = collection.find_one(
                {'resume_id': resume_id},
                sort=[('created_at', -1)]
            )
            
            if analysis_data:
                return ResumeAnalysis.from_dict(analysis_data)
            return None
            
        except Exception as e:
            print(f"Error getting resume analysis: {e}")
            return None
    
    def _save_resume_to_db(self, resume: Resume):
        """Save resume to database"""
        try:
            collection = self.db.get_collection('resumes')
            collection.insert_one(resume.to_dict())
        except Exception as e:
            print(f"Error saving resume to database: {e}")
            raise
    
    def export_resume(self, resume_id: str, user_id: str, format: str = 'json') -> Optional[str]:
        """Export resume in specified format"""
        resume = self.get_resume(resume_id, user_id)
        if not resume:
            return None
        
        try:
            if format.lower() == 'json':
                return self._export_as_json(resume)
            elif format.lower() == 'pdf':
                return self._export_as_pdf(resume)
            elif format.lower() == 'docx':
                return self._export_as_docx(resume)
            else:
                return None
        except Exception as e:
            print(f"Error exporting resume: {e}")
            return None
    
    def _export_as_json(self, resume: Resume) -> str:
        """Export resume as JSON"""
        import json
        return json.dumps(resume.to_dict(), indent=2)
    
    def _export_as_pdf(self, resume: Resume) -> str:
        """Export resume as PDF"""
        # This would integrate with a PDF generation library
        # For now, return the file path if it exists
        if resume.file_path and os.path.exists(resume.file_path):
            return resume.file_path
        return None
    
    def _export_as_docx(self, resume: Resume) -> str:
        """Export resume as DOCX"""
        # This would integrate with python-docx
        # For now, return None as placeholder
        return None
    
    def duplicate_resume(self, resume_id: str, user_id: str, new_title: str) -> Optional[Resume]:
        """Duplicate an existing resume"""
        original_resume = self.get_resume(resume_id, user_id)
        if not original_resume:
            return None
        
        # Create new resume data
        new_resume_data = original_resume.to_dict()
        new_resume_data['title'] = new_title
        new_resume_data.pop('resume_id', None)
        new_resume_data.pop('created_at', None)
        new_resume_data.pop('updated_at', None)
        new_resume_data.pop('file_path', None)
        new_resume_data.pop('file_name', None)
        new_resume_data.pop('file_size', None)
        new_resume_data.pop('file_type', None)
        
        return self.create_resume(user_id, new_resume_data)
    
    def get_resume_statistics(self, user_id: str) -> Dict[str, Any]:
        """Get resume statistics for a user"""
        try:
            collection = self.db.get_collection('resumes')
            
            # Get basic counts
            total_resumes = collection.count_documents({'user_id': user_id})
            
            # Get recent activity
            recent_resumes = collection.find(
                {'user_id': user_id}
            ).sort('updated_at', -1).limit(5)
            
            recent_list = []
            for resume in recent_resumes:
                recent_list.append({
                    'title': resume.get('title', ''),
                    'updated_at': resume.get('updated_at', ''),
                    'resume_id': resume.get('resume_id', '')
                })
            
            return {
                'total_resumes': total_resumes,
                'recent_resumes': recent_list
            }
            
        except Exception as e:
            print(f"Error getting resume statistics: {e}")
            return {'total_resumes': 0, 'recent_resumes': []}
