# PDF Editor Backend API

A comprehensive Flask-based REST API for PDF editing, conversion, and AI-powered resume analysis.

## Features

### PDF Processing
- Upload and process PDF files
- Extract text elements with formatting
- Edit text content in real-time
- Search and replace functionality
- OCR text extraction from images
- PDF to Word conversion
- Word to PDF conversion
- Image to PDF conversion

### Resume Management
- Upload and manage resumes
- AI-powered resume analysis
- Resume scoring and suggestions
- ATS compatibility checking
- Keyword optimization
- Export in multiple formats

### File Handling
- Support for multiple file types (PDF, DOCX, Python, Jupyter, Images)
- File validation and security
- Temporary file management
- File conversion utilities

### AI Integration
- Resume analysis using machine learning
- Text processing and keyword extraction
- ATS optimization suggestions
- Content improvement recommendations

## Installation

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Install system dependencies:**
   ```bash
   # Ubuntu/Debian
   sudo apt-get update
   sudo apt-get install tesseract-ocr poppler-utils
   
   # macOS
   brew install tesseract poppler
   
   # Windows
   # Download and install Tesseract OCR and Poppler
   ```

3. **Set up environment variables:**
   ```bash
   export MONGODB_URI="mongodb://localhost:27017/pdf_editor"
   export SECRET_KEY="your-secret-key-here"
   export OPENAI_API_KEY="your-openai-key"  # Optional
   export HUGGINGFACE_API_KEY="your-huggingface-key"  # Optional
   ```

4. **Start MongoDB:**
   ```bash
   mongod
   ```

## Running the Application

### Development Mode
```bash
python run.py
```

### Production Mode
```bash
export FLASK_ENV=production
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### PDF Operations
- `POST /api/pdf/upload` - Upload PDF file
- `GET /api/pdf/info` - Get PDF information
- `GET /api/pdf/page/<page_num>` - Get specific page
- `POST /api/pdf/update-text` - Update text element
- `POST /api/pdf/search-replace` - Search and replace text
- `GET /api/pdf/ocr` - Extract text from images
- `GET /api/pdf/save` - Download edited PDF

### Resume Management
- `POST /api/resume/save` - Save resume
- `GET /api/resume/list` - List user resumes
- `GET /api/resume/<id>` - Get specific resume
- `PUT /api/resume/<id>` - Update resume
- `DELETE /api/resume/<id>` - Delete resume
- `POST /api/resume/analyze` - Analyze resume
- `POST /api/resume/suggestions` - Get improvement suggestions

### File Operations
- `POST /api/file/upload` - Upload any supported file
- `POST /api/file/python/view` - View Python file
- `POST /api/file/jupyter/view` - View Jupyter notebook
- `POST /api/file/convert/word-to-pdf` - Convert Word to PDF
- `POST /api/file/convert/images-to-pdf` - Convert images to PDF

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/verify-token` - Verify token
- `GET /api/auth/profile` - Get user profile

## Project Structure

```
backend/
├── app.py                 # Main Flask application
├── run.py                 # Development server script
├── requirements.txt       # Python dependencies
├── config/               # Configuration modules
│   └── __init__.py
├── models/               # Data models
│   ├── __init__.py
│   ├── pdf_models.py
│   ├── resume_models.py
│   └── user_models.py
├── services/             # Business logic services
│   ├── __init__.py
│   ├── pdf_service.py
│   ├── resume_service.py
│   ├── ai_service.py
│   └── file_service.py
├── routes/               # API route handlers
│   ├── __init__.py
│   ├── pdf_routes.py
│   ├── resume_routes.py
│   ├── file_routes.py
│   └── auth_routes.py
├── utils/                # Utility modules
│   ├── __init__.py
│   ├── file_utils.py
│   ├── security.py
│   ├── ai_utils.py
│   └── database.py
├── uploads/              # File upload directory
├── temp/                 # Temporary files directory
└── output/               # Output files directory
```

## Configuration

The application uses environment-based configuration:

- `FLASK_ENV`: Environment (development, production, testing)
- `MONGODB_URI`: MongoDB connection string
- `SECRET_KEY`: Flask secret key
- `OPENAI_API_KEY`: OpenAI API key for enhanced AI features
- `HUGGINGFACE_API_KEY`: Hugging Face API key
- `TESSERACT_CMD`: Path to Tesseract OCR executable

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input sanitization
- File type validation
- File size limits
- CORS configuration
- CSRF protection

## Database

The application uses MongoDB with the following collections:

- `users`: User accounts and profiles
- `resumes`: Resume data and metadata
- `pdf_documents`: PDF document information
- `resume_analyses`: AI analysis results

## Error Handling

The API includes comprehensive error handling:

- Input validation
- File processing errors
- Database connection errors
- Authentication errors
- Rate limiting (can be added)

## Testing

Run tests with:
```bash
pytest
```

## Deployment

### Docker
```bash
docker build -t pdf-editor-api .
docker run -p 5000:5000 pdf-editor-api
```

### Production
- Use a production WSGI server like Gunicorn or Waitress
- Set up reverse proxy with Nginx
- Configure SSL/TLS
- Set up monitoring and logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.
