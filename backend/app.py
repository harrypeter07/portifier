#!/usr/bin/env python3
"""
PDF Editor Service - Flask API
A comprehensive REST API for PDF editing, conversion, and analysis
"""

import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from config import config
from utils.database import init_database, get_database

# Initialize database first
db_manager = init_database(
    config['default'].MONGODB_URI,
    'pdf_editor_db'
)

from routes import pdf_bp, resume_bp, file_bp, auth_bp

def create_app(config_name='default'):
    """Create and configure the Flask application"""
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Initialize CORS
    CORS(app, origins=app.config['CORS_ORIGINS'])
    
    # Connect to database
    print("🚀 Initializing database connection...")
    if not db_manager.connect():
        print("⚠️ Warning: Database connection failed")
    else:
        print("🎯 Database connected successfully, creating indexes...")
        # Create indexes
        db_manager.create_indexes()
    
    # Register blueprints
    app.register_blueprint(pdf_bp)
    app.register_blueprint(resume_bp)
    app.register_blueprint(file_bp)
    app.register_blueprint(auth_bp)
    
    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        """Health check endpoint"""
        try:
            db_stats = get_database().get_stats()
            return jsonify({
                'status': 'healthy',
                'message': 'PDF Editor API is running',
                'timestamp': datetime.now().isoformat(),
                'database': db_stats
            })
        except Exception as e:
                return jsonify({
                'status': 'unhealthy',
                'message': 'PDF Editor API is running but database connection failed',
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }), 500
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Endpoint not found'}), 404
    
    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({'error': 'Method not allowed'}), 405
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    @app.errorhandler(413)
    def file_too_large(error):
        return jsonify({'error': 'File too large'}), 413
    
    # Request logging middleware
    @app.before_request
    def log_request():
        if request.endpoint and request.endpoint != 'static':
            print(f"[{datetime.now().isoformat()}] {request.method} {request.path}")
    
    # Cleanup middleware
    @app.after_request
    def cleanup(response):
        # Add cleanup logic here if needed
        return response
    
    return app

def main():
    """Main function to run the application"""
    # Get configuration from environment
    config_name = os.environ.get('FLASK_ENV', 'development')
    
    # Create app
    app = create_app(config_name)
    
    # Get port from environment or use default
    port = int(os.environ.get('PORT', 5000))
    
    # Run the application
    if config_name == 'production':
        # Use waitress for production
        from waitress import serve
        print(f"Starting production server on port {port}")
        serve(app, host='0.0.0.0', port=port)
    else:
        # Use Flask development server
        print(f"Starting development server on port {port}")
        app.run(host='0.0.0.0', port=port, debug=True)

if __name__ == '__main__':
    main()