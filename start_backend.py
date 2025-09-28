#!/usr/bin/env python3
"""
Startup script for the PDF Editor Backend
"""

import os
import sys
import subprocess
from pathlib import Path

def check_dependencies():
    """Check if required dependencies are installed"""
    print("Checking dependencies...")
    
    try:
        import flask
        print("✅ Flask installed")
    except ImportError:
        print("❌ Flask not installed. Installing...")
        subprocess.run([sys.executable, "-m", "pip", "install", "flask"])
    
    try:
        import pymongo
        print("✅ PyMongo installed")
    except ImportError:
        print("❌ PyMongo not installed. Installing...")
        subprocess.run([sys.executable, "-m", "pip", "install", "pymongo"])
    
    try:
        import fitz
        print("✅ PyMuPDF installed")
    except ImportError:
        print("❌ PyMuPDF not installed. Installing...")
        subprocess.run([sys.executable, "-m", "pip", "install", "PyMuPDF"])

def setup_directories():
    """Create necessary directories"""
    print("Setting up directories...")
    
    directories = [
        'backend/uploads',
        'backend/temp',
        'backend/output'
    ]
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        print(f"✅ Created directory: {directory}")

def start_backend():
    """Start the backend server"""
    print("Starting backend server...")
    
    # Change to backend directory
    os.chdir('backend')
    
    # Set environment variables
    os.environ['FLASK_ENV'] = 'development'
    os.environ['PORT'] = '5000'
    
    # Start the server
    try:
        subprocess.run([sys.executable, "run.py"])
    except KeyboardInterrupt:
        print("\nShutting down server...")

def main():
    """Main function"""
    print("PDF Editor Backend Startup")
    print("=" * 40)
    
    # Check if we're in the right directory
    if not Path('backend').exists():
        print("❌ Backend directory not found. Please run this script from the project root.")
        return
    
    # Check dependencies
    check_dependencies()
    
    # Setup directories
    setup_directories()
    
    # Start backend
    start_backend()

if __name__ == '__main__':
    main()
