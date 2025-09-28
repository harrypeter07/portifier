"""
AI and machine learning service
"""
from typing import Dict, Any, List, Optional
import os
import requests
import json

from utils.ai_utils import AIAnalyzer, TextProcessor
from models.resume_models import ResumeAnalysis

class AIService:
    """Service for AI-powered analysis and processing"""
    
    def __init__(self):
        self.ai_analyzer = AIAnalyzer()
        self.text_processor = TextProcessor()
        self.openai_api_key = os.environ.get('OPENAI_API_KEY')
        self.huggingface_api_key = os.environ.get('HUGGINGFACE_API_KEY')
    
    def analyze_resume(self, resume_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze a resume using AI"""
        try:
            # Use local AI analyzer
            analysis = self.ai_analyzer.analyze_resume(resume_data)
            
            # If OpenAI API key is available, enhance with GPT analysis
            if self.openai_api_key:
                enhanced_analysis = self._enhance_with_openai(resume_data, analysis)
                return enhanced_analysis
            
            return analysis
            
        except Exception as e:
            print(f"Error analyzing resume: {e}")
            return self._get_default_analysis()
    
    def analyze_pdf_content(self, pdf_text: str, analysis_type: str = 'general') -> Dict[str, Any]:
        """Analyze PDF content using AI"""
        try:
            if analysis_type == 'resume':
                # Extract structured data from PDF text
                structured_data = self._extract_resume_data_from_text(pdf_text)
                return self.analyze_resume(structured_data)
            else:
                # General document analysis
                return self._analyze_general_document(pdf_text)
                
        except Exception as e:
            print(f"Error analyzing PDF content: {e}")
            return self._get_default_analysis()
    
    def generate_resume_suggestions(self, resume_data: Dict[str, Any], 
                                   job_description: Optional[str] = None) -> Dict[str, Any]:
        """Generate personalized suggestions for resume improvement"""
        try:
            suggestions = {
                'keyword_optimization': [],
                'content_improvements': [],
                'formatting_suggestions': [],
                'ats_optimization': [],
                'personalized_tips': []
            }
            
            # Analyze current resume
            analysis = self.analyze_resume(resume_data)
            
            # Generate keyword optimization suggestions
            if job_description:
                suggestions['keyword_optimization'] = self._suggest_keywords(
                    resume_data, job_description
                )
            
            # Generate content improvement suggestions
            suggestions['content_improvements'] = self._suggest_content_improvements(
                resume_data, analysis
            )
            
            # Generate formatting suggestions
            suggestions['formatting_suggestions'] = self._suggest_formatting_improvements(
                resume_data
            )
            
            # Generate ATS optimization suggestions
            suggestions['ats_optimization'] = self._suggest_ats_improvements(
                resume_data, analysis
            )
            
            # Generate personalized tips
            suggestions['personalized_tips'] = self._generate_personalized_tips(
                resume_data, analysis
            )
            
            return suggestions
            
        except Exception as e:
            print(f"Error generating suggestions: {e}")
            return {'error': str(e)}
    
    def extract_text_from_image(self, image_data: str) -> str:
        """Extract text from image using OCR"""
        try:
            # This would integrate with OCR services
            # For now, return placeholder
            return "Extracted text from image would appear here"
        except Exception as e:
            print(f"Error extracting text from image: {e}")
            return ""
    
    def _enhance_with_openai(self, resume_data: Dict[str, Any], 
                           base_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Enhance analysis using OpenAI API"""
        try:
            if not self.openai_api_key:
                return base_analysis
            
            # Prepare prompt for OpenAI
            prompt = self._create_analysis_prompt(resume_data, base_analysis)
            
            # Call OpenAI API
            response = requests.post(
                'https://api.openai.com/v1/chat/completions',
                headers={
                    'Authorization': f'Bearer {self.openai_api_key}',
                    'Content-Type': 'application/json'
                },
                json={
                    'model': 'gpt-3.5-turbo',
                    'messages': [
                        {'role': 'system', 'content': 'You are a professional resume analyst.'},
                        {'role': 'user', 'content': prompt}
                    ],
                    'max_tokens': 1000,
                    'temperature': 0.7
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                enhanced_suggestions = result['choices'][0]['message']['content']
                
                # Parse and integrate enhanced suggestions
                base_analysis['ai_enhanced_suggestions'] = enhanced_suggestions
                base_analysis['overall_score'] = min(100, base_analysis['overall_score'] + 5)
            
            return base_analysis
            
        except Exception as e:
            print(f"Error enhancing with OpenAI: {e}")
            return base_analysis
    
    def _create_analysis_prompt(self, resume_data: Dict[str, Any], 
                              base_analysis: Dict[str, Any]) -> str:
        """Create prompt for OpenAI analysis"""
        resume_text = self._extract_resume_text(resume_data)
        
        prompt = f"""
        Analyze this resume and provide specific improvement suggestions:
        
        Resume Content:
        {resume_text}
        
        Current Analysis:
        - Overall Score: {base_analysis.get('overall_score', 0)}
        - ATS Score: {base_analysis.get('ats_score', 0)}
        - Strengths: {', '.join(base_analysis.get('strengths', []))}
        - Weaknesses: {', '.join(base_analysis.get('weaknesses', []))}
        
        Please provide:
        1. 3 specific content improvements
        2. 3 formatting suggestions
        3. 3 ATS optimization tips
        4. Overall assessment and recommendation
        
        Format your response as a structured list.
        """
        
        return prompt
    
    def _extract_resume_data_from_text(self, text: str) -> Dict[str, Any]:
        """Extract structured resume data from plain text"""
        # This is a simplified extraction - in practice, you'd use more sophisticated NLP
        lines = text.split('\n')
        
        resume_data = {
            'name': '',
            'email': '',
            'phone': '',
            'summary': '',
            'experience': [],
            'education': [],
            'skills': []
        }
        
        # Extract email
        import re
        email_match = re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text)
        if email_match:
            resume_data['email'] = email_match.group()
        
        # Extract phone
        phone_match = re.search(r'(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})', text)
        if phone_match:
            resume_data['phone'] = phone_match.group()
        
        # Extract skills (look for common skill keywords)
        skill_keywords = ['python', 'javascript', 'react', 'node.js', 'sql', 'html', 'css']
        for keyword in skill_keywords:
            if keyword.lower() in text.lower():
                resume_data['skills'].append({'name': keyword.title(), 'level': 'intermediate'})
        
        return resume_data
    
    def _analyze_general_document(self, text: str) -> Dict[str, Any]:
        """Analyze general document content"""
        keywords = self.text_processor.extract_keywords(text, 20)
        entities = self.text_processor.extract_entities(text)
        sentences = self.text_processor.extract_sentences(text)
        
        return {
            'overall_score': 75.0,
            'strengths': [
                'Document contains structured content',
                'Relevant keywords identified',
                'Clear text formatting'
            ],
            'weaknesses': [
                'Could benefit from more specific details',
                'Consider adding more technical terms'
            ],
            'suggestions': [
                'Add more specific examples',
                'Include relevant statistics',
                'Improve document structure'
            ],
            'ats_score': 70.0,
            'keyword_match': 65.0,
            'sections': {
                'content': {'score': 75, 'status': 'good'},
                'structure': {'score': 70, 'status': 'good'},
                'keywords': {'score': 65, 'status': 'needs_improvement'}
            },
            'extracted_data': {
                'keywords': keywords,
                'entities': entities,
                'sentence_count': len(sentences),
                'word_count': len(text.split())
            }
        }
    
    def _suggest_keywords(self, resume_data: Dict[str, Any], 
                         job_description: str) -> List[str]:
        """Suggest keywords based on job description"""
        job_keywords = self.text_processor.extract_keywords(job_description, 15)
        resume_text = self._extract_resume_text(resume_data)
        resume_keywords = self.text_processor.extract_keywords(resume_text, 15)
        
        suggestions = []
        for keyword in job_keywords:
            if keyword.lower() not in resume_text.lower():
                suggestions.append(f"Add '{keyword}' to your resume")
        
        return suggestions[:5]  # Return top 5 suggestions
    
    def _suggest_content_improvements(self, resume_data: Dict[str, Any], 
                                    analysis: Dict[str, Any]) -> List[str]:
        """Suggest content improvements"""
        suggestions = []
        
        if analysis.get('ats_score', 0) < 70:
            suggestions.append("Add more quantified achievements with specific numbers")
        
        if not resume_data.get('summary'):
            suggestions.append("Add a compelling professional summary")
        
        if len(resume_data.get('experience', [])) < 2:
            suggestions.append("Include more detailed work experience")
        
        if len(resume_data.get('skills', [])) < 5:
            suggestions.append("Add more relevant technical skills")
        
        return suggestions
    
    def _suggest_formatting_improvements(self, resume_data: Dict[str, Any]) -> List[str]:
        """Suggest formatting improvements"""
        return [
            "Use consistent formatting for dates and locations",
            "Consider adding a projects section to showcase your work",
            "Ensure all contact information is up to date",
            "Use bullet points for better readability",
            "Maintain consistent font and spacing throughout"
        ]
    
    def _suggest_ats_improvements(self, resume_data: Dict[str, Any], 
                                analysis: Dict[str, Any]) -> List[str]:
        """Suggest ATS optimization improvements"""
        return [
            "Use standard section headings (Experience, Education, Skills)",
            "Avoid using tables or complex formatting",
            "Include relevant keywords from job descriptions",
            "Use common file formats (PDF, DOCX)",
            "Keep formatting simple and clean"
        ]
    
    def _generate_personalized_tips(self, resume_data: Dict[str, Any], 
                                  analysis: Dict[str, Any]) -> List[str]:
        """Generate personalized tips based on analysis"""
        tips = []
        
        if analysis.get('overall_score', 0) >= 80:
            tips.append("Your resume is already strong! Consider adding more specific metrics.")
        elif analysis.get('overall_score', 0) >= 60:
            tips.append("Your resume has good potential. Focus on quantifying your achievements.")
        else:
            tips.append("Your resume needs significant improvement. Start with adding a professional summary.")
        
        # Add skill-specific tips
        skills = resume_data.get('skills', [])
        if any('python' in skill.get('name', '').lower() for skill in skills):
            tips.append("Your Python skills are valuable - highlight specific projects and frameworks.")
        
        return tips
    
    def _extract_resume_text(self, resume_data: Dict[str, Any]) -> str:
        """Extract all text content from resume data"""
        text_parts = []
        
        if resume_data.get('name'):
            text_parts.append(resume_data['name'])
        if resume_data.get('summary'):
            text_parts.append(resume_data['summary'])
        
        for exp in resume_data.get('experience', []):
            if exp.get('title'):
                text_parts.append(exp['title'])
            if exp.get('description'):
                text_parts.append(exp['description'])
        
        for skill in resume_data.get('skills', []):
            if skill.get('name'):
                text_parts.append(skill['name'])
        
        return ' '.join(text_parts)
    
    def _get_default_analysis(self) -> Dict[str, Any]:
        """Get default analysis when AI analysis fails"""
        return {
            'overall_score': 70.0,
            'strengths': ['Document structure is clear'],
            'weaknesses': ['Could benefit from more specific details'],
            'suggestions': ['Add more quantified achievements'],
            'ats_score': 65.0,
            'keyword_match': 60.0,
            'sections': {
                'content': {'score': 70, 'status': 'good'},
                'structure': {'score': 65, 'status': 'good'}
            },
            'extracted_data': {}
        }
