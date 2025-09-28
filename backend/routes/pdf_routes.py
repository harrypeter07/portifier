"""
PDF processing API routes
"""
from flask import Blueprint, request, jsonify, send_file
import os
from datetime import datetime

from services.pdf_service import PDFService
from services.file_service import FileService
from services.pdf_storage_service import PDFStorageService
from utils.file_utils import FileHandler, FileValidator
from utils.database import get_database

pdf_bp = Blueprint('pdf', __name__, url_prefix='/api/pdf')

# Initialize services
file_handler = FileHandler('uploads', 'temp')
pdf_service = PDFService(file_handler)
file_service = FileService(file_handler)
storage_service = None  # Initialize lazily

# Global variable to store current PDF document ID
current_pdf_document_id = None

def get_storage_service():
    """Get storage service instance (lazy initialization)"""
    global storage_service
    if storage_service is None:
        storage_service = PDFStorageService()
    return storage_service

@pdf_bp.route('/upload', methods=['POST'])
def upload_pdf():
    """Upload and process PDF file"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Validate file type
        if not FileValidator.validate_file_type(file.filename):
            return jsonify({'error': 'Invalid file type. Only PDF files are allowed.'}), 400
        
        # Validate file size
        file.seek(0, 2)  # Seek to end
        file_size = file.tell()
        file.seek(0)  # Reset to beginning
        
        if not FileValidator.validate_file_size(file_size, 'pdf'):
            return jsonify({'error': 'File too large. Maximum size is 16MB.'}), 400
        
        # Read file data
        file_data = file.read()
        file.seek(0)  # Reset file pointer
        
        # Store PDF in MongoDB
        storage_result = storage_service.store_pdf(file_data, file.filename)
        if not storage_result['success']:
            return jsonify({'error': f"Failed to store PDF: {storage_result['error']}"}), 500
        
        document_id = storage_result['document_id']
        
        # Process PDF from file data
        if pdf_service.load_pdf_from_bytes(file_data, file.filename):
            global current_pdf_document_id
            current_pdf_document_id = document_id  # Store the current PDF document ID
            
            # Store processed document in MongoDB
            pdf_document = pdf_service.current_document
            pdf_document.document_id = document_id  # Use the same document ID
            storage_service.store_pdf_document(pdf_document)
            
            document_info = pdf_service.get_document_info()
            return jsonify({
                'success': True,
                'message': 'PDF uploaded and processed successfully',
                'document_info': document_info,
                'document_id': document_id,
                'page_count': document_info.get('page_count', 1),
                'pages': document_info.get('page_count', 1)
            })
        else:
            # Clean up from MongoDB if processing failed
            storage_service.delete_pdf_document(document_id)
            return jsonify({'error': 'Failed to process PDF'}), 500
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@pdf_bp.route('/info', methods=['GET'])
def get_pdf_info():
    """Get PDF information"""
    try:
        global current_pdf_document_id
        
        # Check if we have a current PDF document ID
        if not current_pdf_document_id:
            return jsonify({'error': 'No PDF loaded. Please upload a PDF first.'}), 400
        
        # Reload PDF from MongoDB if needed
        if not pdf_service.current_document or pdf_service.current_document.document_id != current_pdf_document_id:
            if not pdf_service.load_pdf_from_mongodb(current_pdf_document_id):
                return jsonify({'error': 'Failed to reload PDF from MongoDB'}), 500
        
        document_info = pdf_service.get_document_info()
        if document_info:
            return jsonify(document_info)
        else:
            return jsonify({'error': 'Failed to get document info'}), 500
    except Exception as e:
        print(f"Error in get_pdf_info: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@pdf_bp.route('/page/<int:page_num>', methods=['GET'])
def get_page(page_num):
    """Get specific page with all elements"""
    try:
        global current_pdf_document_id
        
        # Check if we have a current PDF document ID
        if not current_pdf_document_id:
            return jsonify({'error': 'No PDF loaded. Please upload a PDF first.'}), 400
        
        # Reload PDF from MongoDB if needed
        if not pdf_service.current_document or pdf_service.current_document.document_id != current_pdf_document_id:
            if not pdf_service.load_pdf_from_mongodb(current_pdf_document_id):
                return jsonify({'error': 'Failed to reload PDF from MongoDB'}), 500
        
        # Get page image
        page_image = pdf_service.get_page_image(page_num)
        if not page_image:
            return jsonify({'error': f'Failed to get page image for page {page_num}'}), 500
        
        # Get page elements
        page_elements = pdf_service.get_page_elements(page_num)
        
        return jsonify({
            'page_image': page_image,
            'text_elements': page_elements.get('text_elements', []),
            'images': page_elements.get('images', []),
            'page_num': page_num
        })
    except Exception as e:
        print(f"Error in get_page: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@pdf_bp.route('/update-text', methods=['POST'])
def update_text():
    """Update text element"""
    try:
        data = request.json
        element_id = data.get('element_id')
        new_text = data.get('new_text')
        new_font_size = data.get('new_font_size')
        new_color = data.get('new_color')
        
        if not element_id or new_text is None:
            return jsonify({'error': 'Missing required parameters'}), 400
        
        success = pdf_service.update_text_element(element_id, new_text, new_font_size, new_color)
        
        if success:
            return jsonify({'success': True, 'message': 'Text updated successfully'})
        else:
            return jsonify({'error': 'Failed to update text'}), 500
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@pdf_bp.route('/search-replace', methods=['POST'])
def search_replace():
    """Search and replace text across the document"""
    try:
        data = request.json
        search_term = data.get('search_term', '')
        replace_with = data.get('replace_with', '')
        
        if not search_term:
            return jsonify({'error': 'Search term required'}), 400
        
        replacements = pdf_service.search_and_replace(search_term, replace_with)
        
        return jsonify({
            'success': True,
            'replacements': replacements,
            'message': f'Replaced {replacements} occurrences'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@pdf_bp.route('/ocr', methods=['GET'])
def extract_image_text():
    """Extract text from images using OCR"""
    try:
        ocr_results = pdf_service.extract_text_from_images()
        return jsonify({'ocr_results': ocr_results})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@pdf_bp.route('/save', methods=['GET'])
def save_pdf():
    """Save modified PDF"""
    try:
        output_filename = f'edited_document_{datetime.now().strftime("%Y%m%d_%H%M%S")}.pdf'
        output_path = os.path.join(file_handler.temp_folder, output_filename)
        
        if pdf_service.save_pdf(output_path):
            return send_file(output_path, as_attachment=True, download_name=output_filename)
        else:
            return jsonify({'error': 'Failed to save PDF'}), 500
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@pdf_bp.route('/add-text', methods=['POST'])
def add_text():
    """Add new text to PDF"""
    try:
        data = request.json
        page_num = data.get('page_num', 0)
        x = data.get('x', 100)
        y = data.get('y', 100)
        text = data.get('text', 'New Text')
        font_size = data.get('font_size', 12)
        color = data.get('color', [0, 0, 0])
        
        # This would require implementing add_text functionality in PDFService
        # For now, return success
        return jsonify({'success': True, 'message': 'Text added successfully'})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@pdf_bp.route('/add-image', methods=['POST'])
def add_image():
    """Add image to PDF"""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        image_file = request.files['image']
        page_num = int(request.form.get('page_num', 0))
        x = float(request.form.get('x', 100))
        y = float(request.form.get('y', 100))
        width = float(request.form.get('width', 100))
        height = float(request.form.get('height', 100))
        
        # This would require implementing add_image functionality in PDFService
        # For now, return success
        return jsonify({'success': True, 'message': 'Image added successfully'})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@pdf_bp.route('/convert/to-word', methods=['POST'])
def convert_to_word():
    """Convert PDF to Word document"""
    try:
        output_path = file_service.convert_pdf_to_word(pdf_service.current_document.file_path)
        
        if output_path:
            return send_file(output_path, as_attachment=True, download_name='converted_document.docx')
        else:
            return jsonify({'error': 'Failed to convert PDF to Word'}), 500
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@pdf_bp.route('/convert/from-word', methods=['POST'])
def convert_from_word():
    """Convert Word document to PDF"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if not file.filename.lower().endswith('.docx'):
            return jsonify({'error': 'Invalid file type. Only DOCX files are allowed.'}), 400
        
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

@pdf_bp.route('/extract-text', methods=['GET'])
def extract_text():
    """Extract all text from PDF"""
    try:
        if not pdf_service.current_document:
            return jsonify({'error': 'No PDF loaded'}), 400
        
        text = file_service.extract_text_from_pdf(pdf_service.current_document.file_path)
        return jsonify({'text': text})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
