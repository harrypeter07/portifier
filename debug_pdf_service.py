#!/usr/bin/env python3
"""
Debug PDF service to identify the issue
"""
import sys
import os
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend'))

from services.pdf_service import PDFService
from utils.file_utils import FileHandler

def test_pdf_service():
    """Test PDF service functionality"""
    print("Testing PDF service...")
    
    # Initialize services
    file_handler = FileHandler('uploads', 'temp')
    pdf_service = PDFService(file_handler)
    
    # Check if there are any PDF files
    pdf_dir = 'uploads/pdfs'
    if not os.path.exists(pdf_dir):
        print("PDF directory doesn't exist!")
        return
    
    pdf_files = [f for f in os.listdir(pdf_dir) if f.endswith('.pdf')]
    print(f"Found {len(pdf_files)} PDF files:")
    for f in pdf_files:
        print(f"  - {f}")
    
    if not pdf_files:
        print("No PDF files found!")
        return
    
    # Test loading the first PDF
    test_file = os.path.join(pdf_dir, pdf_files[0])
    print(f"\nTesting with file: {test_file}")
    
    try:
        # Test file loading
        success = pdf_service.load_pdf(test_file)
        print(f"Load PDF result: {success}")
        
        if success:
            # Test document info
            doc_info = pdf_service.get_document_info()
            print(f"Document info: {doc_info}")
            
            # Test page image
            page_image = pdf_service.get_page_image(0)
            if page_image:
                print(f"Page image length: {len(page_image)}")
            else:
                print("Failed to get page image")
                
            # Test page elements
            page_elements = pdf_service.get_page_elements(0)
            print(f"Page elements: {page_elements}")
        else:
            print("Failed to load PDF")
            
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_pdf_service()
