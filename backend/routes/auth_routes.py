"""
Authentication API routes
"""
from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta

from utils.security import SecurityManager
from utils.database import get_database

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# Initialize security manager
security_manager = SecurityManager('your-secret-key-here')  # In production, use environment variable

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.json
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if not all([username, email, password]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Validate email format
        if not security_manager.validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Validate password strength
        password_validation = security_manager.validate_password_strength(password)
        if not password_validation['is_valid']:
            return jsonify({
                'error': 'Password does not meet requirements',
                'issues': password_validation['issues']
            }), 400
        
        # Hash password
        password_hash = security_manager.hash_password(password)
        
        # Check if user already exists
        db = get_database()
        users_collection = db.get_collection('users')
        
        existing_user = users_collection.find_one({
            '$or': [
                {'username': username},
                {'email': email}
            ]
        })
        
        if existing_user:
            return jsonify({'error': 'Username or email already exists'}), 409
        
        # Create new user
        user_data = {
            'user_id': str(uuid.uuid4()),
            'username': username,
            'email': email,
            'password_hash': password_hash,
            'is_active': True,
            'is_verified': False,
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat(),
            'preferences': {}
        }
        
        users_collection.insert_one(user_data)
        
        # Generate session token
        session_token = security_manager.generate_session_token(user_data['user_id'])
        
        return jsonify({
            'success': True,
            'message': 'User registered successfully',
            'user': {
                'user_id': user_data['user_id'],
                'username': user_data['username'],
                'email': user_data['email']
            },
            'token': session_token
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.json
        username_or_email = data.get('username_or_email')
        password = data.get('password')
        
        if not all([username_or_email, password]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Find user
        db = get_database()
        users_collection = db.get_collection('users')
        
        user = users_collection.find_one({
            '$or': [
                {'username': username_or_email},
                {'email': username_or_email}
            ]
        })
        
        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Verify password
        if not security_manager.verify_password(password, user['password_hash']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Check if user is active
        if not user.get('is_active', True):
            return jsonify({'error': 'Account is deactivated'}), 401
        
        # Update last login
        users_collection.update_one(
            {'user_id': user['user_id']},
            {'$set': {'last_login': datetime.now().isoformat()}}
        )
        
        # Generate session token
        session_token = security_manager.generate_session_token(user['user_id'])
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': {
                'user_id': user['user_id'],
                'username': user['username'],
                'email': user['email']
            },
            'token': session_token
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Logout user"""
    try:
        # In a real implementation, you would invalidate the token
        # For now, just return success
        return jsonify({
            'success': True,
            'message': 'Logout successful'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/verify-token', methods=['POST'])
def verify_token():
    """Verify authentication token"""
    try:
        data = request.json
        token = data.get('token')
        
        if not token:
            return jsonify({'error': 'Token required'}), 400
        
        # Verify token
        payload = security_manager.verify_session_token(token)
        
        if payload:
            return jsonify({
                'success': True,
                'valid': True,
                'user_id': payload.get('user_id')
            })
        else:
            return jsonify({
                'success': True,
                'valid': False
            })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/refresh-token', methods=['POST'])
def refresh_token():
    """Refresh authentication token"""
    try:
        data = request.json
        token = data.get('token')
        
        if not token:
            return jsonify({'error': 'Token required'}), 400
        
        # Verify current token
        payload = security_manager.verify_session_token(token)
        
        if payload:
            # Generate new token
            new_token = security_manager.generate_session_token(payload['user_id'])
            
            return jsonify({
                'success': True,
                'token': new_token
            })
        else:
            return jsonify({'error': 'Invalid token'}), 401
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/change-password', methods=['POST'])
def change_password():
    """Change user password"""
    try:
        data = request.json
        token = data.get('token')
        current_password = data.get('current_password')
        new_password = data.get('new_password')
        
        if not all([token, current_password, new_password]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Verify token
        payload = security_manager.verify_session_token(token)
        if not payload:
            return jsonify({'error': 'Invalid token'}), 401
        
        user_id = payload['user_id']
        
        # Get user
        db = get_database()
        users_collection = db.get_collection('users')
        user = users_collection.find_one({'user_id': user_id})
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Verify current password
        if not security_manager.verify_password(current_password, user['password_hash']):
            return jsonify({'error': 'Current password is incorrect'}), 401
        
        # Validate new password
        password_validation = security_manager.validate_password_strength(new_password)
        if not password_validation['is_valid']:
            return jsonify({
                'error': 'New password does not meet requirements',
                'issues': password_validation['issues']
            }), 400
        
        # Hash new password
        new_password_hash = security_manager.hash_password(new_password)
        
        # Update password
        users_collection.update_one(
            {'user_id': user_id},
            {'$set': {
                'password_hash': new_password_hash,
                'updated_at': datetime.now().isoformat()
            }}
        )
        
        return jsonify({
            'success': True,
            'message': 'Password changed successfully'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
def get_profile():
    """Get user profile"""
    try:
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        
        if not token:
            return jsonify({'error': 'Token required'}), 401
        
        # Verify token
        payload = security_manager.verify_session_token(token)
        if not payload:
            return jsonify({'error': 'Invalid token'}), 401
        
        user_id = payload['user_id']
        
        # Get user
        db = get_database()
        users_collection = db.get_collection('users')
        user = users_collection.find_one({'user_id': user_id})
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'success': True,
            'user': {
                'user_id': user['user_id'],
                'username': user['username'],
                'email': user['email'],
                'first_name': user.get('first_name'),
                'last_name': user.get('last_name'),
                'created_at': user['created_at'],
                'preferences': user.get('preferences', {})
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/profile', methods=['PUT'])
def update_profile():
    """Update user profile"""
    try:
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        data = request.json
        
        if not token:
            return jsonify({'error': 'Token required'}), 401
        
        # Verify token
        payload = security_manager.verify_session_token(token)
        if not payload:
            return jsonify({'error': 'Invalid token'}), 401
        
        user_id = payload['user_id']
        
        # Sanitize input data
        update_data = {}
        for key, value in data.items():
            if key in ['first_name', 'last_name', 'preferences']:
                if isinstance(value, str):
                    update_data[key] = security_manager.sanitize_input(value)
                else:
                    update_data[key] = value
        
        if not update_data:
            return jsonify({'error': 'No valid fields to update'}), 400
        
        # Update user
        db = get_database()
        users_collection = db.get_collection('users')
        
        update_data['updated_at'] = datetime.now().isoformat()
        
        result = users_collection.update_one(
            {'user_id': user_id},
            {'$set': update_data}
        )
        
        if result.modified_count > 0:
            return jsonify({
                'success': True,
                'message': 'Profile updated successfully'
            })
        else:
            return jsonify({'error': 'Failed to update profile'}), 500
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
