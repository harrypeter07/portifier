#!/usr/bin/env python3
"""
Test script for the PDF Editor API
"""

import requests
import json
import os
from pathlib import Path

# API base URL
API_BASE = 'http://localhost:5000'

def test_health_check():
    """Test the health check endpoint"""
    print("Testing health check...")
    try:
        response = requests.get(f'{API_BASE}/api/health')
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_pdf_upload():
    """Test PDF upload endpoint"""
    print("\nTesting PDF upload...")
    
    # Create a simple test PDF (you would need a real PDF file for this)
    test_file_path = 'test.pdf'
    
    if not os.path.exists(test_file_path):
        print("No test PDF file found. Skipping PDF upload test.")
        return True
    
    try:
        with open(test_file_path, 'rb') as f:
            files = {'file': f}
            response = requests.post(f'{API_BASE}/api/pdf/upload', files=files)
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_resume_analysis():
    """Test resume analysis endpoint"""
    print("\nTesting resume analysis...")
    
    # Create test resume data
    test_resume_data = {
        'title': 'Test Resume',
        'name': 'John Doe',
        'email': 'john.doe@example.com',
        'phone': '+1 (555) 123-4567',
        'location': 'New York, NY',
        'summary': 'Experienced software engineer with 5 years of experience in web development.',
        'experience': [
            {
                'title': 'Software Engineer',
                'company': 'Tech Corp',
                'location': 'New York, NY',
                'start_date': '2020-01',
                'end_date': '2023-12',
                'description': 'Developed web applications using React and Node.js',
                'current': False
            }
        ],
        'education': [
            {
                'degree': 'Bachelor of Science in Computer Science',
                'institution': 'University of Technology',
                'location': 'Boston, MA',
                'start_date': '2016-09',
                'end_date': '2020-05',
                'gpa': '3.8'
            }
        ],
        'skills': [
            {'name': 'JavaScript', 'level': 'advanced'},
            {'name': 'React', 'level': 'advanced'},
            {'name': 'Node.js', 'level': 'intermediate'},
            {'name': 'Python', 'level': 'intermediate'}
        ]
    }
    
    try:
        response = requests.post(
            f'{API_BASE}/api/resume/suggestions',
            json={
                'resume_data': test_resume_data,
                'job_description': 'Looking for a senior software engineer with React experience.'
            }
        )
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_file_validation():
    """Test file validation endpoint"""
    print("\nTesting file validation...")
    
    # Create a test text file
    test_file_path = 'test.txt'
    with open(test_file_path, 'w') as f:
        f.write("This is a test file for validation.")
    
    try:
        with open(test_file_path, 'rb') as f:
            files = {'file': f}
            response = requests.post(f'{API_BASE}/api/file/validate', files=files)
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        # Clean up test file
        os.remove(test_file_path)
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def main():
    """Run all tests"""
    print("PDF Editor API Test Suite")
    print("=" * 50)
    
    tests = [
        test_health_check,
        test_resume_analysis,
        test_file_validation,
        test_pdf_upload
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
        print("-" * 30)
    
    print(f"\nTest Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("All tests passed! ✅")
    else:
        print("Some tests failed. ❌")

if __name__ == '__main__':
    main()
