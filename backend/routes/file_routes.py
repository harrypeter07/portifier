"""
File handling API routes
"""
from flask import Blueprint, request, jsonify, send_file
import os

from ..services.file_service import FileService
from ..utils.file_utils import FileHandler, FileValidator

file_bp = Blueprint('file', __name__, url_prefix='/api/file')

# Initialize services
file_handler = FileHandler('uploads', 'temp')
file_service = FileService(file_handler)

@file_bp.route('/upload', methods=['POST'])
def upload_file():
    """Upload and process any supported file type"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Get file type
        file_type = FileValidator.get_file_type(file.filename)
        if not file_type:
            return jsonify({'error': 'Unsupported file type'}), 400
        
        # Validate file size
        file.seek(0, 2)  # Seek to end
        file_size = file.tell()
        file.seek(0)  # Reset to beginning
        
        if not FileValidator.validate_file_size(file_size, file_type):
            return jsonify({'error': 'File too large'}), 400
        
        # Process file
        result = file_service.process_uploaded_file(file, file_type)
        
        if 'error' in result:
            return jsonify(result), 500
        
        return jsonify({
            'success': True,
            'file_type': file_type,
            'result': result
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@file_bp.route('/python/view', methods=['POST'])
def view_python_file():
    """View Python file with syntax highlighting"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if not file.filename.lower().endswith('.py'):
            return jsonify({'error': 'Invalid file type'}), 400
        
        result = file_service.process_uploaded_file(file, 'python')
        
        if 'error' in result:
            return jsonify(result), 500
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@file_bp.route('/jupyter/view', methods=['POST'])
def view_jupyter_notebook():
    """View Jupyter notebook"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if not file.filename.lower().endswith('.ipynb'):
            return jsonify({'error': 'Invalid file type'}), 400
        
        result = file_service.process_uploaded_file(file, 'jupyter')
        
        if 'error' in result:
            return jsonify(result), 500
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@file_bp.route('/convert/word-to-pdf', methods=['POST'])
def convert_word_to_pdf():
    """Convert Word document to PDF"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if not file.filename.lower().endswith('.docx'):
            return jsonify({'error': 'Invalid file type'}), 400
        
        # Save uploaded file
        file_path = file_handler.save_file(file, file.filename, 'temp')
        
        # Convert to PDF
        output_path = file_service.convert_word_to_pdf(file_path)
        
        if output_path:
            return send_file(output_path, as_attachment=True, download_name='converted_from_word.pdf')
        else:
            return jsonify({'error': 'Failed to convert Word to PDF'}), 500
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@file_bp.route('/convert/images-to-pdf', methods=['POST'])
def convert_images_to_pdf():
    """Convert multiple images to PDF"""
    try:
        if 'images' not in request.files:
            return jsonify({'error': 'No images provided'}), 400
        
        files = request.files.getlist('images')
        if not files:
            return jsonify({'error': 'No images selected'}), 400
        
        # Validate all files are images
        image_paths = []
        for file in files:
            if file.filename:
                file_type = FileValidator.get_file_type(file.filename)
                if file_type != 'image':
                    return jsonify({'error': f'Invalid file type: {file.filename}'}), 400
                
                file_path = file_handler.save_file(file, file.filename, 'temp')
                image_paths.append(file_path)
        
        # Convert to PDF
        output_path = file_service.convert_images_to_pdf(image_paths)
        
        if output_path:
            return send_file(output_path, as_attachment=True, download_name='images_to_pdf.pdf')
        else:
            return jsonify({'error': 'Failed to convert images to PDF'}), 500
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@file_bp.route('/preview', methods=['POST'])
def get_file_preview():
    """Get file preview information"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if not file.filename:
            return jsonify({'error': 'No file selected'}), 400
        
        # Save file temporarily
        file_path = file_handler.save_file(file, file.filename, 'temp')
        
        try:
            # Get file type
            file_type = FileValidator.get_file_type(file.filename)
            
            # Get preview
            preview = file_service.get_file_preview(file_path, file_type)
            
            return jsonify({
                'success': True,
                'preview': preview
            })
            
        finally:
            # Clean up temporary file
            file_handler.delete_file(file_path)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@file_bp.route('/cleanup', methods=['POST'])
def cleanup_temp_files():
    """Clean up temporary files"""
    try:
        cleaned_count = file_service.cleanup_temp_files()
        
        return jsonify({
            'success': True,
            'cleaned_files': cleaned_count,
            'message': f'Cleaned up {cleaned_count} temporary files'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@file_bp.route('/validate', methods=['POST'])
def validate_file():
    """Validate file type and content"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if not file.filename:
            return jsonify({'error': 'No file selected'}), 400
        
        # Save file temporarily
        file_path = file_handler.save_file(file, file.filename, 'temp')
        
        try:
            # Get file type
            file_type = FileValidator.get_file_type(file.filename)
            
            # Validate file type
            is_valid_type = FileValidator.validate_file_type(file.filename)
            
            # Validate file size
            file_size = os.path.getsize(file_path)
            is_valid_size = FileValidator.validate_file_size(file_size, file_type)
            
            # Validate file content
            is_valid_content = FileValidator.validate_file_content(file_path, file_type)
            
            # Get file info
            file_info = file_handler.get_file_info(file_path)
            
            return jsonify({
                'success': True,
                'validation': {
                    'file_type': file_type,
                    'is_valid_type': is_valid_type,
                    'is_valid_size': is_valid_size,
                    'is_valid_content': is_valid_content,
                    'file_size': file_size,
                    'file_info': file_info
                }
            })
            
        finally:
            # Clean up temporary file
            file_handler.delete_file(file_path)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
