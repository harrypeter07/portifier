# 🚀 Portifier - AI-Powered Portfolio Builder

**Transform your resume into stunning, professional portfolios with AI-powered automation. No design skills required.**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](#)
[![Next.js](https://img.shields.io/badge/Next.js-14-blue?logo=next.js)](https://nextjs.org/)
[![Made with Zustand](https://img.shields.io/badge/State-Zustand-29b6f6)](https://github.com/pmndrs/zustand)
[![AI Powered](https://img.shields.io/badge/AI-Gemini-orange)](https://ai.google.dev/)

---

## 📑 Table of Contents

- [Quick Start Guide](#-quick-start-guide)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Development](#-development)
- [Backend API](#-backend-api)
- [Template System](#-template-system)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.11+ (for backend)
- MongoDB (local or Atlas)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/harrypeter07/portfolio.git
cd portfolio
```

### 2. Install Dependencies
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend
pip install -r requirements.txt
cd ..
```

### 3. Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your actual values
# See Environment Setup section for details
```

### 4. Start Development Servers
```bash
# Terminal 1: Start frontend (Next.js)
npm run dev

# Terminal 2: Start backend (Flask)
cd backend
python run.py
```

### 5. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## ✨ Features

### 🎨 Portfolio Creation
- **AI-Powered Resume Parsing**: Upload your resume and let AI extract all information
- **Multiple Templates**: Choose from various professional portfolio templates
- **Real-time Preview**: See changes instantly as you edit
- **Customizable Sections**: Hero, About, Experience, Education, Skills, Projects
- **Responsive Design**: Works perfectly on all devices

### 🤖 AI Integration
- **Gemini AI**: Smart content suggestions and optimization
- **Resume Analysis**: Get insights and improvement suggestions
- **ATS Optimization**: Ensure your portfolio passes ATS systems
- **Content Enhancement**: AI-powered writing assistance

### 📄 PDF Processing
- **PDF Upload & Parsing**: Extract text and formatting from PDFs
- **Real-time Editing**: Edit PDF content directly in the browser
- **Search & Replace**: Find and replace text across documents
- **OCR Support**: Extract text from images and scanned documents
- **Multiple Formats**: Support for PDF, DOCX, Python, Jupyter files

### 🔐 User Management
- **Authentication**: Secure user registration and login
- **Profile Management**: Manage your account and preferences
- **Portfolio Storage**: Save and manage multiple portfolios
- **Export Options**: Download portfolios in various formats

---

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management
- **Radix UI** - Component library

### Backend
- **Flask** - Python web framework
- **MongoDB** - Database
- **PyMongo** - MongoDB driver
- **JWT** - Authentication
- **Flask-CORS** - Cross-origin requests
- **PyPDF2** - PDF processing
- **Tesseract OCR** - Text extraction

### AI & ML
- **Google Gemini** - AI content generation
- **OpenAI API** - Optional AI features
- **Hugging Face** - ML models

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **MongoDB Atlas** - Cloud database

---

## ⚙️ Installation

### System Requirements
- Node.js 18.0 or later
- Python 3.11 or later
- MongoDB 4.4 or later
- Git

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

### Backend Setup
```bash
# Install Python dependencies
cd backend
pip install -r requirements.txt

# Install system dependencies (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install tesseract-ocr poppler-utils

# Start development server
python run.py
```

---

## 🔧 Environment Setup

### Required Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/...

# Authentication
JWT_SECRET=your-jwt-secret-key
SECRET_KEY=your-secret-key

# Application URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000

# AI Services
GEMINI_API_KEY=your-gemini-api-key

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CONTACT_EMAIL=your-contact-email@gmail.com
BUG_REPORT_EMAIL=your-bug-report-email@gmail.com
```

### Backend Environment

Create a `backend/.env` file:

```bash
# Flask Configuration
FLASK_ENV=development
SECRET_KEY=your-secret-key
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/...

# AI Services (Optional)
OPENAI_API_KEY=your-openai-key
HUGGINGFACE_API_KEY=your-huggingface-key

# OCR Configuration
TESSERACT_CMD=/usr/bin/tesseract

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

---

## 💻 Development

### Project Structure
```
portfolio/
├── src/                    # Frontend source code
│   ├── app/               # Next.js App Router pages
│   ├── components/        # React components
│   ├── lib/              # Utility libraries
│   ├── hooks/            # Custom React hooks
│   └── styles/           # Global styles
├── backend/              # Flask backend
│   ├── app.py           # Main Flask application
│   ├── routes/          # API route handlers
│   ├── services/        # Business logic
│   ├── models/          # Data models
│   └── utils/           # Utility functions
├── public/              # Static assets
└── docs/               # Documentation
```

### Available Scripts

#### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

#### Backend
```bash
python run.py        # Start development server
python app.py        # Start production server
```

### Development Workflow

1. **Start both servers** (frontend and backend)
2. **Make changes** to frontend or backend code
3. **Hot reload** will automatically update the application
4. **Test features** in the browser
5. **Check console** for any errors or warnings

---

## 🔌 Backend API

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Portfolio Management
- `GET /api/portfolio/list` - List user portfolios
- `POST /api/portfolio/create` - Create new portfolio
- `GET /api/portfolio/:id` - Get portfolio by ID
- `PUT /api/portfolio/:id` - Update portfolio
- `DELETE /api/portfolio/:id` - Delete portfolio

### Resume Processing
- `POST /api/resume/upload` - Upload resume file
- `POST /api/resume/parse` - Parse resume content
- `POST /api/resume/analyze` - Analyze resume with AI
- `GET /api/resume/suggestions` - Get improvement suggestions

### PDF Operations
- `POST /api/pdf/upload` - Upload PDF file
- `GET /api/pdf/info` - Get PDF information
- `POST /api/pdf/update-text` - Update text content
- `POST /api/pdf/search-replace` - Search and replace text
- `GET /api/pdf/save` - Download edited PDF

### File Operations
- `POST /api/file/upload` - Upload any supported file
- `POST /api/file/convert` - Convert between file formats
- `GET /api/file/download/:id` - Download file

### AI Services
- `POST /api/ai/generate` - Generate content with AI
- `POST /api/ai/optimize` - Optimize content for ATS
- `POST /api/ai/suggest` - Get content suggestions

---

## 🎨 Template System

### Template Types

#### Component-Based Templates
- Individual sections rendered with selected components
- Customizable layout and styling
- Real-time preview updates

#### Full-Page Templates
- Complete portfolio pages as single components
- Pre-designed layouts
- Professional styling

### Available Templates

1. **Modern Portfolio** - Clean, professional design
2. **Animated Portfolio** - Interactive animations
3. **Creative Portfolio** - Artistic and unique
4. **Minimal Portfolio** - Simple and elegant
5. **Corporate Portfolio** - Business-focused

### Creating Custom Templates

1. **Create template directory**:
   ```
   src/components/FullTemplates/YourTemplate/
   ├── components/
   ├── pages/
   ├── styles/
   └── index.js
   ```

2. **Create main entry point**:
   ```javascript
   // src/components/FullTemplates/YourTemplate/index.js
   export { default } from './pages/YourMainPage';
   ```

3. **Register template** in `src/data/templates/templateManager.js`

---

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Connect GitHub repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy automatically** on push to main branch

### Backend Deployment (Render)

#### Option 1: Using render.yaml (Recommended)
1. **Push code** to GitHub
2. **Connect repository** to Render
3. **Render automatically** detects render.yaml
4. **Set environment variables** in Render dashboard

#### Option 2: Manual Setup
1. **Create MongoDB database** in Render
2. **Create web service** for backend
3. **Configure build and start commands**
4. **Set environment variables**

### Environment Variables for Production

```bash
# Frontend (.env.local)
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com

# Backend (Render Environment)
FLASK_ENV=production
MONGODB_URI=mongodb+srv://...
CORS_ORIGINS=https://your-domain.vercel.app
```

---

## 🤝 Contributing

### Getting Started
1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes** and test thoroughly
4. **Commit changes**: `git commit -m 'Add amazing feature'`
5. **Push to branch**: `git push origin feature/amazing-feature`
6. **Open Pull Request**

### Development Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure all tests pass
- Follow conventional commit messages

### Code Style
- **Frontend**: ESLint + Prettier
- **Backend**: PEP 8 Python style
- **Commits**: Conventional Commits format

---

## 🐛 Troubleshooting

### Common Issues

#### Frontend Issues
- **Build errors**: Check Node.js version (18+)
- **Module not found**: Run `npm install`
- **API connection**: Verify backend is running
- **Environment variables**: Check .env.local file

#### Backend Issues
- **Database connection**: Verify MongoDB URI
- **Python dependencies**: Run `pip install -r requirements.txt`
- **OCR errors**: Install Tesseract OCR
- **CORS errors**: Check CORS_ORIGINS setting

#### AI Features
- **Gemini API errors**: Verify API key and quota
- **Content generation fails**: Check internet connection
- **Rate limiting**: Wait and retry

### Debug Mode

Enable debug logging:
```bash
# Frontend
NEXT_PUBLIC_DEBUG=true

# Backend
LOG_LEVEL=DEBUG
```

### Getting Help

1. **Check logs** in browser console and terminal
2. **Review documentation** in this README
3. **Search issues** on GitHub
4. **Create new issue** with detailed description

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Hassan Mansuri**
- Email: hassanmansuri570@gmail.com
- GitHub: [@harrypeter07](https://github.com/harrypeter07)
- LinkedIn: [Hassan Mansuri](https://www.linkedin.com/in/hassanmansurii/)

---

## 🙏 Acknowledgments

- **Next.js Team** for the amazing React framework
- **Vercel** for hosting and deployment
- **Google** for Gemini AI integration
- **MongoDB** for database services
- **All Contributors** who help improve this project

---

## 📊 Project Status

- ✅ **Core Features**: Complete
- ✅ **AI Integration**: Active
- ✅ **PDF Processing**: Working
- ✅ **Template System**: Functional
- ✅ **User Authentication**: Implemented
- 🔄 **Performance Optimization**: Ongoing
- 🔄 **Additional Templates**: In Progress

---

**Made with ❤️ by Hassan Mansuri**

*Transform your resume into a stunning portfolio in minutes, not hours!*
