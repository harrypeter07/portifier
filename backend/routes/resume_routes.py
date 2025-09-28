"""
Resume management API routes
"""
from flask import Blueprint, request, jsonify, send_file
import os
from datetime import datetime

from services.resume_service import ResumeService
from services.ai_service import AIService
from services.file_service import FileService
from utils.file_utils import FileHandler, FileValidator
from utils.database import get_database

resume_bp = Blueprint('resume', __name__, url_prefix='/api/resume')

# Initialize services
file_handler = FileHandler('uploads', 'temp')
resume_service = ResumeService(file_handler)
ai_service = AIService()
file_service = FileService(file_handler)

@resume_bp.route('/save', methods=['POST'])
def save_resume():
    """Save a new resume"""
    try:
        # Get form data
        resume_data = request.form.get('resumeData')
        if not resume_data:
            return jsonify({'error': 'Resume data required'}), 400
        
        import json
        resume_data = json.loads(resume_data)
        
        # Get user ID (in a real app, this would come from authentication)
        user_id = request.headers.get('X-User-ID', 'anonymous')
        
        # Handle file upload if provided
        file_path = None
        if 'file' in request.files:
            file = request.files['file']
            if file.filename:
                # Validate file
                if FileValidator.validate_file_type(file.filename):
                    file_path = file_handler.save_file(file, file.filename, 'resumes')
        
        # Create resume
        resume = resume_service.create_resume(user_id, resume_data, file_path)
        
        return jsonify({
            'success': True,
            'resume': resume.to_dict()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@resume_bp.route('/list', methods=['GET'])
def list_resumes():
    """List all resumes for a user"""
    try:
        # Get user ID (in a real app, this would come from authentication)
        user_id = request.headers.get('X-User-ID', 'anonymous')
        
        resumes = resume_service.get_user_resumes(user_id)
        
        return jsonify({
            'success': True,
            'resumes': [resume.to_dict() for resume in resumes]
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@resume_bp.route('/<resume_id>', methods=['GET'])
def get_resume(resume_id):
    """Get a specific resume"""
    try:
        # Get user ID (in a real app, this would come from authentication)
        user_id = request.headers.get('X-User-ID', 'anonymous')
        
        resume = resume_service.get_resume(resume_id, user_id)
        
        if resume:
            return jsonify({
                'success': True,
                'resume': resume.to_dict()
            })
        else:
            return jsonify({'error': 'Resume not found'}), 404
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@resume_bp.route('/<resume_id>', methods=['PUT'])
def update_resume(resume_id):
    """Update a resume"""
    try:
        # Get user ID (in a real app, this would come from authentication)
        user_id = request.headers.get('X-User-ID', 'anonymous')
        
        update_data = request.json
        if not update_data:
            return jsonify({'error': 'Update data required'}), 400
        
        resume = resume_service.update_resume(resume_id, user_id, update_data)
        
        if resume:
            return jsonify({
                'success': True,
                'resume': resume.to_dict()
            })
        else:
            return jsonify({'error': 'Failed to update resume'}), 500
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@resume_bp.route('/<resume_id>', methods=['DELETE'])
def delete_resume(resume_id):
    """Delete a resume"""
    try:
        # Get user ID (in a real app, this would come from authentication)
        user_id = request.headers.get('X-User-ID', 'anonymous')
        
        success = resume_service.delete_resume(resume_id, user_id)
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Resume deleted successfully'
            })
        else:
            return jsonify({'error': 'Failed to delete resume'}), 500
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@resume_bp.route('/analyze', methods=['POST'])
def analyze_resume():
    """Analyze a resume using AI"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if not file.filename:
            return jsonify({'error': 'No file selected'}), 400
        
        # Validate file type
        if not FileValidator.validate_file_type(file.filename):
            return jsonify({'error': 'Invalid file type'}), 400
        
        # Save file temporarily
        file_path = file_handler.save_file(file, file.filename, 'temp')
        
        try:
            # Extract text from PDF
            if file.filename.lower().endswith('.pdf'):
                text = file_service.extract_text_from_pdf(file_path)
            else:
                # For other file types, you'd implement appropriate text extraction
                text = "Sample resume text for analysis"
            
            # Analyze the resume
            analysis = ai_service.analyze_pdf_content(text, 'resume')
            
            return jsonify({
                'success': True,
                'analysis': analysis
            })
            
        finally:
            # Clean up temporary file
            file_handler.delete_file(file_path)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@resume_bp.route('/suggestions', methods=['POST'])
def generate_suggestions():
    """Generate resume improvement suggestions"""
    try:
        data = request.json
        resume_data = data.get('resume_data')
        job_description = data.get('job_description')
        
        if not resume_data:
            return jsonify({'error': 'Resume data required'}), 400
        
        suggestions = ai_service.generate_resume_suggestions(resume_data, job_description)
        
        return jsonify({
            'success': True,
            'suggestions': suggestions
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@resume_bp.route('/<resume_id>/export', methods=['GET'])
def export_resume(resume_id):
    """Export resume in specified format"""
    try:
        # Get user ID (in a real app, this would come from authentication)
        user_id = request.headers.get('X-User-ID', 'anonymous')
        
        export_format = request.args.get('format', 'json')
        
        exported_data = resume_service.export_resume(resume_id, user_id, export_format)
        
        if exported_data:
            if export_format == 'json':
                return jsonify({
                    'success': True,
                    'data': exported_data
                })
            else:
                # For file exports, return the file
                return send_file(exported_data, as_attachment=True)
        else:
            return jsonify({'error': 'Failed to export resume'}), 500
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@resume_bp.route('/<resume_id>/duplicate', methods=['POST'])
def duplicate_resume(resume_id):
    """Duplicate an existing resume"""
    try:
        # Get user ID (in a real app, this would come from authentication)
        user_id = request.headers.get('X-User-ID', 'anonymous')
        
        data = request.json
        new_title = data.get('new_title', 'Copy of Resume')
        
        new_resume = resume_service.duplicate_resume(resume_id, user_id, new_title)
        
        if new_resume:
            return jsonify({
                'success': True,
                'resume': new_resume.to_dict()
            })
        else:
            return jsonify({'error': 'Failed to duplicate resume'}), 500
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@resume_bp.route('/statistics', methods=['GET'])
def get_resume_statistics():
    """Get resume statistics for a user"""
    try:
        # Get user ID (in a real app, this would come from authentication)
        user_id = request.headers.get('X-User-ID', 'anonymous')
        
        stats = resume_service.get_resume_statistics(user_id)
        
        return jsonify({
            'success': True,
            'statistics': stats
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@resume_bp.route('/<resume_id>/analysis', methods=['GET'])
def get_resume_analysis(resume_id):
    """Get analysis results for a resume"""
    try:
        analysis = resume_service.get_resume_analysis(resume_id)
        
        if analysis:
            return jsonify({
                'success': True,
                'analysis': analysis.to_dict()
            })
        else:
            return jsonify({'error': 'No analysis found for this resume'}), 404
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
