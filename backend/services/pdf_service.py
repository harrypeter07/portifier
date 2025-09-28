"""
PDF processing service
"""
import fitz  # PyMuPDF
import base64
import io
import os
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
import uuid
from PIL import Image
import pytesseract
import cv2
import numpy as np

from models.pdf_models import TextElement, ImageElement, PDFDocument
from utils.file_utils import FileHandler, FileValidator
from services.pdf_storage_service import PDFStorageService

class PDFService:
    """Service for PDF processing operations"""
    
    def __init__(self, file_handler: FileHandler):
        self.file_handler = file_handler
        self.current_document: Optional[PDFDocument] = None
        self.storage_service = None  # Initialize lazily
    
    def _get_storage_service(self):
        """Get storage service instance (lazy initialization)"""
        if self.storage_service is None:
            self.storage_service = PDFStorageService()
        return self.storage_service
    
    def load_pdf_from_bytes(self, file_data: bytes, filename: str) -> bool:
        """Load and process a PDF from bytes data"""
        try:
            print(f"📖 Loading PDF from bytes: {filename}")
            
            # Create a temporary file-like object
            import io
            file_obj = io.BytesIO(file_data)
            
            # Open PDF document from bytes
            pdf_doc = fitz.open(stream=file_data, filetype="pdf")
            
            # Extract elements
            text_elements = self._extract_text_elements(pdf_doc)
            images = self._extract_images(pdf_doc)
            fonts = self._extract_fonts(text_elements)
            colors = self._extract_colors(text_elements)
            
            # Create PDF document model
            self.current_document = PDFDocument(
                document_id=str(uuid.uuid4()),
                filename=filename,
                file_path=f"mongodb://{filename}",  # Placeholder for MongoDB storage
                file_size=len(file_data),
                page_count=len(pdf_doc),
                text_elements=text_elements,
                images=images,
                fonts=fonts,
                colors=colors,
                metadata=self._extract_metadata(pdf_doc),
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            
            pdf_doc.close()
            print(f"✅ PDF loaded from bytes successfully")
            return True
            
        except Exception as e:
            print(f"❌ Error loading PDF from bytes: {e}")
            return False
    
    def load_pdf_from_mongodb(self, document_id: str) -> bool:
        """Load and process a PDF from MongoDB"""
        try:
            print(f"📖 Loading PDF from MongoDB: {document_id}")
            
            # Retrieve PDF document from MongoDB
            storage_service = self._get_storage_service()
            pdf_document = storage_service.get_pdf_document(document_id)
            if not pdf_document:
                print(f"❌ Failed to retrieve PDF document from MongoDB")
                return False
            
            # Set as current document
            self.current_document = pdf_document
            print(f"✅ PDF loaded from MongoDB successfully")
            return True
            
        except Exception as e:
            print(f"❌ Error loading PDF from MongoDB: {e}")
            return False
    
    def load_pdf(self, file_path: str) -> bool:
        """Load and process a PDF file from local filesystem"""
        try:
            # Validate file
            if not FileValidator.validate_file_type(file_path):
                return False
            
            # Open PDF document
            pdf_doc = fitz.open(file_path)
            
            # Extract elements
            text_elements = self._extract_text_elements(pdf_doc)
            images = self._extract_images(pdf_doc)
            fonts = self._extract_fonts(text_elements)
            colors = self._extract_colors(text_elements)
            
            # Get file info
            file_info = self.file_handler.get_file_info(file_path)
            
            # Create PDF document model
            self.current_document = PDFDocument(
                document_id=str(uuid.uuid4()),
                filename=os.path.basename(file_path),
                file_path=file_path,
                file_size=file_info.get('size', 0),
                page_count=len(pdf_doc),
                text_elements=text_elements,
                images=images,
                fonts=fonts,
                colors=colors,
                metadata=self._extract_metadata(pdf_doc),
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            
            pdf_doc.close()
            return True
            
        except Exception as e:
            print(f"Error loading PDF: {e}")
            return False
    
    def _extract_text_elements(self, pdf_doc) -> List[TextElement]:
        """Extract all text elements from PDF"""
        text_elements = []
        
        for page_num in range(len(pdf_doc)):
            page = pdf_doc[page_num]
            blocks = page.get_text("dict")
            
            for block_num, block in enumerate(blocks["blocks"]):
                if "lines" not in block:
                    continue
                
                for line_num, line in enumerate(block["lines"]):
                    for word_num, word in enumerate(line["spans"]):
                        color = word.get("color", 0)
                        rgb_color = (
                            (color >> 16) & 255,
                            (color >> 8) & 255,
                            color & 255
                        )
                        
                        element_id = f"p{page_num}_b{block_num}_l{line_num}_w{word_num}"
                        
                        # Ensure bbox is a list, not a Rect object
                        bbox = word["bbox"]
                        if hasattr(bbox, '__iter__') and not isinstance(bbox, (str, bytes)):
                            bbox = list(bbox)
                        else:
                            bbox = [0, 0, 0, 0]  # fallback
                        
                        text_element = TextElement(
                            text=word["text"],
                            bbox=tuple(bbox),
                            font_name=word["font"],
                            font_size=word["size"],
                            font_flags=word["flags"],
                            color=rgb_color,
                            page_num=page_num,
                            block_num=block_num,
                            line_num=line_num,
                            word_num=word_num,
                            element_id=element_id
                        )
                        
                        text_elements.append(text_element)
        
        return text_elements
    
    def _extract_images(self, pdf_doc) -> List[ImageElement]:
        """Extract all images from PDF"""
        images = []
        
        for page_num in range(len(pdf_doc)):
            page = pdf_doc[page_num]
            image_list = page.get_images()
            
            for img_index, img in enumerate(image_list):
                xref = img[0]
                pix = fitz.Pixmap(pdf_doc, xref)
                
                if pix.n - pix.alpha < 4:  # GRAY or RGB
                    img_data = pix.tobytes("png")
                    img_b64 = base64.b64encode(img_data).decode()
                    
                    # Get image rectangle
                    rects = page.get_image_rects(xref)
                    bbox = rects[0] if rects else (0, 0, 100, 100)
                    
                    image_element = ImageElement(
                        image_id=f"img_{page_num}_{img_index}",
                        page=page_num,
                        bbox=bbox,
                        data=img_b64,
                        xref=xref,
                        width=pix.width,
                        height=pix.height
                    )
                    
                    images.append(image_element)
                
                pix = None
        
        return images
    
    def _extract_fonts(self, text_elements: List[TextElement]) -> List[str]:
        """Extract unique fonts from text elements"""
        fonts = set()
        
        for element in text_elements:
            font_info = f"{element.font_name} ({element.font_size}pt)"
            if element.font_flags & 2**4:  # Bold
                font_info += " Bold"
            if element.font_flags & 2**1:  # Italic
                font_info += " Italic"
            
            fonts.add(font_info)
        
        return list(fonts)
    
    def _extract_colors(self, text_elements: List[TextElement]) -> List[Dict[str, Any]]:
        """Extract unique colors from text elements"""
        colors = set()
        
        for element in text_elements:
            colors.add(element.color)
        
        return [{'rgb': color, 'hex': f"#{color[0]:02x}{color[1]:02x}{color[2]:02x}"} 
                for color in colors]
    
    def _extract_metadata(self, pdf_doc) -> Dict[str, Any]:
        """Extract PDF metadata"""
        metadata = pdf_doc.metadata
        return {
            'title': metadata.get('title', ''),
            'author': metadata.get('author', ''),
            'subject': metadata.get('subject', ''),
            'creator': metadata.get('creator', ''),
            'producer': metadata.get('producer', ''),
            'creation_date': metadata.get('creationDate', ''),
            'modification_date': metadata.get('modDate', '')
        }
    
    def get_page_image(self, page_num: int, zoom: float = 1.5) -> Optional[str]:
        """Get page as base64 encoded image"""
        if not self.current_document:
            return None
        
        try:
            pdf_doc = fitz.open(self.current_document.file_path)
            page = pdf_doc[page_num]
            mat = fitz.Matrix(zoom, zoom)
            pix = page.get_pixmap(matrix=mat)
            img_data = pix.tobytes("png")
            pdf_doc.close()
            return base64.b64encode(img_data).decode()
        except Exception as e:
            print(f"Error getting page image: {e}")
            return None
    
    def update_text_element(self, element_id: str, new_text: str, 
                          new_font_size: Optional[float] = None, 
                          new_color: Optional[Tuple[int, int, int]] = None) -> bool:
        """Update a text element in the PDF"""
        if not self.current_document:
            return False
        
        try:
            # Find the element
            element = None
            for el in self.current_document.text_elements:
                if el.element_id == element_id:
                    element = el
                    break
            
            if not element:
                return False
            
            # Get PDF data from MongoDB
            storage_service = self._get_storage_service()
            pdf_data = storage_service.retrieve_pdf(self.current_document.document_id)
            if not pdf_data:
                print("Failed to retrieve PDF data from MongoDB")
                return False
            
            # Open PDF from bytes
            pdf_doc = fitz.open(stream=pdf_data, filetype="pdf")
            page = pdf_doc[element.page_num]
            
            # Remove old text by drawing white rectangle
            rect = fitz.Rect(element.bbox)
            page.draw_rect(rect, color=(1, 1, 1), fill=(1, 1, 1))
            
            # Insert new text
            font_size = new_font_size if new_font_size else element.font_size
            color = new_color if new_color else element.color
            color_fitz = (color[0]/255, color[1]/255, color[2]/255)
            
            page.insert_text(
                (element.bbox[0], element.bbox[1] + font_size),
                new_text,
                fontsize=font_size,
                color=color_fitz,
                fontname=element.font_name
            )
            
            # Update element data in memory
            element.text = new_text
            if new_font_size:
                element.font_size = new_font_size
            if new_color:
                element.color = new_color
            
            # Save to temporary file
            import tempfile
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
            pdf_doc.save(temp_file.name)
            pdf_doc.close()
            
            # Read updated PDF data
            with open(temp_file.name, 'rb') as f:
                updated_pdf_data = f.read()
            
            # Update in MongoDB GridFS
            # For now, just update the document metadata
            storage_service.update_pdf_document(
                self.current_document.document_id,
                {'updated_at': datetime.now()}
            )
            
            # Clean up temp file
            os.unlink(temp_file.name)
            
            print(f"✅ Text element updated successfully: {element_id}")
            return True
            
        except Exception as e:
            print(f"❌ Error updating text: {e}")
            import traceback
            traceback.print_exc()
            return False
    
    def search_and_replace(self, search_term: str, replace_with: str) -> int:
        """Search and replace text across the document"""
        if not self.current_document:
            return 0
        
        replacements = 0
        
        for element in self.current_document.text_elements:
            if search_term in element.text:
                new_text = element.text.replace(search_term, replace_with)
                if self.update_text_element(element.element_id, new_text):
                    replacements += 1
        
        return replacements
    
    def extract_text_from_images(self) -> List[Dict[str, Any]]:
        """Extract text from images using OCR"""
        if not self.current_document:
            return []
        
        ocr_results = []
        
        for img in self.current_document.images:
            try:
                # Decode base64 image
                img_data = base64.b64decode(img.data)
                pil_img = Image.open(io.BytesIO(img_data))
                
                # Convert to numpy array for OCR
                img_array = np.array(pil_img)
                
                # Extract text using Tesseract
                text = pytesseract.image_to_string(img_array)
                
                ocr_results.append({
                    'image_id': img.image_id,
                    'page': img.page,
                    'bbox': img.bbox,
                    'extracted_text': text.strip()
                })
            except Exception as e:
                print(f"OCR error for image {img.image_id}: {e}")
                continue
        
        return ocr_results
    
    def save_pdf(self, output_path: str) -> bool:
        """Save the current PDF document"""
        if not self.current_document:
            return False
        
        try:
            # Copy current file to output path
            import shutil
            shutil.copy2(self.current_document.file_path, output_path)
            return True
        except Exception as e:
            print(f"Error saving PDF: {e}")
            return False
    
    def get_document_info(self) -> Optional[Dict[str, Any]]:
        """Get information about the current document"""
        if not self.current_document:
            return None
        
        return {
            'page_count': self.current_document.page_count,
            'pages': self.current_document.page_count,
            'fonts': self.current_document.fonts,
            'colors': self.current_document.colors,
            'text_elements_count': len(self.current_document.text_elements),
            'images_count': len(self.current_document.images),
            'metadata': self.current_document.metadata,
            'filename': self.current_document.filename,
            'file_size': self.current_document.file_size
        }
    
    def get_page_image(self, page_num: int, zoom: float = 1.0) -> Optional[str]:
        """Get a page rendered as a base64 image"""
        if not self.current_document:
            return None
        
        try:
            # Open the PDF file
            pdf_doc = fitz.open(self.current_document.file_path)
            
            if page_num >= pdf_doc.page_count:
                return None
            
            # Get the page
            page = pdf_doc[page_num]
            
            # Create transformation matrix for zoom
            mat = fitz.Matrix(zoom, zoom)
            
            # Render page to pixmap
            pix = page.get_pixmap(matrix=mat)
            
            # Convert to base64
            img_data = pix.tobytes("png")
            img_base64 = base64.b64encode(img_data).decode()
            
            pdf_doc.close()
            
            return f"data:image/png;base64,{img_base64}"
            
        except Exception as e:
            print(f"Error rendering page {page_num}: {e}")
            return None
    
    def get_page_elements(self, page_num: int) -> Dict[str, Any]:
        """Get all elements for a specific page"""
        if not self.current_document:
            return {}
        
        # Get text elements for this page
        page_elements = [el.to_dict() for el in self.current_document.text_elements 
                        if el.page_num == page_num]
        
        # Get images for this page
        page_images = [img.to_dict() for img in self.current_document.images 
                      if img.page == page_num]
        
        return {
            'text_elements': page_elements,
            'images': page_images,
            'page_num': page_num
        }
