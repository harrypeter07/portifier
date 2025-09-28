#!/usr/bin/env python3
"""
Startup script for the PDF Editor API
"""

import os
import sys
from app import create_app

def main():
    """Main function to run the application"""
    # Set environment variables
    os.environ.setdefault('FLASK_ENV', 'development')
    os.environ.setdefault('PORT', '5000')
    
    # Create app
    app = create_app('development')
    
    # Get port
    port = int(os.environ.get('PORT', 5000))
    
    print("=" * 60)
    print("PDF Editor API Server")
    print("=" * 60)
    print(f"Environment: {os.environ.get('FLASK_ENV', 'development')}")
    print(f"Port: {port}")
    print(f"Debug: {app.debug}")
    print("=" * 60)
    
    # Run the application
    app.run(host='0.0.0.0', port=port, debug=True)

if __name__ == '__main__':
    main()
