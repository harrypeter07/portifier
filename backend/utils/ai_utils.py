"""
AI and machine learning utilities
"""
import re
import spacy
import nltk
from typing import List, Dict, Any, Optional, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

class TextProcessor:
    """Processes and analyzes text content"""
    
    def __init__(self):
        self.stop_words = set(nltk.corpus.stopwords.words('english'))
        try:
            self.nlp = spacy.load('en_core_web_sm')
        except OSError:
            # Fallback if spaCy model is not available
            self.nlp = None
    
    def extract_keywords(self, text: str, max_keywords: int = 20) -> List[str]:
        """Extract keywords from text"""
        if not text:
            return []
        
        # Clean text
        text = self.clean_text(text)
        
        # Tokenize and remove stop words
        words = nltk.word_tokenize(text.lower())
        words = [word for word in words if word.isalpha() and word not in self.stop_words]
        
        # Use TF-IDF to find important words
        if len(words) > 1:
            vectorizer = TfidfVectorizer(max_features=max_keywords, ngram_range=(1, 2))
            try:
                tfidf_matrix = vectorizer.fit_transform([' '.join(words)])
                feature_names = vectorizer.get_feature_names_out()
                scores = tfidf_matrix.toarray()[0]
                
                # Sort by score and return top keywords
                keyword_scores = list(zip(feature_names, scores))
                keyword_scores.sort(key=lambda x: x[1], reverse=True)
                return [keyword for keyword, score in keyword_scores if score > 0]
            except Exception:
                pass
        
        # Fallback: return most frequent words
        from collections import Counter
        word_freq = Counter(words)
        return [word for word, freq in word_freq.most_common(max_keywords)]
    
    def extract_entities(self, text: str) -> Dict[str, List[str]]:
        """Extract named entities from text"""
        if not self.nlp or not text:
            return {}
        
        doc = self.nlp(text)
        entities = {
            'PERSON': [],
            'ORG': [],
            'GPE': [],  # Geopolitical entities (countries, cities, states)
            'DATE': [],
            'MONEY': [],
            'PERCENT': []
        }
        
        for ent in doc.ents:
            if ent.label_ in entities:
                entities[ent.label_].append(ent.text)
        
        # Remove duplicates
        for key in entities:
            entities[key] = list(set(entities[key]))
        
        return entities
    
    def clean_text(self, text: str) -> str:
        """Clean and normalize text"""
        if not text:
            return ""
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove special characters but keep basic punctuation
        text = re.sub(r'[^\w\s\.\,\!\?\;\:\-\(\)]', '', text)
        
        return text.strip()
    
    def extract_sentences(self, text: str) -> List[str]:
        """Extract sentences from text"""
        if not text:
            return []
        
        sentences = nltk.sent_tokenize(text)
        return [s.strip() for s in sentences if s.strip()]
    
    def calculate_text_similarity(self, text1: str, text2: str) -> float:
        """Calculate similarity between two texts"""
        if not text1 or not text2:
            return 0.0
        
        vectorizer = TfidfVectorizer()
        try:
            tfidf_matrix = vectorizer.fit_transform([text1, text2])
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            return float(similarity)
        except Exception:
            return 0.0

class AIAnalyzer:
    """AI-powered analysis for resumes and documents"""
    
    def __init__(self):
        self.text_processor = TextProcessor()
        self.resume_keywords = self._load_resume_keywords()
        self.ats_keywords = self._load_ats_keywords()
    
    def _load_resume_keywords(self) -> List[str]:
        """Load common resume keywords"""
        return [
            'experience', 'skills', 'education', 'certification', 'project',
            'leadership', 'team', 'management', 'development', 'analysis',
            'communication', 'problem solving', 'innovation', 'results',
            'achievement', 'responsibility', 'collaboration', 'technical',
            'professional', 'expertise', 'proficiency', 'knowledge'
        ]
    
    def _load_ats_keywords(self) -> List[str]:
        """Load ATS-friendly keywords"""
        return [
            'bachelor', 'master', 'phd', 'degree', 'certification',
            'years experience', 'proficient', 'expert', 'advanced',
            'intermediate', 'beginner', 'fluent', 'native', 'bilingual',
            'leadership', 'management', 'supervision', 'mentoring',
            'project management', 'agile', 'scrum', 'kanban'
        ]
    
    def analyze_resume(self, resume_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze a resume and provide insights"""
        analysis = {
            'overall_score': 0.0,
            'strengths': [],
            'weaknesses': [],
            'suggestions': [],
            'ats_score': 0.0,
            'keyword_match': 0.0,
            'sections': {},
            'extracted_data': {}
        }
        
        # Extract text content
        full_text = self._extract_resume_text(resume_data)
        
        # Analyze sections
        sections = self._analyze_sections(resume_data)
        analysis['sections'] = sections
        
        # Calculate ATS score
        ats_score = self._calculate_ats_score(resume_data, full_text)
        analysis['ats_score'] = ats_score
        
        # Calculate keyword match
        keyword_match = self._calculate_keyword_match(full_text)
        analysis['keyword_match'] = keyword_match
        
        # Generate strengths and weaknesses
        strengths, weaknesses = self._identify_strengths_weaknesses(resume_data, sections)
        analysis['strengths'] = strengths
        analysis['weaknesses'] = weaknesses
        
        # Generate suggestions
        suggestions = self._generate_suggestions(resume_data, sections, ats_score, keyword_match)
        analysis['suggestions'] = suggestions
        
        # Calculate overall score
        overall_score = self._calculate_overall_score(ats_score, keyword_match, sections)
        analysis['overall_score'] = overall_score
        
        # Extract structured data
        extracted_data = self._extract_structured_data(resume_data, full_text)
        analysis['extracted_data'] = extracted_data
        
        return analysis
    
    def _extract_resume_text(self, resume_data: Dict[str, Any]) -> str:
        """Extract all text content from resume"""
        text_parts = []
        
        # Add basic information
        if resume_data.get('name'):
            text_parts.append(resume_data['name'])
        if resume_data.get('summary'):
            text_parts.append(resume_data['summary'])
        
        # Add experience
        for exp in resume_data.get('experience', []):
            if exp.get('title'):
                text_parts.append(exp['title'])
            if exp.get('company'):
                text_parts.append(exp['company'])
            if exp.get('description'):
                text_parts.append(exp['description'])
        
        # Add education
        for edu in resume_data.get('education', []):
            if edu.get('degree'):
                text_parts.append(edu['degree'])
            if edu.get('institution'):
                text_parts.append(edu['institution'])
        
        # Add skills
        for skill in resume_data.get('skills', []):
            if skill.get('name'):
                text_parts.append(skill['name'])
        
        return ' '.join(text_parts)
    
    def _analyze_sections(self, resume_data: Dict[str, Any]) -> Dict[str, Dict[str, Any]]:
        """Analyze individual resume sections"""
        sections = {}
        
        # Contact information
        contact_score = 100 if all([
            resume_data.get('name'),
            resume_data.get('email'),
            resume_data.get('phone')
        ]) else 50
        sections['contact'] = {
            'score': contact_score,
            'status': 'complete' if contact_score >= 80 else 'incomplete'
        }
        
        # Summary
        summary = resume_data.get('summary', '')
        summary_score = min(100, len(summary) * 2) if summary else 0
        sections['summary'] = {
            'score': summary_score,
            'status': 'complete' if summary_score >= 80 else 'needs_improvement'
        }
        
        # Experience
        experience = resume_data.get('experience', [])
        exp_score = min(100, len(experience) * 20) if experience else 0
        sections['experience'] = {
            'score': exp_score,
            'status': 'complete' if exp_score >= 60 else 'needs_improvement'
        }
        
        # Education
        education = resume_data.get('education', [])
        edu_score = 100 if education else 0
        sections['education'] = {
            'score': edu_score,
            'status': 'complete' if edu_score >= 80 else 'needs_improvement'
        }
        
        # Skills
        skills = resume_data.get('skills', [])
        skills_score = min(100, len(skills) * 10) if skills else 0
        sections['skills'] = {
            'score': skills_score,
            'status': 'complete' if skills_score >= 70 else 'needs_improvement'
        }
        
        return sections
    
    def _calculate_ats_score(self, resume_data: Dict[str, Any], full_text: str) -> float:
        """Calculate ATS compatibility score"""
        score = 0.0
        max_score = 100.0
        
        # Check for required sections
        required_sections = ['name', 'email', 'phone', 'experience', 'education']
        section_score = sum(1 for section in required_sections if resume_data.get(section))
        score += (section_score / len(required_sections)) * 30
        
        # Check for ATS keywords
        text_lower = full_text.lower()
        ats_matches = sum(1 for keyword in self.ats_keywords if keyword in text_lower)
        score += min(30, ats_matches * 2)
        
        # Check for quantified achievements
        numbers = re.findall(r'\d+', full_text)
        if len(numbers) >= 3:
            score += 20
        
        # Check for action verbs
        action_verbs = ['developed', 'managed', 'led', 'created', 'implemented', 'achieved']
        verb_matches = sum(1 for verb in action_verbs if verb in text_lower)
        score += min(20, verb_matches * 3)
        
        return min(score, max_score)
    
    def _calculate_keyword_match(self, text: str) -> float:
        """Calculate keyword match percentage"""
        if not text:
            return 0.0
        
        text_lower = text.lower()
        matches = sum(1 for keyword in self.resume_keywords if keyword in text_lower)
        return min(100.0, (matches / len(self.resume_keywords)) * 100)
    
    def _identify_strengths_weaknesses(self, resume_data: Dict[str, Any], sections: Dict[str, Any]) -> Tuple[List[str], List[str]]:
        """Identify strengths and weaknesses"""
        strengths = []
        weaknesses = []
        
        # Analyze strengths
        if sections.get('contact', {}).get('score', 0) >= 80:
            strengths.append('Complete contact information')
        
        if sections.get('summary', {}).get('score', 0) >= 80:
            strengths.append('Strong professional summary')
        
        if sections.get('experience', {}).get('score', 0) >= 60:
            strengths.append('Relevant work experience')
        
        if sections.get('skills', {}).get('score', 0) >= 70:
            strengths.append('Comprehensive skills section')
        
        # Analyze weaknesses
        if sections.get('contact', {}).get('score', 0) < 80:
            weaknesses.append('Missing or incomplete contact information')
        
        if sections.get('summary', {}).get('score', 0) < 80:
            weaknesses.append('Professional summary could be stronger')
        
        if sections.get('experience', {}).get('score', 0) < 60:
            weaknesses.append('Limited work experience or missing details')
        
        if sections.get('skills', {}).get('score', 0) < 70:
            weaknesses.append('Skills section needs improvement')
        
        return strengths, weaknesses
    
    def _generate_suggestions(self, resume_data: Dict[str, Any], sections: Dict[str, Any], ats_score: float, keyword_match: float) -> List[str]:
        """Generate improvement suggestions"""
        suggestions = []
        
        if ats_score < 70:
            suggestions.append('Improve ATS compatibility by using standard section headings')
        
        if keyword_match < 60:
            suggestions.append('Include more relevant keywords from job descriptions')
        
        if sections.get('summary', {}).get('score', 0) < 80:
            suggestions.append('Add a compelling professional summary')
        
        if sections.get('experience', {}).get('score', 0) < 60:
            suggestions.append('Quantify achievements with specific numbers and metrics')
        
        if sections.get('skills', {}).get('score', 0) < 70:
            suggestions.append('Add more specific technical skills')
        
        return suggestions
    
    def _calculate_overall_score(self, ats_score: float, keyword_match: float, sections: Dict[str, Any]) -> float:
        """Calculate overall resume score"""
        section_scores = [section.get('score', 0) for section in sections.values()]
        avg_section_score = sum(section_scores) / len(section_scores) if section_scores else 0
        
        overall_score = (ats_score * 0.3 + keyword_match * 0.3 + avg_section_score * 0.4)
        return round(overall_score, 1)
    
    def _extract_structured_data(self, resume_data: Dict[str, Any], full_text: str) -> Dict[str, Any]:
        """Extract structured data from resume"""
        extracted = {
            'name': resume_data.get('name', ''),
            'email': resume_data.get('email', ''),
            'phone': resume_data.get('phone', ''),
            'skills': [skill.get('name', '') for skill in resume_data.get('skills', [])],
            'experience_count': len(resume_data.get('experience', [])),
            'education_count': len(resume_data.get('education', [])),
            'keywords': self.text_processor.extract_keywords(full_text, 10)
        }
        
        return extracted
